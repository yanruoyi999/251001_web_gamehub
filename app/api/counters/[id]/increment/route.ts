import { NextRequest, NextResponse } from 'next/server';
import { CounterService } from '@/services';
import { redis } from '@/lib/redis';
import { hashIp } from '@/lib/utils/hash';

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

async function getPlayIncrementLimitStatus(
  request: NextRequest,
  gameId: number
): Promise<'allowed' | 'limited' | 'unavailable'> {
  if (!redis || typeof redis.incr !== 'function' || typeof redis.expire !== 'function') {
    return process.env.NODE_ENV === 'production' ? 'unavailable' : 'allowed';
  }

  const ipHash = hashIp(getClientIp(request));
  const key = `gamehub:counter:limit:${gameId}:${ipHash}`;
  let current: number;
  try {
    current = await redis.incr(key);
  } catch (error) {
    console.warn('Play count rate limit unavailable:', error);
    return process.env.NODE_ENV === 'production' ? 'unavailable' : 'allowed';
  }

  if (current === 1) {
    try {
      await redis.expire(key, 60);
    } catch (error) {
      console.warn('Failed to set play count rate limit expiry:', error);
    }
  }

  return current <= 30 ? 'allowed' : 'limited';
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    if (limitStatus === 'unavailable') {
      return NextResponse.json({ error: 'Play count rate limit unavailable' }, { status: 503 });
    }

    await CounterService.increment(gameId, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to increment play count:', error);
    return NextResponse.json({ error: 'Failed to increment play count' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
