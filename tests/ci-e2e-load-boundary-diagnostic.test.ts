import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const scriptPath = resolve(repositoryRoot, 'scripts/diagnose-ci-e2e-load-boundary.sh');
const workflowPath = resolve(
  repositoryRoot,
  '.github/workflows/ci-e2e-load-boundary-diagnostic.yml',
);

describe('CI E2E load-boundary diagnostic harness', () => {
  it('dry-runs the bounded seven-case A/B plan without starting a server', () => {
    const output = execFileSync('bash', [scriptPath, '--dry-run'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
    });

    expect(JSON.parse(output)).toEqual({
      base_sha: 'fdd7ba59e3e9125582d92f1000842de02dfcbd14',
      candidate_ref: 'refs/pull/32/merge',
      expected_cases_per_revision: 7,
      routes: ['/api/health', '/en', '/en/games', '/en/guides/google-snake-mods'],
      test_runs: [
        {
          expected_cases: 6,
          projects: ['chromium', 'firefox', 'webkit'],
          title_pattern:
            'keeps guide play intent actionable before hydration|英文游戏目录的首方图片资源不返回 4xx',
        },
        {
          expected_cases: 1,
          projects: ['webkit'],
          title_pattern: 'classic pong accepts both player key sets during the same interval',
        },
      ],
    });
  });

  it('limits the workflow trigger to the one diagnostic push branch', () => {
    expect(existsSync(workflowPath)).toBe(true);

    const workflow = readFileSync(workflowPath, 'utf8');
    expect(workflow).toMatch(/push:\n\s+branches:\n\s+- diag\/ci-e2e-load-boundary-20260901/);
    expect(workflow).toMatch(/runs-on: ubuntu-24\.04/);
    expect(workflow).not.toMatch(/^\s*pull_request:/m);
    expect(workflow).not.toMatch(/^\s*schedule:/m);
  });

  it('uses only Playwright test long options supported by the locked CLI', () => {
    const help = execFileSync('pnpm', ['exec', 'playwright', 'test', '--help'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
    });
    const script = readFileSync(scriptPath, 'utf8');
    const invocations = [...script.matchAll(/pnpm exec playwright test([\s\S]*?--output\s+[^\n]+)/g)];
    const options = invocations.flatMap(([, argumentsBlock]) =>
      [...argumentsBlock.matchAll(/--([a-z][a-z-]*)/g)].map(([, option]) => option),
    );

    expect(options.sort()).toEqual([
      'grep',
      'grep',
      'output',
      'output',
      'project',
      'project',
      'project',
      'project',
      'reporter',
      'reporter',
      'retries',
      'retries',
      'trace',
      'trace',
      'workers',
      'workers',
    ]);
    for (const option of new Set(options)) {
      expect(help).toMatch(new RegExp(`^\\s*--${option}\\b`, 'm'));
    }
  });

  it('accepts a Playwright JSON result only when collected and executed counts match', () => {
    const directory = mkdtempSync(join(tmpdir(), 'luma-ci-e2e-contract-'));
    const resultPath = join(directory, 'result.json');
    const summaryPath = join(directory, 'summary.json');

    try {
      writeFileSync(
        resultPath,
        JSON.stringify({
          suites: [
            {
              specs: [
                {
                  tests: Array.from({ length: 6 }, () => ({
                    projectName: 'chromium',
                    results: [{ status: 'passed' }],
                  })),
                },
              ],
            },
          ],
          stats: { expected: 6, unexpected: 0, flaky: 0, skipped: 0 },
        }),
      );

      const completed = spawnSync(
        'bash',
        [
          scriptPath,
          '--validate-result',
          '--result',
          resultPath,
          '--expected-count',
          '6',
          '--summary',
          summaryPath,
        ],
        { cwd: repositoryRoot, encoding: 'utf8' },
      );

      expect(completed.status).toBe(0);
      expect(JSON.parse(readFileSync(summaryPath, 'utf8'))).toMatchObject({
        status: 'pass',
        expected_count: 6,
        collected_count: 6,
        executed_count: 6,
        skipped_count: 0,
      });
    } finally {
      rmSync(directory, { force: true, recursive: true });
    }
  });

  it('fails the count gate for missing, invalid, or mismatched Playwright JSON', () => {
    const directory = mkdtempSync(join(tmpdir(), 'luma-ci-e2e-contract-'));
    const summaryPath = join(directory, 'summary.json');
    const invalidPath = join(directory, 'invalid.json');
    const mismatchPath = join(directory, 'mismatch.json');
    const statsMismatchPath = join(directory, 'stats-mismatch.json');

    try {
      writeFileSync(invalidPath, 'not-json');
      writeFileSync(
        mismatchPath,
        JSON.stringify({
          suites: [
            {
              specs: [
                {
                  tests: Array.from({ length: 5 }, () => ({
                    projectName: 'webkit',
                    results: [{ status: 'passed' }],
                  })),
                },
              ],
            },
          ],
          stats: { expected: 5, unexpected: 0, flaky: 0, skipped: 0 },
        }),
      );
      writeFileSync(
        statsMismatchPath,
        JSON.stringify({
          suites: [
            {
              specs: [
                {
                  tests: Array.from({ length: 6 }, () => ({
                    projectName: 'webkit',
                    results: [{ status: 'passed' }],
                  })),
                },
              ],
            },
          ],
          stats: { expected: 5, unexpected: 0, flaky: 0, skipped: 0 },
        }),
      );

      for (const [resultPath, status] of [
        [join(directory, 'missing.json'), 'missing-result'],
        [invalidPath, 'invalid-json'],
        [mismatchPath, 'count-mismatch'],
        [statsMismatchPath, 'stats-mismatch'],
      ]) {
        const completed = spawnSync(
          'bash',
          [
            scriptPath,
            '--validate-result',
            '--result',
            resultPath,
            '--expected-count',
            '6',
            '--summary',
            summaryPath,
          ],
          { cwd: repositoryRoot, encoding: 'utf8' },
        );
        expect(completed.status).not.toBe(0);
        expect(JSON.parse(readFileSync(summaryPath, 'utf8'))).toMatchObject({ status });
      }
    } finally {
      rmSync(directory, { force: true, recursive: true });
    }
  });
});
