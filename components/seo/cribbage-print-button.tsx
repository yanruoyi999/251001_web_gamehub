'use client';

import type { Locale } from '@/i18n/config';

export function CribbagePrintButton({ locale }: { locale: Locale }) {
  return (
    <div className="mb-5" data-print-hide>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {locale === 'en' ? 'Print scoring chart' : '打印计分速查表'}
      </button>
    </div>
  );
}
