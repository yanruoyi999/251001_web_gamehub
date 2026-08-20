import type { Metadata } from 'next';
import Link from 'next/link';

import { SortingGamesPlayer } from '@/components/game/sorting-games-player';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { SORTING_GAMES, SORTING_GAMES_PATH } from '@/lib/games/sorting-games';
import { buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86_400;

const copy = {
  en: {
    metaTitle: 'Sorting Games Online - 3 Free Original Sort Games',
    metaDescription:
      'Play three free Luma-original sorting games online: sort color stacks, order numbers and classify shapes. No download, account or third-party game assets.',
    title: 'Sorting Games Online',
    intro:
      'Play three original sorting games directly in your browser. Group color stacks, put shuffled numbers in order, or classify simple shapes. Every game on this page is built by Luma Game Hub with local code and browser-drawn visuals, so you can start without an account, download, external game frame or copied level pack.',
    intent:
      'This collection keeps the closely related search intent behind sorting games, sort games, sorting games online, color sorting game and number sorting game on one useful page instead of splitting small keyword variations into duplicate pages.',
    playTitle: 'Choose an original sorting game',
    whatTitle: 'What are sorting games?',
    whatBody:
      'Sorting games turn a simple organization rule into a puzzle or speed challenge. You might need to group matching properties, recognize which item belongs in a category, or arrange values in the correct sequence. The useful part is the decision itself: compare what is on screen, decide where it belongs, make a move, and immediately see whether the board is becoming more organized.',
    originalTitle: 'Three sorting mechanics, built from scratch for Luma',
    originalBody:
      'This page does not embed another game portal or reuse a branded commercial game. The color tiles, number sets, shape cards, challenge generator, rules copy and React interaction logic are maintained inside Luma Game Hub. Generic sorting mechanics are combined into new lightweight games with their own names and procedurally generated starting states.',
    compareTitle: 'Which sorting game should you play?',
    game: 'Game',
    skill: 'Main skill',
    pace: 'Pace',
    bestFor: 'Best for',
    compareRows: [
      ['Color Stack Sort', 'Planning valid moves', 'Puzzle', 'Players who like multi-step organization'],
      ['Number Order Sprint', 'Ordering and scanning', 'Fast', 'A short keyboard-free challenge'],
      ['Shape Shelf Sort', 'Visual classification', 'Quick', 'Simple category recognition'],
    ],
    colorTitle: 'How Color Stack Sort works',
    colorBody:
      'Choose a stack, then choose where its top color tile should go. A tile can move to an empty stack or onto the same color when there is space. The goal is to finish with four filled stacks, each holding only one color. The starting layout is generated from the six-character challenge code rather than copied from a fixed commercial level list.',
    numberTitle: 'How Number Order Sprint works',
    numberBody:
      'Nine unique numbers appear in a shuffled grid. Find the smallest remaining number, tap it, and continue upward until the set is complete. A wrong tap counts as a mistake but does not replace the puzzle. The challenge code creates a repeatable number set, which makes it easy to compare runs without storing your sequence on a server.',
    shapeTitle: 'How Shape Shelf Sort works',
    shapeBody:
      'One geometric card appears at a time. Decide whether it belongs with three-sided shapes, four-sided shapes, or the round-and-other group. The cards are rendered with browser CSS and text labels rather than image files. It is intentionally a short recognition game, so it works well on phones as well as desktop screens.',
    deviceTitle: 'Do these sorting games work on phones and tablets?',
    deviceBody:
      'Yes. All three games use tap and click controls, responsive layouts and browser-native elements. There is no physical-keyboard requirement and no installer. A larger screen gives the color puzzle more room, but the same rules and challenge code work on modern mobile browsers.',
    sharingTitle: 'Use a challenge code without creating an account',
    sharingBody:
      'Each session has a six-character challenge code. Copying the challenge link gives another player the same generated starting state. The URL contains only that code; it does not include individual moves, selected numbers, shape answers, mistake history, completion time, names or account identifiers. Refreshing resets the local game state.',
    faqTitle: 'Sorting games FAQ',
    faqs: [
      {
        question: 'Are these sorting games free to play?',
        answer: 'Yes. The three Luma-original sorting games on this page are available to play in the browser without a paid account.',
      },
      {
        question: 'Do I need to download a sorting game?',
        answer: 'No. The games run directly in a modern browser and do not require an app, extension, installer or external game client.',
      },
      {
        question: 'Are the games on this page copied from another website?',
        answer: 'No. Luma Game Hub created the interaction code, game names, rules copy, browser visuals and procedural challenge generation used by these three games.',
      },
      {
        question: 'Can I play the same sorting challenge on another device?',
        answer: 'Yes. Open the shared challenge link or use the same six-character challenge code to reproduce the same generated starting state.',
      },
      {
        question: 'Is my game progress saved?',
        answer: 'No. The playable state is kept in the current tab memory for the active session and resets when the page is refreshed.',
      },
    ],
    relatedTitle: 'More browser game collections',
    browseGames: 'Browse all browser games',
    couplesGames: 'Online Games for Couples',
    twoPlayerGames: '2 Player Unblocked Games',
    breadcrumbHome: 'Home',
    breadcrumbGames: 'Games',
  },
  zh: {
    metaTitle: 'Sorting Games Online：3 款原创在线分类小游戏',
    metaDescription:
      '在线玩 3 款 Luma 原创 sorting games：颜色堆叠、数字排序和形状分类。无需下载、无需账号，不使用第三方游戏素材。',
    title: 'Sorting Games Online：原创在线分类小游戏',
    intro:
      '直接在浏览器玩 3 款原创分类小游戏：整理颜色堆叠、按顺序点击数字，或把简单几何图形放入正确类别。页面内的游戏逻辑和视觉都由 Luma Game Hub 自行实现，不需要账号、下载、外部游戏 iframe，也不使用复制的第三方关卡。',
    intent:
      '本页集中承接 sorting games、sort games、sorting games online、color sorting game 和 number sorting game 等接近的搜索意图，不为近义词重复建立薄页。',
    playTitle: '选择一款 Luma 原创 sorting game',
    whatTitle: 'Sorting games 是什么？',
    whatBody:
      'Sorting games 把“整理和分类”变成小游戏或速度挑战。玩家需要比较屏幕中的内容，判断它属于哪个类别、应该排在什么位置，或者下一步应该移动到哪里，再根据即时结果继续整理。玩法规则简单，但可以训练观察、顺序判断和多步规划。',
    originalTitle: '三种分类机制，全部由 Luma 从零实现',
    originalBody:
      '这个页面不会嵌入其他游戏平台，也不会复刻某个商业游戏。颜色块、数字题组、几何卡片、挑战生成器、规则文案和 React 交互逻辑都维护在 Luma Game Hub 自己的代码中，使用通用分类机制组合成具有独立名称和程序生成初始状态的轻量游戏。',
    compareTitle: '三款 sorting games 怎么选？',
    game: '游戏',
    skill: '主要能力',
    pace: '节奏',
    bestFor: '适合',
    compareRows: [
      ['Color Stack Sort', '规划合法移动', '解谜', '喜欢多步整理的玩家'],
      ['Number Order Sprint', '数字顺序与扫描', '快速', '想玩一局短挑战'],
      ['Shape Shelf Sort', '视觉分类', '轻量', '简单类别识别'],
    ],
    colorTitle: 'Color Stack Sort 怎么玩',
    colorBody:
      '先选择一个堆叠，再选择顶部色块要移动到的目标位置。色块只能进入空堆叠，或者叠到相同颜色上，并且目标需要有空间。最终目标是得到 4 个非空堆叠，每个堆叠只有一种颜色。初始布局由 6 位挑战码生成，不复制固定商业关卡表。',
    numberTitle: 'Number Order Sprint 怎么玩',
    numberBody:
      '屏幕会显示 9 个打乱且不重复的数字。先找到最小数字，再按从小到大的顺序依次点击。点错会增加失误次数，但题面不会被替换。挑战码会生成可重复的数字组合，方便两个人比较同一局，不需要把点击序列保存到服务器。',
    shapeTitle: 'Shape Shelf Sort 怎么玩',
    shapeBody:
      '每次出现一张几何图形卡片，你需要判断它属于三边形、四边形，还是圆形与其他类别。图形由浏览器 CSS 和文字标签绘制，不依赖图片素材。它是一款刻意保持短小的识别游戏，因此手机和桌面都方便操作。',
    deviceTitle: '手机和平板可以玩吗？',
    deviceBody:
      '可以。三款游戏都使用点击或触控操作，并采用响应式布局，不要求实体键盘，也不需要安装程序。颜色分类在大屏幕上空间更宽裕，但现代移动浏览器可以使用相同规则和挑战码。',
    sharingTitle: '不用注册账号，也可以共享同一挑战',
    sharingBody:
      '每一局都有 6 位挑战码。复制挑战链接后，另一台设备会获得相同的程序生成初始状态。URL 只包含挑战码，不包含移动步骤、已选数字、形状答案、失误记录、完成时间、姓名或账号标识；刷新页面后，本地游戏状态会重置。',
    faqTitle: 'Sorting games 常见问题',
    faqs: [
      {
        question: '这些 sorting games 免费吗？',
        answer: '免费。页面内 3 款 Luma 原创分类小游戏可以直接在浏览器中游玩，不要求付费账号。',
      },
      {
        question: '需要下载游戏吗？',
        answer: '不需要。游戏直接在现代浏览器运行，不需要 App、扩展、安装器或外部游戏客户端。',
      },
      {
        question: '这些游戏是从其他网站复制的吗？',
        answer: '不是。三款游戏使用的交互代码、名称、规则文案、浏览器视觉和程序生成挑战均由 Luma Game Hub 自行实现。',
      },
      {
        question: '可以在另一台设备玩同一局吗？',
        answer: '可以。打开共享挑战链接或使用相同的 6 位挑战码，就能重建相同的程序生成初始状态。',
      },
      {
        question: '游戏进度会保存吗？',
        answer: '不会。当前进度只保存在这个标签页的内存中，刷新页面后会重置。',
      },
    ],
    relatedTitle: '继续浏览其他浏览器游戏合集',
    browseGames: '浏览全部浏览器游戏',
    couplesGames: 'Online Games for Couples：情侣在线小游戏',
    twoPlayerGames: '2 Player Unblocked Games：双人游戏合集',
    breadcrumbHome: '首页',
    breadcrumbGames: '游戏',
  },
} as const;

interface SortingGamesPageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(value: string): Locale {
  return value === 'en' ? 'en' : 'zh';
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: SortingGamesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = copy[locale];
  const canonical = getLocalizedPath(locale, SORTING_GAMES_PATH);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: locale === 'en'
      ? [
          'sorting games',
          'sort games',
          'sorting games online',
          'color sorting game',
          'number sorting game',
        ]
      : ['分类游戏', '在线分类小游戏', '颜色分类游戏', '数字排序游戏'],
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath('zh', SORTING_GAMES_PATH),
        'en-US': getLocalizedPath('en', SORTING_GAMES_PATH),
        'x-default': getLocalizedPath('en', SORTING_GAMES_PATH),
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

export default async function SortingGamesPage({ params }: SortingGamesPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = copy[locale];
  const localizedPath = getLocalizedPath(locale, SORTING_GAMES_PATH);
  const pageUrl = buildAbsoluteUrl(localizedPath);
  const inLanguage = locale === 'zh' ? 'zh-CN' : 'en-US';

  const itemListSchema = {
    '@type': 'ItemList',
    itemListElement: SORTING_GAMES.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: game.title[locale],
      description: game.summary[locale],
      url: `${pageUrl}#play-sorting-games`,
    })),
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: content.title,
    description: content.metaDescription,
    url: pageUrl,
    inLanguage,
    mainEntity: itemListSchema,
  };

  const gameSchemas = SORTING_GAMES.map((game) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title[locale],
    description: game.summary[locale],
    url: `${pageUrl}#play-sorting-games`,
    inLanguage,
    applicationCategory: 'Game',
    gamePlatform: 'Web browser',
    playMode: 'SinglePlayer',
    isAccessibleForFree: true,
    creator: {
      '@type': 'Organization',
      name: 'Luma Game Hub',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Luma Game Hub',
    },
  }));

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
      {gameSchemas.map((schema) => (
        <script
          key={schema.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
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
          Luma Original · Sorting Collection
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {content.intro}
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {content.intent}
        </p>
      </header>

      <section className="mt-10" aria-labelledby="sorting-play-heading">
        <h2 id="sorting-play-heading" className="sr-only">{content.playTitle}</h2>
        <SortingGamesPlayer locale={locale} />
      </section>

      <div data-sorting-guide-content className="mx-auto mt-12 max-w-4xl space-y-12">
        <section>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{content.whatTitle}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{content.whatBody}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{content.originalTitle}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{content.originalBody}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{content.compareTitle}</h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-muted/50 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">{content.game}</th>
                  <th className="px-4 py-3 font-semibold">{content.skill}</th>
                  <th className="px-4 py-3 font-semibold">{content.pace}</th>
                  <th className="px-4 py-3 font-semibold">{content.bestFor}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {content.compareRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-3 text-muted-foreground">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{content.colorTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{content.colorBody}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{content.numberTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{content.numberBody}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{content.shapeTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{content.shapeBody}</p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{content.deviceTitle}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{content.deviceBody}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{content.sharingTitle}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{content.sharingBody}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{content.faqTitle}</h2>
          <div className="mt-5 space-y-4">
            {content.faqs.map((faq) => (
              <details key={faq.question} className="rounded-xl border border-border bg-card p-4">
                <summary className="cursor-pointer font-semibold text-foreground">{faq.question}</summary>
                <p className="mt-3 leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-6">
          <h2 className="text-2xl font-bold text-foreground">{content.relatedTitle}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={getLocalizedPath(locale, '/games')}
              className="rounded-md border border-border bg-background px-4 py-2 font-medium text-foreground hover:border-primary/50"
            >
              {content.browseGames}
            </Link>
            <Link
              href={getLocalizedPath(locale, '/games/online-games-for-couples')}
              className="rounded-md border border-border bg-background px-4 py-2 font-medium text-foreground hover:border-primary/50"
            >
              {content.couplesGames}
            </Link>
            <Link
              href={getLocalizedPath(locale, '/games/2-player-unblocked')}
              className="rounded-md border border-border bg-background px-4 py-2 font-medium text-foreground hover:border-primary/50"
            >
              {content.twoPlayerGames}
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
