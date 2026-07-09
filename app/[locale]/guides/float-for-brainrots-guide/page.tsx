import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  DEFAULT_OPEN_GRAPH_IMAGES,
  DEFAULT_TWITTER_IMAGES,
  buildAbsoluteUrl,
} from '@/lib/seo';

const PATH = '/guides/float-for-brainrots-guide';
const UPDATED_AT = '2026-07-09T00:00:00.000Z';

type GuideSection = {
  title: string;
  body: string;
  bullets?: string[];
};

type InternalLink = {
  href: string;
  label: string;
  description: string;
};

const sections: Record<Locale, GuideSection[]> = {
  en: [
    {
      title: 'Treat each trip as a short round',
      body:
        'Float for Brainrots has useful search intent around rare collection, boat upgrades, and shark pressure. The most common beginner mistake is sailing too far before turning back. A safer approach is to give each trip one clear goal.',
      bullets: [
        'Decide whether the trip is for collecting, upgrade materials, or rare targets.',
        'Return earlier when shark pressure rises.',
        'Do not chase distant rare targets with an under-upgraded boat.',
      ],
    },
    {
      title: 'Boat upgrade priority',
      body:
        'Boat upgrades should help you finish each trip safely. Speed, capacity, and stability can all affect return risk. This page can keep expanding around boat upgrades, best boat, and shark timer long-tail searches.',
      bullets: [
        'Speed expands your safe exploration radius.',
        'Capacity improves the value of each trip.',
        'Stability gives more room for mistakes.',
      ],
    },
    {
      title: 'How to think about rare Brainrots',
      body:
        'The rarer the target, the more important it is to know the spawn area and escape path first. A useful guide should not only list rare Brainrots; it should explain when each rarity tier is worth chasing.',
      bullets: [
        'Use common targets to learn the map.',
        'Chase mid-rarity targets after basic upgrades.',
        'Save high-rarity route optimization for later progression.',
      ],
    },
    {
      title: 'Mobile experience check',
      body:
        'Sailing games can be affected by screen ratio, virtual controls, and tap delay. A Luma guide should ask players to test a short mobile round instead of assuming desktop behavior transfers perfectly to phones.',
    },
  ],
  zh: [
    {
      title: '把航行看成短回合，而不是无限探索',
      body:
        'Float for Brainrots 的搜索价值在于稀有收集、船只升级和鲨鱼压力。新手最容易犯的错是离基地太远才开始回头。更稳的打法是每次出航只完成一个目标。',
      bullets: ['先确定这次是收集、升级材料，还是寻找稀有目标。', '发现鲨鱼压力变高时尽早回基地。', '不要在低等级船只阶段追太远的稀有目标。'],
    },
    {
      title: '船只升级优先级',
      body:
        '船只升级应服务于“更安全地完成一轮航行”。速度、容量和稳定性都可能影响回程风险。攻略页可以围绕 boat upgrades、best boat、shark timer 等长尾词持续补充实测。',
      bullets: ['速度影响探索半径。', '容量影响单次出航收益。', '稳定性影响失误后的容错。'],
    },
    {
      title: '稀有 Brainrots 的收集思路',
      body:
        '稀有度越高，越应该先确认刷新区域和撤退路径。不要只写“all rare Brainrots list”，更有价值的是说明每类稀有目标适合什么阶段去找。',
      bullets: ['低稀有度用于熟悉地图。', '中稀有度适合在升级后集中补齐。', '高稀有度目标适合作为后期路线优化内容。'],
    },
    {
      title: '移动端体验检查',
      body:
        '这类航行游戏很容易被屏幕比例、虚拟按键和点击延迟影响。Luma 页面应明确提醒玩家先做短局测试，避免把桌面体验直接当成手机体验。',
    },
  ],
};

const relatedLinks: Record<Locale, InternalLink[]> = {
  en: [
    {
      href: '/guides/brainrot-games',
      label: 'Brainrot Games Online',
      description: 'Return to the Brainrot hub for craft, steal, collect, obby, Lucky Blocks, and mobile discovery paths.',
    },
    {
      href: '/guides/lucky-blocks-for-brainrots-guide',
      label: 'Lucky Blocks guide',
      description: 'Compare ocean collection with Lucky Block farming, index completion, and rebirth timing.',
    },
    {
      href: '/guides/steal-beanstalk-for-brainrots-guide',
      label: 'Steal Beanstalk guide',
      description: 'Compare boat progression with stealing loops, beanstalk upgrades, and rare targets.',
    },
    {
      href: '/guides/quick-play-guide',
      label: 'Quick Play Guide',
      description: 'Help short-session players choose browser games that start fast and pause easily.',
    },
    {
      href: '/guides/best-free-iphone-games',
      label: 'Best Free iPhone Games',
      description: 'Route mobile players to broader no-download Safari and Chrome browser-game picks.',
    },
  ],
  zh: [
    {
      href: '/guides/brainrot-games',
      label: 'Brainrot Games Online 合集',
      description: '回到 Brainrot 主题 Hub，继续浏览合成、偷取、收集、Obby、Lucky Blocks 和手机玩法。',
    },
    {
      href: '/guides/lucky-blocks-for-brainrots-guide',
      label: 'Lucky Blocks 攻略',
      description: '把航行收集和 Lucky Block 刷取、Index 图鉴、Rebirth 重生做横向对比。',
    },
    {
      href: '/guides/steal-beanstalk-for-brainrots-guide',
      label: 'Steal Beanstalk 攻略',
      description: '把船只成长和偷取循环、Beanstalk 升级、稀有目标做横向对比。',
    },
    {
      href: '/guides/quick-play-guide',
      label: '快速游玩指南',
      description: '给短局玩家提供启动快、规则清楚、容易暂停的站内入口。',
    },
    {
      href: '/guides/best-free-iphone-games',
      label: 'iPhone 免费小游戏',
      description: '把手机用户导向 Safari 和 Chrome 里可试玩的无需下载小游戏。',
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
    ? 'Float for Brainrots 攻略 | 稀有收集、船只升级与鲨鱼生存'
    : 'Float for Brainrots Guide: Rare Brainrots, Boat Upgrades and Shark Survival';
  const description = isZh
    ? 'Float for Brainrots 攻略：稀有 Brainrots、船只升级、鲨鱼倒计时、返回基地节奏、双人模式和移动端体验说明。'
    : 'A Float for Brainrots guide covering rare Brainrots, boat upgrades, shark timers, return-to-base rhythm, two-player mode, and mobile browser checks.';

  return {
    title,
    description,
    keywords: [
      'float for brainrots guide',
      'float for brainrots rare brainrots',
      'float for brainrots boat upgrades',
      'float for brainrots shark',
      'brainrot ocean game',
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

export default function FloatForBrainrotsGuide({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const isZh = locale === 'zh';
  const pageUrl = buildAbsoluteUrl(getLocalizedPath(locale, PATH));
  const pageSections = sections[locale];
  const links = relatedLinks[locale];
  const faqItems = isZh
    ? [
        {
          question: 'Float for Brainrots 新手最重要的技巧是什么？',
          answer: '把每次出航控制成短回合。先完成一个目标，再及时返回基地升级，不要过早追远距离稀有目标。',
        },
        {
          question: '船只升级应该先升什么？',
          answer: '优先考虑能提升安全回程能力的项目，例如速度、容量和容错。具体顺序要结合当前船只和地图压力。',
        },
        {
          question: '手机上玩要注意什么？',
          answer: '先测试画面比例、虚拟控制、转向延迟和返回基地路径是否清楚。若画面裁切，建议切换横屏或桌面端。',
        },
      ]
    : [
        {
          question: 'What is the most important beginner tip for Float for Brainrots?',
          answer: 'Keep each trip short. Set one goal, return to base, upgrade, and avoid chasing distant rare targets too early.',
        },
        {
          question: 'What boat upgrades should I prioritize?',
          answer: 'Prioritize upgrades that make it safer to return: speed, capacity, and forgiveness. The exact order depends on your current boat and map pressure.',
        },
        {
          question: 'What should I check on mobile?',
          answer: 'Check screen fit, virtual controls, turn delay, and whether the return path is clear. If the canvas is cropped, try landscape or desktop.',
        },
      ];

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: isZh ? 'Float for Brainrots 攻略' : 'Float for Brainrots Guide',
      description: isZh
        ? '面向稀有收集、船只升级与鲨鱼生存的 Float for Brainrots 攻略页。'
        : 'A Float for Brainrots guide for rare collection, boat upgrades, and shark survival.',
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

      <Link href={getLocalizedPath(locale, '/guides/brainrot-games')} className="text-primary hover:underline">
        {isZh ? '← 返回 Brainrot Games 合集' : '← Back to Brainrot Games hub'}
      </Link>

      <header className="mt-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">float for brainrots guide</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">
          {isZh
            ? 'Float for Brainrots 攻略：稀有收集、船只升级与鲨鱼生存'
            : 'Float for Brainrots Guide: Rare Brainrots, Boat Upgrades and Shark Survival'}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          {isZh
            ? 'Float for Brainrots 天然适合做原创攻略：有稀有度、船只升级、鲨鱼压力、返回基地和移动端体验等多个长尾切入点。'
            : 'Float for Brainrots is a strong guide candidate because it creates multiple long-tail angles: rarity, boat upgrades, shark pressure, return-to-base timing, and mobile experience.'}
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '快速答案' : 'Quick answer'}
        </h2>
        <p className="mt-3 text-base leading-7 text-foreground/90">
          {isZh
            ? '最稳的打法是短距离出航、及时回基地、逐步升级船只。稀有 Brainrots 不要一开始就硬追，先让船的速度和容量跟上。'
            : 'The safest approach is short trips, timely returns, and steady boat upgrades. Do not hard-chase rare Brainrots early; upgrade speed and capacity first.'}
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

      <section className="mt-12 space-y-8">
        {pageSections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
            <p className="mt-3 text-base leading-7 text-foreground/90">{section.body}</p>
            {section.bullets ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '继续浏览相关页面' : 'Continue with related pages'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isZh
            ? '这页保留多个正文内链，让玩家能在 Brainrot 主题、Lucky Block、偷取玩法、短局场景和手机游戏之间继续浏览。'
            : 'This page keeps multiple contextual internal links so players can continue through Brainrot, Lucky Blocks, stealing, quick-play, and mobile-game paths.'}
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
