import Link from "next/link";
import Script from "next/script";
import { getLocale, getTranslations, getMessages } from 'next-intl/server';

type FaqItem = { question: string; answer: string };

type HomeMessages = {
  title?: string;
  seoSection?: {
    title?: string;
    description?: string;
    pointHeading?: string;
    points?: string[];
    cta?: string;
  };
  evilSection?: {
    title?: string;
    description?: string;
    points?: string[];
    cta?: string;
  };
  faq?: {
    title?: string;
    items?: FaqItem[];
  };
};

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations('home');

  const messages = (await getMessages({ locale })) as { home?: HomeMessages };
  const homeMessages = messages.home ?? {};
  const seoSection = homeMessages.seoSection ?? {};
  const evilSection = homeMessages.evilSection ?? {};
  const faqSection = homeMessages.faq ?? {};

  const heroTitle = typeof homeMessages.title === 'string' ? homeMessages.title : t('title');
  const seoPoints = Array.isArray(seoSection.points) ? seoSection.points : [];
  const seoPointHeading = typeof seoSection.pointHeading === 'string' ? seoSection.pointHeading : t('seoSection.title');
  const evilPoints = Array.isArray(evilSection.points) ? evilSection.points : [];
  const faqItems = Array.isArray(faqSection.items) ? faqSection.items : [];
  const popularLinks =
    locale === 'zh'
      ? [
          { href: `/${locale}/guides/google-snake-mods`, label: 'Google Snake Mods' },
          { href: `/${locale}/games/solitaire`, label: '免费在线 Solitaire' },
          { href: `/${locale}/guides/adam-and-eve-walkthrough`, label: 'Adam and Eve 攻略' },
          { href: `/${locale}/guides/games-to-play-when-bored`, label: '解闷小游戏' },
          { href: `/${locale}/guides/best-free-iphone-games`, label: 'iPhone 浏览器游戏' },
        ]
      : [
          { href: `/${locale}/guides/google-snake-mods`, label: 'Google Snake Mods' },
          { href: `/${locale}/games/solitaire`, label: 'Free Online Solitaire' },
          { href: `/${locale}/guides/adam-and-eve-walkthrough`, label: 'Adam and Eve Walkthrough' },
          { href: `/${locale}/guides/games-to-play-when-bored`, label: 'Games to Play When Bored' },
          { href: `/${locale}/guides/best-free-iphone-games`, label: 'Best Free iPhone Games' },
        ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <section className="flex min-h-screen items-center justify-center px-4 py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            {heroTitle}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href={`/${locale}/games`}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              {t('playNow')}
            </Link>

            <Link
              href={`/${locale}/guides`}
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold text-lg hover:bg-primary/10 transition-colors"
            >
              {t('browseArchive')}
            </Link>
          </div>

          <section
            aria-labelledby="popular-from-search"
            className="mx-auto max-w-3xl border-y border-border/70 py-5 text-left"
          >
            <h2
              id="popular-from-search"
              className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {locale === 'zh' ? '近期搜索入口' : 'Popular from search'}
            </h2>
            <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm">
              {popularLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-primary/30 pb-0.5 font-medium text-primary transition hover:border-primary hover:text-primary/80"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <FeatureCard
              icon="📱"
              title={t('features.offline')}
              description={t('features.offlineDesc')}
            />
            <FeatureCard
              icon="💡"
              title={t('features.intelligent')}
              description={t('features.intelligentDesc')}
            />
            <FeatureCard
              icon="📊"
              title={t('features.progress')}
              description={t('features.progressDesc')}
            />
          </div>

          <section className="mt-20 space-y-6 text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
              {seoSection.title ?? t('seoSection.title')}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-center">
              {seoSection.description ?? t('seoSection.description')}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {seoPoints.map((point, index) => (
                <div
                  key={index}
                  className="p-5 rounded-lg border bg-background/80 shadow-sm"
                >
                  <h3 className="text-lg font-medium text-primary mb-2">
                    {`${seoPointHeading} ${index + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
            {seoSection.cta ? (
              <div className="flex justify-center pt-2">
                <Link
                  href={`/${locale}/guides/free-games-no-ads`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
                >
                  {seoSection.cta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ) : null}
          </section>

          { (evilSection.title || evilSection.description || evilPoints.length > 0) && (
            <section className="mt-16 space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
                {evilSection.title ?? t('evilSection.title')}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-center">
                {evilSection.description ?? t('evilSection.description')}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {evilPoints.map((point, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-lg border bg-background/80 shadow-sm"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
              {evilSection.cta ? (
                <div className="flex justify-center pt-2">
                  <Link
                    href={`/${locale}/guides/games-to-play-when-bored`}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
                  >
                    {evilSection.cta}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              ) : null}
            </section>
          )}

          <section className="mt-16 space-y-6 text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
              {faqSection.title ?? t('faq.title')}
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group border rounded-lg bg-background/80 p-4 transition-all"
                >
                  <summary className="cursor-pointer text-lg font-medium text-foreground flex items-center justify-between">
                    <span>{item.question}</span>
                    <span className="text-primary group-open:rotate-90 transition-transform" aria-hidden>
                      ➤
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>

    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      strategy="afterInteractive"
    />
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
