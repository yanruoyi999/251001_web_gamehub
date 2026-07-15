import { mockGames } from '@/lib/mock-games';
import { shouldPromoteGameInCollections } from '@/lib/games/quality-policy';
import { sanitizeSearchQuery, validatePagination } from '@/lib/utils/validation';

export type FallbackGameSortBy = 'publishedAt' | 'playCount' | 'averageRating' | 'title';
export type FallbackGameSortOrder = 'asc' | 'desc';

export interface FallbackGameListOptions {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'pending' | 'all';
  categoryId?: number;
  tagId?: number;
  search?: string;
  sortBy?: FallbackGameSortBy;
  sortOrder?: FallbackGameSortOrder;
  featured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  onlyFavorites?: boolean;
  favoriteGameIds?: number[];
}

function normalizeText(value: string | null | undefined) {
  return (value ?? '').toLowerCase();
}

function buildSearchHaystack(game: (typeof mockGames)[number]) {
  return normalizeText([
    game.title,
    game.titleEn,
    game.description,
    game.descriptionEn,
    game.developerName,
    ...game.categories.map((category) => `${category.name} ${category.nameEn}`),
    ...game.tags.map((tag) => `${tag.name} ${tag.nameEn}`),
  ].filter(Boolean).join(' '));
}

export function listFallbackGames(options: FallbackGameListOptions = {}) {
  const { page, limit } = validatePagination(options.page, options.limit);
  const favoriteIds = Array.from(
    new Set((options.favoriteGameIds ?? []).filter((id) => Number.isInteger(id) && id > 0)),
  );
  const favoriteSet = new Set(favoriteIds);
  const normalizedQuery = sanitizeSearchQuery(options.search ?? '').toLowerCase();
  const searchTokens = normalizedQuery.split(' ').filter(Boolean);
  const sortBy = options.sortBy === 'title' ? 'title' : 'catalogue';
  const sortOrder = options.sortOrder ?? (sortBy === 'title' ? 'asc' : 'desc');
  const direction = sortOrder === 'asc' ? 1 : -1;

  if (options.status && options.status !== 'active' && options.status !== 'all') {
    return { games: [], total: 0, page, limit, totalPages: 0, source: 'fallback' as const };
  }

  if (options.onlyFavorites && favoriteSet.size === 0) {
    return { games: [], total: 0, page, limit, totalPages: 0, source: 'fallback' as const };
  }

  const rows = mockGames
    .filter((game) => {
      const promoted = shouldPromoteGameInCollections(game.slug);
      if (!promoted) return false;
      if (typeof options.featured === 'boolean' && promoted && game.featured !== options.featured) return false;
      if (typeof options.isNew === 'boolean' && promoted && game.isNew !== options.isNew) return false;
      if (typeof options.isHot === 'boolean' && promoted && game.isHot !== options.isHot) return false;
      if (options.onlyFavorites && !favoriteSet.has(game.id)) return false;
      if (options.categoryId && !game.categories.some((category) => category.id === options.categoryId)) return false;
      if (options.tagId && !game.tags.some((tag) => tag.id === options.tagId)) return false;

      if (searchTokens.length > 0) {
        const haystack = buildSearchHaystack(game);
        if (!searchTokens.every((token) => haystack.includes(token))) return false;
      }

      return true;
    })
    .map((game, index) => {
      const promoted = shouldPromoteGameInCollections(game.slug);
      return {
        id: game.id,
        title: game.title,
        titleEn: game.titleEn,
        slug: game.slug,
        status: 'active',
        thumbnailUrl: game.thumbnailUrl,
        featured: promoted && game.featured,
        isNew: promoted && game.isNew,
        isHot: promoted && game.isHot,
        isFavorite: favoriteSet.has(game.id),
        catalogueRank: index,
      };
    });

  rows.sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title) * direction;
    return (a.catalogueRank - b.catalogueRank) * direction;
  });

  const total = rows.length;
  const totalPages = Math.ceil(total / limit);
  const currentPage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const offset = (currentPage - 1) * limit;

  return {
    games: rows.slice(offset, offset + limit).map(({ catalogueRank, ...game }) => game),
    total,
    page: currentPage,
    limit,
    totalPages,
    source: 'fallback' as const,
  };
}
