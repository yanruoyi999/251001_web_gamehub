/**
 * Meilisearch Client Configuration
 *
 * 用于游戏全文搜索
 * - 支持中文分词
 * - 多字段搜索（标题、描述、标签）
 * - 过滤和排序
 */

import { MeiliSearch, type Index } from 'meilisearch';

// 索引名称常量
export const INDEXES = {
  GAMES: 'games',
} as const;

// 游戏搜索文档类型
export interface GameSearchDocument {
  id: number;
  title: string;
  titleEn: string;
  description: string | null;
  descriptionEn: string | null;
  slug: string;
  thumbnailUrl: string | null;
  categoryIds: number[];
  tagIds: number[];
  isActive: boolean;
  isNew: boolean;
  isHot: boolean;
  averageRating: number | null;
  playCount: number;
  publishedAt: number; // timestamp
}

// Meilisearch 客户端初始化
let meilisearchClient: MeiliSearch | null = null;

export function getMeilisearchClient(): MeiliSearch | null {
  // 如果未配置，返回 null（降级到数据库搜索）
  if (!process.env.MEILISEARCH_HOST) {
    console.warn('MEILISEARCH_HOST not configured, search features will be degraded');
    return null;
  }

  // 单例模式
  if (!meilisearchClient) {
    meilisearchClient = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY || '',
    });
  }

  return meilisearchClient;
}

// 获取游戏索引
export function getGamesIndex(): Index<GameSearchDocument> | null {
  const client = getMeilisearchClient();
  if (!client) return null;

  return client.index<GameSearchDocument>(INDEXES.GAMES);
}

// 验证 Meilisearch 连接
export async function verifyMeilisearchConnection(): Promise<boolean> {
  try {
    const client = getMeilisearchClient();
    if (!client) {
      throw new Error('Meilisearch not configured');
    }

    // 测试健康检查
    const health = await client.health();
    return health.status === 'available';
  } catch (error) {
    console.error('Meilisearch connection failed:', error);
    return false;
  }
}

// 检查索引是否存在
export async function checkIndexExists(indexName: string): Promise<boolean> {
  try {
    const client = getMeilisearchClient();
    if (!client) return false;

    const indexes = await client.getIndexes();
    return indexes.results.some((index) => index.uid === indexName);
  } catch (error) {
    console.error('Failed to check index:', error);
    return false;
  }
}

export { meilisearchClient };
export default getMeilisearchClient;
