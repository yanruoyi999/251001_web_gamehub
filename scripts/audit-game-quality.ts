import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { mockGames, type MockGame } from '@/lib/mock-games';
import { getGameEditorialContent } from '@/lib/games/editorial-content';
import {
  CORE_INDEXABLE_GAME_SLUGS,
  getGameRedirectTarget,
  getGameQualityTier,
  getManualReviewReason,
  getRetiredCatalogueRedirectTarget,
  isGameUnderManualReview,
  shouldNoIndexGame,
} from '@/lib/games/quality-policy';

type EditorialCoverageStatus = 'complete' | 'partial' | 'missing';
type AuditDecision = 'keep' | 'improve' | 'merge' | 'review' | 'remove';

export interface EditorialCoverage {
  status: EditorialCoverageStatus;
  enWords: number;
  zhChars: number;
}

export interface GameAuditRow {
  game: MockGame;
  tier: ReturnType<typeof getGameQualityTier>;
  noindex: boolean;
  sourceHost: string;
  embedHost: string;
  score: number;
  action: string;
  reasons: string[];
  editorialCoverage: EditorialCoverage;
}

export interface GameDecisionRow {
  slug: string;
  title: string;
  tier: GameAuditRow['tier'];
  decision: AuditDecision;
  reason: string;
  nextStep: string;
}

function markdownEscape(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function hostFromUrl(value: string | null | undefined) {
  if (!value) return 'unknown';
  try {
    return new URL(value).hostname;
  } catch {
    return 'unknown';
  }
}

function sourceHost(game: MockGame) {
  return game.sourceHost || hostFromUrl(game.sourcePageUrl || game.sourceUrl);
}

function embedHost(game: MockGame) {
  return game.embedHost || hostFromUrl(game.iframeUrl);
}

function hasLocalScreenshot(game: MockGame) {
  return game.thumbnailUrl.startsWith('/game-screenshots/');
}

function editorialText(slug: string, locale: 'en' | 'zh') {
  const content = getGameEditorialContent(slug, locale);
  if (!content) return '';

  return [
    content.metaTitle,
    content.metaDescription,
    content.title,
    content.summary,
    ...content.overview,
    ...content.howToPlay,
    ...content.controls.flatMap((control) => [control.label, control.value]),
    ...content.tips,
    ...content.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ...content.relatedGuides.flatMap((guide) => [guide.title, guide.description]),
  ].join(' ');
}

export function getEditorialCoverage(slug: string): EditorialCoverage {
  const en = getGameEditorialContent(slug, 'en');
  const zh = getGameEditorialContent(slug, 'zh');

  if (!en && !zh) {
    return { status: 'missing', enWords: 0, zhChars: 0 };
  }

  const enWords = wordCount(editorialText(slug, 'en'));
  const zhChars = editorialText(slug, 'zh').length;
  const hasCompleteSections = Boolean(
    en &&
      zh &&
      en.overview.length >= 2 &&
      zh.overview.length >= 2 &&
      en.howToPlay.length >= 3 &&
      zh.howToPlay.length >= 3 &&
      en.controls.length >= 2 &&
      zh.controls.length >= 2 &&
      en.tips.length >= 3 &&
      zh.tips.length >= 3 &&
      en.faqs.length >= 2 &&
      zh.faqs.length >= 2,
  );

  if (hasCompleteSections && enWords >= 120 && zhChars >= 220) {
    return { status: 'complete', enWords, zhChars };
  }

  return { status: 'partial', enWords, zhChars };
}

export function scoreGame(game: MockGame) {
  let score = 0;
  const reasons: string[] = [];
  const host = embedHost(game);
  const enWords = wordCount(game.descriptionEn);
  const zhChars = game.description.length;
  const editorialCoverage = getEditorialCoverage(game.slug);

  if (game.sourcePageUrl && game.sourceHost && game.embedHost) {
    score += game.developerVerified ? 18 : 13;
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

  if (editorialCoverage.status === 'complete') {
    score += 24;
  } else if (editorialCoverage.status === 'partial') {
    score += 14;
    reasons.push(
      `partial editorial coverage (${editorialCoverage.enWords} en words / ${editorialCoverage.zhChars} zh chars)`,
    );
  } else if (enWords >= 35 && zhChars >= 90) {
    score += 10;
    reasons.push('description-only content; add full editorial sections');
  } else if (enWords >= 18 && zhChars >= 60) {
    score += 7;
    reasons.push('short description-only content; add full editorial sections');
  } else {
    score += 3;
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

  return { score: Math.min(score, 100), reasons, editorialCoverage };
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

export function buildAuditRows(games = mockGames): GameAuditRow[] {
  return games.map((game) => {
    const audit = scoreGame(game);
    return {
      game,
      tier: getGameQualityTier(game.slug),
      noindex: shouldNoIndexGame(game.slug),
      sourceHost: sourceHost(game),
      embedHost: embedHost(game),
      score: audit.score,
      action: actionFor(game),
      reasons: audit.reasons,
      editorialCoverage: audit.editorialCoverage,
    };
  });
}

function isRemoveCandidate(row: GameAuditRow) {
  const reason = getManualReviewReason(row.game.slug) ?? '';
  return /known franchise|Mario-like|trademark confusion/i.test(reason);
}

export function buildDecisionRows(rows: GameAuditRow[]): GameDecisionRow[] {
  return rows.map((row) => {
    const redirectTarget = getGameRedirectTarget(row.game.slug);

    if (row.tier === 'review') {
      if (isRemoveCandidate(row)) {
        return {
          slug: row.game.slug,
          title: row.game.titleEn || row.game.title,
          tier: row.tier,
          decision: 'remove',
          reason: getManualReviewReason(row.game.slug) ?? 'Manual review risk',
          nextStep: 'Keep out of the index surface and route public detail requests to a safer related core page.',
        };
      }

      return {
        slug: row.game.slug,
        title: row.game.titleEn || row.game.title,
        tier: row.tier,
        decision: 'review',
        reason: getManualReviewReason(row.game.slug) ?? 'Manual source/content review required',
        nextStep: 'Keep noindex and withhold iframe until source, IP, theme, and AdSense suitability are reviewed.',
      };
    }

    if (row.tier === 'catalogue-only' && getRetiredCatalogueRedirectTarget(row.game.slug)) {
      return {
        slug: row.game.slug,
        title: row.game.titleEn || row.game.title,
        tier: row.tier,
        decision: 'merge',
        reason: `Low-value catalogue-only page merged into /games/${redirectTarget}.`,
        nextStep: 'Keep out of sitemap/search and redirect direct detail requests to the stronger related core page.',
      };
    }

    if (row.tier === 'core-indexed' && row.editorialCoverage.status === 'complete' && row.score >= 80) {
      return {
        slug: row.game.slug,
        title: row.game.titleEn || row.game.title,
        tier: row.tier,
        decision: 'keep',
        reason: 'Core-indexed page has complete editorial coverage under current static audit.',
        nextStep: 'Keep indexed; improve only when GSC/Clarity shows a concrete query or UX opportunity.',
      };
    }

    return {
      slug: row.game.slug,
      title: row.game.titleEn || row.game.title,
      tier: row.tier,
      decision: 'improve',
      reason:
        row.editorialCoverage.status === 'missing'
          ? 'No complete editorial content found.'
          : row.reasons.join('; ') || 'Needs source/content QA before stronger surfacing.',
      nextStep:
        row.tier === 'catalogue-only'
          ? 'Keep out of sitemap/search until source and original content are strong enough, or merge/remove if low demand.'
          : 'Add complete overview, how-to-play, controls, tips, FAQ, related links, and source notes.',
    };
  });
}

export function buildReport(generatedAt = new Date().toISOString()) {
  const rows = buildAuditRows();
  const decisions = buildDecisionRows(rows);

  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.tier] = (acc[row.tier] ?? 0) + 1;
    return acc;
  }, {});

  const hostCounts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.embedHost] = (acc[row.embedHost] ?? 0) + 1;
    return acc;
  }, {});

  const lines = [
    '# Luma Game Quality Audit',
    '',
    `Generated: ${generatedAt}`,
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
    '- `merge`: a low-value catalogue-only direct URL is retired into a stronger related core page.',
    '- `review`: noindex, excluded from sitemap, excluded from fallback search/recommendation surfaces, and queued for source/content review.',
    '',
    '## Per-Slug Decision Table',
    '',
    '| Slug | Title | Tier | Decision | Reason | Next step |',
    '| --- | --- | --- | --- | --- | --- |',
    ...decisions.map((row) => `| ${[
      markdownEscape(row.slug),
      markdownEscape(row.title),
      row.tier,
      row.decision,
      markdownEscape(row.reason),
      markdownEscape(row.nextStep),
    ].join(' | ')} |`),
    '',
    '## Full Game Table',
    '',
    '| # | Slug | Title | Tier | Score | Source host | Embed host | Editorial | Action | Notes |',
    '| ---: | --- | --- | --- | ---: | --- | --- | --- | --- | --- |',
    ...rows.map((row, index) => [
      index + 1,
      markdownEscape(row.game.slug),
      markdownEscape(row.game.titleEn || row.game.title),
      row.tier,
      row.score,
      markdownEscape(row.sourceHost),
      markdownEscape(row.embedHost),
      row.editorialCoverage.status,
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

function runCli() {
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
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli();
}
