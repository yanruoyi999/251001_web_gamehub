import Link from 'next/link';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FavoriteToggleButton } from '@/components/game/favorite-toggle';
import { CategoryService, FavoriteService, GameService, TagService } from '@/services';

export const dynamic = 'force-dynamic';

interface GamesPageProps {
  params: { locale: string };
  searchParams: {
    page?: string;
    categoryId?: string;
    tagId?: string;
    search?: string;
    isNew?: string;
    isHot?: string;
    featured?: string;
    sortBy?: string;
    sortOrder?: string;
    favoritesOnly?: string;
  };
}

export default async function GamesPage({ params, searchParams }: GamesPageProps) {
  const locale = params.locale;
  const t = await getTranslations('Games');

  const parseId = (value?: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  };

  const page = searchParams.page ? Number(searchParams.page) : undefined;
  const categoryId = parseId(searchParams.categoryId);
  const tagId = parseId(searchParams.tagId);
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const showNew = searchParams.isNew === '1';
  const showHot = searchParams.isHot === '1';
  const showFeatured = searchParams.featured === '1';
  const favoritesOnly = searchParams.favoritesOnly === '1';

  const SORT_OPTIONS = ['publishedAt', 'playCount', 'averageRating', 'title'] as const;
  type SortOption = (typeof SORT_OPTIONS)[number];

  const sortByParam = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : undefined;
  const sortBy = SORT_OPTIONS.find((option) => option === sortByParam);

  const sortOrder = searchParams.sortOrder === 'asc'
    ? 'asc'
    : searchParams.sortOrder === 'desc'
      ? 'desc'
      : sortBy === 'title'
        ? 'asc'
        : 'desc';

  const headersList = headers();
  const favoriteContext = FavoriteService.getContextFromHeaders(headersList);
  const favoriteIds = await FavoriteService.listFavoriteIds(favoriteContext);

  const [categoryOptions, tagOptions, list] = await Promise.all([
    CategoryService.listAll(),
    TagService.listAll(),
    GameService.listGames({
      page,
      status: 'active',
      categoryId,
      tagId,
      limit: 12,
      search: search.trim() ? search : undefined,
      isNew: showNew ? true : undefined,
      isHot: showHot ? true : undefined,
      featured: showFeatured ? true : undefined,
      onlyFavorites: favoritesOnly,
      favoriteGameIds: favoriteIds,
      sortBy,
      sortOrder,
    }),
  ]);

  const { games, total, totalPages, page: currentPage } = list;

  const baseParams = new URLSearchParams();
  if (search.trim()) baseParams.set('search', search.trim());
  if (categoryId) baseParams.set('categoryId', String(categoryId));
  if (tagId) baseParams.set('tagId', String(tagId));
  if (showNew) baseParams.set('isNew', '1');
  if (showHot) baseParams.set('isHot', '1');
  if (showFeatured) baseParams.set('featured', '1');
  if (favoritesOnly) baseParams.set('favoritesOnly', '1');
  if (sortBy) baseParams.set('sortBy', sortBy);
  if (sortOrder) baseParams.set('sortOrder', sortOrder);

  const buildQuery = (overrides: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(baseParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  const prevPageHref = currentPage > 1 ? `/${locale}/games${buildQuery({ page: String(currentPage - 1) })}` : null;
  const nextPageHref = currentPage < totalPages ? `/${locale}/games${buildQuery({ page: String(currentPage + 1) })}` : null;

  const formatNumber = (value: number) => Number(value ?? 0).toLocaleString(locale);

  const resolveLabel = (name: string | null | undefined, nameEn?: string | null) => {
    if (locale === 'en') {
      return nameEn?.trim() || name?.trim() || '';
    }
    return name?.trim() || nameEn?.trim() || '';
  };

  const favoriteLabels = {
    favorite: t('actions.favorite'),
    unfavorite: t('actions.unfavorite'),
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('desc')}</p>
        </div>
        <Link
          href={`/${locale}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {t('backToHome')}
        </Link>
      </header>

      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">{t('filters.title')}</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {t('resultSummary', { value: formatNumber(total) })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" method="get">
            <div className="md:col-span-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                <span>{t('filters.searchPlaceholder')}</span>
                <input
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder={t('filters.searchPlaceholder')}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>

            <div>
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                <span>{t('filters.categoryLabel')}</span>
                <select
                  name="categoryId"
                  defaultValue={categoryId ? String(categoryId) : ''}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">{t('filters.categoryAll')}</option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {resolveLabel(category.name, category.nameEn)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                <span>{t('filters.tagLabel')}</span>
                <select
                  name="tagId"
                  defaultValue={tagId ? String(tagId) : ''}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">{t('filters.tagAll')}</option>
                  {tagOptions.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {resolveLabel(tag.name, tag.nameEn)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                <span>{t('filters.sortLabel')}</span>
                <div className="flex gap-2">
                  <select
                    name="sortBy"
                    defaultValue={sortBy ?? 'publishedAt'}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {SORT_OPTIONS.map((option) => {
                      const optionKey = `filters.sort.${option}` as const;
                      return (
                        <option key={option} value={option}>
                          {t(optionKey)}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    name="sortOrder"
                    defaultValue={sortOrder}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="desc">{t('filters.sortOrderDesc')}</option>
                    <option value="asc">{t('filters.sortOrderAsc')}</option>
                  </select>
                </div>
              </label>
            </div>

            <div className="flex flex-wrap gap-4 md:col-span-2 lg:col-span-3">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="isNew"
                  value="1"
                  defaultChecked={showNew}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {t('filters.onlyNew')}
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="isHot"
                  value="1"
                  defaultChecked={showHot}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {t('filters.onlyHot')}
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="featured"
                  value="1"
                  defaultChecked={showFeatured}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {t('filters.onlyFeatured')}
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="favoritesOnly"
                  value="1"
                  defaultChecked={favoritesOnly}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {t('filters.onlyFavorites')}
              </label>
            </div>

            <div className="flex gap-3 md:col-span-2 lg:col-span-3">
              <Button type="submit" className="md:w-auto">
                {t('filters.submit')}
              </Button>
              <Link
                href={`/${locale}/games`}
                className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                {t('filters.reset')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {games.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          {t('empty')}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => {
            const displayTitle = locale === 'en' ? game.titleEn ?? game.title : game.title;
            const statusLabel = t(`status.${game.status ?? 'active'}`);
            const publishedLabel = t('published', {
              value: new Date(game.publishedAt).toLocaleDateString(locale),
            });

            return (
              <Card key={game.id} className="flex h-full flex-col justify-between">
                <CardHeader>
                  {(game.featured || game.isHot || game.isNew) && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {game.featured ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                          {t('badges.featured')}
                        </span>
                      ) : null}
                      {game.isHot ? (
                        <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                          {t('badges.hot')}
                        </span>
                      ) : null}
                      {game.isNew ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          {t('badges.new')}
                        </span>
                      ) : null}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      <Link href={`/${locale}/games/${game.slug}`} className="hover:text-indigo-600">
                        {displayTitle}
                      </Link>
                    </CardTitle>
                    <div className="flex-shrink-0">
                      <FavoriteToggleButton
                        gameId={game.id}
                        initialFavorite={game.isFavorite}
                        labels={favoriteLabels}
                      />
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-500">
                    {publishedLabel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p>{statusLabel}</p>
                  <p>{t('playCount', { value: Number(game.playCount ?? 0).toLocaleString(locale) })}</p>
                  <p>{t('rating', { value: Number(game.averageRating ?? 0).toFixed(2) })}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="mt-8 flex items-center justify-center gap-4 text-sm">
          {prevPageHref ? (
            <Link
              href={prevPageHref}
              className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ← {t('pagination.prev')}
            </Link>
          ) : (
            <span className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-400">
              ←
            </span>
          )}
          <span className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-600">
            {t('pagination.pageLabel', {
              current: formatNumber(currentPage),
              total: formatNumber(totalPages),
            })}
          </span>
          {nextPageHref ? (
            <Link
              href={nextPageHref}
              className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {t('pagination.next')} →
            </Link>
          ) : (
            <span className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-400">
              →
            </span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
