import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  getCategoryEntries,
  getTagEntries,
  getTagEntry,
  pickLocalizedLabel,
} from '@/lib/game-taxonomy';
import { DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES, buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

interface TagPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const tags = getTagEntries();
  return locales.flatMap((locale) =>
    tags.map((entry) => ({
      locale,
      slug: entry.item.slug,
    })),
  );
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam as Locale) ?? 'zh';
  const entry = getTagEntry(slug);

  if (!entry) {
    return {};
  }

  const label = pickLocalizedLabel(locale, entry.item.name, entry.item.nameEn);
  const title =
    locale === 'zh'
      ? `${label}小游戏合集 - Luma Game Hub`
      : `${label} Games Collection - Luma Game Hub`;
  const description =
    locale === 'zh'
      ? `发现 ${entry.games.length} 款适合${label}的免费浏览器小游戏，直接在线游玩。`
      : `Discover ${entry.games.length} free browser games tagged ${label}. Play instantly online.`;
  const canonical = getLocalizedPath(locale, `/games/tag/${entry.item.slug}`);

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? [`${label}小游戏`, '小游戏合集', '免费网页游戏', '即开即玩游戏']
        : [`${label} games`, 'free browser games', 'online game collection', 'instant play games'],
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          getLocalizedPath(loc, `/games/tag/${entry.item.slug}`),
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: DEFAULT_OPEN_GRAPH_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam as Locale) ?? 'zh';
  const entry = getTagEntry(slug);

  if (!entry) {
    notFound();
  }

  const label = pickLocalizedLabel(locale, entry.item.name, entry.item.nameEn);
  const pageUrl = buildAbsoluteUrl(getLocalizedPath(locale, `/games/tag/${entry.item.slug}`));
  const relatedCategories = getCategoryEntries()
    .filter((categoryEntry) =>
      categoryEntry.games.some((game) => game.tags.some((tag) => tag.slug === entry.item.slug)),
    )
    .slice(0, 8);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'zh'
        ? `${label}小游戏合集`
        : `${label} Games Collection`,
    url: pageUrl,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    description:
      locale === 'zh'
        ? `Luma Game Hub ${label}小游戏合集`
        : `Luma Game Hub collection of games tagged ${label}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: entry.games.length,
      itemListElement: entry.games.slice(0, 24).map((game, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: buildAbsoluteUrl(getLocalizedPath(locale, `/games/${game.slug}`)),
        name: pickLocalizedLabel(locale, game.title, game.titleEn),
      })),
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-gray-500">
        <Link href={getLocalizedPath(locale, '/games')} className="hover:text-indigo-600">
          {locale === 'zh' ? '返回全部游戏' : 'Back to all games'}
        </Link>
      </nav>

      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          {locale === 'zh' ? '玩法标签' : 'Play Tag'}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">
          {locale === 'zh' ? `${label}小游戏合集` : `${label} Games Collection`}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          {locale === 'zh'
            ? `这里收录 ${entry.games.length} 款带有“${label}”标签的免费浏览器游戏，适合按玩法继续探索。`
            : `Explore ${entry.games.length} free browser games tagged “${label}” and move between related categories.`}
        </p>
      </header>

      {relatedCategories.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            {locale === 'zh' ? '相关分类' : 'Related Categories'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedCategories.map((categoryEntry) => (
              <Link
                key={categoryEntry.item.slug}
                href={getLocalizedPath(locale, `/games/category/${categoryEntry.item.slug}`)}
                className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-50"
              >
                {pickLocalizedLabel(locale, categoryEntry.item.name, categoryEntry.item.nameEn)}
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
                  <Link href={getLocalizedPath(locale, `/games/${game.slug}`)} className="hover:text-indigo-600">
                    {title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4 text-sm text-gray-600">
                <div className="flex flex-wrap gap-2">
                  {game.categories.slice(0, 3).map((category) => (
                    <Link
                      key={category.slug}
                      href={getLocalizedPath(locale, `/games/category/${category.slug}`)}
                      className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {pickLocalizedLabel(locale, category.name, category.nameEn)}
                    </Link>
                  ))}
                </div>
                <Link
                  href={getLocalizedPath(locale, `/games/${game.slug}`)}
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
