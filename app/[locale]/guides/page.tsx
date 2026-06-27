import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/i18n/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (params.locale as Locale) ?? 'zh';
  const heading = locale === 'zh' ? '游戏主题攻略与精选合集' : 'Game Guides & Curated Collections';
  const description =
    locale === 'zh'
      ? '发现 Luma Game Hub 精选的主题攻略页面：移动端体验、短时游玩以及不同类型的浏览器游戏。'
      : 'Explore Luma Game Hub’s curated guides for mobile play, short sessions, and different browser-game styles.';

  const basePath = `/${locale}/guides`;

  return {
    title: locale === 'zh' ? '游戏攻略与主题合集' : 'Game Guides and Collections',
    description,
    keywords:
      locale === 'zh'
        ? ['游戏攻略', '浏览器小游戏', 'iPhone 游戏推荐', '打发时间的小游戏']
        : ['game guides', 'browser games', 'best free iphone games', 'games to play when bored'],
    alternates: {
      canonical: basePath,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          `/${loc}/guides`,
        ]),
      ),
    },
    openGraph: {
      title: heading,
      description,
      url: basePath,
      type: 'website',
      images: DEFAULT_OPEN_GRAPH_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title: heading,
      description,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

interface GuidesPageProps {
  params: { locale: string };
}

export default function GuidesPage({ params }: GuidesPageProps) {
  const locale = (params.locale as Locale) ?? 'zh';
  const pages = getSeoLandingPages();
  const heading = locale === 'zh' ? '专题合集' : 'Curated Guides';
  const intro =
    locale === 'zh'
      ? '从低干扰玩法到移动端体验，我们按不同场景整理并复核浏览器游戏。选择一个主题，查看适配说明后开始游玩。'
      : 'From lower-interruption picks to mobile browser candidates, these guides organize games by real play scenarios. Check the device notes, choose a theme, and start playing.';

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-foreground">{heading}</h1>
        <p className="mt-4 text-base text-muted-foreground">{intro}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {pages.map((page) => {
          const content = page.locales[locale] ?? page.locales.zh;
          const href = `/${locale}/guides/${page.slug}`;
          const summary = content.overview[0] ?? '';

          return (
            <Card key={page.slug} className="flex h-full flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  {content.heading}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-6 text-sm text-muted-foreground">
                <p>{summary}</p>
                <div className="mt-auto">
                  <Link
                    href={href}
                    className="inline-flex items-center text-primary transition hover:text-primary/80"
                    prefetch
                  >
                    {locale === 'zh' ? '阅读完整攻略' : 'Read the full guide'} →
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        {locale === 'zh'
          ? '提示：收藏本页，随时查看新发布的浏览器游戏主题合集。'
          : 'Tip: Bookmark this page to see newly published browser-game collections.'}
      </footer>
    </div>
  );
}
