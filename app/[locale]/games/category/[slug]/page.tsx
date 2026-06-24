import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { locales, type Locale } from '@/i18n/config';
import {
  getCategoryEntries,
  getCategoryEntry,
  getTagEntries,
  pickLocalizedLabel,
} from '@/lib/game-taxonomy';
import { buildAbsoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

interface CategoryPageProps {
  params: { locale: string; slug: string };
}

export function generateStaticParams() {
  const categories = getCategoryEntries();
  return locales.flatMap((locale) =>
    categories.map((entry) => ({
      locale,
      slug: entry.item.slug,
    })),
  );
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const locale = (params.locale as Locale) ?? 'zh';
  const entry = getCategoryEntry(params.slug);

  if (!entry) {
    return {};
  }

  const label = pickLocalizedLabel(locale, entry.item.name, entry.item.nameEn);
  const title =
    locale === 'zh'
      ? `${label}小游戏 - 免费在线浏览器游戏`
      : `${label} Browser Games - Free Online Games`;
  const description =
    locale === 'zh'
      ? `在 Luma Game Hub 浏览 ${entry.games.length} 款${label}小游戏，全部支持浏览器即开即玩，无需下载。`
      : `Browse ${entry.games.length} curated ${label.toLowerCase()} browser games on Luma Game Hub. Play instantly without downloads.`;
  const canonical = `/${locale}/games/category/${entry.item.slug}`;

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? [`${label}小游戏`, '免费在线游戏', '浏览器游戏', '无需下载小游戏']
        : [`${label} games`, 'free online games', 'browser games', 'no download games'],
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          `/${loc}/games/category/${entry.item.slug}`,
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const locale = (params.locale as Locale) ?? 'zh';
  const entry = getCategoryEntry(params.slug);

  if (!entry) {
    notFound();
  }

  const label = pickLocalizedLabel(locale, entry.item.name, entry.item.nameEn);
  const description = pickLocalizedLabel(locale, entry.item.description, entry.item.descriptionEn);
  const pageUrl = buildAbsoluteUrl(`/${locale}/games/category/${entry.item.slug}`);
  const relatedTags = getTagEntries()
    .filter((tagEntry) =>
      tagEntry.games.some((game) => game.categories.some((category) => category.slug === entry.item.slug)),
    )
    .slice(0, 8);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'zh'
        ? `${label}小游戏`
        : `${label} Browser Games`,
    url: pageUrl,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    description:
      description ||
      (locale === 'zh'
        ? `Luma Game Hub ${label}小游戏合集`
        : `Luma Game Hub collection of ${label} browser games`),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: entry.games.length,
      itemListElement: entry.games.slice(0, 24).map((game, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: buildAbsoluteUrl(`/${locale}/games/${game.slug}`),
        name: pickLocalizedLabel(locale, game.title, game.titleEn),
      })),
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-gray-500">
        <Link href={`/${locale}/games`} className="hover:text-indigo-600">
          {locale === 'zh' ? '返回全部游戏' : 'Back to all games'}
        </Link>
      </nav>

      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          {locale === 'zh' ? '游戏分类' : 'Game Category'}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">
          {locale === 'zh' ? `${label}小游戏` : `${label} Browser Games`}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          {description ||
            (locale === 'zh'
              ? `精选 ${entry.games.length} 款${label}游戏，全部支持浏览器直接打开。`
              : `${entry.games.length} curated ${label.toLowerCase()} games you can launch directly in the browser.`)}
        </p>
      </header>

      {relatedTags.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            {locale === 'zh' ? '相关玩法标签' : 'Related Play Tags'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map((tagEntry) => (
              <Link
                key={tagEntry.item.slug}
                href={`/${locale}/games/tag/${tagEntry.item.slug}`}
                className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-50"
              >
                {pickLocalizedLabel(locale, tagEntry.item.name, tagEntry.item.nameEn)}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entry.games.map((game) => {
          const title = pickLocalizedLabel(locale, game.title, game.titleEn);
          const summary = pickLocalizedLabel(locale, game.description, game.descriptionEn);

          return (
            <Card key={game.slug} className="flex h-full flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  <Link href={`/${locale}/games/${game.slug}`} className="hover:text-indigo-600">
                    {title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4 text-sm text-gray-600">
                <div className="flex flex-wrap gap-2">
                  {game.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/${locale}/games/tag/${tag.slug}`}
                      className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {pickLocalizedLabel(locale, tag.name, tag.nameEn)}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/${locale}/games/${game.slug}`}
                  className="mt-auto inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {locale === 'zh' ? '打开游戏详情' : 'Open game details'} →
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

