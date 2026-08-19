import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js') as {
  headers: () => Promise<Array<{
    source: string;
    headers: Array<{ key: string; value: string }>;
  }>>;
};

function headerValue(
  route: { headers: Array<{ key: string; value: string }> } | undefined,
  key: string,
) {
  return route?.headers.find(header => header.key === key)?.value;
}

describe('security headers', () => {
  it('allows the Google collection endpoint used by GA4', async () => {
    const routes = await nextConfig.headers();
    const globalRoute = routes.find(route => route.source === '/(.*)');
    const csp = headerValue(globalRoute, 'Content-Security-Policy');

    expect(csp).toContain('https://*.google-analytics.com');
    expect(csp).toContain('https://*.analytics.google.com');
    expect(csp).toContain('https://*.google.com');
  });

  it('keeps the main site non-embeddable while allowing only same-origin runtime framing', async () => {
    const routes = await nextConfig.headers();
    const globalRoute = routes.find(route => route.source === '/(.*)');
    const runtimeRoute = routes.find(
      route => route.source === '/games-runtime/:path*',
    );

    expect(headerValue(globalRoute, 'X-Frame-Options')).toBe('DENY');
    expect(headerValue(globalRoute, 'Content-Security-Policy')).toContain(
      "frame-ancestors 'none'",
    );

    expect(runtimeRoute).toBeDefined();
    expect(headerValue(runtimeRoute, 'X-Frame-Options')).toBe('SAMEORIGIN');

    const runtimeCsp = headerValue(runtimeRoute, 'Content-Security-Policy');
    expect(runtimeCsp).toContain("default-src 'none'");
    expect(runtimeCsp).toContain("script-src 'self'");
    expect(runtimeCsp).toContain('http://localhost:*');
    expect(runtimeCsp).toContain('http://127.0.0.1:*');
    expect(runtimeCsp).toContain('https://www.lumagamehub.com');
    expect(runtimeCsp).toContain("connect-src 'none'");
    expect(runtimeCsp).toContain("frame-ancestors 'self'");
    expect(runtimeCsp).not.toContain("'unsafe-inline'");
    expect(runtimeCsp).not.toContain('https://*.vercel.app');
    expect(runtimeCsp).not.toContain('script-src https:');
  });
});
