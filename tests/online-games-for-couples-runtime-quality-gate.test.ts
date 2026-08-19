import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const source = fs.readFileSync(
  path.join(process.cwd(), 'scripts/audit-runtime-quality.ts'),
  'utf8',
);

describe('online games for couples runtime quality gate', () => {
  it('samples the indexable original couples collection', () => {
    expect(source).toContain("path: '/en/games/online-games-for-couples'");
  });
});
