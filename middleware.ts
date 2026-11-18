import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale, normalizePublicPathname } from './i18n/config';
import { isLocalCatalogueMode } from './lib/games/catalog-mode';

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/admin')) {
    return isLocalCatalogueMode()
      ? new NextResponse(null, { status: 404 })
      : NextResponse.next();
  }

  const pathLocale = url.pathname.split('/')[1];
  const locale = isLocale(pathLocale) ? pathLocale : defaultLocale;
  const lowerCaseLocale = pathLocale.toLowerCase();
  let response: NextResponse;

  if (pathLocale === defaultLocale) {
    url.pathname = normalizePublicPathname(url.pathname);
    response = NextResponse.redirect(url);
  } else if (isLocale(pathLocale)) {
    response = NextResponse.next();
  } else if (isLocale(lowerCaseLocale)) {
    url.pathname = `/${lowerCaseLocale}${url.pathname.slice(pathLocale.length + 1)}`;
    response = NextResponse.redirect(url);
  } else {
    url.pathname = `/${defaultLocale}${url.pathname === '/' ? '' : url.pathname}`;
    response = NextResponse.rewrite(url);
  }

  // Canonical and hreflang live in the rendered page metadata.
  response.headers.set('Content-Language', locale);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|og/|.*\\.\\w+$).*)'],
};
