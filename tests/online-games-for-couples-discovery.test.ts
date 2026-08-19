import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

function source(relativePath: string) {
  return readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), 'utf8');
}

describe('online games for couples discovery', () => {
  it('publishes the couples hub through sitemap and three relevant contextual surfaces', () => {
    const sitemap = source('app/sitemap.ts');
    const games = source('app/[locale]/games/page.tsx');
    const twoPlayer = source('app/[locale]/games/2-player-unblocked/page.tsx');
    const guidePage = source('app/[locale]/guides/[slug]/page.tsx');
    const home = source('app/[locale]/page.tsx');

    expect(sitemap).toContain("path: '/games/online-games-for-couples'");
    expect(games).toContain("'/games/online-games-for-couples'");
    expect(twoPlayer).toContain("'/games/online-games-for-couples'");
    expect(guidePage).toContain("page.slug === 'free-games-no-ads'");
    expect(guidePage).toContain("'/games/online-games-for-couples'");
    expect(home).not.toContain('/games/online-games-for-couples');
  });
});
