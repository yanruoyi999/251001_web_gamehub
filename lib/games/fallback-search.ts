import { mockGames } from '@/lib/mock-games';

export interface FallbackSearchOptions {
  query: string;
  page?: number;
  limit?: number;
}

function mockPublishedAt(gameId: number) {
  return new Date(Date.UTC(2026, 0, 1) - gameId * 24 * 60 * 60 * 1000).toISOString();
}

function mockPlayCount(gameId: number, isHot: boolean) {
  return 1000 + gameId * 37 + (isHot ? 5000 : 0);
}

function mockAverageRating(gameId: number) {
  return Number((4.05 + (gameId % 8) * 0.08).toFixed(2));
}

export function searchFallbackGames({ query, page = 1, limit = 20 }: FallbackSearchOptions) {
  const normalizedQuery = query.trim().toLowerCase();
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 20;

  if (!normalizedQuery) {
    return { games: [], total: 0, page: safePage, limit: safeLimit, source: 'fallback' as const };
  }

  const rows = mockGames
    .filter((game) => {
      const haystack = [
        game.title,
        game.titleEn,
        game.description,
        game.descriptionEn,
        game.developerName,
        ...game.categories.map((category) => `${category.name} ${category.nameEn}`),
        ...game.tags.map((tag) => `${tag.name} ${tag.nameEn}`),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .map((game) => ({
      id: game.id,
      title: game.title,
      titleEn: game.titleEn,
      slug: game.slug,
      status: 'active',
      thumbnailUrl: game.thumbnailUrl,
      isNew: game.isNew,
      isHot: game.isHot,
      playCount: mockPlayCount(game.id, game.isHot),
      averageRating: mockAverageRating(game.id),
      publishedAt: mockPublishedAt(game.id),
    }));

  rows.sort((a, b) => Number(b.isHot) - Number(a.isHot) || b.playCount - a.playCount);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const currentPage = Math.min(safePage, totalPages);
  const offset = (currentPage - 1) * safeLimit;

  return {
    games: rows.slice(offset, offset + safeLimit),
    total,
    page: currentPage,
    limit: safeLimit,
    source: 'fallback' as const,
  };
}
