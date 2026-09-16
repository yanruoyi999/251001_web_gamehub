'use client';

import { useEffect, useRef } from 'react';
import { getLocalizedPath, type Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import type { SeoLandingQuickPick } from '@/lib/seo-landing-content';

type Props = { guideSlug: string; locale: Locale; picks: SeoLandingQuickPick[] };
export function GuideQuickPicks({ guideSlug, locale, picks }: Props) {
  const list = useRef<HTMLOListElement>(null);
  const viewed = useRef(new Set<string>());
  const context = useRef('');
  useEffect(() => {
    const key = `${guideSlug}:${locale}`;
    if (context.current !== key) { viewed.current.clear(); context.current = key; }
    if (!list.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const action = entry.target.getAttribute('data-guide-pick-action') ?? '';
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || document.visibilityState !== 'visible' || viewed.current.has(action)) continue;
        const properties = getGuideIntentProperties(guideSlug, action, locale);
        if (properties) { viewed.current.add(action); trackInteraction('guide_intent_view', properties); }
      }
    }, { threshold: 0.5 });
    list.current.querySelectorAll('[data-guide-pick-action]').forEach(link => observer.observe(link));
    return () => observer.disconnect();
  }, [guideSlug, locale, picks]);
  return (
    <section data-guide-quick-picks aria-label={locale === 'zh' ? '快速选择浏览器游戏' : 'Quick browser game pick'} className="mt-4">
      <ol ref={list} className="grid gap-3">
        {picks.map(pick => (
          <li key={pick.slug} className="rounded-md border border-primary/30 bg-background p-3">
            <a data-guide-pick-action={pick.action} href={getLocalizedPath(locale, `/games/${pick.slug}`)}
              className="flex min-h-11 items-center justify-between gap-3 font-bold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => {
                const properties = getGuideIntentProperties(guideSlug, pick.action, locale);
                if (properties) trackInteraction('guide_intent_click', properties);
              }}>
              <span>{pick.label}</span><span aria-hidden="true">→</span>
            </a>
            <p className="mt-1 text-sm leading-6 text-foreground">{pick.controls}</p>
            <details className="mt-2 text-xs leading-5 text-muted-foreground">
              <summary className="min-h-11 cursor-pointer py-3 font-medium text-foreground">{locale === 'zh' ? '控制方式与核查范围' : 'Controls and check details'}</summary>
              <dl className="grid gap-2">
                {[[locale === 'zh' ? '屏幕' : 'Screen', pick.orientation], [locale === 'zh' ? '声音' : 'Sound', pick.sound], [locale === 'zh' ? '保存' : 'Saving', pick.saving]].map(([label,value]) => (
                  <div key={label}><dt className="font-semibold text-foreground">{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
              <p className="mt-3">{locale === 'zh' ? '核查日期' : 'Checked'}: {pick.checkedAt}. {pick.environment}</p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
