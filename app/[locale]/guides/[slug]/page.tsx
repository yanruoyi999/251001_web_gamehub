import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getSeoLandingPage,
  getSeoLandingPages,
  type SeoLandingPage,
} from '@/lib/seo-landing-content';
import { mockGames } from '@/lib/mock-games';
import { buildAbsoluteUrl, getSiteBaseUrl } from '@/lib/seo';

export const dynamic = 'force-static';

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
  const basePath = `/${locale}/guides/${page.slug}`;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical: basePath,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          `/${loc}/guides/${page.slug}`,
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
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
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
  const pageUrl = buildAbsoluteUrl(`/${locale}/guides/${page.slug}`);
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.heading,
    description: content.metaDescription,
    mainEntityOfPage: pageUrl,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    author: {
      '@type': 'Organization',
      name: 'GameHub Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GameHub',
      url: siteBaseUrl,
      logo: {
        '@type': 'ImageObject',
        url: 'https://via.placeholder.com/512x512.png?text=GameHub',
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
        item: buildAbsoluteUrl(`/${locale}`),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbLabels[1],
        item: buildAbsoluteUrl(`/${locale}/guides`),
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

  return (
    <article className="mx-auto w-full max-w-5xl px-6 py-12">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href={`/${locale}/guides`} className="hover:text-indigo-600">
          {locale === 'zh' ? '← 返回专题合集' : '← Back to guides'}
        </Link>
      </nav>

      <header className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          {page.primaryKeyword}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">{content.heading}</h1>
        <p className="mt-4 text-lg text-gray-600">{content.subheading}</p>
      </header>

      <section className="mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-gray-700">
        {content.overview.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      <section className="mt-12 space-y-10">
        {content.sections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
            <p className="mt-3 text-base text-gray-700">{section.body}</p>
            {section.bullets ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
                {section.bullets.map((item, bulletIndex) => (
                  <li key={bulletIndex}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      <section className="mt-16">
        <header className="mb-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            {locale === 'zh' ? '精选推荐' : 'Featured Picks'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {locale === 'zh'
              ? '以下游戏均支持即开即玩，并保持无广告、无安装的体验。'
              : 'Each recommendation loads instantly in your browser and stays free of intrusive ads.'}
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
              <Card key={item.slug} className="flex h-full flex-col justify-between border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {gameTitle}
                  </CardTitle>
                  {gameDescription ? (
                    <CardDescription className="text-sm text-gray-600">
                      {gameDescription}
                    </CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4 text-sm text-gray-700">
                  <p>{item.pitch}</p>
                  <div className="mt-auto">
                    <Link
                      href={`/${locale}/games/${item.slug}`}
                      className="inline-flex items-center text-indigo-600 transition hover:text-indigo-800"
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

      <section className="mt-16 rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          {locale === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <dl className="mt-6 space-y-6">
          {content.faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-indigo-100 bg-white/70 p-5 shadow-sm">
              <dt className="text-base font-semibold text-gray-900">{faq.question}</dt>
              <dd className="mt-2 text-sm text-gray-700">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 text-center">
        <Button
          asChild
          size="lg"
          className="bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700"
        >
          <Link href={`/${locale}/games`}>
            {content.ctaLabel}
          </Link>
        </Button>
        <p className="mt-3 text-sm text-gray-600">{content.ctaDescription}</p>
      </section>

      {relatedPages.length > 0 ? (
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            {locale === 'zh' ? '相关主题' : 'Related Guides'}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {relatedPages.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/${locale}/guides/${related.slug}`}
                  className="inline-flex items-center text-indigo-600 transition hover:text-indigo-800"
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
