import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const findFirstMock = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      games: {
        findFirst: findFirstMock,
      },
    },
  },
}));

const getJsonMock = vi.fn();
const setJsonMock = vi.fn();

vi.mock('@/lib/utils/redis-helper', () => ({
  getJson: getJsonMock,
  setJson: setJsonMock,
  delKey: vi.fn(),
}));

vi.mock('@/lib/redis', () => ({
  redis: {},
}));

let GameService: typeof import('@/services/game.service').GameService;
let GameCacheKeys: typeof import('@/lib/utils/cache-keys').GameCacheKeys;

beforeAll(async () => {
  const gameModule = await import('@/services/game.service');
  GameService = gameModule.GameService;

  const cacheModule = await import('@/lib/utils/cache-keys');
  GameCacheKeys = cacheModule.GameCacheKeys;
});

describe('GameService.getGameById', () => {
  beforeEach(() => {
    findFirstMock.mockReset();
    getJsonMock.mockReset();
    setJsonMock.mockReset();
    setJsonMock.mockResolvedValue(undefined);
  });

  it('should throw on invalid id', async () => {
    await expect(GameService.getGameById(0)).rejects.toThrow('Invalid game ID');
    expect(getJsonMock).not.toHaveBeenCalled();
  });

  it('returns cached game when available', async () => {
    const cachedValue = { id: 1, title: 'Cached Game' };
    getJsonMock.mockResolvedValueOnce(cachedValue);

    const result = await GameService.getGameById(1);

    expect(result).toEqual(cachedValue);
    expect(findFirstMock).not.toHaveBeenCalled();
    expect(setJsonMock).not.toHaveBeenCalled();
  });

  it('fetches game from database and caches it when cache empty', async () => {
    getJsonMock.mockResolvedValueOnce(null);

    const dbRecord: any = {
      id: 2,
      slug: 'demo-game',
      title: 'Demo Game',
      gameStats: { id: 99, gameId: 2 },
      gameCategories: [{ category: { id: 10, name: 'Action' } }],
      gameTags: [{ tag: { id: 20, name: 'Tag' } }],
      screenshots: [{ id: 1, order: 1, url: 'https://example.com' }],
    };
    findFirstMock.mockResolvedValueOnce(dbRecord);

    const result = await GameService.getGameById(2);

    expect(result?.id).toBe(2);
    expect(result?.categories).toEqual([{ id: 10, name: 'Action' }]);
    expect(result?.tags).toEqual([{ id: 20, name: 'Tag' }]);
    expect(result?.screenshots).toEqual(dbRecord.screenshots);

    expect(setJsonMock).toHaveBeenCalledTimes(2);
    expect(setJsonMock).toHaveBeenCalledWith(expect.any(Object), GameCacheKeys.byId(2), result, expect.any(Number));
    expect(setJsonMock).toHaveBeenCalledWith(expect.any(Object), GameCacheKeys.bySlug('demo-game'), result, expect.any(Number));
  });
});
