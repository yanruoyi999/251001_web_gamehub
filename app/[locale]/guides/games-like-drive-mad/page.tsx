import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { buildAbsoluteUrl, DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 86400;

interface GamesLikeDriveMadPageProps {
  params: { locale: string };
}

const PICKS = [
  {
    slug: 'drive-mad',
    title: 'Drive Mad',
    fit: 'Best first pick',
    zhFit: '首选入口',
    reason:
      'The original reference point for throttle-based physics driving, balance, jumps, and short retries.',
    zhReason:
      '物理驾驶、油门控制、平衡、跳跃和短局重试的核心参照页。',
    bestFor: 'Players who want the exact stunt-driving loop.',
    zhBestFor: '想直接玩原始物理驾驶循环的用户。',
  },
  {
    slug: 'assemble-and-drive-road-monsters',
    title: 'Assemble and Drive: Road Monsters',
    fit: 'Vehicle building + driving',
    zhFit: '组装车辆 + 驾驶',
    reason:
      'Adds a construction layer before the driving challenge, so it captures users who like vehicle experiments more than pure speed.',
    zhReason:
      '在驾驶前增加组装车辆的玩法，适合喜欢改车、试错和机关挑战的用户。',
    bestFor: 'Drive Mad fans who want more vehicle tinkering.',
    zhBestFor: '喜欢 Drive Mad 但想多一点造车试错的人。',
  },
  {
    slug: 'blumgi-rocket',
    title: 'Blumgi Rocket',
    fit: 'Boost and momentum',
    zhFit: '推进与惯性',
    reason:
      'A momentum-heavy driving game where launches, landings, and boost timing matter more than racing lines.',
    zhReason:
      '重视推进、落地和惯性节奏，比传统竞速更接近 Drive Mad 的物理手感。',
    bestFor: 'Players who enjoy jumps, boosts, and controlled chaos.',
    zhBestFor: '喜欢跳跃、加速和受控混乱的玩家。',
  },
  {
    slug: 'balance-duel',
    title: 'Balance Duel',
    fit: 'Balance pressure',
    zhFit: '平衡压力',
    reason:
      'Not a car game, but it trains the same patience: tiny corrections beat full-force inputs.',
    zhReason:
      '不是赛车游戏，但同样训练“轻点控制”和避免过度修正，适合 Drive Mad 卡平衡关的人。',
    bestFor: 'Players stuck on seesaws, rails, and landing puzzles.',
    zhBestFor: '卡在跷跷板、窄轨和落地关的玩家。',
  },
  {
    slug: 'big-tower-tiny-square',
    title: 'Big Tower Tiny Square',
    fit: 'Precision retries',
    zhFit: '精准重试',
    reason:
      'It replaces vehicle physics with platform precision, but keeps the same fast-retry frustration loop.',
    zhReason:
      '把车辆物理换成平台跳跃，但保留同样的短局失败、快速重试和精准落点。',
    bestFor: 'Players who like hard-but-fair retry loops.',
    zhBestFor: '喜欢高难但公平、失败后马上再来的玩家。',
  },
  {
    slug: 'tunnel-rush',
    title: 'Tunnel Rush',
    fit: 'Pure reaction break',
    zhFit: '反应力换脑',
    reason:
      'A good palate cleanser when Drive Mad feels too slow or too physics-heavy: no puzzle, only reaction and rhythm.',
    zhReason:
      '当 Drive Mad 的物理和卡关太磨人时，用纯反应和节奏换换脑。',
    bestFor: 'Players who want a faster reflex challenge between driving attempts.',
    zhBestFor: '想在驾驶卡关之间换成高速反应挑战的人。',
  },
];

const FAQS = {
  en: [
    {
      question: 'What is the best game like Drive Mad?',
      answer:
        'Start with Drive Mad itself if you want the exact throttle-and-balance loop. If you want something nearby, try Assemble and Drive: Road Monsters for vehicle experiments or Blumgi Rocket for boost-based momentum.',
    },
    {
      question: 'Are these Drive Mad alternatives free browser games?',
      answer:
        'Yes. The picks link to browser game pages on Luma Game Hub, so you can test them without installing an app or creating an account.',
    },
    {
      question: 'Which games are best if I like hard Drive Mad levels?',
      answer:
        'Try Balance Duel for careful correction practice and Big Tower Tiny Square if you enjoy hard, fast-retry precision challenges.',
    },
  ],
  zh: [
    {
      question: '最像 Drive Mad 的游戏是哪款?',
      answer:
        '如果你想要原汁原味的油门、平衡和翻车手感，还是先玩 Drive Mad。想要相近体验，可以试 Assemble and Drive: Road Monsters 的车辆组装，或 Blumgi Rocket 的推进与惯性。',
    },
    {
      question: '这些类似 Drive Mad 的游戏都能免费玩吗?',
      answer:
        '可以。这里推荐的是 Luma Game Hub 上可直接打开的浏览器游戏，不需要下载安装，也不需要注册 Luma 账号。',
    },
    {
      question: '如果我喜欢 Drive Mad 的难关，应该玩什么?',
      answer:
        '可以试 Balance Duel 练平衡和轻点控制，也可以试 Big Tower Tiny Square 体验更硬核的精准重试。',
    },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: GamesLikeDriveMadPageProps): Metadata {
  const locale = (params.locale as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const title = isZh
    ? '类似 Drive Mad 的物理驾驶小游戏推荐'
    : 'Best Physics Driving Games Like Drive Mad';
  const description = isZh
    ? '喜欢 Drive Mad 的翻车、跳跃、平衡和短局重试?这里整理类似 Drive Mad 的免费浏览器小游戏,按物理驾驶、车辆组装、推进惯性和精准重试分类推荐。'
    : 'Looking for games like Drive Mad? Compare free browser picks for physics driving, vehicle building, boost momentum, balance practice, and hard fast-retry challenges.';
  const path = getLocalizedPath(locale, '/guides/games-like-drive-mad');

  return {
    title,
    description,
    keywords: isZh
      ? ['类似 Drive Mad 的游戏', '物理驾驶小游戏', 'Drive Mad alternatives', '浏览器赛车游戏']
      : ['games like Drive Mad', 'physics driving games', 'Drive Mad alternatives', 'browser car games'],
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          getLocalizedPath(loc, '/guides/games-like-drive-mad'),
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: path,
      type: 'article',
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

export default function GamesLikeDriveMadPage({ params }: GamesLikeDriveMadPageProps) {
  const locale = (params.locale as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const pagePath = getLocalizedPath(locale, '/guides/games-like-drive-mad');
  const pageUrl = buildAbsoluteUrl(pagePath);
  const faqs = isZh ? FAQS.zh : FAQS.en;
  const headline = isZh
    ? '类似 Drive Mad 的物理驾驶小游戏'
    : 'Best Physics Driving Games Like Drive Mad';
  const description = isZh
    ? '把 Drive Mad 的真实搜索意图拆开:物理驾驶、翻车、平衡、跳跃、惯性和短局重试。'
    : 'Break the Drive Mad search intent into physics driving, flips, balance, jumps, momentum, and quick retries.';
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      mainEntityOfPage: pageUrl,
      inLanguage: isZh ? 'zh-CN' : 'en-US',
      author: {
        '@type': 'Organization',
        name: 'Luma Game Hub Editorial',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Luma Game Hub',
        url: buildAbsoluteUrl(getLocalizedPath(locale)),
      },
      articleSection: 'Browser Games',
      keywords: isZh
        ? '类似 Drive Mad 的游戏, 物理驾驶小游戏, 免费浏览器游戏'
        : 'games like Drive Mad, physics driving games, free browser games',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: headline,
      itemListElement: PICKS.map((pick, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: pick.title,
        url: buildAbsoluteUrl(getLocalizedPath(locale, `/games/${pick.slug}`)),
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <article className="mx-auto w-full max-w-5xl px-6 py-12">
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href={getLocalizedPath(locale, '/guides/drive-mad-walkthrough')} className="hover:text-primary">
          {isZh ? '← 返回 Drive Mad 全关攻略' : '← Back to the Drive Mad walkthrough'}
        </Link>
      </nav>

      <header className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">games like Drive Mad</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">{headline}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">{description}</p>
      </header>

      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {isZh ? '快速答案' : 'Quick answer'}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          {isZh ? '别只找赛车,要找物理驾驶和失败重试' : 'Do not just search for racing games. Search for physics and retries.'}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90">
          {isZh
            ? '喜欢 Drive Mad 的用户通常不是单纯想竞速,而是想要翻车、落地、油门轻点、短局失败后马上重来。所以下面的推荐按“物理驾驶、车辆组装、推进惯性、平衡练习、精准重试”来分,比普通赛车清单更接近真实需求。'
            : 'Drive Mad fans usually want more than racing: they want flips, landings, tiny throttle corrections, and fast retries after funny failures. These picks are grouped by physics driving, vehicle building, boost momentum, balance practice, and precision retries.'}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-medium">
          <a href="#picks" className="rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-sm transition hover:bg-primary/90">
            {isZh ? '查看推荐清单' : 'See the picks'}
          </a>
          <a href="#choose" className="rounded-full border border-primary/30 bg-background px-4 py-2 text-primary transition hover:bg-primary/10">
            {isZh ? '按玩法选择' : 'Choose by play style'}
          </a>
          <a href="#faq" className="rounded-full border border-border bg-background px-4 py-2 text-foreground transition hover:bg-secondary">
            FAQ
          </a>
        </div>
      </section>

      <section id="picks" className="mt-12 scroll-mt-24">
        <div className="grid gap-6 md:grid-cols-2">
          {PICKS.map((pick) => (
            <Card key={pick.slug} className="flex h-full flex-col justify-between border border-border">
              <CardHeader>
                <div className="text-sm font-semibold text-primary">{isZh ? pick.zhFit : pick.fit}</div>
                <CardTitle className="text-2xl font-semibold text-foreground">{pick.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-5 text-sm text-foreground/90">
                <p>{isZh ? pick.zhReason : pick.reason}</p>
                <p className="rounded-xl bg-secondary p-3 text-muted-foreground">
                  {isZh ? pick.zhBestFor : pick.bestFor}
                </p>
                <Link
                  href={getLocalizedPath(locale, `/games/${pick.slug}`)}
                  className="mt-auto inline-flex items-center text-primary transition hover:text-primary/80"
                  prefetch
                >
                  {isZh ? `打开 ${pick.title} 游戏页` : `Open ${pick.title}`} →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="choose" className="mt-16 rounded-2xl border border-border bg-card p-6 shadow-sm scroll-mt-24">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '怎么按 Drive Mad 的卡点选下一款游戏' : 'How to choose by the part of Drive Mad you like'}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(isZh
            ? [
                ['喜欢翻车和落地', '先玩 Blumgi Rocket,再回到 Drive Mad 练落地前松油门。'],
                ['喜欢造车和怪兽卡车', '试 Assemble and Drive: Road Monsters,更偏车辆组装和机关试错。'],
                ['总卡在平衡关', '试 Balance Duel,练轻点控制和避免过度修正。'],
                ['喜欢高难重试', '试 Big Tower Tiny Square,把物理车感换成平台跳跃精准度。'],
              ]
            : [
                ['Flips and landings', 'Try Blumgi Rocket, then return to Drive Mad and practice releasing the throttle before landing.'],
                ['Vehicle experiments', 'Try Assemble and Drive: Road Monsters for more building and mechanism testing.'],
                ['Balance puzzles', 'Try Balance Duel to practice tiny corrections and patience.'],
                ['Hard fast retries', 'Try Big Tower Tiny Square for the same restart loop with platform precision.'],
              ]
          ).map(([title, body]) => (
            <div key={title} className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mt-16 rounded-2xl border border-border bg-secondary p-8 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <dl className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <dt className="text-base font-semibold text-foreground">{faq.question}</dt>
              <dd className="mt-2 text-sm text-foreground/90">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 text-center">
        <Button asChild size="lg" className="bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90">
          <Link href={getLocalizedPath(locale, '/guides/drive-mad-walkthrough')}>
            {isZh ? '回到 Drive Mad 全关攻略' : 'Return to the Drive Mad walkthrough'}
          </Link>
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">
          {isZh
            ? '这页用于承接 Drive Mad 相似游戏长尾词,并把用户重新导回攻略和游戏详情页。'
            : 'This page captures Drive Mad alternative queries and routes users back to the walkthrough and game pages.'}
        </p>
      </section>
    </article>
  );
}
