import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import { shouldPromoteGameInCollections } from '@/lib/games/quality-policy';

function walkPages(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) return walkPages(fullPath);
    return entry === 'page.tsx' ? [fullPath] : [];
  });
}

const errors: string[] = [];
const guides = getSeoLandingPages();
const guideSlugs = new Set(guides.map((guide) => guide.slug));
const gameSlugs = new Set(mockGames.map((game) => game.slug));

for (const guide of guides) {
  const internalLinkCount =
    guide.relatedSlugs.length +
    Object.values(guide.locales).reduce((total, locale) => total + locale.recommendations.length, 0) +
    (guide.embedGame?.playSlug ? 1 : 0);

  if (internalLinkCount === 0) {
    errors.push(`Guide ${guide.slug} has no internal links.`);
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

for (const pageFile of walkPages(path.join(process.cwd(), 'app'))) {
  const source = readFileSync(pageFile, 'utf8');
  const relativePath = path.relative(process.cwd(), pageFile);
  const hasInternalNavigation =
    /<Link\b/.test(source) ||
    /redirect\(\s*[`'"]\//.test(source) ||
    /router\.push\(\s*[`'"]\//.test(source);

  if (!hasInternalNavigation) {
    errors.push(`${relativePath} has no explicit internal link or internal redirect.`);
  }
}

if (errors.length > 0) {
  console.error(`Internal link audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Internal link audit passed: ${guides.length} guides, ${gameSlugs.size} game slugs, and ${walkPages(path.join(process.cwd(), 'app')).length} page files checked.`,
);
