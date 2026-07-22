'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getLocalizedPath, isLocale } from '@/i18n/config';
import { SearchInput } from '@/components/game/search-input';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { trackEvent } from '@/lib/gtag';

const navItems = [
  { href: '/', labelKey: 'home' },
  { href: '/games', labelKey: 'games' },
  { href: '/guides', labelKey: 'guides' },
];

function LanguageSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const currentLocaleSegment = isLocale(segments[0]) ? segments[0] : null;
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
          href={getLocalizedPath(item.code, pathWithoutLocale)}
          className={clsx(
            'inline-flex min-h-11 items-center rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
            item.code === activeLocale
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent'
          )}
          onClick={() =>
            trackEvent('language_switch', {
              language: item.code,
              previous_language: activeLocale,
              path: pathname,
            })
          }
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
  const currentLocaleSegment = isLocale(segments[0])
    ? segments[0]
    : activeLocale;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href={getLocalizedPath(currentLocaleSegment)}
          className="group flex min-w-0 items-center gap-2 transition-transform hover:scale-105"
          onClick={() =>
            trackEvent('nav_logo_click', {
              locale: currentLocaleSegment,
              path: pathname,
            })
          }
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <span className="text-lg font-bold">L</span>
          </div>
          <span className="truncate text-lg font-bold text-foreground sm:text-xl">
            Luma <span className="hidden text-primary sm:inline">Game Hub</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const itemHref = getLocalizedPath(currentLocaleSegment, item.href);
            const isActive = pathname === itemHref;
            return (
              <Link
                key={item.href}
                href={itemHref}
                className={clsx(
                  'relative text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() =>
                  trackEvent('nav_link_click', {
                    target: item.href === '/' ? 'home' : item.href.replace('/', ''),
                    locale: currentLocaleSegment,
                  })
                }
              >
                {t(item.labelKey)}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <SearchInput locale={currentLocaleSegment} className="w-64" />
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={
              currentLocaleSegment === 'zh'
                ? mobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'
                : mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-border bg-background px-4 pb-5 pt-4 shadow-lg md:hidden"
        >
          <div className="mx-auto w-full max-w-7xl space-y-4">
            <SearchInput locale={currentLocaleSegment} className="block w-full" />
            <nav className="grid gap-1" aria-label={currentLocaleSegment === 'zh' ? '移动导航' : 'Mobile navigation'}>
              {navItems.map((item) => {
                const itemHref = getLocalizedPath(currentLocaleSegment, item.href);
                const isActive = pathname === itemHref;

                return (
                  <Link
                    key={item.href}
                    href={itemHref}
                    className={clsx(
                      'flex min-h-11 items-center rounded-lg px-3 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-accent',
                    )}
                    onClick={() =>
                      trackEvent('nav_link_click', {
                        target: item.href === '/' ? 'home' : item.href.replace('/', ''),
                        locale: currentLocaleSegment,
                      })
                    }
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                {currentLocaleSegment === 'zh' ? '语言' : 'Language'}
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
