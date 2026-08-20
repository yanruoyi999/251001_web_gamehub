'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Bookmark, Gamepad2, Menu, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import {
  getLocalizedPath,
  isLocale,
  normalizePublicPathname,
} from '@/i18n/config';
import { SearchInput } from '@/components/game/search-input';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { trackEvent } from '@/lib/gtag';

const navItems = [
  { href: '/', labelKey: 'home' },
  { href: '/games', labelKey: 'games' },
  { href: '/games/saved', labelKey: 'saved' },
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
      {options.map(item => (
        <Link
          key={item.code}
          href={getLocalizedPath(item.code, pathWithoutLocale)}
          className={clsx(
            'inline-flex min-h-11 items-center rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
            item.code === activeLocale
              ? 'bg-emerald-500 text-[#102033]'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
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
  const publicPathname = normalizePublicPathname(pathname);
  const segments = pathname.split('/').filter(Boolean);
  const currentLocaleSegment = isLocale(segments[0])
    ? segments[0]
    : activeLocale;
  const mobileMenuRef = useRef<HTMLInputElement>(null);
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname && mobileMenuRef.current) {
      mobileMenuRef.current.checked = false;
    }
    previousPathnameRef.current = pathname;
  }, [pathname]);

  return (
    <header
      data-print-hide
      className="relative sticky top-0 z-50 border-b border-emerald-300/15 bg-[#162033] text-white shadow-[0_8px_24px_-20px_rgba(7,18,34,0.9)]"
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 md:h-16 md:px-6">
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
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500 text-[#102033] shadow-[0_0_0_3px_rgba(52,211,153,0.12)]">
            <Gamepad2 className="size-4" aria-hidden="true" />
          </div>
          <span className="truncate text-base font-bold text-white sm:text-xl">
            Luma <span className="text-emerald-300">Game Hub</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav
          aria-label={
            currentLocaleSegment === 'zh' ? '主导航' : 'Primary navigation'
          }
          className="hidden items-center gap-6 lg:flex"
        >
          {navItems.map(item => {
            const itemHref = getLocalizedPath(currentLocaleSegment, item.href);
            const isActive = publicPathname === itemHref;
            return (
              <Link
                key={item.href}
                href={itemHref}
                className={clsx(
                  'relative inline-flex min-h-11 items-center text-sm font-semibold transition-colors',
                  isActive
                    ? 'text-emerald-300'
                    : 'text-white/65 hover:text-white'
                )}
                aria-current={isActive ? 'page' : undefined}
                onClick={() =>
                  trackEvent('nav_link_click', {
                    target:
                      item.href === '/' ? 'home' : item.href.replace('/', ''),
                    locale: currentLocaleSegment,
                  })
                }
              >
                {t(item.labelKey)}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-emerald-400"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <SearchInput locale={currentLocaleSegment} className="w-64" variant="header" />
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-1.5 md:hidden">
          <Link
            href={getLocalizedPath(currentLocaleSegment, '/games/saved')}
            className="inline-flex size-11 items-center justify-center rounded-md text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            aria-label={
              currentLocaleSegment === 'zh'
                ? '打开我的收藏'
                : 'Open saved games'
            }
            title={currentLocaleSegment === 'zh' ? '我的收藏' : 'Saved games'}
            onClick={() =>
              trackEvent('nav_link_click', {
                target: 'saved',
                locale: currentLocaleSegment,
                source: 'mobile_quick_action',
              })
            }
          >
            <Bookmark className="size-5" aria-hidden="true" />
          </Link>
          <ThemeToggle />
          <input
            ref={mobileMenuRef}
            id="mobile-navigation-toggle"
            type="checkbox"
            className="peer sr-only"
            aria-controls="mobile-navigation"
          />
          <label
            htmlFor="mobile-navigation-toggle"
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition hover:bg-white/10 peer-checked:hidden peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-300"
          >
            <span className="sr-only">
              {currentLocaleSegment === 'zh'
                ? '打开导航菜单'
                : 'Open navigation menu'}
            </span>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </label>
          <label
            htmlFor="mobile-navigation-toggle"
            className="hidden min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition hover:bg-white/10 peer-checked:inline-flex peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-300"
          >
            <span className="sr-only">
              {currentLocaleSegment === 'zh'
                ? '关闭导航菜单'
                : 'Close navigation menu'}
            </span>
            <X className="h-5 w-5" aria-hidden="true" />
          </label>

          <div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-full hidden border-t border-white/10 bg-[#162033] px-4 pb-5 pt-4 shadow-xl peer-checked:block md:hidden"
          >
            <div className="mx-auto w-full max-w-7xl space-y-4">
              <SearchInput
                locale={currentLocaleSegment}
                className="block w-full"
              />
              <nav
                className="grid gap-1"
                aria-label={
                  currentLocaleSegment === 'zh'
                    ? '移动导航'
                    : 'Mobile navigation'
                }
              >
                {navItems.map(item => {
                  const itemHref = getLocalizedPath(
                    currentLocaleSegment,
                    item.href
                  );
                  const isActive = publicPathname === itemHref;

                  return (
                    <Link
                      key={item.href}
                      href={itemHref}
                      className={clsx(
                        'flex min-h-11 items-center rounded-md px-3 text-base font-medium transition-colors',
                        isActive
                          ? 'bg-emerald-400/15 text-emerald-300'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      )}
                      onClick={() =>
                        trackEvent('nav_link_click', {
                          target:
                            item.href === '/'
                              ? 'home'
                              : item.href.replace('/', ''),
                          locale: currentLocaleSegment,
                        })
                      }
                    >
                      {t(item.labelKey)}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm text-white/55">
                  {currentLocaleSegment === 'zh' ? '语言' : 'Language'}
                </span>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
