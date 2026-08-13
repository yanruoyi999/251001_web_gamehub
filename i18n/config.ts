export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';
export const localePrefix = 'as-needed';

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && (locales as readonly string[]).includes(value));
}

export function normalizePublicPathname(pathname: string): string {
  if (pathname === `/${defaultLocale}`) return '/';
  if (pathname.startsWith(`/${defaultLocale}/`)) {
    return pathname.slice(defaultLocale.length + 1) || '/';
  }
  return pathname;
}

export function getLocalizedPath(locale: Locale | string, pathname = ''): string {
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;
  const normalizedPath =
    !pathname || pathname === '/'
      ? ''
      : pathname.startsWith('/')
        ? pathname
        : `/${pathname}`;

  if (resolvedLocale === defaultLocale) {
    return normalizedPath || '/';
  }

  return `/${resolvedLocale}${normalizedPath}`;
}
