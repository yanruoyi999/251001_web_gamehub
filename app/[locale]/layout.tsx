import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { locales, defaultLocale, Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  const typedLocale = locale as Locale;

  if (!locales.includes(typedLocale)) {
    notFound();
  }

  const messages = await getMessages({ locale: typedLocale });

  return (
    <NextIntlClientProvider locale={typedLocale ?? defaultLocale} messages={messages}>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
