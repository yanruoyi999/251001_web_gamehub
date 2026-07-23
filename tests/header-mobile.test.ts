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
    expect(headerSource).toContain('type="checkbox"');
    expect(headerSource).toContain('htmlFor="mobile-navigation-toggle"');
    expect(headerSource).toContain('useRef<HTMLInputElement>(null)');
    expect(headerSource).toContain('aria-controls="mobile-navigation"');
    expect(headerSource).toContain('id="mobile-navigation"');
    expect(headerSource).toContain('peer-checked:hidden');
    expect(headerSource).toContain('peer-checked:block');
    expect(headerSource).toMatch(
      /<SearchInput\s+locale=\{currentLocaleSegment\}\s+className="block w-full"\s+\/>/,
    );
    expect(headerSource).toContain('min-h-11 min-w-11');
    expect(headerSource).toContain('md:hidden');
    expect(headerSource).not.toContain('useState');
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
