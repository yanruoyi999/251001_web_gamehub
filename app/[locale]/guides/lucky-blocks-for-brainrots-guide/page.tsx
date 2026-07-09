import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  DEFAULT_OPEN_GRAPH_IMAGES,
  DEFAULT_TWITTER_IMAGES,
  buildAbsoluteUrl,
} from '@/lib/seo';

const PATH = '/guides/lucky-blocks-for-brainrots-guide';
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
      title: 'Understand the Lucky Block loop first',
      body:
        'Lucky Blocks for Brainrots is best treated as a repeatable discovery loop: break blocks, reveal Brainrots, update the index, decide whether to keep farming, then rebirth when the next run will become faster. New players should not only chase the rarest result; they should make each run more efficient.',
      bullets: [
        'Break nearby blocks first so the early run stays fast.',
        'Watch which Brainrots are already in your index before farming the same area again.',
        'Use rebirth as a speed reset, not as a panic button after one slow run.',
      ],
    },
    {
      title: 'Index completion strategy',
      body:
        'The index is the natural long-tail search hook for this game. A useful guide should help players understand what they are missing and how to structure attempts, even when exact drop tables can change between portal versions.',
      bullets: [
        'Start with common and uncommon Brainrots to learn how blocks behave.',
        'Farm one area long enough to confirm whether it is still producing new entries.',
        'Move on when repeated blocks only give duplicates and your next upgrade is affordable.',
      ],
    },
    {
      title: 'When to rebirth',
      body:
        'Rebirth systems are usually strongest when they make the next run meaningfully faster. If rebirth only resets progress without giving a useful multiplier or unlock, delay it until the benefit is clear.',
      bullets: [
        'Rebirth after a meaningful index or income milestone.',
        'Avoid rebirthing while you are one upgrade away from better farming speed.',
        'Track whether the next run feels faster in the first minute.',
      ],
    },
    {
      title: 'Mobile controls and safe play notes',
      body:
        'Lucky-block games can feel simple on desktop but awkward on a phone if tap zones, camera movement, or UI buttons overlap. Luma treats this as an independent guide page first and avoids copied assets, suspicious downloads, and any claim of official affiliation.',
      bullets: [
        'Test one short round on mobile before a long farming session.',
        'Use landscape if buttons or the index panel feel cramped.',
        'Avoid pages that turn a browser game search into APK, plugin, or extension downloads.',
      ],
    },
  ],
  zh: [
    {
      title: '先理解 Lucky Block 循环',
      body:
        'Lucky Blocks for Brainrots 更适合看成一个重复探索循环：打碎方块、抽出 Brainrots、更新图鉴、判断是否继续刷，再在下一轮明显更快时重生。新手不要只盯着最稀有结果，而要让每一轮更高效。',
      bullets: ['先打附近方块，让早期节奏变快。', '重复刷同一区域前，先看图鉴还有没有新增。', '把重生当成加速下一轮的工具，不是一局慢了就马上重开。'],
    },
    {
      title: 'Index 图鉴补全策略',
      body:
        'Index 是这款游戏最适合做长尾攻略的入口。真正有用的页面，不只是写“all Brainrots list”，还要告诉玩家如何判断缺什么、什么时候继续刷、什么时候换区域。',
      bullets: ['先用普通和稀有度较低的 Brainrots 熟悉方块机制。', '一个区域刷到连续重复时，再考虑换路线。', '下一次升级已经够近时，不要为了一个未知掉落硬拖时间。'],
    },
    {
      title: '什么时候该 Rebirth',
      body:
        '重生系统通常只有在下一轮明显变快时才值得用。如果重生只是清空进度，而没有明显倍率、速度或新内容收益，就先推迟到收益明确。',
      bullets: ['达到一个重要图鉴或收益节点后再重生。', '距离关键升级只差一点时，先完成升级再判断。', '重生后第一分钟就要能感觉到效率提高。'],
    },
    {
      title: '移动端体验和安全边界',
      body:
        'Lucky Block 类游戏在电脑上可能很轻松，但手机上会被点击区域、镜头移动和 UI 遮挡影响。Luma 先做独立攻略页，不复制素材、不提供可疑下载，也不声称官方身份。',
      bullets: ['手机上先试玩一小局，再决定是否长时间刷。', '按钮或图鉴面板太挤时，优先尝试横屏。', '避开要求下载 APK、插件或浏览器扩展的镜像站。'],
    },
  ],
};

const relatedLinks: Record<Locale, InternalLink[]> = {
  en: [
    {
      href: '/guides/brainrot-games',
      label: 'Brainrot Games Online',
      description: 'Return to the Brainrot hub for craft, steal, collect, obby, and mobile discovery paths.',
    },
    {
      href: '/guides/steal-beanstalk-for-brainrots-guide',
      label: 'Steal Beanstalk guide',
      description: 'Compare lucky-block index farming with stealing loops, beanstalk upgrades, and rare targets.',
    },
    {
      href: '/guides/float-for-brainrots-guide',
      label: 'Float for Brainrots guide',
      description: 'Compare index completion with boat upgrades, rarity routes, and shark pressure.',
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
      description: '回到 Brainrot 主题 Hub，继续浏览合成、偷取、收集、Obby 和手机玩法。',
    },
    {
      href: '/guides/steal-beanstalk-for-brainrots-guide',
      label: 'Steal Beanstalk 攻略',
      description: '把 Lucky Block 图鉴刷取和偷取循环、Beanstalk 升级、稀有目标做横向对比。',
    },
    {
      href: '/guides/float-for-brainrots-guide',
      label: 'Float for Brainrots 攻略',
      description: '把图鉴补全和船只升级、稀有路线、鲨鱼压力做对比。',
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
    ? 'Lucky Blocks for Brainrots 攻略 | 图鉴、重生与移动端技巧'
    : 'Lucky Blocks for Brainrots Guide: Index, Rebirth and Mobile Tips';
  const description = isZh
    ? 'Lucky Blocks for Brainrots 攻略：如何打 Lucky Blocks、补全 Brainrots 图鉴、判断重生时机、优化移动端体验，并避开可疑下载入口。'
    : 'A Lucky Blocks for Brainrots guide covering block breaking, Brainrots index completion, rebirth timing, mobile controls, and safer no-download browser play.';

  return {
    title,
    description,
    keywords: [
      'lucky blocks for brainrots guide',
      'lucky blocks for brainrots all brainrots',
      'lucky blocks for brainrots index',
      'lucky blocks for brainrots rebirth',
      'lucky blocks for brainrots mobile',
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

export default function LuckyBlocksForBrainrotsGuide({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const isZh = locale === 'zh';
  const pageUrl = buildAbsoluteUrl(getLocalizedPath(locale, PATH));
  const pageSections = sections[locale];
  const links = relatedLinks[locale];
  const faqItems = isZh
    ? [
        {
          question: 'Lucky Blocks for Brainrots 新手先做什么？',
          answer: '先打附近方块，快速补普通和低稀有度图鉴，再判断哪些区域还会产出新 Brainrots。不要一开始就只追最高稀有度。',
        },
        {
          question: '什么时候该 Rebirth？',
          answer: '当重生能明显提升下一轮速度、收益或解锁路径时再用。如果只是清空进度而收益不清楚，就先继续升级和补图鉴。',
        },
        {
          question: '手机上玩 Lucky Blocks for Brainrots 要注意什么？',
          answer: '重点检查按钮是否遮挡、点击是否延迟、图鉴面板是否太小。若界面拥挤，优先横屏或改用桌面端。',
        },
      ]
    : [
        {
          question: 'What should beginners do first in Lucky Blocks for Brainrots?',
          answer: 'Break nearby blocks, fill common and low-rarity index entries, then check which areas still produce new Brainrots. Do not chase only the rarest result at the start.',
        },
        {
          question: 'When should I rebirth?',
          answer: 'Rebirth when it clearly improves the next run through speed, income, or unlocks. If the benefit is unclear, keep upgrading and filling the index first.',
        },
        {
          question: 'What should I check on mobile?',
          answer: 'Check button overlap, tap delay, and whether the index panel is readable. If the interface feels cramped, try landscape or desktop.',
        },
      ];

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: isZh ? 'Lucky Blocks for Brainrots 攻略' : 'Lucky Blocks for Brainrots Guide',
      description: isZh
        ? '面向图鉴补全、重生和移动端体验的 Lucky Blocks for Brainrots 攻略页。'
        : 'A Lucky Blocks for Brainrots guide for index completion, rebirth timing, and mobile checks.',
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
          lucky blocks for brainrots guide
        </p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">
          {isZh
            ? 'Lucky Blocks for Brainrots 攻略：图鉴、重生与移动端技巧'
            : 'Lucky Blocks for Brainrots Guide: Index, Rebirth and Mobile Tips'}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          {isZh
            ? '这页用于承接最新 Brainrot 长尾搜索：all Brainrots、Index、Rebirth、Lucky Blocks、mobile controls，同时保持安全、原创和可内链。'
            : 'This page captures fresh Brainrot long-tail searches around all Brainrots, index, rebirth, Lucky Blocks, and mobile controls while keeping the page safe, original, and internally linked.'}
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '快速答案' : 'Quick answer'}
        </h2>
        <p className="mt-3 text-base leading-7 text-foreground/90">
          {isZh
            ? '最稳的玩法是先打附近 Lucky Blocks，快速补低稀有度图鉴，再在重生收益明确时重开下一轮。不要为了一个未知稀有掉落拖慢整局效率。'
            : 'The safest route is to break nearby Lucky Blocks, fill low-rarity index entries quickly, and rebirth only when the next run becomes clearly faster. Do not slow the whole run for one unknown rare drop.'}
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
            ? '这页把 Lucky Block、Brainrot Hub、偷取玩法、航行收集和手机/无需下载场景连接起来，避免新攻略孤立。'
            : 'This page connects Lucky Blocks with the Brainrot hub, stealing games, ocean collection, mobile play, and no-download intent so the new guide is not isolated.'}
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
