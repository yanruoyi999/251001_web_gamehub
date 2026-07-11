import { NextRequest, NextResponse } from 'next/server';

import { FavoriteService } from '@/services';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';
import { getClientIp } from '@/lib/http/client-ip';
import { isLocalCatalogueMode } from '@/lib/games/catalog-mode';

function localCatalogueResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

function parseGameId(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function canPersistFavorites() {
  const databaseConnection = getDatabaseConnectionMetadata();
  if (!databaseConnection.configured) return false;

  return !(
    process.env.FAVORITES_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS !== 'true' &&
    shouldSkipSupabaseDirectInServerless(databaseConnection)
  );
}

export async function GET(request: NextRequest) {
  if (isLocalCatalogueMode()) return localCatalogueResponse();

  const { searchParams } = new URL(request.url);
  const gameIdParam = searchParams.get('gameId');

  if (gameIdParam && !parseGameId(gameIdParam)) {
    return NextResponse.json({ error: 'Invalid gameId parameter' }, { status: 400 });
  }

  if (!canPersistFavorites()) {
    return gameIdParam
      ? NextResponse.json({ isFavorite: false, degraded: true })
      : NextResponse.json({ favorites: [], degraded: true });
  }

  try {
    const context = FavoriteService.getContextFromHeaders(request.headers, getClientIp(request));

    if (gameIdParam) {
      const gameId = parseGameId(gameIdParam)!;
      const isFavorite = await FavoriteService.isFavorite(gameId, context);
      return NextResponse.json({ isFavorite });
    }

    const favorites = await FavoriteService.listFavoriteIds(context);
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return gameIdParam
      ? NextResponse.json({ isFavorite: false, degraded: true })
      : NextResponse.json({ favorites: [], degraded: true });
  }
}

export async function POST(request: NextRequest) {
  if (isLocalCatalogueMode()) return localCatalogueResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const payload = body as { gameId?: unknown; action?: unknown };
  const gameId = parseGameId(payload?.gameId);
  if (!gameId) {
    return NextResponse.json({ error: 'A valid gameId is required' }, { status: 400 });
  }

  const action = payload.action === 'add' || payload.action === 'remove' || payload.action === 'toggle'
    ? payload.action
    : 'toggle';

  if (!canPersistFavorites()) {
    if (action === 'toggle') {
      return NextResponse.json(
        { error: 'Favorite storage is unavailable; use local fallback' },
        { status: 503 },
      );
    }

    return NextResponse.json({
      isFavorite: action === 'add',
      persisted: false,
      degraded: true,
    });
  }

  try {
    const context = FavoriteService.getContextFromHeaders(request.headers, getClientIp(request));
    let isFavorite: boolean;

    switch (action) {
      case 'add':
        await FavoriteService.addFavorite(gameId, context);
        isFavorite = true;
        break;
      case 'remove':
        await FavoriteService.removeFavorite(gameId, context);
        isFavorite = false;
        break;
      default:
        isFavorite = await FavoriteService.toggleFavorite(gameId, context);
        break;
    }

    return NextResponse.json({ isFavorite, persisted: true });
  } catch (error) {
    console.error('Failed to update favorite:', error);
    return NextResponse.json(
      { error: 'Failed to update favorite; use local fallback' },
      { status: 503 },
    );
  }
}

export const dynamic = 'force-dynamic';
