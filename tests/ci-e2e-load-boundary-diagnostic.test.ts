import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const scriptPath = resolve(repositoryRoot, 'scripts/diagnose-ci-e2e-load-boundary.sh');
const diagnosticConfigPath = resolve(repositoryRoot, 'playwright.ci-diagnostic.config.ts');
const workflowPath = resolve(repositoryRoot, '.github/workflows/ci-e2e-load-boundary-diagnostic.yml');

function collectedTests(report: unknown): number {
  if (typeof report !== 'object' || report === null) return 0;
  const node = report as { specs?: unknown; suites?: unknown; tests?: unknown };
  return (Array.isArray(node.tests) ? node.tests.length : 0) +
    (Array.isArray(node.specs) ? node.specs.reduce<number>((total, spec) => total + collectedTests(spec), 0) : 0) +
    (Array.isArray(node.suites) ? node.suites.reduce<number>((total, suite) => total + collectedTests(suite), 0) : 0);
}

const failureCluster = [
  ['tests/e2e/mobile-disclosure.spec.ts', 'chromium', 'keeps guide play intent actionable before hydration'],
  ['tests/e2e/mobile-disclosure.spec.ts', 'chromium', 'moves focus to guide jump targets before hydration'],
  ['tests/e2e/mobile-disclosure.spec.ts', 'firefox', 'keeps guide play intent actionable before hydration'],
  ['tests/e2e/mobile-disclosure.spec.ts', 'firefox', 'moves focus to guide jump targets before hydration'],
  ['tests/e2e/game-browsing.spec.ts', 'webkit', '支持切换到英文站点'],
  ['tests/e2e/game-browsing.spec.ts', 'webkit', '默认语言前缀只重定向一次到根路径且可从英文软导航返回'],
  ['tests/e2e/game-browsing.spec.ts', 'webkit', '英文游戏目录的首方图片资源不返回 4xx'],
  ['tests/e2e/mobile-disclosure.spec.ts', 'webkit', 'opens navigation and advanced filters on the first click'],
  ['tests/e2e/saved-games.spec.ts', 'webkit', 'desktop exposes the saved entry and renders a saved Luma original'],
  ['tests/e2e/smoke.spec.ts', 'webkit', 'homepage renders title'],
  ['tests/e2e/smoke.spec.ts', 'webkit', 'homepage exposes distinct recommendation shelves without mobile overflow'],
  ['tests/e2e/mobile-disclosure.spec.ts', 'pixel-7', 'opens navigation and advanced filters on the first click'],
  ['tests/e2e/game-browsing.spec.ts', 'iphone-13', '英文游戏目录的首方图片资源不返回 4xx'],
  ['tests/e2e/mobile-disclosure.spec.ts', 'iphone-13', 'opens navigation and advanced filters on the first click'],
] as const;

function writeCompleteEvidenceFixture(output: string, arm: 'A' | 'B') {
  const logs = join(output, 'logs');
  const playwright = join(output, 'playwright');
  mkdirSync(logs, { recursive: true });
  mkdirSync(playwright, { recursive: true });
  writeFileSync(join(logs, 'build-config.sha256'), 'config  build\n');
  writeFileSync(join(logs, 'build-output-identity.sha256'), 'output  .next\n');
  writeFileSync(join(logs, 'server.stdout.log'), 'ready\n');
  writeFileSync(join(logs, 'server.stderr.log'), '');
  writeFileSync(join(logs, 'health.json'), '{"ok":true}\n');
  writeFileSync(join(logs, 'health.err'), '');
  writeFileSync(join(logs, 'server.pid'), '4242\n');
  writeFileSync(join(logs, 'server-rss.tsv'), '2026-09-01T00:00:00Z\t4242  12345 next start\n');
  writeFileSync(join(logs, 'readiness-probes.tsv'), ['/api/health', '/en', '/en/games', '/en/guides/google-snake-mods'].map((route) => `2026-09-01T00:00:00Z\t${route}\t200\t0.01`).join('\n') + '\n');
  writeFileSync(join(logs, 'listener-receipt.json'), JSON.stringify({ arm, endpoint: arm === 'A' ? 'http://localhost:3217' : 'http://127.0.0.1:3217', server_host: arm === 'A' ? 'localhost' : '127.0.0.1', resolved_addresses: arm === 'A' ? ['127.0.0.1'] : ['127.0.0.1'], listener: arm === 'A' ? '127.0.0.1:3217 (LISTEN)' : '127.0.0.1:3217 (LISTEN)', bind_verified: true }));
  writeFileSync(join(logs, 'post-arm-isolation.json'), JSON.stringify({ port: 3217, server_pid: 4242, sampler_pid: 4243, port_listener_absent: true, server_pid_alive: false, sampler_pid_alive: false }));
  const results = failureCluster.map(([spec, project, title], index) => {
    const caseDirectory = join(playwright, `case-${index + 1}`);
    mkdirSync(join(caseDirectory, 'results'), { recursive: true });
    const result = { status: 'pass', expected_count: 1, collected_count: 1, executed_count: 1, skipped_count: 0, passed_count: 1, failed_count: 0 };
    writeFileSync(join(caseDirectory, 'result.json'), JSON.stringify({ stats: { expected: 1, unexpected: 0, flaky: 0, skipped: 0 }, suites: [] }));
    writeFileSync(join(caseDirectory, 'summary.json'), JSON.stringify(result));
    writeFileSync(join(caseDirectory, 'case.json'), JSON.stringify({ index: index + 1, spec, project, title, result }));
    writeFileSync(join(caseDirectory, 'results', 'trace.zip'), 'trace');
    writeFileSync(join(caseDirectory, 'results', 'video.webm'), 'video');
    writeFileSync(join(caseDirectory, 'results', 'screenshot.png'), 'screenshot');
    writeFileSync(join(logs, `case-${index + 1}.log`), 'pw:api request /_next/image and RSC\n');
    return { index: index + 1, spec, project, title, result };
  });
  writeFileSync(join(playwright, 'cases.json'), JSON.stringify(results));
}

describe('CI E2E endpoint A/B diagnostic harness', () => {
  it('dry-runs the same-immutable 14-case endpoint experiment', () => {
    const plan = JSON.parse(execFileSync('bash', [scriptPath, '--dry-run'], { cwd: repositoryRoot, encoding: 'utf8' }));
    expect(plan.immutable_sha).toBe('aa0acf80231f202c6529423db1e2dbaa87b3ee16');
    expect(plan.expected_cases_per_arm).toBe(14);
    expect(plan.arms).toEqual([
      { name: 'A', endpoint: 'http://localhost:3217', server_host: 'localhost' },
      { name: 'B', endpoint: 'http://127.0.0.1:3217', server_host: '127.0.0.1' },
    ]);
    expect(plan.cases.map(({ spec, project, title }: { spec: string; project: string; title: string }) => [spec, project, title])).toEqual(failureCluster);
  });

  it('keeps the workflow branch-scoped and performs one immutable setup before both arms', () => {
    expect(existsSync(workflowPath)).toBe(true);
    const workflow = readFileSync(workflowPath, 'utf8');
    expect(workflow).toMatch(/push:\n\s+branches:\n\s+- diag\/ci-e2e-load-boundary-20260901/);
    expect(workflow).not.toMatch(/^\s*pull_request:/m);
    expect(workflow).not.toMatch(/^\s*schedule:/m);
    expect(workflow.match(/pnpm install --frozen-lockfile/g)).toHaveLength(1);
    expect(workflow.match(/pnpm build/g)).toHaveLength(1);
    expect(workflow).toContain('--arm A');
    expect(workflow).toContain('--arm B');
    expect(workflow.indexOf('--arm A')).toBeLessThan(workflow.indexOf('--arm B'));
  });

  it('keeps diagnostic retention and base Playwright timeout behavior intact', () => {
    const config = JSON.parse(execFileSync('./node_modules/.bin/tsx', ['-e', "import config from './playwright.ci-diagnostic.config'; process.stdout.write(JSON.stringify({ timeout: config.timeout, retries: config.retries, workers: config.workers, use: config.use }));"], { cwd: repositoryRoot, encoding: 'utf8' }));
    expect(config).toMatchObject({ timeout: 60_000, retries: 0, use: { trace: 'on', video: 'on', screenshot: 'on' } });
    expect(readFileSync(scriptPath, 'utf8')).toContain('--workers=1 --retries=0 --trace=on');
  });

  it('selects each of the fourteen historical failures exactly once', () => {
    for (const [spec, project, title] of failureCluster) {
      const report = JSON.parse(execFileSync('./node_modules/.bin/playwright', ['test', '--config', diagnosticConfigPath, spec, '--grep', `${title}$`, `--project=${project}`, '--workers=1', '--retries=0', '--list', '--reporter=json'], { cwd: repositoryRoot, encoding: 'utf8' }));
      expect(collectedTests(report), `${project}: ${title}`).toBe(1);
    }
  }, 30_000);

  it('accepts a Playwright JSON result only when collected and executed counts match', () => {
    const directory = mkdtempSync(join(tmpdir(), 'luma-ci-e2e-contract-'));
    const resultPath = join(directory, 'result.json');
    const summaryPath = join(directory, 'summary.json');
    try {
      writeFileSync(resultPath, JSON.stringify({ suites: [{ specs: [{ tests: Array.from({ length: 6 }, () => ({ projectName: 'chromium', results: [{ status: 'passed' }] })) }] }], stats: { expected: 6, unexpected: 0, flaky: 0, skipped: 0 } }));
      const completed = spawnSync('bash', [scriptPath, '--validate-result', '--result', resultPath, '--expected-count', '6', '--summary', summaryPath], { cwd: repositoryRoot, encoding: 'utf8' });
      expect(completed.status).toBe(0);
      expect(JSON.parse(readFileSync(summaryPath, 'utf8'))).toMatchObject({ status: 'pass', expected_count: 6, collected_count: 6, executed_count: 6, skipped_count: 0, passed_count: 6, failed_count: 0 });
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
      writeFileSync(mismatchPath, JSON.stringify({ suites: [{ specs: [{ tests: Array.from({ length: 5 }, () => ({ projectName: 'webkit', results: [{ status: 'passed' }] })) }] }], stats: { expected: 5, unexpected: 0, flaky: 0, skipped: 0 } }));
      writeFileSync(statsMismatchPath, JSON.stringify({ suites: [{ specs: [{ tests: Array.from({ length: 6 }, () => ({ projectName: 'webkit', results: [{ status: 'passed' }] })) }] }], stats: { expected: 5, unexpected: 0, flaky: 0, skipped: 0 } }));
      for (const [resultPath, status] of [[join(directory, 'missing.json'), 'missing-result'], [invalidPath, 'invalid-json'], [mismatchPath, 'count-mismatch'], [statsMismatchPath, 'stats-mismatch']]) {
        const completed = spawnSync('bash', [scriptPath, '--validate-result', '--result', resultPath, '--expected-count', '6', '--summary', summaryPath], { cwd: repositoryRoot, encoding: 'utf8' });
        expect(completed.status).not.toBe(0);
        expect(JSON.parse(readFileSync(summaryPath, 'utf8'))).toMatchObject({ status });
      }
    } finally {
      rmSync(directory, { force: true, recursive: true });
    }
  });

  it('writes a nonempty per-arm summary and propagates malformed evidence failures', () => {
    const directory = mkdtempSync(join(tmpdir(), 'luma-ci-e2e-summary-contract-'));
    const output = join(directory, 'output');
    const invalidOutput = join(directory, 'invalid-output');
    try {
      const completed = spawnSync('bash', [scriptPath, '--summary-fixture', '--workspace', '/fixture-a', '--output', output, '--arm', 'A', '--port', '3217'], { cwd: repositoryRoot, encoding: 'utf8' });
      expect(completed.status).toBe(0);
      expect(JSON.parse(readFileSync(join(output, 'summary.json'), 'utf8'))).toMatchObject({ arm: 'A', endpoint: 'http://localhost:3217', immutable_sha: 'aa0acf80231f202c6529423db1e2dbaa87b3ee16', expected_count: 14, counts: { selected: 0, collected: 0, executed: 0, skipped: 0, passed: 0, failed: 0 }, exits: { overall: 0 } });
      const invalid = spawnSync('bash', [scriptPath, '--summary-fixture-invalid-jq', '--workspace', '/fixture-b', '--output', invalidOutput, '--arm', 'B', '--port', '3217'], { cwd: repositoryRoot, encoding: 'utf8' });
      expect(invalid.status).not.toBe(0);
    } finally {
      rmSync(directory, { force: true, recursive: true });
    }
  });

  it('propagates a final summary jq write failure even when every other arm exit is green', () => {
    const directory = mkdtempSync(join(tmpdir(), 'luma-ci-e2e-summary-write-'));
    const output = join(directory, 'output');
    try {
      const completed = spawnSync('bash', [scriptPath, '--summary-fixture-jq-write-failure', '--workspace', '/fixture-a', '--output', output, '--arm', 'A', '--port', '3217'], { cwd: repositoryRoot, encoding: 'utf8' });
      expect(completed.status).not.toBe(0);
      expect(completed.stderr).toMatch(/summary\.json.*(directory|Is a directory)/i);
    } finally {
      rmSync(directory, { force: true, recursive: true });
    }
  });

  it('accepts complete evidence and rejects a missing per-case screenshot without relying on execution success', () => {
    const directory = mkdtempSync(join(tmpdir(), 'luma-ci-e2e-evidence-'));
    const output = join(directory, 'output');
    try {
      writeCompleteEvidenceFixture(output, 'B');
      const complete = spawnSync('bash', [scriptPath, '--validate-evidence', '--output', output, '--arm', 'B', '--port', '3217'], { cwd: repositoryRoot, encoding: 'utf8' });
      expect(complete.status, complete.stderr).toBe(0);
      rmSync(join(output, 'playwright', 'case-14', 'results', 'screenshot.png'));
      const missingScreenshot = spawnSync('bash', [scriptPath, '--validate-evidence', '--output', output, '--arm', 'B', '--port', '3217'], { cwd: repositoryRoot, encoding: 'utf8' });
      expect(missingScreenshot.status).not.toBe(0);
    } finally {
      rmSync(directory, { force: true, recursive: true });
    }
  });
});
