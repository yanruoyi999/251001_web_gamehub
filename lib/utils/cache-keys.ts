const NAMESPACE = 'gamehub';

export const CacheTTL = {
  GAME_DETAILS: 60, // 1 minute
  GAME_LIST: 300,
  TAXONOMY: 3600,
  STATS: 300,
  PLAY_COUNT: 60,
  RATE_LIMIT: 3600,
  USER_RATING: 24 * 60 * 60,
  SEARCH_RESULTS: 120,
} as const;

export const GameCacheKeys = {
  byId: (id: number) => `${NAMESPACE}:game:${id}:details`,
  bySlug: (slug: string) => `${NAMESPACE}:game:slug:${slug}`,
  list: (hash: string) => `${NAMESPACE}:game:list:${hash}`,
};

export const TaxonomyCacheKeys = {
  categories: () => `${NAMESPACE}:taxonomy:categories`,
  tags: () => `${NAMESPACE}:taxonomy:tags`,
};

export const StatsCacheKeys = {
  rating: (gameId: number) => `${NAMESPACE}:stats:${gameId}:rating`,
  distribution: (gameId: number) => `${NAMESPACE}:stats:${gameId}:distribution`,
  playCount: (gameId: number) => `${NAMESPACE}:stats:${gameId}:play`,
  globalStats: () => `${NAMESPACE}:stats:global`,
};

export const CounterCacheKeys = {
  total: (gameId: number) => `${NAMESPACE}:counter:${gameId}:total`,
  today: (gameId: number) => `${NAMESPACE}:counter:${gameId}:today`,
};

export const RatingCacheKeys = {
  rateLimit: (ipHash: string) => `${NAMESPACE}:rating:limit:${ipHash}`,
  userRating: (gameId: number, userIdentifier: string) =>
    `${NAMESPACE}:rating:${gameId}:user:${userIdentifier}`,
  distribution: (gameId: number) => `${NAMESPACE}:rating:${gameId}:distribution`,
};

export const SearchCacheKeys = {
  results: (query: string, filters: Record<string, unknown>) => {
    const hash = Buffer.from(JSON.stringify({ query, filters })).toString('base64');
    return `${NAMESPACE}:search:${hash}`;
  },
};
