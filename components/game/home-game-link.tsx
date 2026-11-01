'use client';

import React, { type ReactNode } from 'react';
import Link from 'next/link';
import { trackInteraction } from '@/lib/analytics/events';

interface HomeGameLinkProps {
  href: string;
  gameSlug: string;
  locale: string;
  className?: string;
  children: ReactNode;
}

export function HomeGameLink({ href, gameSlug, locale, className, children }: HomeGameLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      data-shelf-card
      onClick={() => trackInteraction('home_game_card_click', {
        game_slug: gameSlug,
        locale,
        page: `/${locale}`,
        source: 'home_more_games',
      })}
    >
      {children}
    </Link>
  );
}
