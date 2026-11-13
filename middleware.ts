import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, localePrefix } from './i18n/config';
import { isLocalCatalogueMode } from './lib/games/catalog-mode';
import { isPublicCatalogDocument } from './lib/games/catalog-page-cache';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  localeCookie: false,
  localeDetection: false,
  // Page metadata already emits canonical/hreflang/x-default. Keeping a second
  // automatic Link header created conflicting x-default targets for as-needed
  // default-locale routes, so HTML metadata is the single SEO source of truth.
  alternateLinks: false,
});

export default function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/admin')) {
    return isLocalCatalogueMode()
      ? new NextResponse(null, { status: 404 })
      : NextResponse.next();
  }

  const pathLocale = url.pathname.split('/')[1];
  const locale =
    locales.find(candidate => candidate === pathLocale) ?? defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-intl-locale', locale);

  const response = intlMiddleware(
    new NextRequest(request, { headers: requestHeaders })
  );
  response.headers.set('Content-Language', locale);

  if (isLocalCatalogueMode() && isPublicCatalogDocument(request)) {
    response.headers.append('Vary', 'Cookie');
    response.headers.set('Vercel-CDN-Cache-Control', 's-maxage=120');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|og/|.*\\.\\w+$).*)'],
};
