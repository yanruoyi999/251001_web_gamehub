'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { getGuideIntentProperties } from '@/lib/guide-intent';

const options = ['CAPSIZE', 'NIGHTCAP', 'SHOEBOX'];
const answer = 'NIGHTCAP';

export function StuttgarterPractice({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const revealed = useRef(false);
  const firstChoice = useRef<string | null>(null);
  const [choice, setChoice] = useState<string | null>(null);

  function track(action: string) {
    const properties = getGuideIntentProperties('stuttgarter-meaning', action, locale);
    if (properties) trackInteraction('guide_intent_click', properties, { waitForInitialization: true });
  }

  return (
    <section aria-label={zh ? '藏词练习' : 'Hidden-word practice'} className="my-6 max-w-3xl space-y-5">
      <details className="rounded-md border p-4" onToggle={event => {
        if (event.currentTarget.open && !revealed.current) {
          revealed.current = true;
          track('reveal_clue');
        }
      }}>
        <summary className="cursor-pointer font-semibold">{zh ? '展开 11 月 20 日 Connections 谜底' : 'Reveal the November 20 Connections clue'}</summary>
        <div data-nosnippet="" className="mt-3"><span lang="en">STUTT<strong>GARTER</strong></span>{zh
          ? ' 的末尾拼出了 GARTER（袜带）。第 1258 期紫色组把词尾藏有内衣名称的单词归在一起。解题时从最后一个字母往前看。'
          : ' ends in GARTER. The purple group in puzzle #1258 used words ending in names of lingerie. Read backward from the final letter to spot where the hidden word begins.'}</div>
      </details>
      <fieldset disabled={!ready} className="rounded-md border p-4">
        <legend className="px-1 font-semibold">{zh ? '试一道原创题：哪个词的末尾藏着一种戴在头上的衣物？' : 'Try a fresh puzzle: which word ends in the name of something you wear on your head?'}</legend>
        <div className="flex flex-wrap gap-2">
          {options.map(option => <button key={option} type="button" lang="en" aria-pressed={choice === option}
            className="min-h-11 rounded-md border px-4 font-semibold aria-pressed:bg-secondary focus-visible:ring-2"
            onClick={() => {
              if (firstChoice.current === null) {
                firstChoice.current = option;
                track(option === answer ? 'first_correct' : 'first_incorrect');
              }
              setChoice(option);
            }}>{option}</button>)}
        </div>
        <p role="status" className="mt-3 text-sm">{choice === null ? '' : choice === answer
          ? (zh ? '答对了。NIGHT + CAP，CAP（帽子）正好占据最后三个字母。' : 'Correct. NIGHT + CAP puts CAP in the final three letters.')
          : (zh ? '再试试。这个词开头藏着衣物名称，题目要找的是词尾。' : 'Try again. This choice starts with a clothing word. Look for one at the end.')}</p>
      </fieldset>
    </section>
  );
}
