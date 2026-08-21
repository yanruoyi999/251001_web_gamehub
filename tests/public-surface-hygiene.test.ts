import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSeoLandingPages } from '@/lib/seo-landing-content';

const publicSourcePaths = [
  'app/[locale]/guides/page.tsx',
  'app/[locale]/guides/[slug]/page.tsx',
  'app/[locale]/page.tsx',
  'app/sitemap.ts',
  'components/layout/Footer.tsx',
];

const internalOnlyCopy = [
  'Game Opportunity Radar',
  '游戏机会雷达',
  'MVP 可行性初筛',
  'Keyword test',
  '关键词测试',
  'Games in testing',
  '正在测试的新游戏',
  'search demand',
  'page.primaryKeyword',
  'testingGameEntries',
  'testing-games',
  'guide opportunity',
  '攻略机会',
  'Demo Data',
  '演示数据',
];

const internalVisiblePatterns = [
  /Game Opportunity Radar/i,
  /游戏机会雷达/,
  /\bMVP\b/i,
  /low[- ]competition/i,
  /低竞争/,
  /search demand/i,
  /搜索需求/,
  /search intent/i,
  /搜索意图/,
  /keyword test/i,
  /关键词测试/,
  /games in testing/i,
  /正在测试的新游戏/,
  /guide opportunity/i,
  /攻略机会/,
  /\bAdSense\b/i,
  /\bGEO\b/i,
  /\bSEO\b/i,
  /\bSERP\b/i,
  /\bCTR\b/i,
  /\bGSC\b/i,
];

function getVisibleGuideCopy() {
  return getSeoLandingPages()
    .flatMap((page) => Object.values(page.locales))
    .flatMap((content) => [
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
      ...content.recommendations.map((item) => item.pitch),
      ...content.faqs.flatMap((item) => [item.question, item.answer]),
      ...(content.quickAnswerLink
        ? [content.quickAnswerLink.label, content.quickAnswerLink.description]
        : []),
      ...(content.externalLinks ?? []).flatMap((item) => [
        item.label,
        item.description,
      ]),
      content.ctaLabel,
      content.ctaDescription,
    ])
    .filter(Boolean)
    .join('\n');
}

describe('public surface hygiene', () => {
  it('does not expose internal opportunity or search-test copy', () => {
    for (const relativePath of publicSourcePaths) {
      const source = readFileSync(path.join(process.cwd(), relativePath), 'utf8');

      for (const phrase of internalOnlyCopy) {
        expect(source, `${relativePath} contains ${phrase}`).not.toContain(phrase);
      }
    }
  });

  it('redirects the retired creator URL without keeping its page implementation', () => {
    const routePath = path.join(
      process.cwd(),
      'app/[locale]/guides/game-opportunity-radar/page.tsx',
    );
    const formPath = path.join(
      process.cwd(),
      'components/creator/game-opportunity-radar-form.tsx',
    );
    const evaluatorPath = path.join(process.cwd(), 'lib/game-opportunity-radar.ts');
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');

    expect(existsSync(routePath)).toBe(false);
    expect(existsSync(formPath)).toBe(false);
    expect(existsSync(evaluatorPath)).toBe(false);

    const nextConfigSource = readFileSync(nextConfigPath, 'utf8');
    expect(nextConfigSource).toContain("source: '/guides/game-opportunity-radar'");
    expect(nextConfigSource).toContain("destination: '/guides'");
    expect(nextConfigSource).toContain("source: '/en/guides/game-opportunity-radar'");
    expect(nextConfigSource).toContain("destination: '/en/guides'");
  });

  it('does not keep the local import sample route in the public app', () => {
    const sampleRoutePath = path.join(
      process.cwd(),
      'app/[locale]/games/4399-sample/page.tsx',
    );

    expect(existsSync(sampleRoutePath)).toBe(false);
  });

  it('keeps owner research vocabulary out of public guide copy', () => {
    const visibleCopy = getVisibleGuideCopy();

    for (const pattern of internalVisiblePatterns) {
      expect(visibleCopy, `public guide copy matches ${pattern}`).not.toMatch(pattern);
    }
  });
});
