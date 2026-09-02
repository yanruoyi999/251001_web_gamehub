import { defineConfig, devices } from '@playwright/test';

const isCi = Boolean(process.env.CI);
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const defaultBaseURL = 'http://localhost:3217';

export const getPlaywrightCiOptions = (enabled: boolean) => ({
  workers: enabled ? 1 : undefined,
  retries: 0,
  trace: enabled ? ('retain-on-failure' as const) : ('on-first-retry' as const),
});

const ciOptions = getPlaywrightCiOptions(isCi);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: ciOptions.retries,
  workers: ciOptions.workers,
  webServer: externalBaseURL
    ? undefined
    : {
        command: isCi
          ? 'corepack pnpm exec next start -p 3217'
          : 'corepack pnpm exec next dev --port 3217',
        url: defaultBaseURL,
        reuseExistingServer: !isCi,
        timeout: 180_000,
        env: {
          GAME_CATALOG_MODE: 'local',
          NEXT_TELEMETRY_DISABLED: '1',
        },
      },
  use: {
    baseURL: externalBaseURL ?? defaultBaseURL,
    trace: ciOptions.trace,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'pixel-7',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'iphone-13',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'pixel-7-touch',
      testDir: './tests/mobile-e2e',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'iphone-13-touch',
      testDir: './tests/mobile-e2e',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
