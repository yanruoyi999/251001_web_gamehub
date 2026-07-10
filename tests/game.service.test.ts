import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const findFirstMock = vi.fn();
const selectLimitMock = vi.fn();
const selectWhereMock = vi.fn(() => ({ limit: selectLimitMock }));
const selectFromMock = vi.fn(() => ({ where: selectWhereMock }));
const selectMock = vi.fn(() => ({ from: selectFromMock }));
const updateReturningMock = vi.fn();
const updateWhereMock = vi.fn(() => ({ returning: updateReturningMock }));
const updateSetMock = vi.fn(() => ({ where: updateWhereMock }));
const updateMock = vi.fn(() => ({ set: updateSetMock }));

vi.mock('@/lib/db', () => ({
  db: {
    select: selectMock,
    update: updateMock,
    query: {
      games: {
        findFirst: findFirstMock,
      },
    },
  },
}));

const getJsonMock = vi.fn();
const setJsonMock = vi.fn();
const delKeyMock = vi.fn();

vi.mock('@/lib/utils/redis-helper', () => ({
  getJson: getJsonMock,
  setJson: setJsonMock,
  delKey: delKeyMock,
}));

vi.mock('@/lib/redis', () => ({
  getRedisClient: () => ({}),
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
    delKeyMock.mockReset();
    selectLimitMock.mockReset();
    selectWhereMock.mockClear();
    selectFromMock.mockClear();
    selectMock.mockClear();
    updateReturningMock.mockReset();
    updateWhereMock.mockClear();
    updateSetMock.mockClear();
    updateMock.mockClear();
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

describe('GameService.updateGame', () => {
  beforeEach(() => {
    selectLimitMock.mockReset();
    selectWhereMock.mockClear();
    selectFromMock.mockClear();
    selectMock.mockClear();
    updateReturningMock.mockReset();
    updateWhereMock.mockClear();
    updateSetMock.mockClear();
    updateMock.mockClear();
    delKeyMock.mockReset();
    delKeyMock.mockResolvedValue(undefined);
  });

  it('updates only scalar columns and invalidates the detail and slug caches', async () => {
    selectLimitMock.mockResolvedValueOnce([{ id: 2, slug: 'old-slug' }]);
    updateReturningMock.mockResolvedValueOnce([
      { id: 2, slug: 'old-slug', title: 'Updated title' },
    ]);

    const result = await GameService.updateGame(2, { title: '  Updated title  ' });

    expect(updateSetMock).toHaveBeenCalledWith({
      title: 'Updated title',
      updatedAt: expect.any(Date),
    });
    expect(delKeyMock).toHaveBeenCalledWith(expect.any(Object), GameCacheKeys.byId(2));
    expect(delKeyMock).toHaveBeenCalledWith(
      expect.any(Object),
      GameCacheKeys.bySlug('old-slug'),
    );
    expect(result.title).toBe('Updated title');
  });
});
