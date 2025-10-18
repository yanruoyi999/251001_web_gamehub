/**
 * 外链健康检查脚本
 *
 * 功能：
 * - 检查页脚友情链接有效性
 * - 抽查游戏详情页外链（开发者链接和官方链接）
 * - 生成检查报告
 *
 * 用法：
 * pnpm tsx scripts/check-external-links.ts
 *
 * 建议：
 * - 每月1日运行全面检查
 * - 可集成到CI/CD pipeline定期执行
 * - 发现死链后及时更新或删除
 */

import { db } from '@/lib/db';
import { games } from '@/db/schema';
import { sql } from 'drizzle-orm';

// 页脚友情链接配置（与 components/layout/Footer.tsx 保持一致）
const FOOTER_LINKS = [
  { name: 'Itch.io', url: 'https://itch.io', category: 'Platform' },
  { name: 'Kongregate', url: 'https://www.kongregate.com', category: 'Platform' },
  { name: 'Newgrounds', url: 'https://www.newgrounds.com/games', category: 'Platform' },
  { name: 'Armor Games', url: 'https://armorgames.com', category: 'Platform' },
  { name: 'CrazyGames', url: 'https://www.crazygames.com', category: 'Platform' },
  { name: 'Poki', url: 'https://poki.com', category: 'Platform' },
  { name: 'HTML5 Games', url: 'https://html5games.com', category: 'Resource' },
  { name: 'Coolmath Games', url: 'https://www.coolmathgames.com', category: 'Resource' },
  { name: 'GameStop', url: 'https://www.gamestop.com', category: 'Retail' },
  { name: 'Board Game Arena', url: 'https://en.boardgamearena.com', category: 'Tabletop' },
  { name: 'AdFreeGames', url: 'https://www.adfreegames.com', category: 'Curated' },
  { name: 'Ad-Free Games Hub', url: 'https://ad-freegames.github.io', category: 'Curated' },
  { name: 'OpenGameArt', url: 'https://opengameart.org', category: 'Assets' },
  { name: 'Construct', url: 'https://www.construct.net', category: 'Engine' },
  { name: 'Godot Engine', url: 'https://godotengine.org', category: 'Engine' },
  { name: 'Unity WebGL Guide', url: 'https://docs.unity3d.com/Manual/webgl-gettingstarted.html', category: 'Documentation' },
  { name: 'MDN Games', url: 'https://developer.mozilla.org/en-US/docs/Games', category: 'Documentation' },
  { name: 'Game Developer', url: 'https://www.gamedeveloper.com/', category: 'Industry' },
  { name: 'GDC Vault', url: 'https://www.gdcvault.com/free/gdc-2019', category: 'Education' },
  { name: 'GameAnalytics', url: 'https://gameanalytics.com', category: 'Analytics' },
  { name: 'Indie DB', url: 'https://www.indiedb.com', category: 'Community' },
  { name: 'Phaser', url: 'https://phaser.io', category: 'Framework' },
  { name: 'PlayCanvas', url: 'https://playcanvas.com', category: 'Framework' },
];

interface LinkCheckResult {
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
  responseTime?: number;
}

/**
 * 检查单个链接
 */
async function checkLink(url: string): Promise<LinkCheckResult> {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'GameHub-Link-Checker/1.0',
      },
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    return {
      url,
      ok: response.ok,
      status: response.status,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      url,
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
    };
  }
}

/**
 * 检查页脚友情链接
 */
async function checkFooterLinks(): Promise<void> {
  console.log('\n📋 检查页脚友情链接 (共 23 个)\n');
  console.log('─'.repeat(80));

  let failedCount = 0;
  const results: Array<{ name: string; result: LinkCheckResult }> = [];

  for (const link of FOOTER_LINKS) {
    const result = await checkLink(link.url);
    results.push({ name: link.name, result });

    const icon = result.ok ? '✅' : '❌';
    const statusInfo = result.status ? `HTTP ${result.status}` : result.error || 'Timeout';
    const timeInfo = result.responseTime ? `${result.responseTime}ms` : '-';

    console.log(
      `${icon} ${link.name.padEnd(20)} ${statusInfo.padEnd(15)} ${timeInfo.padStart(8)} | ${link.url}`
    );

    if (!result.ok) failedCount++;
  }

  console.log('─'.repeat(80));
  console.log(`\n${failedCount === 0 ? '✅ 所有页脚链接正常' : `⚠️  发现 ${failedCount} 个异常链接`}\n`);

  if (failedCount > 0) {
    console.log('📝 需要处理的链接：');
    results
      .filter((r) => !r.result.ok)
      .forEach((r) => {
        console.log(`   - ${r.name}: ${r.result.url}`);
        console.log(`     错误: ${r.result.error || `HTTP ${r.result.status}`}`);
      });
    console.log();
  }
}

/**
 * 抽查游戏详情页外链
 */
async function checkGameLinks(sampleSize: number = 10): Promise<void> {
  console.log(`\n🎮 抽查游戏详情页外链 (抽样 ${sampleSize} 个)\n`);
  console.log('─'.repeat(80));

  // 查询有外链的游戏（随机抽样）
  const gamesWithLinks = await db
    .select({
      id: games.id,
      title: games.title,
      developerUrl: games.developerUrl,
      sourceUrl: games.sourceUrl,
    })
    .from(games)
    .where(
      sql`${games.developerUrl} IS NOT NULL OR ${games.sourceUrl} IS NOT NULL`
    )
    .orderBy(sql`RANDOM()`)
    .limit(sampleSize);

  if (gamesWithLinks.length === 0) {
    console.log('⚠️  没有找到配置了外链的游戏\n');
    console.log('💡 建议：通过管理后台为游戏添加开发者链接和官方链接\n');
    return;
  }

  let totalChecked = 0;
  let totalFailed = 0;

  for (const game of gamesWithLinks) {
    console.log(`\n游戏: ${game.title} (ID: ${game.id})`);

    if (game.developerUrl) {
      totalChecked++;
      const result = await checkLink(game.developerUrl);
      const icon = result.ok ? '✅' : '❌';
      const statusInfo = result.status ? `HTTP ${result.status}` : result.error || 'Timeout';
      console.log(`  ${icon} 开发者链接: ${statusInfo} - ${game.developerUrl}`);
      if (!result.ok) totalFailed++;
    }

    if (game.sourceUrl) {
      totalChecked++;
      const result = await checkLink(game.sourceUrl);
      const icon = result.ok ? '✅' : '❌';
      const statusInfo = result.status ? `HTTP ${result.status}` : result.error || 'Timeout';
      console.log(`  ${icon} 官方链接: ${statusInfo} - ${game.sourceUrl}`);
      if (!result.ok) totalFailed++;
    }
  }

  console.log('\n' + '─'.repeat(80));
  console.log(`\n检查了 ${gamesWithLinks.length} 个游戏的 ${totalChecked} 个外链`);
  console.log(
    totalFailed === 0
      ? '✅ 所有游戏外链正常'
      : `⚠️  发现 ${totalFailed} 个异常链接，请及时更新`
  );
  console.log();
}

/**
 * 主函数
 */
async function main() {
  console.log('\n🔍 GameHub 外链健康检查工具');
  console.log('执行时间:', new Date().toLocaleString('zh-CN'));
  console.log('═'.repeat(80));

  try {
    // 1. 检查页脚友情链接
    await checkFooterLinks();

    // 2. 抽查游戏详情页外链
    await checkGameLinks(10);

    console.log('═'.repeat(80));
    console.log('✅ 检查完成！');
    console.log('\n💡 建议：');
    console.log('   1. 将此脚本加入月度运维计划');
    console.log('   2. 发现死链后及时更新 components/layout/Footer.tsx');
    console.log('   3. 通过管理后台更新游戏的开发者链接和官方链接');
    console.log('   4. 在 Google Search Console 提交重新抓取\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 检查过程中发生错误:');
    console.error(error);
    process.exit(1);
  }
}

// 执行检查
main();
