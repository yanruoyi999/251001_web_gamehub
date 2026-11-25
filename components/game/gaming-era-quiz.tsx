'use client';

import { useEffect, useRef, useState } from 'react';
import { isLocale, type Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { gamingEraQuiz } from '@/lib/games/gaming-era-quiz';

const { questions, eras } = gamingEraQuiz;
const progressKey = 'luma.gaming-era-quiz.v1';
type Round = { picks: number[]; startLocale: Locale; replay: boolean };

function readProgress(): Round | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(progressKey) ?? 'null');
    if (
      !saved ||
      !isLocale(saved.startLocale) ||
      typeof saved.replay !== 'boolean' ||
      !Array.isArray(saved.picks) ||
      saved.picks.length > questions.length ||
      !saved.picks.every(
        (v: unknown) =>
          typeof v === 'number' &&
          Number.isInteger(v) &&
          v >= 0 &&
          v < eras.length
      )
    )
      return null;
    return saved;
  } catch {
    return null;
  }
}

export function GamingEraQuiz({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [round, setRound] = useState<Round | null>(null);
  const current = useRef<Round | null>(null);
  const [ready, setReady] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef(false);
  useEffect(() => {
    current.current = readProgress();
    setRound(current.current);
    setReady(true);
  }, []);
  useEffect(() => {
    if (focusNext.current) {
      heading.current?.focus();
      focusNext.current = false;
    }
  }, [round]);

  function save(next: Round) {
    current.current = next;
    try {
      sessionStorage.setItem(progressKey, JSON.stringify(next));
    } catch {
      /* The game also works without storage. */
    }
    focusNext.current = true;
    setRound(next);
  }

  function measure(
    event: 'game_era_quiz_started' | 'game_era_quiz_completed',
    active: Round
  ) {
    trackInteraction(
      event,
      {
        locale: active.startLocale,
        round_type: active.replay ? 'replay' : 'first',
      },
      { waitForInitialization: true }
    );
  }

  function start() {
    const previous = current.current;
    if (!ready || (previous && previous.picks.length < questions.length))
      return;
    const next = { picks: [], startLocale: locale, replay: previous !== null };
    save(next);
    measure('game_era_quiz_started', next);
  }

  function answer(index: number) {
    const active = current.current;
    if (!active || active !== round || active.picks.length >= questions.length)
      return;
    const next = { ...active, picks: [...active.picks, index] };
    save(next);
    if (next.picks.length === questions.length)
      measure('game_era_quiz_completed', next);
  }

  const primary =
    'min-h-12 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground';
  if (!round)
    return (
      <button
        type="button"
        disabled={!ready}
        onClick={start}
        className={'mt-8 ' + primary}
      >
        {zh ? '开始试玩' : 'Start quiz'}
      </button>
    );
  const position = round.picks.length;
  if (position < questions.length) {
    const question = questions[position];
    return (
      <section className="mt-8">
        <p className="text-sm font-semibold text-muted-foreground">
          {zh ? '第 ' : 'Question '}
          {position + 1} / {questions.length}
        </p>
        <h2 ref={heading} tabIndex={-1} className="mt-2 text-2xl font-bold">
          {question.prompt[locale]}
        </h2>
        <div key={position} className="mt-5 grid gap-3">
          {eras.map((_, offset) => {
            const index = (offset + position) % eras.length;
            return (
              <button
                key={index}
                type="button"
                onClick={e => {
                  if (e.detail <= 1) answer(index);
                }}
                className="min-h-12 rounded-xl border border-border bg-card px-4 py-3 text-start font-medium hover:bg-secondary"
              >
                {question.choices[index][locale]}
              </button>
            );
          })}
        </div>
      </section>
    );
  }
  const scores = eras.map((_, i) => round.picks.filter(p => p === i).length);
  const winners = eras.filter((_, i) => scores[i] === Math.max(...scores));
  return (
    <section className="mt-8">
      <p className="text-sm font-semibold text-muted-foreground">
        {zh ? '你的游戏年代倾向' : 'Your gaming fingerprint'}
      </p>
      <h2 ref={heading} tabIndex={-1} className="mt-2 text-2xl font-bold">
        {winners.map(w => w.name[locale]).join(' + ')}
      </h2>
      <p className="mt-3">
        {winners.length === 1
          ? winners[0].description[locale]
          : zh
            ? '两种风格得票相同，两者都算你的游戏记忆。'
            : 'Two styles tied. Both are part of your gaming fingerprint.'}
      </p>
      <ul className="my-5 space-y-1">
        {eras.map((era, i) => (
          <li key={era.name.en}>
            {era.name[locale]} · {scores[i]}/{questions.length}
          </li>
        ))}
      </ul>
      <button type="button" className={primary} onClick={start}>
        {zh ? '再玩一局' : 'Play again'}
      </button>
    </section>
  );
}
