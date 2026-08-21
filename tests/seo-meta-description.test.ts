import { describe, expect, it } from 'vitest';

import { getCategoryEntries, getTagEntries, pickLocalizedLabel, shouldIndexTagEntry } from '@/lib/game-taxonomy';
import { getGameEditorialContent } from '@/lib/games/editorial-content';
import { shouldNoIndexGame } from '@/lib/games/quality-policy';
import { mockGames } from '@/lib/mock-games';
import { buildContextualMetaDescription, type SeoContentLocale } from '@/lib/seo';
import { getSeoLandingPages } from '@/lib/seo-landing-content';

const MINIMUM_LENGTH: Record<SeoContentLocale, number> = {
  zh: 70,
  en: 120,
};

const GAME_CONTEXT: Record<SeoContentLocale, string> = {
  zh: '页面提供操作方法、核心玩法提示、键盘或触屏设备支持、加载与安全说明，以及同类型浏览器游戏和实用攻略推荐。',
  en: 'The page includes controls, practical tips, keyboard or touch device notes, loading and safe-play guidance, plus related browser games and useful guides.',
};

function expectUsefulDescription(description: string, locale: SeoContentLocale, label: string) {
  expect(description.length, label).toBeGreaterThanOrEqual(MINIMUM_LENGTH[locale]);
  expect(description, label).not.toMatch(/undefined|null/i);
  expect(description, label).not.toMatch(/\s{2,}/);
}

describe('Bing meta description quality guard', () => {
  it('preserves sufficiently detailed copy and expands only short copy', () => {
    const detailed = 'A sufficiently detailed browser-game description that already explains controls, device support, practical play context, safety boundaries, and related recommendations for players.';
    expect(
      buildContextualMetaDescription({
        description: detailed,
        fallback: 'Fallback copy.',
        context: 'Extra context should not be appended.',
        locale: 'en',
      }),
    ).toBe(detailed);

    const expanded = buildContextualMetaDescription({
      description: 'Play online.',
      fallback: 'Fallback copy.',
      context: GAME_CONTEXT.en,
      locale: 'en',
    });
    expect(expanded).toContain('Play online.');
    expect(expanded).toContain('controls');
    expectUsefulDescription(expanded, 'en', 'short English description');
  });

  it('covers every indexable local catalogue game in both locales', () => {
    for (const game of mockGames) {
      if (shouldNoIndexGame(game.slug)) continue;

      for (const locale of ['zh', 'en'] as const) {
        const editorial = getGameEditorialContent(game.slug, locale);
        const title = locale === 'en' ? game.titleEn || game.title : game.title || game.titleEn;
        const candidate =
          editorial?.metaDescription ??
          (locale === 'en' ? game.descriptionEn || game.description : game.description || game.descriptionEn);
        const description = buildContextualMetaDescription({
          description: candidate,
          fallback:
            locale === 'zh'
              ? `在线游玩 ${title}，无需下载或安装，浏览器直接打开。`
              : `Play ${title} online in your browser with no download or installation required.`,
          context: GAME_CONTEXT[locale],
          locale,
        });

        expectUsefulDescription(description, locale, `${locale} game ${game.slug}`);
      }
    }
  });

  it('covers every registry-backed guide in both locales', () => {
    for (const page of getSeoLandingPages()) {
      for (const locale of ['zh', 'en'] as const) {
        const content = page.locales[locale] ?? page.locales.zh;
        const description = buildContextualMetaDescription({
          description: content.metaDescription,
          fallback: content.subheading,
          context:
            locale === 'zh'
              ? '本页包含可执行的玩法或选择建议、常见问题、相关游戏与专题内链，并明确标注来源、安全边界和设备适配信息。'
              : 'This guide includes actionable play or selection advice, FAQs, related games and internal guides, plus source, safety, and device-context notes.',
          locale,
        });

        expectUsefulDescription(description, locale, `${locale} guide ${page.slug}`);
      }
    }
  });

  it('covers every category and every indexable tag collection', () => {
    for (const entry of getCategoryEntries()) {
      for (const locale of ['zh', 'en'] as const) {
        const label = pickLocalizedLabel(locale, entry.item.name, entry.item.nameEn);
        const candidate = pickLocalizedLabel(locale, entry.item.description, entry.item.descriptionEn);
        const description = buildContextualMetaDescription({
          description: candidate,
          fallback:
            locale === 'zh'
              ? `在 Luma Game Hub 浏览 ${entry.games.length} 款${label}小游戏，全部支持浏览器即开即玩，无需下载。`
              : `Browse ${entry.games.length} curated ${label.toLowerCase()} browser games on Luma Game Hub and play without downloads.`,
          context:
            locale === 'zh'
              ? '可继续查看每款游戏的操作方式、设备适配、玩法标签、安全来源说明和相关专题，按真实游玩需求选择下一款游戏。'
              : 'Compare controls, device support, play tags, source notes, and related guides so you can choose the next game for your actual play situation.',
          locale,
        });
        expectUsefulDescription(description, locale, `${locale} category ${entry.item.slug}`);
      }
    }

    for (const entry of getTagEntries().filter(shouldIndexTagEntry)) {
      for (const locale of ['zh', 'en'] as const) {
        const label = pickLocalizedLabel(locale, entry.item.name, entry.item.nameEn);
        const description = buildContextualMetaDescription({
          fallback:
            locale === 'zh'
              ? `发现 ${entry.games.length} 款带有“${label}”标签的免费浏览器小游戏，可直接在线游玩。`
              : `Discover ${entry.games.length} free browser games tagged “${label}” and play them online.`,
          context:
            locale === 'zh'
              ? '页面同时展示相关游戏分类、操作与设备信息、免下载说明和详情页入口，方便按玩法特征继续筛选。'
              : 'The collection also connects related categories, controls and device notes, no-download guidance, and detailed game pages for further filtering.',
          locale,
        });
        expectUsefulDescription(description, locale, `${locale} tag ${entry.item.slug}`);
      }
    }
  });

});
