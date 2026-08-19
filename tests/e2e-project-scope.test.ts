import { existsSync, readFileSync } from 'node:fs';

describe('Playwright project scoping', () => {
  test('does not use runtime skip for mobile-only coverage', () => {
    const snakeSpec = readFileSync('tests/e2e/snake-3d.spec.ts', 'utf8');
    const config = readFileSync('playwright.config.ts', 'utf8');

    expect(snakeSpec).not.toContain('testInfo.skip');
    expect(existsSync('tests/mobile-e2e/snake-3d-touch.spec.ts')).toBe(true);
    expect(config).toContain("name: 'pixel-7-touch'");
    expect(config).toContain("name: 'iphone-13-touch'");
    expect(config).toContain("testDir: './tests/mobile-e2e'");
  });
});
