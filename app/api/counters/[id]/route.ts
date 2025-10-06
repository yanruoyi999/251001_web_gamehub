import { NextRequest, NextResponse } from 'next/server';
import { CounterService } from '@/services';

function parseId(value: string): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = parseId(params.id);
  if (!gameId) {
    return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
  }

  try {
    const counts = await CounterService.getCounts(gameId);
    return NextResponse.json(counts);
  } catch (error) {
    console.error('Failed to fetch play counts:', error);
    return NextResponse.json({ error: 'Failed to fetch play counts' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
