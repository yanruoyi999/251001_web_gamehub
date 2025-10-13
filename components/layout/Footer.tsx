import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg">
                <span className="text-lg font-bold">G</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GameHub
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {locale === 'zh'
                ? '发现最好玩的在线小游戏，无需下载，随时畅玩。'
                : 'Discover the best online mini-games, no downloads required.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {locale === 'zh' ? '快速链接' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href={`/${locale}`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '首页' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/games`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '全部游戏' : 'All Games'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/search`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '搜索' : 'Search'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '关于我们' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '联系我们' : 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '隐私政策' : 'Privacy Policy'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {locale === 'zh' ? '游戏分类' : 'Categories'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href={`/${locale}/games`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '动作游戏' : 'Action'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/games`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '益智游戏' : 'Puzzle'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/games`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '冒险游戏' : 'Adventure'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {locale === 'zh' ? '联系我们' : 'Contact'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-indigo-600"
                >
                  <span>📦</span>
                  {t('github')}
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@example.com"
                  className="flex items-center gap-2 hover:text-indigo-600"
                >
                  <span>✉️</span>
                  {t('support')}
                </a>
              </li>
              <li>
                <Link href={`/${locale}/admin`} className="flex items-center gap-2 hover:text-indigo-600">
                  <span>🔐</span>
                  {locale === 'zh' ? '管理后台' : 'Admin'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Partner Links - 友情链接
            rel属性说明：
            - rel="noopener" 用于信任的合作伙伴（当前使用）
            - 如需标记付费/广告链接，使用 rel="noopener sponsored"
            - 如果是用户生成内容链接，使用 rel="noopener nofollow ugc"
            保持锚文本差异化，避免所有链接使用相同文案
        */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h3 className="mb-4 text-center text-sm font-semibold text-gray-900">
            {locale === 'zh' ? '友情链接' : 'Partner Sites'}
          </h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="https://itch.io" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              Itch.io
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://www.kongregate.com" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              Kongregate
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://www.newgrounds.com/games" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              Newgrounds
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://gamejolt.com" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              Game Jolt
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://www.crazygames.com" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              CrazyGames
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://poki.com" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              Poki
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://html5games.com" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              HTML5 Games
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://www.adfreegames.com" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              AdFreeGames
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://ad-freegames.github.io" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              Ad-Free Games Hub
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://phaser.io" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              Phaser
            </a>
            <span className="text-gray-300">|</span>
            <a href="https://playcanvas.com" target="_blank" rel="noopener" className="text-gray-600 hover:text-indigo-600">
              PlayCanvas
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>{t('copyright')}</p>
          <p className="mt-2 text-xs">
            Made with ❤️ using Next.js 14 · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
