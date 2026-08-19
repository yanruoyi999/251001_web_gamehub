import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const couplesModuleUrl = new URL('../lib/games/online-games-for-couples.ts', import.meta.url);
const couplesModulePath = fileURLToPath(couplesModuleUrl);

describe('online games for couples', () => {
  it('provides a dedicated pure prompt model before page wiring', () => {
    expect(existsSync(couplesModulePath)).toBe(true);
  });
});
