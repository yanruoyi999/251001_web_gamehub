import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const dbSelectMock = vi.fn();
const getJsonMock = vi.fn();
const setJsonMock = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    select: dbSelectMock,
  },
}));

vi.mock('@/lib/meilisearch', () => ({
  getMeilisearchClient: vi.fn(() => null),
}));

vi.mock('@/lib/redis', () => ({
  getRedisClient: () => ({}),
}));

vi.mock('@/lib/utils/redis-helper', () => ({
  getJson: getJsonMock,
  setJson: setJsonMock,
}));

vi.mock('@/lib/games/fallback-search', () => ({
  searchFallbackGames: vi.fn(({ query, page, limit }) => ({
    games: [{ id: 1, title: 'Google Snake', slug: 'google-snake' }],
    total: 1,
    page,
    limit,
    source: 'fallback',
    query,
  })),
}));

let SearchService: typeof import('@/services/search.service').SearchService;

beforeAll(async () => {
  SearchService = (await import('@/services/search.service')).SearchService;
});

describe('SearchService.searchGames', () => {
  beforeEach(() => {
    process.env.SEARCH_BACKEND_TIMEOUT_MS = '5';
    getJsonMock.mockReset();
    setJsonMock.mockReset();
    dbSelectMock.mockReset();
    getJsonMock.mockResolvedValue(null);
    setJsonMock.mockResolvedValue(undefined);
  });

  it('returns local fallback quickly when database search hangs', async () => {
    const hangingQuery = {
      from: vi.fn(() => ({
        leftJoin: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => ({
              limit: vi.fn(() => ({
                offset: vi.fn(() => new Promise(() => {})),
              })),
            })),
          })),
        })),
      })),
    };

    dbSelectMock.mockReturnValue(hangingQuery);

    const result = await SearchService.searchGames({ query: 'snake', limit: 3 });

    expect(result.source).toBe('fallback');
    expect(result.total).toBe(1);
    expect(result.games[0].slug).toBe('google-snake');
    expect(setJsonMock).toHaveBeenCalled();
  });
});
