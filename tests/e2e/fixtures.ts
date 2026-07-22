import { expect, test as base } from '@playwright/test';

import { installPlaywrightTelemetryIsolation } from '../../scripts/playwright-telemetry-isolation';

const test = base.extend({
  page: async ({ page }, providePage) => {
    await installPlaywrightTelemetryIsolation(page.context());
    await providePage(page);
  },
});

export { expect, test };
