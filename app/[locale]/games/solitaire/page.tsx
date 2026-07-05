import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocalizedPath, locales } from '@/i18n/config';
const SOLITAIRE_SCREENSHOT = '/game-screenshots/solitaire.png';

interface SolitairePageProps {
  params: { locale: string };
}

export const revalidate = 86400;

export function generateMetadata({ params }: SolitairePageProps): Metadata {
  const locale = params.locale === 'zh' ? 'zh' : 'en';
  const title =
    locale === 'zh'
      ? 'Solitaire - 免费在线经典纸牌游戏与玩法指南'
      : 'Solitaire - Free Classic Card Game and Guide';
  const description =
    locale === 'zh'
      ? '直接在浏览器中游玩经典 Solitaire 纸牌游戏,查看规则、操作、技巧和常见问题,无需下载安装。'
      : 'Play classic Solitaire online in your browser with clear rules, controls, strategy tips, FAQs, and no download required.';
  const canonical = getLocalizedPath(locale, '/games/solitaire');

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? ['Solitaire', '经典纸牌', '纸牌游戏', '免费在线游戏', '浏览器游戏']
        : ['Solitaire', 'classic solitaire online', 'free online solitaire', 'card game', 'browser game'],
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          getLocalizedPath(loc, '/games/solitaire'),
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: SOLITAIRE_SCREENSHOT,
          width: 1280,
          height: 720,
          alt: locale === 'zh' ? 'Solitaire 经典纸牌游戏截图' : 'Classic Solitaire online card game screenshot',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SOLITAIRE_SCREENSHOT],
    },
  };
}

export default async function SolitairePage({ params }: SolitairePageProps) {
  const { locale } = params;
  const t = await getTranslations('Solitaire');

  const tips = [
    t('tips.items.0'),
    t('tips.items.1'),
    t('tips.items.2'),
    t('tips.items.3'),
  ];
  const overviewParagraphs = [
    t('overview.body.0'),
    t('overview.body.1'),
    t('overview.body.2'),
  ];
  const howToPlaySteps = [
    t('howToPlay.steps.0'),
    t('howToPlay.steps.1'),
    t('howToPlay.steps.2'),
    t('howToPlay.steps.3'),
  ];
  const controlItems = [
    { label: t('controls.items.move.label'), value: t('controls.items.move.value') },
    { label: t('controls.items.stock.label'), value: t('controls.items.stock.value') },
    { label: t('controls.items.foundation.label'), value: t('controls.items.foundation.value') },
    { label: t('controls.items.fullscreen.label'), value: t('controls.items.fullscreen.value') },
  ];
  const faqItems = [
    { question: t('faq.items.0.question'), answer: t('faq.items.0.answer') },
    { question: t('faq.items.1.question'), answer: t('faq.items.1.answer') },
    { question: t('faq.items.2.question'), answer: t('faq.items.2.answer') },
    { question: t('faq.items.3.question'), answer: t('faq.items.3.answer') },
  ];
  const relatedLinks = [
    {
      href: getLocalizedPath(locale, '/guides/no-download-games'),
      title: t('related.items.noDownload.title'),
      description: t('related.items.noDownload.description'),
    },
    {
      href: getLocalizedPath(locale, '/guides/quick-play-guide'),
      title: t('related.items.quickPlay.title'),
      description: t('related.items.quickPlay.description'),
    },
    {
      href: getLocalizedPath(locale, '/games/monster-survivors'),
      title: t('related.items.monsterSurvivors.title'),
      description: t('related.items.monsterSurvivors.description'),
    },
    {
      href: getLocalizedPath(locale, '/guides/free-games-no-ads'),
      title: t('related.items.freeGames.title'),
      description: t('related.items.freeGames.description'),
    },
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">{t('tagline')}</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">{t('summary')}</p>
        </div>
        <Link
          href={getLocalizedPath(locale, '/games')}
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
          <div
            className="overflow-hidden rounded-xl border border-gray-200 bg-black bg-cover bg-center"
            style={{ backgroundImage: `url(${SOLITAIRE_SCREENSHOT})` }}
          >
            <div className="aspect-video">
              <iframe
                src="https://playpager.com/embed/solitaire/index.html"
                title="Solitaire"
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

      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">{t('overview.title')}</CardTitle>
          <CardDescription className="text-sm text-gray-600">{t('overview.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-gray-700">
          {overviewParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
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
            <p>
              <span className="font-medium text-gray-900">{t('details.source.label')}:</span>{' '}
              {t('details.source.value')}
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

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('howToPlay.title')}</CardTitle>
            <CardDescription className="text-sm text-gray-600">{t('howToPlay.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm leading-6 text-gray-700">
              {howToPlaySteps.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('controls.title')}</CardTitle>
            <CardDescription className="text-sm text-gray-600">{t('controls.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            {controlItems.map((item) => (
              <p key={item.label}>
                <span className="font-medium text-gray-900">{item.label}:</span> {item.value}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">{t('faq.title')}</CardTitle>
          <CardDescription className="text-sm text-gray-600">{t('faq.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-900">{item.question}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-700">{item.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">{t('related.title')}</CardTitle>
          <CardDescription className="text-sm text-gray-600">{t('related.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {relatedLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-gray-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50"
            >
              <span className="text-sm font-semibold text-gray-900">{item.title}</span>
              <span className="mt-2 block text-sm leading-6 text-gray-600">{item.description}</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
