import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const modulePath = path.join(
  process.cwd(),
  'lib/games/spend-bill-gates-money.ts',
);

describe('Spend Bill Gates Money data module', () => {
  it('exists as a focused pure game-rules module', () => {
    expect(existsSync(modulePath)).toBe(true);
  });
});
