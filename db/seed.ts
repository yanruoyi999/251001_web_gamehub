/**
 * 数据库种子数据脚本
 * 用于导入初始测试数据
 *
 * 运行方式: tsx db/seed.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import crypto from 'crypto';
import * as schema from './schema';

// 数据库连接
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

// 工具函数：生成 IP 哈希
function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

// 工具函数：生成 slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function seed() {
  console.log('🌱 开始导入种子数据...\n');

  try {
    // 1. 插入分类
    console.log('📁 插入游戏分类...');
    const categoryData = [
      { name: '动作', nameEn: 'Action', slug: 'action', description: '快节奏的动作游戏', descriptionEn: 'Fast-paced action games' },
      { name: '益智', nameEn: 'Puzzle', slug: 'puzzle', description: '考验智力的益智游戏', descriptionEn: 'Brain-teasing puzzle games' },
      { name: '冒险', nameEn: 'Adventure', slug: 'adventure', description: '探索未知的冒险游戏', descriptionEn: 'Explore the unknown adventure games' },
      { name: '策略', nameEn: 'Strategy', slug: 'strategy', description: '需要战略思考的游戏', descriptionEn: 'Games requiring strategic thinking' },
      { name: '体育', nameEn: 'Sports', slug: 'sports', description: '体育竞技类游戏', descriptionEn: 'Sports and athletics games' },
      { name: '休闲', nameEn: 'Casual', slug: 'casual', description: '轻松休闲的游戏', descriptionEn: 'Relaxing casual games' },
    ];

    const insertedCategories = await db.insert(schema.categories).values(categoryData).returning();
    console.log(`   ✅ 成功插入 ${insertedCategories.length} 个分类\n`);

    // 2. 插入标签
    console.log('🏷️  插入游戏标签...');
    const tagData = [
      { name: '单人', nameEn: 'Single Player', slug: 'single-player' },
      { name: '多人', nameEn: 'Multiplayer', slug: 'multiplayer' },
      { name: '3D', nameEn: '3D', slug: '3d' },
      { name: '2D', nameEn: '2D', slug: '2d' },
      { name: '像素风', nameEn: 'Pixel Art', slug: 'pixel-art' },
      { name: '复古', nameEn: 'Retro', slug: 'retro' },
      { name: '在线', nameEn: 'Online', slug: 'online' },
      { name: '离线', nameEn: 'Offline', slug: 'offline' },
      { name: '卡通', nameEn: 'Cartoon', slug: 'cartoon' },
      { name: '写实', nameEn: 'Realistic', slug: 'realistic' },
    ];

    const insertedTags = await db.insert(schema.tags).values(tagData).returning();
    console.log(`   ✅ 成功插入 ${insertedTags.length} 个标签\n`);

    // 3. 插入示例游戏
    console.log('🎮 插入示例游戏...');
    const gameData = [
      {
        slug: 'space-shooter',
        title: '太空射击',
        titleEn: 'Space Shooter',
        description: '驾驶宇宙飞船，击败外星入侵者！',
        descriptionEn: 'Pilot your spaceship and defeat alien invaders!',
        instructions: '使用方向键移动，空格键射击',
        instructionsEn: 'Use arrow keys to move, spacebar to shoot',
        iframeUrl: 'https://example.com/games/space-shooter',
        thumbnailUrl: 'https://via.placeholder.com/300x200/4A90E2/ffffff?text=Space+Shooter',
        featured: true,
        isNew: false,
        isHot: true,
        status: 'active' as const,
        // SEO外链字段示例
        developerName: 'Space Games Studio',
        developerUrl: 'https://www.kongregate.com',
        sourceUrl: 'https://www.kongregate.com/games/space-shooter',
      },
      {
        slug: 'sudoku-master',
        title: '数独大师',
        titleEn: 'Sudoku Master',
        description: '经典数独游戏，挑战你的逻辑思维',
        descriptionEn: 'Classic Sudoku game to challenge your logic',
        instructions: '填入1-9的数字，确保每行、每列、每宫格数字不重复',
        instructionsEn: 'Fill in numbers 1-9, ensuring no duplicates in rows, columns, or boxes',
        iframeUrl: 'https://example.com/games/sudoku',
        thumbnailUrl: 'https://via.placeholder.com/300x200/7B68EE/ffffff?text=Sudoku+Master',
        featured: false,
        isNew: true,
        isHot: false,
        status: 'active' as const,
        // SEO外链字段示例
        developerName: 'Puzzle Masters Inc',
        developerUrl: 'https://itch.io',
        sourceUrl: 'https://itch.io/games/sudoku-master',
      },
      {
        slug: 'mystery-island',
        title: '神秘岛探险',
        titleEn: 'Mystery Island',
        description: '探索神秘岛屿，发现隐藏的宝藏',
        descriptionEn: 'Explore mysterious islands and discover hidden treasures',
        instructions: 'WASD 移动，E 键互动，空格跳跃',
        instructionsEn: 'WASD to move, E to interact, Space to jump',
        iframeUrl: 'https://example.com/games/mystery-island',
        thumbnailUrl: 'https://via.placeholder.com/300x200/50C878/ffffff?text=Mystery+Island',
        featured: true,
        isNew: true,
        isHot: true,
        status: 'active' as const,
        // SEO外链字段示例
        developerName: 'Adventure Labs',
        developerUrl: 'https://gamejolt.com',
        sourceUrl: 'https://gamejolt.com/games/mystery-island',
      },
      {
        slug: 'tower-defense',
        title: '塔防战争',
        titleEn: 'Tower Defense War',
        description: '建造防御塔，抵御敌人的进攻',
        descriptionEn: 'Build defense towers to resist enemy attacks',
        instructions: '鼠标点击建造塔楼，升级塔楼提升火力',
        instructionsEn: 'Click to build towers, upgrade for more firepower',
        iframeUrl: 'https://example.com/games/tower-defense',
        thumbnailUrl: 'https://via.placeholder.com/300x200/FF6347/ffffff?text=Tower+Defense',
        featured: false,
        isNew: false,
        isHot: false,
        status: 'active' as const,
      },
      {
        slug: 'soccer-star',
        title: '足球明星',
        titleEn: 'Soccer Star',
        description: '成为足球场上的明星球员',
        descriptionEn: 'Become a star player on the soccer field',
        instructions: '方向键移动，X 射门，C 传球',
        instructionsEn: 'Arrow keys to move, X to shoot, C to pass',
        iframeUrl: 'https://example.com/games/soccer-star',
        thumbnailUrl: 'https://via.placeholder.com/300x200/FFD700/ffffff?text=Soccer+Star',
        featured: false,
        isNew: false,
        isHot: true,
        status: 'active' as const,
      },
      {
        slug: 'bubble-shooter',
        title: '泡泡龙',
        titleEn: 'Bubble Shooter',
        description: '经典泡泡龙游戏，消除所有泡泡',
        descriptionEn: 'Classic bubble shooter game, eliminate all bubbles',
        instructions: '鼠标瞄准并点击发射泡泡',
        instructionsEn: 'Aim with mouse and click to shoot bubbles',
        iframeUrl: 'https://example.com/games/bubble-shooter',
        thumbnailUrl: 'https://via.placeholder.com/300x200/FF69B4/ffffff?text=Bubble+Shooter',
        featured: false,
        isNew: true,
        isHot: false,
        status: 'active' as const,
      },
    ];

    const insertedGames = await db.insert(schema.games).values(gameData).returning();
    console.log(`   ✅ 成功插入 ${insertedGames.length} 个游戏\n`);

    // 4. 建立游戏-分类关联
    console.log('🔗 建立游戏-分类关联...');
    const gameCategoryRelations = [
      { gameId: insertedGames[0].id, categoryId: insertedCategories[0].id }, // 太空射击 -> 动作
      { gameId: insertedGames[1].id, categoryId: insertedCategories[1].id }, // 数独大师 -> 益智
      { gameId: insertedGames[2].id, categoryId: insertedCategories[2].id }, // 神秘岛探险 -> 冒险
      { gameId: insertedGames[3].id, categoryId: insertedCategories[3].id }, // 塔防战争 -> 策略
      { gameId: insertedGames[4].id, categoryId: insertedCategories[4].id }, // 足球明星 -> 体育
      { gameId: insertedGames[5].id, categoryId: insertedCategories[5].id }, // 泡泡龙 -> 休闲
      { gameId: insertedGames[5].id, categoryId: insertedCategories[1].id }, // 泡泡龙 -> 益智
    ];

    await db.insert(schema.gameCategories).values(gameCategoryRelations);
    console.log(`   ✅ 成功建立 ${gameCategoryRelations.length} 个关联\n`);

    // 5. 建立游戏-标签关联
    console.log('🏷️  建立游戏-标签关联...');
    const gameTagRelations = [
      { gameId: insertedGames[0].id, tagId: insertedTags[0].id }, // 太空射击 -> 单人
      { gameId: insertedGames[0].id, tagId: insertedTags[2].id }, // 太空射击 -> 3D
      { gameId: insertedGames[1].id, tagId: insertedTags[0].id }, // 数独大师 -> 单人
      { gameId: insertedGames[1].id, tagId: insertedTags[3].id }, // 数独大师 -> 2D
      { gameId: insertedGames[2].id, tagId: insertedTags[0].id }, // 神秘岛探险 -> 单人
      { gameId: insertedGames[2].id, tagId: insertedTags[8].id }, // 神秘岛探险 -> 卡通
      { gameId: insertedGames[3].id, tagId: insertedTags[0].id }, // 塔防战争 -> 单人
      { gameId: insertedGames[3].id, tagId: insertedTags[3].id }, // 塔防战争 -> 2D
      { gameId: insertedGames[4].id, tagId: insertedTags[1].id }, // 足球明星 -> 多人
      { gameId: insertedGames[4].id, tagId: insertedTags[2].id }, // 足球明星 -> 3D
      { gameId: insertedGames[5].id, tagId: insertedTags[0].id }, // 泡泡龙 -> 单人
      { gameId: insertedGames[5].id, tagId: insertedTags[3].id }, // 泡泡龙 -> 2D
    ];

    await db.insert(schema.gameTags).values(gameTagRelations);
    console.log(`   ✅ 成功建立 ${gameTagRelations.length} 个关联\n`);

    // 6. 插入示例评分
    console.log('⭐ 插入示例评分...');
    const ratingData = [
      { gameId: insertedGames[0].id, rating: 5, comment: '太好玩了！', userIpHash: hashIp('127.0.0.1'), anonymousToken: 'token_001', status: 'approved' as const },
      { gameId: insertedGames[0].id, rating: 4, comment: '不错的游戏', userIpHash: hashIp('127.0.0.2'), anonymousToken: 'token_002', status: 'approved' as const },
      { gameId: insertedGames[0].id, rating: 5, comment: '超级好玩！', userIpHash: hashIp('127.0.0.3'), anonymousToken: 'token_003', status: 'approved' as const },
      { gameId: insertedGames[1].id, rating: 5, comment: '挑战性很强', userIpHash: hashIp('127.0.0.4'), anonymousToken: 'token_004', status: 'approved' as const },
      { gameId: insertedGames[1].id, rating: 4, comment: '适合放松', userIpHash: hashIp('127.0.0.5'), anonymousToken: 'token_005', status: 'approved' as const },
      { gameId: insertedGames[2].id, rating: 5, comment: '画面很美', userIpHash: hashIp('127.0.0.6'), anonymousToken: 'token_006', status: 'approved' as const },
      { gameId: insertedGames[2].id, rating: 5, comment: '剧情不错', userIpHash: hashIp('127.0.0.7'), anonymousToken: 'token_007', status: 'approved' as const },
      { gameId: insertedGames[3].id, rating: 4, comment: '策略性很高', userIpHash: hashIp('127.0.0.8'), anonymousToken: 'token_008', status: 'approved' as const },
      { gameId: insertedGames[4].id, rating: 3, comment: '还可以', userIpHash: hashIp('127.0.0.9'), anonymousToken: 'token_009', status: 'approved' as const },
      { gameId: insertedGames[5].id, rating: 5, comment: '经典好玩', userIpHash: hashIp('127.0.0.10'), anonymousToken: 'token_010', status: 'approved' as const },
    ];

    const insertedRatings = await db.insert(schema.ratings).values(ratingData).returning();
    console.log(`   ✅ 成功插入 ${insertedRatings.length} 个评分\n`);

    // 7. 创建游戏统计数据
    console.log('📊 创建游戏统计数据...');
    for (const game of insertedGames) {
      const gameRatings = ratingData.filter(r => r.gameId === game.id);

      const avgRating = gameRatings.length > 0
        ? gameRatings.reduce((sum, r) => sum + r.rating, 0) / gameRatings.length
        : 0;

      // 计算星级分布
      const rating1Star = gameRatings.filter(r => r.rating === 1).length;
      const rating2Star = gameRatings.filter(r => r.rating === 2).length;
      const rating3Star = gameRatings.filter(r => r.rating === 3).length;
      const rating4Star = gameRatings.filter(r => r.rating === 4).length;
      const rating5Star = gameRatings.filter(r => r.rating === 5).length;

      const playCount = Math.floor(Math.random() * 1000) + 100;
      const playCountToday = Math.floor(Math.random() * 50) + 10;
      const playCountWeek = Math.floor(Math.random() * 300) + 50;
      const playCountMonth = Math.floor(Math.random() * 800) + 100;

      // 热度分数 = 播放次数 * 0.3 + 评分数 * 10 + 平均评分 * 20
      const hotScore = Math.floor(playCount * 0.3 + gameRatings.length * 10 + avgRating * 20);

      await db.insert(schema.gameStats).values({
        gameId: game.id,
        playCount,
        playCountToday,
        playCountWeek,
        playCountMonth,
        averageRating: avgRating.toFixed(2),
        ratingCount: gameRatings.length,
        rating1Star,
        rating2Star,
        rating3Star,
        rating4Star,
        rating5Star,
        hotScore,
        lastPlayedAt: new Date(),
        lastRatedAt: gameRatings.length > 0 ? new Date() : null,
      });
    }
    console.log(`   ✅ 成功创建 ${insertedGames.length} 条统计数据\n`);

    // 8. 插入游戏截图
    console.log('📷 插入游戏截图...');
    const screenshotData = [
      // 太空射击 - 3张截图
      { gameId: insertedGames[0].id, url: 'https://via.placeholder.com/800x600/4A90E2/ffffff?text=Space+Shooter+1', publicId: 'space-shooter-1', order: 0 },
      { gameId: insertedGames[0].id, url: 'https://via.placeholder.com/800x600/4A90E2/ffffff?text=Space+Shooter+2', publicId: 'space-shooter-2', order: 1 },
      { gameId: insertedGames[0].id, url: 'https://via.placeholder.com/800x600/4A90E2/ffffff?text=Space+Shooter+3', publicId: 'space-shooter-3', order: 2 },
      // 神秘岛探险 - 2张截图
      { gameId: insertedGames[2].id, url: 'https://via.placeholder.com/800x600/50C878/ffffff?text=Mystery+Island+1', publicId: 'mystery-island-1', order: 0 },
      { gameId: insertedGames[2].id, url: 'https://via.placeholder.com/800x600/50C878/ffffff?text=Mystery+Island+2', publicId: 'mystery-island-2', order: 1 },
    ];

    const insertedScreenshots = await db.insert(schema.screenshots).values(screenshotData).returning();
    console.log(`   ✅ 成功插入 ${insertedScreenshots.length} 张截图\n`);

    // 9. 插入播放计数记录
    console.log('📈 插入播放计数记录...');
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const playCounterData = [
      { gameId: insertedGames[0].id, date: today, count: 45 },
      { gameId: insertedGames[0].id, date: yesterday, count: 38 },
      { gameId: insertedGames[1].id, date: today, count: 32 },
      { gameId: insertedGames[2].id, date: today, count: 56 },
      { gameId: insertedGames[2].id, date: yesterday, count: 49 },
      { gameId: insertedGames[4].id, date: today, count: 28 },
    ];

    const insertedCounters = await db.insert(schema.playCounters).values(playCounterData).returning();
    console.log(`   ✅ 成功插入 ${insertedCounters.length} 条播放记录\n`);

    // 10. 插入管理员操作日志
    console.log('📝 插入管理员操作日志...');
    const adminLogData = [
      {
        operator: 'admin',
        action: 'create',
        entityType: 'game',
        entityId: insertedGames[0].id.toString(),
        details: { title: '太空射击', operation: '创建新游戏' },
        ipAddress: '192.168.1.100',
      },
      {
        operator: 'admin',
        action: 'approve',
        entityType: 'rating',
        entityId: insertedRatings[0].id.toString(),
        details: { gameId: insertedGames[0].id, rating: 5, operation: '审核通过评分' },
        ipAddress: '192.168.1.100',
      },
      {
        operator: 'admin',
        action: 'update',
        entityType: 'game',
        entityId: insertedGames[2].id.toString(),
        details: { title: '神秘岛探险', field: 'featured', oldValue: false, newValue: true },
        ipAddress: '192.168.1.100',
      },
    ];

    const insertedLogs = await db.insert(schema.adminLogs).values(adminLogData).returning();
    console.log(`   ✅ 成功插入 ${insertedLogs.length} 条操作日志\n`);

    console.log('✅ 种子数据导入完成！\n');
    console.log('📊 数据统计:');
    console.log(`   - 分类: ${insertedCategories.length}`);
    console.log(`   - 标签: ${insertedTags.length}`);
    console.log(`   - 游戏: ${insertedGames.length}`);
    console.log(`   - 游戏统计: ${insertedGames.length}`);
    console.log(`   - 游戏-分类关联: ${gameCategoryRelations.length}`);
    console.log(`   - 游戏-标签关联: ${gameTagRelations.length}`);
    console.log(`   - 评分: ${insertedRatings.length}`);
    console.log(`   - 截图: ${insertedScreenshots.length}`);
    console.log(`   - 播放计数: ${insertedCounters.length}`);
    console.log(`   - 管理员日志: ${insertedLogs.length}`);
  } catch (error) {
    console.error('❌ 种子数据导入失败:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// 运行种子脚本
seed()
  .then(() => {
    console.log('\n🎉 完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ 错误:', error);
    process.exit(1);
  });
