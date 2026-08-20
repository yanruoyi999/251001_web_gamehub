'use client';

import { Suspense, useSyncExternalStore } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import AnalyticsListener from '@/components/layout/AnalyticsListener';
import { shouldLoadProductionTelemetry } from '@/lib/analytics/runtime';
import { GA_TRACKING_ID } from '@/lib/gtag';

const subscribeToHostname = () => () => undefined;
const getServerTelemetryEnabled = () => false;

function getBrowserTelemetryEnabled() {
  return (
    typeof window !== 'undefined' &&
    shouldLoadProductionTelemetry(window.location.hostname)
  );
}

export function ProductionTelemetry() {
  const telemetryEnabled = useSyncExternalStore(
    subscribeToHostname,
    getBrowserTelemetryEnabled,
    getServerTelemetryEnabled
  );

  if (!telemetryEnabled) return null;

  return (
    <>
      {GA_TRACKING_ID ? (
        <>
          <Script id="ga-init" strategy="afterInteractive">
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
      <Analytics />
      <SpeedInsights />
    </>
  );
}
