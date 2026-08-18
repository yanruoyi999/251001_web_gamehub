import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('two-player collection discovery', () => {
  it('adds the collection to sitemap and three relevant body-link surfaces', () => {
    const route = '/games/2-player-unblocked';
    const sitemap = read('app/sitemap.ts');
    const gamesPage = read('app/[locale]/games/page.tsx');
    const keyboardGuide = read('app/[locale]/guides/keyboard-only-browser-games/page.tsx');
    const homePage = read('app/[locale]/page.tsx');

    expect(sitemap).toContain(route);
    expect(gamesPage).toContain(route);
    expect(keyboardGuide).toContain(route);
    expect(homePage).toContain(route);
  });
});
