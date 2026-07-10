import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import { shouldPromoteGameInCollections } from '@/lib/games/quality-policy';

const MIN_INTERNAL_LINKS_PER_PAGE = 2;
const MIN_INTERNAL_LINKS_PER_GUIDE = 2;
const NON_RENDERED_REDIRECT_PAGES = new Set(['app/page.tsx']);

function walkPages(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) return walkPages(fullPath);
    return entry === 'page.tsx' ? [fullPath] : [];
  });
}

function countInternalNavigation(source: string): number {
  const linkComponents = source.match(/<Link\b/g)?.length ?? 0;
  const internalAnchors =
    source.match(/<a\b[^>]*href=(?:["'`]\/|\{getLocalizedPath\(|\{["'`]\/)/g)?.length ?? 0;
  const internalRedirects =
    source.match(/(?:redirect|permanentRedirect)\(\s*(?:[`'"]\/|getLocalizedPath\()/g)?.length ?? 0;
  const internalRouterPushes =
    source.match(/router\.(?:push|replace)\(\s*(?:[`'"]\/|getLocalizedPath\()/g)?.length ?? 0;

  return linkComponents + internalAnchors + internalRedirects + internalRouterPushes;
}

const localeShellNavigationCount = countInternalNavigation(
  [
    readFileSync(path.join(process.cwd(), 'components/layout/Header.tsx'), 'utf8'),
    readFileSync(path.join(process.cwd(), 'components/layout/Footer.tsx'), 'utf8'),
  ].join('\n'),
);

function inheritedNavigationCredit(relativePath: string): number {
  if (relativePath.startsWith(`app${path.sep}[locale]${path.sep}`)) {
    return localeShellNavigationCount > 0 ? 1 : 0;
  }

  return 0;
}

const errors: string[] = [];
const guides = getSeoLandingPages();
const guideSlugs = new Set(guides.map((guide) => guide.slug));
const gameSlugs = new Set(mockGames.map((game) => game.slug));
const pageFiles = walkPages(path.join(process.cwd(), 'app'));

for (const guide of guides) {
  const internalLinkCount =
    guide.relatedSlugs.length +
    Object.values(guide.locales).reduce((total, locale) => total + locale.recommendations.length, 0) +
    (guide.embedGame?.playSlug ? 1 : 0);

  if (internalLinkCount < MIN_INTERNAL_LINKS_PER_GUIDE) {
    errors.push(
      `Guide ${guide.slug} has ${internalLinkCount} internal link(s); at least ${MIN_INTERNAL_LINKS_PER_GUIDE} are required.`,
    );
  }

  for (const relatedSlug of guide.relatedSlugs) {
    if (!guideSlugs.has(relatedSlug)) {
      errors.push(`Guide ${guide.slug} links to missing guide ${relatedSlug}.`);
    }
  }

  for (const [locale, content] of Object.entries(guide.locales)) {
    for (const recommendation of content.recommendations) {
      if (!gameSlugs.has(recommendation.slug)) {
        errors.push(
          `Guide ${guide.slug} (${locale}) links to missing game ${recommendation.slug}.`,
        );
      } else if (!shouldPromoteGameInCollections(recommendation.slug)) {
        errors.push(
          `Guide ${guide.slug} (${locale}) recommends non-indexable game ${recommendation.slug}.`,
        );
      }
    }
  }

  if (guide.embedGame?.playSlug) {
    if (!gameSlugs.has(guide.embedGame.playSlug)) {
      errors.push(`Guide ${guide.slug} embeds a missing game slug ${guide.embedGame.playSlug}.`);
    } else if (!shouldPromoteGameInCollections(guide.embedGame.playSlug)) {
      errors.push(`Guide ${guide.slug} embeds non-indexable game ${guide.embedGame.playSlug}.`);
    }
  }
}

for (const pageFile of pageFiles) {
  const source = readFileSync(pageFile, 'utf8');
  const relativePath = path.relative(process.cwd(), pageFile);

  if (NON_RENDERED_REDIRECT_PAGES.has(relativePath)) {
    continue;
  }

  const explicitNavigationCount = countInternalNavigation(source);
  const inheritedCount = inheritedNavigationCredit(relativePath);
  const renderedNavigationCount = explicitNavigationCount + inheritedCount;

  if (renderedNavigationCount < MIN_INTERNAL_LINKS_PER_PAGE) {
    errors.push(
      `${relativePath} renders ${renderedNavigationCount} internal link(s) (${explicitNavigationCount} explicit + ${inheritedCount} inherited); at least ${MIN_INTERNAL_LINKS_PER_PAGE} are required.`,
    );
  }
}

if (errors.length > 0) {
  console.error(`Internal link audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Internal link audit passed: ${guides.length} guides require at least ${MIN_INTERNAL_LINKS_PER_GUIDE} links, ${gameSlugs.size} game slugs validated, and ${pageFiles.length - NON_RENDERED_REDIRECT_PAGES.size} rendered page files require at least ${MIN_INTERNAL_LINKS_PER_PAGE} links including inherited layout navigation.`,
);
