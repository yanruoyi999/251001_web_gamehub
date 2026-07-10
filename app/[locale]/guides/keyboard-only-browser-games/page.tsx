import type { Metadata } from 'next';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  buildAbsoluteUrl,
  DEFAULT_OPEN_GRAPH_IMAGES,
  DEFAULT_TWITTER_IMAGES,
} from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 86400;

const PATH = '/guides/keyboard-only-browser-games';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const picks = [
  {
    slug: 'google-snake',
    title: 'Google Snake',
    controls: 'Arrow keys',
    controlsZh: '方向键',
    reason:
      'A clean first test for keyboard response. The rules are immediate, a round starts quickly, and the arrow keys are the only controls you need.',
    reasonZh:
      '最适合先测试键盘响应。规则一眼就懂，开局很快，只需要方向键，不依赖鼠标。',
    bestFor: 'Short breaks and one-hand play.',
    bestForZh: '短暂休息和单手游玩。',
  },
  {
    slug: 'ovo',
    title: 'OvO',
    controls: 'Arrow keys or WASD',
    controlsZh: '方向键或 WASD',
    reason:
      'A precise parkour game for players who want movement depth without reaching for the mouse between attempts.',
    reasonZh:
      '适合想练精准跑酷的人。失败后可以立即用键盘重来，不需要反复伸手找鼠标。',
    bestFor: 'Precision, momentum, and fast retries.',
    bestForZh: '精准操作、惯性和快速重试。',
  },
  {
    slug: 'drive-mad',
    title: 'Drive Mad',
    controls: 'Arrow keys or WASD',
    controlsZh: '方向键或 WASD',
    reason:
      'The input is simple, but throttle timing, balance, and landing angle create a deeper physics challenge.',
    reasonZh:
      '按键不复杂，但油门时机、车身平衡和落地角度会形成更深的物理挑战。',
    bestFor: 'Physics puzzles and controlled retries.',
    bestForZh: '物理解谜和节奏控制。',
  },
  {
    slug: 'big-tower-tiny-square',
    title: 'Big Tower Tiny Square',
    controls: 'Arrow keys or WASD',
    controlsZh: '方向键或 WASD',
    reason:
      'A difficult but readable platformer with frequent checkpoints, ideal when you want a serious keyboard challenge.',
    reasonZh:
      '高难但规则清楚，检查点密集，适合想认真挑战键盘操作的人。',
    bestFor: 'Hard-but-fair platforming.',
    bestForZh: '高难但公平的平台跳跃。',
  },
  {
    slug: 'g-switch-3',
    title: 'G-Switch 3',
    controls: 'One key per player',
    controlsZh: '每位玩家一个按键',
    reason:
      'Its gravity-flip mechanic uses a single key, and local multiplayer lets several people share one keyboard.',
    reasonZh:
      '重力翻转只需要一个按键，多人模式还可以让多个人共用同一块键盘。',
    bestFor: 'One-button play and local multiplayer.',
    bestForZh: '单键操作和本地多人。',
  },
];

const faqs = {
  en: [
    {
      question: 'What browser games can I play with only a keyboard?',
      answer:
        'Good starting points are Google Snake for arrow-key movement, OvO and Big Tower Tiny Square for platforming, Drive Mad for keyboard-controlled physics driving, and G-Switch 3 for one-button play.',
    },
    {
      question: 'Do keyboard-only browser games need a download?',
      answer:
        'The games linked in this guide open from browser game pages and do not require a separate app install. Always avoid pages that replace the play button with an APK or extension download.',
    },
    {
      question: 'Which keyboard browser game is easiest to start?',
      answer:
        'Google Snake is the easiest first test because the objective and arrow-key controls are immediately clear. Drive Mad is also simple to control, although its physics stages become harder.',
    },
    {
      question: 'Which games work well without a mouse on a laptop?',
      answer:
        'Games with arrow-key, WASD, or one-button controls work best. OvO, Drive Mad, Big Tower Tiny Square, Google Snake, and G-Switch 3 all fit that pattern.',
    },
    {
      question: 'Why does a keyboard game sometimes ignore my keys?',
      answer:
        'Click the game area once to give the iframe focus, then retry. Also check whether the browser, an extension, or an operating-system shortcut is intercepting the key.',
    },
  ],
  zh: [
    {
      question: '有哪些只用键盘就能玩的浏览器游戏？',
      answer:
        '可以先试 Google Snake 的方向键移动、OvO 和 Big Tower Tiny Square 的平台跳跃、Drive Mad 的键盘物理驾驶，以及 G-Switch 3 的单键操作。',
    },
    {
      question: '键盘浏览器游戏需要下载吗？',
      answer:
        '本指南链接的是浏览器游戏页面，不需要单独安装应用。遇到把“开始游戏”替换成 APK、插件或所谓加速器下载的页面，应直接离开。',
    },
    {
      question: '哪款键盘小游戏最容易上手？',
      answer:
        'Google Snake 最适合先试，因为目标和方向键操作都非常直观。Drive Mad 的按键也简单，但后面的物理关卡会更难。',
    },
    {
      question: '笔记本没有鼠标时适合玩什么？',
      answer:
        '优先选方向键、WASD 或单键操作的游戏。OvO、Drive Mad、Big Tower Tiny Square、Google Snake 和 G-Switch 3 都符合。',
    },
    {
      question: '为什么按键有时没有反应？',
      answer:
        '先点击一次游戏区域，让 iframe 获得焦点，再重新按键。还要检查浏览器、扩展程序或系统快捷键是否截获了按键。',
    },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const title = isZh
    ? '只用键盘玩的浏览器小游戏：无需鼠标、免下载'
    : 'Keyboard-Only Browser Games: No Mouse, No Download';
  const description = isZh
    ? '寻找只用方向键、WASD 或单键操作的浏览器小游戏？这篇攻略按控制方式推荐免下载游戏，并解决 iframe 焦点和按键无响应问题。'
    : 'Find keyboard-only browser games with arrow keys, WASD, or one-button controls. Compare no-download picks and fix common focus or unresponsive-key problems.';
  const localizedPath = getLocalizedPath(locale, PATH);

  return {
    title,
    description,
    keywords: isZh
      ? ['只用键盘玩的浏览器游戏', '不用鼠标的小游戏', '方向键网页游戏', 'WASD 浏览器游戏', '免下载键盘游戏']
      : ['keyboard only browser games', 'browser games no mouse', 'games with arrow keys no download', 'WASD browser games', 'keyboard games for laptop'],
    alternates: {
      canonical: localizedPath,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          getLocalizedPath(loc, PATH),
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: localizedPath,
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

export default async function KeyboardOnlyBrowserGamesPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const faqItems = isZh ? faqs.zh : faqs.en;
  const headline = isZh
    ? '只用键盘玩的浏览器小游戏'
    : 'Keyboard-Only Browser Games: No Mouse Required';
  const description = isZh
    ? '按方向键、WASD、单键和多人同键盘四种控制方式选择，避免为了开始一局反复切换鼠标。'
    : 'Choose by arrow keys, WASD, one-button play, or shared-keyboard multiplayer without constantly switching back to a mouse.';
  const pageUrl = buildAbsoluteUrl(getLocalizedPath(locale, PATH));
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      mainEntityOfPage: pageUrl,
      inLanguage: isZh ? 'zh-CN' : 'en-US',
      author: { '@type': 'Organization', name: 'Luma Game Hub Editorial' },
      publisher: {
        '@type': 'Organization',
        name: 'Luma Game Hub',
        url: buildAbsoluteUrl(getLocalizedPath(locale)),
      },
      articleSection: 'Browser Games',
      keywords: isZh
        ? '只用键盘玩的浏览器游戏, 不用鼠标的小游戏, 方向键网页游戏, 免下载键盘游戏'
        : 'keyboard only browser games, browser games no mouse, arrow key games, no-download keyboard games',
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

      <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link href={getLocalizedPath(locale, '/guides')} className="text-primary hover:underline">
          {isZh ? '← 返回攻略合集' : '← Back to guides'}
        </Link>
        <Link href={getLocalizedPath(locale, '/guides/browser-games-for-low-end-pc')} className="text-primary hover:underline">
          {isZh ? '低配置电脑游戏指南' : 'Low-end PC browser games'}
        </Link>
      </nav>

      <header className="mt-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">keyboard only browser games</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">{headline}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">{description}</p>
      </header>

      <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {isZh ? '快速答案' : 'Quick answer'}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          {isZh ? '先按控制方式选，不要只看游戏类型' : 'Choose by control scheme, not only by genre'}
        </h2>
        <p className="mt-3 leading-7 text-foreground/90">
          {isZh
            ? '只用键盘玩时，最重要的是按键数量、失败后是否能立刻重来，以及游戏 iframe 能否稳定获得焦点。方向键游戏适合快速开始，WASD 平台游戏适合深度挑战，单键游戏最适合一只手和多人共用键盘。'
            : 'For keyboard-only play, the important questions are how many keys you need, whether a retry starts immediately, and whether the game iframe keeps focus. Arrow-key games are easiest to start, WASD platformers offer deeper control, and one-button games work well for one hand or a shared keyboard.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
          <a href="#picks" className="rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            {isZh ? '查看推荐' : 'See the picks'}
          </a>
          <a href="#fix-keys" className="rounded-full border border-primary/30 bg-background px-4 py-2 text-primary hover:bg-primary/10">
            {isZh ? '解决按键无响应' : 'Fix unresponsive keys'}
          </a>
          <a href="#faq" className="rounded-full border border-border bg-background px-4 py-2 text-foreground hover:bg-secondary">
            FAQ
          </a>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-4 text-base leading-7 text-foreground/90">
        <p>
          {isZh
            ? '键盘游戏特别适合笔记本触控板不顺手、办公桌空间很小、鼠标暂时不可用，或者只想用一只手玩几分钟的场景。真正好用的页面应该在打开游戏前说明控制方式，而不是让玩家进入 iframe 后再猜。'
            : 'Keyboard games are useful when a laptop trackpad feels awkward, desk space is limited, a mouse is unavailable, or you only want a few minutes of one-hand play. A useful page should explain controls before the iframe loads instead of making the player guess.'}
        </p>
        <p>
          {isZh
            ? '下面的推荐优先选择 Luma 已有详情页和攻略支持的游戏。你可以先看控制方式，再进入游戏页测试一局；不合适就沿站内链接切换到同类选择。'
            : 'The recommendations below prioritize games already supported by Luma detail pages and guides. Check the controls first, test one round, and use the internal links to switch when a control scheme does not fit.'}
        </p>
      </section>

      <section id="picks" className="mt-12 scroll-mt-24">
        <h2 className="text-3xl font-semibold text-foreground">
          {isZh ? '按键盘控制方式推荐' : 'Picks by keyboard control style'}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {picks.map((pick) => (
            <Card key={pick.slug} className="flex h-full flex-col justify-between">
              <CardHeader>
                <p className="text-sm font-semibold text-primary">
                  {isZh ? pick.controlsZh : pick.controls}
                </p>
                <CardTitle>{pick.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-5 text-sm">
                <p className="leading-6 text-foreground/90">{isZh ? pick.reasonZh : pick.reason}</p>
                <p className="rounded-xl bg-secondary p-3 text-muted-foreground">
                  {isZh ? pick.bestForZh : pick.bestFor}
                </p>
                <Link
                  href={getLocalizedPath(locale, `/games/${pick.slug}`)}
                  className="font-medium text-primary hover:text-primary/80"
                  prefetch
                >
                  {isZh ? `打开 ${pick.title} 游戏页` : `Open ${pick.title}`} →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="fix-keys" className="mt-16 rounded-2xl border border-border bg-card p-6 shadow-sm scroll-mt-24">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '按键没有反应时，按这个顺序排查' : 'When keys do not respond, check in this order'}
        </h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-muted-foreground">
          <li>{isZh ? '先点击一次游戏画面，让 iframe 获得键盘焦点。' : 'Click the game area once so the iframe receives keyboard focus.'}</li>
          <li>{isZh ? '确认输入法、浏览器搜索框或地址栏没有正在接收输入。' : 'Make sure an input method, search field, or the address bar is not receiving the keys.'}</li>
          <li>{isZh ? '测试方向键和 WASD，部分游戏只支持其中一组。' : 'Test both arrow keys and WASD because some games support only one set.'}</li>
          <li>{isZh ? '暂时关闭会改键或拦截快捷键的扩展程序。' : 'Temporarily disable extensions that remap keys or intercept shortcuts.'}</li>
          <li>{isZh ? '刷新页面后只打开一个游戏标签页，排除多个 iframe 抢焦点。' : 'Reload with only one game tab open to avoid multiple iframes competing for focus.'}</li>
        </ol>
      </section>

      <section className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '继续阅读相关攻略' : 'Continue with related guides'}
        </h2>
        <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
          {[
            ['/guides/quick-play-guide', isZh ? '快速游玩指南' : 'Quick Play Guide'],
            ['/guides/no-download-games', isZh ? '无需下载游戏指南' : 'No Download Games'],
            ['/guides/browser-games-for-low-end-pc', isZh ? '低配置电脑浏览器游戏' : 'Browser Games for Low-End PCs'],
            ['/guides/google-snake-mods', isZh ? 'Google Snake 模组与玩法' : 'Google Snake Mods Guide'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={getLocalizedPath(locale, href)}
              className="rounded-xl border border-border bg-background p-4 font-medium text-primary hover:bg-secondary"
            >
              {label} →
            </Link>
          ))}
        </div>
      </section>

      <section id="faq" className="mt-16 rounded-2xl border border-border bg-secondary p-8 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <dl className="mt-6 space-y-6">
          {faqItems.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <dt className="font-semibold text-foreground">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-6 text-foreground/90">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-12 flex flex-wrap justify-center gap-3">
        <Link
          href={getLocalizedPath(locale, '/games')}
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {isZh ? '浏览全部游戏' : 'Browse all games'}
        </Link>
        <Link
          href={getLocalizedPath(locale, '/guides')}
          className="rounded-lg border px-6 py-3 font-medium text-primary hover:bg-primary/10"
        >
          {isZh ? '查看全部攻略' : 'View all guides'}
        </Link>
      </footer>
    </article>
  );
}
