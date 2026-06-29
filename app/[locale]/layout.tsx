import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages, getTranslations } from 'next-intl/server';
import { locales, defaultLocale, Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClarityConsent } from '@/components/analytics/ClarityConsent';
import { TypeformFeedbackButton } from '@/components/feedback/TypeformFeedbackButton';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: LocaleLayoutProps): Promise<Metadata> {
  const typedLocale = locale as Locale;

  if (!locales.includes(typedLocale)) {
    return {};
  }

  const t = await getTranslations({ locale: typedLocale, namespace: 'home' });
  const canonical = `/${typedLocale}`;
  const languageLinks = Object.fromEntries(
    locales.map((availableLocale) => [
      availableLocale === 'zh' ? 'zh-CN' : 'en-US',
      `/${availableLocale}`,
    ]),
  );
  const ogLocale = typedLocale === 'zh' ? 'zh-CN' : 'en-US';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: languageLinks,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonical,
      locale: ogLocale,
      alternateLocale: Object.keys(languageLinks).filter((language) => language !== ogLocale),
    },
  };
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
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer locale={typedLocale} />
        <ClarityConsent />
        <TypeformFeedbackButton locale={typedLocale} />
      </div>
    </NextIntlClientProvider>
  );
}
