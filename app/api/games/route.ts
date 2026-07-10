import { NextRequest, NextResponse } from 'next/server';
import { FavoriteService, GameService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';
import { listFallbackGames } from '@/lib/games/fallback-list';
import { getClientIp } from '@/lib/http/client-ip';
import { sanitizeSearchQuery, validatePagination } from '@/lib/utils/validation';
import type { CreateGameInput, ListGamesOptions } from '@/services/game.service';
import { isLocalCatalogueMode } from '@/lib/games/catalog-mode';

const DEFAULT_GAME_LIST_BACKEND_TIMEOUT_MS = 2500;

function gameListBackendTimeoutMs() {
  const parsed = Number(process.env.GAME_LIST_BACKEND_TIMEOUT_MS ?? process.env.SEARCH_BACKEND_TIMEOUT_MS);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_GAME_LIST_BACKEND_TIMEOUT_MS;
}

function withGameListTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${gameListBackendTimeoutMs()}ms`));
    }, gameListBackendTimeoutMs());
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function shouldUsePublicCatalogueFallback() {
  const databaseConnection = getDatabaseConnectionMetadata();
  return (
    !databaseConnection.configured ||
    (
      process.env.GAME_LIST_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS !== 'true' &&
      shouldSkipSupabaseDirectInServerless(databaseConnection)
    )
  );
}

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

function positiveIntegerArray(value: unknown): number[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return Array.from(
    new Set(
      value
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item > 0),
    ),
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { page, limit } = validatePagination(
    parseIntegerParam(searchParams.get('page')),
    parseIntegerParam(searchParams.get('limit')),
  );
  const isAdmin = isAdminRequestAuthenticated(request);
  const requestedStatus = parseStatus(searchParams.get('status'));

  const listOptions: ListGamesOptions = {
    page,
    limit,
    // Unauthenticated callers must never enumerate pending or archived content.
    status: isAdmin ? requestedStatus : 'active',
    categoryId: parseIntegerParam(searchParams.get('categoryId')),
    tagId: parseIntegerParam(searchParams.get('tagId')),
    search: sanitizeSearchQuery(searchParams.get('search') ?? '') || undefined,
    sortBy: parseSortBy(searchParams.get('sortBy')),
    sortOrder: parseSortOrder(searchParams.get('sortOrder')),
    featured: parseBoolean(searchParams.get('featured')),
    isNew: parseBoolean(searchParams.get('isNew')),
    isHot: parseBoolean(searchParams.get('isHot')),
    onlyFavorites: searchParams.get('favoritesOnly') === 'true',
    favoriteGameIds: [],
  };

  if (shouldUsePublicCatalogueFallback()) {
    if (!isLocalCatalogueMode()) {
      console.warn('Game database list skipped, using local fallback because database config is not production-safe');
    }
    return NextResponse.json({
      ...listFallbackGames(listOptions),
      degraded: true,
    });
  }

  const favoriteContext = FavoriteService.getContextFromHeaders(request.headers, getClientIp(request));
  try {
    listOptions.favoriteGameIds = await withGameListTimeout(
      FavoriteService.listFavoriteIds(favoriteContext),
      'Favorite list lookup',
    );
  } catch (error) {
    console.warn('Favorites are unavailable for game list; continuing without favorite state:', error);
  }

  try {
    const result = await withGameListTimeout(GameService.listGames(listOptions), 'Game list lookup');
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const iframeUrl = typeof payload.iframeUrl === 'string' ? payload.iframeUrl.trim() : '';

  if (!title || !iframeUrl) {
    return NextResponse.json({ error: 'title and iframeUrl are required' }, { status: 400 });
  }

  const createInput: CreateGameInput = {
    title,
    iframeUrl,
    titleEn: typeof payload.titleEn === 'string' ? payload.titleEn.trim() : undefined,
    description: typeof payload.description === 'string' ? payload.description : undefined,
    descriptionEn: typeof payload.descriptionEn === 'string' ? payload.descriptionEn : undefined,
    instructions: typeof payload.instructions === 'string' ? payload.instructions : undefined,
    instructionsEn: typeof payload.instructionsEn === 'string' ? payload.instructionsEn : undefined,
    thumbnailUrl: typeof payload.thumbnailUrl === 'string' ? payload.thumbnailUrl.trim() : undefined,
    slug: typeof payload.slug === 'string' ? payload.slug.trim() : undefined,
    isNew: typeof payload.isNew === 'boolean' ? payload.isNew : undefined,
    isHot: typeof payload.isHot === 'boolean' ? payload.isHot : undefined,
    status:
      payload.status === 'active' || payload.status === 'inactive' || payload.status === 'pending'
        ? payload.status
        : undefined,
    developerName:
      typeof payload.developerName === 'string' ? payload.developerName.trim() || null : undefined,
    developerUrl:
      typeof payload.developerUrl === 'string' ? payload.developerUrl.trim() || null : undefined,
    sourceUrl: typeof payload.sourceUrl === 'string' ? payload.sourceUrl.trim() || null : undefined,
    categoryIds: positiveIntegerArray(payload.categoryIds),
    tagIds: positiveIntegerArray(payload.tagIds),
  };

  try {
    const game = await GameService.createGame(createInput);
    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Failed to create game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
