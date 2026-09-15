'use client';

import React, { type AnchorHTMLAttributes } from 'react';
import { trackInteraction } from '@/lib/analytics/events';
import { getGuideIntentProperties } from '@/lib/guide-intent';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> & {
  guideSlug: string;
  action: string;
  locale: string;
};

/** Native link first: navigation still works before hydration or without JavaScript. */
export function GuideIntentLink({ guideSlug, action, locale, children, ...linkProps }: Props) {
  return (
    <a
      {...linkProps}
      data-guide-intent-action={action}
      onClick={() => {
        const properties = getGuideIntentProperties(guideSlug, action, locale);
        if (properties) trackInteraction('guide_intent_click', properties);
      }}
    >
      {children}
    </a>
  );
}
