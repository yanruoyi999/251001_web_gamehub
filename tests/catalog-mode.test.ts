import { describe, expect, it } from 'vitest';

import { getDatabaseConnectionMetadata } from '@/lib/db/connection-policy';
import * as catalogMode from '@/lib/games/catalog-mode';

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

    const getCapabilities = (catalogMode as {
      getCatalogueUiCapabilities: (env: NodeJS.ProcessEnv) => {
        showCommunityMetrics: boolean;
        showReviews: boolean;
        showPublishedDates: boolean;
        favoriteStorage: string;
      };
    }).getCatalogueUiCapabilities;

    expect(getCapabilities({ ...process.env, GAME_CATALOG_MODE: 'local' })).toEqual({
      showCommunityMetrics: false,
      showReviews: false,
      showPublishedDates: false,
      favoriteStorage: 'local',
    });
  });

  it('keeps persistent engagement enabled in database catalogue mode', () => {
    expect(catalogMode).toHaveProperty('getCatalogueUiCapabilities');

    const getCapabilities = (catalogMode as {
      getCatalogueUiCapabilities: (env: NodeJS.ProcessEnv) => {
        showCommunityMetrics: boolean;
        showReviews: boolean;
        showPublishedDates: boolean;
        favoriteStorage: string;
      };
    }).getCatalogueUiCapabilities;

    expect(getCapabilities({ ...process.env, GAME_CATALOG_MODE: 'database' })).toEqual({
      showCommunityMetrics: true,
      showReviews: true,
      showPublishedDates: true,
      favoriteStorage: 'remote-with-local-fallback',
    });
  });

  it('never reads the remote catalogue database in local mode', () => {
    expect(catalogMode).toHaveProperty('shouldUseCatalogueDatabase');

    const shouldUseCatalogueDatabase = (catalogMode as {
      shouldUseCatalogueDatabase: (
        connection: ReturnType<typeof getDatabaseConnectionMetadata>,
        env: NodeJS.ProcessEnv,
      ) => boolean;
    }).shouldUseCatalogueDatabase;
    const connection = getDatabaseConnectionMetadata(
      'postgresql://user:password@example.com:5432/gamehub',
      { ...process.env, VERCEL: '1' },
    );

    expect(
      shouldUseCatalogueDatabase(connection, {
        ...process.env,
        GAME_CATALOG_MODE: 'local',
        GAME_DETAIL_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS: 'true',
        GAME_LIST_ALLOW_SUPABASE_DIRECT_IN_SERVERLESS: 'true',
      }),
    ).toBe(false);
  });
});
