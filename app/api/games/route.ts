import { NextRequest, NextResponse } from 'next/server';
import { FavoriteService, GameService } from '@/services';
import { isAdminRequestAuthenticated } from '@/lib/auth/admin';

function parseSortBy(value: string | null) {
  if (!value) return undefined;
  if (['publishedAt', 'playCount', 'averageRating', 'title'].includes(value)) {
    return value as 'publishedAt' | 'playCount' | 'averageRating' | 'title';
  }
  return undefined;
}

function parseSortOrder(value: string | null) {
  if (!value) return undefined;
  if (value === 'asc' || value === 'desc') return value;
  return undefined;
}

function parseStatus(value: string | null) {
  if (!value) return undefined;
  if (['active', 'inactive', 'pending'].includes(value)) {
    return value as 'active' | 'inactive' | 'pending';
  }
  return undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const categoryId = searchParams.get('categoryId');
    const tagId = searchParams.get('tagId');
    const status = parseStatus(searchParams.get('status'));
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('isNew');
    const isHot = searchParams.get('isHot');
    const favoritesOnly = searchParams.get('favoritesOnly') === 'true';

    const favoriteContext = FavoriteService.getContextFromHeaders(request.headers, request.ip ?? undefined);
    const favoriteIds = await FavoriteService.listFavoriteIds(favoriteContext);

    const result = await GameService.listGames({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status,
      categoryId: categoryId ? Number(categoryId) : undefined,
      tagId: tagId ? Number(tagId) : undefined,
      search: searchParams.get('search') ?? undefined,
      sortBy: parseSortBy(searchParams.get('sortBy')),
      sortOrder: parseSortOrder(searchParams.get('sortOrder')),
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      isNew: isNew === 'true' ? true : isNew === 'false' ? false : undefined,
      isHot: isHot === 'true' ? true : isHot === 'false' ? false : undefined,
      onlyFavorites: favoritesOnly,
      favoriteGameIds: favoriteIds,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to list games:', error);
    return NextResponse.json(
      { error: 'Failed to list games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body?.title || !body?.iframeUrl) {
      return NextResponse.json(
        { error: 'title and iframeUrl are required' },
        { status: 400 }
      );
    }

    const game = await GameService.createGame({
      title: body.title,
      titleEn: body.titleEn,
      description: body.description,
      descriptionEn: body.descriptionEn,
      instructions: body.instructions,
      instructionsEn: body.instructionsEn,
      thumbnailUrl: body.thumbnailUrl,
      iframeUrl: body.iframeUrl,
      slug: body.slug,
      isNew: body.isNew,
      isHot: body.isHot,
      status: body.status,
      developerName: body.developerName,
      developerUrl: body.developerUrl,
      sourceUrl: body.sourceUrl,
      categoryIds: body.categoryIds,
      tagIds: body.tagIds,
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Failed to create game:', error);
    return NextResponse.json(
      { error: (error as Error).message ?? 'Failed to create game' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
