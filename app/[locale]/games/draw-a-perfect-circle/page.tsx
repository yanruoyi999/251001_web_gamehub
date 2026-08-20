import type { Metadata } from 'next';
import Link from 'next/link';

import { LumaCircleGame } from '@/components/game/luma-circle-game';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { LUMA_CIRCLE_PATH } from '@/lib/games/luma-circle-seo';
import { buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86_400;

const pageCopy = {
  en: {
    metaTitle: 'Draw a Perfect Circle Online | Luma Circle',
    metaDescription:
      'Draw one freehand circle online, get a geometry-based score, and try a UTC daily challenge in Luma Circle. No download, signup, or upload.',
    eyebrow: 'Luma original browser experiment',
    title: 'Draw a Perfect Circle',
    intro:
      'Make one smooth loop around the dot. Luma Circle scores roundness, closure, smoothness, and coverage without sending your drawing anywhere.',
    back: 'Browse games',
    sections: [
      {
        title: 'How the circle score works',
        body: 'The score combines four signals from the stroke: how evenly the radius stays around its fitted center, how close the ending is to the start, how consistently the stroke moves, and how much of a full turn the line covers. The result is a practice signal, not a handwriting or artistic ability judgment.',
      },
      {
        title: 'Practice and UTC daily challenge',
        body: 'Practice uses a stable target so you can compare attempts in the same session. The daily challenge uses a date-based target generated from the UTC calendar date, so players on the same UTC day see the same challenge without an account or server profile.',
      },
      {
        title: 'Mobile drawing and privacy',
        body: 'The canvas accepts mouse, trackpad, stylus, and touch input. Your score and best result stay in local browser storage. Luma does not store the point path, upload an image, or ask for an email address.',
      },
    ],
    faqTitle: 'Draw a Perfect Circle FAQ',
    faqs: [
      {
        question: 'Can I draw a perfect circle on a phone?',
        answer: 'Yes. Luma Circle accepts touch and stylus input on modern mobile browsers, as well as mouse and trackpad input on desktop.',
      },
      {
        question: 'How is the score calculated?',
        answer: 'The score combines fitted-circle roundness, endpoint closure, stroke smoothness, and angular coverage. Raw drawing coordinates are not sent to Luma analytics.',
      },
      {
        question: 'Is there a daily circle challenge?',
        answer: 'Yes. The daily target is derived from the UTC calendar date and is the same for players on that UTC date.',
      },
      {
        question: 'Is Luma Circle connected to Neal.fun or another circle game?',
        answer: 'No. Luma Circle is an original Luma Game Hub experiment with its own scoring presentation and implementation.',
      },
    ],
    relatedTitle: 'Keep exploring Luma',
    related: [
      {
        href: '/games/checkers-rules',
        title: 'Checkers rules trainer',
        description: 'Try an original local board that highlights legal moves and mandatory captures.',
      },
      {
        href: '/games/snake-3d',
        title: 'Snake Game 3D',
        description: 'Play a short UTC challenge with local high scores and touch controls.',
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
    metaTitle: '在线画完美圆 | Luma Circle 绘图挑战',
    metaDescription:
      '在线一笔画圆，获得基于几何分析的分数，并挑战 UTC 每日目标。Luma Circle 无需下载、注册或上传。',
    eyebrow: 'Luma 原创浏览器实验',
    title: '在线画一个完美的圆',
    intro:
      '围绕圆点平滑画一圈。Luma Circle 会分析圆度、闭合度、平滑度和覆盖度，不会上传你的绘图轨迹。',
    back: '浏览游戏',
    sections: [
      {
        title: '分数如何计算',
        body: '分数综合四项信号：拟合圆心后的半径是否稳定、结束点是否接近起点、笔画速度是否平滑，以及轨迹覆盖了多少完整角度。这是绘图练习反馈，不是对艺术能力的判断。',
      },
      {
        title: '练习模式与 UTC 每日挑战',
        body: '练习模式使用稳定目标，适合在同一会话比较不同尝试。每日挑战根据 UTC 日期生成目标，同一个 UTC 日期内的玩家看到相同目标，不需要账号或服务器档案。',
      },
      {
        title: '手机绘图与隐私',
        body: '画布支持鼠标、触控板、触控笔和手指。成绩与最高分只保存在当前浏览器的本地存储中。Luma 不保存轨迹、不上传图片，也不要求邮箱。',
      },
    ],
    faqTitle: '在线画完美圆常见问题',
    faqs: [
      {
        question: '手机可以画完美圆吗？',
        answer: '可以。现代手机浏览器支持手指和触控笔绘制，桌面端也支持鼠标和触控板。',
      },
      {
        question: '分数是怎么算的？',
        answer: '分数综合拟合圆度、首尾闭合、笔画平滑度和角度覆盖度；原始绘图坐标不会发送到 Luma 分析服务。',
      },
      {
        question: '有每日画圆挑战吗？',
        answer: '有。每日目标基于 UTC 日期生成，同一个 UTC 日期内的玩家看到相同目标。',
      },
      {
        question: 'Luma Circle 是 Neal.fun 或其他游戏的版本吗？',
        answer: '不是。Luma Circle 是 Luma Game Hub 的原创实验，评分展示和实现均独立完成。',
      },
    ],
    relatedTitle: '继续探索 Luma',
    related: [
      {
        href: '/games/checkers-rules',
        title: 'Checkers 规则训练器',
        description: '尝试原创本地棋盘，查看合法走法和强制吃子提示。',
      },
      {
        href: '/games/snake-3d',
        title: '3D 贪吃蛇',
        description: '体验带有 UTC 挑战、本地最高分和触控操作的短局游戏。',
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

interface LumaCirclePageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(value: string): Locale {
  return value === 'en' ? 'en' : 'zh';
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: LumaCirclePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const canonical = getLocalizedPath(locale, LUMA_CIRCLE_PATH);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords:
      locale === 'en'
        ? ['draw a perfect circle', 'perfect circle game', 'circle drawing game', 'draw circle online']
        : ['画完美的圆', '在线画圆游戏', '圆度测试', '每日画圆挑战'],
    robots: { index: false, follow: true },
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath('zh', LUMA_CIRCLE_PATH),
        'en-US': getLocalizedPath('en', LUMA_CIRCLE_PATH),
        'x-default': getLocalizedPath('en', LUMA_CIRCLE_PATH),
      },
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonical,
      type: 'website',
    },
  };
}

export default async function LumaCirclePage({ params }: LumaCirclePageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const canonical = getLocalizedPath(locale, LUMA_CIRCLE_PATH);
  const pageUrl = buildAbsoluteUrl(canonical);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  const gameJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Luma Circle',
    url: pageUrl,
    description: content.metaDescription,
    applicationCategory: 'Game',
    gamePlatform: 'Web browser',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    author: { '@type': 'Organization', name: 'Luma Game Hub', url: buildAbsoluteUrl('/about') },
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
          <h1 id="luma-circle-title" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">{content.title}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{content.intro}</p>
        </div>
        <Link href={getLocalizedPath(locale, '/games')} className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{content.back}</Link>
      </header>

      <LumaCircleGame locale={locale} />

      <article className="mt-12 space-y-10">
        {content.sections.map(section => (
          <section key={section.title} className="border-t border-border pt-7">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{section.title}</h2>
            <p className="mt-3 max-w-4xl text-base leading-7 text-muted-foreground">{section.body}</p>
          </section>
        ))}
        <section className="border-t border-border pt-7">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{content.faqTitle}</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {content.faqs.map(faq => (
              <div key={faq.question}>
                <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="border-t border-border pt-7">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{content.relatedTitle}</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            {content.related.map(item => (
              <div key={item.href}>
                <Link href={getLocalizedPath(locale, item.href)} className="text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.title}</Link>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
