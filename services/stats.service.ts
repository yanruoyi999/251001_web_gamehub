import { db } from '@/lib/db';
import { gameStats, ratings } from '@/db/schema';
import { eq, sql, desc, and } from 'drizzle-orm';
import { isValidId } from '@/lib/utils/validation';

export type GameStatsRecord = typeof gameStats.$inferSelect;

export class GameStatsService {
  static async ensureStatsRow(gameId: number) {
    await db.insert(gameStats).values({ gameId }).onConflictDoNothing();
  }

  static async incrementPlayCount(gameId: number, count = 1) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    await this.ensureStatsRow(gameId);

    await db
      .update(gameStats)
      .set({
        playCount: sql`${gameStats.playCount} + ${count}`,
        lastPlayedAt: new Date(),
      })
      .where(eq(gameStats.gameId, gameId));
  }

  static async updateRatingStats(gameId: number): Promise<GameStatsRecord | null> {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    const aggregates = await db
      .select({
        averageRating: sql<number>`COALESCE(AVG(${ratings.rating}), 0)` ,
        ratingCount: sql<number>`COUNT(*)`,
      })
      .from(ratings)
      .where(and(eq(ratings.gameId, gameId), eq(ratings.status, 'approved')));

    const { averageRating, ratingCount } = aggregates[0];
    const averageValue = Number(averageRating ?? 0);
    const ratingTotal = Number(ratingCount ?? 0);

    await this.ensureStatsRow(gameId);

    const [updated] = await db
      .update(gameStats)
      .set({
        averageRating: averageValue.toFixed(2),
        ratingCount: ratingTotal,
        lastRatedAt: new Date(),
      })
      .where(eq(gameStats.gameId, gameId))
      .returning();

    return updated ?? null;
  }

  static async getTopGames(limit = 10) {
    const rows = await db
      .select({
        gameId: gameStats.gameId,
        playCount: gameStats.playCount,
        averageRating: gameStats.averageRating,
      })
      .from(gameStats)
      .orderBy(desc(gameStats.playCount))
      .limit(limit);

    return rows;
  }
}
