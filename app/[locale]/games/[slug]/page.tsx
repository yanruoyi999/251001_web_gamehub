import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FavoriteToggleButton } from '@/components/game/favorite-toggle';
import { FavoriteService, GameService, RatingService } from '@/services';
import { getMockGameBySlug } from '@/lib/mock-games';
import type { GameDetail } from '@/services/game.service';
import type { MockGame } from '@/lib/mock-games';
import { buildAbsoluteUrl } from '@/lib/seo';

type RatingDistribution = Awaited<ReturnType<typeof RatingService.getRatingDistribution>>;
type RatingsResult = Awaited<ReturnType<typeof RatingService.listGameRatings>>;

function buildGameDetailFromMock(mock: MockGame): GameDetail {
  const now = new Date();
  return {
    id: mock.id,
    slug: mock.slug,
    title: mock.title,
    titleEn: mock.titleEn,
    description: mock.description,
    descriptionEn: mock.descriptionEn,
    instructions: null,
    instructionsEn: null,
    thumbnailUrl: mock.thumbnailUrl,
    iframeUrl: mock.iframeUrl,
    featured: mock.featured,
    isNew: mock.isNew,
    isHot: mock.isHot,
    status: 'active',
    developerName: null,
    developerUrl: null,
    sourceUrl: null,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    stats: null,
    categories: [],
    tags: [],
    screenshots: [],
  } satisfies GameDetail;
}

interface GamePageProps {
  params: { locale: string; slug: string };
}

export const dynamic = 'force-dynamic';

export default async function GamePage({ params }: GamePageProps) {
  const { locale, slug } = params;
  const headerList = headers();

  let dbGame: GameDetail | null = null;
  try {
    dbGame = await GameService.getGameBySlug(slug, true);
  } catch (error) {
    console.warn('Failed to fetch game from database, falling back to mock data:', error);
  }

  let game: GameDetail | null = dbGame;
  let isMockGame = false;

  if (!game) {
    const mockGame = getMockGameBySlug(slug);
    if (!mockGame) {
      notFound();
    }
    game = buildGameDetailFromMock(mockGame);
    isMockGame = true;
  }

  if (!game || game.status !== 'active') {
    notFound();
  }

  let ratingDistribution: RatingDistribution;
  let ratingsResult: RatingsResult;
  let isFavorite = false;

  if (isMockGame) {
    ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as RatingDistribution;
    ratingsResult = { ratings: [], total: 0, page: 1, limit: 3, totalPages: 0 } as RatingsResult;
  } else {
    try {
      const favoriteContext = FavoriteService.getContextFromHeaders(headerList);
      const [favoriteState, distribution, result] = await Promise.all([
        FavoriteService.isFavorite(game.id, favoriteContext),
        RatingService.getRatingDistribution(game.id),
        RatingService.listGameRatings(game.id, { limit: 3 }),
      ]);

      isFavorite = Boolean(favoriteState);
      ratingDistribution = distribution;
      ratingsResult = result;
    } catch (error) {
      console.warn('Failed to load ratings/favorites, using defaults:', error);
      ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as RatingDistribution;
      ratingsResult = { ratings: [], total: 0, page: 1, limit: 3, totalPages: 0 } as RatingsResult;
      isFavorite = false;
    }
  }

  const localeTag = locale === 'zh' ? 'zh-CN' : 'en-US';
  const numberFormatter = new Intl.NumberFormat(localeTag);
  const dateFormatter = new Intl.DateTimeFormat(localeTag, { dateStyle: 'medium' });

  const formatNumber = (value: number) => numberFormatter.format(value ?? 0);
  const formatDate = (value?: Date | string | null) => {
    if (!value) return locale === 'zh' ? '未设置' : 'Not set';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return locale === 'zh' ? '未设置' : 'Not set';
    }
    return dateFormatter.format(date);
  };

  const pickLocalized = (primary?: string | null, fallback?: string | null) =>
    primary?.trim() || fallback?.trim() || '';

  const title = locale === 'en'
    ? pickLocalized(game.titleEn, game.title)
    : pickLocalized(game.title, game.titleEn);

  const description = locale === 'en'
    ? pickLocalized(game.descriptionEn, game.description)
    : pickLocalized(game.description, game.descriptionEn);

  const instructions = locale === 'en'
    ? pickLocalized(game.instructionsEn, game.instructions)
    : pickLocalized(game.instructions, game.instructionsEn);

  const instructionItems = instructions
    ? instructions
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const stats = game.stats;
  const averageRating = Number(stats?.averageRating ?? 0);
  const averageRatingDisplay = averageRating > 0 ? averageRating.toFixed(1) : '—';
  const roundedRating = Math.round(Math.min(Math.max(averageRating, 0), 5));
  const starDisplay = roundedRating > 0 ? '⭐'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating) : '☆☆☆☆☆';
  const ratingCount = stats?.ratingCount ?? ratingsResult.total ?? 0;
  const playCount = stats?.playCount ?? 0;
  const publishedLabel = formatDate(game.publishedAt);
  const resolveLabel = (name?: string | null, nameEn?: string | null) =>
    locale === 'en'
      ? pickLocalized(nameEn, name)
      : pickLocalized(name, nameEn);
  const categoryLabels = game.categories.map((category) =>
    resolveLabel(category.name, category.nameEn)
  );
  const tagLabels = game.tags.map((tag) => resolveLabel(tag.name, tag.nameEn));
  const pageUrl = buildAbsoluteUrl(`/${locale}/games/${game.slug}`);
  const publishedIso = (() => {
    if (!game.publishedAt) return undefined;
    const value = game.publishedAt instanceof Date ? game.publishedAt : new Date(game.publishedAt);
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  })();

  const videoGameSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: title,
    url: pageUrl,
    inLanguage: localeTag,
    description,
    image: game.thumbnailUrl,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser',
    playMode: 'SinglePlayer',
    genre:
      game.categories && game.categories.length > 0
        ? game.categories.map((category) =>
            resolveLabel(category.name, category.nameEn) || 'Browser Game',
          )
        : ['Browser Game'],
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GameHub',
    },
  };

  if (publishedIso) {
    videoGameSchema.datePublished = publishedIso;
  }

  if (tagLabels.length > 0) {
    videoGameSchema.keywords = tagLabels.join(', ');
  }

  if (playCount) {
    videoGameSchema.interactionStatistic = {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'PlayAction' },
      userInteractionCount: Number(playCount),
    };
  }

  if (averageRating > 0 && ratingCount > 0) {
    videoGameSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      ratingCount,
    };
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'zh' ? '首页' : 'Home',
        item: buildAbsoluteUrl(`/${locale}`),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'zh' ? '全部游戏' : 'All Games',
        item: buildAbsoluteUrl(`/${locale}/games`),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: pageUrl,
      },
    ],
  };
  const structuredData = [videoGameSchema, breadcrumbSchema];

  const distributionByStars: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: ratingDistribution['1'] ?? (ratingDistribution as Record<number, number>)[1] ?? 0,
    2: ratingDistribution['2'] ?? (ratingDistribution as Record<number, number>)[2] ?? 0,
    3: ratingDistribution['3'] ?? (ratingDistribution as Record<number, number>)[3] ?? 0,
    4: ratingDistribution['4'] ?? (ratingDistribution as Record<number, number>)[4] ?? 0,
    5: ratingDistribution['5'] ?? (ratingDistribution as Record<number, number>)[5] ?? 0,
  };

  const totalDistributionCount =
    distributionByStars[1] +
    distributionByStars[2] +
    distributionByStars[3] +
    distributionByStars[4] +
    distributionByStars[5];

  const distributionEntries = [5, 4, 3, 2, 1].map((stars) => {
    const count = distributionByStars[stars as 1 | 2 | 3 | 4 | 5] ?? 0;
    const percentage = totalDistributionCount > 0 ? Math.round((count / totalDistributionCount) * 100) : 0;
    return { stars, count, percentage };
  });

  const recentRatings = ratingsResult.ratings;

  const favoriteLabels = {
    favorite: locale === 'zh' ? '收藏' : 'Favorite',
    unfavorite: locale === 'zh' ? '取消收藏' : 'Unfavorite',
  };

  const canFavorite = game.status === 'active';
  const favoriteFallbackKey = game.slug?.trim()
    ? `slug:${game.slug.trim().toLowerCase()}`
    : `id:${game.id}`;

  const statusChips = [
    locale === 'zh' ? '上线' : 'Active',
    ...(game.featured ? [locale === 'zh' ? '精选' : 'Featured'] : []),
    ...(game.isNew ? [locale === 'zh' ? '新品' : 'New'] : []),
    ...(game.isHot ? [locale === 'zh' ? '热门' : 'Hot'] : []),
  ];

  if (isMockGame) {
    statusChips.push(locale === 'zh' ? '演示数据' : 'Demo Data');
  }

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        {structuredData.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link href={`/${locale}`} className="hover:text-indigo-600">
            {locale === 'zh' ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/games`} className="hover:text-indigo-600">
            {locale === 'zh' ? '游戏' : 'Games'}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{title}</span>
        </div>

        {/* Game Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
              {game.isNew && (
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                  {locale === 'zh' ? '新品' : 'NEW'}
                </span>
              )}
              {game.isHot && (
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                  {locale === 'zh' ? '热门' : 'HOT'}
                </span>
              )}
            </div>
            <p className="mb-4 text-lg text-gray-600">{description}</p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-semibold text-gray-900">
                    {averageRatingDisplay !== '—' ? `${averageRatingDisplay}/5` : '—'}
                  </div>
                  <div className="text-xs text-yellow-500">{starDisplay}</div>
                  <div className="text-gray-500">{formatNumber(ratingCount)} {locale === 'zh' ? '条评分' : 'ratings'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                <div>
                  <div className="font-semibold text-gray-900">{formatNumber(playCount)}</div>
                  <div className="text-gray-500">{locale === 'zh' ? '次游玩' : 'plays'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <div>
                  <div className="font-semibold text-gray-900">{publishedLabel}</div>
                  <div className="text-gray-500">{locale === 'zh' ? '发布时间' : 'Published'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {canFavorite ? (
              <FavoriteToggleButton
                gameId={game.id}
                initialFavorite={isFavorite}
                labels={favoriteLabels}
                fallbackKey={favoriteFallbackKey}
              />
            ) : (
              <Button variant="outline" size="lg" disabled>
                <span className="mr-2">❤️</span>
                {locale === 'zh' ? '收藏不可用' : 'Favorites unavailable'}
              </Button>
            )}
            <Button variant="outline" size="lg">
              <span className="mr-2">📤</span>
              {locale === 'zh' ? '分享' : 'Share'}
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Game Player */}
            <Card className="mb-8 overflow-hidden border-2 border-indigo-100">
              <CardContent className="p-0">
                <div className="relative overflow-hidden bg-black">
                  <div className="aspect-video">
                    <iframe
                      src={game.iframeUrl}
                      title={title}
                      loading="lazy"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-fullscreen"
                      className="h-full w-full"
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
                  <div className="flex items-center justify-center">
                    <p className="text-sm text-gray-600">
                      <span className="mr-2">💡</span>
                      {locale === 'zh'
                        ? '点击游戏内全屏按钮获得最佳体验'
                        : 'Click fullscreen button for best experience'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{locale === 'zh' ? '玩家评价' : 'Player Reviews'}</span>
                  <Button size="sm" variant="outline">
                    <span className="mr-1">✍️</span>
                    {locale === 'zh' ? '写评论' : 'Write Review'}
                  </Button>
                </CardTitle>
                <CardDescription>
                  {formatNumber(ratingCount)} {locale === 'zh' ? '条评价' : 'reviews'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rating Distribution */}
                <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                  <div className="mb-4 text-center">
                    <div className="text-5xl font-bold text-gray-900">{averageRatingDisplay}</div>
                    <div className="text-yellow-500">{starDisplay}</div>
                    <div className="text-sm text-gray-600">
                      {locale === 'zh' ? '基于' : 'Based on'} {formatNumber(ratingCount)} {locale === 'zh' ? '条评价' : 'reviews'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {distributionEntries.map(({ stars, count, percentage }) => (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-8">{stars}★</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-24 text-right text-gray-600">
                          {percentage}% · {formatNumber(count)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="space-y-4">
                  {recentRatings.length > 0 ? (
                    recentRatings.map((rating) => {
                      const displayName = locale === 'zh' ? '匿名玩家' : 'Anonymous player';
                      const displayDate = formatDate(rating.createdAt);
                      const comment = rating.comment?.trim()
                        || (locale === 'zh' ? '该玩家暂未留下评论。' : 'No comment provided.');

                      return (
                        <div key={rating.id} className="rounded-lg border border-gray-200 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white">
                                {displayName[0]}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{displayName}</div>
                                <div className="text-xs text-gray-500">{displayDate}</div>
                              </div>
                            </div>
                            <div className="text-yellow-500">{'⭐'.repeat(rating.rating)}</div>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
                      {locale === 'zh'
                        ? '暂时还没有玩家评价，欢迎成为第一位分享体验的玩家。'
                        : 'No reviews yet. Be the first to share your experience.'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'zh' ? '游戏信息' : 'Game Info'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="mb-1 font-medium text-gray-900">
                    {locale === 'zh' ? '分类' : 'Categories'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryLabels.length > 0 ? (
                      categoryLabels.map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                        >
                          {label}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {locale === 'zh' ? '未分类' : 'Uncategorized'}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-medium text-gray-900">
                    {locale === 'zh' ? '标签' : 'Tags'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tagLabels.length > 0 ? (
                      tagLabels.map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                        >
                          {label}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {locale === 'zh' ? '暂无标签' : 'No tags'}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-medium text-gray-900">
                    {locale === 'zh' ? '状态' : 'Status'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusChips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-medium text-gray-900">
                    {locale === 'zh' ? '发布时间' : 'Published'}
                  </div>
                  <div className="text-gray-600">{publishedLabel}</div>
                </div>
                {game.developerName && (
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      <span>👨‍💻</span>
                      {locale === 'zh' ? '官方开发者' : 'Official Developer'}
                    </div>
                    {game.developerUrl ? (
                      <a
                        href={game.developerUrl}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        title={locale === 'zh' ? '访问开发者官网' : 'Visit developer website'}
                      >
                        <span>{game.developerName}</span>
                        <span className="text-xs">↗</span>
                      </a>
                    ) : (
                      <div className="text-sm font-medium text-gray-800">{game.developerName}</div>
                    )}
                    <p className="mt-1 text-xs text-gray-600">
                      {locale === 'zh' ? '已验证的游戏开发商' : 'Verified game developer'}
                    </p>
                  </div>
                )}
                {game.sourceUrl && (
                  <div className="rounded-lg border border-green-100 bg-green-50/50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                      <span>🔗</span>
                      {locale === 'zh' ? '官方来源' : 'Official Source'}
                    </div>
                    <a
                      href={game.sourceUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                      title={locale === 'zh' ? '在官方网站体验完整版' : 'Play full version on official site'}
                    >
                      <span>{locale === 'zh' ? '访问官方网站' : 'Visit Official Site'}</span>
                      <span>↗</span>
                    </a>
                    <p className="mt-2 text-xs text-gray-600">
                      {locale === 'zh'
                        ? '此链接将跳转到游戏官方网站'
                        : 'This link redirects to the official game site'}
                    </p>
                  </div>
                )}
                <div>
                  <div className="mb-1 font-medium text-gray-900">
                    {locale === 'zh' ? '游戏地址' : 'Game URL'}
                  </div>
                  <a
                    href={game.iframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {game.iframeUrl}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Game Tips */}
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>💡</span>
                  {locale === 'zh' ? '游戏提示' : 'Game Tips'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {instructionItems.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-700">
                    {instructionItems.map((item, index) => (
                      <li key={index} className="flex gap-2">
                        <span>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-700">
                    {locale === 'zh'
                      ? '暂无具体指引，直接开始体验游戏吧！'
                      : 'No specific tips yet—jump in and explore!'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Similar Games */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'zh' ? '相似游戏' : 'Similar Games'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Link key={i} href={`/${locale}/games`} className="block">
                    <div className="group rounded-lg border border-gray-200 p-3 transition-all hover:border-indigo-300 hover:shadow-md">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100"></div>
                        <div className="flex-1">
                          <div className="mb-1 font-medium text-gray-900 group-hover:text-indigo-600">
                            {locale === 'zh' ? '相似游戏' : 'Similar Game'} {i}
                          </div>
                          <div className="text-xs text-gray-500">⭐ 4.2 · 🎮 5.2K</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
