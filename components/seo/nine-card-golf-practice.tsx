'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { golfCardValues, golfColumns, golfHands, NINE_CARD_GOLF_GUIDE, scoreGolfHand } from '@/lib/nine-card-golf-guide-content';

export function NineCardGolfPractice({ locale }: { locale: Locale }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [invalid, setInvalid] = useState(false);
  const [ready, setReady] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);
  const zh = locale === 'zh';

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (answers.length) feedback.current?.focus();
  }, [answers]);

  function track(action: string) {
    const properties = getGuideIntentProperties(NINE_CARD_GOLF_GUIDE.slug, action, locale);
    if (properties) trackInteraction('guide_intent_click', properties);
  }

  function submit(event: FormEvent<HTMLFormElement>, index: number) {
    event.preventDefault();
    if (index !== answers.length) return;
    const field = event.currentTarget.elements.namedItem('score') as HTMLInputElement;
    const value = field.valueAsNumber;
    if (!Number.isSafeInteger(value)) {
      setInvalid(true);
      field.focus();
      return;
    }

    setInvalid(false);
    setAnswers(previous => [...previous, value]);
    const outcome = value === scoreGolfHand(golfHands[index]).total ? 'correct' : 'incorrect';
    track(`score_${index === 0 ? 'first' : 'second'}_${outcome}`);
    if (index === golfHands.length - 1) track('practice_complete');
  }

  return (
    <section id="nine-card-golf-practice" className="mb-8 space-y-4 rounded-xl border p-4 sm:p-6" aria-labelledby="nine-card-golf-heading">
      <h2 id="nine-card-golf-heading" className="text-2xl font-semibold">
        {zh ? '先算总分，再看解析' : 'Score the hand before checking'}
      </h2>
      <p className="text-sm">
        {zh ? '牌阵已经翻开。先逐列计分，再把三列相加。核对第一手后就能独立算第二手。' : 'All cards are face up. Score each column and add the three scores. Check the first hand to unlock the second.'}
      </p>
      <p className="rounded-md bg-muted p-3 text-sm">
        {zh
          ? '同一竖列三张同点数记 0。其余逐张计分：A＝1，2＝−2，J/Q＝10，K＝0，3 至 10 按牌面。'
          : 'Three matching ranks in a column score 0. Otherwise, A = 1, 2 = −2, J/Q = 10, K = 0, and 3 through 10 count at face value.'}
      </p>
      {golfHands.slice(0, answers.length + 1).map((hand, index) => {
        const answer = answers[index];
        const submitted = answer !== undefined;
        const result = scoreGolfHand(hand);
        const labels = zh ? ['左列', '中列', '右列'] : ['Left', 'Middle', 'Right'];
        const invalidAnswer = !submitted && invalid;
        return (
          <form key={index} noValidate onSubmit={event => submit(event, index)} className="rounded-lg border p-3">
            <h3 className="font-semibold">{zh ? `第 ${index + 1} 手` : `Hand ${index + 1}`}</h3>
            <table className="my-2 border-separate border-spacing-1 text-center font-semibold">
              <caption className="sr-only">{zh ? '三行三列牌阵' : 'Three by three card layout'}</caption>
              <tbody>
                {[0, 3, 6].map(offset => (
                  <tr key={offset}>
                    {hand.slice(offset, offset + 3).map((rank, column) => (
                      <td className="h-10 w-11 rounded border" key={column}>{rank}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <label className="block text-sm font-medium" htmlFor={`nine-card-golf-score-${index}`}>
              {zh ? '你的总分' : 'Your total'}
            </label>
            <div className="my-2 flex flex-wrap gap-2">
              <input autoComplete="off" id={`nine-card-golf-score-${index}`} name="score" type="number" step="1"
                readOnly={submitted} aria-invalid={invalidAnswer} required
                aria-describedby={`nine-card-golf-feedback-${index}`}
                className="min-h-11 w-28 rounded-md border bg-background px-3" />
              <button type="submit" disabled={!ready || submitted} className="min-h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
                {zh ? '核对答案' : 'Check answer'}
              </button>
            </div>
            <div role="status" aria-atomic="true" id={`nine-card-golf-feedback-${index}`} tabIndex={submitted ? -1 : undefined}
              ref={submitted && index === answers.length - 1 ? feedback : undefined} className="space-y-1 text-sm">
              {invalidAnswer && (zh ? '请输入整数。' : 'Enter a whole number.')}
              {submitted && (
                <>
                  <p className="font-medium">
                    {zh
                      ? `${answer === result.total ? '正确。' : '再核对三列。'}合计：${result.total}`
                      : `${answer === result.total ? 'Correct.' : 'Check your columns.'} Total: ${result.total}`}
                  </p>
                  <ul className="space-y-1">
                    {golfColumns(hand).map((ranks, column) => {
                      const [top, middle, bottom] = ranks;
                      const matching = top === middle && middle === bottom;
                      return (
                        <li key={column} className={matching ? 'font-semibold' : undefined}>
                          {labels[column]}{zh ? '：' : ': '}
                          {matching
                            ? zh ? `${ranks.join('、')} 同点数，整列计 0` : `${ranks.join(', ')} match, so the column scores 0`
                            : `${ranks.map(rank => golfCardValues[rank]).join(' + ').replaceAll('+ -', '− ')} = ${result.columns[column]}`}
                        </li>
                      );
                    })}
                  </ul>
                  <p>
                    {index === 0
                      ? zh ? '左列两个 7 照常计分，中列三个 4 才抵消。' : 'The pair of 7s still counts. The three 4s cancel the middle column.'
                      : zh ? '三个 8 在同一横排，分别在各自竖列计分。' : 'The 8s are in a row. Each one still counts in its own column.'}
                  </p>
                </>
              )}
            </div>
          </form>
        );
      })}
    </section>
  );
}
