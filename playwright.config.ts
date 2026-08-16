import { defineConfig, devices } from '@playwright/test';

const isCi = Boolean(process.env.CI);
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const defaultBaseURL = 'http://localhost:3217';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: 0,
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
    trace: 'on-first-retry',
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
      testIgnore: /mobile-disclosure\.spec\.ts/,
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
  ],
});
