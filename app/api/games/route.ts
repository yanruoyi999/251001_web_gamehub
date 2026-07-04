import { NextRequest, NextResponse } from 'next/server';
import { FavoriteService, GameService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';
import { listFallbackGames } from '@/lib/games/fallback-list';
import { sanitizeSearchQuery, validatePagination } from '@/lib/utils/validation';

function parseIntegerParam(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

function parseSortBy(value: string | null) {
  if (!value) return undefined;
  if (['publishedAt', 'playCount', 'averageRating', 'title'].includes(value)) {
    return value as 'publishedAt' | 'playCount' | 'averageRating' | 'title';
  }
  return undefined;
}

function parseSortOrder(value: string | null) {
  if (!value) return undefined;
  if (value === 'asc' || value === 'desc') return value;
  return undefined;
}

function parseStatus(value: string | null) {
  if (!value) return undefined;
  if (['active', 'inactive', 'pending', 'all'].includes(value)) {
    return value as 'active' | 'inactive' | 'pending' | 'all';
  }
  return undefined;
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
  const status = parseStatus(searchParams.get('status'));
  const categoryId = parseIntegerParam(searchParams.get('categoryId'));
  const tagId = parseIntegerParam(searchParams.get('tagId'));
  const featured = parseBoolean(searchParams.get('featured'));
  const isNew = parseBoolean(searchParams.get('isNew'));
  const isHot = parseBoolean(searchParams.get('isHot'));
  const favoritesOnly = searchParams.get('favoritesOnly') === 'true';
  const sortBy = parseSortBy(searchParams.get('sortBy'));
  const sortOrder = parseSortOrder(searchParams.get('sortOrder'));
  const search = sanitizeSearchQuery(searchParams.get('search') ?? '') || undefined;

  const favoriteContext = FavoriteService.getContextFromHeaders(request.headers, request.ip ?? undefined);
  let favoriteIds: number[] = [];

  try {
    favoriteIds = await FavoriteService.listFavoriteIds(favoriteContext);
  } catch (error) {
    console.warn('Favorites are unavailable for game list; continuing without favorite state:', error);
  }

  const listOptions = {
    page,
    limit,
    status,
    categoryId,
    tagId,
    search,
    sortBy,
    sortOrder,
    featured,
    isNew,
    isHot,
    onlyFavorites: favoritesOnly,
    favoriteGameIds: favoriteIds,
  };

  try {
    const result = await GameService.listGames(listOptions);
    return NextResponse.json(result);
  } catch (error) {
    console.warn('Game database list failed, using local fallback:', error);
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
    const body = await request.json();

    if (!body?.title || !body?.iframeUrl) {
      return NextResponse.json(
        { error: 'title and iframeUrl are required' },
        { status: 400 }
      );
    }

    const game = await GameService.createGame({
      title: body.title,
      titleEn: body.titleEn,
      description: body.description,
      descriptionEn: body.descriptionEn,
      instructions: body.instructions,
      instructionsEn: body.instructionsEn,
      thumbnailUrl: body.thumbnailUrl,
      iframeUrl: body.iframeUrl,
      slug: body.slug,
      isNew: body.isNew,
      isHot: body.isHot,
      status: body.status,
      developerName: body.developerName,
      developerUrl: body.developerUrl,
      sourceUrl: body.sourceUrl,
      categoryIds: body.categoryIds,
      tagIds: body.tagIds,
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Failed to create game:', error);
    return NextResponse.json(
      { error: (error as Error).message ?? 'Failed to create game' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
