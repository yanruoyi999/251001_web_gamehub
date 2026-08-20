import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const auditPath = fileURLToPath(new URL('../scripts/audit-page-quality.ts', import.meta.url));

describe('sorting games page quality gate', () => {
  it('keeps the sorting core page as an explicit 80+ index target', () => {
    const source = readFileSync(auditPath, 'utf8');
    const pathIndex = source.indexOf("path: '/games/sorting-games'");

    expect(pathIndex).toBeGreaterThan(-1);
    const row = source.slice(pathIndex, pathIndex + 900);
    expect(row).toMatch(/score:\s*(?:8\d|9\d|100)/);
    expect(row).toContain('indexable: true');
    expect(row).toContain("action: 'keep'");
  });
});