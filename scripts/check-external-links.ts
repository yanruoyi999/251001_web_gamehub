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

import './load-env';

import { db } from '@/lib/db';
import { games } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { mockGames } from '@/lib/mock-games';

const LINK_CHECK_TIMEOUT_MS = 10000;
const DB_SAMPLE_TIMEOUT_MS = 5000;
const LINK_CHECK_CONCURRENCY = 6;

// 外链资源配置（与 components/layout/Footer.tsx 的实际展示保持同步）
const FOOTER_LINKS = [
  { name: 'OpenGameArt', url: 'https://opengameart.org', category: 'Assets' },
  {
    name: 'AdSense Policies',
    url: 'https://transparency.google/intl/en/our-policies/product-terms/google-adsense/',
    category: 'Compliance',
  },
  { name: 'SEO Starter Guide', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide', category: 'SEO' },
];

interface LinkCheckResult {
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
  responseTime?: number;
  method?: 'HEAD' | 'GET';
}

interface GameLinkSample {
  id: number;
  title: string;
  developerUrl: string | null;
  sourceUrl: string | null;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

async function fetchWithTimeout(url: string, method: 'HEAD' | 'GET'): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LINK_CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; LumaGameHub-Link-Checker/1.0; +https://www.lumagamehub.com)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(method === 'GET' ? { Range: 'bytes=0-2048' } : {}),
      },
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

function shouldRetryWithGet(result: Response) {
  return [403, 405, 429, 500, 501].includes(result.status);
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );

  return results;
}

/**
 * 检查单个链接
 */
async function checkLink(url: string): Promise<LinkCheckResult> {
  const startTime = Date.now();

  try {
    let response = await fetchWithTimeout(url, 'HEAD');
    let method: 'HEAD' | 'GET' = 'HEAD';

    if (!response.ok && shouldRetryWithGet(response)) {
      response = await fetchWithTimeout(url, 'GET');
      method = 'GET';
    }

    const responseTime = Date.now() - startTime;

    return {
      url,
      ok: response.ok,
      status: response.status,
      responseTime,
      method,
    };
  } catch (error) {
    try {
      const response = await fetchWithTimeout(url, 'GET');
      const responseTime = Date.now() - startTime;

      return {
        url,
        ok: response.ok,
        status: response.status,
        responseTime,
        method: 'GET',
      };
    } catch (getError) {
      const responseTime = Date.now() - startTime;
      return {
        url,
        ok: false,
        error: getError instanceof Error ? getError.message : 'Unknown error',
        responseTime,
        method: 'GET',
      };
    }
  }
}

async function loadGameLinkSample(sampleSize: number): Promise<GameLinkSample[]> {
  try {
    return await withTimeout(
      db
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
        .limit(sampleSize),
      DB_SAMPLE_TIMEOUT_MS,
      'Game link database sample',
    );
  } catch (error) {
    console.warn(
      `⚠️  数据库抽样失败，改用本地游戏数据：${error instanceof Error ? error.message : String(error)}`
    );

    return mockGames
      .filter((game) => game.developerUrl || game.sourceUrl)
      .slice(0, sampleSize)
      .map((game) => ({
        id: game.id,
        title: game.title,
        developerUrl: game.developerUrl,
        sourceUrl: game.sourceUrl,
      }));
  }
}

/**
 * 检查页脚友情链接
 */
async function checkFooterLinks(): Promise<void> {
  console.log(`\n📋 检查页脚友情链接 (共 ${FOOTER_LINKS.length} 个)\n`);
  console.log('─'.repeat(80));

  let failedCount = 0;
  const results = await mapWithConcurrency(
    FOOTER_LINKS,
    LINK_CHECK_CONCURRENCY,
    async (link) => ({
      name: link.name,
      result: await checkLink(link.url),
    })
  );

  for (const { name, result } of results) {
    const icon = result.ok ? '✅' : '❌';
    const methodInfo = result.method ? `${result.method} ` : '';
    const statusInfo = result.status ? `${methodInfo}HTTP ${result.status}` : result.error || 'Timeout';
    const timeInfo = result.responseTime ? `${result.responseTime}ms` : '-';

    console.log(
      `${icon} ${name.padEnd(20)} ${statusInfo.padEnd(15)} ${timeInfo.padStart(8)} | ${result.url}`
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

  const gamesWithLinks = await loadGameLinkSample(sampleSize);

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
  console.log('\n🔍 Luma Game Hub 外链健康检查工具');
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
