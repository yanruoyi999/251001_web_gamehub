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
    const gamesLayout = read('app/[locale]/games/layout.tsx');
    const keyboardGuideLayout = read(
      'app/[locale]/guides/keyboard-only-browser-games/layout.tsx',
    );
    const noDownloadGuideLayout = read(
      'app/[locale]/guides/no-download-games/layout.tsx',
    );

    expect(sitemap).toContain(route);
    expect(gamesLayout).toContain(route);
    expect(keyboardGuideLayout).toContain(route);
    expect(noDownloadGuideLayout).toContain(route);
  });
});
