import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { describe, expect, it } from 'vitest';

describe('Playwright analytics isolation', () => {
  it('blocks analytics collection without blocking measurement scripts or site assets', async () => {
    const runtimeModule = await import('@/scripts/audit-runtime-quality');
    const matcher = (
      runtimeModule as typeof runtimeModule & {
        isPlaywrightTelemetryRequest?: (requestUrl: string) => boolean;
      }
    ).isPlaywrightTelemetryRequest;

    expect(matcher).toBeTypeOf('function');
    if (!matcher) return;

    expect(matcher('https://www.google-analytics.com/g/collect?v=2')).toBe(true);
    expect(matcher('https://region1.google-analytics.com/g/collect?v=2')).toBe(true);
    expect(matcher('https://www.google.com/g/collect?v=2')).toBe(true);
    expect(matcher('https://k.clarity.ms/collect')).toBe(true);
    expect(matcher('https://c.clarity.ms/c.gif')).toBe(true);
    expect(matcher('https://c.bing.com/c.gif')).toBe(true);
    expect(matcher('https://www.lumagamehub.com/_vercel/insights/view')).toBe(true);
    expect(matcher('https://www.lumagamehub.com/_vercel/speed-insights/vitals')).toBe(true);
    expect(matcher('https://www.googletagmanager.com/gtag/js?id=G-TEST')).toBe(false);
    expect(matcher('https://www.lumagamehub.com/_next/static/app.js')).toBe(false);
  });

  it('installs telemetry isolation before runtime sampling', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'scripts/audit-runtime-quality.ts'),
      'utf8',
    );

    expect(source).toContain('installPlaywrightTelemetryIsolation(context)');
    expect(source).toContain('await route.fallback()');
  });

  it('installs its browser bootstrap without page errors', async () => {
    const source = readFileSync(
      path.join(process.cwd(), 'scripts/playwright-telemetry-isolation.ts'),
      'utf8',
    );
    const { installPlaywrightTelemetryIsolation } = await import(
      '@/scripts/playwright-telemetry-isolation'
    );
    const browser = await chromium.launch({ headless: true });

    try {
      const context = await browser.newContext();
      await installPlaywrightTelemetryIsolation(context);
      const page = await context.newPage();
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.goto('data:text/html,<title>isolated</title>');
      await page.waitForTimeout(50);

      expect(source).not.toContain('context.addInitScript(()');
      expect(pageErrors).toEqual([]);
      await context.close();
    } finally {
      await browser.close();
    }
  });

  it('routes every repository E2E spec through the isolated fixture', () => {
    const e2eDirectory = path.join(process.cwd(), 'tests/e2e');
    const specFiles = readdirSync(e2eDirectory).filter((file) => file.endsWith('.spec.ts'));

    expect(specFiles.length).toBeGreaterThan(0);
    for (const specFile of specFiles) {
      const source = readFileSync(path.join(e2eDirectory, specFile), 'utf8');
      expect(source, specFile).toContain("from './fixtures'");
    }
  });
});
