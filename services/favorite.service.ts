import { db } from '@/lib/db';
import { favorites, games } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

import { hashIp, generateAnonymousToken } from '@/lib/utils/hash';
import { isValidId } from '@/lib/utils/validation';

interface HeaderLike {
  get(name: string): string | null | undefined;
}

export interface FavoriteContext {
  userIpHash: string;
  anonymousToken: string;
}

export class FavoriteService {
  static getContextFromHeaders(headers: HeaderLike, ipOverride?: string | null): FavoriteContext {
    const clientIp = ipOverride && ipOverride.trim().length > 0
      ? ipOverride.trim()
      : this.extractClientIp(headers);
    const userAgent = headers.get('user-agent') ?? '';
    const acceptLanguage = headers.get('accept-language') ?? '';

    const userIpHash = hashIp(clientIp);
    const anonymousToken = generateAnonymousToken(userAgent, acceptLanguage);

    return { userIpHash, anonymousToken };
  }

  static async listFavoriteIds(context: FavoriteContext): Promise<number[]> {
    const rows = await db
      .select({ gameId: favorites.gameId })
      .from(favorites)
      .where(
        and(
          eq(favorites.userIpHash, context.userIpHash),
          eq(favorites.anonymousToken, context.anonymousToken)
        )
      );

    return rows.map((row) => row.gameId);
  }

  static async isFavorite(gameId: number, context: FavoriteContext): Promise<boolean> {
    if (!isValidId(gameId)) return false;

    const [record] = await db
      .select({ id: favorites.id })
      .from(favorites)
      .where(
        and(
          eq(favorites.gameId, gameId),
          eq(favorites.userIpHash, context.userIpHash),
          eq(favorites.anonymousToken, context.anonymousToken)
        )
      )
      .limit(1);

    return Boolean(record);
  }

  static async addFavorite(gameId: number, context: FavoriteContext): Promise<void> {
    await this.ensureGameIsActive(gameId);

    await db
      .insert(favorites)
      .values({
        gameId,
        userIpHash: context.userIpHash,
        anonymousToken: context.anonymousToken,
      })
      .onConflictDoNothing();
  }

  static async removeFavorite(gameId: number, context: FavoriteContext): Promise<void> {
    if (!isValidId(gameId)) return;

    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.gameId, gameId),
          eq(favorites.userIpHash, context.userIpHash),
          eq(favorites.anonymousToken, context.anonymousToken)
        )
      );
  }

  static async toggleFavorite(gameId: number, context: FavoriteContext): Promise<boolean> {
    const alreadyFavorite = await this.isFavorite(gameId, context);

    if (alreadyFavorite) {
      await this.removeFavorite(gameId, context);
      return false;
    }

    await this.addFavorite(gameId, context);
    return true;
  }

  private static async ensureGameIsActive(gameId: number): Promise<void> {
    if (!isValidId(gameId)) {
      throw new Error('Invalid game ID');
    }

    const [record] = await db
      .select({ id: games.id, status: games.status })
      .from(games)
      .where(eq(games.id, gameId))
      .limit(1);

    if (!record || record.status !== 'active') {
      throw new Error('Game not available');
    }
  }

  private static extractClientIp(headers: HeaderLike): string {
    const xForwardedFor = headers.get('x-forwarded-for');
    if (xForwardedFor) {
      const forwardedIp = xForwardedFor.split(',')[0]?.trim();
      if (forwardedIp) return forwardedIp;
    }

    const realIp = headers.get('x-real-ip');
    if (realIp && realIp.trim().length > 0) {
      return realIp.trim();
    }

    return '0.0.0.0';
  }
}
