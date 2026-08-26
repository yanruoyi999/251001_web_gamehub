'use client';

import { Clock3, Lightbulb, Play, RotateCcw, Shuffle, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import {
  canConnectMahjongTiles,
  createMahjongBoard,
  findMahjongHint,
  getRemainingMahjongCount,
  isMahjongBoardComplete,
  MAHJONG_CONNECT_LEVEL_COUNT,
  removeMahjongPair,
  shuffleMahjongBoard,
  type MahjongBoard,
  type MahjongTile,
} from '@/lib/games/mahjong-connect';

interface MahjongConnectProps {
  locale: Locale;
}

const copy = {
  en: {
    eyebrow: 'Luma original link puzzle',
    title: 'Mahjong Connect',
    description: 'Match identical tiles when the empty route uses no more than two turns.',
    play: 'Start level 1',
    restart: 'Restart level',
    next: 'Next level',
    hint: 'Hint',
    shuffle: 'Shuffle',
    level: 'Level',
    remaining: 'Remaining',
    score: 'Score',
    time: 'Time',
    ready: 'Choose a tile, then choose its matching tile.',
    selected: 'Tile selected. Find the same symbol.',
    matched: 'Pair cleared. Keep looking for an open path.',
    blocked: 'That pair needs a path with two turns or fewer.',
    mismatch: 'Those symbols do not match.',
    complete: 'Board complete. Continue to the next seeded level.',
    hintStatus: (first: string, second: string) => `Hint: ${first} connects to ${second}.`,
    local: 'Progress stays in this browser',
    ariaTile: (tile: MahjongTile) => `${tile.kind} tile`,
  },
  zh: {
    eyebrow: 'Luma 原创路径益智',
    title: 'Mahjong Connect 连连麻将',
    description: '当相同牌面之间的空路径最多转两次时即可配对。',
    play: '开始第 1 关',
    restart: '重开本关',
    next: '下一关',
    hint: '提示',
    shuffle: '洗牌',
    level: '关卡',
    remaining: '剩余',
    score: '分数',
    time: '用时',
    ready: '先选择一张牌，再选择相同牌面。',
    selected: '已选中牌面，请寻找相同图案。',
    matched: '配对成功。继续寻找有空路径的牌。',
    blocked: '这组牌需要不超过两次转弯的空路径。',
    mismatch: '这两个牌面不匹配。',
    complete: '棋盘完成。继续挑战下一张固定种子关卡。',
    hintStatus: (first: string, second: string) => `提示：${first} 可以连接 ${second}。`,
    local: '进度只保存在当前浏览器',
    ariaTile: (tile: MahjongTile) => `${tile.kind} 牌面`,
  },
} as const;

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function tileColor(tile: MahjongTile) {
  const colors: Record<string, string> = {
    emerald: 'border-emerald-300 bg-emerald-300/15 text-emerald-200',
    sky: 'border-sky-300 bg-sky-300/15 text-sky-200',
    amber: 'border-amber-300 bg-amber-300/15 text-amber-200',
    cyan: 'border-cyan-300 bg-cyan-300/15 text-cyan-200',
    rose: 'border-rose-300 bg-rose-300/15 text-rose-200',
    violet: 'border-violet-300 bg-violet-300/15 text-violet-200',
    orange: 'border-orange-300 bg-orange-300/15 text-orange-200',
    lime: 'border-lime-300 bg-lime-300/15 text-lime-200',
    indigo: 'border-indigo-300 bg-indigo-300/15 text-indigo-200',
    teal: 'border-teal-300 bg-teal-300/15 text-teal-200',
    fuchsia: 'border-fuchsia-300 bg-fuchsia-300/15 text-fuchsia-200',
    blue: 'border-blue-300 bg-blue-300/15 text-blue-200',
  };
  return colors[tile.color] ?? 'border-slate-600 bg-slate-800 text-white';
}

export function MahjongConnect({ locale }: MahjongConnectProps) {
  const text = copy[locale];
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState<MahjongBoard>(() => createMahjongBoard(1));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [bestLevel, setBestLevel] = useState(0);
  const [status, setStatus] = useState<string>(text.ready);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored = Number(window.localStorage.getItem('luma-mahjong-connect-best-level'));
      if (Number.isFinite(stored)) setBestLevel(stored);
    } catch {
      setBestLevel(0);
    }
  }, []);

  useEffect(() => {
    if (!started || isMahjongBoardComplete(board)) return;
    const timer = window.setInterval(() => {
      if (startedAtRef.current) setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [board, started]);

  const begin = (nextLevel = 1) => {
    setLevel(nextLevel);
    setBoard(createMahjongBoard(nextLevel));
    setSelectedId(null);
    setStarted(true);
    setSeconds(0);
    setScore(0);
    startedAtRef.current = Date.now();
    setStatus(text.ready);
    trackInteraction('mahjong_connect_started', { locale, level: nextLevel, source: 'mahjong_connect' });
  };

  const chooseTile = (tile: MahjongTile) => {
    if (!started) return;
    if (!selectedId) {
      setSelectedId(tile.id);
      setStatus(text.selected);
      return;
    }
    if (selectedId === tile.id) {
      setSelectedId(null);
      setStatus(text.ready);
      return;
    }

    const first = board.tiles.find((candidate) => candidate?.id === selectedId) ?? null;
    const matches = Boolean(first && first.kind === tile.kind);
    const connectable = matches && canConnectMahjongTiles(board, selectedId, tile.id);
    trackInteraction('mahjong_connect_pair_attempt', {
      locale,
      level,
      first_kind: first?.kind ?? 'unknown',
      second_kind: tile.kind,
      matched: matches,
      connectable,
      source: 'mahjong_connect',
    });
    if (!matches) {
      setStatus(text.mismatch);
      return;
    }
    if (!connectable) {
      setStatus(text.blocked);
      return;
    }

    const nextBoard = removeMahjongPair(board, selectedId, tile.id);
    if (!nextBoard) {
      setStatus(text.blocked);
      return;
    }
    const nextScore = score + 100;
    setBoard(nextBoard);
    setSelectedId(null);
    setScore(nextScore);
    if (isMahjongBoardComplete(nextBoard)) {
      setStatus(text.complete);
      setBestLevel((previous) => Math.max(previous, level));
      try {
        const nextBest = Math.max(bestLevel, level);
        window.localStorage.setItem('luma-mahjong-connect-best-level', String(nextBest));
      } catch {
        // The level remains complete when local storage is unavailable.
      }
      trackInteraction('mahjong_connect_finished', { locale, level, score: nextScore, seconds, source: 'mahjong_connect' });
    } else {
      setStatus(text.matched);
    }
  };

  const showHint = () => {
    if (!started) return;
    const hint = findMahjongHint(board);
    if (!hint) {
      setStatus(text.blocked);
      return;
    }
    setSelectedId(hint[0].id);
    setScore((value) => Math.max(0, value - 25));
    setStatus(text.hintStatus(hint[0].symbol, hint[1].symbol));
    trackInteraction('mahjong_connect_hint', { locale, level, source: 'mahjong_connect' });
  };

  const shuffle = () => {
    if (!started) return;
    setBoard((current) => shuffleMahjongBoard(current, Date.now()));
    setSelectedId(null);
    setStatus(text.ready);
    trackInteraction('mahjong_connect_shuffle', { locale, level, source: 'mahjong_connect' });
  };

  const remaining = getRemainingMahjongCount(board);
  const completed = isMahjongBoardComplete(board);

  return (
    <section data-mahjong-connect aria-labelledby="mahjong-connect-title" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
      <header className="flex flex-col gap-5 border-b border-slate-800 p-5 sm:p-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-300"><Sparkles aria-hidden="true" className="h-4 w-4" />{text.eyebrow}</p>
          <h2 id="mahjong-connect-title" className="mt-3 text-2xl font-black sm:text-3xl">{text.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{text.description}</p>
        </div>
        <button type="button" onClick={() => begin(level)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-violet-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"><Play aria-hidden="true" className="h-4 w-4" />{started ? text.restart : text.play}</button>
      </header>

      <div className="grid grid-cols-2 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900/80 sm:grid-cols-4">
        {[[text.level, `${level}/${MAHJONG_CONNECT_LEVEL_COUNT}`], [text.remaining, remaining], [text.score, score], [text.time, formatTime(seconds)]].map(([label, value]) => <div key={String(label)} className="p-3 text-center sm:p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-xl font-black tabular-nums text-violet-300 sm:text-2xl">{value}</p></div>)}
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2" role="toolbar" aria-label={locale === 'zh' ? '连连麻将工具' : 'Mahjong tools'}>
          <button type="button" onClick={showHint} disabled={!started || completed} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"><Lightbulb aria-hidden="true" className="h-4 w-4" />{text.hint}</button>
          <button type="button" onClick={shuffle} disabled={!started || completed} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"><Shuffle aria-hidden="true" className="h-4 w-4" />{text.shuffle}</button>
          <button type="button" onClick={() => begin(level)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"><RotateCcw aria-hidden="true" className="h-4 w-4" />{text.restart}</button>
          {completed ? <button type="button" onClick={() => begin((level % MAHJONG_CONNECT_LEVEL_COUNT) + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-violet-300 px-3 text-sm font-bold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">{text.next}</button> : null}
        </div>

        <p className="min-h-6 text-sm text-violet-200" role="status" aria-live="polite">{status}</p>
        <div className="grid grid-cols-6 gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 sm:gap-3 sm:p-5" data-mahjong-board>
          {board.tiles.map((tile, index) => tile ? <button key={tile.id} type="button" onClick={() => chooseTile(tile)} aria-label={text.ariaTile(tile)} aria-pressed={selectedId === tile.id} className={`flex aspect-square min-h-11 items-center justify-center rounded-lg border-2 text-xl font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 sm:text-2xl ${tileColor(tile)} ${selectedId === tile.id ? 'ring-2 ring-white' : ''}`}>{tile.symbol}<span className="sr-only">{tile.kind}</span></button> : <span key={`empty-${index}`} aria-hidden="true" className="aspect-square min-h-11 rounded-lg border border-dashed border-slate-800 bg-slate-950/50" />)}
        </div>
        <p className="flex items-center gap-2 text-xs text-slate-400"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" />{text.local} · {text.time} {formatTime(seconds)} · {text.score} {score}</p>
      </div>
    </section>
  );
}
