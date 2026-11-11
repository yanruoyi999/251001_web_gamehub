'use client';

import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { shouldLoadProductionTelemetry } from '@/lib/analytics/runtime';
import { GA_TRACKING_ID } from '@/lib/gtag';
import { getGuideIntentProperties } from '@/lib/guide-intent';

function record(locale: Locale, action: string, event = 'guide_intent_click') {
  const properties = getGuideIntentProperties('crazy-eights-rules', action, locale);
  if (properties) trackInteraction(event, properties);
}

const copy = {
  en: {
    heading: 'Crazy Eights quick rules',
    rules: [
      'One 52-card deck, no jokers. Deal five each. Turn up a non-eight to start the discard.',
      'Match the top card’s suit or rank. Any eight can call a new suit, which the next player must follow or change with another eight.',
      'Draw until you can play or the stock is empty. If you still cannot play, pass. Agree before dealing how to settle a round if everyone passes.',
      'Empty your hand to win. Collect 50 per eight, 10 per face card or ten, 1 per ace, and face value for the rest.',
    ],
    open: 'Open a late-round example',
    print: 'Print quick rules',
    steps: [
      'Late in the round, the discard shows Q♣. Alex holds 8♦ and 4♠. Alex plays 8♦ and calls hearts.',
      'Jo plays 4♥. A queen of spades would not match the called suit.',
      'Alex has 4♠ left. It matches the new top card by rank. Alex goes out and scores Jo’s remaining cards.',
    ],
  },
  zh: {
    heading: '疯狂八速查表',
    rules: [
      '用一副 52 张牌，去掉鬼牌。每人五张，翻一张非 8 的牌开始。',
      '跟花色或点数。任意一张 8 都能指定新花色，下家必须跟指定花色或出另一张 8。',
      '无牌可出就摸到能出或牌堆用完。仍不能出就跳过。开局前约定全员跳过时如何结算。',
      '先出完者赢，并取得其他玩家剩牌分。8 是 50 分，人头牌与 10 是 10 分，A 是 1 分，其余按点数。',
    ],
    open: '展开牌局末段示例',
    print: '打印速查表',
    steps: [
      '牌局末段，弃牌堆顶是梅花 Q。小林剩方块 8 和黑桃 4，先出方块 8 并指定红桃。',
      '小乔出红桃 4。此时黑桃 Q 不符合指定花色。',
      '小林只剩黑桃 4，能跟牌堆顶的点数。小林出完，获得小乔剩牌的分数。',
    ],
  },
};

export function CrazyEightsQuickRules({ locale }: { locale: Locale }) {
  const viewed = useRef<Locale | null>(null);
  const text = copy[locale];
  useEffect(() => {
    if (viewed.current === locale) return;
    const waitForGa = GA_TRACKING_ID && shouldLoadProductionTelemetry(window.location.hostname);
    let retryTimer: number | undefined;
    let attempts = 0;

    const recordView = () => {
      if (waitForGa && typeof window.gtag !== 'function' && attempts < 10) {
        attempts += 1;
        retryTimer = window.setTimeout(recordView, 300);
        return;
      }
      viewed.current = locale;
      record(locale, 'view_rules', 'guide_intent_view');
    };

    recordView();
    return () => window.clearTimeout(retryTimer);
  }, [locale]);

  return (
    <section data-crazy-eights-print className="mx-auto mb-6 max-w-3xl rounded-lg border border-border bg-card p-4 sm:p-6 print:border-0 print:p-0">
      <h2 className="text-xl font-bold">{text.heading}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
        {text.rules.map(rule => <li key={rule}>{rule}</li>)}
      </ul>
      <details data-print-hide className="mt-4 rounded-md border border-border px-3"
        onToggle={event => { if (event.currentTarget.open) record(locale, 'open_round_example'); }}
      >
        <summary className="min-h-11 cursor-pointer py-3 font-semibold text-primary">{text.open}</summary>
        <ol className="list-decimal space-y-2 pb-3 pl-5 text-sm leading-6">
          {text.steps.map(step => <li key={step}>{step}</li>)}
        </ol>
      </details>
      <button type="button" data-print-hide
        className="mt-4 min-h-11 rounded-md border border-primary px-3 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => { record(locale, 'print_quick_rules'); window.print(); }}
      >{text.print}</button>
    </section>
  );
}
