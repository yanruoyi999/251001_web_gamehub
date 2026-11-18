'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { getGuideIntentProperties } from '@/lib/guide-intent';

const bids = [6, 7, 8, 9, 10];
const denominations = ['♠', '♣', '♦', '♥', 'NT'];

const exercises = [
  { label: '7♥', bid: 7, denomination: 3, tricks: 7 },
  { label: '8♦', bid: 8, denomination: 2, tricks: 7 },
];

function contractValue(bid: number, denomination: number) {
  return (bid - 6) * 100 + 40 + denomination * 20;
}

function formatScore(score: number) {
  return score < 0 ? `−${Math.abs(score)}` : `+${score}`;
}

export function FiveHundredScoring({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const pair = (contract: number, defence: number) => zh
    ? `叫牌方 ${formatScore(contract)}，防守方 ${formatScore(defence)}`
    : `Bidders ${formatScore(contract)}, defenders ${formatScore(defence)}`;

  return (
    <section className="mb-8 space-y-4 rounded-xl border p-5 sm:p-6" aria-labelledby="five-hundred-score">
      <h2 id="five-hundred-score" className="text-2xl font-semibold">{zh ? 'Five Hundred 计分表' : 'Five Hundred scoring table'}</h2>
      <table className="w-full max-w-xl text-center text-sm">
        <caption className="mb-2 text-left text-muted-foreground">
          {zh ? '澳式四人定约分（NT 为无主）' : 'Australian four-player contract values (NT means no trump)'}
        </caption>
        <thead className="border-b">
          <tr>
            <th scope="col" className="py-2">{zh ? '墩数' : 'Tricks'}</th>
            {denominations.map((name) => <th key={name} scope="col">{name}</th>)}
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr key={bid} className="border-b">
              <th scope="row" className="py-2">{bid}</th>
              {denominations.map((name, index) => <td key={name}>{contractValue(bid, index)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm">{zh ? '7♥ 全拿十墩时，最低按全拿规则记 +250，防守方 0 分。' : 'A 7♥ sweep earns the 250-point minimum for all ten tricks. The defenders score zero.'}</p>
      <h3 className="text-lg font-semibold">{zh ? '先算分，再核对' : 'Work out the score before checking'}</h3>
      {exercises.map(({ label, bid, denomination, tricks }) => {
        const value = contractValue(bid, denomination);
        const made = tricks >= bid;
        const expected = made ? value : -value;
        const defence = (10 - tricks) * 10;
        const choices = [
          { score: value, defence },
          { score: -value, defence: 0 },
          { score: -value, defence },
        ];
        const correctIndex = made ? 0 : 2;
        return (
          <fieldset key={label} className="space-y-2 rounded-lg border px-3 pb-3">
            <legend className="px-1 font-medium">
              {zh ? `定约 ${label}，叫牌方拿 ${tricks} 墩，双方怎么计分？` : `${label} contract, ${tricks} tricks for the bidders. What does each team score?`}
            </legend>
            {choices.map(({ score, defence: choiceDefence }, index) => (
              <button
                type="button"
                key={index}
                className="mr-2 min-h-11 rounded-md border px-3 text-left text-sm aria-pressed:bg-muted"
                aria-pressed={answers[label] === index}
                onClick={() => {
                  if (answers[label] === undefined) {
                    const event = getGuideIntentProperties('500-card-game-rules', `score_${label === '7♥' ? 'first' : 'second'}_${index === correctIndex ? 'correct' : 'incorrect'}`, locale);
                    if (event) trackInteraction('guide_intent_click', event);
                  }
                  setAnswers(previous => ({ ...previous, [label]: index }));
                }}
              >
                {pair(score, choiceDefence)}
              </button>
            ))}
            {answers[label] !== undefined && (
              <p role="status" className="text-sm">
                {zh
                  ? `${answers[label] === correctIndex ? '正确。' : '再对照定约。'}${tricks} 墩${made ? '达到' : '未达到'} ${bid} 墩要求。防守方拿到其余 ${10 - tricks} 墩，每墩 10 分。${pair(expected, defence)}。`
                  : `${answers[label] === correctIndex ? 'Correct.' : 'Check the bid again.'} ${tricks} tricks ${made ? 'meet' : 'fall short of'} the ${bid}-trick target. The defenders win the other ${10 - tricks} tricks at 10 points each. ${pair(expected, defence)}.`}
              </p>
            )}
          </fieldset>
        );
      })}
    </section>
  );
}
