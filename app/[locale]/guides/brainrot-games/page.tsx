import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  DEFAULT_OPEN_GRAPH_IMAGES,
  DEFAULT_TWITTER_IMAGES,
  buildAbsoluteUrl,
} from '@/lib/seo';

const PATH = '/guides/brainrot-games';
const UPDATED_AT = '2026-07-09T00:00:00.000Z';

type InternalLink = {
  href: string;
  label: string;
  description: string;
};

type CandidateGame = {
  name: string;
  type: string;
  intent: string;
  href: string | null;
};

const candidates: Record<Locale, CandidateGame[]> = {
  en: [
    {
      name: 'Lucky Blocks for Brainrots',
      type: 'Index / rebirth',
      intent: 'Best for players searching for all Brainrots, index completion, rebirth timing, and mobile controls.',
      href: '/guides/lucky-blocks-for-brainrots-guide',
    },
    {
      name: 'Steal Beanstalk for Brainrots',
      type: 'Steal / upgrade',
      intent: 'Best for players searching for rare Brainrots, beanstalk upgrades, and how stealing works.',
      href: '/guides/steal-beanstalk-for-brainrots-guide',
    },
    {
      name: 'Float for Brainrots',
      type: 'Collect / survival',
      intent: 'Best for rare collection, boat upgrade, shark timer, and two-player mode searches.',
      href: '/guides/float-for-brainrots-guide',
    },
    {
      name: 'Robby: Cross the Road for Brainrot',
      type: 'Crossing / reflex',
      intent: 'Best for mobile controls, traffic survival tips, and Crossy Road-like intent.',
      href: null,
    },
    {
      name: 'Make Brainrots Online',
      type: 'Craft / merge',
      intent: 'Best for recipes, combinations, eggs, and upgrade-order questions.',
      href: null,
    },
  ],
  zh: [
    {
      name: 'Lucky Blocks for Brainrots',
      type: '图鉴 / 重生',
      intent: '适合承接 all Brainrots、Index 图鉴、Rebirth 重生、手机操作等搜索。',
      href: '/guides/lucky-blocks-for-brainrots-guide',
    },
    {
      name: 'Steal Beanstalk for Brainrots',
      type: '偷取 / 升级',
      intent: '适合承接稀有 Brainrots、Beanstalk 升级、如何偷取与防守等搜索。',
      href: '/guides/steal-beanstalk-for-brainrots-guide',
    },
    {
      name: 'Float for Brainrots',
      type: '收集 / 生存',
      intent: '适合承接稀有收集、船只升级、鲨鱼倒计时和双人模式搜索。',
      href: '/guides/float-for-brainrots-guide',
    },
    {
      name: 'Robby: Cross the Road for Brainrot',
      type: '过马路 / 反应',
      intent: '适合承接移动端操作、交通躲避技巧和 Crossy Road-like 搜索。',
      href: null,
    },
    {
      name: 'Make Brainrots Online',
      type: '合成 / Merge',
      intent: '适合承接 recipes、组合、蛋、材料解锁和升级顺序问题。',
      href: null,
    },
  ],
};

const relatedLinks: Record<Locale, InternalLink[]> = {
  en: [
    {
      href: '/guides/lucky-blocks-for-brainrots-guide',
      label: 'Lucky Blocks guide',
      description: 'Break Lucky Blocks, fill the index, time rebirths, and test mobile controls.',
    },
    {
      href: '/guides/steal-beanstalk-for-brainrots-guide',
      label: 'Steal Beanstalk guide',
      description: 'Grow, steal, upgrade, and unlock rare Brainrots with a safer guide-first page.',
    },
    {
      href: '/guides/float-for-brainrots-guide',
      label: 'Float for Brainrots guide',
      description: 'Compare boat upgrades, rarity tiers, shark pressure, and mobile controls.',
    },
    {
      href: '/guides/no-download-games',
      label: 'No Download Games',
      description: 'Keep users on safe browser-play paths instead of download or APK intent.',
    },
    {
      href: '/guides/quick-play-guide',
      label: 'Quick Play Guide',
      description: 'Send short-session players to broader mobile-friendly browser game guidance.',
    },
  ],
  zh: [
    {
      href: '/guides/lucky-blocks-for-brainrots-guide',
      label: 'Lucky Blocks 攻略',
      description: '承接 Lucky Blocks、全 Brainrots、Index 图鉴、Rebirth 和手机操作搜索。',
    },
    {
      href: '/guides/steal-beanstalk-for-brainrots-guide',
      label: 'Steal Beanstalk 攻略',
      description: '承接升级、偷取、稀有 Brainrots 和安全游玩搜索。',
    },
    {
      href: '/guides/float-for-brainrots-guide',
      label: 'Float for Brainrots 攻略',
      description: '继续扩展船只升级、稀有度、鲨鱼压力和手机操作。',
    },
    {
      href: '/guides/no-download-games',
      label: '无需下载小游戏',
      description: '把下载、APK、插件类风险搜索导向更安全的浏览器玩法。',
    },
    {
      href: '/guides/quick-play-guide',
      label: '快速游玩指南',
      description: '给短局、通勤、等待场景的玩家提供更宽的站内入口。',
    },
  ],
};

function resolveLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : 'zh';
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = resolveLocale(params.locale);
  const isZh = locale === 'zh';
  const title = isZh
    ? 'Brainrot Games Online 攻略合集 | Luma Game Hub'
    : 'Best Brainrot Games Online: Craft, Steal, Merge and Obby Picks';
  const description = isZh
    ? '整理最新 Brainrot 浏览器小游戏机会：Lucky Blocks、合成、偷取、收集、Obby 和移动端体验，附安全说明、长尾关键词与相似游戏入口。'
    : 'A curated Brainrot games hub for Lucky Blocks, craft, steal, merge, obby, and mobile browser intent, with safety notes, long-tail guide ideas, and similar-game paths.';

  return {
    title,
    description,
    keywords: [
      'brainrot games online',
      'best brainrot games',
      'lucky blocks for brainrots guide',
      'brainrot browser games',
      'brainrot games mobile',
      'games like make brainrots online',
    ],
    alternates: {
      canonical: getLocalizedPath(locale, PATH),
      languages: Object.fromEntries(
        locales.map((loc) => [loc === 'zh' ? 'zh-CN' : 'en-US', getLocalizedPath(loc, PATH)]),
      ),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedPath(locale, PATH),
      type: 'article',
      publishedTime: UPDATED_AT,
      modifiedTime: UPDATED_AT,
      images: DEFAULT_OPEN_GRAPH_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default function BrainrotGamesPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const isZh = locale === 'zh';
  const games = candidates[locale];
  const pageUrl = buildAbsoluteUrl(getLocalizedPath(locale, PATH));
  const links = relatedLinks[locale];
  const faqItems = isZh
    ? [
        {
          question: 'Brainrot games 是什么类型的游戏？',
          answer:
            '它通常指围绕网络 meme、收集、合成、偷取、Lucky Blocks 或 Obby 玩法扩展出来的轻量浏览器游戏。Luma 更关注玩法、移动端体验和安全入口，而不是复制平台文案。',
        },
        {
          question: '这些游戏能直接嵌入 Luma 吗？',
          answer:
            '不一定。Brainrot 题材可能混入 meme 角色或第三方素材，优先做原创攻略和官方来源外链，确认授权后再考虑嵌入。',
        },
        {
          question: '为什么先做合集页而不是只加游戏？',
          answer:
            '合集页能承接“best brainrot games online”“mobile brainrot games”“games like brainrot craft”等泛意图，并把单款攻略页串成主题集群。',
        },
      ]
    : [
        {
          question: 'What are Brainrot games?',
          answer:
            'They are lightweight browser games built around meme culture, collecting, crafting, stealing, Lucky Blocks, obby movement, or clicker loops. Luma focuses on gameplay notes, mobile experience, and safe discovery rather than copied platform blurbs.',
        },
        {
          question: 'Can Luma embed every Brainrot game?',
          answer:
            'No. Some meme games may mix third-party characters or unclear assets. A guide-first page with official source links is safer until an authorized embed is confirmed.',
        },
        {
          question: 'Why build a hub page first?',
          answer:
            'A hub can capture broad intent such as best Brainrot games online, mobile Brainrot games, and games like Brainrot Craft, then pass users to individual guides as they are published.',
        },
      ];

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: isZh ? 'Brainrot Games Online 攻略合集' : 'Best Brainrot Games Online',
      description: isZh
        ? '按玩法和搜索意图整理 Brainrot 浏览器小游戏机会。'
        : 'A search-intent hub for emerging Brainrot browser games.',
      mainEntityOfPage: pageUrl,
      inLanguage: isZh ? 'zh-CN' : 'en-US',
      datePublished: UPDATED_AT,
      dateModified: UPDATED_AT,
      author: { '@type': 'Organization', name: 'Luma Game Hub Editorial' },
      publisher: { '@type': 'Organization', name: 'Luma Game Hub', url: buildAbsoluteUrl('/') },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ];

  return (
    <article className="mx-auto w-full max-w-5xl px-6 py-12">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Link href={getLocalizedPath(locale, '/guides')} className="text-primary hover:underline">
        {isZh ? '← 返回专题合集' : '← Back to guides'}
      </Link>

      <header className="mt-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">brainrot games online</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">
          {isZh ? 'Brainrot Games Online 攻略合集' : 'Best Brainrot Games Online'}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          {isZh
            ? 'Brainrot 相关小游戏正在从单一 meme 变成一组浏览器游戏搜索需求：Lucky Blocks、合成、偷取、收集、Obby、点击升级和移动端试玩。本页先做安全、原创、可内链的主题入口。'
            : 'Brainrot searches are turning into a cluster of browser-game intents: Lucky Blocks, crafting, stealing, collecting, obby movement, clicker upgrades, and mobile play. This page keeps the cluster useful, safe, and expandable.'}
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '快速结论' : 'Quick answer'}
        </h2>
        <p className="mt-3 text-base leading-7 text-foreground/90">
          {isZh
            ? '优先从“具体游戏名 + guide / mobile / index / rebirth / rare / upgrades / recipes”切入，而不是直接抢成熟大词。合集页负责承接泛搜索，单页负责回答具体玩法问题。'
            : 'Start with “specific game name + guide / mobile / index / rebirth / rare / upgrades / recipes” instead of chasing only the broad keyword. The hub captures broad discovery; individual guides answer concrete gameplay questions.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
          {links.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={getLocalizedPath(locale, item.href)}
              className="rounded-full border border-primary/30 bg-background px-4 py-2 text-primary hover:bg-primary/10"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-foreground">
          {isZh ? '当前最适合扩展的 Brainrot 游戏' : 'Brainrot games worth expanding first'}
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {games.map((game) => (
            <div key={game.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-foreground">{game.name}</h3>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  {game.type}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{game.intent}</p>
              {game.href ? (
                <Link href={getLocalizedPath(locale, game.href)} className="mt-4 inline-flex text-sm font-medium text-primary hover:text-primary/80">
                  {isZh ? '查看攻略页' : 'Read the guide'} →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xl font-semibold text-foreground">{isZh ? 'SEO 切入点' : 'SEO entry point'}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {isZh
              ? '围绕 guide、walkthrough、mobile、all brainrots、index、rebirth、rare brainrots、upgrades、recipes 和 similar games 写原创实测。'
              : 'Use guide, walkthrough, mobile, all Brainrots, index, rebirth, rare Brainrots, upgrades, recipes, and similar games as the long-tail angles.'}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xl font-semibold text-foreground">{isZh ? 'AdSense 边界' : 'AdSense boundary'}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {isZh
              ? '不承诺官方身份，不放可疑下载按钮，不复制平台素材，优先用文字攻略和安全说明。'
              : 'Do not claim official status, avoid fake download buttons, avoid copied assets, and prioritize written guides with safety notes.'}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xl font-semibold text-foreground">{isZh ? '内链结构' : 'Internal links'}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {isZh
              ? 'Brainrot Hub 链到单款攻略，单款攻略再回链合集页和 mobile / no download / quick play 页面。'
              : 'The Brainrot hub links to individual guides; individual guides link back to the hub and to mobile, no-download, and quick-play pages.'}
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '继续浏览相关页面' : 'Continue with related pages'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isZh
            ? '每个 Brainrot 主题页至少保留两个正文内链，帮助用户继续浏览，也让搜索引擎理解主题集群。'
            : 'Each Brainrot topic page keeps at least two contextual internal links so users and search engines can follow the cluster.'}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={getLocalizedPath(locale, item.href)}
              className="rounded-xl border border-border bg-secondary p-4 transition hover:border-primary/50"
            >
              <span className="font-semibold text-primary">{item.label} →</span>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-secondary p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '常见问题' : 'Frequently asked questions'}
        </h2>
        <dl className="mt-6 space-y-5">
          {faqItems.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-border bg-card p-5">
              <dt className="font-semibold text-foreground">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
