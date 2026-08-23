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

    const index = client.index<GameSearchDocument>(INDEXES.GAMES);

    await index.updateSettings({
      searchableAttributes: [
        'title',
        'titleEn',
        'description',
        'descriptionEn',
      ],

      filterableAttributes: [
        'categoryIds',
        'tagIds',
        'isActive',
        'isNew',
        'isHot',
        'averageRating',
        'embedPermissionStatus',
      ],

      sortableAttributes: [
        'averageRating',
        'playCount',
        'publishedAt',
      ],

      displayedAttributes: ['*'],

      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
      ],

      stopWords: ['的', '了', '是', '在', '有', '和', '就', '不', '人', '都'],

      pagination: {
        maxTotalHits: 1000,
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

    try {
      await client.deleteIndex(INDEXES.GAMES);
      console.log('🗑️  Old index deleted');
    } catch (error) {
      console.log('ℹ️  No existing index to delete');
    }

    await client.createIndex(INDEXES.GAMES, { primaryKey: 'id' });
    console.log('📝 New index created');

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
