import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { getMeilisearchClient } from '@/lib/meilisearch';

export async function GET() {
  const summary: Record<string, { status: 'ok' | 'degraded' | 'error'; message?: string }> = {
    database: { status: 'ok' },
    redis: { status: 'ok' },
    meilisearch: { status: 'ok' },
  };

  try {
    await db.execute(sql`select 1`);
  } catch (error) {
    summary.database = { status: 'error', message: (error as Error).message };
  }

  if (redis) {
    try {
      await redis.ping();
    } catch (error) {
      summary.redis = { status: 'degraded', message: (error as Error).message };
    }
  } else {
    summary.redis = { status: 'degraded', message: 'Redis not configured' };
  }

  const meilisearch = getMeilisearchClient();
  if (meilisearch) {
    try {
      await meilisearch.health();
    } catch (error) {
      summary.meilisearch = { status: 'degraded', message: (error as Error).message };
    }
  } else {
    summary.meilisearch = { status: 'degraded', message: 'Meilisearch not configured' };
  }

  const isHealthy = Object.values(summary).every((item) => item.status === 'ok');

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: summary,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
