import { describe, expect, it } from 'vitest';

import { getDatabaseConnectionMetadata } from '@/lib/db/connection-policy';
import {
  getCatalogueMode,
  getCatalogueUiCapabilities,
  isCataloguePersistenceEnabled,
  isLocalCatalogueMode,
} from '@/lib/games/catalog-mode';
import * as catalogMode from '@/lib/games/catalog-mode';

function testEnv(overrides: Partial<NodeJS.ProcessEnv> = {}): NodeJS.ProcessEnv {
  const env = { ...process.env } as NodeJS.ProcessEnv;
  delete env.GAME_CATALOG_MODE;
  Object.assign(env, overrides);
  return env;
}

describe('catalogue mode safety', () => {
  it('fails closed to local mode when the mode is missing or unknown', () => {
    expect(getCatalogueMode(testEnv())).toBe('local');
    expect(getCatalogueMode(testEnv({ GAME_CATALOG_MODE: 'unexpected' }))).toBe('local');
    expect(isLocalCatalogueMode(testEnv())).toBe(true);
    expect(isCataloguePersistenceEnabled(testEnv())).toBe(false);
  });

  it('requires an explicit remote/database mode for persistence', () => {
    expect(getCatalogueMode(testEnv({ GAME_CATALOG_MODE: 'remote' }))).toBe('remote');
    expect(getCatalogueMode(testEnv({ GAME_CATALOG_MODE: 'database' }))).toBe('remote');
    expect(isCataloguePersistenceEnabled(testEnv({ GAME_CATALOG_MODE: 'remote' }))).toBe(true);
    expect(getCatalogueUiCapabilities(testEnv())).toMatchObject({
      showCommunityMetrics: false,
      showReviews: false,
      showPublishedDates: false,
      favoriteStorage: 'local',
    });
  });
});

describe('catalogue UI capabilities', () => {
  it('disables server persistence in local catalogue mode', () => {
    expect(
      catalogMode.isCataloguePersistenceEnabled({
        ...process.env,
        GAME_CATALOG_MODE: 'local',
      }),
    ).toBe(false);

    expect(
      catalogMode.isCataloguePersistenceEnabled({
        ...process.env,
        GAME_CATALOG_MODE: 'database',
      }),
    ).toBe(true);
  });

  it('uses local favorites and hides persistent engagement in local catalogue mode', () => {
    expect(catalogMode).toHaveProperty('getCatalogueUiCapabilities');
    expect(catalogMode.getCatalogueUiCapabilities({
      ...process.env,
      GAME_CATALOG_MODE: 'local',
    })).toEqual({
      showCommunityMetrics: false,
      showReviews: false,
      showPublishedDates: false,
      favoriteStorage: 'local',
    });
  });

  it('keeps persistent engagement enabled in database catalogue mode', () => {
    expect(catalogMode.getCatalogueUiCapabilities({
      ...process.env,
      GAME_CATALOG_MODE: 'database',
    })).toEqual({
      showCommunityMetrics: true,
      showReviews: true,
      showPublishedDates: true,
      favoriteStorage: 'remote-with-local-fallback',
    });
  });

  it('never reads the remote catalogue database in local mode', () => {
    const connection = getDatabaseConnectionMetadata(
      'postgresql://user:password@example.com:5432/gamehub',
      { ...process.env, VERCEL: '1' },
    );

    expect(
      catalogMode.shouldUseCatalogueDatabase(connection, {
        ...process.env,
        GAME_CATALOG_MODE: 'local',
        GAME_DETAIL_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS: 'true',
        GAME_LIST_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS: 'true',
      }),
    ).toBe(false);
  });
});
