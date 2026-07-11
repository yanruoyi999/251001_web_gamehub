import { NextRequest, NextResponse } from 'next/server';
import { RatingService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';
import { isLocalCatalogueMode } from '@/lib/games/catalog-mode';

export async function GET(request: NextRequest) {
  if (isLocalCatalogueMode()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    const result = await RatingService.getPendingRatings({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch pending ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch pending ratings' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
