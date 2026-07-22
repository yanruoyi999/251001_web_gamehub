import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const headerSource = await readFile(
  new URL('../components/layout/Header.tsx', import.meta.url),
  'utf8',
);
const searchSource = await readFile(
  new URL('../components/game/search-input.tsx', import.meta.url),
  'utf8',
);
const themeToggleSource = await readFile(
  new URL('../components/layout/ThemeToggle.tsx', import.meta.url),
  'utf8',
);

describe('mobile header navigation', () => {
  it('provides an accessible mobile menu with navigation, search, and language controls', () => {
    expect(headerSource).toContain("useState(false)");
    expect(headerSource).toContain('aria-controls="mobile-navigation"');
    expect(headerSource).toContain('aria-expanded={mobileMenuOpen}');
    expect(headerSource).toContain('id="mobile-navigation"');
    expect(headerSource).toContain('<SearchInput locale={currentLocaleSegment} className="block w-full" />');
    expect(headerSource).toContain('min-h-11 min-w-11');
    expect(headerSource).toContain('md:hidden');
  });

  it('lets each header placement control search visibility and uses theme tokens', () => {
    expect(searchSource).toContain('className?: string;');
    expect(searchSource).toContain('className={clsx(\'relative\', className)}');
    expect(searchSource).not.toContain('relative hidden w-64 md:block');
    expect(searchSource).toContain('bg-popover');
    expect(searchSource).toContain('text-popover-foreground');
  });

  it('keeps the theme control at least 44px on touch screens', () => {
    expect(themeToggleSource).toContain('h-11 w-11');
  });
});
