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

export interface SearchGameItem {
  id: number;
  title: string;
  titleEn: string | null;
  slug: string;
  status: string | null;
  thumbnailUrl: string | null;
  isNew: boolean | null;
  isHot: boolean | null;
  playCount: number | null;
  averageRating: string | number | null;
  publishedAt: Date | string | null;
}

export interface SearchResult {
  games: SearchGameItem[];
  total: number;
  page: number;
  limit: number;
  source: 'empty' | 'meilisearch' | 'database' | 'fallback';
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

function toOptionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function toOptionalBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function toOptionalNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export class SearchService {
  static async searchGames(options: SearchOptions): Promise<SearchResult> {
    const query = sanitizeSearchQuery(options.query);
    if (!query) {
      const { limit } = validatePagination(1, options.limit);
      return { games: [], total: 0, page: 1, limit, source: 'empty' };
    }

    const { page, limit, offset } = validatePagination(options.page, options.limit);
    const cacheKey = SearchCacheKeys.results(query, { page, limit });

    const cached = await getJson<SearchResult>(redis, cacheKey);
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
          .map((hit): SearchGameItem | null => {
            const id = Number(hit.id ?? hit.gameId ?? hit.objectID);
            const title = toOptionalString(hit.title);
            const slug = toOptionalString(hit.slug);
            if (!Number.isInteger(id) || !title || !slug) {
              return null;
            }

            return {
              id,
              title,
              titleEn: toOptionalString(hit.titleEn ?? hit.title_en),
              slug,
              status: toOptionalString(hit.status) ?? 'active',
              thumbnailUrl: toOptionalString(hit.thumbnailUrl),
              isNew: toOptionalBoolean(hit.isNew),
              isHot: toOptionalBoolean(hit.isHot),
              playCount: toOptionalNumber(hit.playCount),
              averageRating:
                typeof hit.averageRating === 'string'
                  ? hit.averageRating
                  : toOptionalNumber(hit.averageRating),
              publishedAt: toOptionalString(hit.publishedAt),
            };
          })
          .filter((item): item is SearchGameItem => Boolean(item));

        const payload: SearchResult = {
          games: normalizedHits,
          total: result.estimatedTotalHits ?? 0,
          page,
          limit,
          source: 'meilisearch',
        };

        await setJson(redis, cacheKey, payload, CacheTTL.SEARCH_RESULTS);
        return payload;
      } catch (error) {
        console.warn('Meilisearch lookup failed, falling back to database:', error);
      }
    }

    const databaseConnection = getDatabaseConnectionMetadata();
    const databaseUnavailable = !databaseConnection.configured;
    const unsafeDirectConnection =
      process.env.SEARCH_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS !== 'true' &&
      shouldSkipSupabaseDirectInServerless(databaseConnection);

    if (databaseUnavailable || unsafeDirectConnection) {
      const reason = databaseUnavailable
        ? 'database is not configured'
        : 'Supabase direct URL is not safe in the serverless runtime';
      console.warn(`Skipping database search because ${reason}`);
      const fallback = searchFallbackGames({ query, page, limit });
      await setJson(redis, cacheKey, fallback, CacheTTL.SEARCH_RESULTS);
      return fallback;
    }

    try {
      const result = await withSearchTimeout(
        this.searchWithDatabase(query, { page, limit, offset }),
        'Database search',
      );
      await setJson(redis, cacheKey, result, CacheTTL.SEARCH_RESULTS);
      return result;
    } catch (error) {
      console.warn('Database search failed, using local fallback:', error);
      const fallback = searchFallbackGames({ query, page, limit });
      await setJson(redis, cacheKey, fallback, CacheTTL.SEARCH_RESULTS);
      return fallback;
    }
  }

  private static async searchWithDatabase(
    query: string,
    options: { page: number; limit: number; offset: number },
  ): Promise<SearchResult> {
    const pattern = `%${query}%`;

    const whereClause = or(
      ilike(games.title, pattern),
      ilike(games.titleEn, pattern),
      ilike(games.description, pattern),
      ilike(games.descriptionEn, pattern),
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
        publishedAt: games.publishedAt,
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
      source: 'database',
    };
  }
}
