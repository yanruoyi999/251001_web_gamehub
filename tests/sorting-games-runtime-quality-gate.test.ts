import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const auditPath = fileURLToPath(new URL('../scripts/audit-runtime-quality.ts', import.meta.url));

describe('sorting games runtime quality gate', () => {
  it('samples the English sorting games core page in the production-style runtime audit', () => {
    const source = readFileSync(auditPath, 'utf8');

    expect(source).toContain("{ path: '/en/games/sorting-games', type: 'static' }");
    expect(source).toContain('const DEFAULT_FAIL_UNDER = 80');
  });
});