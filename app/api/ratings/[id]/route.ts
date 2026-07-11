import { NextRequest, NextResponse } from 'next/server';
import { RatingService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';
import { isLocalCatalogueMode } from '@/lib/games/catalog-mode';

function parseId(value: string): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (isLocalCatalogueMode()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const ratingId = parseId(id);
  if (!ratingId) {
    return NextResponse.json({ error: 'Invalid rating ID' }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    if (typeof body?.approve !== 'boolean') {
      return NextResponse.json({ error: 'approve boolean is required' }, { status: 400 });
    }

    const updated = await RatingService.approveRating(ratingId, body.approve);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update rating status:', error);
    return NextResponse.json({ error: 'Failed to update rating status' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
