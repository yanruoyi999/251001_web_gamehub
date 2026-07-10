import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js') as {
  headers: () => Promise<Array<{
    headers: Array<{ key: string; value: string }>;
  }>>;
};

describe('security headers', () => {
  it('allows the Google collection endpoint used by GA4', async () => {
    const routes = await nextConfig.headers();
    const csp = routes[0]?.headers.find(
      header => header.key === 'Content-Security-Policy'
    )?.value;

    expect(csp).toContain('https://*.google-analytics.com');
    expect(csp).toContain('https://*.analytics.google.com');
    expect(csp).toContain('https://*.google.com');
  });
});
