import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const sortingPath = '/games/sorting-games';

function pathFor(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

function read(relativePath: string) {
  return readFileSync(pathFor(relativePath), 'utf8');
}

describe('sorting games discovery', () => {
  it('uses targeted sitemap and contextual links without changing homepage curation', () => {
    const sitemap = read('../app/sitemap.ts');
    const noDownloadLayout = read('../app/[locale]/guides/no-download-games/layout.tsx');
    const quickPlayLayoutPath = pathFor('../app/[locale]/guides/quick-play-guide/layout.tsx');
    const couplesLayoutPath = pathFor('../app/[locale]/games/online-games-for-couples/layout.tsx');
    const homePage = read('../app/[locale]/page.tsx');
    const sharedGamesLayout = read('../app/[locale]/games/layout.tsx');

    expect(sitemap).toContain(`path: '${sortingPath}'`);
    expect(noDownloadLayout).toContain(`'${sortingPath}'`);
    expect(existsSync(quickPlayLayoutPath)).toBe(true);
    expect(existsSync(couplesLayoutPath)).toBe(true);

    if (existsSync(quickPlayLayoutPath)) {
      expect(readFileSync(quickPlayLayoutPath, 'utf8')).toContain(`'${sortingPath}'`);
    }
    if (existsSync(couplesLayoutPath)) {
      expect(readFileSync(couplesLayoutPath, 'utf8')).toContain(`'${sortingPath}'`);
    }

    expect(homePage).not.toContain(sortingPath);
    expect(sharedGamesLayout).not.toContain(sortingPath);
  });
});