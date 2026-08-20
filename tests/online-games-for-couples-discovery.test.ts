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
  it('publishes the couples hub through sitemap and only the approved contextual surfaces', () => {
    const sitemap = source('app/sitemap.ts');
    const gamesPage = source('app/[locale]/games/page.tsx');
    const twoPlayerPage = source('app/[locale]/games/2-player-unblocked/page.tsx');
    const gamesLayout = source('app/[locale]/games/layout.tsx');
    const noDownloadLayoutPath = path('app/[locale]/guides/no-download-games/layout.tsx');
    const deadDynamicLayoutPath = path('app/[locale]/guides/[slug]/layout.tsx');
    const home = source('app/[locale]/page.tsx');

    expect(sitemap).toContain("path: '/games/online-games-for-couples'");
    expect(gamesPage).toContain("'/games/online-games-for-couples'");
    expect(twoPlayerPage).toContain("'/games/online-games-for-couples'");
    expect(existsSync(noDownloadLayoutPath)).toBe(true);

    const noDownloadLayout = readFileSync(noDownloadLayoutPath, 'utf8');
    expect(noDownloadLayout).toContain("'/games/online-games-for-couples'");
    expect(gamesLayout).not.toContain('/games/online-games-for-couples');
    expect(existsSync(deadDynamicLayoutPath)).toBe(false);
    expect(home).not.toContain('/games/online-games-for-couples');
  });
});