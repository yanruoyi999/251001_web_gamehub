export function isLocalCatalogueMode(env: NodeJS.ProcessEnv = process.env) {
  return env.GAME_CATALOG_MODE?.trim().toLowerCase() === 'local';
}

export function isCataloguePersistenceEnabled(env: NodeJS.ProcessEnv = process.env) {
  return !isLocalCatalogueMode(env);
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
