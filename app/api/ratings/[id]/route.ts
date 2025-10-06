import { NextRequest, NextResponse } from 'next/server';
import { RatingService } from '@/services';

function parseId(value: string): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ratingId = parseId(params.id);
  if (!ratingId) {
    return NextResponse.json({ error: 'Invalid rating ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    if (typeof body?.approve !== 'boolean') {
      return NextResponse.json({ error: 'approve boolean is required' }, { status: 400 });
    }

    const updated = await RatingService.approveRating(ratingId, body.approve);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update rating status:', error);
    return NextResponse.json(
      { error: (error as Error).message ?? 'Failed to update rating status' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
