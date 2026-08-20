import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import './globals.css';
import { defaultLocale, getLocalizedPath, isLocale, locales } from '@/i18n/config';
import { ProductionTelemetry } from '@/components/analytics/ProductionTelemetry';
import LocaleDocumentSync from '@/components/layout/LocaleDocumentSync';
import { getSiteBaseUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

const siteBaseUrl = getSiteBaseUrl();
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Luma Game Hub',
  url: siteBaseUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteBaseUrl}${getLocalizedPath(defaultLocale, '/search')}?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: 'Luma Game Hub | Free Browser Games Online',
    template: '%s | Luma Game Hub',
  },
  description:
    'Luma Game Hub curates free browser games you can play instantly on desktop and mobile. Discover mobile-friendly games, quick boredom busters, and hand-picked collections with helpful guides and themed playlists updated weekly.',
  keywords: [
    'best free iphone games',
    'games to play when bored',
    'browser games',
    'mobile friendly games',
  ],
  verification:
    googleSiteVerification || bingSiteVerification
      ? {
          ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
          ...(bingSiteVerification
            ? { other: { 'msvalidate.01': bingSiteVerification } }
            : {}),
        }
      : undefined,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
  },
  alternates: {
    canonical: '/',
    languages: Object.fromEntries(
      locales.map((locale) => [
        locale === 'zh' ? 'zh-CN' : 'en-US',
        getLocalizedPath(locale),
      ]),
    ),
  },
  openGraph: {
    title: 'Luma Game Hub | Free Browser Games Online',
    description:
      'Play curated browser games instantly. Explore genres, find mobile-friendly games, and jump into quick boredom busters.',
    url: '/',
    siteName: 'Luma Game Hub',
    type: 'website',
    locale: 'zh-CN',
    alternateLocale: ['en-US'],
    images: [
      {
        url: '/og-gamehub.svg',
        width: 1200,
        height: 630,
        alt: 'Luma Game Hub showcases curated browser games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luma Game Hub | Free Browser Games Online',
    description:
      'Discover curated browser games that are mobile friendly, quick to launch, and easy to browse when you need a new favorite.',
    images: ['/og-gamehub.svg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d1117',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const requestLocale = requestHeaders.get('x-next-intl-locale');
  const documentLocale = isLocale(requestLocale) ? requestLocale : defaultLocale;

  return (
    <html lang={documentLocale} data-locale={documentLocale} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Luma Game Hub" />
        <meta name="format-detection" content="telephone=no" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=location.pathname.split('/')[1];if(l==='en'||l==='zh'){document.documentElement.lang=l;document.documentElement.dataset.locale=l;}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <Suspense fallback={null}>
          <LocaleDocumentSync />
        </Suspense>
        <ProductionTelemetry />
        {children}
      </body>
    </html>
  );
}
