import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { defaultLocale } from '@/i18n/config';
import AnalyticsListener from '@/components/layout/AnalyticsListener';
import { GA_TRACKING_ID } from '@/lib/gtag';

export const metadata: Metadata = {
  title: '游戏聚合站',
  description: 'A comprehensive game aggregation platform',
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
            <AnalyticsListener />
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
