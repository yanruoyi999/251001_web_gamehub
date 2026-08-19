import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

function path(relativePath: string) {
  return fileURLToPath(new URL(`../${relativePath}`, import.meta.url));
}

function source(relativePath: string) {
  return readFileSync(path(relativePath), 'utf8');
}

describe('online games for couples discovery', () => {
  it('publishes the couples hub through sitemap and relevant SSR contextual surfaces', () => {
    const sitemap = source('app/sitemap.ts');
    const gamesLayout = source('app/[locale]/games/layout.tsx');
    const guideLayoutPath = path('app/[locale]/guides/[slug]/layout.tsx');
    const home = source('app/[locale]/page.tsx');

    expect(sitemap).toContain("path: '/games/online-games-for-couples'");
    expect(gamesLayout).toContain("'/games/online-games-for-couples'");
    expect(gamesLayout).toContain('Couple');
    expect(existsSync(guideLayoutPath)).toBe(true);

    const guideLayout = readFileSync(guideLayoutPath, 'utf8');
    expect(guideLayout).toContain("slug === 'no-download-games'");
    expect(guideLayout).toContain("'/games/online-games-for-couples'");
    expect(home).not.toContain('/games/online-games-for-couples');
  });
});
