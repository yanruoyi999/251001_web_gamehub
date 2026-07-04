import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale, localePrefix } from './i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  localeCookie: false,
  localeDetection: false,
});

export default function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/admin')) {
    return;
  }

  const pathLocale = url.pathname.split('/')[1];
  const locale = locales.find((candidate) => candidate === pathLocale) ?? defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-intl-locale', locale);

  const response = intlMiddleware(new NextRequest(request, { headers: requestHeaders }));
  response.headers.set('Content-Language', locale);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|admin|.*\\.\\w+$).*)',
  ],
};
