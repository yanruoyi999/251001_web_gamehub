import { afterEach, describe, expect, it } from 'vitest';

import {
  checkDatabase,
  checkMeilisearch,
  checkRedis,
  getHealthSummary,
  sanitizeHealthResult,
} from '@/lib/ops/health';

const originalCatalogMode = process.env.GAME_CATALOG_MODE;
const originalCacheMode = process.env.CACHE_MODE;

afterEach(() => {
  if (originalCatalogMode === undefined) {
    delete process.env.GAME_CATALOG_MODE;
  } else {
    process.env.GAME_CATALOG_MODE = originalCatalogMode;
  }

  if (originalCacheMode === undefined) {
    delete process.env.CACHE_MODE;
  } else {
    process.env.CACHE_MODE = originalCacheMode;
  }
});

describe('sanitizeHealthResult', () => {
  it('hides dependency error details in public health responses', () => {
    const result = sanitizeHealthResult(
      {
        name: 'database',
        status: 'error',
        message: 'getaddrinfo ENOTFOUND db.example.supabase.co',
      },
      'public',
    );

    expect(result.status).toBe('error');
    expect(result.message).toBe('Database health check failed');
    expect(result.message).not.toContain('supabase.co');
  });

  it('keeps dependency error details for internal health checks', () => {
    const result = sanitizeHealthResult(
      {
        name: 'database',
        status: 'error',
        message: 'getaddrinfo ENOTFOUND db.example.supabase.co',
      },
      'internal',
    );

    expect(result.message).toBe('getaddrinfo ENOTFOUND db.example.supabase.co');
  });
});

describe('local catalogue health', () => {
  it('exposes structured runtime modes for remote monitoring', async () => {
    process.env.GAME_CATALOG_MODE = 'local';
    process.env.CACHE_MODE = 'local';

    await expect(getHealthSummary('public')).resolves.toMatchObject({
      status: 'ok',
      modes: {
        catalogue: 'local',
        cache: 'local',
      },
    });
  });

  it('treats the database as intentionally disabled', async () => {
    process.env.GAME_CATALOG_MODE = 'local';

    await expect(checkDatabase('internal')).resolves.toEqual({
      name: 'database',
      status: 'ok',
      message: 'Local catalogue mode enabled; persistent database is intentionally disabled',
    });
  });

  it('treats Meilisearch as intentionally disabled', async () => {
    process.env.GAME_CATALOG_MODE = 'local';

    await expect(checkMeilisearch('internal')).resolves.toEqual({
      name: 'meilisearch',
      status: 'ok',
      message: 'Local catalogue mode enabled; local search is active',
    });
  });

  it('treats the remote cache as intentionally disabled', async () => {
    process.env.CACHE_MODE = 'local';

    await expect(checkRedis('internal')).resolves.toEqual({
      name: 'redis',
      status: 'ok',
      message: 'Local cache mode enabled; remote Redis is intentionally disabled',
    });
  });
});
