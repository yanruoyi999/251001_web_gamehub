import type { Metadata } from 'next';
import Link from 'next/link';

import { TwoPlayerCollectionPlayer } from '@/components/game/two-player-collection-player';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { TWO_PLAYER_GAMES } from '@/lib/games/two-player-unblocked';
import { buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86_400;

export const TWO_PLAYER_PATH = '/games/2-player-unblocked';

const copy = {
  en: {
    metaTitle: '2 Player Unblocked Games - Same Keyboard Browser Games',
    metaDescription:
      'Play legal, self-hosted 2 player unblocked games in your browser. Same-keyboard Pong, racing and puzzle games with clear controls, no download and no account.',
    title: '2 Player Unblocked Games',
    intro:
      'Pick a game and play together on one keyboard. Every playable title in this collection is self-hosted by Luma, has an explicit provenance record, and loads only after you press Play.',
    safety:
      '“Unblocked” is used here as a common search/category term for browser games that are easy to open. This page does not bypass school, workplace, or network filters, and it does not promise that a network administrator will allow every game.',
    playTitle: 'Choose a two-player browser game',
    noJs:
      'JavaScript is required for the collection switcher. You can still open an individual self-hosted game directly with the links below.',
    whatTitle: 'What are 2 player unblocked games?',
    whatBody:
      'In this collection, the phrase means small browser games designed for two people on the same device, with no installer and no Luma account. The games use local keyboard controls and do not depend on a third-party game mirror. Network access policies still belong to the school, workplace, family, or network owner.',
    sameKeyboardTitle: 'Best same-keyboard games',
    sameKeyboardBody:
      'Classic Pong Duel and Key Sprint Duel are simultaneous same-keyboard games. Each player gets a separate key set, so both players can act at the same time without passing the keyboard back and forth.',
    racingTitle: 'Best racing game',
    racingBody:
      'Key Sprint Duel is a short original keyboard race. P1 alternates A and D while P2 alternates the left and right arrow keys. Browser key repeat does not count, so clean alternating input matters more than holding a key.',
    puzzleTitle: 'Best puzzle game',
    puzzleBody:
      'Grid Claim Duel is a local turn-based territory puzzle. Players move one cursor on alternating turns and claim empty cells, making it a calmer option when simultaneous controls are not ideal.',
    quickTitle: 'Best quick game',
    quickBody:
      'Classic Pong Duel has the simplest rules: move your paddle, keep the ball in play, and score when the other player misses. It is the fastest game here to explain to a second player.',
    requirementsTitle: 'Controls and device support',
    game: 'Game',
    genre: 'Type',
    p1: 'P1 controls',
    p2: 'P2 controls',
    keyboard: 'Keyboard',
    mobile: 'Mobile',
    keyboardValue: 'Required',
    mobileValue: 'Page supported; physical keyboard required for play',
    noDownload: 'No download',
    noAccount: 'No account',
    chromebookTitle: 'Chromebook support',
    chromebookBody:
      'These runtimes are plain self-hosted HTML, CSS and JavaScript. A Chromebook with a modern browser and a physical keyboard can use the documented keys, subject to the device owner’s normal network and browser policies.',
    mobileTitle: 'Phone and tablet support',
    mobileBody:
      'The collection page is responsive on mobile, but the v1 games require physical keyboard input. We label that limitation instead of pretending touch controls exist. A phone or tablet can browse the page and license information, but gameplay is not marked mobile-ready.',
    trustTitle: 'Source, license and hosting notes',
    trustIntro:
      'Playable games enter this page only after the source and redistribution path are documented. No third-party iframe or mirror is treated as authorization evidence.',
    author: 'Author / provenance',
    license: 'License',
    source: 'Source',
    hosting: 'Runtime',
    hostingValue: 'Self-hosted on Luma; no extra game resources',
    faqTitle: 'Frequently asked questions',
    faqs: [
      {
        question: 'Do I need to download these 2 player games?',
        answer:
          'No. The three v1 games run from Luma-hosted browser files. You do not need an installer, extension, APK, desktop client, or Luma account.',
      },
      {
        question: 'Can two people play on the same keyboard?',
        answer:
          'Yes. Classic Pong Duel and Key Sprint Duel use separate key sets for simultaneous play. Grid Claim Duel is turn-based and uses a different key set for each player.',
      },
      {
        question: 'Do these games work on Chromebook?',
        answer:
          'They are built from standard browser technologies and use physical keyboard input. Actual access can still be limited by the Chromebook owner, browser configuration, or network policy.',
      },
      {
        question: 'Can I play on iPhone or Android?',
        answer:
          'The page itself works on mobile layouts, but the v1 games are not advertised as touch games. Use a desktop, laptop, or other device with a physical keyboard for the documented controls.',
      },
      {
        question: 'Does “unblocked” mean this page bypasses school filters?',
        answer:
          'No. “Unblocked” describes a common search phrase and low-friction browser-game category. Luma does not provide instructions or technology for bypassing school, workplace, family, or network controls.',
      },
    ],
    relatedTitle: 'Keep exploring',
    browseGames: 'Browse all games',
    keyboardGuide: 'Keyboard-only browser games guide',
    breadcrumbHome: 'Home',
    breadcrumbGames: 'Games',
  },
  zh: {
    metaTitle: '2 Player Unblocked Games：双人浏览器游戏',
    metaDescription:
      '直接在浏览器里玩合法、自托管的双人浏览器游戏：Pong、键盘竞速和双人益智，清楚显示双方按键，无需下载、无需注册。',
    title: '2 Player Unblocked Games：双人浏览器游戏',
    intro:
      '选择一款游戏，两个人共用同一台设备和键盘。这个合集里的可玩游戏都由 Luma 自托管，并保存明确的来源与许可记录；只有点击 Play 后才会加载游戏。',
    safety:
      '这里的“Unblocked”只是用户常用的搜索词和浏览器游戏类别描述，不代表绕过限制。本页不会绕过学校、公司或网络过滤规则，也不会承诺任何网络管理员一定允许访问这些游戏。',
    playTitle: '选择一款双人浏览器游戏',
    noJs:
      '合集切换器需要 JavaScript；关闭 JavaScript 时，仍可通过下方链接直接打开每个 Luma 自托管游戏。',
    whatTitle: '什么是 2 Player Unblocked Games？',
    whatBody:
      '在这个页面里，它指的是两个人在同一台设备上玩的轻量浏览器游戏：无需安装程序，也无需 Luma 账号。游戏使用本地键盘操作，不依赖第三方游戏镜像；学校、公司、家庭或网络所有者的访问策略仍然有效。',
    sameKeyboardTitle: '适合同键盘的双人游戏',
    sameKeyboardBody:
      'Classic Pong Duel 和 Key Sprint Duel 都支持双方同时按键，每位玩家有独立按键区，不需要轮流把键盘让给对方。',
    racingTitle: '双人竞速推荐',
    racingBody:
      'Key Sprint Duel 是 Luma 原创的短局键盘竞速。P1 交替按 A/D，P2 交替按左右方向键；长按产生的浏览器重复按键不会计数。',
    puzzleTitle: '双人益智推荐',
    puzzleBody:
      'Grid Claim Duel 是本地回合制领地益智游戏。双方轮流移动一个光标并占领空格，适合不方便同时操作键盘时游玩。',
    quickTitle: '最快上手的游戏',
    quickBody:
      'Classic Pong Duel 的规则最简单：移动球拍、接住球、让对方漏球即可得分，几乎不用额外解释就能开始。',
    requirementsTitle: '控制方式与设备支持',
    game: '游戏',
    genre: '类型',
    p1: 'P1 操作',
    p2: 'P2 操作',
    keyboard: '键盘',
    mobile: '手机',
    keyboardValue: '需要实体键盘',
    mobileValue: '页面可浏览；游戏需要实体键盘',
    noDownload: 'No download / 无需下载',
    noAccount: 'No account / 无需账号',
    chromebookTitle: 'Chromebook 支持',
    chromebookBody:
      '这些运行时只使用 Luma 自托管的 HTML、CSS 和 JavaScript。带实体键盘和现代浏览器的 Chromebook 可以使用页面标注的按键，但仍受设备所有者的浏览器与网络策略约束。',
    mobileTitle: '手机和平板支持',
    mobileBody:
      '合集页面本身适配移动端，但第一版游戏需要实体键盘。我们会明确标注这个限制，而不是虚构触屏支持；手机和平板可以浏览页面和授权信息，但不会被标记成“移动端可玩”。',
    trustTitle: '来源、许可证与自托管说明',
    trustIntro:
      '只有来源和再分发权限已经记录的游戏才会进入可玩列表。第三方 iframe 或镜像站本身不能作为授权证明。',
    author: '作者 / 来源',
    license: '许可证',
    source: '源码',
    hosting: '运行方式',
    hostingValue: 'Luma 自托管；无额外第三方游戏资源',
    faqTitle: '常见问题',
    faqs: [
      {
        question: '这些双人游戏需要下载吗？',
        answer:
          '不需要。第一版三款游戏全部从 Luma 自托管的浏览器文件运行，不需要安装器、扩展、APK、桌面客户端或 Luma 账号。',
      },
      {
        question: '两个人可以共用同一个键盘玩吗？',
        answer:
          '可以。Classic Pong Duel 和 Key Sprint Duel 使用两套独立按键同时操作；Grid Claim Duel 是回合制，每位玩家使用自己的按键。',
      },
      {
        question: 'Chromebook 可以玩吗？',
        answer:
          '游戏使用标准浏览器技术和实体键盘输入。不过最终能否访问仍取决于 Chromebook 所有者、浏览器配置和网络策略。',
      },
      {
        question: 'iPhone 或 Android 可以玩吗？',
        answer:
          '页面布局支持手机浏览，但第一版游戏不宣传触屏玩法。建议使用带实体键盘的电脑、笔记本或其他设备。',
      },
      {
        question: 'Unblocked 是否代表可以绕过学校限制？',
        answer:
          '不是。Unblocked 只是常见搜索词和低门槛浏览器游戏类别描述；Luma 不提供绕过学校、公司、家庭或网络访问控制的方法。',
      },
    ],
    relatedTitle: '继续探索',
    browseGames: '浏览全部游戏',
    keyboardGuide: '只用键盘玩的浏览器小游戏指南',
    breadcrumbHome: '首页',
    breadcrumbGames: '游戏',
  },
} as const;

interface TwoPlayerUnblockedPageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(value: string): Locale {
  return value === 'en' ? 'en' : 'zh';
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: TwoPlayerUnblockedPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = copy[locale];
  const canonical = getLocalizedPath(locale, TWO_PLAYER_PATH);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords:
      locale === 'en'
        ? [
            'two-player unblocked',
            '2 player unblocked games',
            'two player games unblocked',
            '2 player browser games',
            'two player games same keyboard',
          ]
        : ['双人浏览器游戏', '双人键盘游戏', '两个人玩的网页游戏', '无需下载双人游戏'],
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath('zh', TWO_PLAYER_PATH),
        'en-US': getLocalizedPath('en', TWO_PLAYER_PATH),
        'x-default': getLocalizedPath('en', TWO_PLAYER_PATH),
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonical,
      type: 'website',
      locale: locale === 'zh' ? 'zh-CN' : 'en-US',
      alternateLocale: [locale === 'zh' ? 'en-US' : 'zh-CN'],
    },
    twitter: {
      card: 'summary',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function TwoPlayerUnblockedPage({ params }: TwoPlayerUnblockedPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = copy[locale];
  const localizedPath = getLocalizedPath(locale, TWO_PLAYER_PATH);
  const pageUrl = buildAbsoluteUrl(localizedPath);
  const localeTag = locale === 'zh' ? 'zh-CN' : 'en-US';

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'en' ? 'Self-hosted two-player browser games' : 'Luma 自托管双人浏览器游戏',
    numberOfItems: TWO_PLAYER_GAMES.length,
    itemListElement: TWO_PLAYER_GAMES.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: game.title[locale],
      url: `${pageUrl}#${game.slug}`,
    })),
  };

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: content.title,
      description: content.metaDescription,
      url: pageUrl,
      inLanguage: localeTag,
      isAccessibleForFree: true,
      mainEntity: itemList,
      publisher: {
        '@type': 'Organization',
        name: 'Luma Game Hub',
      },
    },
    itemList,
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: content.breadcrumbHome,
          item: buildAbsoluteUrl(getLocalizedPath(locale)),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.breadcrumbGames,
          item: buildAbsoluteUrl(getLocalizedPath(locale, '/games')),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: content.title,
          item: pageUrl,
        },
      ],
    },
  ];

  const guideSections = [
    { title: content.whatTitle, body: content.whatBody },
    { title: content.sameKeyboardTitle, body: content.sameKeyboardBody },
    { title: content.racingTitle, body: content.racingBody },
    { title: content.puzzleTitle, body: content.puzzleBody },
    { title: content.quickTitle, body: content.quickBody },
    { title: content.chromebookTitle, body: content.chromebookBody },
    { title: content.mobileTitle, body: content.mobileBody },
  ];

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}

      <nav
        aria-label={locale === 'zh' ? '面包屑导航' : 'Breadcrumb'}
        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href={getLocalizedPath(locale)} className="hover:text-primary">
          {content.breadcrumbHome}
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={getLocalizedPath(locale, '/games')} className="hover:text-primary">
          {content.breadcrumbGames}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{content.title}</span>
      </nav>

      <header className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          2 Players · Same device · Self-hosted
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          {content.intro}
        </p>
        <p className="mx-auto mt-4 max-w-3xl rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {content.safety}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-semibold text-foreground/80">
          <span className="rounded-full border border-border bg-card px-3 py-1.5">{content.noDownload}</span>
          <span className="rounded-full border border-border bg-card px-3 py-1.5">{content.noAccount}</span>
          <span className="rounded-full border border-border bg-card px-3 py-1.5">same-keyboard</span>
        </div>
      </header>

      <section className="mt-10" aria-labelledby="two-player-picker">
        <h2 id="two-player-picker" className="mb-5 text-2xl font-bold text-foreground sm:text-3xl">
          {content.playTitle}
        </h2>
        <TwoPlayerCollectionPlayer locale={locale} games={TWO_PLAYER_GAMES} />
        <noscript>
          <div className="mt-5 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <p>{content.noJs}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {TWO_PLAYER_GAMES.map((game) => (
                <li key={game.slug}>
                  <a href={game.runtimePath}>{game.title[locale]}</a>
                </li>
              ))}
            </ul>
          </div>
        </noscript>
      </section>

      <section id="two-player-guide" className="mt-14 scroll-mt-24" aria-labelledby="two-player-guide-title">
        <h2 id="two-player-guide-title" className="text-3xl font-bold text-foreground">
          {locale === 'en' ? 'How to choose a two-player browser game' : '怎样选择双人浏览器游戏'}
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {guideSections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{section.body}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <h2 className="text-2xl font-bold text-foreground">{content.requirementsTitle}</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="p-3">{content.game}</th>
                <th className="p-3">{content.genre}</th>
                <th className="p-3">{content.p1}</th>
                <th className="p-3">{content.p2}</th>
                <th className="p-3">{content.keyboard}</th>
                <th className="p-3">{content.mobile}</th>
              </tr>
            </thead>
            <tbody>
              {TWO_PLAYER_GAMES.map((game) => (
                <tr key={game.slug} id={game.slug} className="border-b border-border/70 align-top last:border-b-0">
                  <td className="p-3 font-semibold text-foreground">{game.title[locale]}</td>
                  <td className="p-3 text-muted-foreground">{game.genre}</td>
                  <td className="p-3 text-muted-foreground">{game.playerOneControls}</td>
                  <td className="p-3 text-muted-foreground">{game.playerTwoControls}</td>
                  <td className="p-3 text-muted-foreground">{content.keyboardValue}</td>
                  <td className="p-3 text-muted-foreground">{content.mobileValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-foreground">{content.trustTitle}</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base">{content.trustIntro}</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {TWO_PLAYER_GAMES.map((game) => (
            <article key={game.slug} className="rounded-2xl border border-border bg-background p-5">
              <h3 className="font-semibold text-foreground">{game.title[locale]}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-foreground">{content.author}</dt>
                  <dd className="mt-1 text-muted-foreground">{game.author}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">{content.license}</dt>
                  <dd className="mt-1 text-muted-foreground">{game.license}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">{content.hosting}</dt>
                  <dd className="mt-1 text-muted-foreground">{content.hostingValue}</dd>
                </div>
              </dl>
              <a
                href={game.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline"
              >
                {content.source} ↗
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-foreground">{content.faqTitle}</h2>
        <dl className="mt-6 space-y-5">
          {content.faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl bg-muted/45 p-5">
              <dt className="text-lg font-semibold text-foreground">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-xl font-bold text-foreground">{content.relatedTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={getLocalizedPath(locale, '/games')}
            className="inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary"
          >
            {content.browseGames}
          </Link>
          <Link
            href={getLocalizedPath(locale, '/guides/keyboard-only-browser-games')}
            className="inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary"
          >
            {content.keyboardGuide}
          </Link>
        </div>
      </section>
    </article>
  );
}
