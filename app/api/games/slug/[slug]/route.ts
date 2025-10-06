import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/services';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const game = await GameService.getGameBySlug(params.slug, true);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (error) {
    console.error('Failed to fetch game by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
