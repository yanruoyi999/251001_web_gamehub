'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { scoreOntarioBidEuchreHand } from '@/lib/bid-euchre-guide-content';
import { getGuideIntentProperties } from '@/lib/guide-intent';

const exercises = [
  { id: 'made', bid: 5, tricks: 6, trump: '♥', choices: [[5, 2], [6, 2], [6, 0]] },
  { id: 'missed', bid: 5, tricks: 4, trump: '♥', choices: [[-5, 4], [4, 4], [-5, 0]] },
  { id: 'transfer', bid: 6, tricks: 5, trump: 'NT', choices: [[5, 3], [-6, 0], [-6, 3]] },
] as const;

function signed(points: number) {
  return points > 0 ? `+${points}` : String(points).replace('-', '−');
}

export function BidEuchrePractice({ locale }: { locale: Locale }) {
  const [answers, setAnswers] = useState<Partial<Record<typeof exercises[number]['id'], number>>>({});
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const zh = locale === 'zh';
  const pair = (bidders: number, defenders: number) => zh
    ? `叫牌方 ${signed(bidders)}，防守方 ${signed(defenders)}`
    : `Bidders ${signed(bidders)}, defenders ${signed(defenders)}`;
  const track = (action: string) => {
    const properties = getGuideIntentProperties('bid-euchre-rules', action, locale);
    if (properties) trackInteraction('guide_intent_click', properties);
  };

  return (
    <section className="mb-8 space-y-4 rounded-xl border p-5 sm:p-6" aria-labelledby="bid-euchre-practice">
      <h2 id="bid-euchre-practice" className="text-2xl font-semibold">
        {zh ? '先算分，再看解析' : 'Score the hand before checking'}
      </h2>
      {exercises.map(({ id, bid, trump, tricks, choices }, index) => {
        const expected = scoreOntarioBidEuchreHand(bid, tricks);
        const selected = answers[id];
        const correct = choices.findIndex(([attack, defence]) => attack === expected.bidders && defence === expected.defenders);
        return (
          <fieldset key={id} className="space-y-2 rounded-lg border px-3 pb-3">
            <legend className="px-1 font-medium">
              {zh
                ? `${index + 1}. 叫 ${bid}${trump === 'NT' ? ' 无主' : trump}，叫牌方拿了 ${tricks} 墩。双方得几分？`
                : `${index + 1}. Bid ${bid}${trump === 'NT' ? ' no trump' : trump}, took ${tricks} tricks. How does each team score?`}
            </legend>
            <div className="flex flex-wrap gap-2">
              {choices.map(([bidders, defenders], choice) => (
                <button
                  key={choice}
                  type="button"
                  disabled={!ready}
                  className="min-h-11 rounded-md border px-3 text-left text-sm disabled:opacity-60 aria-pressed:bg-muted"
                  aria-pressed={selected === choice}
                  onClick={() => {
                    if (selected === undefined) {
                      track(`score_${id}_${choice === correct ? 'correct' : 'incorrect'}`);
                      if (Object.keys(answers).length === exercises.length - 1) track('practice_complete');
                    }
                    setAnswers(previous => ({ ...previous, [id]: choice }));
                  }}
                >
                  {pair(bidders, defenders)}
                </button>
              ))}
            </div>
            <p role="status" aria-atomic="true" className="text-sm">
              {selected === undefined ? null : zh
                  ? `${selected === correct ? '正确。' : '再对照叫牌结果。'}${tricks >= bid ? '定约成功，按实际赢墩加分。' : '定约未完成，扣叫牌墩数。'}防守方每墩一分。答案是${pair(expected.bidders, expected.defenders)}。`
                  : `${selected === correct ? 'Correct.' : 'Check the bid again.'} ${tricks >= bid ? 'The bid was made, so count the tricks won.' : 'The bid was set, so subtract the amount bid.'} The defence scores one point per trick. ${pair(expected.bidders, expected.defenders)}.`}
            </p>
          </fieldset>
        );
      })}
    </section>
  );
}
