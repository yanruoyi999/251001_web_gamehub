import type { Redis } from '@upstash/redis';

export async function getJson<T>(client: Redis | null, key: string): Promise<T | null> {
  if (!client) return null;
  try {
    const value = await client.get<string>(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.warn('Redis read failed:', error);
    return null;
  }
}

export async function setJson(client: Redis | null, key: string, value: unknown, ttlSeconds?: number) {
  if (!client) return;
  try {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, payload);
    } else {
      await client.set(key, payload);
    }
  } catch (error) {
    console.warn('Redis write failed:', error);
  }
}

export async function delKey(client: Redis | null, key: string) {
  if (!client) return;
  try {
    await client.del(key);
  } catch (error) {
    console.warn('Redis delete failed:', error);
  }
}
