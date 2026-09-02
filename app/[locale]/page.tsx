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
import { PortalRail } from '@/components/layout/PortalRail';

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

const LUMA_OWNED_SHELF_IMAGE = '/og-gamehub.svg';

function ShelfSection({
  id,
  title,
  description,
  browseHref,
  browseLabel,
  entries,
  priorityFirstImages = false,
}: ShelfSectionProps) {
  const desktopGridClass =
    entries.length >= 6
      ? 'lg:grid-cols-6'
      : entries.length >= 4
        ? 'lg:grid-cols-5'
        : 'lg:grid-cols-3';

  return (
    <section aria-labelledby={id} className="mt-7" data-catalog-shelf>
      <div className="mb-3 flex flex-col gap-1 border-b-2 border-[#18251f] pb-2 sm:flex-row sm:items-end sm:justify-between dark:border-border">
        <div>
          <h2
            id={id}
            className="text-lg font-black tracking-tight text-[#18251f] sm:text-xl dark:text-foreground"
          >
            {title}
          </h2>
          <p className="mt-0.5 hidden max-w-2xl text-[11px] leading-4 text-[#66746d] sm:block sm:text-xs dark:text-muted-foreground">
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

      <div
        className={`game-shelf-scroll grid grid-cols-2 gap-3 sm:grid-cols-3 ${desktopGridClass}`}
      >
        {entries.map((entry, index) => (
          <Link
            key={entry.href}
            href={entry.href}
            data-shelf-card
            className="group flex h-full min-w-0 snap-start flex-col overflow-hidden rounded-md border border-[#dce4df] bg-white text-left transition hover:-translate-y-0.5 hover:border-emerald-700/60 hover:shadow-[0_8px_20px_-16px_rgba(16,58,38,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-border dark:bg-card"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={entry.image}
                alt={`${entry.title} cover`}
                fill
                sizes="(max-width: 640px) 58vw, (max-width: 1024px) 40vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                priority={priorityFirstImages && index < 2}
              />
              <span className="absolute left-2 top-2 rounded-sm bg-[#102033]/90 px-1.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                {entry.eyebrow}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-2 sm:p-2.5">
              <h3 className="mt-0.5 line-clamp-2 text-sm font-black leading-5 text-foreground sm:text-base">
                {entry.title}
              </h3>
              <p className="sr-only">{entry.description}</p>
              <span className="sr-only">{entry.action}</span>
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

  // Editorial links can discuss third-party games, but their cards use Luma-owned
  // generic artwork rather than captured game screenshots.
  const popularGuideEntries: ShelfEntry[] =
    locale === 'zh'
      ? [
          {
            href: getLocalizedPath(locale, '/guides/google-snake-mods'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: '热门攻略',
            title: 'Google Snake Mods',
            description:
              '先分清模组网页版、Loader 和标准 Snake，避免失效书签与未知下载。',
            action: '阅读攻略',
          },
          {
            href: getLocalizedPath(locale, '/guides/drive-mad-walkthrough'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: '热门攻略',
            title: 'Drive Mad Walkthrough',
            description:
              '掌握油门、刹车和翻车后的重试节奏，处理桥梁、斜坡与高难关卡。',
            action: '阅读攻略',
          },
          {
            href: getLocalizedPath(locale, '/guides/quick-play-guide'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: '场景攻略',
            title: '快速游玩指南',
            description:
              '按启动速度、规则清晰度和暂停成本，快速找到适合短暂休息的浏览器游戏。',
            action: '查看指南',
          },
          {
            href: getLocalizedPath(locale, '/guides/google-snake-level-editor'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: '新攻略',
            title: 'Google Snake Level Editor',
            description: '查看编辑器入口、制作步骤和移动端限制。',
            action: '查看编辑器指南',
          },
          {
            href: getLocalizedPath(
              locale,
              '/guides/big-tower-tiny-square-walkthrough',
            ),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: '关卡攻略',
            title: 'Big Tower Tiny Square',
            description: '从检查点、跳跃节奏和高塔路线开始。',
            action: '查看关卡技巧',
          },
        ]
      : [
          {
            href: getLocalizedPath(locale, '/guides/google-snake-mods'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Popular guide',
            title: 'Google Snake Mods',
            description:
              'Compare the maintained mod page, loader route, and clearly labelled standard Snake fallback.',
            action: 'Read the guide',
          },
          {
            href: getLocalizedPath(locale, '/guides/drive-mad-walkthrough'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Popular guide',
            title: 'Drive Mad Walkthrough',
            description:
              'Use lighter throttle, earlier braking, and fast retries for bridges, slopes, and hard levels.',
            action: 'Read the guide',
          },
          {
            href: getLocalizedPath(locale, '/guides/quick-play-guide'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Play context',
            title: 'Quick Play Guide',
            description:
              'Choose browser games by launch speed, clear rules, and how easily you can pause a short session.',
            action: 'Read the guide',
          },
          {
            href: getLocalizedPath(locale, '/guides/google-snake-level-editor'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'New guide',
            title: 'Google Snake Level Editor',
            description: 'Find the editor route, build steps, and mobile limits.',
            action: 'Read the editor guide',
          },
          {
            href: getLocalizedPath(
              locale,
              '/guides/big-tower-tiny-square-walkthrough',
            ),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Level guide',
            title: 'Big Tower Tiny Square',
            description: 'Use checkpoints, jump timing, and a safer tower route.',
            action: 'Read the level tips',
          },
        ];

  // Homepage playable inventory is intentionally first-party/self-hosted only.
  const moreGameEntries: ShelfEntry[] =
    locale === 'zh'
      ? [
          {
            href: getLocalizedPath(locale, '/games/2-player-unblocked'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Luma 自托管',
            title: '双人同键盘小游戏',
            description:
              '三款有明确来源和许可记录的 Luma 自托管双人浏览器游戏。',
            action: '开始双人游戏',
          },
          {
            href: getLocalizedPath(locale, '/games/spend-bill-gates-money'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Luma Original',
            title: 'Spend Bill Gates Money',
            description: '用 1000 亿美元预算进行可撤销购买的财富模拟器。',
            action: '开始模拟',
          },
          {
            href: getLocalizedPath(locale, '/games/snake-3d'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Luma Original',
            title: 'Luma Snake 3D',
            description:
              '支持键盘与触控的 3D 贪吃蛇，包含 UTC 每日挑战和本地最高分。',
            action: '开始挑战',
          },
        ]
      : [
          {
            href: getLocalizedPath(locale, '/games/2-player-unblocked'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Luma self-hosted',
            title: 'Same-keyboard 2 player games',
            description:
              'Three Luma-hosted browser games with explicit provenance and license records.',
            action: 'Play together',
          },
          {
            href: getLocalizedPath(locale, '/games/spend-bill-gates-money'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Luma Original',
            title: 'Spend Bill Gates Money',
            description:
              'A reversible $100 billion spending simulator built as a Luma original experience.',
            action: 'Start spending',
          },
          {
            href: getLocalizedPath(locale, '/games/snake-3d'),
            image: LUMA_OWNED_SHELF_IMAGE,
            eyebrow: 'Luma Original',
            title: 'Luma Snake 3D',
            description:
              'A keyboard-and-touch snake challenge with UTC daily boards and local high scores.',
            action: 'Start a run',
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
      <div className="bg-[#f7f8f6] px-3 pb-20 pt-2 sm:px-4 md:px-6 md:pt-3 dark:bg-background">
        <div className="mx-auto grid w-full max-w-7xl md:grid-cols-[52px_minmax(0,1fr)] md:gap-4">
          <PortalRail locale={locale} active="home" />
          <div className="min-w-0">
            <header className="flex flex-col gap-1 border-b border-[#dce4df] pb-2 md:flex-row md:items-center md:justify-between dark:border-border">
              <div className="min-w-0 max-w-4xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-400">
                  {locale === 'zh' ? '免费在线小游戏' : 'Free browser games'}
                </p>
                <h1 className="mt-0.5 max-w-4xl text-lg font-black tracking-tight text-[#152238] sm:text-xl dark:text-foreground">
                  {heroTitle}
                </h1>
                <p className="mt-0.5 hidden max-w-3xl text-xs leading-4 text-[#61766a] sm:block dark:text-muted-foreground">
                  {t('description')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:flex-none md:justify-end">
                <Link
                  href={getLocalizedPath(locale, '/games')}
                  className="hidden min-h-8 items-center gap-1 text-xs font-bold text-emerald-800 transition hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 sm:inline-flex dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  {locale === 'zh' ? '游戏' : 'Games'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={getLocalizedPath(locale, '/guides')}
                  className="hidden min-h-8 items-center gap-1 text-xs font-bold text-emerald-800 transition hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 sm:inline-flex dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  {locale === 'zh' ? '攻略' : 'Guides'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </header>

            <div className="mt-2 md:hidden">
              <SearchInput locale={locale} className="w-full" />
            </div>

            <nav
              aria-label={locale === 'zh' ? '快速入口' : 'Quick links'}
              className="mt-2 flex gap-1.5 overflow-x-auto border-b border-[#dce4df] pb-2 dark:border-border"
            >
              {[
                {
                  href: '/games/2-player-unblocked',
                  zh: '双人自托管',
                  en: '2 player',
                },
                { href: '/games/snake-3d', zh: 'Luma Snake', en: 'Luma Snake' },
                {
                  href: '/games/spend-bill-gates-money',
                  zh: '财富模拟',
                  en: 'Money simulator',
                },
                { href: '/guides', zh: '攻略', en: 'Guides' },
                { href: '/games/saved', zh: '我的收藏', en: 'Saved games' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={getLocalizedPath(locale, item.href)}
                  className="inline-flex min-h-8 shrink-0 items-center rounded-full border border-[#d5e0da] bg-white px-3 text-[11px] font-bold text-[#30483a] transition hover:border-emerald-700/60 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-border dark:bg-card dark:text-foreground"
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
                  ? '攻略可以讨论第三方游戏，但卡片只使用 Luma 自有视觉，不复制未验证游戏截图。'
                  : 'Guides may discuss third-party games, while cards use Luma-owned artwork rather than unverified captured screenshots.'
              }
              browseHref={getLocalizedPath(locale, '/guides')}
              browseLabel={locale === 'zh' ? '查看全部攻略' : 'Browse all guides'}
              entries={popularGuideEntries}
            />

            <ShelfSection
              id="more-games"
              title={locale === 'zh' ? 'Luma 可直接玩的游戏' : 'Playable on Luma'}
              description={
                locale === 'zh'
                  ? '这里只推荐 Luma 原创或自托管、来源和许可已经记录的可玩体验。'
                  : 'This shelf is limited to Luma-original or self-hosted playable experiences with documented provenance and license records.'
              }
              browseHref={getLocalizedPath(locale, '/games')}
              browseLabel={locale === 'zh' ? '查看游戏目录' : 'Browse games'}
              entries={moreGameEntries}
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
                        '/guides/games-to-play-when-bored',
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
