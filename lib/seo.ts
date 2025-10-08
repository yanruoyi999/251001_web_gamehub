const FALLBACK_APP_URL = 'https://gamehub.example.com';

function sanitizeBaseUrl(value: string | undefined | null): string {
  if (!value) {
    return FALLBACK_APP_URL;
  }

  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return FALLBACK_APP_URL;
  }
}

/**
 * Returns the base site URL derived from environment variables with a safe fallback.
 */
export function getSiteBaseUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL;

  return sanitizeBaseUrl(candidate);
}

/**
 * Creates an absolute URL for the provided path by combining it with the site base URL.
 */
export function buildAbsoluteUrl(pathname: string = '/'): string {
  const base = getSiteBaseUrl();
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalizedPath, base).toString();
}
