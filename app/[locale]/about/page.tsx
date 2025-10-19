import { Metadata } from 'next';
import Link from 'next/link';

interface AboutPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const isZh = params.locale === 'zh';
  return {
    title: isZh ? '关于我们 - GameHub' : 'About Us - GameHub',
    description: isZh
      ? '了解GameHub - 精选免费在线游戏平台，无需下载即可畅玩'
      : 'Learn about GameHub - Curated free online gaming platform, play instantly without downloads',
  };
}

export default function AboutPage({ params }: AboutPageProps) {
  const isZh = params.locale === 'zh';
  const techStackItems = [
    {
      href: 'https://nextjs.org/',
      name: 'Next.js 14',
      descriptionZh: '（React 全栈框架）',
      descriptionEn: ' (React Framework)',
    },
    {
      href: 'https://www.typescriptlang.org/',
      name: 'TypeScript',
      descriptionZh: '（为 JavaScript 提供静态类型）',
      descriptionEn: ' (Strongly typed JavaScript)',
    },
    {
      href: 'https://tailwindcss.com/',
      name: 'Tailwind CSS',
      descriptionZh: '（原子化 CSS 框架）',
      descriptionEn: ' (Utility-first CSS framework)',
    },
    {
      href: 'https://www.postgresql.org/',
      name: 'PostgreSQL',
      descriptionZh: '（企业级关系型数据库）',
      descriptionEn: ' (Relational database)',
    },
    {
      href: 'https://redis.io/',
      name: 'Redis',
      descriptionZh: '（高性能内存缓存）',
      descriptionEn: ' (In-memory cache)',
    },
    {
      href: 'https://www.meilisearch.com/',
      name: 'Meilisearch',
      descriptionZh: '（开源全文搜索引擎）',
      descriptionEn: ' (Open-source search engine)',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        {isZh ? '关于 GameHub' : 'About GameHub'}
      </h1>

      <div className="prose prose-indigo max-w-none">
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '我们的使命' : 'Our Mission'}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            {isZh
              ? 'GameHub致力于为全球玩家提供精选的免费在线游戏。我们相信游戏的乐趣应该人人可及，无需下载、无需等待，打开浏览器即可畅玩。'
              : 'GameHub is dedicated to providing curated free online games to players worldwide. We believe gaming joy should be accessible to everyone - no downloads, no waiting, just open your browser and play.'}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '我们做什么' : 'What We Do'}
          </h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-3 text-3xl">🎮</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {isZh ? '精选游戏库' : 'Curated Game Library'}
              </h3>
              <p className="text-sm text-gray-600">
                {isZh
                  ? '我们精心挑选高质量的HTML5游戏，涵盖动作、益智、冒险等多种类型。'
                  : 'We carefully select high-quality HTML5 games across action, puzzle, adventure, and more.'}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-3 text-3xl">⚡</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {isZh ? '即时游玩' : 'Instant Play'}
              </h3>
              <p className="text-sm text-gray-600">
                {isZh
                  ? '所有游戏均可在浏览器中直接运行，无需下载安装，随时随地畅玩。'
                  : 'All games run directly in your browser - no downloads or installations required.'}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-3 text-3xl">🌍</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {isZh ? '多语言支持' : 'Multi-Language Support'}
              </h3>
              <p className="text-sm text-gray-600">
                {isZh
                  ? '支持中英文界面，让全球玩家都能享受游戏乐趣。'
                  : 'Supporting Chinese and English interfaces for global accessibility.'}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-3 text-3xl">💯</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {isZh ? '完全免费' : 'Completely Free'}
              </h3>
              <p className="text-sm text-gray-600">
                {isZh
                  ? '所有游戏免费提供，我们通过广告支持运营，让玩家0成本体验优质游戏。'
                  : 'All games are free. We support operations through ads, enabling zero-cost quality gaming.'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '技术栈' : 'Technology Stack'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh ? 'GameHub使用现代化的技术构建：' : 'GameHub is built with modern technologies:'}
          </p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {techStackItems.map((item) => (
              <li key={item.name} className="flex items-center gap-2 text-gray-700">
                <span className="text-indigo-600">▶</span>
                <span>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener"
                    className="text-indigo-600 transition hover:text-indigo-500"
                  >
                    {item.name}
                  </a>
                  <span className="text-gray-600">
                    {isZh ? item.descriptionZh : item.descriptionEn}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '合作伙伴' : 'Partners'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '我们与多个知名游戏平台和开发工具保持合作关系：'
              : 'We maintain partnerships with leading gaming platforms and development tools:'}
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a href="https://itch.io" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
              Itch.io
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://www.kongregate.com" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
              Kongregate
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://armorgames.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Armor Games（经典网页街机）' : 'Armor Games (Classic web arcade)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://gamejolt.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Game Jolt（小游戏社区）' : 'Game Jolt (Indie community)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://www.crazygames.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'CrazyGames（全球网页游戏平台）' : 'CrazyGames (Global web arcade)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://poki.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Poki（热门休闲游戏合集）' : 'Poki (Casual hits collection)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://www.gamestop.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'GameStop（全球游戏零售与资讯）' : 'GameStop (Global retail & news)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://en.boardgamearena.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Board Game Arena（桌游线上平台）' : 'Board Game Arena (Online tabletop)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://www.coolmathgames.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Coolmath Games（益智游戏精选）' : 'Coolmath Games (Brain teasers)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://www.adfreegames.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'AdFreeGames（无广告游戏目录）' : 'AdFreeGames (Ad-free library)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://ad-freegames.github.io"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Ad-Free Games Hub（GitHub）' : 'Ad-Free Games Hub (GitHub)'}
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://phaser.io" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
              Phaser
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://playcanvas.com" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
              PlayCanvas
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://opengameart.org"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'OpenGameArt（免费游戏素材库）' : 'OpenGameArt (Open asset library)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://www.construct.net"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Construct（可视化 HTML5 引擎）' : 'Construct (Visual HTML5 engine)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://godotengine.org"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Godot Engine（开源 2D/3D 引擎）' : 'Godot Engine (Open-source 2D/3D engine)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://docs.unity3d.com/Manual/webgl-gettingstarted.html"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Unity WebGL 指南' : 'Unity WebGL guide'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://gameanalytics.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'GameAnalytics（免费数据平台）' : 'GameAnalytics (Free analytics)'}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://www.indiedb.com"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'Indie DB（独立游戏曝光平台）' : 'Indie DB (Indie showcase)'}
            </a>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '联系我们' : 'Contact Us'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh ? '有任何问题或建议？我们很乐意听取您的反馈：' : 'Have questions or suggestions? We\'d love to hear from you:'}
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-gray-700">
              📧 {isZh ? '邮箱' : 'Email'}:{' '}
              <a href="mailto:support@gamehub.com" className="text-indigo-600 hover:text-indigo-500">
                support@gamehub.com
              </a>
            </p>
            <p className="text-gray-700">
              📝 {isZh ? '更多信息' : 'More info'}:{' '}
              <Link href={`/${params.locale}/contact`} className="text-indigo-600 hover:text-indigo-500">
                {isZh ? '联系页面' : 'Contact Page'}
              </Link>
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-indigo-100 bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-indigo-900">
            {isZh ? '💡 开发者合作' : '💡 Developer Collaboration'}
          </h2>
          <p className="mt-3 text-sm text-indigo-800">
            {isZh
              ? '如果您是游戏开发者，希望在GameHub上展示您的作品，请通过邮件联系我们。我们欢迎高质量的HTML5游戏！'
              : 'If you\'re a game developer interested in showcasing your work on GameHub, please contact us via email. We welcome high-quality HTML5 games!'}
          </p>
        </section>
      </div>
    </div>
  );
}
