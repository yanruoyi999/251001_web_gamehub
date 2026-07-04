import { NextRequest, NextResponse } from 'next/server';
import { searchFallbackGames } from '@/lib/games/fallback-search';
import { sanitizeSearchQuery, validatePagination } from '@/lib/utils/validation';
import { SearchService } from '@/services';

function parseIntegerParam(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = sanitizeSearchQuery(searchParams.get('q') ?? searchParams.get('query') ?? '');

  if (!query) {
    return NextResponse.json({ error: 'q (query) is required' }, { status: 400 });
  }

  const { page, limit } = validatePagination(
    parseIntegerParam(searchParams.get('page')),
    parseIntegerParam(searchParams.get('limit')),
  );

  try {
    const result = await SearchService.searchGames({
      query,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search failed:', error);
    const fallback = searchFallbackGames({ query, page, limit });

    return NextResponse.json({
      ...fallback,
      degraded: true,
    });
  }
}

export const dynamic = 'force-dynamic';
