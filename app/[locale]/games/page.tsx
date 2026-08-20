import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FavoriteToggleButton } from '@/components/game/favorite-toggle';
import { CollapsibleGameFilters } from '@/components/game/collapsible-game-filters';
import { CategoryService, GameService, TagService } from '@/services';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { listFallbackGames } from '@/lib/games/fallback-list';
import {
  getCatalogueUiCapabilities,
  shouldUseCatalogueDatabase,
} from '@/lib/games/catalog-mode';
import { mockGames } from '@/lib/mock-games';
import { DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';

export const dynamic = 'force-dynamic';

const DB_LOAD_TIMEOUT_MS = 1500;
const SORT_OPTIONS = [
  'publishedAt',
  'playCount',
  'averageRating',
  'title',
] as const;

type SortOption = (typeof SORT_OPTIONS)[number];
type CategoryOption = Awaited<
  ReturnType<typeof CategoryService.listAll>
>[number];
type TagOption = Awaited<ReturnType<typeof TagService.listAll>>[number];
type GameList = Awaited<ReturnType<typeof GameService.listGames>>;

function canUseNextImage(src?: string | null) {
  return Boolean(
    src && (src.startsWith('/') || src.startsWith('https://res.cloudinary.com'))
  );
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string
): Promise<T> {
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
}): {
  categoryOptions: CategoryOption[];
  tagOptions: TagOption[];
  list: GameList;
} {
  return {
    categoryOptions: uniqueMockCategories(),
    tagOptions: uniqueMockTags(),
    list: listFallbackGames({
      page: options.page,
      limit: options.limit,
      categoryId: options.categoryId,
      tagId: options.tagId,
      search: options.search,
      featured: options.showFeatured ? true : undefined,
      isNew: options.showNew ? true : undefined,
      isHot: options.showHot ? true : undefined,
      onlyFavorites: options.favoritesOnly,
      favoriteGameIds: options.favoriteIds,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    }),
  };
}

interface GamesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    tagId?: string;
    search?: string;
    isNew?: string;
    isHot?: string;
    featured?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: GamesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam === 'zh' ? 'zh' : 'en';
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
          locales.map(loc => [
            loc === 'zh' ? 'zh-CN' : 'en-US',
            getLocalizedPath(loc, '/games'),
          ])
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

export default async function GamesPage({
  params,
  searchParams,
}: GamesPageProps) {
  const [{ locale: localeParam }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : 'zh';
  const t = await getTranslations({ locale, namespace: 'Games' });
  const catalogueUi = getCatalogueUiCapabilities();

  const parseId = (value?: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  };

  const page = resolvedSearchParams.page
    ? Number(resolvedSearchParams.page)
    : undefined;
  const categoryId = parseId(resolvedSearchParams.categoryId);
  const tagId = parseId(resolvedSearchParams.tagId);
  const search =
    typeof resolvedSearchParams.search === 'string'
      ? resolvedSearchParams.search
      : '';
  const showNew = resolvedSearchParams.isNew === '1';
  const showHot = resolvedSearchParams.isHot === '1';
  const showFeatured = resolvedSearchParams.featured === '1';
  const favoritesOnly = false;

  const sortByParam =
    typeof resolvedSearchParams.sortBy === 'string'
      ? resolvedSearchParams.sortBy
      : undefined;
  const sortBy = catalogueUi.showCommunityMetrics
    ? SORT_OPTIONS.find(option => option === sortByParam)
    : undefined;

  const sortOrder: 'asc' | 'desc' =
    resolvedSearchParams.sortOrder === 'asc'
      ? 'asc'
      : resolvedSearchParams.sortOrder === 'desc'
        ? 'desc'
        : sortBy === 'title'
          ? 'asc'
          : 'desc';

  const favoriteIds: number[] = [];

  let categoryOptions: CategoryOption[];
  let tagOptions: TagOption[];
  let list: GameList;

  const fallbackOptions = {
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
  };
  const loadFallback = () => buildFallbackGameList(fallbackOptions);
  const connection = getDatabaseConnectionMetadata();
  const canUseDatabase =
    shouldUseCatalogueDatabase(connection) &&
    !(
      process.env.GAME_LIST_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS !== 'true' &&
      shouldSkipSupabaseDirectInServerless(connection)
    );

  if (!canUseDatabase) {
    const fallback = loadFallback();
    categoryOptions = fallback.categoryOptions;
    tagOptions = fallback.tagOptions;
    list = fallback.list;
  } else {
    try {
      [categoryOptions, tagOptions, list] = await withTimeout(
        Promise.all([
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
        ]),
        DB_LOAD_TIMEOUT_MS,
        'Games list database load'
      );
    } catch (error) {
      console.warn(
        'Failed to load games from database, using local fallback:',
        error
      );
      const fallback = loadFallback();
      categoryOptions = fallback.categoryOptions;
      tagOptions = fallback.tagOptions;
      list = fallback.list;
    }
  }

  const { games, total, totalPages, page: currentPage } = list;

  const baseParams = new URLSearchParams();
  if (search.trim()) baseParams.set('search', search.trim());
  if (categoryId) baseParams.set('categoryId', String(categoryId));
  if (tagId) baseParams.set('tagId', String(tagId));
  if (showNew) baseParams.set('isNew', '1');
  if (showHot) baseParams.set('isHot', '1');
  if (showFeatured) baseParams.set('featured', '1');
  if (sortBy) {
    baseParams.set('sortBy', sortBy);
    baseParams.set('sortOrder', sortOrder);
  }

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
  const prevPageHref =
    currentPage > 1
      ? `${gamesPath}${buildQuery({ page: String(currentPage - 1) })}`
      : null;
  const nextPageHref =
    currentPage < totalPages
      ? `${gamesPath}${buildQuery({ page: String(currentPage + 1) })}`
      : null;

  const formatNumber = (value: number) =>
    Number(value ?? 0).toLocaleString(locale);

  const resolveLabel = (
    name: string | null | undefined,
    nameEn?: string | null
  ) => {
    if (locale === 'en') {
      return nameEn?.trim() || name?.trim() || '';
    }
    return name?.trim() || nameEn?.trim() || '';
  };

  const favoriteLabels = {
    favorite: t('actions.favorite'),
    unfavorite: t('actions.unfavorite'),
  };
  const lumaOriginalCopy =
    locale === 'zh'
      ? {
          badge: 'Luma 原创互动游戏',
          title: '花光比尔·盖茨的钱',
          description:
            '拿到固定的1000亿美元，购买私人飞机、球队、医院和太空计划，看看你会成为哪种亿万富翁。',
          action: '开始花钱',
        }
      : {
          badge: 'Luma Original',
          title: 'Spend Bill Gates Money',
          description:
            'Start with a fixed $100 billion, buy jets, teams, hospitals, and a space program, then discover your billionaire identity.',
          action: 'Start spending',
        };
  const hasAdvancedFilters = Boolean(
    categoryId || tagId || showNew || showHot || showFeatured || sortBy
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
      <header className="mb-4 flex flex-col gap-1 border-b border-[#cbdccf] pb-4 md:flex-row md:items-end md:justify-between dark:border-border">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-400">
            {locale === 'zh' ? '打开、选择、开始' : 'Open, choose, play'}
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#152238] sm:text-3xl dark:text-foreground">
            {t('title')}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#61766a] dark:text-muted-foreground">
            {t('desc')}
          </p>
        </div>
        <Link
          href={getLocalizedPath(locale)}
          className="inline-flex min-h-9 items-center text-sm font-bold text-emerald-800 hover:text-emerald-950 dark:text-emerald-400"
        >
          {t('backToHome')}
        </Link>
      </header>

      <section className="mb-4 border-b border-[#cbdccf] py-3 dark:border-border">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-base font-black text-foreground sm:text-lg">
            {t('filters.title')}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t('resultSummary', { value: formatNumber(total) })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form className="space-y-4" method="get">
            <div>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                <span>{t('filters.searchPlaceholder')}</span>
                <input
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder={t('filters.searchPlaceholder')}
                  className="min-h-11 w-full rounded-md border border-[#b9cebf] bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring dark:border-input dark:bg-background"
                />
              </label>
            </div>

            <CollapsibleGameFilters
              defaultOpen={hasAdvancedFilters}
              showLabel={locale === 'zh' ? '更多筛选' : 'More filters'}
              hideLabel={locale === 'zh' ? '收起筛选' : 'Hide filters'}
            >
              <div>
                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  <span>{t('filters.categoryLabel')}</span>
                  <select
                    name="categoryId"
                    defaultValue={categoryId ? String(categoryId) : ''}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">{t('filters.categoryAll')}</option>
                    {categoryOptions.map(category => (
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
                    {tagOptions.map(tag => (
                      <option key={tag.id} value={tag.id}>
                        {resolveLabel(tag.name, tag.nameEn)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {catalogueUi.showCommunityMetrics ? (
                <div>
                  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                    <span>{t('filters.sortLabel')}</span>
                    <div className="flex gap-2">
                      <select
                        name="sortBy"
                        defaultValue={sortBy ?? 'publishedAt'}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {SORT_OPTIONS.map(option => {
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
                        <option value="desc">
                          {t('filters.sortOrderDesc')}
                        </option>
                        <option value="asc">{t('filters.sortOrderAsc')}</option>
                      </select>
                    </div>
                  </label>
                </div>
              ) : null}

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
              </div>
            </CollapsibleGameFilters>

            <div className="flex gap-2">
              <Button type="submit" className="min-h-10 rounded-md bg-emerald-700 px-4 text-sm font-bold hover:bg-emerald-800">
                {t('filters.submit')}
              </Button>
              <Link
                href={gamesPath}
                className="inline-flex min-h-10 items-center rounded-md border border-[#b9cebf] bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-[#e4f0e7] dark:border-input dark:bg-background dark:text-foreground"
              >
                {t('filters.reset')}
              </Link>
            </div>
          </form>
        </CardContent>
      </section>

      <nav
        aria-label={locale === 'zh' ? '游戏分类快捷入口' : 'Game category shortcuts'}
        className="mb-4 flex gap-2 overflow-x-auto pb-1"
      >
        {[
          ...categoryOptions.slice(0, 7).map(category => ({
            href: `${gamesPath}?categoryId=${category.id}`,
            label: resolveLabel(category.name, category.nameEn),
          })),
          {
            href: `${gamesPath}?isNew=1`,
            label: locale === 'zh' ? '新游戏' : 'New',
          },
          {
            href: `${gamesPath}?isHot=1`,
            label: locale === 'zh' ? '热门' : 'Hot',
          },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex min-h-9 shrink-0 items-center rounded-md border border-[#c3d5c8] bg-white px-3 text-xs font-bold text-[#30483a] transition hover:border-emerald-700/50 hover:bg-[#e4f0e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-border dark:bg-card dark:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {games.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center text-muted-foreground">
          {t('empty')}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {games.map(game => {
            const displayTitle =
              locale === 'en' ? (game.titleEn ?? game.title) : game.title;
            const statusLabel = t(`status.${game.status ?? 'active'}`);
            const publishedLabel =
              catalogueUi.showPublishedDates && game.publishedAt
                ? t('published', {
                    value: new Date(game.publishedAt).toLocaleDateString(
                      locale
                    ),
                  })
                : null;
            const thumbnailUrl = game.thumbnailUrl;

            return (
              <Card
                key={game.id}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-[10px] border-[#d6e2d8] bg-white shadow-[0_8px_24px_-20px_rgba(16,58,38,0.6)] transition hover:-translate-y-0.5 hover:border-emerald-700/50 hover:shadow-[0_14px_28px_-20px_rgba(16,58,38,0.7)] dark:border-border dark:bg-card"
              >
                <Link
                  href={getLocalizedPath(locale, `/games/${game.slug}`)}
                  className="relative block aspect-[4/3] overflow-hidden bg-[#102033]"
                  aria-label={displayTitle}
                >
                  {thumbnailUrl ? (
                    canUseNextImage(thumbnailUrl) ? (
                      <Image
                        src={thumbnailUrl}
                        alt={displayTitle}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnailUrl}
                        alt={displayTitle}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 px-4 text-center text-lg font-semibold text-primary">
                      {displayTitle}
                    </div>
                  )}
                </Link>
                <CardHeader className="p-3 sm:p-3.5">
                  {(game.featured || game.isHot || game.isNew) && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {game.featured ? (
                        <span className="inline-flex items-center rounded-sm bg-amber-100 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-800">
                          {t('badges.featured')}
                        </span>
                      ) : null}
                      {game.isHot ? (
                        <span className="inline-flex items-center rounded-sm bg-rose-100 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-rose-800">
                          {t('badges.hot')}
                        </span>
                      ) : null}
                      {game.isNew ? (
                        <span className="inline-flex items-center rounded-sm bg-emerald-100 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-800">
                          {t('badges.new')}
                        </span>
                      ) : null}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-1 text-sm font-black leading-snug text-foreground sm:text-base">
                      <Link
                        href={getLocalizedPath(locale, `/games/${game.slug}`)}
                        className="hover:text-primary"
                      >
                        {displayTitle}
                      </Link>
                    </CardTitle>
                    <div className="flex-shrink-0">
                      <FavoriteToggleButton
                        gameId={game.id}
                        initialFavorite={Boolean(game.isFavorite)}
                        labels={favoriteLabels}
                        fallbackKey={
                          game.slug
                            ? `slug:${game.slug.toLowerCase()}`
                            : `id:${game.id}`
                        }
                        gameSlug={game.slug}
                        surface="game_list"
                        storageMode={catalogueUi.favoriteStorage}
                        compact
                      />
                    </div>
                  </div>
                  {publishedLabel ? (
                    <CardDescription className="hidden text-xs text-muted-foreground sm:block">
                      {publishedLabel}
                    </CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-2 p-3 pt-0 text-[11px] text-muted-foreground sm:p-3.5 sm:pt-0 sm:text-xs">
                  <p className="truncate">{statusLabel}</p>
                  {catalogueUi.showCommunityMetrics ? (
                    <>
                      <p>
                        {t('playCount', {
                          value: Number(game.playCount ?? 0).toLocaleString(
                            locale
                          ),
                        })}
                      </p>
                      <p>
                        {t('rating', {
                          value: Number(game.averageRating ?? 0).toFixed(2),
                        })}
                      </p>
                    </>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="mt-8 overflow-hidden rounded-xl border-primary/30 bg-slate-950 text-white shadow-none">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-md border border-amber-300/40 bg-amber-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-200">
              {lumaOriginalCopy.badge}
            </span>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">
              {lumaOriginalCopy.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {lumaOriginalCopy.description}
            </p>
          </div>
          <Link
            href={getLocalizedPath(locale, '/games/spend-bill-gates-money')}
            className="inline-flex min-h-11 flex-shrink-0 items-center justify-center rounded-md bg-amber-300 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
          >
            {lumaOriginalCopy.action} →
          </Link>
        </CardContent>
      </Card>

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
