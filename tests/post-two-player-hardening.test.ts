import { existsSync, readFileSync } from 'node:fs';

describe('post Two-Player launch hardening contracts', () => {
  test('keeps no-console protection for product code while allowing intentional CLI output', () => {
    const config = JSON.parse(readFileSync('.eslintrc.json', 'utf8')) as {
      rules?: Record<string, unknown>;
      overrides?: Array<{ files?: string[]; rules?: Record<string, unknown> }>;
    };

    expect(config.rules?.['no-console']).toEqual([
      'warn',
      { allow: ['warn', 'error'] },
    ]);

    expect(config.overrides).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          files: expect.arrayContaining(['scripts/**/*.ts', 'db/seed.ts']),
          rules: expect.objectContaining({ 'no-console': 'off' }),
        }),
      ]),
    );
  });

  test('does not hide the no-JS mobile disclosure suite from Firefox', () => {
    const playwrightConfig = readFileSync('playwright.config.ts', 'utf8');
    const mobileDisclosure = readFileSync(
      'tests/e2e/mobile-disclosure.spec.ts',
      'utf8',
    );

    expect(playwrightConfig).not.toContain(
      'testIgnore: /mobile-disclosure\\.spec\\.ts/',
    );
    expect(mobileDisclosure).not.toContain('isMobile: true');
  });

  test('verifies every English static HTML file instead of counting only replacements', () => {
    expect(existsSync('scripts/static-locale-html.ts')).toBe(true);
    const patchScript = readFileSync(
      'scripts/patch-static-locale-html.ts',
      'utf8',
    );

    expect(patchScript).toContain('verified');
    expect(patchScript).toContain('alreadyCorrect');
  });

  test('uses page metadata as the single hreflang source', () => {
    const middleware = readFileSync('middleware.ts', 'utf8');
    expect(middleware).toContain('alternateLinks: false');
  });

  test('hardens the main CSP without breaking required static Next scripts', () => {
    const config = readFileSync('next.config.js', 'utf8');

    expect(config).toContain("script-src-attr 'none'");
    expect(config).not.toContain('https://sda.4399.com');
    expect(config).not.toContain('https://sxiao.4399.com');
    expect(config).not.toContain('https://www.friv2018.com');
  });

  test('defines an explicit telemetry-isolated production interaction smoke gate', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts?: Record<string, string>;
    };
    const productionSmoke = readFileSync(
      'tests/production-e2e/two-player-smoke.spec.ts',
      'utf8',
    );

    expect(pkg.scripts?.['test:e2e:production-smoke']).toBeTruthy();
    expect(existsSync('playwright.production.config.ts')).toBe(true);
    expect(existsSync('.github/workflows/production-smoke.yml')).toBe(true);
    expect(productionSmoke).toContain("from '../e2e/fixtures'");
  });
});
