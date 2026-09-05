'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { defaultLocale, locales, type Locale } from '@/i18n/config';

export default function LocaleDocumentSync({ defaultDocumentLocale = defaultLocale }: { defaultDocumentLocale?: Locale }) {
  const pathname = usePathname();

  useEffect(() => {
    const pathLocale = pathname.split('/')[1];
    const locale = locales.find((candidate) => candidate === pathLocale) ?? defaultDocumentLocale;
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
  }, [pathname, defaultDocumentLocale]);

  return null;
}
