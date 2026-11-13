const publicGamePages = new Set([
  '/games',
  '/en/games',
  '/games/tunnel-rush',
  '/en/games/tunnel-rush',
]);

export function isPublicCatalogDocument(request: Request): boolean {
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.search ||
    !publicGamePages.has(url.pathname)
  ) {
    return false;
  }

  const headers = request.headers;
  return ![
    'authorization',
    'cookie',
    'range',
    'rsc',
    'next-router-state-tree',
    'next-router-prefetch',
    'next-router-segment-prefetch',
    'next-action',
  ].some(header => headers.has(header));
}
