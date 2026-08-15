import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowRight, Check } from 'lucide-react';
import { getMessages, getTranslations } from 'next-intl/server';

import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { getShanghaiDateKey } from '@/lib/retention/daily-recommendation';
import { serializeJsonLd } from '@/lib/utils/json-ld';
import { DailyRecommendation } from '@/components/retention/daily-recommendation';

type FaqItem = { question: string; answer: string };

type HomeMessages = {
  title?: string;
  seoSection?: {
    title?: string;
    description?: string;
    points?: string[];
    cta?: string;
  };
  evilSection?: {
    title?: string;
    description?: string;
    points?: string[];
    cta?: string;
  };
  faq?: {
    title?: string;
    items?: FaqItem[];
  };
};

interface CuratedEntry {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  action: string;
}

export const dynamic = 'force-static';
export const revalidate = 86_400;

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : 'zh';
  const t = await getTranslations({ locale, namespace: 'home' });

  const messages = (await getMessages({ locale })) as { home?: HomeMessages };
  const homeMessages = messages.home ?? {};
  const seoSection = homeMessages.seoSection ?? {};
  const evilSection = homeMessages.evilSection ?? {};
  const faqSection = homeMessages.faq ?? {};

  const heroTitle =
    typeof homeMessages.title === 'string' ? homeMessages.title : t('title');
  const seoPoints = Array.isArray(seoSection.points) ? seoSection.points : [];
  const evilPoints = Array.isArray(evilSection.points)
    ? evilSection.points
    : [];
  const faqItems = Array.isArray(faqSection.items) ? faqSection.items : [];
  const recommendationDateKey = getShanghaiDateKey();
  const curatedEntries: CuratedEntry[] =
    locale === 'zh'
      ? [
          {
            href: getLocalizedPath(locale, '/guides/google-snake-mods'),
            image: '/game-screenshots/google-snake.png',
            eyebrow: '当前热门指南',
            title: 'Google Snake Mods',
            description:
              '先分清模组网页版、Loader 和标准 Snake，避免失效书签与未知下载。',
            action: '查看安全选择',
          },
          {
            href: getLocalizedPath(locale, '/games/big-tower-tiny-square'),
            image: '/game-screenshots/big-tower-tiny-square.png',
            eyebrow: '关键词测试',
            title: 'Big Tower Tiny Square',
            description:
              '围绕 big tall small 的搜索意图，直接体验带检查点的垂直平台挑战。',
            action: '开始爬塔',
          },
          {
            href: getLocalizedPath(locale, '/games/g-switch-2'),
            image: '/game-screenshots/g-switch-2.png',
            eyebrow: '关键词测试',
            title: 'G-Switch 2',
            description:
              '测试 gravity run 相关需求，练习反转重力、读障碍和保持跑线。',
            action: '开始跑酷',
          },
          {
            href: getLocalizedPath(locale, '/games/solitaire'),
            image: '/game-screenshots/solitaire.png',
            eyebrow: '直接游玩',
            title: 'Solitaire',
            description: '无需安装或注册，打开后即可开始一局经典纸牌。',
            action: '开始 Solitaire',
          },
        ]
      : [
          {
            href: getLocalizedPath(locale, '/guides/google-snake-mods'),
            image: '/game-screenshots/google-snake.png',
            eyebrow: 'Popular guide',
            title: 'Google Snake Mods',
            description:
              'Compare the maintained mod page, loader route, and clearly labelled standard Snake fallback.',
            action: 'Choose a safe route',
          },
          {
            href: getLocalizedPath(locale, '/games/big-tower-tiny-square'),
            image: '/game-screenshots/big-tower-tiny-square.png',
            eyebrow: 'Keyword test',
            title: 'Big Tower Tiny Square',
            description:
              'Test the big tall small intent with a checkpoint-based vertical platform challenge.',
            action: 'Climb the tower',
          },
          {
            href: getLocalizedPath(locale, '/games/g-switch-2'),
            image: '/game-screenshots/g-switch-2.png',
            eyebrow: 'Keyword test',
            title: 'G-Switch 2',
            description:
              'Test the gravity run intent with gravity flips, obstacle reading, and clean lines.',
            action: 'Start the run',
          },
          {
            href: getLocalizedPath(locale, '/games/solitaire'),
            image: '/game-screenshots/solitaire.png',
            eyebrow: 'Play now',
            title: 'Solitaire',
            description:
              'Start a classic card game in the browser with no install or Luma account.',
            action: 'Play Solitaire',
          },
        ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <main className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
              {locale === 'zh' ? '打开浏览器就能玩' : 'Open. Choose. Play.'}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t('description')}
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href={getLocalizedPath(locale, '/games')}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-7 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t('playNow')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={getLocalizedPath(locale, '/guides')}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-emerald-700/40 bg-background px-7 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-700/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-emerald-400"
              >
                {t('browseArchive')}
              </Link>
            </div>
          </header>

          <DailyRecommendation
            dateKey={recommendationDateKey}
            locale={locale}
            surface="home"
          />

          <section aria-labelledby="curated-starts" className="mt-12">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="curated-starts"
                  className="text-2xl font-semibold text-foreground"
                >
                  {locale === 'zh'
                    ? '从这些游戏开始'
                    : 'Start with these games'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === 'zh'
                    ? '基于当前搜索需求与可用玩法挑选，直接进入游戏或实用攻略。'
                    : 'Current high-signal picks with a direct game or a practical guide behind every card.'}
                </p>
              </div>
              <Link
                href={getLocalizedPath(locale, '/games')}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800 sm:mt-0 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                {locale === 'zh' ? '查看全部游戏' : 'Browse all games'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {curatedEntries.map((entry, index) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-700/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={entry.image}
                      alt={`${entry.title} gameplay`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      priority={index < 2}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                      {entry.eyebrow}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-foreground">
                      {entry.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      {entry.action}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="homepage-spend-bill-gates-money"
            className="mx-auto mt-12 max-w-4xl border-t border-border pt-10"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  {locale === 'zh'
                    ? 'Luma 原创互动游戏'
                    : 'Luma original browser game'}
                </p>
                <h2
                  id="homepage-spend-bill-gates-money"
                  className="mt-2 text-2xl font-semibold text-foreground"
                >
                  {locale === 'zh'
                    ? '试试花光1000亿美元的在线消费模拟器'
                    : 'Try an online $100 billion spending simulator'}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {locale === 'zh'
                    ? '无需下载或注册，直接在浏览器中购买、撤销并比较不同消费方案。'
                    : 'Buy, undo, and compare spending plans in the browser with no download or account required.'}
                </p>
              </div>
              <Link
                href={getLocalizedPath(locale, '/games/spend-bill-gates-money')}
                className="inline-flex min-h-11 flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {locale === 'zh'
                  ? '开始花光1000亿美元'
                  : 'Spend $100 billion online'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
          <section className="mt-20 space-y-6 text-left">
            <h2 className="text-center text-3xl font-semibold text-foreground md:text-4xl">
              {seoSection.title ?? t('seoSection.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
              {seoSection.description ?? t('seoSection.description')}
            </p>
            <ul className="mx-auto grid max-w-4xl gap-3 md:grid-cols-3">
              {seoPoints.map(point => (
                <li
                  key={point}
                  className="flex gap-3 rounded-xl border border-border bg-background/80 p-5 shadow-sm"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-700/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
            {seoSection.cta ? (
              <div className="flex justify-center pt-2">
                <Link
                  href={getLocalizedPath(locale, '/guides/free-games-no-ads')}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-700 px-5 py-2.5 font-medium text-emerald-700 transition hover:bg-emerald-700/10 dark:border-emerald-400 dark:text-emerald-400"
                >
                  {seoSection.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </section>

          {evilSection.title ||
          evilSection.description ||
          evilPoints.length > 0 ? (
            <section className="mt-16 space-y-6 text-left">
              <h2 className="text-center text-3xl font-semibold text-foreground md:text-4xl">
                {evilSection.title ?? t('evilSection.title')}
              </h2>
              <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
                {evilSection.description ?? t('evilSection.description')}
              </p>
              <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
                {evilPoints.map(point => (
                  <p
                    key={point}
                    className="rounded-xl border border-border bg-background/80 p-5 text-sm leading-relaxed text-muted-foreground shadow-sm"
                  >
                    {point}
                  </p>
                ))}
              </div>
              {evilSection.cta ? (
                <div className="flex justify-center pt-2">
                  <Link
                    href={getLocalizedPath(
                      locale,
                      '/guides/games-to-play-when-bored'
                    )}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-700 px-5 py-2.5 font-medium text-emerald-700 transition hover:bg-emerald-700/10 dark:border-emerald-400 dark:text-emerald-400"
                  >
                    {evilSection.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : null}
            </section>
          ) : null}

          <section className="mt-16 space-y-6 text-left">
            <h2 className="text-center text-3xl font-semibold text-foreground md:text-4xl">
              {faqSection.title ?? t('faq.title')}
            </h2>
            <div className="mx-auto max-w-3xl space-y-3">
              {faqItems.map(item => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-border bg-background/80 p-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-foreground">
                    <span>{item.question}</span>
                    <ArrowRight
                      className="h-5 w-5 flex-none text-emerald-700 transition-transform group-open:rotate-90 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        strategy="afterInteractive"
      />
    </>
  );
}
