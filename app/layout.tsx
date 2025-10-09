import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import { headers } from 'next/headers';
import './globals.css';
import { defaultLocale, locales } from '@/i18n/config';
import AnalyticsListener from '@/components/layout/AnalyticsListener';
import { GA_TRACKING_ID } from '@/lib/gtag';
import { getSiteBaseUrl } from '@/lib/seo';

const siteBaseUrl = getSiteBaseUrl();
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GameHub',
  url: siteBaseUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteBaseUrl}/${defaultLocale}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: 'GameHub | Free Browser Games Without Ads',
    template: '%s | GameHub',
  },
  description:
    'GameHub curates ad-free browser games you can play instantly on desktop and mobile. Discover the best free iPhone games, quick boredom busters, and hand-picked collections without intrusive ads, complete with localized guides and themed playlists updated weekly.',
  keywords: [
    'free games no ads',
    'ad free games',
    'best free iphone games',
    'games to play when bored',
    'browser games',
    'mobile friendly games',
  ],
  alternates: {
    canonical: '/',
    languages: Object.fromEntries(
      locales.map((locale) => [
        locale === 'zh' ? 'zh-CN' : 'en-US',
        `/${locale}`,
      ]),
    ),
  },
  openGraph: {
    title: 'GameHub | Free Browser Games Without Ads',
    description:
      'Play curated ad-free browser games instantly. Explore genres, find the best free iPhone games, and jump into quick boredom busters.',
    url: '/',
    siteName: 'GameHub',
    type: 'website',
    locale: 'zh-CN',
    alternateLocale: ['en-US'],
    images: [
      {
        url: 'https://via.placeholder.com/1200x630.png?text=GameHub',
        width: 1200,
        height: 630,
        alt: 'GameHub showcases curated ad-free browser games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GameHub | Free Browser Games Without Ads',
    description:
      'Discover curated browser games with zero intrusive ads. Mobile friendly, quick to launch, and perfect when you need a new favorite.',
    images: ['https://via.placeholder.com/1200x630.png?text=GameHub'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#312e81',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = headers();
  const requestedLocale = headerList.get('x-next-intl-locale');
  const htmlLang = locales.find((locale) => locale === requestedLocale) ?? defaultLocale;

  return (
    <html lang={htmlLang} data-locale={htmlLang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GameHub" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        {GA_TRACKING_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
              `}
            </Script>
            <Suspense fallback={null}>
              <AnalyticsListener />
            </Suspense>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
