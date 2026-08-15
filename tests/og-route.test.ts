import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const middlewareSource = await readFile(
  new URL('../middleware.ts', import.meta.url),
  'utf8'
);

describe('generated social image routes', () => {
  it('keeps /og routes out of locale rewriting', () => {
    expect(middlewareSource).toContain('favicon.ico|og/|');
  });
});
