import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

function source(relativePath: string) {
  return readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), 'utf8');
}

describe('online games for couples discovery', () => {
  it('publishes the couples hub through sitemap and relevant SSR contextual surfaces', () => {
    const sitemap = source('app/sitemap.ts');
    const gamesLayout = source('app/[locale]/games/layout.tsx');
    const guidePage = source('app/[locale]/guides/[slug]/page.tsx');
    const home = source('app/[locale]/page.tsx');

    expect(sitemap).toContain("path: '/games/online-games-for-couples'");
    expect(gamesLayout).toContain("'/games/online-games-for-couples'");
    expect(gamesLayout).toContain('Couple');
    expect(guidePage).toContain("page.slug === 'no-download-games'");
    expect(guidePage).toContain("'/games/online-games-for-couples'");
    expect(home).not.toContain('/games/online-games-for-couples');
  });
});
