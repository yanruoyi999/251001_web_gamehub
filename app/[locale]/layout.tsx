import { DocumentShell, documentMetadata, documentViewport } from '@/components/layout/document-shell';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages, getTranslations } from 'next-intl/server';
import {
  getLocalizedPath,
  locales,
  defaultLocale,
  Locale,
} from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClarityConsent } from '@/components/analytics/ClarityConsent';
import { TypeformFeedbackButton } from '@/components/feedback/TypeformFeedbackButton';
import { SpendBillGatesMoneyContextLinks } from '@/components/seo/spend-bill-gates-money-context-links';

export const viewport = documentViewport;

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  if (!locales.includes(typedLocale)) {
    return {};
  }

  const t = await getTranslations({ locale: typedLocale, namespace: 'home' });
  const canonical = getLocalizedPath(typedLocale);
  const languageLinks = Object.fromEntries(
    locales.map(availableLocale => [
      availableLocale === 'zh' ? 'zh-CN' : 'en-US',
      getLocalizedPath(availableLocale),
    ])
  );
  const ogLocale = typedLocale === 'zh' ? 'zh-CN' : 'en-US';

  return {
    ...documentMetadata,
    title: { default: t('title'), template: '%s | Luma Game Hub' },
    description: t('description'),
    alternates: {
      canonical,
      languages: languageLinks,
    },
    openGraph: {
      ...documentMetadata.openGraph,
      title: t('title'),
      description: t('description'),
      url: canonical,
      locale: ogLocale,
      alternateLocale: Object.keys(languageLinks).filter(
        language => language !== ogLocale
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  if (!locales.includes(typedLocale)) {
    notFound();
  }

  const messages = await getMessages({ locale: typedLocale });

  return (
    <DocumentShell locale={typedLocale}>
    <NextIntlClientProvider
      locale={typedLocale ?? defaultLocale}
      messages={messages}
    >
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[60] rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {typedLocale === 'zh' ? '跳到主要内容' : 'Skip to main content'}
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SpendBillGatesMoneyContextLinks />
        <Footer locale={typedLocale} />
        <ClarityConsent locale={typedLocale} />
        <TypeformFeedbackButton locale={typedLocale} />
      </div>
    </NextIntlClientProvider>
    </DocumentShell>
  );
}
