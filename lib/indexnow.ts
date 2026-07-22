import { getSiteBaseUrl } from '@/lib/seo';

export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
export const INDEXNOW_KEY = '9140751f1bbe87e8c99a338470f94cbc';

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export function normalizeIndexNowUrls(
  candidates: string[],
  siteBaseUrl = getSiteBaseUrl(),
): string[] {
  if (candidates.length === 0) {
    throw new Error('IndexNow requires at least one explicit URL.');
  }

  const site = new URL(siteBaseUrl);
  const normalized = new Set<string>();

  for (const candidate of candidates) {
    try {
      const url = new URL(candidate, site);
      if (url.origin !== site.origin) continue;

      url.hash = '';
      normalized.add(url.toString());
    } catch {
      // Invalid candidates are ignored; the final empty-set guard remains explicit.
    }
  }

  if (normalized.size === 0) {
    throw new Error('IndexNow received no valid same-site URLs.');
  }

  if (normalized.size > 10_000) {
    throw new Error('IndexNow accepts at most 10,000 URLs per submission.');
  }

  return Array.from(normalized);
}

export function buildIndexNowPayload(
  candidates: string[],
  siteBaseUrl = getSiteBaseUrl(),
): IndexNowPayload {
  const site = new URL(siteBaseUrl);

  return {
    host: site.host,
    key: INDEXNOW_KEY,
    keyLocation: new URL(`/${INDEXNOW_KEY}.txt`, site).toString(),
    urlList: normalizeIndexNowUrls(candidates, site.toString()),
  };
}

export async function submitIndexNow(
  candidates: string[],
  fetchImpl: typeof fetch = fetch,
): Promise<{ status: number; submitted: number }> {
  const payload = buildIndexNowPayload(candidates);
  const response = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = (await response.text()).trim();
    throw new Error(
      `IndexNow rejected the submission with HTTP ${response.status}${detail ? `: ${detail}` : ''}`,
    );
  }

  return { status: response.status, submitted: payload.urlList.length };
}
