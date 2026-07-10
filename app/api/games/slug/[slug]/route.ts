import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';
import { buildFallbackGameDetail } from '@/lib/games/fallback-detail';
import { getMockGameBySlug } from '@/lib/mock-games';
import { isValidSlug } from '@/lib/utils/slug';

const DEFAULT_GAME_DETAIL_TIMEOUT_MS = 1500;

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

function getFallbackDetail(slug: string) {
  const mockGame = getMockGameBySlug(slug);
  return mockGame ? buildFallbackGameDetail(mockGame) : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug: slugParam } = await params;
  const slug = slugParam.trim().toLowerCase();
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Invalid game slug' }, { status: 400 });
  }

  if (shouldUseGameDetailFallback()) {
    const fallback = getFallbackDetail(slug);
    return fallback
      ? NextResponse.json(fallback)
      : NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  try {
    const game = await withGameDetailTimeout(
      GameService.getGameBySlug(slug, true),
      'Game slug lookup',
    );
    if (!game || (game.status !== 'active' && !isAdminRequestAuthenticated(request))) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (error) {
    console.warn('Game slug lookup failed, using local fallback:', error);
    const fallback = getFallbackDetail(slug);
    return fallback
      ? NextResponse.json(fallback)
      : NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }
}

export const dynamic = 'force-dynamic';
