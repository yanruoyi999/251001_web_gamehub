import { getRedisClient } from '@/lib/redis';

const ADMIN_LOGIN_RATE_LIMIT_KEY_PREFIX = 'gamehub:admin-login:';
const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_WINDOW_SECONDS = 15 * 60;
const DEFAULT_REDIS_TIMEOUT_MS = 1_000;

export type AdminLoginRateLimitResult =
  | { available: true; allowed: true; retryAfterSeconds: 0 }
  | { available: true; allowed: false; retryAfterSeconds: number }
  | { available: false; allowed: false; retryAfterSeconds: 0 };

function withTimeout<T>(promise: Promise<T>, timeoutMs = DEFAULT_REDIS_TIMEOUT_MS) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Admin login rate limit timed out')), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function keyFor(clientKey: string) {
  return `${ADMIN_LOGIN_RATE_LIMIT_KEY_PREFIX}${clientKey}`;
}

export async function consumeAdminLoginAttempt(
  clientKey: string,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  windowSeconds = DEFAULT_WINDOW_SECONDS,
): Promise<AdminLoginRateLimitResult> {
  const client = getRedisClient();
  if (!client) {
    return { available: false, allowed: false, retryAfterSeconds: 0 };
  }

  try {
    const count = Number(await withTimeout(client.incr(keyFor(clientKey))));
    if (count === 1) {
      await withTimeout(client.expire(keyFor(clientKey), windowSeconds));
    }

    if (!Number.isInteger(count) || count < 1) {
      return { available: false, allowed: false, retryAfterSeconds: 0 };
    }

    return count <= maxAttempts
      ? { available: true, allowed: true, retryAfterSeconds: 0 }
      : { available: true, allowed: false, retryAfterSeconds: windowSeconds };
  } catch (error) {
    console.error('Admin login rate limit unavailable:', error);
    return { available: false, allowed: false, retryAfterSeconds: 0 };
  }
}

export async function clearAdminLoginAttempts(clientKey: string) {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await withTimeout(client.del(keyFor(clientKey)));
    return true;
  } catch (error) {
    console.warn('Admin login rate limit reset failed:', error);
    return false;
  }
}
