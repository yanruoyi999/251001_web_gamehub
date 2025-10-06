import { NextRequest, NextResponse } from 'next/server';
import { RatingService } from '@/services';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameIdParam = searchParams.get('gameId');

    if (!gameIdParam) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }

    const result = await RatingService.listGameRatings(Number(gameIdParam), {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
      includePending: searchParams.get('includePending') === 'true',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.gameId || !body?.rating) {
      return NextResponse.json({ error: 'gameId and rating are required' }, { status: 400 });
    }

    const result = await RatingService.submitRating({
      gameId: Number(body.gameId),
      rating: Number(body.rating),
      comment: body.comment,
      userIp: getClientIp(request),
      userAgent: request.headers.get('user-agent') ?? undefined,
      acceptLanguage: request.headers.get('accept-language') ?? undefined,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Failed to submit rating:', error);
    return NextResponse.json(
      { error: (error as Error).message ?? 'Failed to submit rating' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
