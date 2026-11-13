import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const middlewareSource = await readFile(
  new URL('../middleware.ts', import.meta.url),
  'utf8'
);

describe('static social images', () => {
  it('keeps /og routes out of locale rewriting', () => {
    expect(middlewareSource).toContain('favicon.ico|og/|');
  });

  it.each(['spend-bill-gates-money', 'luma-snake-3d'])(
    'ships the 1200×630 PNG for %s',
    async slug => {
      const image = await readFile(
        new URL(`../public/og/${slug}.png`, import.meta.url)
      );

      expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(image.readUInt32BE(16)).toBe(1200);
      expect(image.readUInt32BE(20)).toBe(630);
    }
  );
});
