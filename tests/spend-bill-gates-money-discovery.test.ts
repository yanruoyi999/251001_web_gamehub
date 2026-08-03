import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const sitemapPath = path.join(process.cwd(), 'app/sitemap.ts');
const gamesPagePath = path.join(process.cwd(), 'app/[locale]/games/page.tsx');
const targetPath = '/games/spend-bill-gates-money';

describe('Spend Bill Gates Money discovery', () => {
  it('adds the independent game path to the localized sitemap exactly once', () => {
    const source = readFileSync(sitemapPath, 'utf8');
    expect(source.split(targetPath)).toHaveLength(2);
    expect(source).toContain(`const standaloneGamePaths =`);
  });

  it('surfaces a separate Luma Original card without changing catalogue totals', () => {
    const source = readFileSync(gamesPagePath, 'utf8');
    const totalDestructureIndex = source.indexOf(
      'const { games, total, totalPages, page: currentPage } = list;',
    );
    const originalCardIndex = source.indexOf('Luma Original');
    const catalogueGridIndex = source.indexOf('{games.length === 0 ?');

    expect(source).toContain('Luma 原创互动游戏');
    expect(source).toContain(
      "getLocalizedPath(locale, '/games/spend-bill-gates-money')",
    );
    expect(totalDestructureIndex).toBeGreaterThan(-1);
    expect(originalCardIndex).toBeGreaterThan(totalDestructureIndex);
    expect(catalogueGridIndex).toBeGreaterThan(originalCardIndex);
    expect(source).not.toContain('total + 1');
    expect(source).not.toContain('totalPages + 1');
  });
});
