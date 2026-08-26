'use client';

import { CircleDot, Palette, Play, RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import {
  CONNECT_DOTS_COLOR_BOARD_COUNT,
  CONNECT_DOTS_NUMBER_BOARD_COUNT,
  createColorLinkBoard,
  createNumberTrailBoard,
  isColorLinkMatch,
  isNextNumberTrailPoint,
  type ConnectDotsMode,
  type ColorLinkPoint,
} from '@/lib/games/connect-the-dots';

interface ConnectTheDotsProps {
  locale: Locale;
}

const copy = {
  en: {
    eyebrow: 'Luma original dot puzzle',
    title: 'Connect the Dots',
    description: 'Choose a mode, make a clean sequence, and finish a small board without drag-only controls.',
    play: 'Start board',
    restart: 'Restart board',
    numberMode: 'Number Trail',
    colorMode: 'Color Link',
    numberRule: 'Tap numbers from 1 through 12 in order.',
    colorRule: 'Pair identical symbols and colors to clear the grid.',
    progress: 'Progress',
    board: 'Board',
    nextBoard: 'Next board',
    ready: 'Choose Start board when you are ready.',
    numberReady: 'Start with 1.',
    colorReady: 'Select one colored point.',
    numberWrong: 'That point is not next. Look for the next number in the sequence.',
    colorWrong: 'Those two points do not match. Keep the first point selected.',
    numberDone: 'Number Trail complete. Try the next local board.',
    colorDone: 'Color Link complete. Try the next local grid.',
    selected: 'Selected. Now choose its matching point.',
    original: 'Original local board',
    points: 'points',
    pairs: 'pairs left',
    ariaNumber: (value: number) => `Number ${value}`,
    ariaColor: (point: ColorLinkPoint) => `${point.color} ${point.symbol} point`,
  },
  zh: {
    eyebrow: 'Luma 原创连点益智',
    title: '连连点点',
    description: '选择一种模式，完成清楚的点击顺序；不要求只能拖拽的操作。',
    play: '开始棋盘',
    restart: '重开棋盘',
    numberMode: '数字路径',
    colorMode: '颜色连线',
    numberRule: '按 1 到 12 的顺序点击数字。',
    colorRule: '配对相同的图案和颜色，清空网格。',
    progress: '进度',
    board: '棋盘',
    nextBoard: '下一棋盘',
    ready: '准备好后点击开始棋盘。',
    numberReady: '从 1 开始。',
    colorReady: '先选择一个颜色点。',
    numberWrong: '这个点还不是下一个。找出顺序中的下一数字。',
    colorWrong: '这两个点不匹配。保留第一个点继续选择。',
    numberDone: '数字路径完成。试试下一张本地棋盘。',
    colorDone: '颜色连线完成。试试下一张本地网格。',
    selected: '已选择。现在选择匹配点。',
    original: '原创本地棋盘',
    points: '个点',
    pairs: '对剩余',
    ariaNumber: (value: number) => `数字 ${value}`,
    ariaColor: (point: ColorLinkPoint) => `${point.color} ${point.symbol} 颜色点`,
  },
} as const;

export function ConnectTheDots({ locale }: ConnectTheDotsProps) {
  const text = copy[locale];
  const [mode, setMode] = useState<ConnectDotsMode>('number-trail');
  const [boardIndex, setBoardIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [numberProgress, setNumberProgress] = useState(0);
  const [removedColorIds, setRemovedColorIds] = useState<string[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(text.ready);
  const [completedBoards, setCompletedBoards] = useState(0);

  const numberBoard = useMemo(() => createNumberTrailBoard(boardIndex), [boardIndex]);
  const colorBoard = useMemo(() => createColorLinkBoard(boardIndex), [boardIndex]);
  const remainingColors = colorBoard.points.filter((point) => !removedColorIds.includes(point.id));
  const currentProgress = mode === 'number-trail'
    ? `${numberProgress}/12 ${text.points}`
    : `${remainingColors.length / 2} ${text.pairs}`;

  const resetBoard = (nextMode = mode, nextBoardIndex = boardIndex, nextStarted = false) => {
    setMode(nextMode);
    setBoardIndex(nextBoardIndex);
    setStarted(nextStarted);
    setNumberProgress(0);
    setRemovedColorIds([]);
    setSelectedColorId(null);
    setStatus(nextStarted ? (nextMode === 'number-trail' ? text.numberReady : text.colorReady) : text.ready);
  };

  const start = () => {
    setStarted(true);
    setStatus(mode === 'number-trail' ? text.numberReady : text.colorReady);
    trackInteraction('connect_dots_started', {
      locale,
      mode,
      board_index: boardIndex + 1,
      source: 'connect_the_dots',
    });
  };

  const completeBoard = () => {
    setCompletedBoards((value) => value + 1);
    setStatus(mode === 'number-trail' ? text.numberDone : text.colorDone);
    trackInteraction('connect_dots_finished', {
      locale,
      mode,
      board_index: boardIndex + 1,
      source: 'connect_the_dots',
    });
  };

  const chooseNumber = (value: number) => {
    if (!started || mode !== 'number-trail') return;
    const isCorrect = isNextNumberTrailPoint(numberBoard, numberProgress, value);
    trackInteraction('connect_dots_move', {
      locale,
      mode,
      board_index: boardIndex + 1,
      value,
      correct: isCorrect,
      source: 'connect_the_dots',
    });
    if (!isCorrect) {
      setStatus(text.numberWrong);
      return;
    }
    const nextProgress = numberProgress + 1;
    setNumberProgress(nextProgress);
    if (nextProgress === 12) completeBoard();
    else setStatus(`${text.progress}: ${nextProgress}/12`);
  };

  const chooseColor = (point: ColorLinkPoint) => {
    if (!started || mode !== 'color-link' || removedColorIds.includes(point.id)) return;
    if (!selectedColorId) {
      setSelectedColorId(point.id);
      setStatus(text.selected);
      return;
    }

    const first = colorBoard.points.find((candidate) => candidate.id === selectedColorId);
    if (!first) {
      setSelectedColorId(point.id);
      return;
    }
    const matched = isColorLinkMatch(first, point);
    trackInteraction('connect_dots_move', {
      locale,
      mode,
      board_index: boardIndex + 1,
      color: point.color,
      correct: matched,
      source: 'connect_the_dots',
    });
    if (!matched) {
      setStatus(text.colorWrong);
      return;
    }
    const nextRemoved = [...removedColorIds, first.id, point.id];
    setRemovedColorIds(nextRemoved);
    setSelectedColorId(null);
    if (nextRemoved.length === colorBoard.points.length) completeBoard();
    else setStatus(`${text.progress}: ${(nextRemoved.length / 2).toFixed(0)}/10`);
  };

  const switchMode = (nextMode: ConnectDotsMode) => {
    if (nextMode === mode) return;
    resetBoard(nextMode, 0, false);
    trackInteraction('connect_dots_mode_switch', { locale, mode: nextMode, source: 'connect_the_dots' });
  };

  return (
    <section data-connect-the-dots aria-labelledby="connect-the-dots-game-title" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
      <header className="flex flex-col gap-5 border-b border-slate-800 p-5 sm:p-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300"><Sparkles aria-hidden="true" className="h-4 w-4" />{text.eyebrow}</p>
          <h2 id="connect-the-dots-game-title" className="mt-3 text-2xl font-black sm:text-3xl">{text.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{text.description}</p>
        </div>
        <button type="button" onClick={started ? () => resetBoard(mode, boardIndex, true) : start} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100">
          {started ? <RotateCcw aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
          {started ? text.restart : text.play}
        </button>
      </header>

      <div className="grid grid-cols-2 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900/80 sm:grid-cols-3">
        <div className="p-4 text-center"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.board}</p><p className="mt-1 text-2xl font-black tabular-nums text-cyan-300">{boardIndex + 1}</p></div>
        <div className="p-4 text-center"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.progress}</p><p className="mt-1 text-xl font-black tabular-nums text-cyan-300">{currentProgress}</p></div>
        <div className="col-span-2 p-4 text-center sm:col-span-1"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.original}</p><p className="mt-1 text-2xl font-black tabular-nums text-emerald-300">{completedBoards}</p></div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={locale === 'zh' ? '连点模式' : 'Dot puzzle modes'}>
          <button type="button" role="tab" aria-selected={mode === 'number-trail'} onClick={() => switchMode('number-trail')} className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${mode === 'number-trail' ? 'bg-cyan-300 text-slate-950' : 'border border-slate-700 text-slate-200 hover:border-cyan-300'}`}><CircleDot aria-hidden="true" className="h-4 w-4" />{text.numberMode}</button>
          <button type="button" role="tab" aria-selected={mode === 'color-link'} onClick={() => switchMode('color-link')} className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${mode === 'color-link' ? 'bg-cyan-300 text-slate-950' : 'border border-slate-700 text-slate-200 hover:border-cyan-300'}`}><Palette aria-hidden="true" className="h-4 w-4" />{text.colorMode}</button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-sm font-semibold text-slate-100">{mode === 'number-trail' ? text.numberRule : text.colorRule}</p>
          <p className="mt-2 min-h-6 text-sm text-cyan-200" role="status" aria-live="polite">{status}</p>
        </div>

        {mode === 'number-trail' ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4" data-number-trail-board>
            {numberBoard.points.map((value, index) => (
              <button key={`${numberBoard.id}-${value}`} type="button" onClick={() => chooseNumber(value)} aria-label={text.ariaNumber(value)} className={`flex aspect-square min-h-16 items-center justify-center rounded-xl border-2 text-2xl font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 ${value <= numberProgress ? 'border-emerald-400 bg-emerald-400/15 text-emerald-300' : 'border-slate-700 bg-slate-900 text-white hover:border-cyan-300'}`}>
                <span aria-hidden="true">{value}</span><span className="sr-only">{index + 1}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5" data-color-link-board>
            {remainingColors.map((point) => (
              <button key={point.id} type="button" onClick={() => chooseColor(point)} aria-pressed={selectedColorId === point.id} aria-label={text.ariaColor(point)} className={`flex aspect-square min-h-16 flex-col items-center justify-center gap-1 rounded-xl border-2 text-xl font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 ${selectedColorId === point.id ? 'border-white ring-2 ring-cyan-300' : 'border-slate-700'} ${point.color === 'coral' ? 'bg-rose-400/80 text-rose-950' : point.color === 'sky' ? 'bg-sky-300 text-sky-950' : point.color === 'violet' ? 'bg-violet-300 text-violet-950' : point.color === 'amber' ? 'bg-amber-300 text-amber-950' : point.color === 'teal' ? 'bg-teal-300 text-teal-950' : point.color === 'rose' ? 'bg-rose-300 text-rose-950' : point.color === 'indigo' ? 'bg-indigo-300 text-indigo-950' : point.color === 'lime' ? 'bg-lime-300 text-lime-950' : point.color === 'orange' ? 'bg-orange-300 text-orange-950' : 'bg-cyan-300 text-cyan-950'}`}>
                <span aria-hidden="true">{point.symbol}</span><span className="text-[0.58rem] font-bold uppercase">{point.color}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => resetBoard(mode, (boardIndex + 1) % (mode === 'number-trail' ? CONNECT_DOTS_NUMBER_BOARD_COUNT : CONNECT_DOTS_COLOR_BOARD_COUNT), true)} disabled={!started || (mode === 'number-trail' ? numberProgress < 12 : remainingColors.length > 0)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><RotateCcw aria-hidden="true" className="h-4 w-4" />{text.nextBoard}</button>
        </div>
      </div>
    </section>
  );
}
