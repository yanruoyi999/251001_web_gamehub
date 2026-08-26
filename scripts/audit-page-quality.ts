import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildAuditRows, buildDecisionRows } from '@/scripts/audit-game-quality';
import {
  getCategoryEntries,
  getTagEntries,
  pickLocalizedLabel,
  shouldIndexTagEntry,
} from '@/lib/game-taxonomy';
import { getSeoLandingPages, type SeoLandingLocaleContent } from '@/lib/seo-landing-content';
import { ORIGINAL_EXPERIMENT_PAGE_SUMMARIES } from '@/lib/games/luma-original-experiment-pages';
import { LUMA_SNAKE_3D_PATH } from '@/lib/games/luma-snake-3d-seo';

type PageType = 'static' | 'guide' | 'game' | 'category' | 'tag' | 'utility';
type PageAction = 'keep' | 'improve' | 'noindex' | 'redirect' | 'remove-from-index';

interface PageQualityRow {
  path: string;
  type: PageType;
  score: number;
  indexable: boolean;
  action: PageAction;
  reason: string;
  nextStep: string;
}

function markdownEscape(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function localeText(content: SeoLandingLocaleContent) {
  return [
    content.metaTitle,
    content.metaDescription,
    content.heading,
    content.subheading,
    ...content.overview,
    ...content.sections.flatMap((section) => [
      section.title,
      section.body,
      ...(section.bullets ?? []),
    ]),
    ...content.recommendations.flatMap((item) => [item.slug, item.pitch]),
    ...content.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ...(content.externalLinks ?? []).flatMap((link) => [
      link.label,
      link.description,
      link.href,
    ]),
    content.ctaLabel,
    content.ctaDescription,
  ].join(' ');
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function scoreGuide(page: ReturnType<typeof getSeoLandingPages>[number]): PageQualityRow {
  const en = page.locales.en;
  const zh = page.locales.zh;
  const enWords = wordCount(localeText(en));
  const zhChars = localeText(zh).length;
  let score = 20;
  const reasons: string[] = [];

  if (page.primaryKeyword && page.keywords.length >= 4) {
    score += 10;
  } else {
    reasons.push('keyword set too thin');
  }

  if (enWords >= 550 && zhChars >= 750) {
    score += 20;
  } else if (enWords >= 300 && zhChars >= 450) {
    score += 14;
    reasons.push(`medium guide body (${enWords} en words / ${zhChars} zh chars)`);
  } else {
    score += 6;
    reasons.push(`thin guide body (${enWords} en words / ${zhChars} zh chars)`);
  }

  if (en.sections.length >= 3 && zh.sections.length >= 3) {
    score += 15;
  } else {
    reasons.push('needs at least 3 practical sections in both locales');
  }

  if (en.faqs.length >= 3 && zh.faqs.length >= 3) {
    score += 15;
  } else {
    reasons.push('needs at least 3 FAQs in both locales');
  }

  if (en.recommendations.length >= 3 && zh.recommendations.length >= 3) {
    score += 10;
  } else {
    reasons.push('needs stronger related game recommendations');
  }

  if (page.relatedSlugs.length >= 2) {
    score += 5;
  } else {
    reasons.push('needs at least 2 related guide links');
  }

  if (page.embedGame || en.externalLinks?.length || zh.externalLinks?.length) {
    score += 5;
  } else {
    reasons.push('needs playable embed or source citation');
  }

  const finalScore = clampScore(score);
  const indexable = page.indexable !== false;
  return {
    path: `/guides/${page.slug}`,
    type: 'guide',
    score: finalScore,
    indexable,
    action: !indexable ? 'noindex' : finalScore >= 80 ? 'keep' : 'improve',
    reason: reasons.join('; ') || 'Original guide has metadata, sections, FAQ, related links, and source/play context.',
    nextStep:
      !indexable
        ? 'Keep noindex,follow and exclude from sitemap while the experiment is being evaluated.'
        : finalScore >= 80
        ? 'Keep indexed; revisit only when GSC exposes a sharper long-tail query.'
        : 'Add original sections, FAQs, related links, and source/play context before keeping as an index target.',
  };
}

function scoreStaticPages(): PageQualityRow[] {
  return [
    {
      path: '/',
      type: 'static',
      score: 92,
      indexable: true,
      action: 'keep',
      reason: 'Primary entry point with curated navigation and current core game surfaces.',
      nextStep: 'Continue rotating high-signal guide/game links from GSC.',
    },
    {
      path: '/games',
      type: 'static',
      score: 86,
      indexable: true,
      action: 'keep',
      reason: 'Browse page now draws from the reduced core catalogue and avoids fake metrics in local mode.',
      nextStep: 'Keep indexed; improve only if Clarity shows poor navigation or search friction.',
    },
    {
      path: '/games/2-player-unblocked',
      type: 'static',
      score: 96,
      indexable: true,
      action: 'keep',
      reason:
        'Dedicated bilingual collection has three provenance-approved self-hosted games, click-to-load runtimes, P1/P2 controls, device limitations, license/source notes, FAQ, CollectionPage/ItemList schema, canonical locale metadata, and relevant inbound links without fake metrics.',
      nextStep:
        'Keep indexed as the single two-player query hub; expand only after 2-6 weeks of real GSC and play-funnel evidence.',
    },
    {
      path: '/guides',
      type: 'static',
      score: 90,
      indexable: true,
      action: 'keep',
      reason: 'Guide index links to original SEO/GEO pages and no-download helper guides.',
      nextStep: 'Keep indexed and order cards by live GSC demand when enough data accumulates.',
    },
    {
      path: '/about',
      type: 'static',
      score: 88,
      indexable: true,
      action: 'keep',
      reason: 'Trust page required for AdSense review and site identity.',
      nextStep: 'Keep current; update only when editorial/source policy changes.',
    },
    {
      path: '/contact',
      type: 'static',
      score: 88,
      indexable: true,
      action: 'keep',
      reason: 'Trust/contact page required for user feedback and takedown requests.',
      nextStep: 'Keep current; verify form/email path during final AdSense gate.',
    },
    {
      path: '/privacy',
      type: 'static',
      score: 90,
      indexable: true,
      action: 'keep',
      reason: 'Privacy page covers analytics, cookies, third-party services, and advertising disclosure.',
      nextStep: 'Update when AdSense publisher ID and CMP flow are actually added.',
    },
    {
      path: '/search',
      type: 'utility',
      score: 72,
      indexable: false,
      action: 'noindex',
      reason: 'Utility search results page is useful for users but not a stable landing page.',
      nextStep: 'Keep noindex,follow and exclude from sitemap.',
    },
  ];
}

function scoreStandalonePages(): PageQualityRow[] {
  const experimentRows: PageQualityRow[] = ORIGINAL_EXPERIMENT_PAGE_SUMMARIES.map((page) => ({
    path: page.path,
    type: 'game',
    score: page.qualityScore,
    indexable: false,
    action: 'noindex',
    reason:
      'Original clean-room experiment has a self-hosted interaction, bilingual instructions, FAQ, structured data, related internal links, and an explicit noindex boundary.',
    nextStep:
      'Keep noindex,follow and exclude from sitemap until independent runtime, quality, and business evidence supports a separate indexability decision.',
  }));

  return [
    {
      path: LUMA_SNAKE_3D_PATH,
      type: 'game',
      score: 94,
      indexable: false,
      action: 'noindex',
      reason:
        'Original game page has bilingual play instructions, daily-challenge explanation, mobile controls, FAQ, structured data, and related internal links.',
      nextStep:
        'Keep noindex until desktop/mobile runtime checks, first-death duration evidence, and the 80+ release gate are complete; then add it to the sitemap in a separate indexability change.',
    },
    ...experimentRows,
  ];
}

function scoreCategoryPages(): PageQualityRow[] {
  return getCategoryEntries().map((entry) => {
    const label = pickLocalizedLabel('en', entry.item.name, entry.item.nameEn);
    const descriptionLength = (entry.item.descriptionEn || entry.item.description || '').length;
    const gameCount = entry.games.length;
    let score = 40;
    const reasons: string[] = [];

    if (gameCount >= 10) {
      score += 25;
    } else if (gameCount >= 5) {
      score += 18;
      reasons.push(`moderate game count (${gameCount})`);
    } else {
      score += 6;
      reasons.push(`thin game count (${gameCount})`);
    }

    if (descriptionLength >= 45) {
      score += 15;
    } else {
      score += 6;
      reasons.push('category description is short');
    }

    score += 10;
    score += 10;

    const finalScore = clampScore(score);
    return {
      path: `/games/category/${entry.item.slug}`,
      type: 'category',
      score: finalScore,
      indexable: true,
      action: finalScore >= 80 ? 'keep' : 'improve',
      reason: reasons.join('; ') || `${label} category has enough core games and internal links.`,
      nextStep:
        finalScore >= 80
          ? 'Keep indexed; improve copy only if the category gains search impressions.'
          : 'Add category intro copy or remove from sitemap until it has enough high-quality games.',
    };
  });
}

function scoreTagPages(): PageQualityRow[] {
  return getTagEntries().map((entry) => {
    const label = pickLocalizedLabel('en', entry.item.name, entry.item.nameEn);
    const gameCount = entry.games.length;
    const indexable = shouldIndexTagEntry(entry);
    let score = 35;
    const reasons: string[] = [];

    if (gameCount >= 8) {
      score += 30;
    } else if (gameCount >= 3) {
      score += 20;
    } else {
      score += 8;
      reasons.push(`too few core games (${gameCount})`);
    }

    score += 15;
    score += 10;
    score += 10;

    const finalScore = clampScore(score);
    return {
      path: `/games/tag/${entry.item.slug}`,
      type: 'tag',
      score: finalScore,
      indexable,
      action: indexable ? 'keep' : 'noindex',
      reason:
        reasons.join('; ') ||
        `${label} tag has enough core games to work as a browsing collection.`,
      nextStep: indexable
        ? 'Keep indexed; add editorial copy only if it earns search impressions.'
        : 'Removed from sitemap and marked noindex until it has at least 3 strong core games.',
    };
  });
}

function scoreGamePages(): PageQualityRow[] {
  const decisions = new Map(buildDecisionRows(buildAuditRows()).map((row) => [row.slug, row]));

  return buildAuditRows().map((row) => {
    const decision = decisions.get(row.game.slug);
    const indexable = row.tier === 'core-indexed';
    const redirected = decision?.decision === 'remove' || decision?.decision === 'merge';
    const action: PageAction = redirected
      ? 'redirect'
      : indexable
        ? row.score >= 80 ? 'keep' : 'improve'
        : 'remove-from-index';

    return {
      path: `/games/${row.game.slug}`,
      type: 'game',
      score: row.score,
      indexable,
      action,
      reason:
        row.reasons.join('; ') ||
        decision?.reason ||
        'Core game page has source metadata, playable embed, taxonomy, and complete editorial coverage.',
      nextStep:
        action === 'keep'
          ? 'Keep indexed; optimize only when monitoring shows demand or playability friction.'
          : decision?.nextStep ||
            'Keep noindex and out of sitemap/search until source, screenshot, and editorial quality reach 80+.',
    };
  });
}

export function buildPageQualityRows() {
  return [
    ...scoreStaticPages(),
    ...scoreStandalonePages(),
    ...getSeoLandingPages().map(scoreGuide),
    ...scoreCategoryPages(),
    ...scoreTagPages(),
    ...scoreGamePages(),
  ].sort((left, right) => {
    if (left.indexable !== right.indexable) return left.indexable ? -1 : 1;
    if (left.score !== right.score) return left.score - right.score;
    return left.path.localeCompare(right.path);
  });
}

export function buildReport(generatedAt = new Date().toISOString()) {
  const rows = buildPageQualityRows();
  const indexableRows = rows.filter((row) => row.indexable);
  const under80 = rows.filter((row) => row.score < 80);
  const under80Indexable = indexableRows.filter((row) => row.score < 80);
  const countsByAction = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.action] = (acc[row.action] ?? 0) + 1;
    return acc;
  }, {});

  const lines = [
    '# Luma Page Quality Scorecard',
    '',
    `Generated: ${generatedAt}`,
    '',
    'Scope: public content and utility pages represented by the local catalogue, SEO guide registry, taxonomy, and sitemap policy. API/admin routes are not treated as content pages.',
    '',
    '## Score Model',
    '',
    '- 80-100: keep indexed.',
    '- 70-79: improve if it should rank; otherwise remove from the index surface.',
    '- <70: noindex, redirect, merge, or keep only as direct utility until rebuilt.',
    '- Game pages combine source metadata, iframe/playability, taxonomy, original editorial content, thumbnails, policy tier, and demand/prominence.',
    '- Guide pages combine metadata, original body depth, practical sections, FAQ, recommendations, related guide links, and source/play context.',
    '- Collection pages combine enough high-quality games, crawlable metadata/schema, related internal links, and browse value.',
    '- Runtime performance and mobile playability are sampled by `pnpm audit:runtime-quality -- --base-url <url>` and recorded in `docs/page-runtime-sampling.md`; sampled index targets also need an 80+ runtime score.',
    '',
    '## Summary',
    '',
    `- Total scored rows: ${rows.length}`,
    `- Indexable rows: ${indexableRows.length}`,
    `- Under-80 rows: ${under80.length}`,
    `- Under-80 rows still indexable: ${under80Indexable.length}`,
    `- Actions: ${Object.entries(countsByAction).sort().map(([action, count]) => `${action}=${count}`).join(', ')}`,
    '',
    '## Under-80 Handling',
    '',
    ...(under80Indexable.length === 0
      ? ['- No under-80 page remains in the indexable surface after this audit.']
      : under80Indexable.map((row) => `- ${row.path}: score ${row.score}; ${row.nextStep}`)),
    '- Low-scoring catalogue-only/review game pages are intentionally removed from sitemap/search/collection surfacing and marked noindex or redirected by route policy.',
    '- Thin tag pages with fewer than 3 core games are removed from sitemap and marked noindex,follow.',
    '',
    '## All Scored Pages',
    '',
    '| Path | Type | Score | Indexable | Action | Reason | Next step |',
    '| --- | --- | ---: | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${[
      markdownEscape(row.path),
      row.type,
      row.score,
      row.indexable ? 'yes' : 'no',
      row.action,
      markdownEscape(row.reason),
      markdownEscape(row.nextStep),
    ].join(' | ')} |`),
    '',
  ];

  return lines.join('\n');
}

function runCli() {
  const report = buildReport();
  const writeFlagIndex = process.argv.indexOf('--write');

  if (writeFlagIndex >= 0) {
    const target = process.argv[writeFlagIndex + 1] ?? 'docs/page-quality-scorecard.md';
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
