'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { pageview, GA_TRACKING_ID } from '@/lib/gtag';

const AnalyticsListener = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString();

  useEffect(() => {
    if (!GA_TRACKING_ID || !pathname) return;

    const url = search ? `${pathname}?${search}` : pathname;
    let retryTimer: number | undefined;
    let attempts = 0;

    const sendPageview = () => {
      if (typeof window.gtag === 'function') {
        pageview(url);
        return;
      }

      if (attempts >= 10) return;
      attempts += 1;
      retryTimer = window.setTimeout(sendPageview, 300);
    };

    sendPageview();

    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [pathname, search]);

  return null;
};

export default AnalyticsListener;
