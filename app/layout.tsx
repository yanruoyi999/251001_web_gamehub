import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import { defaultLocale, locales } from '@/i18n/config';
import AnalyticsListener from '@/components/layout/AnalyticsListener';
import { GA_TRACKING_ID } from '@/lib/gtag';
import { getSiteBaseUrl } from '@/lib/seo';

const siteBaseUrl = getSiteBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: 'GameHub | Free Browser Games Without Ads',
    template: '%s | GameHub',
  },
  description:
    'GameHub curates ad-free browser games you can play instantly on desktop and mobile. Discover the best free iPhone games, quick boredom busters, and hand-picked collections without intrusive ads.',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GameHub | Free Browser Games Without Ads',
    description:
      'Discover curated browser games with zero intrusive ads. Mobile friendly, quick to launch, and perfect when you need a new favorite.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
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
