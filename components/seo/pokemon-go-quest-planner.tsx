'use client';

import { type FormEvent, useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import {
  planPokemonGoQuest,
  POKEMON_GO_QUEST_START,
  POKEMON_GO_REQUIRED_DAYS,
} from '@/lib/duolingo-pokemon-go-guide-content';

const messages = {
  en: {
    title: 'Seven-day quest planner',
    description:
      'Use your local date. Count only completed days before that date.',
    date: 'Local date',
    days: 'Lesson days completed before that date',
    joined: 'I already joined the quest',
    check: 'Check my plan',
    invalid: 'Enter a date and a day count from 0 to 7.',
    'before-start': 'The event has not started on that date.',
    'join-first':
      'Join the quest in Duolingo by December 21 before counting lesson days.',
    'join-closed': 'The window to join the quest closed on December 21.',
    'claim-code':
      'You entered seven lesson days. Check Duolingo and claim your code by December 29.',
    'practice-closed':
      'Duolingo’s reward window has closed. If you already started Timed Research, finish and claim in Pokémon GO by December 31.',
    'event-ended': 'The 2026 Timed Research window has ended.',
    'on-track': (remaining: number, finish: string, spare: number) =>
      remaining +
      ' lesson days left. Earliest finish: ' +
      finish +
      '. Spare days: ' +
      spare +
      '.',
    'not-enough-days': (remaining: number, available: number) =>
      'Not enough days. You need ' +
      remaining +
      ' and have ' +
      available +
      ' before the December 29 deadline.',
  },
  zh: {
    title: '七天任务进度计算',
    description: '请选择当地日期，只计算在所选日期前已完成的学习日。',
    date: '当地日期',
    days: '该日期前已完成的学习日',
    joined: '我已经加入了任务',
    check: '计算剩余时间',
    invalid: '请输入有效日期及 0 至 7 的天数。',
    'before-start': '所选日期活动尚未开始。',
    'join-first': '先在 12 月 21 日前加入多邻国的任务，再开始计算学习日。',
    'join-closed': '报名已于 12 月 21 日截止。',
    'claim-code':
      '你填了七个已完成的学习日。请在 12 月 29 日前到多邻国确认进度并领取兑换码。',
    'practice-closed':
      '多邻国奖励已截止。若已经开启限时调查，请在 12 月 31 日前到 Pokémon GO 完成并领取奖励。',
    'event-ended': '2026 年的限时调查已结束。',
    'on-track': (remaining: number, finish: string, spare: number) =>
      '还差 ' +
      remaining +
      ' 个学习日，最早 ' +
      finish +
      ' 完成，还可空出 ' +
      spare +
      ' 天。',
    'not-enough-days': (remaining: number, available: number) =>
      '剩余天数不足。还需要 ' +
      remaining +
      ' 天，至 12 月 29 日截止一共剩 ' +
      available +
      ' 天。',
  },
};

function localDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function PokemonGoQuestPlanner({ locale }: { locale: Locale }) {
  const message = messages[locale];
  const [date, setDate] = useState<string | null>(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    setDate(localDateKey(new Date()));
  }, []);

  function checkPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const firstLocalDate = localDateKey(new Date(POKEMON_GO_QUEST_START));
    const plan = planPokemonGoQuest(
      date ?? '',
      Number(fields.get('days')),
      fields.has('joined'),
      firstLocalDate
    );
    if (plan.status === 'on-track') {
      setResult(message[plan.status](plan.remaining, plan.finish, plan.spare));
    } else if (plan.status === 'not-enough-days') {
      setResult(message[plan.status](plan.remaining, plan.available));
    } else {
      setResult(message[plan.status]);
    }
  }

  const inputStyle =
    'min-h-11 w-full min-w-0 rounded-md border border-border bg-background px-3 text-base';
  return (
    <section
      id="pokemon-go-quest-planner"
      aria-labelledby="pokemon-go-planner-title"
      className="mb-8 max-w-3xl rounded-md border border-border bg-card p-4 sm:p-5"
    >
      <h2
        id="pokemon-go-planner-title"
        className="text-xl font-black text-foreground"
      >
        {message.title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {message.description}
      </p>
      <form
        className="mt-4"
        onSubmit={checkPlan}
        onChange={() => setResult('')}
      >
        <fieldset className="min-w-0 space-y-4" disabled={date === null}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              {message.date}
              <input
                className={inputStyle}
                type="date"
                value={date ?? ''}
                onChange={event => setDate(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              {message.days}
              <input
                className={inputStyle}
                name="days"
                type="number"
                min={0}
                max={POKEMON_GO_REQUIRED_DAYS}
                defaultValue={0}
                required
              />
            </label>
          </div>
          <label className="inline-flex min-h-11 items-center gap-2 text-sm">
            <input
              name="joined"
              type="checkbox"
              className="h-4 w-4 accent-primary"
            />
            {message.joined}
          </label>
          <div>
            <button
              type="submit"
              className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {message.check}
            </button>
          </div>
          <p
            role="status"
            className="text-sm font-medium leading-6 text-foreground"
          >
            {result}
          </p>
        </fieldset>
      </form>
    </section>
  );
}
