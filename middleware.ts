import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale, localePrefix } from './i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export default function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/admin')) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|admin|.*\\.\\w+$).*)',
  ],
};
