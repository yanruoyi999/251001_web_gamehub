export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

const MAX_SEARCH_QUERY_LENGTH = 120;
const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g;
const SQL_LIKE_WILDCARDS = /[%_]/g;

function normalizeInteger(value: number | undefined): number | undefined {
  return Number.isFinite(value) && Number.isInteger(value) ? value : undefined;
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
  return query
    .replace(CONTROL_CHARACTERS, ' ')
    .replace(SQL_LIKE_WILDCARDS, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_SEARCH_QUERY_LENGTH)
    .trim();
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export function isValidHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch (error) {
    return false;
  }
}
