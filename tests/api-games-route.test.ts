import { beforeEach, describe, expect, it, vi } from 'vitest';

const getContextFromHeadersMock = vi.fn();
const listFavoriteIdsMock = vi.fn();
const listGamesMock = vi.fn();
const getDatabaseConnectionMetadataMock = vi.fn();
const shouldSkipSupabaseDirectInServerlessMock = vi.fn();

vi.mock('@/services', () => ({
  FavoriteService: {
    getContextFromHeaders: getContextFromHeadersMock,
    listFavoriteIds: listFavoriteIdsMock,
  },
  GameService: {
    listGames: listGamesMock,
    createGame: vi.fn(),
  },
}));

vi.mock('@/lib/db/connection-policy', () => ({
  getDatabaseConnectionMetadata: getDatabaseConnectionMetadataMock,
  shouldSkipSupabaseDirectInServerless: shouldSkipSupabaseDirectInServerlessMock,
}));

describe('/api/games route fallback', () => {
  beforeEach(() => {
    delete process.env.GAME_CATALOG_MODE;
    vi.resetModules();
    getContextFromHeadersMock.mockReset();
    listFavoriteIdsMock.mockReset();
    listGamesMock.mockReset();
    getDatabaseConnectionMetadataMock.mockReset();
    shouldSkipSupabaseDirectInServerlessMock.mockReset();

    getContextFromHeadersMock.mockReturnValue({ userId: 'test-user' });
    listFavoriteIdsMock.mockResolvedValue([]);
    getDatabaseConnectionMetadataMock.mockReturnValue({ configured: true });
    shouldSkipSupabaseDirectInServerlessMock.mockReturnValue(false);
  });

  it('returns a degraded local catalogue when the database list fails', async () => {
    listGamesMock.mockRejectedValue(new Error('database unavailable'));

    const { GET } = await import('@/app/api/games/route');
    const response = await GET(new Request('http://test.local/api/games?search=snake&limit=5') as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.degraded).toBe(true);
    expect(payload.source).toBe('fallback');
    expect(payload.games.some((game: { slug: string }) => game.slug === 'google-snake')).toBe(true);
  });

  it('skips the database when configuration is not safe for public runtime', async () => {
    getDatabaseConnectionMetadataMock.mockReturnValue({ configured: false });

    const { GET } = await import('@/app/api/games/route');
    const response = await GET(new Request('http://test.local/api/games?search=snake&limit=5') as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.degraded).toBe(true);
    expect(payload.source).toBe('fallback');
    expect(listGamesMock).not.toHaveBeenCalled();
  });

  it('reports the checked-in catalogue as healthy in explicit local mode', async () => {
    process.env.GAME_CATALOG_MODE = 'local';
    getDatabaseConnectionMetadataMock.mockReturnValue({ configured: false });

    const { GET } = await import('@/app/api/games/route');
    const response = await GET(new Request('http://test.local/api/games?search=snake&limit=5') as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.degraded).toBe(false);
    expect(payload.source).toBe('fallback');
    expect(listGamesMock).not.toHaveBeenCalled();
  });
});
