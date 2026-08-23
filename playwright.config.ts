import { defineConfig, devices } from '@playwright/test';

const isCi = Boolean(process.env.CI);
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const defaultBaseURL = 'http://localhost:3217';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const builtInTouchProjects = Object.entries(devices)
  .filter(([, descriptor]) => descriptor.hasTouch)
  .map(([name, descriptor], index) => ({
    name: `touch-${String(index + 1).padStart(3, '0')}-${slugify(name)}`,
    use: { ...descriptor },
    metadata: { deviceName: name, matrixKind: 'builtin-touch' },
  }));

const desktopProjects = [
  {
    name: 'desktop-chrome',
    use: { ...devices['Desktop Chrome'] },
    metadata: { deviceName: 'Desktop Chrome', matrixKind: 'desktop-browser' },
  },
  {
    name: 'desktop-firefox',
    use: { ...devices['Desktop Firefox'] },
    metadata: { deviceName: 'Desktop Firefox', matrixKind: 'desktop-browser' },
  },
  {
    name: 'desktop-safari',
    use: { ...devices['Desktop Safari'] },
    metadata: { deviceName: 'Desktop Safari', matrixKind: 'desktop-browser' },
  },
  {
    name: 'desktop-chromium-1024x768',
    use: { browserName: 'chromium' as const, viewport: { width: 1024, height: 768 } },
    metadata: { deviceName: 'Chromium 1024x768', matrixKind: 'desktop-viewport' },
  },
  {
    name: 'desktop-chromium-1366x768',
    use: { browserName: 'chromium' as const, viewport: { width: 1366, height: 768 } },
    metadata: { deviceName: 'Chromium 1366x768', matrixKind: 'desktop-viewport' },
  },
  {
    name: 'desktop-chromium-1920x1080',
    use: { browserName: 'chromium' as const, viewport: { width: 1920, height: 1080 } },
    metadata: { deviceName: 'Chromium 1920x1080', matrixKind: 'desktop-viewport' },
  },
  {
    name: 'desktop-chromium-hidpi',
    use: {
      browserName: 'chromium' as const,
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    },
    metadata: { deviceName: 'Chromium 1440x900 @2x', matrixKind: 'desktop-viewport' },
  },
];

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: /snake-3d-device-matrix\.spec\.ts/,
  timeout: 60_000,
  retries: 0,
  workers: isCi ? 2 : undefined,
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
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [...desktopProjects, ...builtInTouchProjects],
});
