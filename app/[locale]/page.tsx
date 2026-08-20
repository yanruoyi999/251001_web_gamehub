import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowRight, Check } from 'lucide-react';
import { getMessages, getTranslations } from 'next-intl/server';

import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { getShanghaiDateKey } from '@/lib/retention/daily-recommendation';
import { serializeJsonLd } from '@/lib/utils/json-ld';
import { DailyRecommendation } from '@/components/retention/daily-recommendation';
import { SearchInput } from '@/components/game/search-input';

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

interface ShelfEntry {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  action: string;
}

interface ShelfSectionProps {
  id: string;
  title: string;
  description: string;
  browseHref: string;
  browseLabel: string;
  entries: ShelfEntry[];
  priorityFirstImages?: boolean;
}

function ShelfSection({
  id,
  title,
  description,
  browseHref,
  browseLabel,
  entries,
  priorityFirstImages = false,
}: ShelfSectionProps) {
  return (
    <section aria-labelledby={id} className="mt-8" data-catalog-shelf>
      <div className="mb-2 flex flex-col gap-1 border-b border-[#cbdccf] pb-2 sm:flex-row sm:items-end sm:justify-between dark:border-border">
        <div>
          <h2 id={id} className="text-lg font-black tracking-tight text-[#163b2b] sm:text-xl dark:text-foreground">
            {title}
          </h2>
          <p className="mt-0.5 max-w-2xl text-[11px] leading-4 text-[#66806f] sm:text-xs dark:text-muted-foreground">
            {description}
          </p>
        </div>
        <Link
          href={browseHref}
          className="mt-1 inline-flex min-h-8 items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 sm:mt-0 sm:text-sm dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {browseLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="game-shelf-scroll grid grid-flow-col auto-cols-[38%] gap-2.5 overflow-x-auto pb-2 snap-x sm:auto-cols-[24%] lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-6 lg:overflow-visible">
        {entries.map((entry, index) => (
          <Link
            key={entry.href}
            href={entry.href}
            data-shelf-card
            className="group flex h-full snap-start flex-col overflow-hidden rounded-[8px] border border-[#cbdccf] bg-white text-left transition hover:-translate-y-0.5 hover:border-emerald-700/60 hover:shadow-[0_8px_20px_-16px_rgba(16,58,38,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-border dark:bg-card"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={entry.image}
                alt={`${entry.title} gameplay`}
                fill
                sizes="(max-width: 640px) 58vw, (max-width: 1024px) 40vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                priority={priorityFirstImages && index < 2}
              />
            </div>
            <div className="flex flex-1 flex-col p-2 sm:p-2.5">
              <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">
                {entry.eyebrow}
              </p>
              <h3 className="mt-0.5 line-clamp-1 text-sm font-black leading-5 text-foreground sm:text-base">
                {entry.title}
              </h3>
              <p className="sr-only">
                {entry.description}
              </p>
              <span className="sr-only">
                {entry.action}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
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
  const popularGuideEntries: ShelfEntry[] =
    locale === 'zh'
      ? [
          {
            href: getLocalizedPath(locale, '/guides/google-snake-mods'),
            image: '/game-screenshots/google-snake.png',
            eyebrow: '热门攻略',
            title: 'Google Snake Mods',
            description:
              '先分清模组网页版、Loader 和标准 Snake，避免失效书签与未知下载。',
            action: '阅读攻略',
          },
          {
            href: getLocalizedPath(locale, '/guides/drive-mad-walkthrough'),
            image: '/game-screenshots/drive-mad.png',
            eyebrow: '热门攻略',
            title: 'Drive Mad Walkthrough',
            description:
              '掌握油门、刹车和翻车后的重试节奏，处理桥梁、斜坡与高难关卡。',
            action: '阅读攻略',
          },
          {
            href: getLocalizedPath(locale, '/guides/quick-play-guide'),
            image: '/game-screenshots/tunnel-rush.png',
            eyebrow: '场景攻略',
            title: '快速游玩指南',
            description:
              '按启动速度、规则清晰度和暂停成本，快速找到适合短暂休息的浏览器游戏。',
            action: '查看指南',
          },
          {
            href: getLocalizedPath(locale, '/guides/google-snake-level-editor'),
            image: '/game-screenshots/google-snake.png',
            eyebrow: '新攻略',
            title: 'Google Snake Level Editor',
            description: '查看编辑器入口、测试路线和移动端限制。',
            action: '查看编辑器指南',
          },
          {
            href: getLocalizedPath(locale, '/guides/big-tower-tiny-square-walkthrough'),
            image: '/game-screenshots/big-tower-tiny-square.png',
            eyebrow: '关卡攻略',
            title: 'Big Tower Tiny Square',
            description: '从检查点、跳跃节奏和高塔路线开始。',
            action: '查看关卡技巧',
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
            action: 'Read the guide',
          },
          {
            href: getLocalizedPath(locale, '/guides/drive-mad-walkthrough'),
            image: '/game-screenshots/drive-mad.png',
            eyebrow: 'Popular guide',
            title: 'Drive Mad Walkthrough',
            description:
              'Use lighter throttle, earlier braking, and fast retries for bridges, slopes, and hard levels.',
            action: 'Read the guide',
          },
          {
            href: getLocalizedPath(locale, '/guides/quick-play-guide'),
            image: '/game-screenshots/tunnel-rush.png',
            eyebrow: 'Play context',
            title: 'Quick Play Guide',
            description:
              'Choose browser games by launch speed, clear rules, and how easily you can pause a short session.',
            action: 'Read the guide',
          },
          {
            href: getLocalizedPath(locale, '/guides/google-snake-level-editor'),
            image: '/game-screenshots/google-snake.png',
            eyebrow: 'New guide',
            title: 'Google Snake Level Editor',
            description: 'Find the editor route, testing steps, and mobile limits.',
            action: 'Read the editor guide',
          },
          {
            href: getLocalizedPath(locale, '/guides/big-tower-tiny-square-walkthrough'),
            image: '/game-screenshots/big-tower-tiny-square.png',
            eyebrow: 'Level guide',
            title: 'Big Tower Tiny Square',
            description: 'Use checkpoints, jump timing, and a safer tower route.',
            action: 'Read the level tips',
          },
        ];

  const testingGameEntries: ShelfEntry[] =
    locale === 'zh'
      ? [
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
      <div className="bg-[#f1f7e9] px-3 pb-20 pt-2 sm:px-4 md:px-6 md:pt-4 dark:bg-background">
        <div className="mx-auto w-full max-w-7xl">
          <header className="flex flex-col gap-2 border-b border-[#cbdccf] pb-3 md:flex-row md:items-center md:justify-between dark:border-border">
            <div className="min-w-0 max-w-4xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-400">
                {locale === 'zh' ? '精选浏览器游戏' : 'Curated browser games'}
              </p>
              <h1 className="mt-0.5 max-w-4xl text-xl font-black tracking-tight text-[#152238] sm:text-2xl dark:text-foreground">
                {heroTitle}
              </h1>
              <p className="mt-0.5 hidden max-w-2xl text-xs leading-5 text-[#61766a] sm:block sm:text-sm dark:text-muted-foreground">
                {t('description')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:flex-none md:justify-end">
              <Link
                href={getLocalizedPath(locale, '/games')}
                className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-9 sm:px-3 sm:py-1.5 sm:text-sm"
              >
                {t('playNow')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={getLocalizedPath(locale, '/guides')}
                className="hidden min-h-9 items-center justify-center rounded-md border border-[#b9cebf] bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-[#e4f0e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:inline-flex sm:text-sm dark:border-border dark:bg-card dark:text-emerald-400"
              >
                {t('browseArchive')}
              </Link>
            </div>
          </header>

          <div className="mt-2 md:hidden">
            <SearchInput locale={locale} className="w-full" />
          </div>

          <nav
            aria-label={locale === 'zh' ? '快速分类' : 'Quick categories'}
            className="mt-2 flex gap-4 overflow-x-auto border-b border-[#cbdccf] pb-2 dark:border-border"
          >
            {[
              { href: '/games/category/action', zh: '动作', en: 'Action' },
              { href: '/games/category/puzzle', zh: '益智', en: 'Puzzle' },
              {
                href: '/games/category/adventure',
                zh: '冒险',
                en: 'Adventure',
              },
              { href: '/games/category/racing', zh: '竞速', en: 'Racing' },
              { href: '/games/saved', zh: '我的收藏', en: 'Saved games' },
            ].map(item => (
              <Link
                key={item.href}
                href={getLocalizedPath(locale, item.href)}
                className="inline-flex min-h-8 shrink-0 items-center border-b-2 border-transparent px-0.5 text-xs font-bold text-[#30483a] transition hover:border-emerald-700/60 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-foreground"
              >
                {locale === 'zh' ? item.zh : item.en}
              </Link>
            ))}
          </nav>

          <DailyRecommendation
            dateKey={recommendationDateKey}
            locale={locale}
            surface="home"
          />

          <ShelfSection
            id="popular-guides"
            title={locale === 'zh' ? '热门攻略' : 'Popular guides'}
            description={
              locale === 'zh'
                ? '先解决玩法、控制和卡关问题，再决定要不要开始下一局。'
                : 'Solve controls, walkthrough, and stuck-point questions before starting the next round.'
            }
            browseHref={getLocalizedPath(locale, '/guides')}
            browseLabel={locale === 'zh' ? '查看全部攻略' : 'Browse all guides'}
            entries={popularGuideEntries}
          />

          <ShelfSection
            id="testing-games"
            title={locale === 'zh' ? '正在测试的新游戏' : 'Games in testing'}
            description={
              locale === 'zh'
                ? '这些页面对应当前正在验证的搜索需求，先直接试玩，再根据真实反馈决定是否扩展。'
                : 'These pages test current search demand with a playable route before deeper expansion.'
            }
            browseHref={getLocalizedPath(locale, '/games')}
            browseLabel={locale === 'zh' ? '查看全部游戏' : 'Browse all games'}
            entries={testingGameEntries}
            priorityFirstImages
          />
          <section className="mt-14 space-y-5 border-t border-border pt-10 text-left">
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              {seoSection.title ?? t('seoSection.title')}
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {seoSection.description ?? t('seoSection.description')}
            </p>
            <ul className="grid gap-3 md:grid-cols-3">
              {seoPoints.map(point => (
                <li
                  key={point}
                  className="flex gap-3 border-l-2 border-emerald-700/30 bg-card px-4 py-3"
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
              <div className="pt-1">
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
            <section className="mt-14 space-y-5 border-t border-border pt-10 text-left">
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                {evilSection.title ?? t('evilSection.title')}
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {evilSection.description ?? t('evilSection.description')}
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {evilPoints.map(point => (
                  <p
                    key={point}
                    className="border-l-2 border-primary/30 bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {point}
                  </p>
                ))}
              </div>
              {evilSection.cta ? (
                <div className="pt-1">
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

          <section className="mt-14 space-y-5 border-t border-border pt-10 text-left">
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              {faqSection.title ?? t('faq.title')}
            </h2>
            <div className="max-w-4xl space-y-1">
              {faqItems.map(item => (
                <details
                  key={item.question}
                  className="group border-b border-border py-4"
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
      </div>

      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        strategy="afterInteractive"
      />
    </>
  );
}
