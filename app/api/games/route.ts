import { NextRequest, NextResponse } from 'next/server';
import { FavoriteService, GameService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';
import { listFallbackGames } from '@/lib/games/fallback-list';
import { sanitizeSearchQuery, validatePagination } from '@/lib/utils/validation';
import type { ListGamesOptions } from '@/services/game.service';

function parseIntegerParam(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

function parseSortBy(value: string | null): ListGamesOptions['sortBy'] {
  if (!value) return undefined;
  return ['publishedAt', 'playCount', 'averageRating', 'title'].includes(value)
    ? (value as ListGamesOptions['sortBy'])
    : undefined;
}

function parseSortOrder(value: string | null): ListGamesOptions['sortOrder'] {
  return value === 'asc' || value === 'desc' ? value : undefined;
}

function parseStatus(value: string | null): ListGamesOptions['status'] {
  if (!value) return undefined;
  return ['active', 'inactive', 'pending', 'all'].includes(value)
    ? (value as ListGamesOptions['status'])
    : undefined;
}

function parseBoolean(value: string | null) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { page, limit } = validatePagination(
    parseIntegerParam(searchParams.get('page')),
    parseIntegerParam(searchParams.get('limit')),
  );

  const favoriteContext = FavoriteService.getContextFromHeaders(request.headers, request.ip ?? undefined);
  let favoriteIds: number[] = [];

  try {
    favoriteIds = await FavoriteService.listFavoriteIds(favoriteContext);
  } catch (error) {
    console.warn('Favorites are unavailable for game list; continuing without favorite state:', error);
  }

  const listOptions: ListGamesOptions = {
    page,
    limit,
    status: parseStatus(searchParams.get('status')),
    categoryId: parseIntegerParam(searchParams.get('categoryId')),
    tagId: parseIntegerParam(searchParams.get('tagId')),
    search: sanitizeSearchQuery(searchParams.get('search') ?? '') || undefined,
    sortBy: parseSortBy(searchParams.get('sortBy')),
    sortOrder: parseSortOrder(searchParams.get('sortOrder')),
    featured: parseBoolean(searchParams.get('featured')),
    isNew: parseBoolean(searchParams.get('isNew')),
    isHot: parseBoolean(searchParams.get('isHot')),
    onlyFavorites: searchParams.get('favoritesOnly') === 'true',
    favoriteGameIds: favoriteIds,
  };

  try {
    const result = await GameService.listGames(listOptions);
    return NextResponse.json(result);
  } catch (error) {
    console.warn('Game database list failed, using local fallback:', error);
    // Keep the public catalogue available for crawlers, reviewers, and users when database env vars are absent.
    return NextResponse.json({
      ...listFallbackGames(listOptions),
      degraded: true,
    });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();

    if (!payload?.title || !payload?.iframeUrl) {
      return NextResponse.json({ error: 'title and iframeUrl are required' }, { status: 400 });
    }

    const game = await GameService.createGame({
      title: payload.title,
      titleEn: payload.titleEn,
      description: payload.description,
      descriptionEn: payload.descriptionEn,
      instructions: payload.instructions,
      instructionsEn: payload.instructionsEn,
      thumbnailUrl: payload.thumbnailUrl,
      iframeUrl: payload.iframeUrl,
      slug: payload.slug,
      isNew: payload.isNew,
      isHot: payload.isHot,
      status: payload.status,
      developerName: payload.developerName,
      developerUrl: payload.developerUrl,
      sourceUrl: payload.sourceUrl,
      categoryIds: payload.categoryIds,
      tagIds: payload.tagIds,
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Failed to create game:', error);
    return NextResponse.json(
      { error: (error as Error).message ?? 'Failed to create game' },
      { status: 400 },
    );
  }
}

export const dynamic = 'force-dynamic';
