import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const sortingPath = '/games/sorting-games';

function read(relativePath: string) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');
}

describe('sorting games discovery', () => {
  it('uses targeted sitemap and contextual links without changing homepage curation', () => {
    const sitemap = read('../app/sitemap.ts');
    const gamesPage = read('../app/[locale]/games/page.tsx');
    const noDownloadLayout = read('../app/[locale]/guides/no-download-games/layout.tsx');
    const homePage = read('../app/[locale]/page.tsx');
    const sharedGamesLayout = read('../app/[locale]/games/layout.tsx');

    expect(sitemap).toContain(`path: '${sortingPath}'`);
    expect(gamesPage).toContain(`'${sortingPath}'`);
    expect(noDownloadLayout).toContain(`'${sortingPath}'`);

    expect(homePage).not.toContain(sortingPath);
    expect(sharedGamesLayout).not.toContain(sortingPath);
  });
});