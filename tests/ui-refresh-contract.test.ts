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
    expect(homepage).toContain('auto-cols-[38%]');
    expect(homepage).toContain('game-shelf-scroll');
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

  it('keeps player actions visible before long game content', async () => {
    const game = await read('app/[locale]/games/[slug]/page.tsx');
    const guide = await read('app/[locale]/guides/[slug]/page.tsx');
    expect(game).toContain('data-game-player-shell');
    expect(game).toContain('data-game-action-bar');
    expect(game).toContain('href="#game-controls"');
    expect(guide).toContain('id="guide-details"');
    expect(guide).toContain('Featured Picks');
    expect(guide).not.toContain('rounded-2xl border border-border bg-card p-6 shadow-sm');
  });

  it('marks the consent surface so overlay regressions can be checked in the browser', async () => {
    const consent = await read('components/analytics/ClarityConsent.tsx');
    expect(consent).toContain('data-consent-overlay');
    expect(consent).toContain('env(safe-area-inset-bottom)');
  });
});
