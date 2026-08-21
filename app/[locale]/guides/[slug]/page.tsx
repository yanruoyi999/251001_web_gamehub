import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { GamePlayerFacade } from '@/components/game/game-player-facade';
import { DominoesTraining } from '@/components/game/dominoes-training';
import {
  getSeoLandingPage,
  getSeoLandingPages,
  type SeoLandingPage,
} from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import { getGuidePresentation } from '@/lib/guide-presentation';
import {
  DEFAULT_OPEN_GRAPH_IMAGES,
  DEFAULT_TWITTER_IMAGES,
  buildAbsoluteUrl,
  buildContextualMetaDescription,
  getSiteBaseUrl,
} from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86400;

export function generateStaticParams() {
  const pages = getSeoLandingPages();
  return locales.flatMap(locale =>
    pages.map(page => ({
      locale,
      slug: page.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const page = getSeoLandingPage(slug);

  if (!page) {
    return {};
  }

  const locale = (localeParam as Locale) ?? 'zh';
  const content = page.locales[locale] ?? page.locales.zh;
  const basePath = getLocalizedPath(locale, `/guides/${page.slug}`);
  const description = buildContextualMetaDescription({
    description: content.metaDescription,
    fallback: content.subheading,
    context:
      locale === 'zh'
        ? '本页包含可执行的玩法或选择建议、常见问题、相关游戏与专题内链，并明确标注来源、安全边界和设备适配信息。'
        : 'This guide includes actionable play or selection advice, FAQs, related games and internal guides, plus source, safety, and device-context notes.',
    locale,
  });

  return {
    title: content.metaTitle,
    description,
    keywords: page.keywords,
    alternates: {
      canonical: basePath,
      languages: Object.fromEntries(
        locales.map(loc => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          getLocalizedPath(loc, `/guides/${page.slug}`),
        ])
      ),
    },
    openGraph: {
      title: content.metaTitle,
      description,
      url: basePath,
      type: 'article',
      publishedTime: page.updatedAt,
      tags: page.keywords,
      images: DEFAULT_OPEN_GRAPH_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description,
      images: DEFAULT_TWITTER_IMAGES,
    },
    ...(page.indexable === false
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
  };
}

interface GuidePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const gameIndex = new Map(mockGames.map(game => [game.slug, game]));

function getRelatedPages(current: SeoLandingPage, locale: Locale) {
  return current.relatedSlugs
    .map(slug => getSeoLandingPage(slug))
    .filter((page): page is SeoLandingPage => Boolean(page))
    .map(page => ({
      slug: page.slug,
      heading: page.locales[locale]?.heading ?? page.locales.zh.heading,
    }));
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam as Locale) ?? 'zh';
  const page = getSeoLandingPage(slug);

  if (!page) {
    notFound();
  }

  const siteBaseUrl = getSiteBaseUrl();
  const content = page.locales[locale] ?? page.locales.zh;
  const pageUrl = buildAbsoluteUrl(
    getLocalizedPath(locale, `/guides/${page.slug}`)
  );
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.heading,
    description: content.metaDescription,
    mainEntityOfPage: pageUrl,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    author: {
      '@type': 'Organization',
      name: 'Luma Game Hub Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Luma Game Hub',
      url: siteBaseUrl,
      logo: {
        '@type': 'ImageObject',
        url: buildAbsoluteUrl('/og-gamehub.svg'),
      },
    },
    datePublished: page.updatedAt,
    dateModified: page.updatedAt,
    articleSection: 'Browser Games',
    keywords: page.keywords.join(', '),
    citation: [content.quickAnswerLink, ...(content.externalLinks ?? [])]
      .filter((link): link is NonNullable<typeof link> => Boolean(link))
      .map(link => link.href),
  };
  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  const breadcrumbLabels =
    locale === 'zh'
      ? ['首页', '专题合集', content.heading]
      : ['Home', 'Guides', content.heading];
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: breadcrumbLabels[0],
        item: buildAbsoluteUrl(getLocalizedPath(locale)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbLabels[1],
        item: buildAbsoluteUrl(getLocalizedPath(locale, '/guides')),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: breadcrumbLabels[2],
        item: pageUrl,
      },
    ],
  };
  const structuredData = [jsonLdArticle, jsonLdFaq, jsonLdBreadcrumb];
  const relatedPages = getRelatedPages(page, locale);
  const embedGameThumbnail =
    page.embedGame?.thumbnailUrl ??
    (page.embedGame?.playSlug
      ? gameIndex.get(page.embedGame.playSlug)?.thumbnailUrl
      : undefined);
  const { quickAnswer, detailSections } = getGuidePresentation(content);
  const quickAnswerBullets = quickAnswer.bullets?.slice(0, 3) ?? [];
  const formattedUpdatedAt = new Intl.DateTimeFormat(
    locale === 'zh' ? 'zh-CN' : 'en-US',
    {
      dateStyle: 'medium',
      timeZone: 'UTC',
    }
  ).format(new Date(page.updatedAt));

  return (
    <article
      className="mx-auto w-full max-w-7xl bg-[#f1f7e9] px-3 py-5 sm:px-4 md:px-6 md:py-7 dark:bg-background"
      data-printable-guide={page.printablePath ? 'true' : undefined}
    >
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
      <nav className="mb-4 text-xs text-muted-foreground" data-print-hide>
        <Link
          href={getLocalizedPath(locale, '/guides')}
          className="hover:text-primary"
        >
          {locale === 'zh' ? '← 返回专题合集' : '← Back to guides'}
        </Link>
      </nav>

      <header className="mb-5 max-w-5xl border-b border-[#cbdccf] pb-4 dark:border-border">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          {locale === 'zh' ? 'Luma 游戏指南' : 'Luma Game Guide'}
        </p>
        <h1 className="mt-1 max-w-5xl text-2xl font-black tracking-tight text-[#152238] sm:text-3xl md:text-4xl dark:text-foreground">
          {content.heading}
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
          {content.subheading}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
          <span>
            {locale === 'zh'
              ? '作者：Luma Game Hub 编辑团队'
              : 'By Luma Game Hub Editorial'}
          </span>
          <span aria-hidden="true">•</span>
          <time dateTime={page.updatedAt}>
            {locale === 'zh'
              ? `更新于 ${formattedUpdatedAt}`
              : `Updated ${formattedUpdatedAt}`}
          </time>
          <span aria-hidden="true">•</span>
          <span>
            {locale === 'zh' ? '已对照来源核验' : 'Verified against source'}
          </span>
        </div>
      </header>

      {page.printablePath ? (
        <div className="mb-5 flex flex-wrap gap-2" data-print-hide>
          <a
            href={page.printablePath}
            download
            className="inline-flex min-h-10 items-center rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm"
          >
            {locale === 'zh'
              ? '下载一页打印规则 PDF'
              : 'Download one-page printable PDF'}
          </a>
          <a
            href="#guide-details"
            className="inline-flex min-h-10 items-center rounded-md border border-border bg-background px-3 py-2 text-xs font-bold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm"
          >
            {locale === 'zh' ? '查看完整规则' : 'Read the full rules'}
          </a>
        </div>
      ) : null}

      <section className="mb-7 max-w-5xl border-y border-primary/25 bg-primary/5 px-3 py-4 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {locale === 'zh' ? '快速答案' : 'Quick answer'}
        </p>
        <h2 className="mt-1 text-lg font-black text-foreground sm:text-xl">
          {quickAnswer.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-foreground/90 sm:text-base">
          {quickAnswer.body}
        </p>
        {quickAnswerBullets.length > 0 ? (
          <ul className="mt-4 grid gap-2 text-sm text-foreground/80 md:grid-cols-3">
            {quickAnswerBullets.map(item => (
              <li
                key={item}
                className="border-l-2 border-primary/30 px-3 py-2 text-xs sm:text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        {content.quickAnswerLink ? (
          <a
            href={content.quickAnswerLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex max-w-xl items-center justify-between gap-4 rounded-md border border-primary/30 bg-background px-3 py-2.5 text-left transition hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>
              <span className="block font-semibold text-primary">
                {content.quickAnswerLink.label}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {content.quickAnswerLink.description}
              </span>
            </span>
            <span aria-hidden className="text-primary">
              ↗
            </span>
          </a>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium">
          <a
            href="#guide-details"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {locale === 'zh' ? '继续看指南' : 'Read the guide'}
          </a>
          {page.embedGame ? (
            <a
              href="#play"
              className="rounded-md border border-primary/30 bg-background px-4 py-2 text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {page.embedGame.playLabel?.[locale] ??
                (locale === 'zh' ? '先试玩游戏' : 'Play first')}
            </a>
          ) : null}
          <a
            href="#recommendations"
            className="rounded-md border border-border bg-background px-4 py-2 text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {locale === 'zh' ? '看相似游戏' : 'See similar games'}
          </a>
        </div>
      </section>

      {page.interactiveWidget === 'dominoes-training' ? (
        <DominoesTraining locale={locale} />
      ) : null}

      {page.embedGame ? (
        <section
          id="play"
          tabIndex={-1}
          className="mb-10 max-w-4xl scroll-mt-24 focus:outline-none"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-black shadow-sm">
            <div className="aspect-video">
              <GamePlayerFacade
                iframeUrl={page.embedGame.iframeUrl}
                title={page.embedGame.title}
                thumbnailUrl={embedGameThumbnail ?? null}
                locale={locale}
                gameSlug={page.embedGame.playSlug ?? page.slug}
                source="guide_embed"
                playLabel={page.embedGame.playLabel?.[locale]}
                fallbackHref={
                  page.embedGame.playSlug
                    ? getLocalizedPath(
                        locale,
                        `/games/${page.embedGame.playSlug}`
                      )
                    : undefined
                }
              />
            </div>
          </div>
          {page.embedGame.playSlug ? (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              <Link
                href={getLocalizedPath(
                  locale,
                  `/games/${page.embedGame.playSlug}`
                )}
                className="font-medium text-primary transition hover:text-primary/80"
              >
                {locale === 'zh'
                  ? `打开 ${page.embedGame.title} 全屏游戏页 →`
                  : `Open the full ${page.embedGame.title} game page →`}
              </Link>
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="max-w-3xl space-y-4 text-base leading-relaxed text-foreground/90">
        {content.overview.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      {page.slug === 'google-snake-mods' ? (
        <section
          aria-labelledby="related-spend-bill-gates-money"
          className="mt-10 max-w-3xl border-t border-border pt-7"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {locale === 'zh' ? '相似浏览器游戏' : 'Similar browser game'}
          </p>
          <h2
            id="related-spend-bill-gates-money"
            className="mt-2 text-2xl font-semibold text-foreground"
          >
            {locale === 'zh'
              ? '想换个挑战？试试花光1000亿美元'
              : 'Try a different challenge: spend $100 billion'}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {locale === 'zh'
              ? '如果你喜欢快速打开的浏览器挑战，可以试试无需下载、支持撤销购买并生成分享结果的亿万富翁消费模拟器。'
              : 'If you like quick browser challenges, try a no-download billionaire spending simulator with reversible purchases and a shareable result.'}
          </p>
          <Link
            href={getLocalizedPath(locale, '/games/spend-bill-gates-money')}
            className="mt-4 inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {locale === 'zh'
              ? '试玩花钱模拟游戏'
              : 'Try the money spending simulator'}{' '}
            →
          </Link>
        </section>
      ) : null}

      {page.video ? (
        <section className="mx-auto mt-12 max-w-3xl" data-print-hide>
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-foreground">
              {locale === 'zh' ? '官方玩法视频' : 'Official play video'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === 'zh'
                ? '视频来自 Playworks 的公开活动页面；如果你的浏览器阻止第三方播放器，仍可直接按文字规则进行。'
                : 'This video comes from Playworks’ public activity page. If your browser blocks third-party players, the written rules above are complete.'}
            </p>
          </header>
          <div className="aspect-video overflow-hidden rounded-md border border-border bg-black shadow-sm">
            <iframe
              src={page.video.embedUrl}
              title={page.video.title}
              loading="lazy"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <a
            href={page.video.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-medium text-primary transition hover:text-primary/80"
          >
            {locale === 'zh'
              ? '在 YouTube 核对视频来源 ↗'
              : 'Verify the video source on YouTube ↗'}
          </a>
        </section>
      ) : null}

      {content.screenshots?.length ? (
        <section aria-labelledby="verified-game-views" className="mt-12">
          <header className="mx-auto max-w-3xl text-center">
            <h2
              id="verified-game-views"
              className="text-2xl font-semibold text-foreground"
            >
              {locale === 'zh' ? '实测画面' : 'Verified game views'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === 'zh'
                ? '以下画面来自创作者官方 itch.io 页面中的 HTML5 版本，采集于 2026 年 7 月 21 日。'
                : 'These views come from the HTML5 build on the creator’s official itch.io page, captured July 21, 2026.'}
            </p>
          </header>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {content.screenshots.map(screenshot => (
              <figure
                key={screenshot.url}
                className="overflow-hidden rounded-md border border-border bg-card shadow-sm"
              >
                <Image
                  src={screenshot.url}
                  alt={screenshot.alt}
                  width={960}
                  height={960}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="aspect-square w-full bg-black object-contain"
                />
                <figcaption className="space-y-2 p-4 text-sm text-muted-foreground">
                  <p>{screenshot.caption}</p>
                  <a
                    href={screenshot.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex font-medium text-primary transition hover:text-primary/80"
                  >
                    {locale === 'zh'
                      ? '核对官方来源 ↗'
                      : 'Verify official source ↗'}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section
        id="guide-details"
        tabIndex={-1}
        className="mt-10 max-w-5xl scroll-mt-24 border-t border-[#cbdccf] focus:outline-none dark:border-border"
      >
        {detailSections.map(section => (
          <div
            key={section.title}
            className="border-b border-[#cbdccf] py-5 dark:border-border"
          >
            <h2 className="text-xl font-black text-foreground sm:text-2xl">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground/90 sm:text-base">
              {section.body}
            </p>
            {section.bullets ? (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {section.bullets.map((item, bulletIndex) => (
                  <li key={bulletIndex}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      <section
        id="recommendations"
        tabIndex={-1}
        className="mt-16 scroll-mt-24 focus:outline-none"
      >
        <header className="mb-4 border-b border-[#cbdccf] pb-3 dark:border-border">
          <h2 className="text-xl font-black text-foreground sm:text-2xl">
            {locale === 'zh' ? '精选推荐' : 'Featured Picks'}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {locale === 'zh'
              ? '以下游戏可从详情页直接打开浏览器播放器，无需下载安装。'
              : 'Each recommendation opens a browser player from its detail page with no download required.'}
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {content.recommendations.map(item => {
            const game = gameIndex.get(item.slug);
            const gameTitle =
              locale === 'zh'
                ? (game?.title ?? item.slug)
                : (game?.titleEn ?? game?.title ?? item.slug);
            const gameDescription =
              locale === 'zh'
                ? (game?.description ?? '')
                : (game?.descriptionEn ?? game?.description ?? '');

            return (
              <article
                key={item.slug}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-[8px] border border-[#cbdccf] bg-white transition hover:-translate-y-0.5 hover:border-primary/50 dark:border-border dark:bg-card"
              >
                {game?.thumbnailUrl?.startsWith('/game-screenshots/') ? (
                  <Link
                    href={getLocalizedPath(locale, `/games/${item.slug}`)}
                    aria-label={locale === 'zh' ? `打开${gameTitle}` : `Open ${gameTitle}`}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-muted">
                      <Image
                        src={game.thumbnailUrl}
                        alt={`${gameTitle} gameplay screenshot`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  </Link>
                ) : null}
                <div className="p-3">
                  <h3 className="text-base font-black text-foreground">
                    {gameTitle}
                  </h3>
                  {gameDescription ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {gameDescription}
                    </p>
                  ) : null}
                  <p className="sr-only">{item.pitch}</p>
                  <div className="mt-2">
                    <Link
                      href={getLocalizedPath(locale, `/games/${item.slug}`)}
                      className="inline-flex items-center text-primary transition hover:text-primary/80"
                    >
                      {locale === 'zh'
                        ? `查看 ${gameTitle} 游戏详情`
                        : `See ${gameTitle} browser game details`}{' '}
                      →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-14 border-t border-border bg-secondary/60 px-5 py-7 sm:px-7">
        <h2 className="text-2xl font-semibold text-foreground">
          {locale === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <dl className="mt-6 space-y-6">
          {content.faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-border bg-card/60 p-4 last:border-b-0"
            >
              <dt className="text-base font-semibold text-foreground">
                {faq.question}
              </dt>
              <dd className="mt-2 text-sm text-foreground/90">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90"
          >
            <Link href={getLocalizedPath(locale, '/games')}>
              {content.ctaLabel}
            </Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            {content.ctaDescription}
          </p>
      </section>

      {relatedPages.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            {locale === 'zh' ? '相关主题' : 'Related Guides'}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {relatedPages.map(related => (
              <li key={related.slug}>
                <Link
                  href={getLocalizedPath(locale, `/guides/${related.slug}`)}
                  className="inline-flex items-center text-primary transition hover:text-primary/80"
                  prefetch
                >
                  {related.heading} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {content.externalLinks?.length ? (
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            {locale === 'zh' ? '官方与参考链接' : 'Official & Reference Links'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {locale === 'zh'
              ? '这些外部链接用于核对游戏来源和创作者信息，不代表 Luma 与相关站点存在商业合作。'
              : 'Use these external links to verify the game source and creator context; they do not imply a commercial partnership with Luma.'}
          </p>
          <ul className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            {content.externalLinks.map(link => (
              <li
                key={link.href}
                className="rounded-md border border-border bg-card p-4"
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary transition hover:text-primary/80"
                >
                  {link.label} →
                </a>
                <p className="mt-2 text-muted-foreground">{link.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
