import { NextRequest, NextResponse } from 'next/server';

import { RatingService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';
import { isLocalCatalogueMode } from '@/lib/games/catalog-mode';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (isLocalCatalogueMode()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const ratingId = Number(id);
  if (!Number.isInteger(ratingId) || ratingId <= 0) {
    return NextResponse.json({ error: 'Invalid rating id' }, { status: 400 });
  }

  try {
    const payload = await request.json().catch(() => ({}));
    const action = typeof payload?.action === 'string' ? payload.action : '';
    const approve = action === 'approve' ? true : action === 'reject' ? false : null;

    if (approve === null) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updated = await RatingService.approveRating(ratingId, approve);

    return NextResponse.json({ success: true, rating: updated });
  } catch (error) {
    console.error('Failed to update rating status:', error);
    return NextResponse.json({ error: 'Failed to update rating status' }, { status: 500 });
  }
}
