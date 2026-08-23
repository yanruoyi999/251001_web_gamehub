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
import {
  canRenderGameIframe,
  shouldPromoteGameInCollections,
} from '@/lib/games/quality-policy';
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
const LUMA_GUIDE_IMAGE = '/og-gamehub.svg';

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
  const playGame = page.playSlug ? gameIndex.get(page.playSlug) : undefined;
  const canonicalPlayHref =
    playGame && shouldPromoteGameInCollections(playGame)
      ? getLocalizedPath(locale, `/games/${playGame.slug}`)
      : null;
  const embedPolicyGame = page.embedGame?.playSlug
    ? gameIndex.get(page.embedGame.playSlug)
    : undefined;
  const embedGameAllowed = Boolean(
    page.embedGame && embedPolicyGame && canRenderGameIframe(embedPolicyGame)
  );
  const embedGameThumbnail = embedGameAllowed ? LUMA_GUIDE_IMAGE : undefined;
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
          {embedGameAllowed ? (
            <a
              href="#play"
              className="rounded-md border border-primary/30 bg-background px-4 py-2 text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {page.embedGame?.playLabel?.[locale] ??
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

      {embedGameAllowed && page.embedGame ? (
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
                fallbackHref={canonicalPlayHref ?? undefined}
              />
            </div>
          </div>
          {canonicalPlayHref ? (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              <Link
                href={canonicalPlayHref}
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
              ? '想换一种轻松的浏览器挑战？'
              : 'Want a different kind of quick browser challenge?'}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
            {locale === 'zh'
              ? '如果你喜欢 Google Snake 这种打开就能玩、规则简单但适合反复挑战的节奏，可以试试 Luma 的 Spend Bill Gates Money。它把操作压力换成取舍和节奏判断，适合休息时快速玩一轮。'
              : 'If you like Google Snake because it launches quickly, has simple rules, and still rewards repeat runs, try Luma’s Spend Bill Gates Money. It swaps reflex pressure for tradeoffs and pacing, making it an easy short-session change of pace.'}
          </p>
          <Link
            href={getLocalizedPath(
              locale,
              '/games/spend-bill-gates-money'
            )}
            className="mt-4 inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {locale === 'zh'
              ? '玩 Spend Bill Gates Money →'
              : 'Play Spend Bill Gates Money →'}
          </Link>
        </section>
      ) : null}

      {detailSections.length > 0 ? (
        <section id="guide-details" className="mt-10 max-w-3xl space-y-8">
          {detailSections.map((section, index) => {
            const paragraphs = Array.isArray(section.paragraphs)
              ? section.paragraphs
              : [];
            const bullets = Array.isArray(section.bullets)
              ? section.bullets
              : [];
            const sectionKey = `${page.slug}-${section.title}-${index}`;

            return (
              <section
                key={sectionKey}
                className={index > 0 ? 'border-t border-border pt-6' : undefined}
              >
                <h2 className="text-2xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground/90">
                  {paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={`${sectionKey}-p-${paragraphIndex}`}>{paragraph}</p>
                  ))}
                </div>
                {bullets.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/85 sm:text-base">
                    {bullets.map((bullet, bulletIndex) => (
                      <li
                        key={`${sectionKey}-b-${bulletIndex}`}
                        className="flex gap-2"
                      >
                        <span className="text-primary">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </section>
      ) : null}

      {canonicalPlayHref ? (
        <section className="mt-10 max-w-3xl border-t border-border pt-6">
          <h2 className="text-xl font-semibold text-foreground">
            {locale === 'zh' ? '准备好了吗？' : 'Ready to try it?'}
          </h2>
          <Button asChild className="mt-3">
            <Link href={canonicalPlayHref}>
              {locale === 'zh' ? '前往游戏页面' : 'Go to the game'}
            </Link>
          </Button>
        </section>
      ) : null}

      {content.faqs.length > 0 ? (
        <section className="mt-10 max-w-3xl border-t border-border pt-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {locale === 'zh' ? '常见问题' : 'Frequently asked questions'}
          </h2>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {content.faqs.map(faq => (
              <div key={faq.question} className="py-4">
                <dt className="font-medium text-foreground">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {content.recommendations.length > 0 ? (
        <section
          id="recommendations"
          className="mt-10 max-w-5xl border-t border-border pt-6"
        >
          <h2 className="text-2xl font-semibold text-foreground">
            {locale === 'zh' ? '相关游戏推荐' : 'Related games'}
          </h2>
          {(() => {
            const visibleRecommendations = content.recommendations
              .map(recommendation => ({
                recommendation,
                game: gameIndex.get(recommendation.slug),
              }))
              .filter(
                (item): item is typeof item & { game: NonNullable<typeof item.game> } =>
                  Boolean(
                    item.game && shouldPromoteGameInCollections(item.game)
                  )
              );

            if (visibleRecommendations.length === 0) {
              return (
                <p className="mt-3 text-sm text-muted-foreground">
                  {locale === 'zh'
                    ? '相关第三方游戏仍在来源与授权审核中，暂不作为可玩推荐展示。'
                    : 'Related third-party games are still under provenance and rights review, so they are not shown as playable recommendations yet.'}
                </p>
              );
            }

            return (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {visibleRecommendations.map(({ recommendation, game }) => (
                  <Link
                    key={recommendation.slug}
                    href={getLocalizedPath(locale, `/games/${game.slug}`)}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={LUMA_GUIDE_IMAGE}
                        alt={recommendation.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-[1.02]"
                      />
                    </div>
                    <h3 className="mt-2 font-semibold text-foreground transition group-hover:text-primary">
                      {recommendation.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {recommendation.description}
                    </p>
                  </Link>
                ))}
              </div>
            );
          })()}
        </section>
      ) : null}

      {content.externalLinks && content.externalLinks.length > 0 ? (
        <section className="mt-10 max-w-3xl border-t border-border pt-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {locale === 'zh' ? '延伸阅读' : 'Further reading'}
          </h2>
          <div className="mt-3 space-y-2">
            {content.externalLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3 transition hover:border-primary/50 hover:bg-accent"
              >
                <span>
                  <span className="block font-medium text-foreground">
                    {link.label}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {link.description}
                  </span>
                </span>
                <span aria-hidden className="text-primary">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {relatedPages.length > 0 ? (
        <section className="mt-10 max-w-3xl border-t border-border pt-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {locale === 'zh' ? '更多专题' : 'More guides'}
          </h2>
          <div className="mt-3 space-y-2">
            {relatedPages.map(related => (
              <Link
                key={related.slug}
                href={getLocalizedPath(locale, `/guides/${related.slug}`)}
                className="block rounded-md border border-border bg-card px-4 py-3 text-foreground transition hover:border-primary/50 hover:bg-accent"
              >
                {related.heading}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
