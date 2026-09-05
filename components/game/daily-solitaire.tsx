'use client';

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Lightbulb,
  Play,
  RotateCcw,
  Undo2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';

import { decodeSolitaireProgress, getSolitaireStreak, isSolitaireDateKey, readSolitaireBest, recordSolitaireCompletion, SOLITAIRE_PROGRESS_KEY } from '@/lib/games/daily-solitaire-progress';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { useHydrated } from '@/lib/react/use-hydrated';
import {
  canMoveToFoundation,
  createDailySolitaireDeal,
  drawFromSolitaireStock,
  findDailySolitaireHint,
  getDailySolitaireDateKey,
  getSolitaireCardLabel,
  getSolitaireRankLabel,
  isDailySolitaireComplete,
  isRedSuit,
  moveTableauToFoundation,
  moveTableauToTableau,
  moveWasteToFoundation,
  moveWasteToTableau,
  SOLITAIRE_SUITS,
  type DailySolitaireGameState,
  type SolitaireCard,
  type SolitaireSuit,
} from '@/lib/games/daily-solitaire';

interface DailySolitaireProps {
  locale: Locale;
  initialDateKey: string;
}

type Selection =
  | { source: 'tableau'; pileIndex: number; cardIndex: number }
  | { source: 'waste' };

const SUIT_SYMBOLS: Record<SolitaireSuit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

const SUIT_NAMES = {
  en: {
    spades: 'Spades',
    hearts: 'Hearts',
    diamonds: 'Diamonds',
    clubs: 'Clubs',
  },
  zh: {
    spades: '黑桃',
    hearts: '红心',
    diamonds: '方块',
    clubs: '梅花',
  },
} as const;

const copy = {
  en: {
    eyebrow: 'Luma original daily deal',
    gameTitle: 'Daily Solitaire',
    gameDescription:
      'A solvable practice deal, with a different layout each day. Select a face-up card, then choose its foundation or a tableau column.',
    play: 'Play today’s deal',
    replay: 'Replay this deal',
    draw: 'Draw',
    drawMode: 'Draw mode',
    stock: 'Stock',
    waste: 'Waste',
    foundation: 'Foundation',
    empty: 'Empty',
    tableau: 'Tableau',
    undo: 'Undo',
    hint: 'Hint',
    reset: 'Restart',
    date: 'Challenge date',
    moves: 'Moves',
    time: 'Time',
    score: 'Score',
    streak: 'Daily streak',
    drawOne: 'Draw 1',
    drawThree: 'Draw 3',
    ready: 'Choose Play to begin this date’s deal.',
    selected: 'Choose a face-up card, then a foundation or another tableau column.',
    moved: 'Nice move. Keep an open lane for the next card.',
    invalid: 'That move is not available yet.',
    hintFoundation: (suit: SolitaireSuit) => `Try moving a card to the ${SUIT_NAMES.en[suit]} foundation.`,
    hintTableau: (from: number, to: number) => `Try moving a face-up run from column ${from + 1} to column ${to + 1}.`,
    hintWaste: (to: number) => `Try moving the waste card to column ${to + 1}.`,
    hintDraw: 'Try drawing the next card from the stock.',
    complete: 'Deal complete. Replay the same date to improve your score.',
    noHint: 'No obvious move is visible. Try the next stock card or undo one risky move.',
    saved: 'Local best',
    cardDown: 'Face-down card',
    column: (index: number) => `Tableau column ${index + 1}`,
    foundationButton: (suit: SolitaireSuit) => `${SUIT_NAMES.en[suit]} foundation`,
    wasteButton: (card: SolitaireCard) => `Select ${getSolitaireCardLabel(card)} from waste`,
  },
  zh: {
    eyebrow: 'Luma 原创每日牌局',
    gameTitle: '每日纸牌 Solitaire',
    gameDescription: '每天不同布局的可解练习牌局。先选择明牌，再选择花色基础堆或另一个 Tableau 列。',
    play: '开始今日牌局',
    replay: '重玩这一天',
    draw: '抽牌',
    drawMode: '抽牌模式',
    stock: '牌库',
    waste: '废牌',
    foundation: '基础堆',
    empty: '空',
    tableau: 'Tableau 牌列',
    undo: '撤销',
    hint: '提示',
    reset: '重开',
    date: '挑战日期',
    moves: '步数',
    time: '用时',
    score: '分数',
    streak: '每日连续',
    drawOne: '抽 1 张',
    drawThree: '抽 3 张',
    ready: '点击开始，打开这一天的牌局。',
    selected: '请选择明牌，再选择基础堆或另一个 Tableau 列。',
    moved: '移动成功。给下一张牌留出空间。',
    invalid: '这一步暂时不能移动。',
    hintFoundation: (suit: SolitaireSuit) => `可以尝试把牌放入${SUIT_NAMES.zh[suit]}基础堆。`,
    hintTableau: (from: number, to: number) => `可以尝试把第 ${from + 1} 列的明牌序列移到第 ${to + 1} 列。`,
    hintWaste: (to: number) => `可以尝试把废牌顶牌移到第 ${to + 1} 列。`,
    hintDraw: '可以从牌库抽取下一张牌。',
    complete: '牌局完成。重玩同一天可以继续刷新自己的分数。',
    noHint: '暂时没有明显下一步。试试抽下一张牌，或撤销刚才的移动。',
    saved: '本地最佳',
    cardDown: '背面朝上的牌',
    column: (index: number) => `Tableau 第 ${index + 1} 列`,
    foundationButton: (suit: SolitaireSuit) => `${SUIT_NAMES.zh[suit]}基础堆`,
    wasteButton: (card: SolitaireCard) => `从废牌选择${getSolitaireCardLabel(card)}`,
  },
} as const;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function cardTone(card: SolitaireCard) {
  return isRedSuit(card.suit) ? 'text-rose-600' : 'text-slate-900';
}

export function DailySolitaire({ locale, initialDateKey }: DailySolitaireProps) {
  const text = copy[locale];
  const interactiveReady = useHydrated();
  const [dateKey, setDateKey] = useState(initialDateKey);
  const [drawCount, setDrawCount] = useState<1 | 3>(1);
  const [game, setGame] = useState<DailySolitaireGameState>(() =>
    createDailySolitaireDeal(initialDateKey),
  );
  const [history, setHistory] = useState<DailySolitaireGameState[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<string>(text.ready);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const completionRecordedRef = useRef(false);
  const progressRef = useRef(decodeSolitaireProgress(null));
  const today = interactiveReady ? getDailySolitaireDateKey() : initialDateKey;

  const score = useMemo(
    () => Math.max(0, 1000 - game.moves * 5 - game.hints * 20 - elapsed),
    [elapsed, game.hints, game.moves],
  );

  useEffect(() => {
    // Keep the server snapshot for hydration, then show today's challenge.
    const currentDate = getDailySolitaireDateKey();
    if (currentDate !== initialDateKey) {
      setDateKey(currentDate);
      setGame(createDailySolitaireDeal(currentDate));
    }
  }, [initialDateKey]);

  useEffect(() => {
    const syncRecords = () => {
      try {
        setBestScore(readSolitaireBest(window.localStorage.getItem(`luma-daily-solitaire:${dateKey}`)));
        progressRef.current = decodeSolitaireProgress(window.localStorage.getItem(SOLITAIRE_PROGRESS_KEY));
      } catch {
        // Storage may be disabled. Keep in-memory progress and playable controls.
      }
      setStreak(getSolitaireStreak(progressRef.current, getDailySolitaireDateKey()));
    };
    syncRecords();
    window.addEventListener('storage', syncRecords);
    return () => window.removeEventListener('storage', syncRecords);
  }, [dateKey]);

  useEffect(() => {
    if (!started || game.completed) return;
    const timer = window.setInterval(() => {
      if (startedAtRef.current !== null) {
        setElapsed(Math.max(0, Math.floor((performance.now() - startedAtRef.current) / 1000)));
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [game.completed, started]);

  const resetDeal = (nextDateKey = dateKey, nextStarted = false) => {
    if (!isSolitaireDateKey(nextDateKey) || nextDateKey > getDailySolitaireDateKey()) return;
    completionRecordedRef.current = false;
    if (nextDateKey !== dateKey) setBestScore(0);
    setDateKey(nextDateKey);
    setGame(createDailySolitaireDeal(nextDateKey));
    setHistory([]);
    setSelection(null);
    setStarted(nextStarted);
    setElapsed(0);
    startedAtRef.current = nextStarted ? performance.now() : null;
    setStatus(nextStarted ? text.selected : text.ready);
  };

  const begin = () => {
    if (game.completed) {
      resetDeal(dateKey, true);
      trackInteraction('daily_solitaire_replay', { locale, date_key: dateKey, source: 'daily_solitaire' });
      return;
    }
    if (started) return;
    setStarted(true);
    startedAtRef.current = performance.now();
    setStatus(text.selected);
    trackInteraction('daily_solitaire_started', { locale, date_key: dateKey, draw_count: drawCount, source: 'daily_solitaire' });
  };

  const commit = (next: DailySolitaireGameState | null, action: string, properties: Record<string, string | number | boolean> = {}) => {
    if (!next) {
      setStatus(text.invalid);
      trackInteraction('daily_solitaire_invalid_move', { locale, date_key: dateKey, action, source: 'daily_solitaire' });
      return false;
    }

    setHistory((previous) => [...previous.slice(-49), game]);
    setGame(next);
    setSelection(null);
    const complete = isDailySolitaireComplete(next);
    setStatus(complete ? text.complete : text.moved);
    trackInteraction('daily_solitaire_move', {
      locale,
      date_key: dateKey,
      action,
      moves: next.moves,
      source: 'daily_solitaire',
      ...properties,
    });

    if (complete) {
      const finishedElapsed = startedAtRef.current === null ? elapsed :
        Math.max(0, Math.floor((performance.now() - startedAtRef.current) / 1000));
      setElapsed(finishedElapsed);
      startedAtRef.current = null;
      const nextScore = Math.max(0, 1000 - next.moves * 5 - next.hints * 20 - finishedElapsed);
      let persistedBest = 0;
      try {
        persistedBest = readSolitaireBest(window.localStorage.getItem(`luma-daily-solitaire:${dateKey}`));
        const otherTab = decodeSolitaireProgress(window.localStorage.getItem(SOLITAIRE_PROGRESS_KEY));
        progressRef.current = { version: 1, completedDates: [...new Set([
          ...progressRef.current.completedDates, ...otherTab.completedDates,
        ])] };
      } catch { /* Continue without persistent storage. */ }
      const nextBest = Math.max(bestScore, persistedBest, nextScore);
      progressRef.current = recordSolitaireCompletion(progressRef.current, dateKey, getDailySolitaireDateKey());
      setBestScore(nextBest);
      setStreak(getSolitaireStreak(progressRef.current, getDailySolitaireDateKey()));
      try {
        window.localStorage.setItem(`luma-daily-solitaire:${dateKey}`, JSON.stringify({ best: nextBest }));
        window.localStorage.setItem(SOLITAIRE_PROGRESS_KEY, JSON.stringify(progressRef.current));
      } catch { /* Completion is valid even when storage is disabled. */ }
      if (!completionRecordedRef.current) {
        completionRecordedRef.current = true;
        trackInteraction('daily_solitaire_finished', {
          locale, date_key: dateKey, moves: next.moves, score: nextScore,
          deal_id: next.dealId, rules_version: next.rulesVersion, source: 'daily_solitaire',
        });
      }
    }

    return true;
  };

  const handleDraw = () => {
    if (!started || game.completed) return;
    const next = drawFromSolitaireStock(game, drawCount);
    if (next === game) {
      setStatus(text.invalid);
      return;
    }
    setHistory((previous) => [...previous.slice(-49), game]);
    setGame(next);
    setSelection(null);
    setStatus(text.moved);
    trackInteraction('daily_solitaire_draw', { locale, date_key: dateKey, draw_count: drawCount, stock_remaining: next.stock.length, source: 'daily_solitaire' });
  };

  const handleFoundation = (suit: SolitaireSuit) => {
    if (!started || game.completed || !selection) return;
    if (selection.source === 'tableau' && selection.cardIndex !== game.tableau[selection.pileIndex].length - 1) {
      setStatus(text.invalid); return;
    }
    const next =
      selection.source === 'waste'
        ? moveWasteToFoundation(game, suit)
        : moveTableauToFoundation(game, selection.pileIndex, suit);
    commit(next, 'foundation', { suit });
  };

  const handleTableau = (to: number) => {
    if (!started || game.completed || !selection) return false;
    const next =
      selection.source === 'waste'
        ? moveWasteToTableau(game, to)
        : moveTableauToTableau(game, selection.pileIndex, selection.cardIndex, to);
    return commit(next, 'tableau', { to_column: to + 1 });
  };

  const handleCard = (pileIndex: number, cardIndex: number) => {
    if (!started || game.completed) return;
    const card = game.tableau[pileIndex]?.[cardIndex];
    if (!card?.faceUp) return;
    if (selection && (selection.source !== 'tableau' || selection.pileIndex !== pileIndex || selection.cardIndex !== cardIndex)) {
      if (handleTableau(pileIndex)) return;
    }
    setSelection({ source: 'tableau', pileIndex, cardIndex });
    setStatus(text.selected);
  };

  const handleDoubleClick = (event: MouseEvent, card: SolitaireCard, pileIndex: number, cardIndex: number) => {
    event.preventDefault();
    if (!started || game.completed || !card.faceUp || cardIndex !== game.tableau[pileIndex].length - 1) return;
    commit(moveTableauToFoundation(game, pileIndex, card.suit), 'double_click_foundation', { suit: card.suit });
  };

  const handleWaste = () => {
    if (!started || game.completed || game.waste.length === 0) return;
    if (selection?.source === 'waste') {
      setSelection(null);
      setStatus(text.ready);
      return;
    }
    setSelection({ source: 'waste' });
    setStatus(text.selected);
  };

  const handleUndo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    if (game.completed && !previous.completed) {
      startedAtRef.current = performance.now() - elapsed * 1000;
    }
    setGame(previous);
    setHistory((items) => items.slice(0, -1));
    setSelection(null);
    setStatus(text.moved);
    trackInteraction('daily_solitaire_undo', { locale, date_key: dateKey, source: 'daily_solitaire' });
  };

  const handleHint = () => {
    if (!started || game.completed) return;
    const hint = findDailySolitaireHint(game);
    if (!hint) {
      setStatus(text.noHint);
      return;
    }
    const next = { ...game, hints: game.hints + 1 };
    setGame(next);
    if (hint.type === 'tableau-to-foundation') setStatus(text.hintFoundation(hint.suit));
    if (hint.type === 'tableau-to-tableau') setStatus(text.hintTableau(hint.from, hint.to));
    if (hint.type === 'waste-to-tableau') setStatus(text.hintWaste(hint.to));
    if (hint.type === 'waste-to-foundation') setStatus(text.hintFoundation(hint.suit));
    if (hint.type === 'draw') setStatus(text.hintDraw);
    trackInteraction('daily_solitaire_hint', { locale, date_key: dateKey, hint_type: hint.type, source: 'daily_solitaire' });
  };

  const selectedId = selection?.source === 'tableau'
    ? game.tableau[selection.pileIndex]?.[selection.cardIndex]?.id
    : selection?.source === 'waste'
      ? game.waste.at(-1)?.id
      : null;

  return (
    <section
      data-daily-solitaire
      data-deal-id={game.dealId}
      data-completed={game.completed}
      data-interactive-ready={interactiveReady}
      aria-busy={!interactiveReady}
      inert={interactiveReady ? undefined : true}
      aria-labelledby="daily-solitaire-game-title"
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl"
    >
      <header className="flex flex-col gap-5 border-b border-slate-800 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">{text.eyebrow}</p>
          <h2 id="daily-solitaire-game-title" className="mt-3 text-2xl font-black sm:text-3xl">{text.gameTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{text.gameDescription}</p>
        </div>
        <button
          type="button"
          onClick={begin}
          disabled={!interactiveReady}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100"
        >
          {game.completed ? <RotateCcw aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
          {game.completed ? text.replay : text.play}
        </button>
      </header>

      <div className="grid grid-cols-2 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900/80 sm:grid-cols-4">
        {[
          [text.moves, game.moves],
          [text.time, formatTime(elapsed)],
          [text.score, score],
          [text.streak, streak],
        ].map(([label, value]) => (
          <div key={String(label)} className="p-3 text-center sm:p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-black tabular-nums text-emerald-300 sm:text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-200">
            <CalendarDays aria-hidden="true" className="h-4 w-4 text-emerald-300" />
            <span>{text.date}</span>
            <input
              type="date"
              value={dateKey}
              max={today}
              onChange={(event) => resetDeal(event.target.value)}
              className="min-h-11 rounded-md border border-slate-700 bg-slate-950 px-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              aria-label={text.date}
            />
          </label>
          <div className="flex flex-wrap items-center gap-2" aria-label={text.drawMode}>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{text.drawMode}</span>
            {([1, 3] as const).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => { setDrawCount(count); resetDeal(dateKey); }}
                aria-pressed={drawCount === count}
                className={`min-h-10 rounded-md px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${drawCount === count ? 'bg-emerald-300 text-slate-950' : 'border border-slate-700 text-slate-200 hover:border-emerald-300'}`}
              >
                {count === 1 ? text.drawOne : text.drawThree}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label={locale === 'zh' ? '牌局工具' : 'Deal tools'}>
          <button type="button" onClick={handleDraw} disabled={!started || game.completed} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            <ChevronRight aria-hidden="true" className="h-4 w-4" />{text.draw}
          </button>
          <button type="button" onClick={handleUndo} disabled={history.length === 0} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            <Undo2 aria-hidden="true" className="h-4 w-4" />{text.undo}
          </button>
          <button type="button" onClick={handleHint} disabled={!started || game.completed} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            <Lightbulb aria-hidden="true" className="h-4 w-4" />{text.hint}
          </button>
          <button type="button" onClick={() => resetDeal(dateKey, false)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />{text.reset}
          </button>
        </div>

        <p className="flex min-h-6 items-center gap-2 text-sm text-slate-300" role="status" aria-live="polite">
          <CircleHelp aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-300" />{status}
        </p>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{text.stock}</p>
              <button type="button" onClick={handleDraw} disabled={!started || game.completed} aria-label={`${text.draw} ${drawCount}`} className="flex aspect-[4/3] min-h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900 text-sm font-bold text-slate-400 transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
                {game.stock.length > 0 ? `${game.stock.length} · ${drawCount}` : text.empty}
              </button>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{text.waste}</p>
              {game.waste.at(-1) ? (
                <button type="button" onClick={handleWaste} aria-pressed={selectedId === game.waste.at(-1)?.id} aria-label={text.wasteButton(game.waste.at(-1) as SolitaireCard)} className={`flex aspect-[4/3] min-h-24 w-full flex-col items-center justify-center rounded-xl border-2 bg-white text-lg font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${cardTone(game.waste.at(-1) as SolitaireCard)} ${selectedId === game.waste.at(-1)?.id ? 'border-emerald-300 ring-2 ring-emerald-300' : 'border-slate-200'}`}>
                  <span>{getSolitaireRankLabel((game.waste.at(-1) as SolitaireCard).rank)}{SUIT_SYMBOLS[(game.waste.at(-1) as SolitaireCard).suit]}</span>
                  <span className="text-[0.65rem] font-semibold">{text.waste}</span>
                </button>
              ) : <div className="flex aspect-[4/3] min-h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-700 text-sm text-slate-500">{text.empty}</div>}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{text.foundation}</p>
            <div className="grid grid-cols-4 gap-2">
              {SOLITAIRE_SUITS.map((suit) => {
                const foundation = game.foundations[suit];
                const top = foundation.at(-1);
                const canReceive = selection
                  ? selection.source === 'waste'
                    ? Boolean(game.waste.at(-1) && game.waste.at(-1)?.suit === suit && canMoveToFoundation(game.waste.at(-1) as SolitaireCard, foundation))
                    : Boolean(selection.cardIndex === game.tableau[selection.pileIndex].length - 1 && game.tableau[selection.pileIndex]?.at(-1) && game.tableau[selection.pileIndex]?.at(-1)?.suit === suit && canMoveToFoundation(game.tableau[selection.pileIndex].at(-1) as SolitaireCard, foundation))
                  : false;
                return (
                  <button key={suit} type="button" onClick={() => handleFoundation(suit)} aria-label={text.foundationButton(suit)} className={`flex aspect-[4/3] min-h-24 flex-col items-center justify-center rounded-xl border-2 bg-slate-900 text-xl font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${canReceive ? 'border-emerald-300 text-emerald-300' : 'border-slate-700 text-slate-500'}`}>
                    {top ? <><span className={isRedSuit(suit) ? 'text-rose-400' : 'text-slate-100'}>{getSolitaireRankLabel(top.rank)}{SUIT_SYMBOLS[suit]}</span><span className="text-[0.62rem] font-semibold text-slate-400">{top.rank}/13</span></> : <><span>{SUIT_SYMBOLS[suit]}</span><span className="text-[0.62rem] font-semibold">{text.empty}</span></>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{text.tableau}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {game.tableau.map((pile, pileIndex) => (
              <div key={pileIndex} className="min-h-40 rounded-xl border border-slate-800 bg-slate-900/50 p-2" onClick={() => handleTableau(pileIndex)}>
                <p className="mb-2 text-center text-[0.62rem] font-semibold uppercase tracking-wide text-slate-500">{text.column(pileIndex)}</p>
                <div className="flex min-h-28 flex-col items-stretch gap-1">
                  {pile.map((card, cardIndex) => (
                    card.faceUp ? (
                      <button
                        key={card.id}
                        type="button"
                        onClick={(event) => { event.stopPropagation(); handleCard(pileIndex, cardIndex); }}
                        onDoubleClick={(event) => handleDoubleClick(event, card, pileIndex, cardIndex)}
                        aria-pressed={selectedId === card.id}
                        aria-label={getSolitaireCardLabel(card)}
                        className={`flex min-h-12 items-center justify-between rounded-md border-2 bg-white px-2 text-left text-sm font-black shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${cardTone(card)} ${selectedId === card.id ? 'border-emerald-400 ring-2 ring-emerald-300' : 'border-slate-200'}`}
                      >
                        <span>{getSolitaireRankLabel(card.rank)}{SUIT_SYMBOLS[card.suit]}</span>
                        <span className="text-xs font-semibold opacity-70">{cardIndex + 1}</span>
                      </button>
                    ) : (
                      <div key={card.id} aria-label={text.cardDown} className="flex min-h-12 items-center justify-center rounded-md border-2 border-slate-700 bg-slate-800 text-xs font-bold text-slate-500">•••</div>
                    )
                  ))}
                  {pile.length === 0 ? <button type="button" aria-label={text.column(pileIndex)} onClick={(event) => { event.stopPropagation(); handleTableau(pileIndex); }} className="flex min-h-12 items-center justify-center rounded-md border border-dashed border-slate-700 text-xs text-slate-400">{text.empty}</button> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 px-5 py-4 text-xs text-slate-400 sm:px-7">
        <span className="inline-flex items-center gap-1"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" />{text.time}: {formatTime(elapsed)}</span>
        <span>{text.saved}: {bestScore} · {text.streak}: {streak}</span>
        <span className="inline-flex items-center gap-1"><ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" /><ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />{text.drawMode}: {drawCount === 1 ? text.drawOne : text.drawThree}</span>
      </footer>
    </section>
  );
}
