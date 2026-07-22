import Link from 'next/link';
import { getLocalizedPath } from '@/i18n/config';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const isZh = locale === 'zh';
  const localizedPath = (pathname = '') => getLocalizedPath(locale, pathname);
  const contactEmail = 'support@lumagamehub.com';
  const trustLinks = [
    {
      href: localizedPath('/about'),
      label: isZh ? '我们如何筛选游戏' : 'How Luma reviews games',
    },
    {
      href: localizedPath('/contact'),
      label: isZh ? '举报游戏或申请下架' : 'Report a game or request removal',
    },
    {
      href: localizedPath('/privacy'),
      label: isZh ? '隐私与 Cookie' : 'Privacy & Cookies',
    },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <span className="text-lg font-bold">L</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Luma <span className="text-primary">Game Hub</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isZh
                ? '发现最好玩的在线小游戏，无需下载，随时畅玩。'
                : 'Discover curated browser games you can play instantly, no downloads required.'}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {isZh ? '快速链接' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={localizedPath()} className="hover:text-primary">
                  {isZh ? '首页' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/games')} className="hover:text-primary">
                  {isZh ? '全部游戏' : 'All Games'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/guides')} className="hover:text-primary">
                  {isZh ? '专题合集' : 'Guides'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/search')} className="hover:text-primary">
                  {isZh ? '搜索游戏' : 'Search Games'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/guides/free-games-no-ads')} className="hover:text-primary">
                  {isZh ? '无广告游戏指南' : 'Ad-Free Games Guide'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/guides/games-to-play-when-bored')} className="hover:text-primary">
                  {isZh ? '无聊时玩什么' : 'Games When Bored'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/about')} className="hover:text-primary">
                  {isZh ? '关于我们' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/contact')} className="hover:text-primary">
                  {isZh ? '联系我们' : 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/privacy')} className="hover:text-primary">
                  {isZh ? '隐私政策' : 'Privacy Policy'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {isZh ? '游戏分类' : 'Categories'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={localizedPath('/games/category/action')} className="hover:text-primary">
                  {isZh ? '动作游戏' : 'Action'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/games/category/puzzle')} className="hover:text-primary">
                  {isZh ? '益智游戏' : 'Puzzle'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/games/category/adventure')} className="hover:text-primary">
                  {isZh ? '冒险游戏' : 'Adventure'}
                </Link>
              </li>
              <li>
                <Link href={localizedPath('/games/category/casual')} className="hover:text-primary">
                  {isZh ? '休闲游戏' : 'Casual'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {isZh ? '信任与支持' : 'Trust & Support'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-primary"
                >
                  {contactEmail}
                </a>
              </li>
              {trustLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            {isZh
              ? '© 2026 Luma Game Hub。精选免费浏览器小游戏，无需下载。'
              : '© 2026 Luma Game Hub. Curated free browser games, no downloads required.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
