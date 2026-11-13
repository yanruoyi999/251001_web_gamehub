import { isLocalCatalogueMode } from '@/lib/games/catalog-mode';
import { setRequestLocale } from 'next-intl/server';
import { connection } from 'next/server';
import { isLocale, locales } from '@/i18n/config';
import GamePage, { generateMetadata as generateGameMetadata } from '../[slug]/page';

export const revalidate = 3600;

interface TunnelRushPageProps {
  params: Promise<{ locale: string }>;
}

async function gameParams(params: TunnelRushPageProps['params']) {
  if (!isLocalCatalogueMode()) await connection();
  const { locale } = await params;
  if (isLocale(locale)) setRequestLocale(locale);
  return { locale, slug: 'tunnel-rush' };
}

export function generateStaticParams() {
  // Remote catalogues may have live game, review and availability data.
  return isLocalCatalogueMode() ? locales.map(locale => ({ locale })) : [];
}

export function generateMetadata({ params }: TunnelRushPageProps) {
  return generateGameMetadata({ params: gameParams(params) });
}

export default async function TunnelRushPage({ params }: TunnelRushPageProps) {
  const resolved = await gameParams(params);
  return <GamePage params={Promise.resolve(resolved)} />;
}
