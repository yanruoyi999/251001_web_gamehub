import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const source = fs.readFileSync(
  path.join(process.cwd(), 'scripts/audit-runtime-quality.ts'),
  'utf8',
);

describe('two-player runtime quality gate', () => {
  it('samples the indexable collection and understands its play/fullscreen controls', () => {
    expect(source).toContain("path: '/en/games/2-player-unblocked'");
    expect(source).toContain("page.locator('[data-two-player-start]')");
    expect(source).toContain("page.locator('[data-two-player-fullscreen]')");
  });
});
