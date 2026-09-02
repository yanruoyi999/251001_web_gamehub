export const NOINDEX_EXPERIMENT_GAME_SLUGS = [
  'daily-solitaire',
  'connect-the-dots',
  'sorting-games',
  'mahjong-connect',
  'asmr-games',
  'draw-a-perfect-circle',
  'chinese-checkers',
  'stacker-game',
  'two-player-games',
] as const;

const noindexExperimentGameSlugs = new Set<string>(NOINDEX_EXPERIMENT_GAME_SLUGS);

export function shouldExcludeNoindexExperimentGame(slug: string) {
  return noindexExperimentGameSlugs.has(slug);
}
