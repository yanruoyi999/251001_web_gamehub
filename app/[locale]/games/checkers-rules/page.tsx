import type { Metadata } from 'next';
import Link from 'next/link';

import { LumaCheckersGame } from '@/components/game/luma-checkers-game';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { LUMA_CHECKERS_PATH } from '@/lib/games/luma-checkers-seo';
import { buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86_400;

const pageCopy = {
  en: {
    title: 'Checkers Rules and Play Online | Luma Checkers',
    description:
      'Learn core American checkers rules and practise them in an original local browser trainer with mandatory captures, kings, and multi-jumps.',
    eyebrow: 'Luma original browser game',
    heading: 'Checkers Rules Trainer',
    intro:
      'Learn the core rules by playing them: select a piece, follow highlighted legal moves, and see mandatory captures and promotions enforced on the board.',
    back: 'Browse games',
    sections: [
      [
        'How to play this checkers trainer',
        'Start a local two-player game on one device. Red moves first. Select one of your pieces, then select a highlighted destination. If a capture creates another jump, the same turn stays active so the multi-jump rule is visible on the board.',
      ],
      [
        'Mandatory captures and kings',
        'When any piece can capture, ordinary step moves are unavailable for that turn. A regular man moves diagonally forward and becomes a king after reaching the far row. Kings move and capture diagonally in both directions. Regional rule sets can differ, so this page labels the exact rule set used by the trainer.',
      ],
      [
        'Local play and privacy',
        'The board runs in your browser for two people sharing one device. There is no sign-in, matchmaking, uploaded board state, or player profile. Analytics records only bounded game status such as move type, winner, move count, and duration bucket; it does not record square coordinates.',
      ],
    ],
    faqTitle: 'Checkers Rules FAQ',
    faqs: [
      [
        'Who moves first in this trainer?',
        'Red moves first. The current turn is shown beside the board.',
      ],
      [
        'Do I have to capture in checkers?',
        'Yes. When a capture is available, the trainer highlights captures and does not allow an ordinary step.',
      ],
      [
        'What happens after a capture?',
        'If the same piece can capture again, the turn stays with that player and the next jump is highlighted.',
      ],
      [
        'Is this an official Checkers game or online service?',
        'No. It is an original Luma local two-player browser experiment with no third-party embed.',
      ],
    ],
    sourceLabel: 'Read the official rules reference',
    relatedTitle: 'Keep exploring Luma',
    related: [
      [
        '/games/draw-a-perfect-circle',
        'Draw a Perfect Circle',
        'Try an original geometry-scored drawing challenge.',
      ],
      [
        '/games/snake-3d',
        'Snake Game 3D',
        'Play a short original snake challenge with touch controls.',
      ],
      [
        '/guides/quick-play-guide',
        'Quick browser games',
        'Find more short-session games with clear controls.',
      ],
    ],
    home: 'Home',
    games: 'Games',
  },
  zh: {
    title: 'Checkers 规则与在线训练器 | Luma Checkers',
    description:
      '在线了解 Checkers 核心规则，体验强制吃子、升王和连续跳吃。Luma 原创本地浏览器训练器。',
    eyebrow: 'Luma 原创浏览器游戏',
    heading: 'Checkers 规则训练器',
    intro:
      '通过实际走子理解核心规则：选择棋子，跟随高亮合法走法，让棋盘自动执行强制吃子和升王。',
    back: '浏览游戏',
    sections: [
      [
        '怎么玩这个 Checkers 训练器',
        '在同一台设备上开始双人本地对局，红方先手。选择己方棋子，再选择高亮落点。如果一次吃子后还能继续跳吃，训练器会保留当前回合，让连续跳吃规则直接体现在棋盘上。',
      ],
      [
        '强制吃子与升王',
        '只要任意棋子存在吃子机会，本回合就不能选择普通移动。普通棋子斜向前移动，到达对方底线后升为王；王可以向两个方向斜向移动和吃子。不同地区规则可能不同，本页明确采用训练器中的规则版本。',
      ],
      [
        '本地对局与隐私',
        '棋盘在浏览器本地运行，适合两个人共用一台设备。不需要登录、匹配、上传棋盘或创建玩家资料。分析只记录走法类型、胜方、步数和时长区间等有限状态，不记录格子坐标。',
      ],
    ],
    faqTitle: 'Checkers 规则常见问题',
    faqs: [
      ['谁先走？', '红方先走，棋盘旁会显示当前回合。'],
      [
        'Checkers 一定要吃子吗？',
        '是的。只要存在吃子机会，训练器会高亮吃子，不允许普通移动。',
      ],
      [
        '吃子后会发生什么？',
        '如果同一个棋子还能继续吃子，回合会保留给当前玩家，并高亮下一次跳吃。',
      ],
      [
        '这是官方 Checkers 游戏或在线服务吗？',
        '不是。这是 Luma Game Hub 的原创本地双人规则实验，不使用第三方嵌入。',
      ],
    ],
    sourceLabel: '查看官方规则参考',
    relatedTitle: '继续探索 Luma',
    related: [
      [
        '/games/draw-a-perfect-circle',
        '在线画一个完美的圆',
        '体验原创几何评分绘图挑战。',
      ],
      ['/games/snake-3d', '3D 贪吃蛇', '体验带触控操作的原创短局贪吃蛇。'],
      [
        '/guides/quick-play-guide',
        '快速浏览器游戏',
        '寻找操作清楚的短局游戏。',
      ],
    ],
    home: '首页',
    games: '游戏',
  },
} as const;

interface LumaCheckersPageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(value: string): Locale {
  return value === 'en' ? 'en' : 'zh';
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: LumaCheckersPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const canonical = getLocalizedPath(locale, LUMA_CHECKERS_PATH);

  return {
    title: content.title,
    description: content.description,
    keywords:
      locale === 'en'
        ? [
            'checkers rules',
            'checkers rules trainer',
            'checkers game online',
            'mandatory capture checkers',
          ]
        : ['Checkers 规则', '跳棋规则训练器', '在线 Checkers', '强制吃子规则'],
    robots: { index: false, follow: true },
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath('zh', LUMA_CHECKERS_PATH),
        'en-US': getLocalizedPath('en', LUMA_CHECKERS_PATH),
        'x-default': getLocalizedPath('en', LUMA_CHECKERS_PATH),
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonical,
      type: 'website',
    },
  };
}

export default async function LumaCheckersPage({
  params,
}: LumaCheckersPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const canonical = getLocalizedPath(locale, LUMA_CHECKERS_PATH);
  const pageUrl = buildAbsoluteUrl(canonical);
  const faqs = content.faqs.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  }));
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: 'Luma Checkers',
      url: pageUrl,
      description: content.description,
      applicationCategory: 'Game',
      gamePlatform: 'Web browser',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      author: {
        '@type': 'Organization',
        name: 'Luma Game Hub',
        url: buildAbsoluteUrl('/about'),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: content.home,
          item: buildAbsoluteUrl(getLocalizedPath(locale, '/')),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.games,
          item: buildAbsoluteUrl(getLocalizedPath(locale, '/games')),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: content.heading,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
        />
      ))}

      <header className="mb-8 flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            {content.eyebrow}
          </p>
          <h1
            id="luma-checkers-title"
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            {content.heading}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            {content.intro}
          </p>
        </div>
        <Link
          href={getLocalizedPath(locale, '/games')}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {content.back}
        </Link>
      </header>

      <LumaCheckersGame locale={locale} />

      <article className="mt-12 space-y-10">
        {content.sections.map(([title, body]) => (
          <section key={title} className="border-t border-border pt-7">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-3 max-w-4xl text-base leading-7 text-muted-foreground">
              {body}
            </p>
          </section>
        ))}

        <section className="border-t border-border pt-7">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {content.faqTitle}
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {content.faqs.map(([question, answer]) => (
              <div key={question}>
                <h3 className="text-base font-semibold text-foreground">
                  {question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="border-t border-border pt-7 text-sm leading-6 text-muted-foreground">
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://www.hasbro.com/common/instruct/Checkers%281994%29.PDF"
            target="_blank"
            rel="noreferrer"
          >
            {content.sourceLabel}
          </a>
        </p>

        <section className="border-t border-border pt-7">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {content.relatedTitle}
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            {content.related.map(([href, title, description]) => (
              <div key={href}>
                <Link
                  href={getLocalizedPath(locale, href)}
                  className="text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {title}
                </Link>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
