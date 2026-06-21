'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { locales } from '@/i18n/config';
import { Button } from '@/components/ui/button';
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
  const currentLocaleSegment = locales.includes(segments[0] as any)
    ? segments[0]
    : activeLocale;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href={`/${currentLocaleSegment}`}
          className="group flex items-center gap-2 transition-transform hover:scale-105"
          onClick={() =>
            trackEvent('nav_logo_click', {
              locale: currentLocaleSegment,
              path: pathname,
            })
          }
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <span className="text-lg font-bold">G</span>
          </div>
          <span className="text-xl font-bold text-foreground">
            Game<span className="text-primary">Hub</span>
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
        <div className="flex items-center gap-3">
          <SearchInput locale={currentLocaleSegment} />
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="hidden bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20 md:inline-flex"
          >
            <Link
              href={`/${currentLocaleSegment}/admin`}
              onClick={() =>
                trackEvent('cta_click', {
                  action: 'open_admin',
                  locale: currentLocaleSegment,
                })
              }
            >
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
