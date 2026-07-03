import { db } from '@/lib/db';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';
import { games, gameStats } from '@/db/schema';
import { getMeilisearchClient } from '@/lib/meilisearch';
import { redis } from '@/lib/redis';
import { SearchCacheKeys, CacheTTL } from '@/lib/utils/cache-keys';
import { sanitizeSearchQuery, validatePagination } from '@/lib/utils/validation';
import { ilike, or, eq, desc, sql, and } from 'drizzle-orm';
import { getJson, setJson } from '@/lib/utils/redis-helper';
import { searchFallbackGames } from '@/lib/games/fallback-search';

export interface SearchOptions {
  query: string;
  page?: number;
  limit?: number;
}

const DEFAULT_SEARCH_BACKEND_TIMEOUT_MS = 2500;

function searchBackendTimeoutMs() {
  const parsed = Number(process.env.SEARCH_BACKEND_TIMEOUT_MS);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_SEARCH_BACKEND_TIMEOUT_MS;
}

function withSearchTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${searchBackendTimeoutMs()}ms`));
    }, searchBackendTimeoutMs());
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export class SearchService {
  static async searchGames(options: SearchOptions) {
    const query = sanitizeSearchQuery(options.query);
    if (!query) {
      return { games: [], total: 0, page: 1, limit: options.limit ?? 20, source: 'empty' };
    }

    const { page, limit, offset } = validatePagination(options.page, options.limit);
    const cacheKey = SearchCacheKeys.results(query, { page, limit });

    const cached = await getJson<{ games: any[]; total: number; page: number; limit: number; source: string }>(
      redis,
      cacheKey
    );

    if (cached) {
      return cached;
    }

    const meilisearch = getMeilisearchClient();

    if (meilisearch) {
      try {
        const index = meilisearch.index('games');
        const result = await withSearchTimeout(
          index.search(query, {
            limit,
            offset,
            filter: ['status = "active"'],
          }),
          'Meilisearch lookup',
        );

        const normalizedHits = result.hits
          .map((hit) => {
            const rawId = hit.id ?? hit.gameId ?? hit.objectID;
            const id = Number(rawId);
            if (!Number.isInteger(id)) {
              return null;
            }

            return {
              id,
              title: hit.title,
              titleEn: hit.titleEn ?? hit.title_en,
              slug: hit.slug,
              status: hit.status,
              thumbnailUrl: hit.thumbnailUrl,
              isNew: hit.isNew,
              isHot: hit.isHot,
              playCount: hit.playCount,
              averageRating: hit.averageRating,
              publishedAt: hit.publishedAt,
            };
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item));

        const payload = {
          games: normalizedHits,
          total: result.estimatedTotalHits ?? 0,
          page,
          limit,
          source: 'meilisearch' as const,
        };

        await setJson(redis, cacheKey, payload, CacheTTL.SEARCH_RESULTS);
        return payload;
      } catch (error) {
        console.warn('Meilisearch lookup failed, falling back to database:', error);
      }
    }

    const databaseConnection = getDatabaseConnectionMetadata();
    if (
      process.env.SEARCH_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS !== 'true' &&
      shouldSkipSupabaseDirectInServerless(databaseConnection)
    ) {
      console.warn('Skipping database search because Supabase direct URL is configured in serverless runtime');
      const fallback = searchFallbackGames({ query, page, limit });
      await setJson(redis, cacheKey, fallback, CacheTTL.SEARCH_RESULTS);
      return fallback;
    }

    try {
      const fallback = await withSearchTimeout(
        this.searchWithDatabase(query, { page, limit, offset }),
        'Database search',
      );
      await setJson(redis, cacheKey, fallback, CacheTTL.SEARCH_RESULTS);
      return fallback;
    } catch (error) {
      console.warn('Database search failed, using local fallback:', error);
      const fallback = searchFallbackGames({ query, page, limit });
      await setJson(redis, cacheKey, fallback, CacheTTL.SEARCH_RESULTS);
      return fallback;
    }
  }

  private static async searchWithDatabase(
    query: string,
    options: { page: number; limit: number; offset: number }
  ) {
    const pattern = `%${query}%`;

    const whereClause = or(
      ilike(games.title, pattern),
      ilike(games.titleEn, pattern),
      ilike(games.description, pattern),
      ilike(games.descriptionEn, pattern)
    );

    const results = await db
      .select({
        id: games.id,
        title: games.title,
        titleEn: games.titleEn,
        slug: games.slug,
        status: games.status,
        thumbnailUrl: games.thumbnailUrl,
        isNew: games.isNew,
        isHot: games.isHot,
        playCount: gameStats.playCount,
        averageRating: gameStats.averageRating,
      })
      .from(games)
      .leftJoin(gameStats, eq(games.id, gameStats.gameId))
      .where(and(eq(games.status, 'active'), whereClause))
      .orderBy(desc(gameStats.playCount))
      .limit(options.limit)
      .offset(options.offset);

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(games)
      .where(and(eq(games.status, 'active'), whereClause));

    return {
      games: results,
      total: Number(count || 0),
      page: options.page,
      limit: options.limit,
      source: 'database' as const,
    };
  }
}
