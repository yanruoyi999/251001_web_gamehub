'use client';

import React, { type AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { trackInteraction } from '@/lib/analytics/events';
import { getGuideIntentProperties } from '@/lib/guide-intent';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> & {
  guideSlug: string;
  action: string;
  locale: string;
  eventName?: 'guide_intent_click' | 'okishima_guide_open';
  clientNavigation?: boolean;
};

/** Render a usable anchor during SSR and optionally keep same-tab navigation in the app router. */
export function GuideIntentLink({ guideSlug, action, locale, eventName = 'guide_intent_click', clientNavigation, href, children, ...linkProps }: Props) {
  const properties = getGuideIntentProperties(guideSlug, action, locale);

  if (clientNavigation && href) {
    return (
      <Link
        {...linkProps}
        href={href}
        prefetch={false}
        data-guide-intent-action={action}
        onNavigate={() => {
          if (properties) trackInteraction(eventName, properties, { waitForInitialization: true });
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      {...linkProps}
      href={href}
      data-guide-intent-action={action}
      onClick={() => {
        if (properties) trackInteraction(eventName, properties);
      }}
    >
      {children}
    </a>
  );
}
