import type { Redis } from '@upstash/redis';
import {
  isRedisTemporarilyDisabled,
  recordRedisFailure,
  recordRedisSuccess,
} from '@/lib/redis';

const DEFAULT_REDIS_TIMEOUT_MS = 1500;

function redisTimeoutMs() {
  const parsed = Number(process.env.REDIS_OPERATION_TIMEOUT_MS);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_REDIS_TIMEOUT_MS;
}

function withRedisTimeout<T>(promise: Promise<T>, operation: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Redis ${operation} timed out after ${redisTimeoutMs()}ms`));
    }, redisTimeoutMs());
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export async function getJson<T>(client: Redis | null, key: string): Promise<T | null> {
  if (!client || isRedisTemporarilyDisabled()) return null;
  try {
    const value = await withRedisTimeout(client.get<string>(key), 'read');
    recordRedisSuccess();
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    recordRedisFailure('read', error);
    return null;
  }
}

export async function setJson(client: Redis | null, key: string, value: unknown, ttlSeconds?: number) {
  if (!client || isRedisTemporarilyDisabled()) return;
  try {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await withRedisTimeout(client.setex(key, ttlSeconds, payload), 'write');
    } else {
      await withRedisTimeout(client.set(key, payload), 'write');
    }
    recordRedisSuccess();
  } catch (error) {
    recordRedisFailure('write', error);
  }
}

export async function delKey(client: Redis | null, key: string) {
  if (!client || isRedisTemporarilyDisabled()) return;
  try {
    await withRedisTimeout(client.del(key), 'delete');
    recordRedisSuccess();
  } catch (error) {
    recordRedisFailure('delete', error);
  }
}
