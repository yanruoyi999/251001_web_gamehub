import type { DatabaseConnectionMetadata } from '@/lib/db/connection-policy';

export type CatalogueMode = 'local' | 'remote';

export function getCatalogueMode(env: NodeJS.ProcessEnv = process.env): CatalogueMode {
  const configuredMode = env.GAME_CATALOG_MODE?.trim().toLowerCase();

  // Remote persistence is opt-in. A missing or unknown value must never make
  // a production request attempt an unverified database connection.
  return configuredMode === 'remote' || configuredMode === 'database' ? 'remote' : 'local';
}

export function isLocalCatalogueMode(env: NodeJS.ProcessEnv = process.env) {
  return getCatalogueMode(env) === 'local';
}

export function isCataloguePersistenceEnabled(env: NodeJS.ProcessEnv = process.env) {
  return getCatalogueMode(env) === 'remote';
}

export function shouldUseCatalogueDatabase(
  connection: DatabaseConnectionMetadata,
  env: NodeJS.ProcessEnv = process.env,
) {
  return isCataloguePersistenceEnabled(env) && connection.configured;
}

export function getCatalogueUiCapabilities(env: NodeJS.ProcessEnv = process.env) {
  const localCatalogue = isLocalCatalogueMode(env);

  return {
    showCommunityMetrics: !localCatalogue,
    showReviews: !localCatalogue,
    showPublishedDates: !localCatalogue,
    favoriteStorage: localCatalogue
      ? ('local' as const)
      : ('remote-with-local-fallback' as const),
  };
}
