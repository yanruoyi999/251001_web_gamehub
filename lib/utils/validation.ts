export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

export function isValidId(id: unknown): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0;
}

export function isValidRating(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

export function validatePagination(page?: number, limit?: number): PaginationResult {
  const safePage = !page || page < 1 ? 1 : page;
  const safeLimit = !limit ? 20 : Math.min(Math.max(limit, 1), 50);

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
}

export function sanitizeSearchQuery(query: string): string {
  return query.trim();
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
