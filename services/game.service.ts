import { db } from '@/lib/db';
import {
  games,
  gameStats,
  gameCategories,
  gameTags,
  categories,
  tags,
  screenshots,
} from '@/db/schema';
import { eq, and, sql, inArray, ilike } from 'drizzle-orm';
import { ensureUniqueSlug, generateSlug, isValidSlug } from '@/lib/utils/slug';
import { GameCacheKeys, CacheTTL } from '@/lib/utils/cache-keys';
import { getJson, setJson, delKey } from '@/lib/utils/redis-helper';
import { redis } from '@/lib/redis';
import { isValidId, validatePagination, isValidUrl } from '@/lib/utils/validation';

export type GameRecord = typeof games.$inferSelect;
export type GameStatsRecord = typeof gameStats.$inferSelect;
export type CategoryRecord = typeof categories.$inferSelect;
export type TagRecord = typeof tags.$inferSelect;
export type ScreenshotRecord = typeof screenshots.$inferSelect;

export interface GameDetail extends GameRecord {
  stats: GameStatsRecord | null;
  categories: CategoryRecord[];
  tags: TagRecord[];
  screenshots: ScreenshotRecord[];
}

export interface ListGamesOptions {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'pending' | 'all';
  categoryId?: number;
  tagId?: number;
  search?: string;
  sortBy?: 'publishedAt' | 'playCount' | 'averageRating' | 'title';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  onlyFavorites?: boolean;
  favoriteGameIds?: number[];
}

export interface CreateGameInput {
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  instructions?: string;
  instructionsEn?: string;
  thumbnailUrl?: string;
  iframeUrl: string;
  slug?: string;
  isNew?: boolean;
  isHot?: boolean;
  status?: 'active' | 'inactive' | 'pending';
  categoryIds?: number[];
  tagIds?: number[];
}

export interface UpdateGameInput {
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  instructions?: string;
  instructionsEn?: string;
  thumbnailUrl?: string;
  iframeUrl?: string;
  slug?: string;
  isNew?: boolean;
  isHot?: boolean;
  status?: 'active' | 'inactive' | 'pending';
  categoryIds?: number[];
  tagIds?: number[];
}

export class GameService {
  /**
   * 获取游戏详情
   */
  static async getGameById(gameId: number, useCache = true): Promise<GameDetail | null> {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    if (useCache) {
      const cached = await getJson<GameDetail>(redis, GameCacheKeys.byId(gameId));
      if (cached) return cached;
    }

    const record = await db.query.games.findFirst({
      where: eq(games.id, gameId),
      with: {
        gameStats: true,
        gameCategories: {
          with: { category: true },
        },
        gameTags: {
          with: { tag: true },
        },
        screenshots: {
          orderBy: (fields, operators) => [operators.asc(fields.order)],
        },
      },
    });

    if (!record) return null;

    const detail: GameDetail = {
      ...record,
      stats: record.gameStats ?? null,
      categories: record.gameCategories.map((item) => item.category),
      tags: record.gameTags.map((item) => item.tag),
      screenshots: record.screenshots,
    };

    if (useCache) {
      await setJson(redis, GameCacheKeys.byId(gameId), detail, CacheTTL.GAME_DETAILS);
      await setJson(redis, GameCacheKeys.bySlug(record.slug), detail, CacheTTL.GAME_DETAILS);
    }

    return detail;
  }

  /**
   * 根据 slug 获取游戏详情
   */
  static async getGameBySlug(slug: string, useCache = true): Promise<GameDetail | null> {
    if (!isValidSlug(slug)) throw new Error('Invalid slug format');

    if (useCache) {
      const cached = await getJson<GameDetail>(redis, GameCacheKeys.bySlug(slug));
      if (cached) return cached;
    }

    const record = await db.query.games.findFirst({
      where: eq(games.slug, slug),
      with: {
        gameStats: true,
        gameCategories: { with: { category: true } },
        gameTags: { with: { tag: true } },
        screenshots: {
          orderBy: (fields, operators) => [operators.asc(fields.order)],
        },
      },
    });

    if (!record) return null;

    const detail: GameDetail = {
      ...record,
      stats: record.gameStats ?? null,
      categories: record.gameCategories.map((item) => item.category),
      tags: record.gameTags.map((item) => item.tag),
      screenshots: record.screenshots,
    };

    if (useCache) {
      await setJson(redis, GameCacheKeys.bySlug(slug), detail, CacheTTL.GAME_DETAILS);
      await setJson(redis, GameCacheKeys.byId(record.id), detail, CacheTTL.GAME_DETAILS);
    }

    return detail;
  }

  /**
   * 列表查询
   */
  static async listGames(options: ListGamesOptions = {}) {
    const { page, limit, offset } = validatePagination(options.page, options.limit);
    const status = options.status ?? 'active';

    const filters: any[] = [];

    if (status !== 'all') {
      filters.push(eq(games.status, status));
    }

    if (typeof options.featured === 'boolean') {
      filters.push(eq(games.featured, options.featured));
    }

    if (typeof options.isNew === 'boolean') {
      filters.push(eq(games.isNew, options.isNew));
    }

    if (typeof options.isHot === 'boolean') {
      filters.push(eq(games.isHot, options.isHot));
    }

    const favoriteIds = Array.from(
      new Set((options.favoriteGameIds ?? []).filter((id) => Number.isInteger(id) && id > 0))
    ) as number[];

    if (options.onlyFavorites) {
      if (favoriteIds.length === 0) {
        return { games: [], total: 0, page, limit, totalPages: 0 };
      }
      filters.push(inArray(games.id, favoriteIds));
    }

    if (options.search) {
      const keyword = options.search.trim();
      if (keyword) {
        const pattern = `%${keyword}%`;
        filters.push(
          or(
            ilike(games.title, pattern),
            ilike(games.titleEn, pattern),
            ilike(games.description, pattern),
            ilike(games.descriptionEn, pattern)
          )
        );
      }
    }

    let gameIdsFilter: number[] | null = null;

    if (options.categoryId) {
      const rows = await db
        .select({ gameId: gameCategories.gameId })
        .from(gameCategories)
        .where(eq(gameCategories.categoryId, options.categoryId));
      gameIdsFilter = rows.map((row) => row.gameId);
      if (gameIdsFilter.length === 0) {
        return { games: [], total: 0, page, limit, totalPages: 0 };
      }
      filters.push(inArray(games.id, gameIdsFilter));
    }

    if (options.tagId) {
      const rows = await db
        .select({ gameId: gameTags.gameId })
        .from(gameTags)
        .where(eq(gameTags.tagId, options.tagId));
      const ids = rows.map((row) => row.gameId);
      if (ids.length === 0) {
        return { games: [], total: 0, page, limit, totalPages: 0 };
      }
      filters.push(inArray(games.id, ids));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(games)
      .where(whereClause)
      .limit(1);

    const orderBy = options.sortBy ?? 'publishedAt';
    const orderDirection = options.sortOrder ?? 'desc';

    const rows = await db
      .select({
        id: games.id,
        title: games.title,
        titleEn: games.titleEn,
        slug: games.slug,
        status: games.status,
        thumbnailUrl: games.thumbnailUrl,
        featured: games.featured,
        isNew: games.isNew,
        isHot: games.isHot,
        publishedAt: games.publishedAt,
        playCount: gameStats.playCount,
        averageRating: gameStats.averageRating,
      })
      .from(games)
      .leftJoin(gameStats, eq(games.id, gameStats.gameId))
      .where(whereClause)
      .orderBy(buildOrderExpression(orderBy, orderDirection))
      .limit(limit)
      .offset(offset);

    const favoriteSet = new Set(favoriteIds);

    return {
      games: rows.map((row) => ({
        ...row,
        isFavorite: favoriteSet.has(row.id),
      })),
      total: Number(count || 0),
      page,
      limit,
      totalPages: Math.ceil(Number(count || 0) / limit),
    };
  }

  /**
   * 创建游戏
   */
  static async createGame(input: CreateGameInput): Promise<GameRecord> {
    if (!isValidUrl(input.iframeUrl)) {
      throw new Error('Invalid iframe URL');
    }

    const slugSource = input.slug ?? generateSlug(input.title);

    const existingSlugs = await db
      .select({ slug: games.slug })
      .from(games)
      .then((rows) => rows.map((row) => row.slug));

    const uniqueSlug = ensureUniqueSlug(slugSource, existingSlugs);

    const [created] = await db
      .insert(games)
      .values({
        title: input.title,
        titleEn: input.titleEn ?? input.title,
        description: input.description,
        descriptionEn: input.descriptionEn,
        instructions: input.instructions,
        instructionsEn: input.instructionsEn,
        thumbnailUrl: input.thumbnailUrl,
        iframeUrl: input.iframeUrl,
        slug: uniqueSlug,
        isNew: input.isNew ?? true,
        isHot: input.isHot ?? false,
        status: input.status ?? 'active',
      })
      .returning();

    await db.insert(gameStats).values({ gameId: created.id }).onConflictDoNothing();

    if (input.categoryIds?.length) {
      await this.setCategories(created.id, input.categoryIds);
    }

    if (input.tagIds?.length) {
      await this.setTags(created.id, input.tagIds);
    }

    await delKey(redis, GameCacheKeys.byId(created.id));
    await delKey(redis, GameCacheKeys.bySlug(created.slug));

    return created;
  }

  /**
   * 更新游戏
   */
  static async updateGame(gameId: number, updates: UpdateGameInput): Promise<GameRecord> {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    if (updates.slug && !isValidSlug(updates.slug)) {
      throw new Error('Invalid slug format');
    }

    if (updates.slug) {
      const existingSlugs = await db
        .select({ slug: games.slug })
        .from(games)
        .where(sql`${games.id} != ${gameId}`)
        .then((rows) => rows.map((row) => row.slug));
      if (existingSlugs.includes(updates.slug)) {
        throw new Error('Slug already exists');
      }
    }

    if (updates.iframeUrl && !isValidUrl(updates.iframeUrl)) {
      throw new Error('Invalid iframe URL');
    }

    const [updated] = await db
      .update(games)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(games.id, gameId))
      .returning();

    if (!updated) {
      throw new Error('Game not found');
    }

    if (updates.categoryIds) {
      await this.setCategories(gameId, updates.categoryIds);
    }

    if (updates.tagIds) {
      await this.setTags(gameId, updates.tagIds);
    }

    await delKey(redis, GameCacheKeys.byId(gameId));
    await delKey(redis, GameCacheKeys.bySlug(updated.slug));

    return updated;
  }

  /**
   * 软删除游戏
   */
  static async archiveGame(gameId: number): Promise<void> {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    await db
      .update(games)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(games.id, gameId));

    await delKey(redis, GameCacheKeys.byId(gameId));
  }

  /**
   * 设置分类
   */
  static async setCategories(gameId: number, categoryIds: number[]) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    await db.delete(gameCategories).where(eq(gameCategories.gameId, gameId));

    if (categoryIds.length) {
      await db
        .insert(gameCategories)
        .values(categoryIds.map((categoryId) => ({ gameId, categoryId })));
    }

    await delKey(redis, GameCacheKeys.byId(gameId));
  }

  /**
   * 设置标签
   */
  static async setTags(gameId: number, tagIds: number[]) {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    await db.delete(gameTags).where(eq(gameTags.gameId, gameId));

    if (tagIds.length) {
      await db.insert(gameTags).values(tagIds.map((tagId) => ({ gameId, tagId })));
    }

    await delKey(redis, GameCacheKeys.byId(gameId));
  }
}

function or(...conditions: any[]) {
  return sql`${sql.join(conditions, sql` OR `)}`;
}

function buildOrderExpression(
  sortBy: 'publishedAt' | 'playCount' | 'averageRating' | 'title',
  sortOrder: 'asc' | 'desc'
) {
  switch (sortBy) {
    case 'playCount':
      return sortOrder === 'asc'
        ? sql`${gameStats.playCount} ASC NULLS LAST`
        : sql`${gameStats.playCount} DESC NULLS LAST`;
    case 'averageRating':
      return sortOrder === 'asc'
        ? sql`${gameStats.averageRating} ASC NULLS LAST`
        : sql`${gameStats.averageRating} DESC NULLS LAST`;
    case 'title':
      return sortOrder === 'asc'
        ? sql`${games.title} ASC`
        : sql`${games.title} DESC`;
    default:
      return sortOrder === 'asc'
        ? sql`${games.publishedAt} ASC NULLS LAST`
        : sql`${games.publishedAt} DESC NULLS LAST`;
  }
}
