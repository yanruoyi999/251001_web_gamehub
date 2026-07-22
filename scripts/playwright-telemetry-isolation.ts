import type { BrowserContext } from '@playwright/test';

const TELEMETRY_BOOTSTRAP = `
Object.defineProperty(window, 'gtag', {
  configurable: true,
  value: function () {},
  writable: true,
});
Object.defineProperty(window, 'clarity', {
  configurable: true,
  value: function () {},
  writable: true,
});
`;

function isHostOrSubdomain(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

export function isPlaywrightTelemetryRequest(requestUrl: string) {
  let url: URL;
  try {
    url = new URL(requestUrl);
  } catch {
    return false;
  }

  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();

  if (
    isHostOrSubdomain(hostname, 'google-analytics.com') ||
    hostname === 'stats.g.doubleclick.net' ||
    (isHostOrSubdomain(hostname, 'google.com') && pathname.startsWith('/g/collect'))
  ) {
    return true;
  }

  if (
    (isHostOrSubdomain(hostname, 'clarity.ms') &&
      (pathname.startsWith('/collect') || pathname === '/c.gif')) ||
    (hostname === 'c.bing.com' && pathname === '/c.gif')
  ) {
    return true;
  }

  if (isHostOrSubdomain(hostname, 'vercel-insights.com')) {
    return true;
  }

  if (pathname.startsWith('/_vercel/insights')) {
    return !pathname.endsWith('/script.js') && !pathname.endsWith('/script.debug.js');
  }

  if (pathname.startsWith('/_vercel/speed-insights')) {
    return pathname.endsWith('/vitals');
  }

  return false;
}

export async function installPlaywrightTelemetryIsolation(context: BrowserContext) {
  await context.addInitScript({ content: TELEMETRY_BOOTSTRAP });

  await context.route('**/*', async (route) => {
    if (isPlaywrightTelemetryRequest(route.request().url())) {
      await route.abort('blockedbyclient');
      return;
    }

    await route.fallback();
  });
}
