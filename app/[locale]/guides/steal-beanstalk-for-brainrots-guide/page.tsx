import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  DEFAULT_OPEN_GRAPH_IMAGES,
  DEFAULT_TWITTER_IMAGES,
  buildAbsoluteUrl,
} from '@/lib/seo';

const PATH = '/guides/steal-beanstalk-for-brainrots-guide';
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
      title: 'Understand the core loop first',
      body:
        'This style of Brainrot game is not just about clicking. The useful loop is: grow resources, unlock higher-value targets, steal or defend, return to base, and upgrade. New players should stabilize income and routes before chasing rare targets.',
      bullets: [
        'Learn safe zones and return paths first.',
        'Spend early resources on stable production.',
        'Do not break your rhythm for one risky rare target.',
      ],
    },
    {
      title: 'Beanstalk upgrade priority',
      body:
        'Early upgrades should improve income or unlock new areas. Later upgrades can focus on stealing efficiency. That structure also answers long-tail searches around upgrades, new worlds, and rare Brainrots.',
      bullets: [
        'Phase 1: production and basic capacity.',
        'Phase 2: route efficiency and risk control.',
        'Phase 3: rare targets, index completion, and high-value stealing.',
      ],
    },
    {
      title: 'How to reduce failed steals',
      body:
        'Most failed steals come from taking a route that is too long or changing targets before you know the escape window. Treat every steal as a short round instead of improvising deep in the map.',
      bullets: [
        'Start with targets near a return path.',
        'Check the escape time before chasing a high-value target.',
        'On mobile, test turning and tap delay before longer runs.',
      ],
    },
    {
      title: 'Safe Luma page boundary',
      body:
        'This page is an independent guide and discovery page. It does not copy platform assets, does not claim official status, and does not offer suspicious downloads. An embedded player should only be added after the source and permission are clear.',
    },
  ],
  zh: [
    {
      title: '先理解核心循环',
      body:
        '这类 Brainrot 游戏的核心不是单纯点击，而是“成长资源 → 解锁更高价值目标 → 偷取或防守 → 回到基地升级”的循环。新手先不要追稀有目标，先把基础产出和移动路线稳定下来。',
      bullets: ['先观察安全区和返回路线。', '把早期资源用于提高稳定产出。', '不要为了一个稀有目标连续冒险导致节奏断掉。'],
    },
    {
      title: 'Beanstalk 升级优先级',
      body:
        '前期优先升级能直接增加产出或解锁新区域的项目，后期再考虑提高偷取效率。这样页面内容可以自然承接 upgrades、new worlds、rare brainrots 等长尾搜索。',
      bullets: ['第一阶段：产出和基础容量。', '第二阶段：路线效率和风险控制。', '第三阶段：稀有目标、图鉴补全和高收益偷取。'],
    },
    {
      title: '如何降低偷取失败率',
      body:
        '偷取玩法最容易失败在两点：进攻路径太长，撤退前没有确认安全窗口。把每次偷取看成短回合，不要在地图深处临时改变目标。',
      bullets: ['先选离返回点近的目标。', '看到高价值目标也要评估撤退时间。', '移动端先测试转向和点击延迟。'],
    },
    {
      title: '适合 Luma 的页面边界',
      body:
        '本页只做独立攻略和发现说明，不复制平台素材，不声称官方身份，也不提供可疑下载。后续只有在确认授权来源时，才适合考虑嵌入游戏播放器。',
    },
  ],
};

const relatedLinks: Record<Locale, InternalLink[]> = {
  en: [
    {
      href: '/guides/brainrot-games',
      label: 'Brainrot Games Online',
      description: 'Return to the hub for craft, steal, merge, obby, Lucky Blocks, and mobile Brainrot searches.',
    },
    {
      href: '/guides/lucky-blocks-for-brainrots-guide',
      label: 'Lucky Blocks guide',
      description: 'Compare stealing loops with Lucky Block farming, index completion, and rebirth timing.',
    },
    {
      href: '/guides/float-for-brainrots-guide',
      label: 'Float for Brainrots guide',
      description: 'Compare this stealing loop with boat upgrades, rarity routes, and shark pressure.',
    },
    {
      href: '/guides/no-download-games',
      label: 'No Download Games',
      description: 'Move download-sensitive users toward safe browser-game discovery pages.',
    },
    {
      href: '/guides/best-free-iphone-games',
      label: 'Best Free iPhone Games',
      description: 'Give mobile players a broader no-download Safari and Chrome game path.',
    },
  ],
  zh: [
    {
      href: '/guides/brainrot-games',
      label: 'Brainrot Games Online 合集',
      description: '回到主题 Hub，继续浏览合成、偷取、收集、Obby、Lucky Blocks 和移动端 Brainrot 机会。',
    },
    {
      href: '/guides/lucky-blocks-for-brainrots-guide',
      label: 'Lucky Blocks 攻略',
      description: '把偷取循环和 Lucky Block 刷取、Index 图鉴、Rebirth 重生做横向对比。',
    },
    {
      href: '/guides/float-for-brainrots-guide',
      label: 'Float for Brainrots 攻略',
      description: '把偷取循环和船只升级、稀有路线、鲨鱼压力做横向对比。',
    },
    {
      href: '/guides/no-download-games',
      label: '无需下载小游戏',
      description: '把有下载顾虑的玩家导向更安全的浏览器小游戏说明页。',
    },
    {
      href: '/guides/best-free-iphone-games',
      label: 'iPhone 免费小游戏',
      description: '给手机用户补充 Safari 和 Chrome 里可试玩的无需下载入口。',
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
    ? 'Steal Beanstalk for Brainrots 攻略 | 升级、偷取与稀有收集'
    : 'Steal Beanstalk for Brainrots Guide: Grow, Steal and Unlock Rare Brainrots';
  const description = isZh
    ? 'Steal Beanstalk for Brainrots 新手攻略：如何理解偷取循环、Beanstalk 升级、新世界、稀有 Brainrots、移动端体验和安全游玩边界。'
    : 'A practical Steal Beanstalk for Brainrots guide covering the stealing loop, beanstalk upgrades, new worlds, rare Brainrots, mobile play, and safe browser-game notes.';

  return {
    title,
    description,
    keywords: [
      'steal beanstalk for brainrots guide',
      'steal beanstalk for brainrots rare brainrots',
      'steal beanstalk for brainrots upgrades',
      'how to steal brainrots',
      'brainrot beanstalk game',
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

export default function StealBeanstalkForBrainrotsGuide({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const isZh = locale === 'zh';
  const pageUrl = buildAbsoluteUrl(getLocalizedPath(locale, PATH));
  const pageSections = sections[locale];
  const links = relatedLinks[locale];
  const faqItems = isZh
    ? [
        {
          question: 'Steal Beanstalk for Brainrots 最先升级什么？',
          answer: '先升稳定产出、基础容量和能打开新区域的项目，再考虑高风险偷取效率。前期稳定比追稀有更重要。',
        },
        {
          question: '这个游戏手机上适合玩吗？',
          answer: '可以先试玩短局，但要重点检查转向、点击延迟、画面是否被裁切，以及返回基地按钮是否清楚。',
        },
        {
          question: 'Luma 会直接嵌入这个游戏吗？',
          answer: '当前更适合先做原创攻略和官方来源说明。确认授权与素材风险后，再考虑加入可播放嵌入。',
        },
      ]
    : [
        {
          question: 'What should I upgrade first in Steal Beanstalk for Brainrots?',
          answer: 'Start with stable income, basic capacity, and unlock paths before investing heavily in risky stealing efficiency. Consistency matters more than rare targets early.',
        },
        {
          question: 'Is it good on mobile?',
          answer: 'Test a short round first. Pay attention to turning, tap delay, canvas cropping, and whether the return-to-base path is clear on your screen.',
        },
        {
          question: 'Will Luma embed the game directly?',
          answer: 'The safer first step is an original guide with source context. A playable embed should wait until permission and asset risk are clear.',
        },
      ];

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: isZh ? 'Steal Beanstalk for Brainrots 攻略' : 'Steal Beanstalk for Brainrots Guide',
      description: isZh
        ? '面向新词搜索的 Steal Beanstalk for Brainrots 攻略页。'
        : 'A search-focused guide for Steal Beanstalk for Brainrots.',
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
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          steal beanstalk for brainrots guide
        </p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">
          {isZh
            ? 'Steal Beanstalk for Brainrots 攻略：升级、偷取与稀有收集'
            : 'Steal Beanstalk for Brainrots Guide: Grow, Steal and Unlock Rare Brainrots'}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          {isZh
            ? '这是一页面向新词搜索的原创攻略：帮助玩家快速理解偷取循环、升级优先级、稀有目标和移动端测试点，同时保持版权与 AdSense 风险可控。'
            : 'This original guide targets fresh search intent: stealing loops, upgrade priority, rare targets, and mobile checks, while keeping copyright and AdSense risk under control.'}
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '快速答案' : 'Quick answer'}
        </h2>
        <p className="mt-3 text-base leading-7 text-foreground/90">
          {isZh
            ? '前期不要盲目追稀有 Brainrots。先把 Beanstalk 产出、路线和返回节奏稳定，再用短回合偷取方式补图鉴。'
            : 'Do not chase rare Brainrots too early. Stabilize beanstalk production, routes, and return timing first, then use short stealing rounds to fill the index.'}
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
            ? '这页保留多个正文内链，既能把玩家带回 Brainrot 主题集群，也能分流到 Lucky Block、手机和无需下载场景。'
            : 'This page keeps multiple contextual internal links so players can move through the Brainrot cluster, Lucky Blocks, mobile intent, and no-download paths.'}
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
