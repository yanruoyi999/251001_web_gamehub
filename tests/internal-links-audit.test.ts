import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

function countPageFiles(directory: string): number {
  return readdirSync(directory).reduce((count, entry) => {
    const fullPath = path.join(directory, entry);

    if (statSync(fullPath).isDirectory()) {
      return count + countPageFiles(fullPath);
    }

    return count + (entry === 'page.tsx' ? 1 : 0);
  }, 0);
}

describe('internal link audit', () => {
  it('reports the number of page files it actually audits', () => {
    const rootDir = process.cwd();
    const output = execFileSync(
      path.join(rootDir, 'node_modules', '.bin', 'tsx'),
      ['scripts/check-internal-links.ts'],
      {
        cwd: rootDir,
        encoding: 'utf8',
        env: {
          ...process.env,
          GAME_CATALOG_MODE: 'local',
        },
      }
    );
    const pageFileCount = countPageFiles(path.join(rootDir, 'app'));

    expect(output).toContain(`and ${pageFileCount} rendered page files`);
  });
});
