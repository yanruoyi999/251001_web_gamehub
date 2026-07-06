import { mockGames } from '@/lib/mock-games';
import { isGameUnderManualReview, shouldPromoteGameInCollections } from '@/lib/games/quality-policy';
import { sanitizeSearchQuery, validatePagination } from '@/lib/utils/validation';

export interface FallbackSearchOptions {
  query: string;
  page?: number;
  limit?: number;
}

type MockGame = (typeof mockGames)[number];

function mockPublishedAt(gameId: number) {
  return new Date(Date.UTC(2026, 0, 1) - gameId * 24 * 60 * 60 * 1000).toISOString();
}

function mockPlayCount(gameId: number, isHot: boolean) {
  return 1000 + gameId * 37 + (isHot ? 5000 : 0);
}

function mockAverageRating(gameId: number) {
  return Number((4.05 + (gameId % 8) * 0.08).toFixed(2));
}

function normalizeText(value: string | null | undefined) {
  return (value ?? '').toLowerCase();
}

function buildSearchCorpus(game: MockGame) {
  const title = normalizeText([game.title, game.titleEn].filter(Boolean).join(' '));
  const description = normalizeText([game.description, game.descriptionEn].filter(Boolean).join(' '));
  const taxonomy = normalizeText([
    ...game.categories.map((category) => `${category.name} ${category.nameEn}`),
    ...game.tags.map((tag) => `${tag.name} ${tag.nameEn}`),
  ].join(' '));
  const developer = normalizeText(game.developerName);

  return {
    title,
    description,
    taxonomy,
    developer,
    all: [title, description, taxonomy, developer].filter(Boolean).join(' '),
  };
}

function scoreGame(game: MockGame, normalizedQuery: string, tokens: string[]) {
  const corpus = buildSearchCorpus(game);

  if (!tokens.every((token) => corpus.all.includes(token))) {
    return 0;
  }

  let score = 0;

  if (corpus.title === normalizedQuery) score += 100;
  if (corpus.title.includes(normalizedQuery)) score += 60;
  if (corpus.taxonomy.includes(normalizedQuery)) score += 24;
  if (corpus.description.includes(normalizedQuery)) score += 12;
  if (corpus.developer.includes(normalizedQuery)) score += 8;

  for (const token of tokens) {
    if (corpus.title.includes(token)) score += 12;
    if (corpus.taxonomy.includes(token)) score += 7;
    if (corpus.description.includes(token)) score += 3;
    if (corpus.developer.includes(token)) score += 2;
  }

  if (shouldPromoteGameInCollections(game.slug) && game.featured) score += 4;
  if (shouldPromoteGameInCollections(game.slug) && game.isHot) score += 3;
  if (shouldPromoteGameInCollections(game.slug) && game.isNew) score += 1;

  return score;
}

export function searchFallbackGames({ query, page = 1, limit = 20 }: FallbackSearchOptions) {
  const normalizedQuery = sanitizeSearchQuery(query).toLowerCase();
  const tokens = normalizedQuery.split(' ').filter(Boolean);
  const { page: safePage, limit: safeLimit } = validatePagination(page, limit);

  if (!normalizedQuery || tokens.length === 0) {
    return { games: [], total: 0, page: safePage, limit: safeLimit, source: 'fallback' as const };
  }

  const rows = mockGames
    .filter((game) => !isGameUnderManualReview(game.slug))
    .map((game) => ({ game, score: scoreGame(game, normalizedQuery, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) =>
      b.score - a.score ||
      Number(b.game.isHot) - Number(a.game.isHot) ||
      Number(b.game.featured) - Number(a.game.featured) ||
      mockPlayCount(b.game.id, b.game.isHot) - mockPlayCount(a.game.id, a.game.isHot),
    )
    .map(({ game }) => ({
      id: game.id,
      title: game.title,
      titleEn: game.titleEn,
      slug: game.slug,
      status: 'active',
      thumbnailUrl: game.thumbnailUrl,
      isNew: shouldPromoteGameInCollections(game.slug) && game.isNew,
      isHot: shouldPromoteGameInCollections(game.slug) && game.isHot,
      playCount: mockPlayCount(game.id, shouldPromoteGameInCollections(game.slug) && game.isHot),
      averageRating: mockAverageRating(game.id),
      publishedAt: mockPublishedAt(game.id),
    }));

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
