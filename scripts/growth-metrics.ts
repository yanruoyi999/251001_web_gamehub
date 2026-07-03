import './load-env';

import { createSign } from 'node:crypto';

import { getSiteBaseUrl } from '@/lib/seo';

type MetricStatus = 'ok' | 'skipped' | 'error';

interface MetricResult {
  name: string;
  status: MetricStatus;
  detail: string;
}

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
];
const CHECK_TIMEOUT_MS = 15000;

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

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function getEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return '';
}

async function fetchJson(url: string, init?: RequestInit) {
  const response = await withTimeout(fetch(url, init), CHECK_TIMEOUT_MS, `Fetch ${url}`);
  const text = await response.text();
  let payload: unknown = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const snippet = typeof payload === 'string' ? payload.slice(0, 160) : JSON.stringify(payload).slice(0, 160);
    throw new Error(`HTTP ${response.status}: ${snippet}`);
  }

  return payload;
}

async function getGoogleToken() {
  const directToken = getEnv('GOOGLE_OAUTH_ACCESS_TOKEN', 'GA4_ACCESS_TOKEN', 'GSC_ACCESS_TOKEN');
  if (directToken) return directToken;

  const clientId = getEnv('GOOGLE_CLIENT_ID', 'GA4_CLIENT_ID', 'GSC_CLIENT_ID');
  const clientSecret = getEnv('GOOGLE_CLIENT_SECRET', 'GA4_CLIENT_SECRET', 'GSC_CLIENT_SECRET');
  const refreshToken = getEnv('GOOGLE_REFRESH_TOKEN', 'GA4_REFRESH_TOKEN', 'GSC_REFRESH_TOKEN');

  if (clientId && clientSecret && refreshToken) {
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      scope: GOOGLE_SCOPES.join(' '),
    });
    const payload = (await fetchJson(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    })) as { access_token?: string };

    if (!payload.access_token) throw new Error('Google OAuth response did not include access_token');
    return payload.access_token;
  }

  const clientEmail = getEnv('GOOGLE_CLIENT_EMAIL', 'GA4_CLIENT_EMAIL', 'GSC_CLIENT_EMAIL');
  const privateKey = getEnv('GOOGLE_PRIVATE_KEY', 'GA4_PRIVATE_KEY', 'GSC_PRIVATE_KEY').replace(/\\n/g, '\n');

  if (clientEmail && privateKey) {
    const now = Math.floor(Date.now() / 1000);
    const assertion = [
      base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
      base64Url(
        JSON.stringify({
          iss: clientEmail,
          scope: GOOGLE_SCOPES.join(' '),
          aud: GOOGLE_TOKEN_URL,
          exp: now + 3600,
          iat: now,
        }),
      ),
    ].join('.');
    const signature = createSign('RSA-SHA256').update(assertion).sign(privateKey, 'base64url');
    const body = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${assertion}.${signature}`,
    });
    const payload = (await fetchJson(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    })) as { access_token?: string };

    if (!payload.access_token) throw new Error('Google service account response did not include access_token');
    return payload.access_token;
  }

  return '';
}

async function checkGa4(): Promise<MetricResult> {
  const propertyId = getEnv('GA4_PROPERTY_ID', 'GOOGLE_ANALYTICS_PROPERTY_ID');
  if (!propertyId) {
    return {
      name: 'ga4',
      status: 'skipped',
      detail: 'GA4_PROPERTY_ID / GOOGLE_ANALYTICS_PROPERTY_ID not configured',
    };
  }

  try {
    const token = await getGoogleToken();
    if (!token) {
      return {
        name: 'ga4',
        status: 'skipped',
        detail: 'Google OAuth or service-account credentials not configured',
      };
    }

    const startDate = daysAgo(30);
    const endDate = daysAgo(1);
    const payload = (await fetchJson(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'engagementRate' }],
          limit: 10,
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        }),
      },
    )) as {
      rows?: Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }>;
      rowCount?: number;
    };

    const rows = payload.rows ?? [];
    const totals = rows.reduce(
      (acc, row) => ({
        users: acc.users + Number(row.metricValues?.[0]?.value ?? 0),
        sessions: acc.sessions + Number(row.metricValues?.[1]?.value ?? 0),
      }),
      { users: 0, sessions: 0 },
    );
    const top = rows
      .slice(0, 3)
      .map((row) => `${row.dimensionValues?.[0]?.value ?? 'unknown'}:${row.metricValues?.[1]?.value ?? 0}`)
      .join(', ');

    return {
      name: 'ga4',
      status: 'ok',
      detail: `${startDate}..${endDate}: ${totals.users} active users / ${totals.sessions} sessions; top channels ${top || 'none'}`,
    };
  } catch (error) {
    return { name: 'ga4', status: 'error', detail: error instanceof Error ? error.message : String(error) };
  }
}

async function checkGsc(): Promise<MetricResult> {
  const siteUrl = getEnv('GSC_SITE_URL', 'MONITORING_SITE_URL') || getSiteBaseUrl();

  try {
    const token = await getGoogleToken();
    if (!token) {
      return {
        name: 'gsc',
        status: 'skipped',
        detail: 'Google OAuth or service-account credentials not configured',
      };
    }

    const startDate = daysAgo(30);
    const endDate = daysAgo(2);
    const payload = (await fetchJson(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 10,
        }),
      },
    )) as {
      rows?: Array<{ keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }>;
    };

    const rows = payload.rows ?? [];
    const totals = rows.reduce<{ clicks: number; impressions: number }>(
      (acc, row) => ({
        clicks: acc.clicks + Number(row.clicks ?? 0),
        impressions: acc.impressions + Number(row.impressions ?? 0),
      }),
      { clicks: 0, impressions: 0 },
    );
    const top = rows
      .slice(0, 3)
      .map((row) => `${row.keys?.[0] ?? 'unknown'}:${row.clicks ?? 0}/${row.impressions ?? 0}`)
      .join(', ');

    return {
      name: 'gsc',
      status: 'ok',
      detail: `${startDate}..${endDate}: ${totals.clicks} clicks / ${totals.impressions} impressions; top queries ${top || 'none'}`,
    };
  } catch (error) {
    return { name: 'gsc', status: 'error', detail: error instanceof Error ? error.message : String(error) };
  }
}

async function checkClarity(): Promise<MetricResult> {
  const token = getEnv('CLARITY_API_TOKEN', 'CLARITY_DATA_EXPORT_TOKEN');
  if (!token) {
    return {
      name: 'clarity',
      status: 'skipped',
      detail: 'CLARITY_API_TOKEN / CLARITY_DATA_EXPORT_TOKEN not configured',
    };
  }

  try {
    const payload = await fetchJson(
      'https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3&dimension1=URL',
      {
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      },
    );

    const items = Array.isArray(payload) ? payload : [];
    return {
      name: 'clarity',
      status: 'ok',
      detail: `last 72h live insights rows=${items.length}; inspect dashboard/API payload for heatmaps, dead clicks, rage clicks, script errors`,
    };
  } catch (error) {
    return { name: 'clarity', status: 'error', detail: error instanceof Error ? error.message : String(error) };
  }
}

async function checkTypeform(): Promise<MetricResult> {
  const formId = getEnv('NEXT_PUBLIC_GAMEHUB_TYPEFORM_FORM_ID', 'NEXT_PUBLIC_TYPEFORM_FORM_ID');
  const token = getEnv('TYPEFORM_TOKEN', 'TYPEFORM_ACCESS_TOKEN');

  if (!formId) {
    return { name: 'typeform', status: 'skipped', detail: 'Typeform form id not configured' };
  }

  if (!token) {
    try {
      const response = await withTimeout(
        fetch(`https://form.typeform.com/to/${formId}`, { method: 'HEAD', redirect: 'follow' }),
        CHECK_TIMEOUT_MS,
        'Typeform public form check',
      );
      return {
        name: 'typeform',
        status: 'skipped',
        detail: `public form reachable HTTP ${response.status}; TYPEFORM_TOKEN / TYPEFORM_ACCESS_TOKEN not configured for responses`,
      };
    } catch (error) {
      return { name: 'typeform', status: 'error', detail: error instanceof Error ? error.message : String(error) };
    }
  }

  try {
    const since = `${daysAgo(30)}T00:00:00Z`;
    const payload = (await fetchJson(
      `https://api.typeform.com/forms/${encodeURIComponent(formId)}/responses?page_size=100&since=${encodeURIComponent(since)}`,
      {
        headers: { authorization: `Bearer ${token}` },
      },
    )) as { total_items?: number; items?: unknown[] };

    return {
      name: 'typeform',
      status: 'ok',
      detail: `since ${since}: ${payload.total_items ?? payload.items?.length ?? 0} responses`,
    };
  } catch (error) {
    return { name: 'typeform', status: 'error', detail: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  const checks = await Promise.all([checkGa4(), checkGsc(), checkClarity(), checkTypeform()]);

  console.log('Luma Game Hub Growth Metrics\n');
  for (const check of checks) {
    const icon = check.status === 'ok' ? '✅' : check.status === 'skipped' ? '⏭️ ' : '❌';
    console.log(`${icon} ${check.name}: ${check.status} (${check.detail})`);
  }

  process.exit(checks.some((check) => check.status === 'error') ? 1 : 0);
}

main();
