import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockGames } from '@/lib/mock-games';
import { getSeoLandingPages } from '@/lib/seo-landing-content';

export const dynamic = 'force-dynamic';

interface LocalizedHomePageProps {
  params: { locale: string };
}

export default async function LocalizedHomePage({ params }: LocalizedHomePageProps) {
  const { locale } = params;
  const t = await getTranslations('Home');

  const featurePoints = [
    t('featurePoints.0'),
    t('featurePoints.1'),
    t('featurePoints.2'),
  ];

  const popularPoints = [
    t('popularPoints.0'),
    t('popularPoints.1'),
    t('popularPoints.2'),
  ];

  // Mock categories for UI display
  const categories = [
    { name: locale === 'zh' ? '动作' : 'Action', icon: '⚔️', count: 12 },
    { name: locale === 'zh' ? '冒险' : 'Adventure', icon: '🗺️', count: 8 },
    { name: locale === 'zh' ? '益智' : 'Puzzle', icon: '🧩', count: 15 },
    { name: locale === 'zh' ? '竞速' : 'Racing', icon: '🏎️', count: 6 },
    { name: locale === 'zh' ? '射击' : 'Shooting', icon: '🎯', count: 10 },
    { name: locale === 'zh' ? '策略' : 'Strategy', icon: '🎲', count: 9 },
  ];

  const typedLocale = locale === 'zh' ? 'zh' : 'en';
  const guides = getSeoLandingPages();
  const highlightGuideSlugs = [
    'free-games-no-ads',
    'best-free-iphone-games',
    'games-to-play-when-bored',
  ];

  const featuredGuides = highlightGuideSlugs
    .map((slug) => {
      const guide = guides.find((item) => item.slug === slug);
      if (!guide) {
        return null;
      }
      const localized = guide.locales[typedLocale] ?? guide.locales.zh;
      return {
        slug: guide.slug,
        heading: localized.heading,
        summary: localized.overview[0] ?? '',
      };
    })
    .filter((guide): guide is { slug: string; heading: string; summary: string } => Boolean(guide));

  const guidesToDisplay =
    featuredGuides.length > 0
      ? featuredGuides
      : guides.slice(0, 3).map((guide) => {
          const localized = guide.locales[typedLocale] ?? guide.locales.zh;
          return {
            slug: guide.slug,
            heading: localized.heading,
            summary: localized.overview[0] ?? '',
          };
        });

  return (
    <div className="w-full">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-20 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <span className="mr-2">✨</span>
            {t('subtitle')}
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            {t('title')}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
            {locale === 'zh'
              ? '发现最好玩的在线小游戏，无需下载，随时随地畅玩！'
              : 'Discover the best online mini-games, no downloads, play anywhere!'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/${locale}/games`}>
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                <span className="mr-2">🎮</span>
                {locale === 'zh' ? '浏览全部游戏' : 'Browse All Games'}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              <span className="mr-2">🔥</span>
              {locale === 'zh' ? '查看热门' : 'View Trending'}
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">50+</div>
              <div className="text-sm text-white/80">{locale === 'zh' ? '精选游戏' : 'Games'}</div>
            </div>
            <div>
              <div className="text-4xl font-bold">100K+</div>
              <div className="text-sm text-white/80">{locale === 'zh' ? '游玩次数' : 'Plays'}</div>
            </div>
            <div>
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-sm text-white/80">{locale === 'zh' ? '随时可玩' : 'Available'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              {locale === 'zh' ? '🎯 游戏分类' : '🎯 Game Categories'}
            </h2>
            <p className="text-gray-600">
              {locale === 'zh' ? '探索不同类型的精彩游戏' : 'Explore different types of amazing games'}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/${locale}/games`}
                className="group"
              >
                <Card className="transition-all hover:scale-105 hover:shadow-lg">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{category.icon}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">
                          {category.count} {locale === 'zh' ? '款游戏' : 'games'}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 transition-transform group-hover:translate-x-1">→</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                🎮 {locale === 'zh' ? '热门游戏' : 'Featured Games'}
              </h2>
              <p className="text-gray-600">
                {locale === 'zh' ? '最受欢迎的游戏推荐' : 'Most popular game recommendations'}
              </p>
            </div>
            <Link href={`/${locale}/games`}>
              <Button variant="ghost">
                {locale === 'zh' ? '查看全部' : 'View All'} →
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockGames.map((game) => {
              const localizedTitle = locale === 'zh' ? game.title : game.titleEn;
              const localizedDescription = locale === 'zh' ? game.description : game.descriptionEn;
              const coverAlt =
                locale === 'zh'
                  ? `${localizedTitle} 浏览器小游戏封面插画，突出 ${localizedDescription}`
                  : `${localizedTitle} browser mini game cover art highlighting ${localizedDescription}`;

              return (
                <Link
                  key={game.id}
                  href={`/${locale}/games/${game.slug}`}
                  className="group"
                >
                  <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-xl">
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                      <Image
                        src={game.thumbnailUrl}
                        alt={coverAlt}
                        width={400}
                        height={300}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute right-2 top-2 flex gap-1">
                        {game.isNew && (
                          <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                            {locale === 'zh' ? '新' : 'NEW'}
                          </span>
                        )}
                        {game.isHot && (
                          <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                            {locale === 'zh' ? '热' : 'HOT'}
                          </span>
                        )}
                      </div>
                    </div>
                    <CardHeader className="flex flex-col gap-3 pb-3">
                      <CardTitle className="line-clamp-1 text-lg group-hover:text-indigo-600">
                        {locale === 'zh' ? game.title : game.titleEn}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-4 px-6 pb-6 pt-0">
                      <p className="line-clamp-2 min-h-[48px] text-sm text-gray-600">
                        {localizedDescription}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>⭐ 4.5</span>
                        <span>🎮 1.2K {locale === 'zh' ? '次游玩' : 'plays'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              {locale === 'zh' ? '✨ 为什么选择我们' : '✨ Why Choose Us'}
            </h2>
            <p className="text-gray-600">
              {locale === 'zh' ? '为玩家打造的极致游戏体验' : 'Ultimate gaming experience for players'}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-t-4 border-t-indigo-500">
              <CardHeader>
                <div className="mb-2 text-3xl">🚀</div>
                <CardTitle>{locale === 'zh' ? '无需下载' : 'No Downloads'}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {locale === 'zh'
                  ? '所有游戏直接在浏览器中运行，即点即玩，无需等待下载和安装。'
                  : 'All games run directly in your browser, play instantly without waiting for downloads.'}
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <div className="mb-2 text-3xl">🎨</div>
                <CardTitle>{locale === 'zh' ? '精心挑选' : 'Carefully Curated'}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {locale === 'zh'
                  ? '每款游戏都经过精心筛选和测试，确保高质量的游戏体验。'
                  : 'Each game is carefully selected and tested to ensure high-quality gaming experience.'}
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-pink-500">
              <CardHeader>
                <div className="mb-2 text-3xl">📱</div>
                <CardTitle>{locale === 'zh' ? '多设备支持' : 'Multi-Device'}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {locale === 'zh'
                  ? '完美适配桌面、平板和手机，随时随地享受游戏乐趣。'
                  : 'Perfect for desktop, tablet and mobile, enjoy games anytime, anywhere.'}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              {locale === 'zh' ? '📚 热门专题攻略' : '📚 Featured Guides'}
            </h2>
            <p className="text-gray-600">
              {locale === 'zh'
                ? '快速进入“free games no ads”“best free iPhone games”等专题，按场景挑选合适的作品。'
                : 'Jump into guides for free games with no ads, best free iPhone games, and more tailored collections.'}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {guidesToDisplay.map((guide) => (
              <Card
                key={guide.slug}
                className="flex h-full flex-col justify-between border border-gray-200"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {guide.heading}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4 text-sm text-gray-600">
                  <p className="line-clamp-4">{guide.summary}</p>
                  <div className="mt-auto">
                    <Link
                      href={`/${locale}/guides/${guide.slug}`}
                      className="inline-flex items-center text-indigo-600 transition hover:text-indigo-800"
                      prefetch
                    >
                      {locale === 'zh' ? '查看专题' : 'View guide'} →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            {locale === 'zh' ? '准备好开始游戏了吗？' : 'Ready to Start Gaming?'}
          </h2>
          <p className="mb-8 text-xl text-white/90">
            {locale === 'zh'
              ? '加入数千名玩家，发现你的下一个最爱游戏！'
              : 'Join thousands of players and discover your next favorite game!'}
          </p>
          <Link href={`/${locale}/games`}>
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              <span className="mr-2">🎯</span>
              {locale === 'zh' ? '立即开始' : 'Get Started'}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
