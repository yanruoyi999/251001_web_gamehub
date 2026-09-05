import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { getMockGameBySlug } from '@/lib/mock-games';

const mocks = vi.hoisted(() => ({ read: vi.fn(), connection: vi.fn(), unsafe: vi.fn() }));
vi.mock('@/services', () => ({ GameService: { getGameById: mocks.read, getGameBySlug: mocks.read } }));
vi.mock('@/lib/db/connection-policy', () => ({
  getDatabaseConnectionMetadata: mocks.connection,
  shouldSkipSupabaseDirectInServerless: mocks.unsafe,
}));

import { GET as byId } from '@/app/api/games/[id]/route';
import { GET as bySlug } from '@/app/api/games/slug/[slug]/route';
const game = getMockGameBySlug('google-snake')!;
const endpoints = [
  { name: 'id', get: () => byId(new NextRequest(`https://example.test/api/games/${game.id}`), { params: Promise.resolve({ id: String(game.id) }) }) },
  { name: 'slug', get: () => bySlug(new NextRequest('https://example.test/api/games/slug/google-snake'), { params: Promise.resolve({ slug: 'google-snake' }) }) },
];

describe.each(endpoints)('detail GET $name mode boundary', ({ get }) => {
  beforeEach(() => {
    vi.stubEnv('GAME_CATALOG_MODE', 'local');
    mocks.read.mockReset().mockResolvedValue({ id: game.id, slug: 'remote-sentinel', status: 'active' });
    mocks.connection.mockReturnValue({ configured: true });
    mocks.unsafe.mockReturnValue(false);
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

  it.each(['local', '', 'typo'])('never calls remote services in mode %j even when DB is configured', async mode => {
    vi.stubEnv('GAME_CATALOG_MODE', mode);
    const response = await get();
    expect(response.status).toBe(200);
    expect((await response.json()).slug).toBe('google-snake');
    expect(mocks.read).not.toHaveBeenCalled();
  });
  it('uses remote only when explicitly opted in and configured', async () => {
    vi.stubEnv('GAME_CATALOG_MODE', 'remote');
    expect((await (await get()).json()).slug).toBe('remote-sentinel');
    expect(mocks.read).toHaveBeenCalledOnce();
  });
  it('does not revive a confirmed inactive remote record', async () => {
    vi.stubEnv('GAME_CATALOG_MODE', 'remote');
    mocks.read.mockResolvedValue({ status: 'inactive' });
    expect((await get()).status).toBe(404);
  });
  it('skips missing or unsafe DB settings', async () => {
    vi.stubEnv('GAME_CATALOG_MODE', 'remote');
    mocks.connection.mockReturnValue({ configured: false });
    expect((await get()).status).toBe(200);
    mocks.connection.mockReturnValue({ configured: true });
    mocks.unsafe.mockReturnValue(true);
    expect((await get()).status).toBe(200);
    expect(mocks.read).not.toHaveBeenCalled();
  });
  it('times out a remote lookup and returns the local record', async () => {
    vi.stubEnv('GAME_CATALOG_MODE', 'remote');
    vi.stubEnv('GAME_DETAIL_BACKEND_TIMEOUT_MS', '20');
    mocks.read.mockReturnValue(new Promise(() => {}));
    vi.useFakeTimers();
    const pending = get();
    await vi.advanceTimersByTimeAsync(21);
    expect((await (await pending).json()).slug).toBe('google-snake');
  });
});
