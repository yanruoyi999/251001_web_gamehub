import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';
import { buildFallbackGameDetail } from '@/lib/games/fallback-detail';
import { getMockGameById } from '@/lib/mock-games';

const DEFAULT_GAME_DETAIL_TIMEOUT_MS = 1500;

function parseId(value: string): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function gameDetailTimeoutMs() {
  const parsed = Number(process.env.GAME_DETAIL_BACKEND_TIMEOUT_MS);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_GAME_DETAIL_TIMEOUT_MS;
}

function withGameDetailTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${gameDetailTimeoutMs()}ms`));
    }, gameDetailTimeoutMs());
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function shouldUseGameDetailFallback() {
  const databaseConnection = getDatabaseConnectionMetadata();
  return (
    !databaseConnection.configured ||
    (
      process.env.GAME_DETAIL_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS !== 'true' &&
      shouldSkipSupabaseDirectInServerless(databaseConnection)
    )
  );
}

function getFallbackDetail(gameId: number) {
  const mockGame = getMockGameById(gameId);
  return mockGame ? buildFallbackGameDetail(mockGame) : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const gameId = parseId(params.id);
  if (!gameId) {
    return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
  }

  if (shouldUseGameDetailFallback()) {
    const fallback = getFallbackDetail(gameId);
    return fallback
      ? NextResponse.json(fallback)
      : NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  try {
    const game = await withGameDetailTimeout(
      GameService.getGameById(gameId, true),
      'Game detail lookup',
    );
    if (!game || (game.status !== 'active' && !isAdminRequestAuthenticated(request))) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (error) {
    console.warn('Game detail lookup failed, using local fallback:', error);
    const fallback = getFallbackDetail(gameId);
    return fallback
      ? NextResponse.json(fallback)
      : NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gameId = parseId(params.id);
  if (!gameId) {
    return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  try {
    const updated = await GameService.updateGame(gameId, (body ?? {}) as Record<string, unknown>);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update game:', error);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gameId = parseId(params.id);
  if (!gameId) {
    return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
  }

  try {
    await GameService.archiveGame(gameId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete game:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
