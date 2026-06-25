'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { defaultLocale, locales } from '@/i18n/config';

export default function LocaleDocumentSync() {
  const pathname = usePathname();

  useEffect(() => {
    const pathLocale = pathname.split('/')[1];
    const locale = locales.find((candidate) => candidate === pathLocale) ?? defaultLocale;
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
  }, [pathname]);

  return null;
}
