import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getGameById: vi.fn(),
  getGameBySlug: vi.fn(),
}));

vi.mock('@/services', () => ({
  GameService: {
    getGameById: mocks.getGameById,
    getGameBySlug: mocks.getGameBySlug,
  },
}));

vi.mock('@/lib/db/connection-policy', () => ({
  getDatabaseConnectionMetadata: () => ({ configured: true }),
  shouldSkipSupabaseDirectInServerless: () => false,
}));

vi.mock('@/lib/mock-games', () => ({
  getMockGameById: (id: number) => ({ id, slug: 'local-game' }),
  getMockGameBySlug: (slug: string) => ({ id: 1, slug }),
}));

vi.mock('@/lib/games/fallback-detail', () => ({
  buildFallbackGameDetail: (game: { id: number; slug: string }) => ({
    id: game.id,
    slug: game.slug,
    status: 'active',
  }),
}));

import { GET as getGameByIdRoute } from '@/app/api/games/[id]/route';
import { GET as getGameBySlugRoute } from '@/app/api/games/slug/[slug]/route';

describe('local catalogue game detail read boundary', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('never reads the database-backed id detail service in local mode', async () => {
    vi.stubEnv('GAME_CATALOG_MODE', 'local');

    const response = await getGameByIdRoute(
      new NextRequest('https://example.com/api/games/1'),
      { params: Promise.resolve({ id: '1' }) },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ id: 1, slug: 'local-game' });
    expect(mocks.getGameById).not.toHaveBeenCalled();
  });

  it('never reads the database-backed slug detail service in local mode', async () => {
    vi.stubEnv('GAME_CATALOG_MODE', 'local');

    const response = await getGameBySlugRoute(
      new NextRequest('https://example.com/api/games/slug/google-snake'),
      { params: Promise.resolve({ slug: 'google-snake' }) },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ id: 1, slug: 'google-snake' });
    expect(mocks.getGameBySlug).not.toHaveBeenCalled();
  });
});
