import type { Metadata } from 'next';
import Link from 'next/link';

import { OnlineGamesForCouplesPlayer } from '@/components/game/online-games-for-couples-player';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { COUPLE_GAMES, COUPLES_GAMES_PATH } from '@/lib/games/online-games-for-couples';
import { buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86_400;

const copy = {
  en: {
    metaTitle: 'Online Games for Couples - Free Couple Games in Your Browser',
    metaDescription:
      'Play three original online games for couples in your browser: quick match quizzes, this-or-that choices and shared challenges. No download, account or saved answers.',
    title: 'Online Games for Couples',
    intro:
      'Play together on the same device or send the same challenge deck to a long-distance partner. These Luma-original couple games run in the browser, need no account, and do not save your answers.',
    proof:
      'This page is built for the search intent behind online games for couples, couple games online, games for couples online and online couples games without splitting those close variants into duplicate pages.',
    playTitle: 'Pick a couple game and start playing',
    sameDeviceTitle: 'Best couple games for the same device',
    sameDeviceBody:
      'If you are together, use one phone, tablet or laptop and take turns answering on the same screen. This or That Duo and the match quiz hide the first choice until the second player is ready, while Quick Couple Challenge is designed to be read and completed together.',
    longDistanceTitle: 'How to play these games long-distance',
    longDistanceBody:
      'Use the challenge code above the game picker and copy the same-deck link. Both people receive the same prompt order, so you can answer over a call or message thread without creating a room, profile or shared account. The link carries only the challenge code, never either person’s answers.',
    compareTitle: 'Which online couple game should you choose?',
    game: 'Game',
    bestFor: 'Best for',
    time: 'Typical round',
    sharing: 'Long-distance sharing',
    compareRows: [
      ['This or That Duo', 'Fast preference comparisons', 'About 3 minutes', 'Same prompt deck by link'],
      ['How Well Do You Match?', 'A lightweight match score', 'About 4 minutes', 'Same prompt deck by link'],
      ['Quick Couple Challenge', 'Conversation and mini challenges', 'About 5 minutes', 'Same prompt deck by link'],
    ],
    privacyTitle: 'Private by design: answers stay on your device',
    privacyBody:
      'Your choices stay only in this tab. Luma does not send names, prompt answers or relationship responses to a game server, and this v1 does not use an account, database or realtime room. Refreshing the tab clears the in-memory answers.',
    differenceTitle: 'Couple games vs. two-player keyboard games',
    differenceBody:
      'Couple games focus on shared choices, conversation and matching, including long-distance play. If you want two people competing or cooperating on one physical keyboard, use the dedicated Two-Player collection instead.',
    faqTitle: 'Online games for couples FAQ',
    faqs: [
      {
        question: 'Can long-distance couples play these games online?',
        answer:
          'Yes. Copy the challenge link so both people receive the same prompt deck and order, then answer while on a call or in a message thread. The first version is asynchronous rather than a realtime room.',
      },
      {
        question: 'Do these couple games need an app or download?',
        answer:
          'No. The three Luma-original interactions run directly in a modern browser and do not require an app, extension or installer.',
      },
      {
        question: 'Do we need to create accounts?',
        answer:
          'No. There is no Luma account requirement for these games. Challenge links contain only a short deck code.',
      },
      {
        question: 'Are our answers saved?',
        answer:
          'No. Answers are kept only in the current tab memory for the active round and disappear on refresh. Analytics records interaction events, not the prompt text or either player’s answers.',
      },
      {
        question: 'Can two people play on the same phone?',
        answer:
          'Yes. The interactions are button-based and designed for taking turns on one responsive screen. A larger screen can be more comfortable but is not required.',
      },
    ],
    relatedTitle: 'More games to play together',
    twoPlayer: '2 Player Unblocked Games - same-keyboard games',
    browseGames: 'Browse all browser games',
    breadcrumbHome: 'Home',
    breadcrumbGames: 'Games',
  },
  zh: {
    metaTitle: 'Online Games for Couples：情侣在线小游戏',
    metaDescription:
      '直接在浏览器玩 3 款 Luma 原创情侣小游戏：二选一默契、匹配测试和快速情侣挑战。无需下载、无需账号，答案不上传保存。',
    title: 'Online Games for Couples：情侣在线小游戏',
    intro:
      '两个人可以共用一台设备，也可以把同一组挑战链接发给异地伴侣。三款小游戏均为 Luma 原创，直接在浏览器运行，不需要账号，也不会保存你们的答案。',
    proof:
      '本页集中覆盖 online games for couples、couple games online、games for couples online 和 online couples games 等接近的搜索意图，不为近义词重复建立薄页。',
    playTitle: '选择一款情侣小游戏开始',
    sameDeviceTitle: '适合两个人共用一台设备的情侣游戏',
    sameDeviceBody:
      '如果两个人在一起，可以共用手机、平板或电脑轮流回答。二选一和匹配测试会让双方依次选择，Quick Couple Challenge 则适合一起阅读并完成。',
    longDistanceTitle: '异地情侣怎么一起玩',
    longDistanceBody:
      '使用游戏选择器上方的挑战码并复制同题链接。两个人打开后会获得相同的题目顺序，可以边通话或聊天边回答，不需要创建房间、个人资料或共享账号；链接只包含挑战码，不包含任何答案。',
    compareTitle: '三款情侣在线游戏怎么选？',
    game: '游戏',
    bestFor: '适合',
    time: '一局时长',
    sharing: '异地分享',
    compareRows: [
      ['二选一默契局', '快速比较偏好', '约 3 分钟', '链接共享同一题组'],
      ['你们有多合拍？', '轻量匹配分数', '约 4 分钟', '链接共享同一题组'],
      ['情侣快速挑战', '聊天与轻互动', '约 5 分钟', '链接共享同一题组'],
    ],
    privacyTitle: '默认保护隐私：答案只留在当前设备',
    privacyBody:
      '你们的选择只保留在当前标签页内存中。Luma 不会把姓名、题目答案或关系回答发送到游戏服务器；第一版也没有账号、数据库或实时房间。刷新页面后，本轮内存答案会清空。',
    differenceTitle: '情侣小游戏和双人键盘游戏有什么区别？',
    differenceBody:
      '情侣小游戏更偏共同选择、聊天和默契比较，也适合异地一起玩。如果你要的是两个人在同一实体键盘上竞争或合作，请进入专门的 Two-Player 合集。',
    faqTitle: '情侣在线小游戏常见问题',
    faqs: [
      {
        question: '异地情侣可以一起玩吗？',
        answer:
          '可以。复制挑战链接后，两个人会获得同一组题和相同顺序，再通过通话或聊天同步回答即可。第一版不是实时联机房间。',
      },
      {
        question: '这些情侣游戏需要下载 App 吗？',
        answer: '不需要。三款 Luma 原创互动直接在现代浏览器中运行，不需要 App、扩展或安装器。',
      },
      {
        question: '需要注册账号吗？',
        answer: '不需要。游戏不要求 Luma 账号，分享链接只包含短挑战码。',
      },
      {
        question: '我们的答案会保存吗？',
        answer: '不会。答案只保存在当前标签页内存，刷新后清空；分析事件不会记录题目正文或双方具体答案。',
      },
      {
        question: '两个人可以共用一部手机玩吗？',
        answer: '可以。三款互动都使用普通按钮和响应式布局，适合轮流在同一屏幕上操作。',
      },
    ],
    relatedTitle: '继续找适合两个人玩的游戏',
    twoPlayer: '2 Player Unblocked Games：同键盘双人游戏',
    browseGames: '浏览全部浏览器游戏',
    breadcrumbHome: '首页',
    breadcrumbGames: '游戏',
  },
} as const;

interface CouplesPageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(value: string): Locale {
  return value === 'en' ? 'en' : 'zh';
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: CouplesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = copy[locale];
  const canonical = getLocalizedPath(locale, COUPLES_GAMES_PATH);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords:
      locale === 'en'
        ? [
            'online games for couples',
            'couple games online',
            'games for couples online',
            'online couples games',
            'long distance couple games online',
          ]
        : ['情侣在线游戏', '情侣小游戏', '异地情侣游戏', '两个人玩的网页游戏'],
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath('zh', COUPLES_GAMES_PATH),
        'en-US': getLocalizedPath('en', COUPLES_GAMES_PATH),
        'x-default': getLocalizedPath('en', COUPLES_GAMES_PATH),
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

export default async function OnlineGamesForCouplesPage({ params }: CouplesPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = copy[locale];
  const localizedPath = getLocalizedPath(locale, COUPLES_GAMES_PATH);
  const pageUrl = buildAbsoluteUrl(localizedPath);
  const inLanguage = locale === 'zh' ? 'zh-CN' : 'en-US';

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: content.title,
    description: content.metaDescription,
    url: pageUrl,
    inLanguage,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: COUPLE_GAMES.map((game, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: game.title[locale],
        description: game.summary[locale],
        url: `${pageUrl}#play-couple-games`,
      })),
    },
  };

  const faqSchema = {
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
  };

  const breadcrumbSchema = {
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
  };

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link className="hover:text-primary" href={getLocalizedPath(locale, '/games')}>
          {content.breadcrumbGames}
        </Link>
      </nav>

      <header className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Luma Original · Couple Games
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {content.intro}
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {content.proof}
        </p>
      </header>

      <section className="mt-10" aria-labelledby="couples-play-title">
        <h2 id="couples-play-title" className="mb-5 text-2xl font-semibold text-foreground sm:text-3xl">
          {content.playTitle}
        </h2>
        <OnlineGamesForCouplesPlayer locale={locale} />
      </section>

      <div className="mt-16 space-y-12" data-couples-guide-content>
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground">{content.sameDeviceTitle}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{content.sameDeviceBody}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground">{content.longDistanceTitle}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{content.longDistanceBody}</p>
          </div>
        </section>

        <section aria-labelledby="couple-games-comparison">
          <h2 id="couple-games-comparison" className="text-2xl font-semibold text-foreground">
            {content.compareTitle}
          </h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-secondary/60 text-foreground">
                <tr>
                  <th className="p-4 font-semibold">{content.game}</th>
                  <th className="p-4 font-semibold">{content.bestFor}</th>
                  <th className="p-4 font-semibold">{content.time}</th>
                  <th className="p-4 font-semibold">{content.sharing}</th>
                </tr>
              </thead>
              <tbody>
                {content.compareRows.map((row) => (
                  <tr key={row[0]} className="border-t border-border bg-card">
                    {row.map((cell) => (
                      <td key={cell} className="p-4 text-foreground/90">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-semibold text-foreground">{content.privacyTitle}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{content.privacyBody}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-2xl font-semibold text-foreground">{content.differenceTitle}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{content.differenceBody}</p>
            <Link
              href={getLocalizedPath(locale, '/games/2-player-unblocked')}
              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {content.twoPlayer} →
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-foreground">{content.faqTitle}</h2>
          <dl className="mt-6 space-y-5">
            {content.faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-border bg-card p-5">
                <dt className="font-semibold text-foreground">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="text-2xl font-semibold text-foreground">{content.relatedTitle}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={getLocalizedPath(locale, '/games/2-player-unblocked')}
              className="inline-flex min-h-11 items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
            >
              {content.twoPlayer}
            </Link>
            <Link
              href={getLocalizedPath(locale, '/games')}
              className="inline-flex min-h-11 items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
            >
              {content.browseGames}
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
