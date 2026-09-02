'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import {
  applyChineseCheckersMove,
  chooseChineseCheckersMove,
  createChineseCheckersBoard,
  getChineseCheckersMoves,
  getReachableChineseCheckersMovePaths,
  hasChineseCheckersWinner,
  keyForHole,
  type ChineseCheckersBoard,
  type ChineseCheckersDifficulty,
  type ChineseCheckersPlayer,
  type ChineseCheckersPosition,
} from '@/lib/games/chinese-checkers';
import { useHydrated } from '@/lib/react/use-hydrated';

type Mode = 'local' | ChineseCheckersDifficulty;

const copy = {
  en: { local: 'Local 2 players', easy: 'AI Easy', medium: 'AI Medium', hard: 'AI Hard', turn: 'turn', hint: 'Hint', undo: 'Undo', restart: 'New game', select: 'Select a marble, then a highlighted legal destination.', ai: 'AI is choosing a legal move…', red: 'Coral', blue: 'Teal', win: 'wins — all ten marbles reached the opposite camp.', muted: 'Muted', sound: 'Sound on', history: 'Move history', chain: 'Suggested hop chain' },
  zh: { local: '本地双人', easy: 'AI Easy', medium: 'AI Medium', hard: 'AI Hard', turn: '回合', hint: '提示', undo: '撤销', restart: '新游戏', select: '先选择棋子，再选择高亮的合法目标。', ai: 'AI 正在选择合法走法…', red: '珊瑚方', blue: '青色方', win: '获胜——十枚棋子已全部进入对面营地。', muted: '已静音', sound: '声音开启', history: '走法记录', chain: '建议跳链' },
} as const;

function cloneBoard(board: ChineseCheckersBoard) {
  return { holes: board.holes, pieces: new Map(board.pieces) };
}

function playMoveTone(muted: boolean, jump: boolean) {
  if (muted || typeof window === 'undefined') return;
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = jump ? 520 : 360;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.09);
    oscillator.addEventListener('ended', () => void context.close());
  } catch {}
}

export function ChineseCheckers({ locale }: { locale: 'en' | 'zh' }) {
  const hydrated = useHydrated();
  const text = copy[locale];
  const holeRefs = useRef(new Map<string, HTMLButtonElement>());
  const [mode, setMode] = useState<Mode>('local');
  const [board, setBoard] = useState(() => createChineseCheckersBoard());
  const [turn, setTurn] = useState<ChineseCheckersPlayer>('red');
  const [selected, setSelected] = useState<ChineseCheckersPosition | null>(null);
  const [history, setHistory] = useState<Array<{ board: ChineseCheckersBoard; turn: ChineseCheckersPlayer; label: string }>>([]);
  const [winner, setWinner] = useState<ChineseCheckersPlayer | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [muted, setMuted] = useState(true);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [focusedKey, setFocusedKey] = useState(() => keyForHole({ q: 4, r: -8 }));
  const legalMovePaths = useMemo(
    () => selected ? getReachableChineseCheckersMovePaths(board, selected) : [],
    [board, selected],
  );
  const legalPathByKey = useMemo(
    () => new Map(legalMovePaths.map((move) => [keyForHole(move.to), move])),
    [legalMovePaths],
  );
  const legalKeys = useMemo(() => new Set(legalPathByKey.keys()), [legalPathByKey]);
  const previewMove = useMemo(() => {
    if (previewKey && legalPathByKey.has(previewKey)) return legalPathByKey.get(previewKey) ?? null;
    return [...legalMovePaths].sort((a, b) => b.path.length - a.path.length)[0] ?? null;
  }, [legalMovePaths, legalPathByKey, previewKey]);
  const previewPathKeys = useMemo(
    () => new Set(previewMove?.path.map(keyForHole) ?? []),
    [previewMove],
  );

  useEffect(() => {
    if (!hydrated) return;
    try {
      setMuted(window.localStorage.getItem('luma-chinese-checkers:muted') !== 'false');
    } catch {}
  }, [hydrated]);

  useEffect(() => {
    if (mode === 'local' || turn !== 'blue' || winner) return;
    setAiThinking(true);
    const timer = window.setTimeout(() => {
      const move = chooseChineseCheckersMove(board, 'blue', mode, history.length + 31);
      if (move) {
        const next = applyChineseCheckersMove(board, move);
        if (next) {
          const path = getReachableChineseCheckersMovePaths(board, move.from).find(
            (candidate) => keyForHole(candidate.to) === keyForHole(move.to),
          );
          const label = `${keyForHole(move.from)} → ${(path?.path ?? [move.to]).map(keyForHole).join(' → ')}`;
          setHistory((items) => [...items, { board: cloneBoard(board), turn, label }]);
          setBoard(next);
          const didWin = hasChineseCheckersWinner(next, 'blue');
          setWinner(didWin ? 'blue' : null);
          setTurn('red');
          playMoveTone(muted, (path?.path.length ?? 1) > 1);
          trackInteraction((path?.path.length ?? 1) > 1 ? 'multi_hop_complete' : 'move_complete', { game_slug: 'chinese_checkers', mode, player: 'ai', move_type: path?.type ?? 'step' });
          if (didWin) trackInteraction('game_end', { game_slug: 'chinese_checkers', mode, winner: 'ai' });
        }
      }
      setAiThinking(false);
    }, 260);
    return () => window.clearTimeout(timer);
  }, [board, history.length, mode, muted, turn, winner]);

  function reset(nextMode = mode) {
    setMode(nextMode); setBoard(createChineseCheckersBoard()); setTurn('red'); setSelected(null); setHistory([]); setWinner(null); setAiThinking(false); setPreviewKey(null);
    trackInteraction('restart', { game_slug: 'chinese_checkers', mode: nextMode });
  }

  function chooseHole(position: ChineseCheckersPosition) {
    if (!hydrated || aiThinking || winner) return;
    const key = keyForHole(position);
    const owner = board.pieces.get(key);
    if (owner === turn) {
      setSelected(position);
      setPreviewKey(null);
      return;
    }
    if (!selected || !legalKeys.has(key)) return;
    const path = legalPathByKey.get(key);
    const next = applyChineseCheckersMove(board, { from: selected, to: position });
    if (!next) return;
    const moveType = path?.type ?? 'step';
    const label = `${keyForHole(selected)} → ${(path?.path ?? [position]).map(keyForHole).join(' → ')}`;
    setHistory((items) => [...items, { board: cloneBoard(board), turn, label }]);
    setBoard(next);
    setSelected(null);
    setPreviewKey(null);
    const didWin = hasChineseCheckersWinner(next, turn);
    setWinner(didWin ? turn : null);
    if (!didWin) setTurn(turn === 'red' ? 'blue' : 'red');
    playMoveTone(muted, (path?.path.length ?? 1) > 1);
    trackInteraction((path?.path.length ?? 1) > 1 ? 'multi_hop_complete' : 'move_complete', { game_slug: 'chinese_checkers', mode, player: turn, move_type: moveType });
    if (didWin) trackInteraction('game_end', { game_slug: 'chinese_checkers', mode, winner: turn });
  }

  function hint() {
    const move = getChineseCheckersMoves(board, turn)[0];
    if (!move) return;
    setSelected(move.from);
    setPreviewKey(keyForHole(move.to));
    trackInteraction('hint_used', { game_slug: 'chinese_checkers', mode, player: turn });
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    try { window.localStorage.setItem('luma-chinese-checkers:muted', String(next)); } catch {}
  }

  function moveBoardFocus(position: ChineseCheckersPosition, code: string) {
    const direction = code === 'ArrowRight'
      ? { q: 1, r: 0 }
      : code === 'ArrowLeft'
        ? { q: -1, r: 0 }
        : code === 'ArrowDown'
          ? { q: 0, r: 1 }
          : { q: 0, r: -1 };
    let target = { q: position.q + direction.q, r: position.r + direction.r };
    const holes = new Set(board.holes.map(keyForHole));
    while (holes.has(keyForHole(target))) {
      const key = keyForHole(target);
      const element = holeRefs.current.get(key);
      if (element) {
        setFocusedKey(key);
        element.focus();
        return;
      }
      target = { q: target.q + direction.q, r: target.r + direction.r };
    }
  }

  function undo() {
    const previous = history[history.length - 1];
    if (!previous || aiThinking || mode !== 'local') return;
    setBoard(cloneBoard(previous.board)); setTurn(previous.turn); setHistory((items) => items.slice(0, -1)); setSelected(null); setWinner(null);
    trackInteraction('undo_used', { game_slug: 'chinese_checkers', mode });
  }

  const status = winner ? `${winner === 'red' ? text.red : text.blue} ${text.win}` : aiThinking ? text.ai : `${turn === 'red' ? text.red : text.blue} ${text.turn} · ${text.select}`;

  return (
    <section data-chinese-checkers data-interactive-ready={hydrated} aria-busy={!hydrated || aiThinking} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-xl">
      <header className="border-b border-slate-800 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-300">121-hole strategy board</p><p className="mt-2 text-sm text-slate-300" aria-live="polite">{status}</p></div>
          <div className="flex flex-wrap gap-2" aria-label="Game mode">
            {(['local', 'easy', 'medium', 'hard'] as const).map((value) => <button key={value} type="button" disabled={!hydrated || aiThinking} aria-pressed={mode === value} onClick={() => { reset(value); trackInteraction('mode_select', { game_slug: 'chinese_checkers', mode: value }); trackInteraction('game_start', { game_slug: 'chinese_checkers', mode: value }); }} className="min-h-11 rounded-full border border-slate-600 px-3 text-sm font-semibold disabled:opacity-50">{text[value]}</button>)}
            <button type="button" disabled={!hydrated || aiThinking} aria-pressed={!muted} onClick={toggleMute} className="min-h-11 rounded-full border border-slate-600 px-3 text-sm font-semibold disabled:opacity-50">{muted ? text.muted : text.sound}</button>
          </div>
        </div>
      </header>
      <div className="overflow-x-auto p-3 sm:p-6" aria-label="Scrollable Chinese Checkers board">
        <div className="relative mx-auto h-[800px] min-w-[800px] max-w-[800px] rounded-2xl border border-slate-700 bg-slate-900/80" role="grid" aria-label="Chinese Checkers 121-hole board">
          {board.holes.map((hole) => {
            const key = keyForHole(hole);
            const owner = board.pieces.get(key);
            const isSelected = selected && keyForHole(selected) === key;
            const legal = legalKeys.has(key);
            const left = 50 + (hole.q + hole.r / 2) * 6.15;
            const top = 50 + hole.r * 5.55;
            return <button key={key} ref={(element) => { if (element) holeRefs.current.set(key, element); else holeRefs.current.delete(key); }} type="button" role="gridcell" tabIndex={focusedKey === key ? 0 : -1} aria-label={`Hole ${key}${owner ? `, ${owner} marble` : ''}${legal ? `, legal destination${legalPathByKey.get(key)?.path.length ? ` via ${legalPathByKey.get(key)?.path.map(keyForHole).join(' then ')}` : ''}` : ''}`} aria-disabled={!owner && !legal} aria-selected={Boolean(isSelected)} disabled={!hydrated || aiThinking} onFocus={() => { setFocusedKey(key); if (legal) setPreviewKey(key); }} onPointerEnter={() => { if (legal) setPreviewKey(key); }} onKeyDown={(event) => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.code)) { event.preventDefault(); moveBoardFocus(hole, event.code); } }} onClick={() => chooseHole(hole)} style={{ left: `${left}%`, top: `${top}%` }} className={`absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white ${owner === 'red' ? 'border-rose-200 bg-rose-500' : owner === 'blue' ? 'border-teal-100 bg-teal-400' : legal ? 'border-amber-200 bg-amber-300/60' : 'border-slate-600 bg-slate-800'} ${isSelected ? 'ring-4 ring-white' : ''} ${previewPathKeys.has(key) ? 'ring-4 ring-amber-200' : ''}`} />;
          })}
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-3 text-sm text-slate-300 sm:px-6">
        <p aria-live="polite">{previewMove && previewMove.path.length > 1 ? `${text.chain}: ${selected ? keyForHole(selected) : ''} → ${previewMove.path.map(keyForHole).join(' → ')}` : text.select}</p>
        <div className="mt-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{text.history}</p>
          {history.length > 0 ? <ol className="mt-1 space-y-1 font-mono text-xs">{history.slice(-4).map((item, index) => <li key={`${item.label}-${index}`}>{history.length - Math.min(4, history.length) + index + 1}. {item.label}</li>)}</ol> : <p className="mt-1 text-xs text-slate-500">—</p>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-slate-800 p-4 sm:p-6">
        <button type="button" disabled={!hydrated || aiThinking || Boolean(winner)} onClick={hint} className="min-h-12 rounded-lg border border-slate-600 font-semibold disabled:opacity-40">{text.hint}</button>
        <button type="button" disabled={!hydrated || aiThinking || mode !== 'local' || history.length === 0} onClick={undo} className="min-h-12 rounded-lg border border-slate-600 font-semibold disabled:opacity-40">{text.undo}</button>
        <button type="button" disabled={!hydrated || aiThinking} onClick={() => reset()} className="min-h-12 rounded-lg bg-teal-300 font-black text-slate-950 disabled:opacity-40">{text.restart}</button>
      </div>
    </section>
  );
}
