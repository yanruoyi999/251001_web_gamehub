import './load-env';

import { getSiteBaseUrl } from '@/lib/seo';

type CheckStatus = 'ok' | 'degraded' | 'skipped' | 'error';

interface CheckResult {
  name: string;
  status: CheckStatus;
  detail: string;
}

const CHECK_TIMEOUT_MS = 15000;
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function daysAgo(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

async function fetchText(url: string, init?: RequestInit) {
  const response = await withTimeout(fetch(url, init), CHECK_TIMEOUT_MS, `Fetch ${url}`);
  const text = await response.text();
  return { response, text };
}

async function checkUrl(name: string, url: string): Promise<CheckResult> {
  try {
    const response = await withTimeout(
      fetch(url, { method: 'HEAD', redirect: 'manual' }),
      CHECK_TIMEOUT_MS,
      `${name} HEAD`,
    );
    const status = response.ok || response.status === 308 ? 'ok' : 'degraded';
    return { name, status, detail: `HTTP ${response.status}` };
  } catch (error) {
    return { name, status: 'error', detail: error instanceof Error ? error.message : String(error) };
  }
}

async function checkSitemap(siteUrl: string): Promise<CheckResult> {
  try {
    const { response, text } = await fetchText(`${siteUrl}/sitemap.xml`);
    if (!response.ok) {
      return { name: 'sitemap', status: 'error', detail: `HTTP ${response.status}` };
    }

    const urlCount = text.match(/<url>/g)?.length ?? 0;
    return { name: 'sitemap', status: urlCount > 0 ? 'ok' : 'degraded', detail: `${urlCount} URLs` };
  } catch (error) {
    return { name: 'sitemap', status: 'error', detail: error instanceof Error ? error.message : String(error) };
  }
}

async function checkPublicHealth(siteUrl: string): Promise<CheckResult> {
  try {
    const { response, text } = await fetchText(`${siteUrl}/api/health`);
    const payload = JSON.parse(text) as { status?: string };
    return {
      name: 'public health',
      status: response.ok && payload.status === 'ok' ? 'ok' : 'degraded',
      detail: `HTTP ${response.status}, status=${payload.status ?? 'unknown'}`,
    };
  } catch (error) {
    return {
      name: 'public health',
      status: 'error',
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkSearchEndpoint(siteUrl: string): Promise<CheckResult> {
  try {
    const { response, text } = await fetchText(`${siteUrl}/api/search?q=snake&limit=3`);
    const payload = JSON.parse(text) as {
      games?: unknown[];
      total?: number;
      source?: string;
      degraded?: boolean;
    };
    const total = Number(payload.total ?? payload.games?.length ?? 0);
    const source = payload.source ?? 'unknown';

    if (!response.ok) {
      return {
        name: 'search api',
        status: 'error',
        detail: `HTTP ${response.status}, source=${source}, total=${total}`,
      };
    }

    return {
      name: 'search api',
      status: total > 0 && source !== 'fallback' && !payload.degraded ? 'ok' : 'degraded',
      detail: `HTTP ${response.status}, source=${source}, total=${total}`,
    };
  } catch (error) {
    return {
      name: 'search api',
      status: 'error',
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

async function getGoogleAccessToken(): Promise<string | null> {
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: GSC_SCOPE,
  });

  const { response, text } = await fetchText('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`Google OAuth failed: HTTP ${response.status} ${text.slice(0, 120)}`);
  }

  const payload = JSON.parse(text) as { access_token?: string };
  if (!payload.access_token) throw new Error('Google OAuth response did not include access_token');
  return payload.access_token;
}

async function checkGsc(siteUrl: string): Promise<CheckResult> {
  try {
    const accessToken = await getGoogleAccessToken();
    const propertyUrl = process.env.GSC_SITE_URL || siteUrl;

    if (!accessToken) {
      return {
        name: 'gsc',
        status: 'skipped',
        detail: 'GSC_CLIENT_ID / GSC_CLIENT_SECRET / GSC_REFRESH_TOKEN not configured',
      };
    }

    const endDate = daysAgo(2);
    const startDate = daysAgo(30);
    const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      propertyUrl,
    )}/searchAnalytics/query`;
    const { response, text } = await fetchText(endpoint, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 10,
      }),
    });

    if (!response.ok) {
      return { name: 'gsc', status: 'error', detail: `HTTP ${response.status}: ${text.slice(0, 120)}` };
    }

    const payload = JSON.parse(text) as {
      rows?: Array<{ clicks?: number; impressions?: number; ctr?: number; position?: number }>;
    };
    const rows = payload.rows ?? [];
    const totals = rows.reduce<{ clicks: number; impressions: number }>(
      (acc, row) => ({
        clicks: acc.clicks + Number(row.clicks ?? 0),
        impressions: acc.impressions + Number(row.impressions ?? 0),
      }),
      { clicks: 0, impressions: 0 },
    );

    return {
      name: 'gsc',
      status: rows.length > 0 ? 'ok' : 'degraded',
      detail: `${startDate}..${endDate}: ${totals.clicks} clicks / ${totals.impressions} impressions across top ${rows.length} queries`,
    };
  } catch (error) {
    return { name: 'gsc', status: 'error', detail: error instanceof Error ? error.message : String(error) };
  }
}

async function checkClarity(): Promise<CheckResult> {
  const projectId =
    process.env.NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) {
    return { name: 'clarity tag', status: 'skipped', detail: 'Clarity project id not configured' };
  }

  try {
    let response = await withTimeout(
      fetch(`https://www.clarity.ms/tag/${projectId}`, { method: 'HEAD' }),
      CHECK_TIMEOUT_MS,
      'Clarity tag HEAD',
    );

    if (response.status === 405) {
      response = await withTimeout(fetch(`https://www.clarity.ms/tag/${projectId}`), CHECK_TIMEOUT_MS, 'Clarity tag GET');
    }

    return {
      name: 'clarity tag',
      status: response.ok ? 'ok' : 'degraded',
      detail: `HTTP ${response.status}; dashboard session metrics still require Microsoft Clarity UI/API access`,
    };
  } catch (error) {
    return { name: 'clarity tag', status: 'error', detail: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  const siteUrl =
    process.env.MONITORING_SITE_URL ||
    process.env.GSC_SITE_URL ||
    (process.env.NODE_ENV === 'production' ? getSiteBaseUrl() : 'https://www.lumagamehub.com');
  const checks = await Promise.all([
    checkUrl('site', siteUrl),
    checkUrl('robots', `${siteUrl}/robots.txt`),
    checkSitemap(siteUrl),
    checkPublicHealth(siteUrl),
    checkSearchEndpoint(siteUrl),
    checkGsc(siteUrl),
    checkClarity(),
  ]);

  console.log(`Luma Game Hub Monitoring (${siteUrl})\n`);
  for (const check of checks) {
    const icon =
      check.status === 'ok' ? '✅' :
      check.status === 'skipped' ? '⏭️ ' :
      check.status === 'degraded' ? '⚠️ ' :
      '❌';
    console.log(`${icon} ${check.name}: ${check.status} (${check.detail})`);
  }

  const hasError = checks.some((check) => check.status === 'error');
  process.exit(hasError ? 1 : 0);
}

main();
