import {
  Bookmark,
  BookOpen,
  Gamepad2,
  Home,
  Puzzle,
  Swords,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';

import { getLocalizedPath, type Locale } from '@/i18n/config';

interface PortalRailProps {
  locale: Locale;
  active?: 'home' | 'games' | 'guides' | 'saved';
}

const railItems = [
  { key: 'home', href: '/', label: { en: 'Home', zh: '首页' }, icon: Home },
  { key: 'games', href: '/games', label: { en: 'Games', zh: '游戏' }, icon: Gamepad2 },
  { key: 'guides', href: '/guides', label: { en: 'Guides', zh: '攻略' }, icon: BookOpen },
  { key: 'saved', href: '/games/saved', label: { en: 'Saved games', zh: '收藏' }, icon: Bookmark },
] as const;

const categoryItems = [
  { href: '/games/category/action', label: { en: 'Action games', zh: '动作游戏' }, icon: Swords },
  { href: '/games/category/puzzle', label: { en: 'Puzzle games', zh: '益智游戏' }, icon: Puzzle },
  { href: '/games/category/racing', label: { en: 'Racing games', zh: '竞速游戏' }, icon: Trophy },
] as const;

export function PortalRail({ locale, active }: PortalRailProps) {
  return (
    <aside
      className="hidden md:block"
      aria-label={locale === 'zh' ? '游戏门户快捷入口' : 'Game portal shortcuts'}
    >
      <div className="sticky top-20 flex flex-col items-center gap-1 border-r border-[#dce4df] pr-3 dark:border-border">
        {railItems.map(item => {
          const Icon = item.icon;
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={getLocalizedPath(locale, item.href)}
              aria-label={item.label[locale]}
              title={item.label[locale]}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex size-10 items-center justify-center rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                isActive
                  ? 'bg-[#dcefe0] text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-300'
                  : 'text-[#52645a] hover:bg-white hover:text-emerald-800 dark:text-muted-foreground dark:hover:bg-card dark:hover:text-foreground'
              }`}
            >
              <Icon className="size-5" aria-hidden="true" />
            </Link>
          );
        })}

        <div className="my-2 h-px w-8 bg-[#dce4df] dark:bg-border" />

        {categoryItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={getLocalizedPath(locale, item.href)}
              aria-label={item.label[locale]}
              title={item.label[locale]}
              className="inline-flex size-10 items-center justify-center rounded-md text-[#52645a] transition hover:bg-white hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:text-muted-foreground dark:hover:bg-card dark:hover:text-foreground"
            >
              <Icon className="size-5" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
