import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const globals = await readFile(
  new URL('../app/globals.css', import.meta.url),
  'utf8',
);

describe('theme accessibility', () => {
  it('uses a light-theme primary green with AA contrast on white', () => {
    expect(globals).toContain('--primary: 160 94% 24%;');
  });
});
