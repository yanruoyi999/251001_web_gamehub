import { NextRequest, NextResponse } from 'next/server';
import { searchFallbackGames } from '@/lib/games/fallback-search';
import { SearchService } from '@/services';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'q (query) is required' }, { status: 400 });
  }

  try {
    const result = await SearchService.searchGames({
      query,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search failed:', error);
    const fallback = searchFallbackGames({
      query,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    });

    return NextResponse.json({
      ...fallback,
      degraded: true,
    });
  }
}

export const dynamic = 'force-dynamic';
