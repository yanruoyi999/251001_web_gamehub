import { createTranslator, type AbstractIntlMessages } from 'use-intl/core';
import { defaultLocale, isLocale } from './config';

export const translationTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

export async function getMessages({ locale }: { locale: string }): Promise<AbstractIntlMessages> {
  const supportedLocale = isLocale(locale) ? locale : defaultLocale;
  return (await import(`../messages/${supportedLocale}.json`)).default;
}

export async function getTranslations({ locale, namespace }: { locale: string; namespace: string }) {
  const supportedLocale = isLocale(locale) ? locale : defaultLocale;
  const messages = await getMessages({ locale: supportedLocale });
  return createTranslator<Record<string, any>, string>({
    locale: supportedLocale,
    messages,
    namespace,
    timeZone: translationTimeZone,
  });
}
