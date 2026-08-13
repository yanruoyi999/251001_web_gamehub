'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';

interface IntentCtaProps {
  anchorId: string;
  clickEvent: string;
  description: string;
  hookId: string;
  label: string;
  locale: Locale;
  pagePath: string;
  viewEvent: string;
}

export function IntentCta({
  anchorId,
  clickEvent,
  description,
  hookId,
  label,
  locale,
  pagePath,
  viewEvent,
}: IntentCtaProps) {
  const [clicked, setClicked] = useState(false);
  const trackedView = useRef(false);

  useEffect(() => {
    if (trackedView.current) return;
    trackedView.current = true;
    trackInteraction(viewEvent, {
      hook_id: hookId,
      locale,
      page: pagePath,
      source: 'fnf_loading_guide',
    });
  }, [hookId, locale, pagePath, viewEvent]);

  function handleClick() {
    trackInteraction(clickEvent, {
      hook_id: hookId,
      locale,
      page: pagePath,
      source: 'fnf_loading_guide',
    });
    setClicked(true);
  }

  return (
    <section
      id={anchorId}
      className="mt-12 border-y border-border py-10 text-center"
      data-intent-hook={hookId}
    >
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {label}
      </button>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">{description}</p>
      {clicked ? (
        <p role="status" className="mx-auto mt-3 max-w-2xl text-sm font-medium text-primary">
          {locale === 'zh'
            ? '已记录匿名兴趣信号；当前没有注册、上传或生成内容。'
            : 'Anonymous interest recorded. There is no sign-up, upload, or generated content in this experiment.'}
        </p>
      ) : null}
    </section>
  );
}
