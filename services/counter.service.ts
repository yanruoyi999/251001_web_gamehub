import { db } from '@/lib/db';
import { playCounters, gameStats } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { redis } from '@/lib/redis';
import { CounterCacheKeys, CacheTTL } from '@/lib/utils/cache-keys';
import { GameStatsService } from './stats.service';
import { isValidId } from '@/lib/utils/validation';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export class CounterService {
  static async increment(gameId: number, delta = 1) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    if (redis) {
      const totalKey = CounterCacheKeys.total(gameId);
      const todayKeyCache = CounterCacheKeys.today(gameId);

      await redis.incrby(totalKey, delta);
      await redis.incrby(todayKeyCache, delta);
      await redis.expire(todayKeyCache, CacheTTL.PLAY_COUNT);
    }

    await GameStatsService.incrementPlayCount(gameId, delta);
  }

  static async getCounts(gameId: number) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    if (redis) {
      const totalKey = CounterCacheKeys.total(gameId);
      const todayKeyCache = CounterCacheKeys.today(gameId);
      const [total, today] = await Promise.all([
        redis.get<number>(totalKey),
        redis.get<number>(todayKeyCache),
      ]);

      if (total !== null || today !== null) {
        return {
          total: Number(total ?? 0),
          today: Number(today ?? 0),
        };
      }
    }

    const date = todayKey();

    const [{ totalPlays }] = await db
      .select({ totalPlays: sql<number>`COALESCE(SUM(${playCounters.count}), 0)` })
      .from(playCounters)
      .where(eq(playCounters.gameId, gameId));

    const [{ todayPlays }] = await db
      .select({ todayPlays: sql<number>`COALESCE(SUM(${playCounters.count}), 0)` })
      .from(playCounters)
      .where(and(eq(playCounters.gameId, gameId), eq(playCounters.date, date)));

    return {
      total: Number(totalPlays ?? 0),
      today: Number(todayPlays ?? 0),
    };
  }

  static async recordDailyCount(gameId: number, count: number) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    await db
      .insert(playCounters)
      .values({ gameId, date: todayKey(), count })
      .onConflictDoUpdate({
        target: [playCounters.gameId, playCounters.date],
        set: { count },
      });
  }
}
