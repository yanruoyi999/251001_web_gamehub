'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { trackInteraction } from '@/lib/analytics/events';

interface Snake3DDiscoveryLinkProps {
  children: ReactNode;
  href: string;
  locale: string;
  page: string;
}

export function Snake3DDiscoveryLink({
  children,
  href,
  locale,
  page,
}: Snake3DDiscoveryLinkProps) {
  const discoveryRef = useRef<HTMLDivElement>(null);
  const trackedView = useRef(false);

  useEffect(() => {
    const element = discoveryRef.current;
    if (!element || trackedView.current) return;

    const trackView = () => {
      if (trackedView.current) return;
      trackedView.current = true;
      trackInteraction('snake_3d_discovery_view', {
        game_slug: 'snake-3d',
        locale,
        page,
        source: 'google_snake_game_detail',
      });
    };

    if (typeof IntersectionObserver === 'undefined') {
      trackView();
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          trackView();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [locale, page]);

  return (
    <div ref={discoveryRef}>
      <Link
        href={href}
        onClick={() =>
          trackInteraction('snake_3d_discovery_click', {
            game_slug: 'snake-3d',
            locale,
            page,
            source: 'google_snake_game_detail',
          })
        }
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </Link>
    </div>
  );
}
