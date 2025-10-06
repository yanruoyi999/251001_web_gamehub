import { db } from '@/lib/db';
import { ratings, games } from '@/db/schema';
import { eq, and, desc, sql, or } from 'drizzle-orm';
import { hashIp, generateAnonymousToken } from '@/lib/utils/hash';
import { RatingCacheKeys, CacheTTL } from '@/lib/utils/cache-keys';
import { getJson, setJson } from '@/lib/utils/redis-helper';
import { redis } from '@/lib/redis';
import { GameStatsService } from './stats.service';
import { isValidId, isValidRating, validatePagination } from '@/lib/utils/validation';

export interface SubmitRatingInput {
  gameId: number;
  rating: number;
  comment?: string;
  userIp: string;
  userAgent?: string;
  acceptLanguage?: string;
}

export class RatingService {
  static async submitRating(input: SubmitRatingInput) {
    if (!isValidId(input.gameId)) throw new Error('Invalid game ID');
    if (!isValidRating(input.rating)) throw new Error('Rating must be between 1 and 5');

    const [game] = await db
      .select({ id: games.id, status: games.status })
      .from(games)
      .where(eq(games.id, input.gameId))
      .limit(1);

    if (!game || game.status !== 'active') {
      throw new Error('Game not found');
    }

    const ipHash = hashIp(input.userIp);
    const anonymousToken = generateAnonymousToken(
      input.userAgent ?? '',
      input.acceptLanguage ?? ''
    );

    await this.checkRateLimit(ipHash);
    await this.ensureNotRatedRecently(input.gameId, ipHash, anonymousToken);

    const [created] = await db
      .insert(ratings)
      .values({
        gameId: input.gameId,
        rating: input.rating,
        comment: input.comment,
        userIpHash: ipHash,
        anonymousToken,
        status: 'pending',
      })
      .returning();

    await this.recordRatingAttempt(ipHash, input.gameId);
    await GameStatsService.updateRatingStats(input.gameId);

    return created;
  }

  static async listGameRatings(
    gameId: number,
    options: { page?: number; limit?: number; includePending?: boolean } = {}
  ) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    const { page, limit, offset } = validatePagination(options.page, options.limit);
    const filters = [eq(ratings.gameId, gameId)];

    if (!options.includePending) {
      filters.push(eq(ratings.status, 'approved'));
    }

    const ratingsRows = await db
      .select({
        id: ratings.id,
        rating: ratings.rating,
        comment: ratings.comment,
        status: ratings.status,
        createdAt: ratings.createdAt,
      })
      .from(ratings)
      .where(and(...filters))
      .orderBy(desc(ratings.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(ratings)
      .where(and(...filters));

    return {
      ratings: ratingsRows,
      total: Number(count || 0),
      page,
      limit,
      totalPages: Math.ceil(Number(count || 0) / limit),
    };
  }

  static async getRatingDistribution(gameId: number) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    const cached = await getJson<Record<string, number>>(redis, RatingCacheKeys.distribution(gameId));
    if (cached) return cached;

    const rows = await db
      .select({ rating: ratings.rating, count: sql<number>`COUNT(*)` })
      .from(ratings)
      .where(and(eq(ratings.gameId, gameId), eq(ratings.status, 'approved')))
      .groupBy(ratings.rating);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
    rows.forEach((row) => {
      const key = row.rating as 1 | 2 | 3 | 4 | 5;
      distribution[key] = Number(row.count);
    });

    await setJson(redis, RatingCacheKeys.distribution(gameId), distribution, CacheTTL.STATS);

    return distribution;
  }

  static async approveRating(ratingId: number, approve: boolean) {
    if (!isValidId(ratingId)) throw new Error('Invalid rating ID');

    const status = approve ? 'approved' : 'rejected';

    const [updated] = await db
      .update(ratings)
      .set({ status, updatedAt: new Date() })
      .where(eq(ratings.id, ratingId))
      .returning();

    if (!updated) {
      throw new Error('Rating not found');
    }

    await GameStatsService.updateRatingStats(updated.gameId);
    return updated;
  }

  static async getPendingRatings(options: { page?: number; limit?: number } = {}) {
    const { page, limit, offset } = validatePagination(options.page, options.limit);

    const rows = await db
      .select({
        id: ratings.id,
        gameId: ratings.gameId,
        rating: ratings.rating,
        comment: ratings.comment,
        createdAt: ratings.createdAt,
      })
      .from(ratings)
      .where(eq(ratings.status, 'pending'))
      .orderBy(desc(ratings.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(ratings)
      .where(eq(ratings.status, 'pending'));

    return {
      ratings: rows,
      total: Number(count || 0),
      page,
      limit,
      totalPages: Math.ceil(Number(count || 0) / limit),
    };
  }

  private static async checkRateLimit(ipHash: string) {
    if (!redis || typeof redis.incr !== 'function' || typeof redis.expire !== 'function') {
      return;
    }

    const key = RatingCacheKeys.rateLimit(ipHash);
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, CacheTTL.RATE_LIMIT);
    }

    if (current > 10) {
      throw new Error('Rating limit exceeded. Please try again later.');
    }
  }

  private static async ensureNotRatedRecently(gameId: number, ipHash: string, token: string) {
    if (redis && typeof redis.exists === 'function') {
      const key = RatingCacheKeys.userRating(gameId, ipHash);
      const exists = await redis.exists(key);
      if (exists) {
        throw new Error('You have already rated this game recently.');
      }
    }

    const oneDayAgo = new Date(Date.now() - CacheTTL.USER_RATING * 1000);
    const recent = await db
      .select({ id: ratings.id })
      .from(ratings)
      .where(
        and(
          eq(ratings.gameId, gameId),
          or(eq(ratings.userIpHash, ipHash), eq(ratings.anonymousToken, token)),
          sql`${ratings.createdAt} > ${oneDayAgo}`
        )
      )
      .limit(1);

    if (recent.length) {
      throw new Error('You have already rated this game recently.');
    }
  }

  private static async recordRatingAttempt(ipHash: string, gameId: number) {
    if (!redis || typeof redis.set !== 'function') return;

    const userKey = RatingCacheKeys.userRating(gameId, ipHash);

    try {
      await redis.set(userKey, '1', { ex: CacheTTL.USER_RATING, nx: true });
    } catch (error) {
      console.warn('Failed to persist rating attempt window', error);
    }
  }
}
