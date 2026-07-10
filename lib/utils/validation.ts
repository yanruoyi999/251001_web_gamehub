export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

function normalizeInteger(value: number | undefined): number | undefined {
  return Number.isFinite(value) && Number.isInteger(value) ? value : undefined;
}

function isLoopbackHostname(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function isValidId(id: unknown): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0;
}

export function isValidRating(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

export function validatePagination(page?: number, limit?: number): PaginationResult {
  const normalizedPage = normalizeInteger(page);
  const normalizedLimit = normalizeInteger(limit);

  const safePage = !normalizedPage || normalizedPage < 1 ? 1 : normalizedPage;
  const safeLimit = !normalizedLimit ? 20 : Math.min(Math.max(normalizedLimit, 1), 50);

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
}

export function sanitizeSearchQuery(query: string): string {
  return query.trim();
}

/**
 * Validate URLs that will be loaded by a browser or iframe.
 * Production content must use HTTPS; localhost HTTP remains available for development.
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || (
      parsed.protocol === 'http:' && isLoopbackHostname(parsed.hostname)
    );
  } catch {
    return false;
  }
}

export function isValidHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
