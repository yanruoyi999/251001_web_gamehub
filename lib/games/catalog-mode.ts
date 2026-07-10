export function isLocalCatalogueMode(env: NodeJS.ProcessEnv = process.env) {
  return env.GAME_CATALOG_MODE?.trim().toLowerCase() === 'local';
}
