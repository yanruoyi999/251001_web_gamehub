import { NextRequest, NextResponse } from 'next/server';
import { CounterService } from '@/services';
import { redis } from '@/lib/redis';
import { hashIp } from '@/lib/utils/hash';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_MEMORY_RATE_LIMIT_KEYS = 5_000;

type MemoryRateLimitEntry = {
  count: number;
  resetAt: number;
};

const memoryRateLimits = new Map<string, MemoryRateLimitEntry>();

function parseId(value: string): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function getClientIp(request: NextRequest) {
  if (request.ip && request.ip.trim().length > 0) {
    return request.ip.trim();
  }

  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    '0.0.0.0'
  );
}

function consumeMemoryRateLimit(key: string, now = Date.now()): 'allowed' | 'limited' {
  const current = memoryRateLimits.get(key);
  const next = !current || current.resetAt <= now
    ? { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
    : { count: current.count + 1, resetAt: current.resetAt };

  memoryRateLimits.set(key, next);

  if (memoryRateLimits.size > MAX_MEMORY_RATE_LIMIT_KEYS) {
    for (const [candidateKey, entry] of memoryRateLimits) {
      if (entry.resetAt <= now) memoryRateLimits.delete(candidateKey);
    }

    while (memoryRateLimits.size > MAX_MEMORY_RATE_LIMIT_KEYS) {
      const oldestKey = memoryRateLimits.keys().next().value as string | undefined;
      if (!oldestKey) break;
      memoryRateLimits.delete(oldestKey);
    }
  }

  return next.count <= RATE_LIMIT ? 'allowed' : 'limited';
}

async function getPlayIncrementLimitStatus(
  request: NextRequest,
  gameId: number,
): Promise<'allowed' | 'limited'> {
  const ipHash = hashIp(getClientIp(request));
  const key = `gamehub:counter:limit:${gameId}:${ipHash}`;

  if (!redis || typeof redis.incr !== 'function' || typeof redis.expire !== 'function') {
    return consumeMemoryRateLimit(key);
  }

  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW_MS / 1000);
    }
    return current <= RATE_LIMIT ? 'allowed' : 'limited';
  } catch (error) {
    console.warn('Distributed play count rate limit unavailable; using memory fallback:', error);
    return consumeMemoryRateLimit(key);
  }
}

function canPersistPlayCount() {
  const databaseConnection = getDatabaseConnectionMetadata();
  if (!databaseConnection.configured) return false;

  return !(
    process.env.COUNTER_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS !== 'true' &&
    shouldSkipSupabaseDirectInServerless(databaseConnection)
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const gameId = parseId(params.id);
  if (!gameId) {
    return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
  }

  try {
    const limitStatus = await getPlayIncrementLimitStatus(request, gameId);
    if (limitStatus === 'limited') {
      return NextResponse.json({ error: 'Too many play count updates' }, { status: 429 });
    }

    if (!canPersistPlayCount()) {
      return NextResponse.json(
        { success: true, persisted: false, degraded: true },
        { status: 202 },
      );
    }

    await CounterService.increment(gameId, 1);
    return NextResponse.json({ success: true, persisted: true });
  } catch (error) {
    console.error('Failed to increment play count:', error);
    return NextResponse.json({ error: 'Failed to increment play count' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
