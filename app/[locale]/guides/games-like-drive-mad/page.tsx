import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { buildAbsoluteUrl, DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 86400;

interface PageProps {
  params: { locale: string };
}

const picks = [
  {
    slug: 'drive-mad',
    title: 'Drive Mad',
    tag: 'Original physics driving',
    tagZh: '原始物理驾驶',
    summary:
      'Start here if you want the exact throttle, balance, jump, and landing loop that makes Drive Mad addictive.',
    summaryZh:
      '如果你想要原汁原味的油门、平衡、跳跃和落地手感，先从 Drive Mad 本体开始。',
    bestFor: 'Players who want the reference game before comparing alternatives.',
    bestForZh: '想先玩原作，再比较相似游戏的玩家。',
  },
  {
    slug: 'assemble-and-drive-road-monsters',
    title: 'Assemble and Drive: Road Monsters',
    tag: 'Build and test vehicles',
    tagZh: '组装车辆再试车',
    summary:
      'This is the closest pick when you like the vehicle-experiment side of Drive Mad: build, test, fail, adjust, and try again.',
    summaryZh:
      '如果你喜欢 Drive Mad 里的车辆试错感，这款更偏组装、测试、失败、调整、再来一次。',
    bestFor: 'Players who enjoy monster trucks, parts, and mechanical experiments.',
    bestForZh: '喜欢怪兽卡车、零件搭配和机关试错的玩家。',
  },
  {
    slug: 'blumgi-rocket',
    title: 'Blumgi Rocket',
    tag: 'Boost momentum',
    tagZh: '推进与惯性',
    summary:
      'A strong Drive Mad alternative for players who enjoy launch timing, boost control, and landing after a chaotic jump.',
    summaryZh:
      '适合喜欢起跳时机、推进控制和混乱落地的玩家，比普通赛车更接近物理驾驶。',
    bestFor: 'Players who want more speed without losing the physics challenge.',
    bestForZh: '想要更快节奏，但仍保留物理挑战的人。',
  },
  {
    slug: 'balance-duel',
    title: 'Balance Duel',
    tag: 'Balance practice',
    tagZh: '平衡练习',
    summary:
      'Not a car game, but it trains the same habit that clears hard Drive Mad stages: small corrections beat full-force inputs.',
    summaryZh:
      '它不是赛车，但能训练 Drive Mad 难关最需要的习惯：小幅修正比猛冲更重要。',
    bestFor: 'Players stuck on seesaws, rails, and narrow-platform levels.',
    bestForZh: '卡在跷跷板、窄轨和平台平衡关的人。',
  },
  {
    slug: 'big-tower-tiny-square',
    title: 'Big Tower Tiny Square',
    tag: 'Precision retries',
    tagZh: '精准重试',
    summary:
      'It swaps car physics for platform precision, but keeps the same fast-retry loop that makes hard Drive Mad levels satisfying.',
    summaryZh:
      '它把车辆物理换成平台跳跃，但保留了高难失败后马上重来的爽感。',
    bestFor: 'Players who like hard but fair one-more-try challenges.',
    bestForZh: '喜欢高难但公平、失败后马上再来的玩家。',
  },
  {
    slug: 'tunnel-rush',
    title: 'Tunnel Rush',
    tag: 'Reaction break',
    tagZh: '反应力换脑',
    summary:
      'Use this as a fast reflex break when Drive Mad starts to feel too slow, too tricky, or too physics-heavy.',
    summaryZh:
      '当 Drive Mad 的物理卡关太磨人时，可以用这款纯反应游戏换换脑。',
    bestFor: 'Players who want a short high-speed reset before returning to driving games.',
    bestForZh: '想短暂切换到高速反应挑战，再回来继续驾驶的人。',
  },
];

const faqs = {
  en: [
    {
      question: 'What are the best games like Drive Mad?',
      answer:
        'Start with Assemble and Drive: Road Monsters for vehicle experiments, Blumgi Rocket for boost momentum, Balance Duel for careful correction practice, and Big Tower Tiny Square for hard fast-retry precision.',
    },
    {
      question: 'Are these Drive Mad alternatives free browser games?',
      answer:
        'Yes. The recommended games link to Luma Game Hub browser pages, so you can test them without installing an app or creating a Luma account.',
    },
    {
      question: 'What should I play if Drive Mad levels feel too hard?',
      answer:
        'If you struggle with balance and landings, try Balance Duel first. If you like the repeated challenge but want a different control style, try Big Tower Tiny Square.',
    },
  ],
  zh: [
    {
      question: '类似 Drive Mad 的游戏有哪些?',
      answer:
        '优先试 Assemble and Drive: Road Monsters、Blumgi Rocket、Balance Duel 和 Big Tower Tiny Square。它们分别对应车辆组装、推进惯性、平衡练习和高难重试。',
    },
    {
      question: '这些 Drive Mad 替代游戏都是免费浏览器游戏吗?',
      answer:
        '是的。本页推荐的游戏都链接到 Luma Game Hub 的浏览器游戏页面，不需要下载应用，也不需要注册 Luma 账号。',
    },
    {
      question: 'Drive Mad 太难时应该先玩哪款?',
      answer:
        '如果你卡在平衡和落地，先试 Balance Duel。如果你喜欢反复挑战但想换一种操作方式，可以试 Big Tower Tiny Square。',
    },
  ],
};

const playStyles = {
  en: [
    ['Throttle and landing control', 'Drive Mad and Blumgi Rocket are the closest picks because they reward controlled launches and stable landings.'],
    ['Vehicle experiments', 'Assemble and Drive: Road Monsters is better when you want to test vehicle parts instead of only holding the gas.'],
    ['Balance and patience', 'Balance Duel helps train the tiny corrections needed for seesaws, rails, and narrow Drive Mad platforms.'],
    ['Hard retry loops', 'Big Tower Tiny Square is not a driving game, but it matches the same one-more-try rhythm.'],
  ],
  zh: [
    ['油门与落地控制', 'Drive Mad 和 Blumgi Rocket 最接近，因为它们都奖励稳定起跳和落地前控制。'],
    ['车辆试错', 'Assemble and Drive: Road Monsters 更适合想组装零件、测试车辆，而不是只踩油门的人。'],
    ['平衡与耐心', 'Balance Duel 能训练跷跷板、窄轨和平台关最需要的小幅修正。'],
    ['高难重试', 'Big Tower Tiny Square 不是驾驶游戏，但它有同样的失败后马上再来的节奏。'],
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const locale = (params.locale as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const path = getLocalizedPath(locale, '/guides/games-like-drive-mad');
  const title = isZh
    ? '类似 Drive Mad 的物理驾驶小游戏推荐'
    : 'Best Physics Driving Games Like Drive Mad';
  const description = isZh
    ? '喜欢 Drive Mad 的翻车、跳跃、平衡和短局重试?这篇长尾攻略按物理驾驶、车辆组装、推进惯性、平衡练习和精准重试推荐相似浏览器游戏。'
    : 'Looking for games like Drive Mad? Compare free browser picks for physics driving, vehicle building, boost momentum, balance practice, and hard fast-retry challenges.';

  return {
    title,
    description,
    keywords: isZh
      ? ['类似 Drive Mad 的游戏', 'Drive Mad 替代游戏', '物理驾驶小游戏', '浏览器赛车游戏', 'Drive Mad 攻略']
      : ['games like Drive Mad', 'Drive Mad alternatives', 'physics driving games', 'browser car games', 'Drive Mad guide'],
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

export default function GamesLikeDriveMadPage({ params }: PageProps) {
  const locale = (params.locale as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const pageUrl = buildAbsoluteUrl(getLocalizedPath(locale, '/guides/games-like-drive-mad'));
  const faqItems = isZh ? faqs.zh : faqs.en;
  const headline = isZh
    ? '类似 Drive Mad 的物理驾驶小游戏'
    : 'Best Physics Driving Games Like Drive Mad';
  const description = isZh
    ? '这篇攻略不把 Drive Mad 简单归类为赛车，而是按真实卡点拆成油门、平衡、落地、车辆试错和短局重试。'
    : 'This guide does not treat Drive Mad as a normal racing game. It breaks the intent into throttle control, balance, landings, vehicle experiments, and fast retries.';
  const structuredData = [
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
        ? '类似 Drive Mad 的游戏, Drive Mad 替代游戏, 物理驾驶小游戏, 浏览器游戏'
        : 'games like Drive Mad, Drive Mad alternatives, physics driving games, browser games',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: headline,
      itemListElement: picks.map((pick, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: pick.title,
        url: buildAbsoluteUrl(getLocalizedPath(locale, `/games/${pick.slug}`)),
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((faq) => ({
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
      {structuredData.map((schema, index) => (
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
            ? 'Drive Mad 的核心不是速度，而是油门轻重、车身角度、落地稳定和失败后快速重来。最接近的替代游戏也应该满足这些条件，而不是普通的直线竞速。'
            : 'Drive Mad is not mainly about speed. It is about throttle pressure, body angle, stable landings, and quick retries. The best alternatives should match those patterns, not just look like racing games.'}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-medium">
          <a href="#picks" className="rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-sm transition hover:bg-primary/90">
            {isZh ? '查看推荐清单' : 'See the picks'}
          </a>
          <a href="#choose" className="rounded-full border border-primary/30 bg-background px-4 py-2 text-primary transition hover:bg-primary/10">
            {isZh ? '按卡点选择' : 'Choose by problem'}
          </a>
          <a href="#faq" className="rounded-full border border-border bg-background px-4 py-2 text-foreground transition hover:bg-secondary">
            FAQ
          </a>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-foreground/90">
        <p>
          {isZh
            ? '如果你是从 Drive Mad 全关攻略过来的，说明你大概率不是随便找一款车游玩，而是在找同类手感：车会翻、落地会失控、坡道需要提前松油门、窄平台需要小幅修正。'
            : 'If you arrived from the Drive Mad walkthrough, you probably do not want a random car game. You want the same feel: flips, unstable landings, ramps that reward releasing the throttle, and platforms that punish overcorrection.'}
        </p>
        <p>
          {isZh
            ? '下面的清单按真实游玩需求来选，而不是按游戏名相似度来堆关键词。每个推荐都链接到站内游戏页，方便你从攻略继续进入游戏详情页。'
            : 'The list below is organized by real play intent, not by keyword stuffing. Each recommendation links to an internal Luma game page so the guide becomes a useful path instead of an isolated article.'}
        </p>
      </section>

      <section id="picks" className="mt-12 scroll-mt-24">
        <div className="grid gap-6 md:grid-cols-2">
          {picks.map((pick) => (
            <Card key={pick.slug} className="flex h-full flex-col justify-between border border-border">
              <CardHeader>
                <div className="text-sm font-semibold text-primary">{isZh ? pick.tagZh : pick.tag}</div>
                <CardTitle className="text-2xl font-semibold text-foreground">{pick.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-5 text-sm text-foreground/90">
                <p>{isZh ? pick.summaryZh : pick.summary}</p>
                <p className="rounded-xl bg-secondary p-3 text-muted-foreground">
                  {isZh ? pick.bestForZh : pick.bestFor}
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
          {isZh ? '按你卡住的地方选择下一款游戏' : 'Choose the next game by where you get stuck'}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(isZh ? playStyles.zh : playStyles.en).map(([title, body]) => (
            <div key={title} className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '推荐的站内浏览路径' : 'Recommended internal path'}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {isZh
            ? '为了避免只看一页就离开，可以按下面路径继续浏览：先看 Drive Mad 攻略，再看相似游戏清单，最后进入具体游戏页试玩。'
            : 'To avoid a one-page visit, follow this path: read the Drive Mad guide, compare alternatives, then open a specific game page to play.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
          <Link href={getLocalizedPath(locale, '/guides/drive-mad-walkthrough')} className="rounded-full bg-background px-4 py-2 text-primary transition hover:bg-secondary">
            {isZh ? 'Drive Mad 全关攻略' : 'Drive Mad walkthrough'}
          </Link>
          <Link href={getLocalizedPath(locale, '/games/drive-mad')} className="rounded-full bg-background px-4 py-2 text-primary transition hover:bg-secondary">
            Drive Mad
          </Link>
          <Link href={getLocalizedPath(locale, '/games/blumgi-rocket')} className="rounded-full bg-background px-4 py-2 text-primary transition hover:bg-secondary">
            Blumgi Rocket
          </Link>
          <Link href={getLocalizedPath(locale, '/games/assemble-and-drive-road-monsters')} className="rounded-full bg-background px-4 py-2 text-primary transition hover:bg-secondary">
            Assemble and Drive
          </Link>
        </div>
      </section>

      <section id="faq" className="mt-16 rounded-2xl border border-border bg-secondary p-8 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <dl className="mt-6 space-y-6">
          {faqItems.map((faq) => (
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
            ? '这篇长尾攻略用于承接类似游戏搜索，并把用户导向更多站内游戏页。'
            : 'This long-tail guide captures alternative-game searches and routes users into more internal game pages.'}
        </p>
      </section>
    </article>
  );
}
