import { sql } from 'drizzle-orm';

import './load-env';

import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { getMeilisearchClient } from '@/lib/meilisearch';

const CHECK_TIMEOUT_MS = 5000;

interface Result {
  name: string;
  status: 'ok' | 'degraded' | 'error';
  detail?: string;
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

async function checkDatabase(): Promise<Result> {
  try {
    await withTimeout(db.execute(sql`select 1`), CHECK_TIMEOUT_MS, 'Database health check');
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
    await withTimeout(redis.ping(), CHECK_TIMEOUT_MS, 'Redis health check');
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
    await withTimeout(meilisearch.health(), CHECK_TIMEOUT_MS, 'Meilisearch health check');
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

  process.exit(worst === 'error' ? 1 : 0);
}

main();
