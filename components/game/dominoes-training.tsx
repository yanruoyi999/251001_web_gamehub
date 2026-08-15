'use client';

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Play,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import {
  DOMINO_TRAINING_SCENARIOS,
  getDominoEnds,
  submitDominoMove,
  type DominoSide,
  type DominoTile,
  type DominoesTrainingState,
} from '@/lib/games/dominoes-training';

interface DominoesTrainingProps {
  locale: Locale;
}
const copy = {
  en: {
    eyebrow: 'Luma rules trainer',
    title: 'Learn the domino chain one decision at a time',
    description:
      'Work through eight fixed positions. Pick a tile, choose an open end, and use the feedback to build a reliable first read of the board.',
    start: 'Start the trainer',
    restart: 'Start again',
    progress: 'Position',
    board: 'Board',
    hand: 'Your hand',
    chooseTile: 'Choose a tile from your hand',
    chooseSide: 'Place it on an open end',
    left: 'Place left',
    right: 'Place right',
    hint: 'Show hint',
    hideHint: 'Hide hint',
    ready: 'The board is ready when you are.',
    completed: 'Trainer complete. You read all eight positions.',
    attempts: 'Attempts',
    correct: 'Correct',
    sourceNote:
      'This is an original practice tool. Table rules vary by dominoes game, especially when no tile fits.',
    tile: (tile: DominoTile) => `${tile.left} to ${tile.right}`,
    end: (side: DominoSide, value: number | null) =>
      `${side === 'left' ? 'Left' : 'Right'} open end: ${value ?? 'empty'}`,
  },
  zh: {
    eyebrow: 'Luma 规则训练器',
    title: '用一个个决定学会 Dominoes 接牌',
    description:
      '完成 8 个固定局面：先选一张牌，再选择连接左端或右端，用反馈建立稳定的读盘顺序。',
    start: '开始训练',
    restart: '重新开始',
    progress: '局面',
    board: '牌面',
    hand: '你的手牌',
    chooseTile: '先从手牌选择一张',
    chooseSide: '再选择一个开放端',
    left: '接到左端',
    right: '接到右端',
    hint: '显示提示',
    hideHint: '隐藏提示',
    ready: '牌面已准备好，按自己的节奏开始。',
    completed: '训练完成，你已经读完 8 个局面。',
    attempts: '尝试次数',
    correct: '已完成',
    sourceNote: '这是 Luma 原创练习工具。不同 Dominoes 玩法在无牌可接时可能有不同规则。',
    tile: (tile: DominoTile) => `${tile.left} 到 ${tile.right}`,
    end: (side: DominoSide, value: number | null) =>
      `${side === 'left' ? '左' : '右'}开放端：${value ?? '空'}`,
  },
} as const;

function makeInitialState(): DominoesTrainingState {
  const scenario = DOMINO_TRAINING_SCENARIOS[0];
  return {
    scenarioIndex: 0,
    board: scenario.board,
    hand: scenario.hand,
    attempts: 0,
    completed: false,
  };
}

function DominoTileView({ tile, muted = false }: { tile: DominoTile; muted?: boolean }) {
  return (
    <span
      className={`inline-grid w-16 shrink-0 grid-cols-2 overflow-hidden rounded-md border text-center text-sm font-bold shadow-sm sm:w-20 ${
        muted
          ? 'border-slate-600 bg-slate-800 text-slate-300'
          : 'border-emerald-700 bg-white text-slate-950'
      }`}
      aria-label={`${tile.left}-${tile.right}`}
    >
      <span className="border-r border-current/20 px-2 py-3">{tile.left}</span>
      <span className="px-2 py-3">{tile.right}</span>
    </span>
  );
}

export function DominoesTraining({ locale }: DominoesTrainingProps) {
  const text = copy[locale];
  const [state, setState] = useState<DominoesTrainingState>(makeInitialState);
  const [started, setStarted] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ legal: boolean; reason: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const engagedTrackedRef = useRef(false);

  const scenario = DOMINO_TRAINING_SCENARIOS[state.scenarioIndex];
  const ends = useMemo(() => getDominoEnds(state.board), [state.board]);
  const selectedTile = state.hand.find((tile) => tile.id === selectedTileId) ?? null;

  useEffect(() => {
    if (!started || !startedAtRef.current || engagedTrackedRef.current) return;

    const timer = window.setInterval(() => {
      if (
        document.visibilityState === 'visible' &&
        startedAtRef.current &&
        Date.now() - startedAtRef.current >= 180_000
      ) {
        engagedTrackedRef.current = true;
        trackInteraction('domino_tutorial_engaged_180s', {
          locale,
          scenario_index: state.scenarioIndex,
          source: 'dominoes_rules_guide',
        });
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [locale, started, state.scenarioIndex]);

  function startTrainer() {
    const initialState = makeInitialState();
    setState(initialState);
    setSelectedTileId(null);
    setFeedback(null);
    setShowHint(false);
    setStarted(true);
    startedAtRef.current = Date.now();
    engagedTrackedRef.current = false;
    trackInteraction('domino_tutorial_start', {
      locale,
      scenario_count: DOMINO_TRAINING_SCENARIOS.length,
      source: 'dominoes_rules_guide',
    });
  }

  function placeTile(side: DominoSide) {
    if (!started || state.completed || !selectedTileId) return;

    const result = submitDominoMove(state, selectedTileId, side);
    setFeedback({ legal: result.move.legal, reason: result.move.reason });
    trackInteraction('domino_move_attempt', {
      locale,
      scenario_id: scenario.id,
      scenario_index: state.scenarioIndex,
      tile_id: selectedTileId,
      side,
      legal: result.move.legal,
      attempt_number: result.state.attempts,
      source: 'dominoes_rules_guide',
    });

    if (result.move.legal) {
      setState(result.state);
      setSelectedTileId(null);
      setShowHint(false);
      if (result.state.completed) {
        trackInteraction('domino_tutorial_complete', {
          locale,
          attempts: result.state.attempts,
          scenario_count: DOMINO_TRAINING_SCENARIOS.length,
          source: 'dominoes_rules_guide',
        });
      }
    }
  }

  const status = state.completed
    ? text.completed
    : feedback?.reason ?? (started ? text.chooseTile : text.ready);

  return (
    <section
      aria-labelledby="dominoes-training-title"
      className="mx-auto mb-12 max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl"
      data-dominoes-training
    >
      <div className="flex flex-col gap-5 border-b border-slate-800 p-5 sm:p-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
            {text.eyebrow}
          </p>
          <h2 id="dominoes-training-title" className="mt-3 text-2xl font-black sm:text-3xl">
            {text.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{text.description}</p>
        </div>
        <button
          type="button"
          onClick={startTrainer}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100"
        >
          {started ? <RotateCcw aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
          {started ? text.restart : text.start}
        </button>
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900/80 sm:grid-cols-3">
        <div className="p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.progress}</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-emerald-300">
            {state.completed ? DOMINO_TRAINING_SCENARIOS.length : state.scenarioIndex + 1}/{DOMINO_TRAINING_SCENARIOS.length}
          </p>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.attempts}</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-cyan-300">{state.attempts}</p>
        </div>
        <div className="col-span-2 p-4 text-center sm:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.correct}</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-amber-300">
            {state.completed ? DOMINO_TRAINING_SCENARIOS.length : state.scenarioIndex}
          </p>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">{scenario.title}</p>
            <p className="mt-1 text-sm text-slate-300" role="status" aria-live="polite">
              {status}
            </p>
          </div>
          {feedback ? (
            feedback.legal ? (
              <CheckCircle2 aria-label="Correct move" className="h-6 w-6 text-emerald-300" />
            ) : (
              <TriangleAlert aria-label="Try another move" className="h-6 w-6 text-amber-300" />
            )
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-200">{text.board}</h3>
            <div className="flex gap-2 text-xs text-slate-400">
              <span>{text.end('left', ends.left)}</span>
              <span>{text.end('right', ends.right)}</span>
            </div>
          </div>
          <div className="flex min-h-24 items-center gap-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4">
            {state.board.map((tile, index) => (
              <DominoTileView key={`${tile.id}-${index}`} tile={tile} muted />
            ))}
          </div>
        </div>

        {started && !state.completed ? (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200">{text.hand}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {state.hand.map((tile) => {
                  const selected = selectedTileId === tile.id;
                  return (
                    <button
                      key={tile.id}
                      type="button"
                      aria-label={text.tile(tile)}
                      aria-pressed={selected}
                      onClick={() => {
                        setSelectedTileId(tile.id);
                        setFeedback(null);
                      }}
                      className={`flex min-h-16 items-center justify-center rounded-lg border p-2 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 ${
                        selected
                          ? 'border-emerald-300 bg-emerald-300 text-slate-950'
                          : 'border-slate-700 bg-slate-900 hover:border-emerald-400'
                      }`}
                    >
                      <DominoTileView tile={tile} muted={!selected} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => placeTile('left')}
                disabled={!selectedTile}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-cyan-400/70 bg-cyan-400/10 px-4 py-3 font-bold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                {text.left}
              </button>
              <button
                type="button"
                onClick={() => placeTile('right')}
                disabled={!selectedTile}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-cyan-400/70 bg-cyan-400/10 px-4 py-3 font-bold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100"
              >
                {text.right}
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
              <button
                type="button"
                onClick={() => setShowHint((visible) => !visible)}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                <Lightbulb aria-hidden="true" className="h-4 w-4" />
                {showHint ? text.hideHint : text.hint}
              </button>
              {showHint ? <p className="mt-2 text-sm leading-6 text-slate-300">{scenario.hint}</p> : null}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
            {state.completed ? text.completed : text.ready}
          </div>
        )}

        {feedback?.legal && state.scenarioIndex > 0 && !state.completed ? (
          <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
            {DOMINO_TRAINING_SCENARIOS[state.scenarioIndex - 1].explanation}
          </p>
        ) : null}

        <p className="text-xs leading-5 text-slate-400">{text.sourceNote}</p>
      </div>
    </section>
  );
}
