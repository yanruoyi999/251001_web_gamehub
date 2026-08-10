import { permanentRedirect } from 'next/navigation';

import { getLocalizedPath, locales, type Locale } from '@/i18n/config';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PopcornHowToPlayAlias({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(
    getLocalizedPath(locale as Locale, '/guides/how-to-play-popcorn-game'),
  );
}
