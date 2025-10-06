/**
 * Meilisearch Index Setup Script
 *
 * 配置 Meilisearch 游戏索引
 * - 创建索引（如不存在）
 * - 配置搜索、过滤、排序属性
 * - 配置中文停用词
 *
 * 运行: pnpm meilisearch:setup
 */

import { setupGamesIndex } from '../lib/meilisearch/setup';

async function main() {
  try {
    console.log('🚀 Starting Meilisearch index setup...\n');

    const success = await setupGamesIndex();

    if (success) {
      console.log('\n✅ Meilisearch index setup completed successfully!');
      process.exit(0);
    }

    console.log('\nℹ️  Meilisearch 未配置或未运行，跳过索引初始化。');
    console.log('   如果需要启用搜索，请先配置 MEILISEARCH_HOST 与 API Key。\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during setup:', error);
    process.exit(1);
  }
}

main();
