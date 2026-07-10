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
import { getRedisClient } from '@/lib/redis';
import { isValidId, validatePagination, isValidUrl, isValidHttpsUrl } from '@/lib/utils/validation';
import { isNextProductionBuild } from '@/lib/utils/build-phase';
import {
  normalizeGameUpdateInput,
  type UpdateGameInput,
} from '@/lib/games/game-update';

export type { UpdateGameInput } from '@/lib/games/game-update';

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

export type GameListItem = {
  id: number;
  title: string;
  titleEn: string | null;
  slug: string;
  status: string | null;
  thumbnailUrl: string | null;
  featured: boolean | null;
  isNew: boolean | null;
  isHot: boolean | null;
  publishedAt: Date;
  playCount: number | null;
  averageRating: string | null;
  isFavorite: boolean;
};

export interface ListGamesResult {
  games: GameListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
  featured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  status?: 'active' | 'inactive' | 'pending';
  developerName?: string | null;
  developerUrl?: string | null;
  sourceUrl?: string | null;
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
      const cached = await getJson<GameDetail>(getRedisClient(), GameCacheKeys.byId(gameId));
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
      await setJson(getRedisClient(), GameCacheKeys.byId(gameId), detail, CacheTTL.GAME_DETAILS);
      await setJson(getRedisClient(), GameCacheKeys.bySlug(record.slug), detail, CacheTTL.GAME_DETAILS);
    }

    return detail;
  }

  /**
   * 根据 slug 获取游戏详情
   */
  static async getGameBySlug(slug: string, useCache = true): Promise<GameDetail | null> {
    if (!isValidSlug(slug)) throw new Error('Invalid slug format');

    if (useCache) {
      const cached = await getJson<GameDetail>(getRedisClient(), GameCacheKeys.bySlug(slug));
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
      await setJson(getRedisClient(), GameCacheKeys.bySlug(slug), detail, CacheTTL.GAME_DETAILS);
      await setJson(getRedisClient(), GameCacheKeys.byId(record.id), detail, CacheTTL.GAME_DETAILS);
    }

    return detail;
  }

  /**
   * 列表查询
   */
  static async listGames(options: ListGamesOptions = {}): Promise<ListGamesResult> {
    const { page, limit, offset } = validatePagination(options.page, options.limit);
    const status = options.status ?? 'active';

    if (isNextProductionBuild()) {
      throw new Error('Skipping game list database load during production build');
    }

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

    const listCacheKey = GameCacheKeys.list(buildListCacheHash({
      page,
      limit,
      status,
      categoryId: options.categoryId ?? null,
      tagId: options.tagId ?? null,
      search: options.search?.trim() || null,
      sortBy: options.sortBy ?? 'publishedAt',
      sortOrder: options.sortOrder ?? 'desc',
      featured: options.featured ?? null,
      isNew: options.isNew ?? null,
      isHot: options.isHot ?? null,
      onlyFavorites: options.onlyFavorites ?? false,
      favoriteIds,
    }));
    const cached = await getJson<ListGamesResult>(getRedisClient(), listCacheKey);
    if (cached) return cached;

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

    const result = {
      games: rows.map((row) => ({
        ...row,
        isFavorite: favoriteSet.has(row.id),
      })),
      total: Number(count || 0),
      page,
      limit,
      totalPages: Math.ceil(Number(count || 0) / limit),
    };

    await setJson(getRedisClient(), listCacheKey, result, CacheTTL.GAME_LIST);
    return result;
  }

  /**
   * 创建游戏
   */
  static async createGame(input: CreateGameInput): Promise<GameRecord> {
    const title = input.title?.trim();
    if (!title) {
      throw new Error('Game title is required');
    }

    const iframeUrl = input.iframeUrl?.trim();
    if (!iframeUrl || !isValidUrl(iframeUrl)) {
      throw new Error('Invalid iframe URL');
    }

    const sanitizedDeveloperName = input.developerName?.trim() || null;
    const sanitizedDeveloperUrl = input.developerUrl?.trim() || null;
    const sanitizedSourceUrl = input.sourceUrl?.trim() || null;

    if (sanitizedDeveloperUrl && !isValidHttpsUrl(sanitizedDeveloperUrl)) {
      throw new Error('Developer URL must be a valid HTTPS link');
    }

    if (sanitizedSourceUrl && !isValidHttpsUrl(sanitizedSourceUrl)) {
      throw new Error('Source URL must be a valid HTTPS link');
    }

    const slugSource = (input.slug ?? generateSlug(input.titleEn?.trim() || title)).trim().toLowerCase();
    if (!isValidSlug(slugSource)) {
      throw new Error('Invalid slug format');
    }

    const existingSlugs = await db
      .select({ slug: games.slug })
      .from(games)
      .then((rows) => rows.map((row) => row.slug));

    const uniqueSlug = ensureUniqueSlug(slugSource, existingSlugs);

    const [created] = await db
      .insert(games)
      .values({
        title,
        titleEn: input.titleEn?.trim() || title,
        description: input.description,
        descriptionEn: input.descriptionEn,
        instructions: input.instructions,
        instructionsEn: input.instructionsEn,
        thumbnailUrl: input.thumbnailUrl,
        iframeUrl,
        slug: uniqueSlug,
        featured: input.featured ?? false,
        isNew: input.isNew ?? true,
        isHot: input.isHot ?? false,
        status: input.status ?? 'active',
        developerName: sanitizedDeveloperName,
        developerUrl: sanitizedDeveloperUrl,
        sourceUrl: sanitizedSourceUrl,
      })
      .returning();

    await db.insert(gameStats).values({ gameId: created.id }).onConflictDoNothing();

    if (input.categoryIds?.length) {
      await this.setCategories(created.id, input.categoryIds);
    }

    if (input.tagIds?.length) {
      await this.setTags(created.id, input.tagIds);
    }

    await delKey(getRedisClient(), GameCacheKeys.byId(created.id));
    await delKey(getRedisClient(), GameCacheKeys.bySlug(created.slug));

    return created;
  }

  /**
   * 更新游戏
   */
  static async updateGame(
    gameId: number,
    updates: UpdateGameInput | Record<string, unknown>,
  ): Promise<GameRecord> {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    const { scalarUpdates, categoryIds, tagIds } = normalizeGameUpdateInput(updates);
    const [current] = await db
      .select({ id: games.id, slug: games.slug })
      .from(games)
      .where(eq(games.id, gameId))
      .limit(1);

    if (!current) {
      throw new Error('Game not found');
    }

    if (scalarUpdates.slug && scalarUpdates.slug !== current.slug) {
      const existingSlugs = await db
        .select({ slug: games.slug })
        .from(games)
        .where(sql`${games.id} != ${gameId}`)
        .then((rows) => rows.map((row) => row.slug));
      if (existingSlugs.includes(scalarUpdates.slug)) {
        throw new Error('Slug already exists');
      }
    }

    const [updated] = await db
      .update(games)
      .set({
        ...scalarUpdates,
        updatedAt: new Date(),
      })
      .where(eq(games.id, gameId))
      .returning();

    if (!updated) {
      throw new Error('Game not found');
    }

    if (categoryIds !== undefined) {
      await this.setCategories(gameId, categoryIds);
    }

    if (tagIds !== undefined) {
      await this.setTags(gameId, tagIds);
    }

    await delKey(getRedisClient(), GameCacheKeys.byId(gameId));
    await delKey(getRedisClient(), GameCacheKeys.bySlug(current.slug));
    await delKey(getRedisClient(), GameCacheKeys.bySlug(updated.slug));

    return updated;
  }

  /**
   * 软删除游戏
   */
  static async archiveGame(gameId: number): Promise<void> {
    if (!isValidId(gameId)) throw new Error('Invalid game ID');

    const [archived] = await db
      .update(games)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(games.id, gameId))
      .returning({ id: games.id, slug: games.slug });

    if (!archived) {
      throw new Error('Game not found');
    }

    await delKey(getRedisClient(), GameCacheKeys.byId(gameId));
    await delKey(getRedisClient(), GameCacheKeys.bySlug(archived.slug));
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

    await delKey(getRedisClient(), GameCacheKeys.byId(gameId));
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

    await delKey(getRedisClient(), GameCacheKeys.byId(gameId));
  }
}

function or(...conditions: any[]) {
  return sql`${sql.join(conditions, sql` OR `)}`;
}

function buildListCacheHash(input: Record<string, unknown>) {
  return Buffer.from(JSON.stringify(input)).toString('base64url');
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
