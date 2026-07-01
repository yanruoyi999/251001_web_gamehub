import type { Redis } from '@upstash/redis';
import {
  isRedisTemporarilyDisabled,
  recordRedisFailure,
  recordRedisSuccess,
} from '@/lib/redis';

export async function getJson<T>(client: Redis | null, key: string): Promise<T | null> {
  if (!client || isRedisTemporarilyDisabled()) return null;
  try {
    const value = await client.get<string>(key);
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
      await client.setex(key, ttlSeconds, payload);
    } else {
      await client.set(key, payload);
    }
    recordRedisSuccess();
  } catch (error) {
    recordRedisFailure('write', error);
  }
}

export async function delKey(client: Redis | null, key: string) {
  if (!client || isRedisTemporarilyDisabled()) return;
  try {
    await client.del(key);
    recordRedisSuccess();
  } catch (error) {
    recordRedisFailure('delete', error);
  }
}
