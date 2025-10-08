'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { locales } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/game/search-input';

const navItems = [
  { href: '/', labelKey: 'home' },
  { href: '/games', labelKey: 'games' },
];

function LanguageSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const currentLocaleSegment = locales.includes(segments[0] as any) ? segments[0] : null;
  const pathWithoutLocale = currentLocaleSegment
    ? `/${segments.slice(1).join('/')}`
    : pathname;

  const options = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="flex items-center gap-2">
      {options.map((item) => (
        <Link
          key={item.code}
          href={`/${item.code}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`}
          className={clsx(
            'rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
            item.code === activeLocale
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function Header() {
  const t = useTranslations('nav');
  const activeLocale = useLocale();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentLocaleSegment = locales.includes(segments[0] as any)
    ? segments[0]
    : activeLocale;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href={`/${currentLocaleSegment}`}
          className="group flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg">
            <span className="text-lg font-bold">G</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            GameHub
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === `/${currentLocaleSegment}${item.href === '/' ? '' : item.href}`;
            return (
              <Link
                key={item.href}
                href={`/${currentLocaleSegment}${item.href === '/' ? '' : item.href}`}
                className={clsx(
                  'relative text-sm font-medium transition-colors',
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {t(item.labelKey)}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <SearchInput locale={currentLocaleSegment} />
          <Button
            asChild
            size="sm"
            className="hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm md:inline-flex"
          >
            <Link href={`/${currentLocaleSegment}/admin`}>
              <span className="mr-1">🎯</span>
              {t('cta')}
            </Link>
          </Button>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
