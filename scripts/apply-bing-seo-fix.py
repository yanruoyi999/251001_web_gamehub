from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(relative_path: str, old: str, new: str) -> None:
    path = ROOT / relative_path
    text = path.read_text(encoding="utf-8")
    if old not in text:
        raise RuntimeError(f"Expected pattern not found in {relative_path}: {old[:120]!r}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


def replace_count(relative_path: str, old: str, new: str, expected_count: int) -> None:
    path = ROOT / relative_path
    text = path.read_text(encoding="utf-8")
    actual_count = text.count(old)
    if actual_count != expected_count:
        raise RuntimeError(
            f"Expected {expected_count} occurrences in {relative_path}, found {actual_count}: {old[:120]!r}"
        )
    path.write_text(text.replace(old, new), encoding="utf-8")


seo_helper = """export type SeoContentLocale = 'zh' | 'en';

interface ContextualMetaDescriptionOptions {
  description?: string | null;
  fallback: string;
  context: string;
  locale: SeoContentLocale;
  minLength?: number;
}

function collapseMetaWhitespace(value?: string | null) {
  return value?.replace(/\\s+/g, ' ').trim() ?? '';
}

/**
 * Keeps strong existing copy intact and expands only descriptions that are too
 * short to explain the page. The added context must be page-specific and must
 * not contain invented rankings, traffic, ratings, or demand claims.
 */
export function buildContextualMetaDescription({
  description,
  fallback,
  context,
  locale,
  minLength,
}: ContextualMetaDescriptionOptions): string {
  const base = collapseMetaWhitespace(description) || collapseMetaWhitespace(fallback);
  const supplementalContext = collapseMetaWhitespace(context);
  const minimum = minLength ?? (locale === 'zh' ? 70 : 120);

  if (!base) {
    return supplementalContext;
  }

  if (base.length >= minimum || !supplementalContext) {
    return base;
  }

  if (locale === 'zh') {
    const separator = /[。！？]$/.test(base) ? '' : '。';
    return `${base}${separator}${supplementalContext}`;
  }

  const separator = /[.!?]$/.test(base) ? ' ' : '. ';
  return `${base}${separator}${supplementalContext}`;
}

"""
replace_once(
    "lib/seo.ts",
    "export const DEFAULT_TWITTER_IMAGES = [DEFAULT_OG_IMAGE];\n\n",
    "export const DEFAULT_TWITTER_IMAGES = [DEFAULT_OG_IMAGE];\n\n" + seo_helper,
)

# Game detail metadata: use one contextual description consistently for normal,
# Open Graph, and Twitter metadata.
replace_once(
    "app/[locale]/games/[slug]/page.tsx",
    "import { DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES, buildAbsoluteUrl } from '@/lib/seo';",
    "import {\n  DEFAULT_OPEN_GRAPH_IMAGES,\n  DEFAULT_TWITTER_IMAGES,\n  buildAbsoluteUrl,\n  buildContextualMetaDescription,\n} from '@/lib/seo';",
)
replace_once(
    "app/[locale]/games/[slug]/page.tsx",
    "  const description = editorialContent?.metaDescription ?? resolveGameDescription(game, locale);\n  const metadataTitle =",
    "  const description = editorialContent?.metaDescription ?? resolveGameDescription(game, locale);\n  const seoDescription = buildContextualMetaDescription({\n    description,\n    fallback:\n      locale === 'zh'\n        ? `在线游玩 ${title}，无需下载或安装，浏览器直接打开。`\n        : `Play ${title} online in your browser with no download or installation required.`,\n    context:\n      locale === 'zh'\n        ? '页面提供操作方法、核心玩法提示、键盘或触屏设备支持、加载与安全说明，以及同类型浏览器游戏和实用攻略推荐。'\n        : 'The page includes controls, practical tips, keyboard or touch device notes, loading and safe-play guidance, plus related browser games and useful guides.',\n    locale: locale === 'en' ? 'en' : 'zh',\n  });\n  const metadataTitle =",
)
replace_once(
    "app/[locale]/games/[slug]/page.tsx",
    "    description:\n      description ||\n      (locale === 'zh'\n        ? `在线游玩 ${title}，无需下载，浏览器直接打开。`\n        : `Play ${title} online in your browser with no downloads required.`),",
    "    description: seoDescription,",
)
replace_once(
    "app/[locale]/games/[slug]/page.tsx",
    "    openGraph: {\n      title: metadataTitle,\n      description,",
    "    openGraph: {\n      title: metadataTitle,\n      description: seoDescription,",
)
replace_once(
    "app/[locale]/games/[slug]/page.tsx",
    "    twitter: {\n      card: 'summary_large_image',\n      title: metadataTitle,\n      description,",
    "    twitter: {\n      card: 'summary_large_image',\n      title: metadataTitle,\n      description: seoDescription,",
)

# Category metadata: include the editorial category description when available,
# then add concrete browsing context only when the copy is short.
replace_once(
    "app/[locale]/games/category/[slug]/page.tsx",
    "import { DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES, buildAbsoluteUrl } from '@/lib/seo';",
    "import {\n  DEFAULT_OPEN_GRAPH_IMAGES,\n  DEFAULT_TWITTER_IMAGES,\n  buildAbsoluteUrl,\n  buildContextualMetaDescription,\n} from '@/lib/seo';",
)
replace_once(
    "app/[locale]/games/category/[slug]/page.tsx",
    "  const description =\n    locale === 'zh'\n      ? `在 Luma Game Hub 浏览 ${entry.games.length} 款${label}小游戏，全部支持浏览器即开即玩，无需下载。`\n      : `Browse ${entry.games.length} curated ${label.toLowerCase()} browser games on Luma Game Hub. Play instantly without downloads.`;",
    "  const sourceDescription = pickLocalizedLabel(\n    locale,\n    entry.item.description,\n    entry.item.descriptionEn,\n  );\n  const description = buildContextualMetaDescription({\n    description: sourceDescription,\n    fallback:\n      locale === 'zh'\n        ? `在 Luma Game Hub 浏览 ${entry.games.length} 款${label}小游戏，全部支持浏览器即开即玩，无需下载。`\n        : `Browse ${entry.games.length} curated ${label.toLowerCase()} browser games on Luma Game Hub and play without downloads.`,\n    context:\n      locale === 'zh'\n        ? '可继续查看每款游戏的操作方式、设备适配、玩法标签、安全来源说明和相关专题，按真实游玩需求选择下一款游戏。'\n        : 'Compare controls, device support, play tags, source notes, and related guides so you can choose the next game for your actual play situation.',\n    locale,\n  });",
)

# Tag metadata: make indexable tag collections self-explanatory instead of a
# one-line count template.
replace_once(
    "app/[locale]/games/tag/[slug]/page.tsx",
    "import { DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES, buildAbsoluteUrl } from '@/lib/seo';",
    "import {\n  DEFAULT_OPEN_GRAPH_IMAGES,\n  DEFAULT_TWITTER_IMAGES,\n  buildAbsoluteUrl,\n  buildContextualMetaDescription,\n} from '@/lib/seo';",
)
replace_once(
    "app/[locale]/games/tag/[slug]/page.tsx",
    "  const description =\n    locale === 'zh'\n      ? `发现 ${entry.games.length} 款适合${label}的免费浏览器小游戏，直接在线游玩。`\n      : `Discover ${entry.games.length} free browser games tagged ${label}. Play instantly online.`;",
    "  const description = buildContextualMetaDescription({\n    fallback:\n      locale === 'zh'\n        ? `发现 ${entry.games.length} 款带有“${label}”标签的免费浏览器小游戏，可直接在线游玩。`\n        : `Discover ${entry.games.length} free browser games tagged “${label}” and play them online.`,\n    context:\n      locale === 'zh'\n        ? '页面同时展示相关游戏分类、操作与设备信息、免下载说明和详情页入口，方便按玩法特征继续筛选。'\n        : 'The collection also connects related categories, controls and device notes, no-download guidance, and detailed game pages for further filtering.',\n    locale,\n  });",
)

# Registry-backed guides: preserve their researched copy, but ensure any older
# short entry receives enough page-specific context across all metadata cards.
replace_once(
    "app/[locale]/guides/[slug]/page.tsx",
    "  buildAbsoluteUrl,\n  getSiteBaseUrl,",
    "  buildAbsoluteUrl,\n  buildContextualMetaDescription,\n  getSiteBaseUrl,",
)
replace_once(
    "app/[locale]/guides/[slug]/page.tsx",
    "  const basePath = getLocalizedPath(locale, `/guides/${page.slug}`);\n\n  return {",
    "  const basePath = getLocalizedPath(locale, `/guides/${page.slug}`);\n  const description = buildContextualMetaDescription({\n    description: content.metaDescription,\n    fallback: content.subheading,\n    context:\n      locale === 'zh'\n        ? '本页包含可执行的玩法或选择建议、常见问题、相关游戏与专题内链，并明确标注来源、安全边界和设备适配信息。'\n        : 'This guide includes actionable play or selection advice, FAQs, related games and internal guides, plus source, safety, and device-context notes.',\n    locale,\n  });\n\n  return {",
)
replace_once(
    "app/[locale]/guides/[slug]/page.tsx",
    "    title: content.metaTitle,\n    description: content.metaDescription,",
    "    title: content.metaTitle,\n    description,",
)
replace_once(
    "app/[locale]/guides/[slug]/page.tsx",
    "    openGraph: {\n      title: content.metaTitle,\n      description: content.metaDescription,",
    "    openGraph: {\n      title: content.metaTitle,\n      description,",
)
replace_once(
    "app/[locale]/guides/[slug]/page.tsx",
    "    twitter: {\n      card: 'summary_large_image',\n      title: content.metaTitle,\n      description: content.metaDescription,",
    "    twitter: {\n      card: 'summary_large_image',\n      title: content.metaTitle,\n      description,",
)

# The custom Game Opportunity Radar route is not registry-backed, so apply the
# same rule explicitly.
replace_once(
    "app/[locale]/guides/game-opportunity-radar/page.tsx",
    "  buildAbsoluteUrl,\n  getSiteBaseUrl,",
    "  buildAbsoluteUrl,\n  buildContextualMetaDescription,\n  getSiteBaseUrl,",
)
replace_once(
    "app/[locale]/guides/game-opportunity-radar/page.tsx",
    "  const path = getLocalizedPath(locale, '/guides/game-opportunity-radar');\n\n  return {",
    "  const path = getLocalizedPath(locale, '/guides/game-opportunity-radar');\n  const description = buildContextualMetaDescription({\n    description: content.metaDescription,\n    fallback: content.subheading,\n    context:\n      locale === 'zh'\n        ? '评估结果同时解释首版范围、第一轮变现实验、主要交付风险和下一步应收集的真实验证证据。'\n        : 'The result also explains first-release scope, an initial monetization experiment, the main delivery risk, and the real evidence to collect next.',\n    locale,\n  });\n\n  return {",
)
replace_once(
    "app/[locale]/guides/game-opportunity-radar/page.tsx",
    "    title: content.metaTitle,\n    description: content.metaDescription,",
    "    title: content.metaTitle,\n    description,",
)
replace_once(
    "app/[locale]/guides/game-opportunity-radar/page.tsx",
    "    openGraph: {\n      title: content.metaTitle,\n      description: content.metaDescription,",
    "    openGraph: {\n      title: content.metaTitle,\n      description,",
)
replace_once(
    "app/[locale]/guides/game-opportunity-radar/page.tsx",
    "    twitter: {\n      card: 'summary_large_image',\n      title: content.metaTitle,\n      description: content.metaDescription,",
    "    twitter: {\n      card: 'summary_large_image',\n      title: content.metaTitle,\n      description,",
)

# Regression coverage audits every indexable catalogue item and guide instead
# of testing a single example.
test_path = ROOT / "tests/seo-meta-description.test.ts"
test_path.write_text(
    """import { describe, expect, it } from 'vitest';

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
  expect(description, label).not.toMatch(/\\s{2,}/);
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

  it('keeps the custom Game Opportunity Radar descriptions above the same floor', () => {
    const zh = buildContextualMetaDescription({
      description: '根据平台、团队、预算、周期和玩法复杂度，免费初筛游戏 MVP 是否适合进入验证，并获得范围、变现测试和风险建议。',
      fallback: '先判断什么值得做，再投入开发。',
      context: '评估结果同时解释首版范围、第一轮变现实验、主要交付风险和下一步应收集的真实验证证据。',
      locale: 'zh',
    });
    const en = buildContextualMetaDescription({
      description: 'Screen a game MVP by platform, team, budget, timeline, and genre complexity, then get scope, monetization-test, and risk guidance.',
      fallback: 'Decide what is worth testing before you fund development.',
      context: 'The result also explains first-release scope, an initial monetization experiment, the main delivery risk, and the real evidence to collect next.',
      locale: 'en',
    });

    expectUsefulDescription(zh, 'zh', 'radar zh');
    expectUsefulDescription(en, 'en', 'radar en');
  });
});
""",
    encoding="utf-8",
)

# Record what code can and cannot solve from the Bing recommendation.
doc_path = ROOT / "docs/bing-webmaster-audit-20260803.md"
doc_path.write_text(
    """# Bing Webmaster 核查与修复记录（2026-08-03）

## 已验证结论

- “许多页面的元描述太短”属于站内可修复项。本次统一覆盖可索引游戏详情、分类、标签、注册式指南与 Game Opportunity Radar，并确保普通、Open Graph、Twitter 描述使用同一份上下文化文案。
- “缺少来自高质量域名的入站链接”不是代码错误，也不能通过站内添加链接伪造。真正的入站链接必须由外部站点自愿引用；本次没有购买、批量生成或虚构外链。
- 远程旧分支 `feature/seo-outbound-links` 与 `feature/google-analytics` 均完全落后于当前 main，未把旧实现重新混入本次修复。

## 修复原则

1. 保留已经足够详细的原创描述，不为凑长度重写。
2. 只在描述过短时补充当前页面真实存在的操作、设备、安全、来源、内链和筛选上下文。
3. 不写虚构搜索量、排名、用户数量、评分、收入或需求证明。
4. noindex 页面保持 noindex；本次不为了 Bing 提示扩大索引面。
5. 为所有可索引本地 catalogue 游戏、指南、分类和标签加入回归测试，避免以后再次退化成短模板。

## 外链工作的真实边界

高质量入站链接需要站外传播和第三方编辑判断。后续可以围绕原创游戏攻略、可复用数据或开发者工具进行定向投稿和自然引用获取，但必须逐个核实来源与落地页，不把目录垃圾链接或互链网络计为质量提升。
""",
    encoding="utf-8",
)

# Remove the one-shot patch machinery from the resulting branch commit.
for temporary in [
    ROOT / "scripts/apply-bing-seo-fix.py",
    ROOT / ".github/workflows/apply-bing-seo-fix.yml",
]:
    if temporary.exists():
        temporary.unlink()

print("Applied Bing SEO metadata fix and removed one-shot workflow files.")
