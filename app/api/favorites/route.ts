import { NextRequest, NextResponse } from 'next/server';

import { FavoriteService } from '@/services';

function parseGameId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const context = FavoriteService.getContextFromHeaders(request.headers, request.ip ?? undefined);
    const { searchParams } = new URL(request.url);
    const gameIdParam = searchParams.get('gameId');

    if (gameIdParam) {
      const gameId = parseGameId(gameIdParam);
      if (!gameId) {
        return NextResponse.json({ error: 'Invalid gameId parameter' }, { status: 400 });
      }

      const isFavorite = await FavoriteService.isFavorite(gameId, context);
      return NextResponse.json({ isFavorite });
    }

    const favorites = await FavoriteService.listFavoriteIds(context);
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const context = FavoriteService.getContextFromHeaders(request.headers, request.ip ?? undefined);

    const gameId = parseGameId(body?.gameId);
    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    const action = body?.action as 'add' | 'remove' | 'toggle' | undefined;
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

    return NextResponse.json({ isFavorite }, { status: 200 });
  } catch (error) {
    console.error('Failed to update favorite:', error);
    return NextResponse.json(
      { error: (error as Error).message ?? 'Failed to update favorite' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
