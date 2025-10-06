import { sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { getMeilisearchClient } from '@/lib/meilisearch';

interface Result {
  name: string;
  status: 'ok' | 'degraded' | 'error';
  detail?: string;
}

async function checkDatabase(): Promise<Result> {
  try {
    await db.execute(sql`select 1`);
    return { name: 'database', status: 'ok' };
  } catch (error) {
    return { name: 'database', status: 'error', detail: (error as Error).message };
  }
}

async function checkRedis(): Promise<Result> {
  if (!redis) {
    return { name: 'redis', status: 'degraded', detail: 'Redis not configured' };
  }

  try {
    await redis.ping();
    return { name: 'redis', status: 'ok' };
  } catch (error) {
    return { name: 'redis', status: 'degraded', detail: (error as Error).message };
  }
}

async function checkMeilisearch(): Promise<Result> {
  const meilisearch = getMeilisearchClient();

  if (!meilisearch) {
    return { name: 'meilisearch', status: 'degraded', detail: 'Meilisearch not configured' };
  }

  try {
    await meilisearch.health();
    return { name: 'meilisearch', status: 'ok' };
  } catch (error) {
    return { name: 'meilisearch', status: 'degraded', detail: (error as Error).message };
  }
}

async function main() {
  const results = await Promise.all([checkDatabase(), checkRedis(), checkMeilisearch()]);
  const worst = results.reduce<'ok' | 'degraded' | 'error'>((acc, item) => {
    if (item.status === 'error') return 'error';
    if (item.status === 'degraded' && acc !== 'error') return 'degraded';
    return acc;
  }, 'ok');

  console.log('GameHub Ops Status:\n');
  results.forEach((item) => {
    const icon = item.status === 'ok' ? '✅' : item.status === 'degraded' ? '⚠️ ' : '❌';
    console.log(`${icon} ${item.name}: ${item.status}${item.detail ? ` (${item.detail})` : ''}`);
  });

  console.log(`\nOverall: ${worst}\n`);

  if (worst === 'error') {
    process.exitCode = 1;
  }
}

main();
