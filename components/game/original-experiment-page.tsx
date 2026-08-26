import Link from 'next/link';
import type { ReactNode } from 'react';

import type { Locale } from '@/i18n/config';
import type { OriginalExperimentPageDefinition } from '@/lib/games/luma-original-experiment-pages';
import { getLocalizedPath } from '@/i18n/config';
import { buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

interface OriginalExperimentPageProps {
  locale: Locale;
  page: OriginalExperimentPageDefinition & {
    copy: OriginalExperimentPageDefinition['locales'][Locale];
  };
  game: ReactNode;
  topLink: ReactNode;
}

export function OriginalExperimentPage({
  locale,
  page,
  game,
  topLink,
}: OriginalExperimentPageProps) {
  const content = page.copy;
  const localizedPath = getLocalizedPath(locale, page.path);
  const pageUrl = buildAbsoluteUrl(localizedPath);
  const localeTag = locale === 'zh' ? 'zh-CN' : 'en-US';
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': page.pageType === 'game_collection' ? 'CollectionPage' : 'VideoGame',
      name: content.title,
      url: pageUrl,
      description: content.metaDescription,
      inLanguage: localeTag,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser',
      gamePlatform: ['Desktop Browser', 'Mobile Browser'],
      playMode: 'SinglePlayer',
      isAccessibleForFree: true,
      author: {
        '@type': 'Organization',
        name: 'Luma Game Hub',
        url: buildAbsoluteUrl('/about'),
      },
    },
    {
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: content.home,
          item: buildAbsoluteUrl(getLocalizedPath(locale)),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.games,
          item: buildAbsoluteUrl(getLocalizedPath(locale, '/games')),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: content.title,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <article className="w-full bg-background">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-5">{topLink}</div>

        <nav
          aria-label={locale === 'zh' ? '面包屑导航' : 'Breadcrumb'}
          className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href={getLocalizedPath(locale)} className="hover:text-primary">
            {content.home}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={getLocalizedPath(locale, '/games')} className="hover:text-primary">
            {content.games}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{content.title}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
            {content.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            {content.intro}
          </p>
        </header>

        <section aria-label={content.title} className="mb-10">
          {game}
        </section>

        <aside className="border-y border-primary/25 bg-primary/5 px-4 py-5 text-sm leading-7 text-foreground sm:px-6">
          <strong className="font-semibold">{locale === 'zh' ? '来源与原创边界' : 'Source and originality note'}</strong>
          <p className="mt-2 text-muted-foreground">{content.originalNote}</p>
        </aside>

        <div className="mt-10 space-y-10">
          {content.sections.map((section) => (
            <section key={section.title} className="border-t border-border pt-7">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {section.title}
              </h2>
              <p className="mt-3 max-w-4xl text-base leading-8 text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}

          <section className="border-t border-border pt-7">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {content.faqTitle}
            </h2>
            <dl className="mt-5 divide-y divide-border border-y border-border">
              {content.faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <dt className="font-semibold text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-7 text-muted-foreground">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border-t border-border pt-7" aria-labelledby={`${page.slug}-related`}>
            <h2 id={`${page.slug}-related`} className="text-2xl font-bold tracking-tight text-foreground">
              {content.relatedTitle}
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {content.related.map((item) => (
                <Link
                  key={item.href}
                  href={getLocalizedPath(locale, item.href)}
                  className="border border-border p-5 transition hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="font-semibold text-foreground">{item.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
