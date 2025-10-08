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

    pageview(url);
  }, [pathname, search]);

  return null;
};

export default AnalyticsListener;
