import { sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  getDatabaseConnectionMetadata,
  shouldSkipSupabaseDirectInServerless,
} from '@/lib/db/connection-policy';
import { getRedisClient } from '@/lib/redis';
import { getMeilisearchClient } from '@/lib/meilisearch';

export type HealthStatus = 'ok' | 'degraded' | 'error';
export type HealthMode = 'public' | 'internal';

export interface HealthCheckResult {
  name: 'database' | 'redis' | 'meilisearch';
  status: HealthStatus;
  message?: string;
}

export interface HealthSummary {
  status: HealthStatus;
  timestamp: string;
  services: Record<HealthCheckResult['name'], Omit<HealthCheckResult, 'name'>>;
}

const DEFAULT_CHECK_TIMEOUT_MS = 3500;

function publicMessage(name: HealthCheckResult['name'], status: HealthStatus) {
  if (status === 'ok') return undefined;
  if (name === 'database') return 'Database health check failed';
  if (name === 'redis') return 'Redis health check failed';
  return 'Search index health check failed';
}

function toMessage(error: unknown, name: HealthCheckResult['name'], mode: HealthMode) {
  if (mode === 'public') {
    return publicMessage(name, name === 'database' ? 'error' : 'degraded');
  }

  return error instanceof Error ? error.message : String(error);
}

export function sanitizeHealthResult(
  result: HealthCheckResult,
  mode: HealthMode,
): HealthCheckResult {
  if (mode === 'internal' || result.status === 'ok') return result;

  return {
    ...result,
    message: publicMessage(result.name, result.status),
  };
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = DEFAULT_CHECK_TIMEOUT_MS,
  label = 'Health check',
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export async function checkDatabase(mode: HealthMode, timeoutMs = DEFAULT_CHECK_TIMEOUT_MS) {
  const connection = getDatabaseConnectionMetadata();

  if (!connection.configured) {
    return {
      name: 'database',
      status: mode === 'public' ? 'degraded' : 'error',
      message:
        mode === 'public'
          ? publicMessage('database', 'degraded')
          : connection.warning ?? 'Database is not configured',
    } satisfies HealthCheckResult;
  }

  if (
    mode === 'public' &&
    process.env.HEALTH_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS !== 'true' &&
    shouldSkipSupabaseDirectInServerless(connection)
  ) {
    return {
      name: 'database',
      status: 'degraded',
      message: publicMessage('database', 'degraded'),
    } satisfies HealthCheckResult;
  }

  try {
    await withTimeout(db.execute(sql`select 1`), timeoutMs, 'Database health check');
    return { name: 'database', status: 'ok' } satisfies HealthCheckResult;
  } catch (error) {
    return {
      name: 'database',
      status: mode === 'public' ? 'degraded' : 'error',
      message: toMessage(error, 'database', mode),
    } satisfies HealthCheckResult;
  }
}

export async function checkRedis(mode: HealthMode, timeoutMs = DEFAULT_CHECK_TIMEOUT_MS) {
  const redis = getRedisClient();
  if (!redis) {
    return {
      name: 'redis',
      status: 'degraded',
      message: mode === 'public' ? publicMessage('redis', 'degraded') : 'Redis not configured',
    } satisfies HealthCheckResult;
  }

  try {
    await withTimeout(redis.ping(), timeoutMs, 'Redis health check');
    return { name: 'redis', status: 'ok' } satisfies HealthCheckResult;
  } catch (error) {
    return {
      name: 'redis',
      status: 'degraded',
      message: toMessage(error, 'redis', mode),
    } satisfies HealthCheckResult;
  }
}

export async function checkMeilisearch(mode: HealthMode, timeoutMs = DEFAULT_CHECK_TIMEOUT_MS) {
  const meilisearch = getMeilisearchClient();

  if (!meilisearch) {
    return {
      name: 'meilisearch',
      status: 'degraded',
      message:
        mode === 'public' ? publicMessage('meilisearch', 'degraded') : 'Meilisearch not configured',
    } satisfies HealthCheckResult;
  }

  try {
    await withTimeout(meilisearch.health(), timeoutMs, 'Meilisearch health check');
    return { name: 'meilisearch', status: 'ok' } satisfies HealthCheckResult;
  } catch (error) {
    return {
      name: 'meilisearch',
      status: 'degraded',
      message: toMessage(error, 'meilisearch', mode),
    } satisfies HealthCheckResult;
  }
}

export async function getHealthSummary(
  mode: HealthMode = 'public',
  timeoutMs = DEFAULT_CHECK_TIMEOUT_MS,
): Promise<HealthSummary> {
  const results = await Promise.all([
    checkDatabase(mode, timeoutMs),
    checkRedis(mode, timeoutMs),
    checkMeilisearch(mode, timeoutMs),
  ]);

  const status = results.reduce<HealthStatus>((current, item) => {
    if (item.status === 'error') return 'error';
    if (item.status === 'degraded' && current !== 'error') return 'degraded';
    return current;
  }, 'ok');

  return {
    status,
    timestamp: new Date().toISOString(),
    services: Object.fromEntries(
      results.map((result) => {
        const sanitized = sanitizeHealthResult(result, mode);
        return [
          sanitized.name,
          {
            status: sanitized.status,
            ...(sanitized.message ? { message: sanitized.message } : {}),
          },
        ];
      }),
    ) as HealthSummary['services'],
  };
}
