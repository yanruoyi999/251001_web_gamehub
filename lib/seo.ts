const FALLBACK_APP_URL = 'https://www.lumagamehub.com';
export const DEFAULT_OG_IMAGE = '/og-gamehub.svg';
export const DEFAULT_OG_IMAGE_ALT = 'Luma Game Hub showcases curated free browser games';
export const DEFAULT_OPEN_GRAPH_IMAGES = [
  {
    url: DEFAULT_OG_IMAGE,
    width: 1200,
    height: 630,
    alt: DEFAULT_OG_IMAGE_ALT,
  },
];
export const DEFAULT_TWITTER_IMAGES = [DEFAULT_OG_IMAGE];

export type SeoContentLocale = 'zh' | 'en';

interface ContextualMetaDescriptionOptions {
  description?: string | null;
  fallback: string;
  context: string;
  locale: SeoContentLocale;
  minLength?: number;
}

function collapseMetaWhitespace(value?: string | null) {
  return value?.replace(/\s+/g, ' ').trim() ?? '';
}

/**
 * Keeps strong existing copy intact and expands only descriptions that are too
 * short to explain the page. The added context must be page-specific and must
 * not contain invented rankings, traffic, ratings, or demand claims.
 */
export function buildContextualMetaDescription({
  description,
  fallback,
  context,
  locale,
  minLength,
}: ContextualMetaDescriptionOptions): string {
  const base = collapseMetaWhitespace(description) || collapseMetaWhitespace(fallback);
  const supplementalContext = collapseMetaWhitespace(context);
  const minimum = minLength ?? (locale === 'zh' ? 70 : 120);

  if (!base) {
    return supplementalContext;
  }

  if (base.length >= minimum || !supplementalContext) {
    return base;
  }

  if (locale === 'zh') {
    const separator = /[。！？]$/.test(base) ? '' : '。';
    return `${base}${separator}${supplementalContext}`;
  }

  const separator = /[.!?]$/.test(base) ? ' ' : '. ';
  return `${base}${separator}${supplementalContext}`;
}

let cachedBaseUrl: string | null = null;
let warnedAboutFallback = false;

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
  if (cachedBaseUrl) {
    return cachedBaseUrl;
  }

  const candidate =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL;

  const resolved = sanitizeBaseUrl(candidate);

  if (!candidate && !warnedAboutFallback && process.env.NODE_ENV === 'development') {
    console.warn(
      `[seo] 未检测到 NEXT_PUBLIC_APP_URL 或 SITE_URL，已回退至 ${FALLBACK_APP_URL}。请在环境变量中设置站点链接以确保生成正确的 canonical 与 sitemap。`,
    );
    warnedAboutFallback = true;
  }

  cachedBaseUrl = resolved;
  return resolved;
}

/**
 * Creates an absolute URL for the provided path by combining it with the site base URL.
 */
export function buildAbsoluteUrl(pathname: string = '/'): string {
  const base = getSiteBaseUrl();
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalizedPath, base).toString();
}
