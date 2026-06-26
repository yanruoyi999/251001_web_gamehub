import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { locales } from '@/i18n/config';

interface MonsterSurvivorsPageProps {
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: MonsterSurvivorsPageProps): Metadata {
  const locale = params.locale === 'zh' ? 'zh' : 'en';
  const title =
    locale === 'zh'
      ? 'Monster Survivors - 免费在线生存动作游戏'
      : 'Monster Survivors - Free Online Survival Action Game';
  const description =
    locale === 'zh'
      ? '在线游玩 Monster Survivors，在浏览器中躲避怪物、升级技能并坚持更久，无需下载安装。'
      : 'Play Monster Survivors online in your browser. Dodge monsters, upgrade skills, and survive longer with no download required.';
  const canonical = `/${locale}/games/monster-survivors`;

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? ['Monster Survivors', '生存游戏', '免费在线游戏', '浏览器动作游戏']
        : ['Monster Survivors', 'survival game', 'free online game', 'browser action game'],
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          `/${loc}/games/monster-survivors`,
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function MonsterSurvivorsPage({ params }: MonsterSurvivorsPageProps) {
  const { locale } = params;
  const t = await getTranslations('MonsterSurvivors');

  const tips = [
    t('tips.items.0'),
    t('tips.items.1'),
    t('tips.items.2'),
    t('tips.items.3'),
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">{t('tagline')}</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">{t('summary')}</p>
        </div>
        <Link
          href={`/${locale}/games`}
          className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          ← {t('backToList')}
        </Link>
      </header>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">{t('playSection.title')}</CardTitle>
          <CardDescription className="text-sm text-gray-600">{t('playSection.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-black">
            <div className="aspect-video">
              <iframe
                src="https://cloud.onlinegames.io/games/2025/unity/monster-survivors/index-og.html"
                title="Monster Survivors"
                loading="lazy"
                allowFullScreen
                sandbox="allow-scripts allow-fullscreen"
                className="h-full w-full"
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">{t('playSection.hint')}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('details.title')}</CardTitle>
            <CardDescription className="text-sm text-gray-600">{t('details.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>
              <span className="font-medium text-gray-900">{t('details.genre.label')}:</span>{' '}
              {t('details.genre.value')}
            </p>
            <p>
              <span className="font-medium text-gray-900">{t('details.session.label')}:</span>{' '}
              {t('details.session.value')}
            </p>
            <p>
              <span className="font-medium text-gray-900">{t('details.controls.label')}:</span>{' '}
              {t('details.controls.value')}
            </p>
            <p>
              <span className="font-medium text-gray-900">{t('details.devices.label')}:</span>{' '}
              {t('details.devices.value')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('tips.title')}</CardTitle>
            <CardDescription className="text-sm text-gray-600">{t('tips.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              {tips.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
