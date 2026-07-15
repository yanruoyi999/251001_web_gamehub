import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

import { GET as getFavorites } from '@/app/api/favorites/route';
import { GET as getRatings } from '@/app/api/ratings/route';
import { GET as getCounter } from '@/app/api/counters/[id]/route';
import { POST as login } from '@/app/api/admin/login/route';
import { POST as createGame } from '@/app/api/games/route';
import {
  DELETE as deleteGame,
  PATCH as updateGame,
} from '@/app/api/games/[id]/route';

describe('local catalogue API surface', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['favorites', () => getFavorites(new NextRequest('https://example.com/api/favorites'))],
    [
      'ratings',
      () => getRatings(new NextRequest('https://example.com/api/ratings?gameId=1')),
    ],
    [
      'counter',
      () =>
        getCounter(new NextRequest('https://example.com/api/counters/1'), {
          params: Promise.resolve({ id: '1' }),
        }),
    ],
    [
      'admin login',
      () =>
        login(
          new Request('https://example.com/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({ password: 'unused' }),
          }),
        ),
    ],
  ])('returns 404 for %s', async (_name, request) => {
    vi.stubEnv('GAME_CATALOG_MODE', 'local');

    const response = await request();

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: 'Not found' });
  });

  it.each([
    [
      'game create',
      () =>
        createGame(
          new NextRequest('https://example.com/api/games', {
            method: 'POST',
            body: JSON.stringify({ title: 'Test Game', iframeUrl: 'https://example.com/game' }),
          }),
        ),
    ],
    [
      'game update',
      () =>
        updateGame(
          new NextRequest('https://example.com/api/games/1', {
            method: 'PATCH',
            body: JSON.stringify({ title: 'Updated Game' }),
          }),
          { params: Promise.resolve({ id: '1' }) },
        ),
    ],
    [
      'game delete',
      () =>
        deleteGame(new NextRequest('https://example.com/api/games/1', { method: 'DELETE' }), {
          params: Promise.resolve({ id: '1' }),
        }),
    ],
  ])('returns 404 for %s writes', async (_name, request) => {
    vi.stubEnv('GAME_CATALOG_MODE', 'local');

    const response = await request();

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: 'Not found' });
  });
});
