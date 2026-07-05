import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamePlayerFacade } from '@/components/game/game-player-facade';
import {
  getSeoLandingPage,
  getSeoLandingPages,
  type SeoLandingPage,
} from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import {
  DEFAULT_OPEN_GRAPH_IMAGES,
  DEFAULT_TWITTER_IMAGES,
  buildAbsoluteUrl,
  getSiteBaseUrl,
} from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 86400;

export function generateStaticParams() {
  const pages = getSeoLandingPages();
  return locales.flatMap((locale) =>
    pages.map((page) => ({
      locale,
      slug: page.slug,
    })),
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const page = getSeoLandingPage(params.slug);

  if (!page) {
    return {};
  }

  const locale = (params.locale as Locale) ?? 'zh';
  const content = page.locales[locale] ?? page.locales.zh;
  const basePath = getLocalizedPath(locale, `/guides/${page.slug}`);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical: basePath,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          getLocalizedPath(loc, `/guides/${page.slug}`),
        ]),
      ),
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: basePath,
      type: 'article',
      publishedTime: page.updatedAt,
      tags: page.keywords,
      images: DEFAULT_OPEN_GRAPH_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

interface GuidePageProps {
  params: { locale: string; slug: string };
}

const gameIndex = new Map(mockGames.map((game) => [game.slug, game]));

function getRelatedPages(current: SeoLandingPage, locale: Locale) {
  return current.relatedSlugs
    .map((slug) => getSeoLandingPage(slug))
    .filter((page): page is SeoLandingPage => Boolean(page))
    .map((page) => ({
      slug: page.slug,
      heading: page.locales[locale]?.heading ?? page.locales.zh.heading,
    }));
}

export default function GuidePage({ params }: GuidePageProps) {
  const locale = (params.locale as Locale) ?? 'zh';
  const page = getSeoLandingPage(params.slug);

  if (!page) {
    notFound();
  }

  const siteBaseUrl = getSiteBaseUrl();
  const content = page.locales[locale] ?? page.locales.zh;
  const pageUrl = buildAbsoluteUrl(getLocalizedPath(locale, `/guides/${page.slug}`));
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
  };
  const jsonLdFaq = {
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
  const breadcrumbLabels = locale === 'zh'
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
  const firstSection = content.sections[0];
  const quickAnswerBody = firstSection?.body ?? content.overview[0];
  const quickAnswerBullets = firstSection?.bullets?.slice(0, 3) ?? [];

  return (
    <article className="mx-auto w-full max-w-5xl px-6 py-12">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href={getLocalizedPath(locale, '/guides')} className="hover:text-primary">
          {locale === 'zh' ? '← 返回专题合集' : '← Back to guides'}
        </Link>
      </nav>

      <header className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {page.primaryKeyword}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">{content.heading}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{content.subheading}</p>
      </header>

      <section className="mx-auto mb-10 max-w-4xl rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {locale === 'zh' ? '快速答案' : 'Quick answer'}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          {firstSection?.title ?? (locale === 'zh' ? '先看核心结论' : 'Start with the core idea')}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90">{quickAnswerBody}</p>
        {quickAnswerBullets.length > 0 ? (
          <ul className="mt-4 grid gap-2 text-sm text-foreground/80 md:grid-cols-3">
            {quickAnswerBullets.map((item) => (
              <li key={item} className="rounded-xl border border-border bg-background/80 p-3">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-medium">
          <a
            href="#guide-details"
            className="rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            {locale === 'zh' ? '继续看指南' : 'Read the guide'}
          </a>
          {page.embedGame ? (
            <a
              href="#play"
              className="rounded-full border border-primary/30 bg-background px-4 py-2 text-primary transition hover:bg-primary/10"
            >
              {locale === 'zh' ? '先试玩游戏' : 'Play first'}
            </a>
          ) : null}
          <a
            href="#recommendations"
            className="rounded-full border border-border bg-background px-4 py-2 text-foreground transition hover:bg-secondary"
          >
            {locale === 'zh' ? '看相似游戏' : 'See similar games'}
          </a>
        </div>
      </section>

      {page.embedGame ? (
        <section id="play" className="mx-auto mb-12 max-w-4xl scroll-mt-24">
          <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
            <div className="aspect-video">
              <GamePlayerFacade
                iframeUrl={page.embedGame.iframeUrl}
                title={page.embedGame.title}
                thumbnailUrl={embedGameThumbnail ?? null}
                locale={locale}
                gameSlug={page.embedGame.playSlug ?? page.slug}
                source="guide_embed"
              />
            </div>
          </div>
          {page.embedGame.playSlug ? (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              <Link
                href={getLocalizedPath(locale, `/games/${page.embedGame.playSlug}`)}
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

      <section className="mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-foreground/90">
        {content.overview.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      <section id="guide-details" className="mt-12 space-y-10 scroll-mt-24">
        {content.sections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
            <p className="mt-3 text-base text-foreground/90">{section.body}</p>
            {section.bullets ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {section.bullets.map((item, bulletIndex) => (
                  <li key={bulletIndex}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      <section id="recommendations" className="mt-16 scroll-mt-24">
        <header className="mb-6 text-center">
          <h2 className="text-3xl font-semibold text-foreground">
            {locale === 'zh' ? '精选推荐' : 'Featured Picks'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {locale === 'zh'
              ? '以下游戏可从详情页直接打开浏览器播放器，无需下载安装。'
              : 'Each recommendation opens a browser player from its detail page with no download required.'}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {content.recommendations.map((item) => {
            const game = gameIndex.get(item.slug);
            const gameTitle =
              locale === 'zh'
                ? game?.title ?? item.slug
                : game?.titleEn ?? game?.title ?? item.slug;
            const gameDescription =
              locale === 'zh'
                ? game?.description ?? ''
                : game?.descriptionEn ?? game?.description ?? '';

            return (
              <Card key={item.slug} className="flex h-full flex-col justify-between border border-border">
                {game?.thumbnailUrl?.startsWith('/game-screenshots/') ? (
                  <div className="relative aspect-video overflow-hidden border-b border-border bg-muted">
                    <Image
                      src={game.thumbnailUrl}
                      alt={`${gameTitle} gameplay screenshot`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {gameTitle}
                  </CardTitle>
                  {gameDescription ? (
                    <CardDescription className="text-sm text-muted-foreground">
                      {gameDescription}
                    </CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4 text-sm text-foreground/90">
                  <p>{item.pitch}</p>
                  <div className="mt-auto">
                    <Link
                      href={getLocalizedPath(locale, `/games/${item.slug}`)}
                      className="inline-flex items-center text-primary transition hover:text-primary/80"
                    >
                      {locale === 'zh'
                        ? `查看 ${gameTitle} 游戏详情`
                        : `See ${gameTitle} browser game details`}
                      {' '}
                      →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-secondary p-8">
        <h2 className="text-2xl font-semibold text-foreground">
          {locale === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <dl className="mt-6 space-y-6">
          {content.faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <dt className="text-base font-semibold text-foreground">{faq.question}</dt>
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
        <p className="mt-3 text-sm text-muted-foreground">{content.ctaDescription}</p>
      </section>

      {relatedPages.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            {locale === 'zh' ? '相关主题' : 'Related Guides'}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {relatedPages.map((related) => (
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
    </article>
  );
}
