import { db } from '@/lib/db';
import { gameStats, playCounters } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { getRedisClient } from '@/lib/redis';
import { CounterCacheKeys, CacheTTL } from '@/lib/utils/cache-keys';
import { GameStatsService } from './stats.service';
import { isValidId } from '@/lib/utils/validation';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export class CounterService {
  static async increment(gameId: number, delta = 1) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');
    const redis = getRedisClient();

    // Persist first so Redis remains an optional cache rather than the source of truth.
    const totalCount = await GameStatsService.incrementPlayCount(gameId, delta);
    let dailyCount: number | null = null;

    try {
      const [daily] = await db
        .insert(playCounters)
        .values({ gameId, date: todayKey(), count: delta })
        .onConflictDoUpdate({
          target: [playCounters.gameId, playCounters.date],
          set: {
            count: sql`${playCounters.count} + ${delta}`,
            updatedAt: new Date(),
          },
        })
        .returning({ count: playCounters.count });
      dailyCount = Number(daily?.count ?? 0);
    } catch (error) {
      // The aggregate count is already durable. A failed daily bucket must not make
      // clients retry and double-count the aggregate.
      console.warn('Daily play count update failed; aggregate count was preserved:', error);
    }

    if (redis) {
      const totalKey = CounterCacheKeys.total(gameId);
      const todayKeyCache = CounterCacheKeys.today(gameId);

      try {
        const writes: Promise<unknown>[] = [redis.set(totalKey, totalCount)];
        if (dailyCount !== null) {
          writes.push(redis.setex(todayKeyCache, CacheTTL.PLAY_COUNT, dailyCount));
        }
        await Promise.all(writes);
      } catch (error) {
        // Redis is an optional cache. Database persistence must still proceed.
        console.warn('Play count cache update failed; continuing with database persistence:', error);
      }
    }

  }

  static async getCounts(gameId: number) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');
    const redis = getRedisClient();

    if (redis) {
      const totalKey = CounterCacheKeys.total(gameId);
      const todayKeyCache = CounterCacheKeys.today(gameId);

      try {
        const [total, today] = await Promise.all([
          redis.get<number>(totalKey),
          redis.get<number>(todayKeyCache),
        ]);

        if (total !== null && today !== null) {
          return {
            total: Number(total ?? 0),
            today: Number(today ?? 0),
          };
        }
      } catch (error) {
        // Fall through to the database if the cache is unavailable.
        console.warn('Play count cache read failed; falling back to database:', error);
      }
    }

    const date = todayKey();

    const [stats] = await db
      .select({ totalPlays: gameStats.playCount })
      .from(gameStats)
      .where(eq(gameStats.gameId, gameId))
      .limit(1);

    const [{ todayPlays }] = await db
      .select({ todayPlays: sql<number>`COALESCE(SUM(${playCounters.count}), 0)` })
      .from(playCounters)
      .where(and(eq(playCounters.gameId, gameId), eq(playCounters.date, date)));

    return {
      total: Number(stats?.totalPlays ?? 0),
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
