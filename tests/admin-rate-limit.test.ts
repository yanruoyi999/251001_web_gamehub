import { afterEach, describe, expect, it, vi } from 'vitest';

const redis = vi.hoisted(() => ({
  client: null as null | {
    incr: ReturnType<typeof vi.fn>;
    expire: ReturnType<typeof vi.fn>;
    del: ReturnType<typeof vi.fn>;
  },
}));

vi.mock('@/lib/redis', () => ({
  getRedisClient: () => redis.client,
}));

import {
  clearAdminLoginAttempts,
  consumeAdminLoginAttempt,
} from '@/lib/auth/admin-rate-limit';

describe('admin login rate limit', () => {
  afterEach(() => {
    redis.client = null;
  });

  it('fails closed when shared Redis is unavailable', async () => {
    await expect(consumeAdminLoginAttempt('ip-hash')).resolves.toEqual({
      available: false,
      allowed: false,
      retryAfterSeconds: 0,
    });
  });

  it('uses a shared counter and expiry window', async () => {
    redis.client = {
      incr: vi.fn().mockResolvedValue(1),
      expire: vi.fn().mockResolvedValue(1),
      del: vi.fn().mockResolvedValue(1),
    };

    await expect(consumeAdminLoginAttempt('ip-hash', 5, 900)).resolves.toEqual({
      available: true,
      allowed: true,
      retryAfterSeconds: 0,
    });
    expect(redis.client.incr).toHaveBeenCalledWith('gamehub:admin-login:ip-hash');
    expect(redis.client.expire).toHaveBeenCalledWith('gamehub:admin-login:ip-hash', 900);
    await expect(clearAdminLoginAttempts('ip-hash')).resolves.toBe(true);
    expect(redis.client.del).toHaveBeenCalledWith('gamehub:admin-login:ip-hash');
  });

  it('fails closed when the Redis operation errors', async () => {
    redis.client = {
      incr: vi.fn().mockRejectedValue(new Error('connection failed')),
      expire: vi.fn(),
      del: vi.fn(),
    };

    await expect(consumeAdminLoginAttempt('ip-hash')).resolves.toMatchObject({
      available: false,
      allowed: false,
    });
  });
});
