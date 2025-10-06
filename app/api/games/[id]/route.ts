import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';

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
    const game = await GameService.getGameById(gameId, true);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (error) {
    console.error('Failed to fetch game:', error);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gameId = parseId(params.id);
  if (!gameId) {
    return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await GameService.updateGame(gameId, body ?? {});
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update game:', error);
    return NextResponse.json(
      { error: (error as Error).message ?? 'Failed to update game' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    return NextResponse.json(
      { error: (error as Error).message ?? 'Failed to delete game' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
