import { describe, expect, it } from 'vitest';

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
});
