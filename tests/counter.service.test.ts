import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const selectMock = vi.fn();
const onConflictDoUpdateMock = vi.fn();
const dailyReturningMock = vi.fn();
const insertValuesMock = vi.fn(() => ({
  onConflictDoUpdate: (...args: unknown[]) => {
    onConflictDoUpdateMock(...args);
    return { returning: dailyReturningMock };
  },
}));
const insertMock = vi.fn(() => ({ values: insertValuesMock }));

vi.mock('@/lib/db', () => ({
  db: {
    select: selectMock,
    insert: insertMock,
  },
}));

const redisGetMock = vi.fn();
const redisSetMock = vi.fn();
const redisSetexMock = vi.fn();

vi.mock('@/lib/redis', () => ({
  getRedisClient: () => ({
    get: redisGetMock,
    set: redisSetMock,
    setex: redisSetexMock,
  }),
}));

const incrementPlayCountMock = vi.fn();

vi.mock('@/services/stats.service', () => ({
  GameStatsService: {
    incrementPlayCount: incrementPlayCountMock,
  },
}));

let CounterService: typeof import('@/services/counter.service').CounterService;

beforeAll(async () => {
  ({ CounterService } = await import('@/services/counter.service'));
});

describe('CounterService', () => {
  beforeEach(() => {
    selectMock.mockReset();
    insertMock.mockClear();
    insertValuesMock.mockClear();
    onConflictDoUpdateMock.mockReset();
    dailyReturningMock.mockReset();
    redisGetMock.mockReset();
    redisSetMock.mockReset();
    redisSetexMock.mockReset();
    incrementPlayCountMock.mockReset();
  });

  it('falls back to canonical database counts when the Redis pair is incomplete', async () => {
    redisGetMock.mockResolvedValueOnce(99).mockResolvedValueOnce(null);

    const totalLimitMock = vi.fn(async () => [{ totalPlays: 42 }]);
    const totalWhereMock = vi.fn(() => ({ limit: totalLimitMock }));
    const totalFromMock = vi.fn(() => ({ where: totalWhereMock }));
    const todayWhereMock = vi.fn(async () => [{ todayPlays: 4 }]);
    const todayFromMock = vi.fn(() => ({ where: todayWhereMock }));

    selectMock
      .mockReturnValueOnce({ from: totalFromMock })
      .mockReturnValueOnce({ from: todayFromMock });

    await expect(CounterService.getCounts(7)).resolves.toEqual({
      total: 42,
      today: 4,
    });
  });

  it('persists aggregate and daily counts before updating the Redis cache', async () => {
    incrementPlayCountMock.mockResolvedValue(102);
    dailyReturningMock.mockResolvedValue([{ count: 6 }]);
    redisSetMock.mockResolvedValue('OK');
    redisSetexMock.mockResolvedValue('OK');

    await CounterService.increment(7, 2);

    expect(incrementPlayCountMock).toHaveBeenCalledWith(7, 2);
    expect(insertValuesMock).toHaveBeenCalledWith(
      expect.objectContaining({ gameId: 7, count: 2 })
    );
    expect(onConflictDoUpdateMock).toHaveBeenCalledTimes(1);
    expect(redisSetMock).toHaveBeenCalledWith(expect.any(String), 102);
    expect(redisSetexMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Number),
      6
    );
    expect(incrementPlayCountMock.mock.invocationCallOrder[0]).toBeLessThan(
      redisSetMock.mock.invocationCallOrder[0]
    );
  });
});
