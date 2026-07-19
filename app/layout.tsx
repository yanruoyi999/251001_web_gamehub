import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import { headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { defaultLocale, getLocalizedPath, isLocale, locales } from '@/i18n/config';
import AnalyticsListener from '@/components/layout/AnalyticsListener';
import LocaleDocumentSync from '@/components/layout/LocaleDocumentSync';
import { GA_TRACKING_ID } from '@/lib/gtag';
import { getSiteBaseUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

const siteBaseUrl = getSiteBaseUrl();
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
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://form.typeform.com" />
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
        {GA_TRACKING_ID ? (
          <>
            <Script id="ga-init" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                window.gtag('js', new Date());
                window.gtag('config', '${GA_TRACKING_ID}', { send_page_view: false });
              `}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Suspense fallback={null}>
              <AnalyticsListener />
            </Suspense>
          </>
        ) : null}
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
