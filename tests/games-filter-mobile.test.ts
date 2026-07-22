import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const gamesPageSource = await readFile(
  new URL('../app/[locale]/games/page.tsx', import.meta.url),
  'utf8',
);
const collapsibleSource = await readFile(
  new URL('../components/game/collapsible-game-filters.tsx', import.meta.url),
  'utf8',
);

describe('mobile game filters', () => {
  it('keeps search visible and folds advanced filters on small screens', () => {
    expect(gamesPageSource).toContain('<CollapsibleGameFilters');
    expect(gamesPageSource).toContain('defaultOpen={hasAdvancedFilters}');
    expect(gamesPageSource).toContain('name="search"');
    expect(gamesPageSource.indexOf('name="search"')).toBeLessThan(
      gamesPageSource.indexOf('<CollapsibleGameFilters'),
    );
    expect(gamesPageSource).toContain('className="space-y-4" method="get"');
  });

  it('exposes an accessible 44px toggle while keeping the desktop grid visible', () => {
    expect(collapsibleSource).toContain('aria-expanded={open}');
    expect(collapsibleSource).toContain('min-h-11');
    expect(collapsibleSource).toContain('md:hidden');
    expect(collapsibleSource).toContain("open ? 'grid' : 'hidden'");
    expect(collapsibleSource).toContain('md:grid md:grid-cols-2 lg:grid-cols-3');
  });
});
