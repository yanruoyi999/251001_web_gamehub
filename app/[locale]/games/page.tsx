import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FavoriteToggleButton } from '@/components/game/favorite-toggle';
import { CategoryService, FavoriteService, GameService, TagService } from '@/services';
import { getLocalizedPath, locales } from '@/i18n/config';
import { mockGames } from '@/lib/mock-games';
import { DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const DB_LOAD_TIMEOUT_MS = 1500;
const FAVORITE_LOAD_TIMEOUT_MS = 800;
const SORT_OPTIONS = ['publishedAt', 'playCount', 'averageRating', 'title'] as const;

type SortOption = (typeof SORT_OPTIONS)[number];
type CategoryOption = Awaited<ReturnType<typeof CategoryService.listAll>>[number];
type TagOption = Awaited<ReturnType<typeof TagService.listAll>>[number];
type GameList = Awaited<ReturnType<typeof GameService.listGames>>;

function canUseNextImage(src?: string | null) {
  return Boolean(
    src &&
      (src.startsWith('/') ||
        src.startsWith('https://res.cloudinary.com')),
  );
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function uniqueMockCategories(): CategoryOption[] {
  const byId = new Map<number, CategoryOption>();

  for (const game of mockGames) {
    for (const category of game.categories) {
      byId.set(category.id, {
        id: category.id,
        name: category.name,
        nameEn: category.nameEn,
        slug: category.slug,
      });
    }
  }

  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function uniqueMockTags(): TagOption[] {
  const byId = new Map<number, TagOption>();

  for (const game of mockGames) {
    for (const tag of game.tags) {
      byId.set(tag.id, {
        id: tag.id,
        name: tag.name,
        nameEn: tag.nameEn,
        slug: tag.slug,
      });
    }
  }

  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function mockPublishedAt(gameId: number) {
  return new Date(Date.UTC(2026, 0, 1) - gameId * 24 * 60 * 60 * 1000);
}

function mockPlayCount(gameId: number, isHot: boolean) {
  return 1000 + gameId * 37 + (isHot ? 5000 : 0);
}

function mockAverageRating(gameId: number) {
  return (4.05 + (gameId % 8) * 0.08).toFixed(2);
}

function buildFallbackGameList(options: {
  page?: number;
  limit: number;
  categoryId?: number;
  tagId?: number;
  search?: string;
  showNew: boolean;
  showHot: boolean;
  showFeatured: boolean;
  favoritesOnly: boolean;
  favoriteIds: number[];
  sortBy?: SortOption;
  sortOrder: 'asc' | 'desc';
}): { categoryOptions: CategoryOption[]; tagOptions: TagOption[]; list: GameList } {
  const favoriteSet = new Set(options.favoriteIds);
  const keyword = options.search?.trim().toLowerCase();

  const rows = mockGames
    .filter((game) => {
      if (options.categoryId && !game.categories.some((category) => category.id === options.categoryId)) return false;
      if (options.tagId && !game.tags.some((tag) => tag.id === options.tagId)) return false;
      if (options.showNew && !game.isNew) return false;
      if (options.showHot && !game.isHot) return false;
      if (options.showFeatured && !game.featured) return false;
      if (options.favoritesOnly && !favoriteSet.has(game.id)) return false;

      if (keyword) {
        const haystack = [
          game.title,
          game.titleEn,
          game.description,
          game.descriptionEn,
          ...game.categories.map((category) => `${category.name} ${category.nameEn}`),
          ...game.tags.map((tag) => `${tag.name} ${tag.nameEn}`),
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(keyword)) return false;
      }

      return true;
    })
    .map((game) => ({
      id: game.id,
      title: game.title,
      titleEn: game.titleEn,
      slug: game.slug,
      status: 'active' as const,
      thumbnailUrl: game.thumbnailUrl,
      featured: game.featured,
      isNew: game.isNew,
      isHot: game.isHot,
      publishedAt: mockPublishedAt(game.id),
      playCount: mockPlayCount(game.id, game.isHot),
      averageRating: mockAverageRating(game.id),
      isFavorite: favoriteSet.has(game.id),
    }));

  const sortBy = options.sortBy ?? 'publishedAt';
  const direction = options.sortOrder === 'asc' ? 1 : -1;
  rows.sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title) * direction;
    if (sortBy === 'playCount') return (Number(a.playCount) - Number(b.playCount)) * direction;
    if (sortBy === 'averageRating') return (Number(a.averageRating) - Number(b.averageRating)) * direction;
    return (a.publishedAt.getTime() - b.publishedAt.getTime()) * direction;
  });

  const requestedPage = Number.isInteger(options.page) && options.page && options.page > 0 ? options.page : 1;
  const total = rows.length;
  const totalPages = Math.ceil(total / options.limit);
  const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;
  const offset = (currentPage - 1) * options.limit;

  return {
    categoryOptions: uniqueMockCategories(),
    tagOptions: uniqueMockTags(),
    list: {
      games: rows.slice(offset, offset + options.limit),
      total,
      page: currentPage,
      limit: options.limit,
      totalPages,
    },
  };
}

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

export function generateMetadata({ params }: GamesPageProps): Metadata {
  const locale = params.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';
  const canonical = getLocalizedPath(locale, '/games');

  return {
    title: isZh ? '免费在线小游戏大全' : 'Free Browser Games',
    description: isZh
      ? '浏览 Luma Game Hub 的免费浏览器小游戏，按分类、标签和热门程度筛选，无需下载即可开始。'
      : 'Browse free browser games on Luma Game Hub by category, tag, and popularity. Start playing without a download.',
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          locales.map((loc) => [
            loc === 'zh' ? 'zh-CN' : 'en-US',
            getLocalizedPath(loc, '/games'),
          ]),
        ),
        'x-default': '/en/games',
      },
    },
    openGraph: {
      title: isZh ? '免费在线小游戏大全' : 'Free Browser Games',
      description: isZh
        ? '按分类、标签和热门程度浏览可直接打开的浏览器小游戏。'
        : 'Browse browser games by category, tag, and popularity.',
      url: canonical,
      type: 'website',
      images: DEFAULT_OPEN_GRAPH_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh ? '免费在线小游戏大全' : 'Free Browser Games',
      description: isZh
        ? '按分类、标签和热门程度浏览可直接打开的浏览器小游戏。'
        : 'Browse browser games by category, tag, and popularity.',
      images: DEFAULT_TWITTER_IMAGES,
    },
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
  let favoriteIds: number[] = [];
  try {
    favoriteIds = await withTimeout(
      FavoriteService.listFavoriteIds(favoriteContext),
      FAVORITE_LOAD_TIMEOUT_MS,
      'Favorite ids database load',
    );
  } catch (error) {
    console.warn('Failed to load favorite ids, using empty list:', error);
    favoriteIds = [];
  }

  let categoryOptions: CategoryOption[];
  let tagOptions: TagOption[];
  let list: GameList;

  try {
    [categoryOptions, tagOptions, list] = await withTimeout(Promise.all([
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
    ]), DB_LOAD_TIMEOUT_MS, 'Games list database load');
  } catch (error) {
    console.warn('Failed to load games from database, using local fallback:', error);
    const fallback = buildFallbackGameList({
      page,
      categoryId,
      tagId,
      limit: 12,
      search: search.trim() ? search : undefined,
      showNew,
      showHot,
      showFeatured,
      favoritesOnly,
      favoriteIds,
      sortBy,
      sortOrder,
    });
    categoryOptions = fallback.categoryOptions;
    tagOptions = fallback.tagOptions;
    list = fallback.list;
  }

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

  const gamesPath = getLocalizedPath(locale, '/games');
  const prevPageHref = currentPage > 1 ? `${gamesPath}${buildQuery({ page: String(currentPage - 1) })}` : null;
  const nextPageHref = currentPage < totalPages ? `${gamesPath}${buildQuery({ page: String(currentPage + 1) })}` : null;

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
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">{t('desc')}</p>
        </div>
        <Link
          href={getLocalizedPath(locale)}
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          {t('backToHome')}
        </Link>
      </header>

      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">{t('filters.title')}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {t('resultSummary', { value: formatNumber(total) })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" method="get">
            <div className="md:col-span-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                <span>{t('filters.searchPlaceholder')}</span>
                <input
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder={t('filters.searchPlaceholder')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            <div>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                <span>{t('filters.categoryLabel')}</span>
                <select
                  name="categoryId"
                  defaultValue={categoryId ? String(categoryId) : ''}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
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
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                <span>{t('filters.tagLabel')}</span>
                <select
                  name="tagId"
                  defaultValue={tagId ? String(tagId) : ''}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
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
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                <span>{t('filters.sortLabel')}</span>
                <div className="flex gap-2">
                  <select
                    name="sortBy"
                    defaultValue={sortBy ?? 'publishedAt'}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="desc">{t('filters.sortOrderDesc')}</option>
                    <option value="asc">{t('filters.sortOrderAsc')}</option>
                  </select>
                </div>
              </label>
            </div>

            <div className="flex flex-wrap gap-4 md:col-span-2 lg:col-span-3">
              <label className="inline-flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  name="isNew"
                  value="1"
                  defaultChecked={showNew}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                />
                {t('filters.onlyNew')}
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  name="isHot"
                  value="1"
                  defaultChecked={showHot}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                />
                {t('filters.onlyHot')}
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  name="featured"
                  value="1"
                  defaultChecked={showFeatured}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                />
                {t('filters.onlyFeatured')}
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  name="favoritesOnly"
                  value="1"
                  defaultChecked={favoritesOnly}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                />
                {t('filters.onlyFavorites')}
              </label>
            </div>

            <div className="flex gap-3 md:col-span-2 lg:col-span-3">
              <Button type="submit" className="md:w-auto">
                {t('filters.submit')}
              </Button>
              <Link
                href={gamesPath}
                className="inline-flex items-center rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent"
              >
                {t('filters.reset')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {games.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center text-muted-foreground">
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
            const thumbnailUrl = game.thumbnailUrl;

            return (
              <Card key={game.id} className="flex h-full flex-col justify-between overflow-hidden">
                <Link
                  href={getLocalizedPath(locale, `/games/${game.slug}`)}
                  className="relative block aspect-[4/3] overflow-hidden bg-slate-900"
                  aria-label={displayTitle}
                >
                  {thumbnailUrl ? (
                    canUseNextImage(thumbnailUrl) ? (
                      <Image
                        src={thumbnailUrl}
                        alt={displayTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnailUrl}
                        alt={displayTitle}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 px-4 text-center text-lg font-semibold text-primary">
                      {displayTitle}
                    </div>
                  )}
                </Link>
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
                    <CardTitle className="text-lg font-semibold text-foreground">
                      <Link href={getLocalizedPath(locale, `/games/${game.slug}`)} className="hover:text-primary">
                        {displayTitle}
                      </Link>
                    </CardTitle>
                    <div className="flex-shrink-0">
                      <FavoriteToggleButton
                        gameId={game.id}
                        initialFavorite={Boolean(game.isFavorite)}
                        labels={favoriteLabels}
                        fallbackKey={game.slug ? `slug:${game.slug.toLowerCase()}` : `id:${game.id}`}
                      />
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {publishedLabel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
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
              className="rounded-md border border-input px-3 py-1.5 font-medium text-foreground transition hover:bg-accent"
            >
              ← {t('pagination.prev')}
            </Link>
          ) : (
            <span className="rounded-md border border-border px-3 py-1.5 text-muted-foreground/60">
              ←
            </span>
          )}
          <span className="rounded-md border border-border px-3 py-1.5 text-muted-foreground">
            {t('pagination.pageLabel', {
              current: formatNumber(currentPage),
              total: formatNumber(totalPages),
            })}
          </span>
          {nextPageHref ? (
            <Link
              href={nextPageHref}
              className="rounded-md border border-input px-3 py-1.5 font-medium text-foreground transition hover:bg-accent"
            >
              {t('pagination.next')} →
            </Link>
          ) : (
            <span className="rounded-md border border-border px-3 py-1.5 text-muted-foreground/60">
              →
            </span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
