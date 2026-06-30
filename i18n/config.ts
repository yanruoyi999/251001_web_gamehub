export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';
export const localePrefix = 'as-needed';

export function getLocalizedPath(locale: Locale | string, pathname = ''): string {
  const resolvedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
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
