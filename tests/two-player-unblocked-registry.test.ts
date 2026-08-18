import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'lib/games/two-player-unblocked.ts');

describe('two-player unblocked registry contract', () => {
  it('ships an explicit approved-game registry before the collection page is implemented', () => {
    expect(fs.existsSync(REGISTRY_PATH)).toBe(true);

    const source = fs.readFileSync(REGISTRY_PATH, 'utf8');
    expect(source).toContain("provenanceStatus: 'approved'");
    expect(source).toContain("runtimePath: '/games-runtime/");
    expect(source).toContain('licenseNoticePath:');
    expect(source).toContain('sourceRevision:');
  });
});
