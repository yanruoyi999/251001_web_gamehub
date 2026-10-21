import { createHash } from 'node:crypto';
import path from 'node:path';

/** Resolve the pinned Next runtime cache from its build seed's owner metadata. */
export function scopedHtmlPath(serverRoot: string, route: string, metadata: unknown): string {
  const seed = metadata as { routeCache?: { key?: unknown; owner?: { kind?: unknown; sourceRoute?: unknown } } } | null;
  const owner = seed?.routeCache?.owner;
  if (owner?.kind !== 'APP_PAGE' || typeof owner.sourceRoute !== 'string' ||
      !/^[a-z0-9/-]+$/i.test(route) || route.split('/').some(part => !part)) {
    throw new Error(`Invalid ISR seed owner or route: ${route}`);
  }
  const hash = createHash('sha256').update(owner.sourceRoute).digest('hex');
  const key = `/route-cache/APP_PAGE/${hash}/$/${route}`;
  if (seed?.routeCache?.key !== key) throw new Error(`ISR seed cache key mismatch: ${route}`);
  return path.join(serverRoot, `${key}.html`);
}

/** Seed promotion preserves old freshness even though its copied file is new. */
export function isRegeneratedCache(mtimeMs: number, metadata: unknown, expiredAt: number): boolean {
  const meta = metadata as { routeCacheLastModified?: unknown } | null;
  const freshness = meta?.routeCacheLastModified ?? mtimeMs;
  return typeof freshness === 'number' && Number.isFinite(freshness) &&
    mtimeMs > expiredAt + 1000 && freshness > expiredAt + 1000;
}
