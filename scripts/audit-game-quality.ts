import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { mockGames, type MockGame } from '@/lib/mock-games';
import {
  CORE_INDEXABLE_GAME_SLUGS,
  getGameQualityTier,
  getManualReviewReason,
  isGameUnderManualReview,
  shouldNoIndexGame,
} from '@/lib/games/quality-policy';

const GENERATED_AT = new Date().toISOString();

function markdownEscape(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function sourceHost(game: MockGame) {
  const source = game.sourceUrl || game.iframeUrl;
  try {
    return new URL(source).hostname;
  } catch {
    return 'unknown';
  }
}

function hasLocalScreenshot(game: MockGame) {
  return game.thumbnailUrl.startsWith('/game-screenshots/');
}

function scoreGame(game: MockGame) {
  let score = 0;
  const reasons: string[] = [];
  const host = sourceHost(game);
  const enWords = wordCount(game.descriptionEn);
  const zhChars = game.description.length;

  if (game.sourceUrl && game.developerName && game.developerUrl) {
    score += host.includes('4399') ? 13 : 18;
  } else {
    score += 5;
    reasons.push('source metadata incomplete');
  }

  if (game.iframeUrl) {
    score += 13;
  } else {
    reasons.push('missing iframe URL');
  }

  if (game.categories.length > 0 && game.tags.length > 0) {
    score += 8;
  }

  if (enWords >= 35 && zhChars >= 90) {
    score += 18;
  } else if (enWords >= 18 && zhChars >= 60) {
    score += 12;
  } else {
    score += 5;
    reasons.push(`thin description (${enWords} en words / ${zhChars} zh chars)`);
  }

  if (hasLocalScreenshot(game)) {
    score += 8;
  } else {
    score += 2;
    reasons.push('placeholder thumbnail');
  }

  if (isGameUnderManualReview(game.slug)) {
    reasons.push(getManualReviewReason(game.slug) ?? 'manual review');
  } else {
    score += 18;
  }

  if (CORE_INDEXABLE_GAME_SLUGS.includes(game.slug as (typeof CORE_INDEXABLE_GAME_SLUGS)[number])) {
    score += 15;
  } else if (game.featured || game.isHot || game.isNew) {
    score += 5;
  } else {
    score += 2;
  }

  return { score: Math.min(score, 100), reasons };
}

function actionFor(game: MockGame) {
  const tier = getGameQualityTier(game.slug);
  if (tier === 'review') {
    return 'Noindex; remove from sitemap/recommendations; manual source and content review';
  }
  if (tier === 'core-indexed') {
    return 'Keep indexed; prioritize content thickening if player/search data appears';
  }
  return 'Catalogue-only; keep playable but noindex until content/source QA is complete';
}

function buildReport() {
  const rows = mockGames.map((game) => {
    const audit = scoreGame(game);
    return {
      game,
      tier: getGameQualityTier(game.slug),
      noindex: shouldNoIndexGame(game.slug),
      host: sourceHost(game),
      score: audit.score,
      action: actionFor(game),
      reasons: audit.reasons,
    };
  });

  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.tier] = (acc[row.tier] ?? 0) + 1;
    return acc;
  }, {});

  const hostCounts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.host] = (acc[row.host] ?? 0) + 1;
    return acc;
  }, {});

  const lines = [
    '# Luma Game Quality Audit',
    '',
    `Generated: ${GENERATED_AT}`,
    '',
    'This is a directional quality and indexing audit for Luma Game Hub. It is not a legal clearance report. Any game with source, IP, iframe, mobile, or content uncertainty still needs manual QA before being treated as AdSense-review-ready.',
    '',
    '## Summary',
    '',
    `- Total fallback catalogue games: ${rows.length}`,
    `- Core indexed games: ${counts['core-indexed'] ?? 0}`,
    `- Catalogue-only games: ${counts['catalogue-only'] ?? 0}`,
    `- Manual review games: ${counts.review ?? 0}`,
    `- Noindex game pages under current policy: ${rows.filter((row) => row.noindex).length}`,
    `- Dominant source hosts: ${Object.entries(hostCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([host, count]) => `${host} (${count})`).join(', ')}`,
    '',
    '## Policy Actions',
    '',
    '- `core-indexed`: included in sitemap and eligible for collection/recommendation surfaces.',
    '- `catalogue-only`: playable if directly opened or browsed, but kept out of core index until content/source QA is complete.',
    '- `review`: noindex, excluded from sitemap, excluded from fallback search/recommendation surfaces, and queued for source/content review.',
    '',
    '## Full Game Table',
    '',
    '| # | Slug | Title | Tier | Score | Source host | Action | Notes |',
    '| ---: | --- | --- | --- | ---: | --- | --- | --- |',
    ...rows.map((row, index) => [
      index + 1,
      markdownEscape(row.game.slug),
      markdownEscape(row.game.titleEn || row.game.title),
      row.tier,
      row.score,
      markdownEscape(row.host),
      markdownEscape(row.action),
      markdownEscape(row.reasons.join('; ') || 'No immediate static-audit flags'),
    ].join(' | ')).map((line) => `| ${line} |`),
    '',
    '## Next Review Batch',
    '',
    ...rows
      .filter((row) => row.tier === 'review')
      .map((row) => `- ${row.game.slug}: ${getManualReviewReason(row.game.slug) ?? 'Manual review required'}`),
    '',
  ];

  return `${lines.join('\n')}\n`;
}

const report = buildReport();
const writeFlagIndex = process.argv.indexOf('--write');

if (writeFlagIndex >= 0) {
  const target = process.argv[writeFlagIndex + 1] ?? 'docs/game-quality-audit.md';
  const targetPath = path.resolve(process.cwd(), target);
  writeFileSync(targetPath, report, 'utf8');
  console.log(`Wrote ${targetPath}`);
} else {
  console.log(report);
}
