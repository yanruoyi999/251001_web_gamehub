'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { primieraValues, SCOPA_GUIDE, scoreScopaHand, scopaHands } from '@/lib/scopa-guide-content';

const scoreChoices = [
  ['A 2, B 3', 'A 1, B 4', 'A 1, B 3'],
  ['A 0, B 5', 'A 1, B 5', 'A 0, B 6'],
] as const;

const labels = {
  en: {
    heading: 'Score two Scopa hands',
    intro: 'The capture piles include any cards collected after the final turn. The best card of each suit is already selected. Choose the two final scores before seeing the points breakdown.',
    values: 'Primiera values: 7 = 21, 6 = 18, A = 16, 5 = 15, 4 = 14, 3 = 13, 2 = 12, J/Q/K = 10. An eligible pile needs all four suits.',
    cases: ['Hand 1 — A missing suit', 'Hand 2 — Compare two complete piles'],
    suits: ['Coins', 'Cups', 'Batons', 'Swords'],
    cards: 'Cards captured', coins: 'Coins captured', sevenOfCoins: 'Seven of coins', sweeps: 'Sweeps',
    primiera: 'Primiera', missing: 'None', yes: 'Yes', no: 'No', total: 'Total points',
    pick: 'Choose the final scores', submit: 'Check scores', required: 'Choose a pair of scores.',
    correct: 'Correct.', incorrect: 'Check the breakdown.', ineligible: 'Missing a suit, so ineligible.',
    tie: 'The equal Primiera totals award neither player a point.',
    leftovers: 'Cards collected after the final turn count in the piles. They do not earn an extra sweep.',
  },
  zh: {
    heading: '实算两手 Scopa',
    intro: '末次出牌后收走的余牌已经计入抓牌堆。每门花色最佳的牌已选出，先选双方的本手总分，再看分项。',
    values: 'Primiera 分值为 7＝21，6＝18，A＝16，5＝15，4＝14，3＝13，2＝12，J/Q/K＝10。集齐四门才有资格。',
    cases: ['第 1 手 · 缺一门花色', '第 2 手 · 比较两副完整抓牌堆'],
    suits: ['钱币', '杯', '棍棒', '宝剑'],
    cards: '抓牌总数', coins: '钱币牌数', sevenOfCoins: '钱币 7', sweeps: '清桌次数',
    primiera: 'Primiera', missing: '无', yes: '有', no: '无', total: '合计分数',
    pick: '选择双方总分', submit: '核对分数', required: '请选择一组分数。',
    correct: '正确。', incorrect: '再核对各项。', ineligible: '缺少一门花色，无资格。',
    tie: 'Primiera 总值相同，这一项双方都不得分。',
    leftovers: '末次出牌后收走的余牌计入抓牌堆，但不额外计清桌。',
  },
} as const;

export function ScopaPractice({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const [answers, setAnswers] = useState<string[]>([]);
  const [invalid, setInvalid] = useState(false);
  const [ready, setReady] = useState(false);
  const submittedHands = useRef(new Set<number>());
  const feedback = useRef<HTMLDivElement>(null);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (answers.length > 0) feedback.current?.focus();
  }, [answers]);

  function track(action: string) {
    const properties = getGuideIntentProperties(SCOPA_GUIDE.slug, action, locale);
    if (properties) trackInteraction('guide_intent_click', properties);
  }

  function submit(event: FormEvent<HTMLFormElement>, index: number, correctScore: string) {
    event.preventDefault();
    if (index !== answers.length || submittedHands.current.has(index)) return;
    const picked = new FormData(event.currentTarget).get('scores');
    if (typeof picked !== 'string' || !scoreChoices[index].some(choice => choice === picked)) {
      setInvalid(true);
      event.currentTarget.querySelector('input')?.focus();
      return;
    }

    submittedHands.current.add(index);
    setInvalid(false);
    setAnswers(previous => [...previous, picked]);
    track(`score_${index === 0 ? 'first' : 'second'}_${picked === correctScore ? 'correct' : 'incorrect'}`);
    if (index === scopaHands.length - 1) track('practice_complete');
  }

  return (
    <section id="scopa-practice" data-instant-scroll className="mb-8 space-y-4 rounded-xl border p-4 sm:p-6" aria-labelledby="scopa-practice-heading">
      <h2 id="scopa-practice-heading" className="text-2xl font-semibold">{copy.heading}</h2>
      <p className="text-sm">{copy.intro}</p>
      <p className="rounded-md bg-muted p-3 text-sm">{copy.values}</p>
      {scopaHands.slice(0, answers.length + 1).map((hand, index) => {
        const scores = scoreScopaHand(hand);
        const correctScore = `A ${scores[0].total}, B ${scores[1].total}`;
        const answer = answers[index];
        const submitted = answer !== undefined;
        const captureRows = [
          { title: copy.cards, data: hand.map(pile => pile.cards) },
          { title: copy.coins, data: hand.map(pile => pile.coins) },
          { title: copy.sevenOfCoins, data: hand.map(pile => pile.sevenOfCoins ? copy.yes : copy.no) },
          { title: copy.sweeps, data: hand.map(pile => pile.sweeps) },
          ...copy.suits.map((suit, suitIndex) => ({ title: suit, data: hand.map(pile => pile.bestCards[suitIndex] ?? copy.missing) })),
        ];

        return (
          <form key={index} className="space-y-3 rounded-lg border p-3 sm:p-4" onSubmit={event => submit(event, index, correctScore)}>
            <h3 className="font-semibold">{copy.cases[index]}</h3>
            <table className="w-full text-sm">
              <caption className="sr-only">{copy.cases[index]}</caption>
              <thead>
                <tr className="border-b"><th /><th scope="col">A</th><th scope="col">B</th></tr>
              </thead>
              <tbody>
                {captureRows.map(row => (
                  <tr className="border-b last:border-none" key={row.title}>
                    <th className="py-1 text-left font-normal" scope="row">{row.title}</th>
                    {row.data.map((value, player) => <td className="py-1 text-center" key={player}>{value}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <fieldset disabled={!ready || submitted} aria-describedby={`scopa-feedback-${index}`} className="space-y-2">
              <legend className="text-sm font-medium">{copy.pick}</legend>
              <div className="flex flex-wrap gap-2">
                {scoreChoices[index].map(choice => (
                  <label className="inline-flex min-h-11 items-center gap-2 rounded-md border px-2 text-sm" key={choice}>
                    <input type="radio" name="scores" value={choice} className="h-4 w-4 accent-primary" />
                    {choice}
                  </label>
                ))}
              </div>
              <button type="submit" className="min-h-11 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {copy.submit}
              </button>
            </fieldset>
            <div id={`scopa-feedback-${index}`} role="status" aria-atomic="true" className="space-y-2 text-sm"
              tabIndex={submitted ? -1 : undefined} ref={submitted && index === answers.length - 1 ? feedback : undefined}>
              {!submitted && invalid && copy.required}
              {submitted && (
                <>
                  <p className="font-semibold">{answer === correctScore ? copy.correct : copy.incorrect} {correctScore}</p>
                  <ul className="space-y-1">
                    {scores.map((score, player) => (
                      <li key={player}>
                        {player === 0 ? 'A' : 'B'} · {copy.primiera} · {score.prime === null
                          ? copy.ineligible
                          : `${hand[player].bestCards.map(card => card === null ? '' : primieraValues[card]).join(' + ')} = ${score.prime}`}
                      </li>
                    ))}
                  </ul>
                  {scores[0].prime !== null && scores[0].prime === scores[1].prime && <p>{copy.tie}</p>}
                  <table className="w-full border-y">
                    <caption className="sr-only">{copy.total}</caption>
                    <thead>
                      <tr className="border-b"><th /><th scope="col">A</th><th scope="col">B</th></tr>
                    </thead>
                    <tbody>
                      {(['cards', 'coins', 'sevenOfCoins', 'primiera', 'sweeps'] as const).map(key => (
                        <tr className="border-b last:border-none" key={key}>
                          <th className="py-1 text-left font-normal" scope="row">{copy[key]}</th>
                          {scores.map((score, player) => <td className="py-1 text-center" key={player}>{score.points[key]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p>{copy.leftovers}</p>
                </>
              )}
            </div>
          </form>
        );
      })}
    </section>
  );
}
