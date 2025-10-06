import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchService } from '@/services';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  params: { locale: string };
  searchParams: { q?: string; page?: string };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const locale = params.locale;
  const t = await getTranslations('Search');

  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const pageParam = searchParams.page ? Number(searchParams.page) : undefined;

  const trimmedQuery = query.trim();
  const page = pageParam && Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const result = trimmedQuery
    ? await SearchService.searchGames({ query: trimmedQuery, page, limit: 12 })
    : { games: [], total: 0, page: 1, limit: 12, source: 'empty' as const };

  const totalPages = Math.max(1, Math.ceil(result.total / result.limit));
  const formatNumber = (value: number) => Number(value ?? 0).toLocaleString(locale);

  const buildPageHref = (targetPage: number) => {
    const paramsEntries: [string, string | undefined][] = [
      ['q', trimmedQuery || undefined],
      ['page', targetPage > 1 ? String(targetPage) : undefined],
    ];

    const queryString = paramsEntries
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&');

    return `/${locale}/search${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-10 space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
        <p className="text-sm text-gray-500">
          {trimmedQuery
            ? t('summary.withQuery', {
                query: trimmedQuery,
                total: formatNumber(result.total),
              })
            : t('summary.empty')}
        </p>
      </header>

      {!trimmedQuery ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          {t('emptyPrompt')}
        </div>
      ) : result.total === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          {t('emptyResult', { query: trimmedQuery })}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.games.map((game: any) => {
              const displayTitle = locale === 'en' ? game.titleEn ?? game.title : game.title;

              return (
                <Card key={game.id} className="flex h-full flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      <Link href={`/${locale}/games/${game.id}`} className="hover:text-indigo-600">
                        {displayTitle}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {t('published', {
                        date: game.publishedAt
                          ? new Date(game.publishedAt).toLocaleDateString(locale)
                          : '—',
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p>{t('playCount', { value: formatNumber(game.playCount ?? 0) })}</p>
                    <p>{t('rating', { value: Number(game.averageRating ?? 0).toFixed(2) })}</p>
                    <Link
                      href={`/${locale}/games/${game.id}`}
                      className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {t('viewDetails')}
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 ? (
            <nav className="mt-8 flex items-center justify-center gap-4 text-sm">
              {result.page > 1 ? (
                <Link
                  href={buildPageHref(result.page - 1)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  ← {t('pagination.prev')}
                </Link>
              ) : (
                <span className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-400">←</span>
              )}
              <span className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-600">
                {t('pagination.label', {
                  current: formatNumber(result.page),
                  total: formatNumber(totalPages),
                })}
              </span>
              {result.page < totalPages ? (
                <Link
                  href={buildPageHref(result.page + 1)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {t('pagination.next')} →
                </Link>
              ) : (
                <span className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-400">→</span>
              )}
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
