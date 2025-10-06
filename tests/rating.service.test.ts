import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const distributionRowsHolder: { rows: Array<{ rating: number; count: number }> } = { rows: [] };

const createSelectChain = () => ({
  from: vi.fn(() => ({
    where: vi.fn(() => ({
      groupBy: vi.fn(async () => distributionRowsHolder.rows),
    })),
  })),
});

const selectMock = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    select: selectMock,
  },
}));

const getJsonMock = vi.fn();
const setJsonMock = vi.fn();

vi.mock('@/lib/utils/redis-helper', () => ({
  getJson: getJsonMock,
  setJson: setJsonMock,
}));

vi.mock('@/lib/redis', () => ({
  redis: {},
}));

vi.mock('@/services/stats.service', () => ({
  GameStatsService: {
    updateRatingStats: vi.fn(),
  },
}));

let RatingService: typeof import('@/services/rating.service').RatingService;
let RatingCacheKeys: typeof import('@/lib/utils/cache-keys').RatingCacheKeys;

beforeAll(async () => {
  const ratingModule = await import('@/services/rating.service');
  RatingService = ratingModule.RatingService;

  const cacheModule = await import('@/lib/utils/cache-keys');
  RatingCacheKeys = cacheModule.RatingCacheKeys;
});

describe('RatingService.getRatingDistribution', () => {
  beforeEach(() => {
    getJsonMock.mockReset();
    setJsonMock.mockReset();
    setJsonMock.mockResolvedValue(undefined);
    selectMock.mockReset();
    distributionRowsHolder.rows = [];

    selectMock.mockImplementation(() => createSelectChain());
  });

  it('returns cached distribution when available', async () => {
    const cached = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
    getJsonMock.mockResolvedValueOnce(cached);

    const result = await RatingService.getRatingDistribution(1);

    expect(result).toEqual(cached);
    expect(selectMock).not.toHaveBeenCalled();
    expect(setJsonMock).not.toHaveBeenCalled();
  });

  it('fetches from database and caches result when cache misses', async () => {
    getJsonMock.mockResolvedValueOnce(null);
    distributionRowsHolder.rows = [
      { rating: 5, count: 3 },
      { rating: 4, count: 1 },
    ];

    const result = await RatingService.getRatingDistribution(2);

    expect(result).toEqual({ 1: 0, 2: 0, 3: 0, 4: 1, 5: 3 });
    expect(setJsonMock).toHaveBeenCalledWith(
      expect.any(Object),
      RatingCacheKeys.distribution(2),
      result,
      expect.any(Number)
    );
  });
});

describe('RatingService.submitRating validation', () => {
  beforeEach(() => {
    getJsonMock.mockReset();
    setJsonMock.mockReset();
  });

  it('throws when game id invalid', async () => {
    await expect(
      RatingService.submitRating({
        gameId: 0,
        rating: 5,
        comment: 'Great',
        userIp: '1.1.1.1',
      })
    ).rejects.toThrow('Invalid game ID');
  });

  it('throws when rating invalid', async () => {
    await expect(
      RatingService.submitRating({
        gameId: 1,
        rating: 10,
        comment: 'Too high',
        userIp: '1.1.1.1',
      })
    ).rejects.toThrow('Rating must be between 1 and 5');
  });
});
