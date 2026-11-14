'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { makeShapeRound, shapeChoices, shapeRegions, type CountryShape, type ShapeRegion } from '@/lib/games/country-shape-quiz';

const copy = {
  en: {
    label: 'Country outline game', region: 'Region', regions: ['World', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania'],
    prompt: 'Which country is this?', outline: 'Mystery country outline', question: 'Question', score: 'Score',
    correct: 'Correct', answer: 'Answer', next: 'Next outline', finish: 'See score', done: 'Round complete',
    replay: 'New round', missed: 'Practice missed outlines', reviewScore: 'Review score',
  },
  zh: {
    label: '看轮廓猜国家游戏', region: '地区', regions: ['全球', '亚洲', '欧洲', '非洲', '美洲', '大洋洲'],
    prompt: '这是哪个国家？', outline: '待猜国家轮廓', question: '题目', score: '得分',
    correct: '答对了', answer: '答案', next: '下一题', finish: '查看得分', done: '本轮结束',
    replay: '再玩一轮', missed: '重练错题', reviewScore: '错题练习得分',
  },
} as const;

export function CountryShapeQuiz({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const [region, setRegion] = useState<ShapeRegion>('all');
  const [round, setRound] = useState(() => makeShapeRound('all', 0));
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState<CountryShape>();
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<CountryShape[]>([]);
  const [review, setReview] = useState(false);
  const [finished, setFinished] = useState(false);
  const replayOffset = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const shape = round[question];

  function reset(nextRound: CountryShape[], isReview = false) {
    setRound(nextRound);
    setQuestion(0);
    setSelected(undefined);
    setScore(0);
    setMissed([]);
    setReview(isReview);
    setFinished(false);
  }

  function playAgain() {
    replayOffset.current += 1;
    reset(makeShapeRound(region, replayOffset.current));
    trackInteraction('country_shape_replayed', { locale });
    heading.current?.focus();
  }

  function answer(choice: CountryShape) {
    if (selected || finished) return;
    if (question === 0) trackInteraction('country_shape_started', { locale, review });
    setSelected(choice);
    if (choice.id === shape.id) setScore(score + 1);
    else setMissed([...missed, shape]);
  }

  function advance() {
    if (!selected || finished) return;
    if (question + 1 === round.length) {
      setFinished(true);
      trackInteraction('country_shape_completed', { locale, review });
    } else {
      setQuestion(question + 1);
      setSelected(undefined);
    }
    heading.current?.focus();
  }

  return (
    <section aria-label={text.label} className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
      <label className="flex flex-wrap items-center gap-2 text-sm font-medium">
        {text.region}
        <select value={region} onChange={event => {
          const nextRegion = event.target.value as ShapeRegion;
          setRegion(nextRegion);
          replayOffset.current = 0;
          reset(makeShapeRound(nextRegion, 0));
        }} className="rounded-md border border-border bg-background px-3 py-2 text-foreground">
          {shapeRegions.map((value, index) => <option key={value} value={value}>{text.regions[index]}</option>)}
        </select>
      </label>
      <h2 tabIndex={-1} ref={heading} aria-describedby="shape-quiz-progress" className="text-lg font-semibold">{finished ? text.done : text.prompt}</h2>
      {finished ? (
        <>
          <p id="shape-quiz-progress" role="status" className="text-lg">{review ? text.reviewScore : text.score} {score}/{round.length}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={playAgain}>{text.replay}</Button>
            {missed.length > 0 && <Button type="button" variant="outline" onClick={() => {
              reset(missed, true);
              trackInteraction('country_shape_review_started', { locale });
              heading.current?.focus();
            }}>{text.missed}</Button>}
          </div>
        </>
      ) : (
        <>
          <p id="shape-quiz-progress" aria-live="polite" className="text-sm text-muted-foreground">{text.question} {question + 1}/{round.length} · {text.score} {score}</p>
          <div className="rounded-lg bg-cyan-50">
            <Image src={`/images/country-shapes/${shape.id}.png`} alt={text.outline} width={360} height={240}
              className="mx-auto h-auto max-w-full" unoptimized />
          </div>
          <div aria-label={text.prompt} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {shapeChoices(shape).map(choice => (
              <Button type="button" key={choice.id} variant={selected && choice.id === shape.id ? 'default' : 'outline'}
                className="h-auto min-h-11 whitespace-normal" aria-disabled={Boolean(selected)} onClick={() => answer(choice)}>{choice[locale]}</Button>
            ))}
          </div>
          <p role="status" className="min-h-6 text-sm">
            {selected && <>{selected.id === shape.id ? text.correct : text.answer} · <strong>{shape[locale]}</strong> · {shape.tip[locale]}</>}
          </p>
          <Button type="button" disabled={!selected} onClick={advance}>{question + 1 === round.length ? text.finish : text.next}</Button>
        </>
      )}
    </section>
  );
}
