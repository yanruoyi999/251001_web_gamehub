import type { Metadata } from 'next';
import Link from 'next/link';

import { LumaSnake3DGame } from '@/components/game/luma-snake-3d-game';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  LUMA_SNAKE_3D_OG_IMAGE,
  LUMA_SNAKE_3D_PATH,
} from '@/lib/games/luma-snake-3d-seo';
import { buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86_400;

const pageCopy = {
  en: {
    metaTitle: 'Snake Game 3D - Play Luma Snake Online',
    metaDescription:
      'Play Luma Snake 3D online with keyboard or touch controls, a shared UTC daily challenge, local high scores, and practical tips. No download required.',
    eyebrow: 'Luma original browser game',
    title: 'Snake Game 3D',
    intro:
      'Luma Snake 3D turns the familiar snake loop into a compact spatial score chase. Start a run, collect glowing food, keep an escape lane open, and return tomorrow for the next UTC challenge board.',
    back: 'Browse games',
    sections: [
      {
        title: 'How to play Luma Snake 3D',
        body: 'Use the arrow keys or WASD to steer the snake across the square board. On a phone, use the four touch arrows below the game. Collect the glowing food to grow and increase your score. The run ends when the head hits the outer wall or the snake body. The safest habit is to plan one turn ahead instead of chasing every food item in a straight line.',
      },
      {
        title: 'UTC daily challenge and local best score',
        body: 'Every player receives the same challenge key for the same UTC calendar date. The opening board and first food position are deterministic, so a score can be compared with a friend without an account or server profile. Your best score is stored only in this browser using local storage. Starting a new day creates a new challenge without uploading your play history.',
      },
      {
        title: 'Controls and mobile play',
        body: 'Keyboard input is usually the most precise on desktop. Touch arrows are available on small screens and keep the control surface below the board. The game pauses when the document is hidden, which prevents a background tab from consuming the run. Use landscape mode when you need more room, and tap fullscreen when the browser supports it.',
      },
      {
        title: 'Ways to survive longer',
        body: 'Leave a turn lane before collecting food near the edge. When the snake gets longer, use wide loops and avoid trapping the head between two body segments. Small direction changes are easier to recover from than a last-second reversal. If a run feels too fast, focus on the next opening rather than the entire board and restart after a collision.',
      },
    ],
    faqTitle: 'Snake Game 3D FAQ',
    faqs: [
      {
        question: 'Is Snake Game 3D free to play?',
        answer: 'Yes. Luma Snake 3D is a free browser game with no account, download, or payment required.',
      },
      {
        question: 'Is the daily challenge the same for everyone?',
        answer: 'The challenge key is based on the UTC calendar date, so players on the same UTC day receive the same deterministic opening state.',
      },
      {
        question: 'Can I play Snake Game 3D on mobile?',
        answer: 'Yes. The page includes touch arrow controls and a responsive board. Keyboard controls remain available on desktop.',
      },
      {
        question: 'Where is my high score saved?',
        answer: 'The personal best is saved in local browser storage. Luma does not need an account or a personal profile for this score.',
      },
    ],
    relatedTitle: 'Keep exploring Luma',
    related: [
      {
        href: '/games/google-snake',
        title: 'Google Snake',
        description: 'Try the classic browser snake loop and practical score tips.',
      },
      {
        href: '/guides/google-snake-mods',
        title: 'Google Snake Mods guide',
        description: 'Compare standard browser play with documented mod menu options.',
      },
      {
        href: '/guides/google-snake-level-editor',
        title: 'Google Snake Level Editor guide',
        description: 'Read the source-aware guide to custom board editing.',
      },
      {
        href: '/guides/quick-play-guide',
        title: 'Quick play browser games',
        description: 'Find more short-session games with clear controls and no download.',
      },
    ],
    breadcrumbHome: 'Home',
    breadcrumbGames: 'Games',
  },
  zh: {
    metaTitle: '3D 贪吃蛇在线玩 - Luma Snake 3D',
    metaDescription:
      '在线玩 Luma Snake 3D，支持键盘和触控操作、UTC 每日挑战、本地最高分和实用生存技巧，无需下载。',
    eyebrow: 'Luma 原创浏览器游戏',
    title: '3D 贪吃蛇在线玩',
    intro:
      'Luma Snake 3D 把熟悉的贪吃蛇循环变成一场轻量空间刷分挑战。开始一局，吃掉发光食物，提前留出逃生路线，明天再回来挑战新的 UTC 棋盘。',
    back: '浏览游戏',
    sections: [
      {
        title: '怎么玩 3D 贪吃蛇',
        body: '在桌面端使用方向键或 WASD 控制蛇移动，手机端使用游戏下方的四个触控方向键。吃掉发光食物可以让蛇变长并增加分数；蛇头撞到外墙或自己的身体时，本局结束。不要只追着最近的食物走，提前规划下一次转弯会更稳定。',
      },
      {
        title: 'UTC 每日挑战与本地最高分',
        body: '同一个 UTC 日期内，所有玩家使用同一个挑战标识。开局棋盘和第一颗食物的位置是确定的，因此可以在不注册账号的情况下和朋友比较成绩。最高分只保存在当前浏览器的本地存储中，不会上传游戏历史；进入新的一天后，挑战种子会自动变化。',
      },
      {
        title: '键盘、手机和全屏操作',
        body: '桌面键盘通常更容易精确转向，小屏设备会显示触控方向键。浏览器标签页被隐藏时，游戏会暂停，避免切换应用后继续消耗本局。手机可以尝试横屏获得更宽的视野，在浏览器支持时也可以打开全屏。',
      },
      {
        title: '怎样活得更久',
        body: '靠近边缘吃食物前，先确认还有转弯路线。蛇变长后尽量走大圈，不要把蛇头困在身体之间。小幅度转向比最后一刻急转更容易恢复。如果觉得速度太快，先看下一个开口，不要同时盯着整个棋盘，撞到后直接重新开始即可。',
      },
    ],
    faqTitle: '3D 贪吃蛇常见问题',
    faqs: [
      {
        question: '3D 贪吃蛇免费吗？',
        answer: '免费。Luma Snake 3D 不要求注册、下载或付款，直接在浏览器中运行。',
      },
      {
        question: '每日挑战对所有人一样吗？',
        answer: '挑战标识基于 UTC 日期，同一个 UTC 日期内的玩家会获得相同的确定性开局。',
      },
      {
        question: '手机可以玩 3D 贪吃蛇吗？',
        answer: '可以。页面提供触控方向键，并会根据屏幕尺寸调整游戏区域；桌面端仍可使用键盘操作。',
      },
      {
        question: '最高分保存在哪里？',
        answer: '个人最高分保存在当前浏览器的本地存储中，不需要账号，也不会创建个人资料。',
      },
    ],
    relatedTitle: '继续探索 Luma',
    related: [
      {
        href: '/games/google-snake',
        title: 'Google Snake',
        description: '体验经典贪吃蛇循环，并查看实用得分技巧。',
      },
      {
        href: '/guides/google-snake-mods',
        title: 'Google Snake Mods 指南',
        description: '了解标准浏览器玩法与已记录的 Mod 菜单选项。',
      },
      {
        href: '/guides/google-snake-level-editor',
        title: 'Google Snake Level Editor 指南',
        description: '查看有来源说明的自定义棋盘编辑指南。',
      },
      {
        href: '/guides/quick-play-guide',
        title: '快速游玩浏览器游戏',
        description: '寻找操作清楚、无需下载的短局游戏。',
      },
    ],
    breadcrumbHome: '首页',
    breadcrumbGames: '游戏',
  },
} as const;

interface Snake3DPageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(value: string): Locale {
  return value === 'en' ? 'en' : 'zh';
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Snake3DPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const canonical = getLocalizedPath(locale, LUMA_SNAKE_3D_PATH);
  const socialImage = buildAbsoluteUrl(LUMA_SNAKE_3D_OG_IMAGE);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords:
      locale === 'en'
        ? ['snake game 3d', '3d snake game online', 'snake game mobile', 'browser snake game']
        : ['3D 贪吃蛇', '贪吃蛇在线玩', '手机贪吃蛇游戏', '浏览器贪吃蛇'],
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath('zh', LUMA_SNAKE_3D_PATH),
        'en-US': getLocalizedPath('en', LUMA_SNAKE_3D_PATH),
        'x-default': getLocalizedPath('en', LUMA_SNAKE_3D_PATH),
      },
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonical,
      type: 'website',
      images: [{ url: socialImage, width: 1200, height: 630, alt: content.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
      images: [socialImage],
    },
  };
}

export default async function Snake3DPage({ params }: Snake3DPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const canonical = getLocalizedPath(locale, LUMA_SNAKE_3D_PATH);
  const pageUrl = buildAbsoluteUrl(canonical);
  const faqJsonLd = {
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
  const gameJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Luma Snake 3D',
    url: pageUrl,
    description: content.metaDescription,
    applicationCategory: 'Game',
    gamePlatform: 'Web browser',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    author: {
      '@type': 'Organization',
      name: 'Luma Game Hub',
      url: buildAbsoluteUrl('/about'),
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: content.breadcrumbHome, item: buildAbsoluteUrl(getLocalizedPath(locale, '/')) },
      { '@type': 'ListItem', position: 2, name: content.breadcrumbGames, item: buildAbsoluteUrl(getLocalizedPath(locale, '/games')) },
      { '@type': 'ListItem', position: 3, name: content.title, item: pageUrl },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(gameJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />

      <header className="mb-8 flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{content.eyebrow}</p>
          <h1 id="luma-snake-3d-title" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{content.intro}</p>
        </div>
        <Link
          href={getLocalizedPath(locale, '/games')}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {content.back}
        </Link>
      </header>

      <LumaSnake3DGame locale={locale} />

      <article className="mt-12 space-y-10">
        {content.sections.map((section) => (
          <section key={section.title} className="border-t border-border pt-7">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{section.title}</h2>
            <p className="mt-3 max-w-4xl text-base leading-8 text-muted-foreground">{section.body}</p>
          </section>
        ))}

        <section className="border-t border-border pt-7">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{content.faqTitle}</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {content.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-7" id="related-games">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{content.relatedTitle}</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.related.map((item) => (
              <div key={item.href}>
                <Link
                  href={getLocalizedPath(locale, item.href)}
                  className="text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.title}
                </Link>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
