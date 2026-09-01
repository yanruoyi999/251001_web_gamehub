import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
});
