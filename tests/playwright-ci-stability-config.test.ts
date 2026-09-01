import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const readConfig = (ci: string | undefined) => {
  const env = { ...process.env };
  if (ci === undefined) {
    delete env.CI;
  } else {
    env.CI = ci;
  }

  return JSON.parse(
    execFileSync(
      'pnpm',
      [
        'exec',
        'tsx',
        '-e',
        "import config from './playwright.config'; console.log(JSON.stringify({ workers: config.workers ?? null, retries: config.retries, trace: config.use?.trace }));",
      ],
      { cwd: repositoryRoot, encoding: 'utf8', env },
    ),
  );
};

describe('Playwright CI stability configuration', () => {
  it('serializes the single-worker, no-retry, retained-trace CI contract', () => {
    expect(readConfig('1')).toEqual({
      workers: 1,
      retries: 0,
      trace: 'retain-on-failure',
    });
  });

  it('preserves the local trace behavior outside CI', () => {
    expect(readConfig(undefined)).toEqual({
      workers: null,
      retries: 0,
      trace: 'on-first-retry',
    });
  });
});
