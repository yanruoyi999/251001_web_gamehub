/**
 * Upstash Redis Client Configuration
 *
 * 用于缓存和限流
 * - 播放计数缓存（高频写入）
 * - API 限流
 * - 会话存储
 */

import { Redis } from '@upstash/redis';

// Redis 键前缀常量
export const REDIS_KEYS = {
  // 播放计数: play:count:{gameId}
  PLAY_COUNT: (gameId: number) => `play:count:${gameId}`,

  // 今日播放计数: play:today:{gameId}
  PLAY_TODAY: (gameId: number) => `play:today:${gameId}`,

  // 游戏缓存: game:cache:{gameId}
  GAME_CACHE: (gameId: number) => `game:cache:${gameId}`,

  // 评分限流: rate:limit:rating:{ipHash}
  RATE_LIMIT_RATING: (ipHash: string) => `rate:limit:rating:${ipHash}`,

  // API 限流: rate:limit:api:{ip}
  RATE_LIMIT_API: (ip: string) => `rate:limit:api:${ip}`,

  // 搜索缓存: search:cache:{query}:{filters}
  SEARCH_CACHE: (query: string, filters: string) => `search:cache:${query}:${filters}`,
} as const;

// Redis 客户端初始化
let redisClient: Redis | null = null;
let hasWarnedAboutMissingRedis = false;
let redisDisabledUntil = 0;
let redisFailureCount = 0;
let lastRedisFailureLogAt = 0;

const REDIS_FAILURE_LOG_INTERVAL_MS = 60 * 1000;
const REDIS_MIN_DISABLE_MS = 60 * 1000;
const REDIS_MAX_DISABLE_MS = 5 * 60 * 1000;

export function isLocalCacheMode(env: NodeJS.ProcessEnv = process.env) {
  return env.CACHE_MODE?.trim().toLowerCase() === 'local';
}

export function isRedisTemporarilyDisabled(now = Date.now()) {
  return redisDisabledUntil > now;
}

export function recordRedisSuccess() {
  redisFailureCount = 0;
  redisDisabledUntil = 0;
}

export function recordRedisFailure(operation: string, error: unknown) {
  const now = Date.now();
  redisFailureCount += 1;
  const backoffMs = Math.min(
    REDIS_MAX_DISABLE_MS,
    REDIS_MIN_DISABLE_MS * redisFailureCount,
  );
  redisDisabledUntil = now + backoffMs;

  if (now - lastRedisFailureLogAt >= REDIS_FAILURE_LOG_INTERVAL_MS) {
    lastRedisFailureLogAt = now;
    console.warn(
      `Redis ${operation} failed; skipping Redis cache for ${Math.round(backoffMs / 1000)}s:`,
      error,
    );
  }
}

export function getRedisClient(): Redis | null {
  if (isLocalCacheMode()) {
    return null;
  }

  // 如果未配置，返回 null（降级到直接数据库操作）
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
    if (!hasWarnedAboutMissingRedis && process.env.NODE_ENV !== 'test') {
      hasWarnedAboutMissingRedis = true;
      console.warn('Redis not configured, caching features will be degraded');
    }
    return null;
  }

  if (isRedisTemporarilyDisabled()) {
    return null;
  }

  // 单例模式
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
  }

  return redisClient;
}

// 验证 Redis 连接
export async function verifyRedisConnection(): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) {
      throw new Error('Redis not configured');
    }

    // 测试 PING 命令
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis connection failed:', error);
    return false;
  }
}

// 增加播放计数
export async function incrementPlayCount(gameId: number): Promise<number | null> {
  try {
    const client = getRedisClient();
    if (!client) return null;

    // 增加总播放计数
    const totalKey = REDIS_KEYS.PLAY_COUNT(gameId);
    const todayKey = REDIS_KEYS.PLAY_TODAY(gameId);

    // 使用 Pipeline 批量操作
    const pipeline = client.pipeline();
    pipeline.incr(totalKey);
    pipeline.incr(todayKey);

    // 设置今日计数的过期时间（24小时后）
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const ttl = Math.floor((endOfDay.getTime() - Date.now()) / 1000);
    pipeline.expire(todayKey, ttl);

    const results = await pipeline.exec();
    return results[0] as number; // 返回总播放次数
  } catch (error) {
    console.error('Failed to increment play count:', error);
    return null;
  }
}

// 获取播放计数
export async function getPlayCount(gameId: number): Promise<{ total: number; today: number } | null> {
  try {
    const client = getRedisClient();
    if (!client) return null;

    const totalKey = REDIS_KEYS.PLAY_COUNT(gameId);
    const todayKey = REDIS_KEYS.PLAY_TODAY(gameId);

    const [total, today] = await Promise.all([
      client.get<number>(totalKey),
      client.get<number>(todayKey),
    ]);

    return {
      total: total || 0,
      today: today || 0,
    };
  } catch (error) {
    console.error('Failed to get play count:', error);
    return null;
  }
}

// 检查评分限流（每个 IP 每小时最多评分 10 次）
export async function checkRatingRateLimit(ipHash: string, limit = 10, window = 3600): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) return true; // 降级：允许评分

    const key = REDIS_KEYS.RATE_LIMIT_RATING(ipHash);

    // 获取当前计数
    const current = await client.incr(key);

    // 如果是第一次，设置过期时间
    if (current === 1) {
      await client.expire(key, window);
    }

    // 检查是否超过限制
    return current <= limit;
  } catch (error) {
    console.error('Failed to check rate limit:', error);
    return true; // 降级：允许评分
  }
}

// 缓存游戏数据
export async function cacheGame(gameId: number, data: any, ttl = 300): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) return false;

    const key = REDIS_KEYS.GAME_CACHE(gameId);
    await client.setex(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to cache game:', error);
    return false;
  }
}

// 获取缓存的游戏数据
export async function getCachedGame<T = any>(gameId: number): Promise<T | null> {
  try {
    const client = getRedisClient();
    if (!client) return null;

    const key = REDIS_KEYS.GAME_CACHE(gameId);
    const data = await client.get<string>(key);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get cached game:', error);
    return null;
  }
}

// 清除游戏缓存
export async function clearGameCache(gameId: number): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) return false;

    const key = REDIS_KEYS.GAME_CACHE(gameId);
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Failed to clear game cache:', error);
    return false;
  }
}

export { redisClient };
export default getRedisClient;
