import { defineConfig, devices } from '@playwright/test';

const rawBaseURL = process.env.PLAYWRIGHT_BASE_URL;

if (!rawBaseURL) {
  throw new Error(
    'PLAYWRIGHT_BASE_URL is required for production smoke tests (expected https://www.lumagamehub.com).',
  );
}

const parsedBaseURL = new URL(rawBaseURL);
const allowedProductionHosts = new Set([
  'lumagamehub.com',
  'www.lumagamehub.com',
]);

if (
  parsedBaseURL.protocol !== 'https:' ||
  !allowedProductionHosts.has(parsedBaseURL.hostname)
) {
  throw new Error(
    `Production smoke tests refuse non-Luma targets: ${parsedBaseURL.origin}`,
  );
}

export default defineConfig({
  testDir: './tests/production-e2e',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: parsedBaseURL.origin,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'production-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
