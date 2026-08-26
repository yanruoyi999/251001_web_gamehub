'use client';

import { Check, Layers3, Play, RotateCcw, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import {
  evaluateSortingAnswer,
  getSortingChallenge,
  SORTING_MODES,
  type SortingMode,
} from '@/lib/games/sorting-lab';

interface SortingLabProps {
  locale: Locale;
}

const copy = {
  en: {
    eyebrow: 'Luma original collection',
    title: 'Sorting Lab',
    description: 'Four rules, three levels each. Read the prompt and choose the matching category.',
    start: 'Start mode',
    restart: 'Restart mode',
    color: 'Color Sort',
    shape: 'Shape Sort',
    size: 'Size Sort',
    pattern: 'Pattern Sort',
    level: 'Level',
    prompt: 'Sort this option',
    ready: 'Choose Start mode to begin.',
    correct: 'Correct. The next level is ready.',
    incorrect: 'Not this one. Read the rule and try again.',
    complete: 'Mode complete. Choose another mode or replay this one.',
    completed: 'modes complete',
    correctAnswer: 'Correct answer',
    original: 'Original local challenge',
  },
  zh: {
    eyebrow: 'Luma 原创合集',
    title: 'Sorting Lab 排序实验室',
    description: '四种规则、每种三关。读懂题目后，选择对应的分类。',
    start: '开始模式',
    restart: '重开模式',
    color: '颜色排序',
    shape: '形状排序',
    size: '大小排序',
    pattern: '图案排序',
    level: '关卡',
    prompt: '选择符合规则的选项',
    ready: '准备好后点击开始模式。',
    correct: '回答正确。下一关已准备好。',
    incorrect: '还不是这个。读一下规则再试一次。',
    complete: '模式完成。可以选择另一种模式，或重玩当前模式。',
    completed: '种模式完成',
    correctAnswer: '正确答案',
    original: '原创本地挑战',
  },
} as const;

export function SortingLab({ locale }: SortingLabProps) {
  const text = copy[locale];
  const [mode, setMode] = useState<SortingMode>('color');
  const [level, setLevel] = useState(1);
  const [started, setStarted] = useState(false);
  const [completedModes, setCompletedModes] = useState<SortingMode[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [status, setStatus] = useState<string>(text.ready);
  const challenge = useMemo(() => getSortingChallenge(mode, level), [level, mode]);
  const modeLabel = text[mode];

  const startMode = () => {
    setLevel(1);
    setStarted(true);
    setFeedback(null);
    setStatus(text.ready);
    trackInteraction('sorting_lab_started', { locale, mode, source: 'sorting_games' });
  };

  const chooseMode = (nextMode: SortingMode) => {
    setMode(nextMode);
    setLevel(1);
    setStarted(false);
    setFeedback(null);
    setStatus(text.ready);
    trackInteraction('sorting_lab_mode_switch', { locale, mode: nextMode, source: 'sorting_games' });
  };

  const answer = (optionId: string) => {
    if (!started) return;
    const correct = evaluateSortingAnswer(challenge, optionId);
    setFeedback(correct ? 'correct' : 'incorrect');
    trackInteraction('sorting_lab_answer', {
      locale,
      mode,
      level,
      option_id: optionId,
      correct,
      source: 'sorting_games',
    });
    if (!correct) {
      setStatus(`${text.incorrect} ${challenge.explanation}`);
      return;
    }
    if (level === 3) {
      setCompletedModes((previous) => previous.includes(mode) ? previous : [...previous, mode]);
      setStatus(text.complete);
      trackInteraction('sorting_lab_finished', { locale, mode, levels: 3, source: 'sorting_games' });
      return;
    }
    setLevel((previous) => previous + 1);
    setStatus(text.correct);
  };

  return (
    <section data-sorting-lab aria-labelledby="sorting-lab-title" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
      <header className="flex flex-col gap-5 border-b border-slate-800 p-5 sm:p-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-300"><Sparkles aria-hidden="true" className="h-4 w-4" />{text.eyebrow}</p>
          <h2 id="sorting-lab-title" className="mt-3 text-2xl font-black sm:text-3xl">{text.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{text.description}</p>
        </div>
        <button type="button" onClick={startMode} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100">
          {started ? <RotateCcw aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
          {started ? text.restart : text.start}
        </button>
      </header>

      <div className="grid grid-cols-2 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900/80 sm:grid-cols-3">
        <div className="p-4 text-center"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.level}</p><p className="mt-1 text-2xl font-black tabular-nums text-amber-300">{level}/3</p></div>
        <div className="p-4 text-center"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.completed}</p><p className="mt-1 text-2xl font-black tabular-nums text-emerald-300">{completedModes.length}/4</p></div>
        <div className="col-span-2 p-4 text-center sm:col-span-1"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.original}</p><p className="mt-1 text-2xl font-black text-cyan-300">{modeLabel}</p></div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label={locale === 'zh' ? '排序模式' : 'Sorting modes'}>
          {SORTING_MODES.map((candidate) => (
            <button key={candidate} type="button" role="tab" aria-selected={mode === candidate} onClick={() => chooseMode(candidate)} className={`min-h-11 rounded-lg px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${mode === candidate ? 'bg-amber-300 text-slate-950' : 'border border-slate-700 text-slate-200 hover:border-amber-300'}`}>
              {text[candidate]}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-100"><Layers3 aria-hidden="true" className="h-4 w-4 text-amber-300" />{text.level} {level}</p>
            <p className="min-h-6 text-sm text-amber-200" role="status" aria-live="polite">{status}</p>
          </div>
          <h3 className="mt-5 text-xl font-bold text-white">{started ? challenge.prompt : text.ready}</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {challenge.options.map((option) => (
              <button key={option.id} type="button" onClick={() => answer(option.id)} disabled={!started} aria-label={option.label} className="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border-2 border-slate-700 bg-slate-950 px-4 py-4 text-sm font-bold text-slate-100 transition hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300">
                {mode === 'shape' ? <span className="text-4xl text-cyan-300" aria-hidden="true">{option.token}</span> : mode === 'size' ? <span className={`block h-10 rounded-lg bg-cyan-300 ${option.token}`} aria-hidden="true" /> : mode === 'pattern' ? <span className={`flex h-10 w-24 items-center justify-center rounded-lg border-2 border-cyan-300 bg-slate-800 text-lg text-cyan-200 ${option.id === 'stripe' ? 'bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,rgba(103,232,249,.5)_6px,rgba(103,232,249,.5)_10px)]' : option.id === 'dots' ? 'bg-[radial-gradient(circle,rgba(103,232,249,.8)_1px,transparent_2px)] [background-size:8px_8px]' : ''}`} aria-hidden="true">{option.token}</span> : <span className={`h-12 w-12 rounded-full ${option.token}`} aria-hidden="true" />}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          {feedback ? <p className={`mt-4 flex items-center gap-2 text-sm ${feedback === 'correct' ? 'text-emerald-300' : 'text-amber-200'}`} role="status">{feedback === 'correct' ? <Check aria-hidden="true" className="h-4 w-4" /> : <X aria-hidden="true" className="h-4 w-4" />}{feedback === 'correct' ? text.correct : text.incorrect}</p> : null}
        </div>
      </div>
    </section>
  );
}
