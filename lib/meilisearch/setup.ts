/**
 * Meilisearch Index Setup
 *
 * 配置游戏索引的搜索、过滤、排序属性
 */

/* eslint-disable no-console */
import { getMeilisearchClient, INDEXES, type GameSearchDocument } from './index';

/**
 * 初始化游戏索引配置
 */
export async function setupGamesIndex(): Promise<boolean> {
  try {
    const client = getMeilisearchClient();
    if (!client) {
      console.warn('Meilisearch not configured, skipping index setup');
      return false;
    }

    console.log('🔧 Setting up Meilisearch games index...');

    // 获取或创建索引
    const index = client.index<GameSearchDocument>(INDEXES.GAMES);

    // 配置索引设置
    await index.updateSettings({
      // 可搜索字段（按优先级排序）
      searchableAttributes: [
        'title',         // 中文标题 - 最高优先级
        'titleEn',       // 英文标题
        'description',   // 中文描述
        'descriptionEn', // 英文描述
      ],

      // 可过滤字段
      filterableAttributes: [
        'categoryIds',
        'tagIds',
        'isActive',
        'isNew',
        'isHot',
        'averageRating',
      ],

      // 可排序字段
      sortableAttributes: [
        'averageRating',
        'playCount',
        'publishedAt',
      ],

      // 显示字段（返回所有字段）
      displayedAttributes: ['*'],

      // 排名规则（搜索结果排序）
      rankingRules: [
        'words',           // 匹配词数量
        'typo',            // 拼写容错
        'proximity',       // 词语邻近度
        'attribute',       // 字段优先级
        'sort',            // 自定义排序
        'exactness',       // 精确匹配
      ],

      // 停用词（中文常见虚词）
      stopWords: ['的', '了', '是', '在', '有', '和', '就', '不', '人', '都'],

      // 分页设置
      pagination: {
        maxTotalHits: 1000, // 最多返回 1000 条结果
      },
    });

    console.log('✅ Meilisearch games index configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to setup Meilisearch index:', error);
    return false;
  }
}

/**
 * 重建游戏索引（删除并重新创建）
 */
export async function rebuildGamesIndex(): Promise<boolean> {
  try {
    const client = getMeilisearchClient();
    if (!client) {
      console.warn('Meilisearch not configured');
      return false;
    }

    console.log('🔄 Rebuilding games index...');

    // 删除旧索引
    try {
      await client.deleteIndex(INDEXES.GAMES);
      console.log('🗑️  Old index deleted');
    } catch (error) {
      // 索引不存在，忽略错误
      console.log('ℹ️  No existing index to delete');
    }

    // 创建新索引
    await client.createIndex(INDEXES.GAMES, { primaryKey: 'id' });
    console.log('📝 New index created');

    // 配置索引
    await setupGamesIndex();

    console.log('✅ Games index rebuilt successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to rebuild index:', error);
    return false;
  }
}

/**
 * 清空游戏索引数据（保留配置）
 */
export async function clearGamesIndex(): Promise<boolean> {
  try {
    const client = getMeilisearchClient();
    if (!client) return false;

    const index = client.index(INDEXES.GAMES);
    await index.deleteAllDocuments();

    console.log('✅ Games index cleared');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear index:', error);
    return false;
  }
}
