import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import {
  canRenderGameIframe,
  shouldPromoteGameInCollections,
} from '@/lib/games/quality-policy';

const MIN_INTERNAL_LINKS_PER_PAGE = 2;
const MIN_INTERNAL_LINKS_PER_GUIDE = 2;

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

function guideTemplateNavigationCredit() {
  const pageSource = readFileSync(
    path.join(process.cwd(), 'app/[locale]/guides/[slug]/page.tsx'),
    'utf8',
  );
  const layoutSource = readFileSync(
    path.join(process.cwd(), 'app/[locale]/guides/[slug]/layout.tsx'),
    'utf8',
  );

  let count = 0;
  if (pageSource.includes("getLocalizedPath(locale, '/guides')")) count += 1;
  if (layoutSource.includes("getLocalizedPath(locale, '/games')")) count += 1;
  return count;
}

export function collectGuideInternalLinkErrors(
  guides = getSeoLandingPages(),
  games = mockGames,
): string[] {
  const errors: string[] = [];
  const guideSlugs = new Set(guides.map((guide) => guide.slug));
  const gameSlugs = new Set(games.map((game) => game.slug));
  const gamesBySlug = new Map(games.map((game) => [game.slug, game]));
  const templateNavigationCount = guideTemplateNavigationCredit();

  for (const guide of guides) {
    let renderedRecommendationCount = 0;

    for (const relatedSlug of guide.relatedSlugs) {
      if (!guideSlugs.has(relatedSlug)) {
        errors.push(`Guide ${guide.slug} links to missing guide ${relatedSlug}.`);
      }
    }

    for (const [locale, content] of Object.entries(guide.locales)) {
      for (const recommendation of content.recommendations) {
        const game = gamesBySlug.get(recommendation.slug);
        if (!gameSlugs.has(recommendation.slug) || !game) {
          errors.push(
            `Guide ${guide.slug} (${locale}) links to missing game ${recommendation.slug}.`,
          );
          continue;
        }

        // The guide template only emits recommendation links that pass the same
        // public collection policy. Rights-withheld registry entries are editorial
        // source data, not rendered internal navigation.
        if (shouldPromoteGameInCollections(game)) {
          renderedRecommendationCount += 1;
        }
      }
    }

    let renderedEmbedCount = 0;
    if (guide.embedGame?.playSlug) {
      const embeddedGame = gamesBySlug.get(guide.embedGame.playSlug);
      if (!gameSlugs.has(guide.embedGame.playSlug) || !embeddedGame) {
        errors.push(
          `Guide ${guide.slug} embeds a missing game slug ${guide.embedGame.playSlug}.`,
        );
      } else if (canRenderGameIframe(embeddedGame)) {
        // A declared embed only counts as navigation/play inventory when the
        // actual guide page is allowed to render it.
        renderedEmbedCount = 1;
      }
    }

    const internalLinkCount =
      templateNavigationCount +
      guide.relatedSlugs.length +
      renderedRecommendationCount +
      renderedEmbedCount;

    if (internalLinkCount < MIN_INTERNAL_LINKS_PER_GUIDE) {
      errors.push(
        `Guide ${guide.slug} has ${internalLinkCount} rendered internal link(s); at least ${MIN_INTERNAL_LINKS_PER_GUIDE} are required.`,
      );
    }
  }

  return errors;
}

export function runInternalLinkAudit() {
  const errors = collectGuideInternalLinkErrors();
  const guides = getSeoLandingPages();
  const gameSlugs = new Set(mockGames.map((game) => game.slug));
  const pageFiles = walkPages(path.join(process.cwd(), 'app'));

  for (const pageFile of pageFiles) {
    const source = readFileSync(pageFile, 'utf8');
    const relativePath = path.relative(process.cwd(), pageFile);

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
    return 1;
  }

  console.log(
    `Internal link audit passed: ${guides.length} guides require at least ${MIN_INTERNAL_LINKS_PER_GUIDE} rendered links, ${gameSlugs.size} game slugs validated, and ${pageFiles.length} rendered page files require at least ${MIN_INTERNAL_LINKS_PER_PAGE} links including inherited layout navigation.`,
  );
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runInternalLinkAudit();
}
