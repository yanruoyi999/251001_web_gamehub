import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('curated shelf UI refresh contracts', () => {
  it('keeps one main landmark per localized page tree', async () => {
    const layout = await read('app/[locale]/layout.tsx');
    const snake3d = await read('app/[locale]/games/snake-3d/page.tsx');
    expect(layout).toContain('id="main-content"');
    expect(layout).toContain('<main id="main-content"');
    expect(layout).not.toContain('<main className="flex-1">{children}</main>');
    expect(snake3d).not.toContain('<main className=');
  });

  it('puts discovery controls and horizontal shelves near the homepage entry point', async () => {
    const homepage = await read('app/[locale]/page.tsx');
    expect(homepage).toContain(
      "aria-label={locale === 'zh' ? '快速分类' : 'Quick categories'}"
    );
    expect(homepage).toContain('auto-cols-[58%]');
    expect(homepage).toContain('id="popular-guides"');
    expect(homepage).toContain('id="testing-games"');
    expect(homepage).not.toContain('id="curated-starts"');
    expect(homepage).not.toContain('homepage-spend-bill-gates-money');
    expect(homepage).not.toContain('bg-gradient-to-br');
  });

  it('keeps the game grid ahead of the Luma Original banner', async () => {
    const games = await read('app/[locale]/games/page.tsx');
    expect(games).toContain('grid grid-cols-2');
    expect(games.indexOf('{games.length === 0')).toBeLessThan(
      games.indexOf('lumaOriginalCopy.badge')
    );
    expect(games).toContain('compact');
  });

  it('marks the consent surface so overlay regressions can be checked in the browser', async () => {
    const consent = await read('components/analytics/ClarityConsent.tsx');
    expect(consent).toContain('data-consent-overlay');
    expect(consent).toContain('env(safe-area-inset-bottom)');
  });
});
