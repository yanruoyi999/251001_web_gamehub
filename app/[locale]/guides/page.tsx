import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSeoLandingPages } from '@/lib/seo-landing-content';
import { DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 86400;

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

  const basePath = getLocalizedPath(locale, '/guides');

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
          getLocalizedPath(loc, '/guides'),
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
  const extraGuides = [
    {
      href: getLocalizedPath(locale, '/guides/brainrot-games'),
      title: locale === 'zh' ? 'Brainrot Games Online 攻略合集' : 'Brainrot Games Online',
      summary:
        locale === 'zh'
          ? '围绕最新 Brainrot 浏览器小游戏整理 Lucky Blocks、合成、偷取、收集、Obby、移动端体验和安全说明。'
          : 'A fresh Brainrot browser-game hub covering Lucky Blocks, craft, steal, collect, obby, mobile experience, and safety notes.',
    },
    {
      href: getLocalizedPath(locale, '/guides/lucky-blocks-for-brainrots-guide'),
      title:
        locale === 'zh'
          ? 'Lucky Blocks for Brainrots 攻略'
          : 'Lucky Blocks for Brainrots Guide',
      summary:
        locale === 'zh'
          ? '承接 all Brainrots、Index 图鉴、Rebirth 重生、Lucky Blocks 打法和移动端体验等新词搜索。'
          : 'A fresh guide for all Brainrots, index completion, rebirth timing, Lucky Blocks farming, and mobile checks.',
    },
    {
      href: getLocalizedPath(locale, '/guides/steal-beanstalk-for-brainrots-guide'),
      title:
        locale === 'zh'
          ? 'Steal Beanstalk for Brainrots 攻略'
          : 'Steal Beanstalk for Brainrots Guide',
      summary:
        locale === 'zh'
          ? '拆解 Beanstalk 升级、偷取循环、稀有目标、移动端检查和 Luma 可安全扩展边界。'
          : 'A guide to beanstalk upgrades, stealing loops, rare targets, mobile checks, and safer Luma expansion boundaries.',
    },
    {
      href: getLocalizedPath(locale, '/guides/float-for-brainrots-guide'),
      title: locale === 'zh' ? 'Float for Brainrots 攻略' : 'Float for Brainrots Guide',
      summary:
        locale === 'zh'
          ? '围绕稀有 Brainrots、船只升级、鲨鱼倒计时、返回基地节奏和手机体验做原创攻略。'
          : 'Original guide coverage for rare Brainrots, boat upgrades, shark pressure, return timing, and mobile play.',
    },
    {
      href: getLocalizedPath(locale, '/guides/quick-play-guide'),
      title: locale === 'zh' ? '快速游玩指南' : 'Quick Play Guide',
      summary:
        locale === 'zh'
          ? '面向短时间休息、通勤和等待场景，整理启动快、规则清楚、容易暂停的在线小游戏选择标准。'
          : 'A practical guide for choosing quick online games that start fast, explain themselves clearly, and are easy to pause.',
    },
    {
      href: getLocalizedPath(locale, '/guides/no-download-games'),
      title: locale === 'zh' ? '无需下载的在线小游戏' : 'No Download Games',
      summary:
        locale === 'zh'
          ? '了解无需安装、无需注册、可直接打开的浏览器小游戏如何降低试玩门槛。'
          : 'Learn how no-download browser games reduce install, sign-in, and app-store friction before a first test round.',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-foreground">{heading}</h1>
        <p className="mt-4 text-base text-muted-foreground">{intro}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {extraGuides.map((guide) => (
          <Card key={guide.href} className="flex h-full flex-col justify-between border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                {guide.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-6 text-sm text-muted-foreground">
              <p>{guide.summary}</p>
              <div className="mt-auto">
                <Link href={guide.href} className="inline-flex items-center text-primary transition hover:text-primary/80" prefetch>
                  {locale === 'zh' ? '阅读完整指南' : 'Read the full guide'} →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {pages.map((page) => {
          const content = page.locales[locale] ?? page.locales.zh;
          const href = getLocalizedPath(locale, `/guides/${page.slug}`);
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
