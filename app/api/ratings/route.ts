import { NextRequest, NextResponse } from 'next/server';
import { RatingService } from '@/services';
import { MAX_RATING_COMMENT_LENGTH } from '@/services/rating.service';
import { getClientIp } from '@/lib/http/client-ip';
import { isValidId, isValidRating, validatePagination } from '@/lib/utils/validation';

function parseInteger(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = Number(searchParams.get('gameId'));

  if (!isValidId(gameId)) {
    return NextResponse.json({ error: 'A valid gameId is required' }, { status: 400 });
  }

  const { page, limit } = validatePagination(
    parseInteger(searchParams.get('page')),
    parseInteger(searchParams.get('limit')),
  );

  try {
    const result = await RatingService.listGameRatings(gameId, {
      page,
      limit,
      // Pending and rejected comments are available only through authenticated admin routes.
      includePending: false,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const payload = body as { gameId?: unknown; rating?: unknown; comment?: unknown };
  const gameId = Number(payload?.gameId);
  const rating = Number(payload?.rating);

  if (!isValidId(gameId) || !isValidRating(rating)) {
    return NextResponse.json(
      { error: 'A valid gameId and a rating between 1 and 5 are required' },
      { status: 400 },
    );
  }

  try {
    const result = await RatingService.submitRating({
      gameId,
      rating,
      comment:
        typeof payload.comment === 'string'
          ? payload.comment.trim().slice(0, MAX_RATING_COMMENT_LENGTH)
          : undefined,
      userIp: getClientIp(request),
      userAgent: request.headers.get('user-agent') ?? undefined,
      acceptLanguage: request.headers.get('accept-language') ?? undefined,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.warn('Rating submission rejected:', error);
    return NextResponse.json({ error: 'Unable to submit rating' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
