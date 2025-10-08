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
                <Link href={`/${locale}/guides`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '专题合集' : 'Guides'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/guides/free-games-no-ads`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '无广告小游戏' : 'Free Games No Ads'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/guides/games-to-play-when-bored`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '打发时间小游戏' : 'Games to Play When Bored'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/search`} className="hover:text-indigo-600">
                  {locale === 'zh' ? '搜索' : 'Search'}
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
