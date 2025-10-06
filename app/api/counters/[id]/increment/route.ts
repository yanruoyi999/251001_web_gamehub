import { NextRequest, NextResponse } from 'next/server';
import { CounterService } from '@/services';

function parseId(value: string): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
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
    const body = await request.json().catch(() => ({}));
    const delta = body?.delta ? Number(body.delta) : 1;

    await CounterService.increment(gameId, Number.isFinite(delta) ? delta : 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to increment play count:', error);
    return NextResponse.json({ error: 'Failed to increment play count' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
