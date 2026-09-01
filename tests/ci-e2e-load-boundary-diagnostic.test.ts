import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const scriptPath = resolve(repositoryRoot, 'scripts/diagnose-ci-e2e-load-boundary.sh');
const diagnosticConfigPath = resolve(repositoryRoot, 'playwright.ci-diagnostic.config.ts');
const workflowPath = resolve(
  repositoryRoot,
  '.github/workflows/ci-e2e-load-boundary-diagnostic.yml',
);

function collectedTests(report: unknown): number {
  if (typeof report !== 'object' || report === null) {
    return 0;
  }

  const node = report as { specs?: unknown; suites?: unknown; tests?: unknown };
  const directTests = Array.isArray(node.tests) ? node.tests.length : 0;
  const specTests = Array.isArray(node.specs)
    ? node.specs.reduce<number>((total, spec) => total + collectedTests(spec), 0)
    : 0;
  const nestedTests = Array.isArray(node.suites)
    ? node.suites.reduce<number>((total, suite) => total + collectedTests(suite), 0)
    : 0;
  return directTests + specTests + nestedTests;
}

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
      'config',
      'config',
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
      expect(help).toMatch(new RegExp(`(?:^\\s*|,\\s*)--${option}\\b`, 'm'));
    }
  });

  it('enables diagnostic trace, video, and screenshots in a config used by both runs', () => {
    expect(existsSync(diagnosticConfigPath)).toBe(true);

    const use = JSON.parse(
      execFileSync(
        'pnpm',
        [
          'exec',
          'tsx',
          '-e',
          "import config from './playwright.ci-diagnostic.config'; process.stdout.write(JSON.stringify(config.use));",
        ],
        { cwd: repositoryRoot, encoding: 'utf8' },
      ),
    );
    expect(use).toMatchObject({ trace: 'on', video: 'on', screenshot: 'on' });

    const script = readFileSync(scriptPath, 'utf8');
    expect(script.match(/--config "\$diagnostic_config_path"/g)).toHaveLength(2);
    expect(script).toContain('playwright.ci-diagnostic.config.ts');
    expect(script.indexOf('GAME_CATALOG_MODE=local CACHE_MODE=local NEXT_TELEMETRY_DISABLED=1 pnpm build')).toBeLessThan(
      script.indexOf('if cp "$DIAGNOSTIC_CONFIG_SOURCE" "$diagnostic_config_path" && cmp -s'),
    );
    expect(script).toContain('cmp -s "$DIAGNOSTIC_CONFIG_SOURCE" "$diagnostic_config_path"');
    expect(script).toContain('shasum -a 256 "$DIAGNOSTIC_CONFIG_SOURCE" "$diagnostic_config_path"');
  });

  it('lists exactly the six load-boundary and one WebKit Pong cases through the diagnostic config', () => {
    const loadReport = JSON.parse(
      execFileSync(
        'pnpm',
        [
          'exec',
          'playwright',
          'test',
          '--config',
          diagnosticConfigPath,
          'tests/e2e/mobile-disclosure.spec.ts',
          'tests/e2e/game-browsing.spec.ts',
          '--grep',
          'keeps guide play intent actionable before hydration|英文游戏目录的首方图片资源不返回 4xx',
          '--project=chromium',
          '--project=firefox',
          '--project=webkit',
          '--workers=1',
          '--retries=0',
          '--list',
          '--reporter=json',
        ],
        { cwd: repositoryRoot, encoding: 'utf8' },
      ),
    );
    const pongReport = JSON.parse(
      execFileSync(
        'pnpm',
        [
          'exec',
          'playwright',
          'test',
          '--config',
          diagnosticConfigPath,
          'tests/e2e/two-player-unblocked.spec.ts',
          '--grep',
          'classic pong accepts both player key sets during the same interval',
          '--project=webkit',
          '--workers=1',
          '--retries=0',
          '--list',
          '--reporter=json',
        ],
        { cwd: repositoryRoot, encoding: 'utf8' },
      ),
    );

    expect(collectedTests(loadReport)).toBe(6);
    expect(collectedTests(pongReport)).toBe(1);
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
