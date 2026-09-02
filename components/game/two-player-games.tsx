'use client';

import { useEffect, useRef, useState } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import {
  claimGridCell,
  createGridClaimState,
  createSyncSwitchState,
  createTapDuelState,
  playerForControlCode,
  recordMatchRound,
  registerSyncSwitchInput,
  registerTapDuelInput,
  type DuelPlayer,
  type DuelScore,
  type GridClaimState,
  type SyncSwitchState,
  type TapDuelState,
} from '@/lib/games/two-player-games';
import { useHydrated } from '@/lib/react/use-hydrated';

type Mode = 'tap' | 'grid' | 'sync';

const copy = {
  en: {
    tap: 'Tap Duel', grid: 'Grid Claim', sync: 'Sync Switch', reaction: 'Reaction', strategy: 'Strategy', cooperation: 'Cooperation', start: 'Start round', next: 'Next round', rematch: 'Rematch', p1: 'Player 1', p2: 'Player 2', wait: 'Wait for GO', go: 'GO!', falseStart: 'False start', score: 'Best-of-three', team: 'Team successes', window: 'Timing window', ready: 'Choose one of three independently playable games.',
    tapInstructions: 'Start the round, wait for GO, then press your side first. A false start awards the round to the other player.',
    gridInstructions: 'Take turns claiming empty cells. A newly completed row, column or diagonal scores one point when the grid fills; diamonds are deterministic seed markers, not bonuses.',
    syncInstructions: 'Press both player zones inside the same timing window. Five successes complete the cooperative round.',
  },
  zh: {
    tap: 'Tap Duel', grid: 'Grid Claim', sync: 'Sync Switch', reaction: '反应', strategy: '策略', cooperation: '合作', start: '开始本轮', next: '下一轮', rematch: '再来一轮', p1: '玩家 1', p2: '玩家 2', wait: '等待 GO', go: 'GO！', falseStart: '抢按', score: '三局两胜', team: '团队成功', window: '同步窗口', ready: '从三款独立可玩游戏中选择。',
    tapInstructions: '开始本轮并等待 GO，再抢先按下自己一侧；提前抢按会把本轮判给对手。',
    gridInstructions: '双方轮流占领空格；棋盘填满时，每条新完成的横线、竖线或对角线计一分；菱形只是确定性种子标记，不额外加分。',
    syncInstructions: '两位玩家要在同一个时间窗口内按下各自区域；完成五次同步即通过合作轮。',
  },
} as const;

function playPackTone(frequency: number) {
  if (typeof window === 'undefined') return;
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.03, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.07);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.08);
    oscillator.addEventListener('ended', () => void context.close());
  } catch {}
}

export function TwoPlayerGames({ locale }: { locale: 'en' | 'zh' }) {
  const hydrated = useHydrated();
  const text = copy[locale];
  const packOpenedRef = useRef(false);
  const modeStartedRef = useRef(false);
  const [mode, setMode] = useState<Mode>('tap');
  const [matchScore, setMatchScore] = useState<DuelScore>({ one: 0, two: 0 });
  const [matchWinner, setMatchWinner] = useState<DuelPlayer | null>(null);
  const [tap, setTap] = useState<TapDuelState | null>(null);
  const [tapCueVisible, setTapCueVisible] = useState(false);
  const [grid, setGrid] = useState<GridClaimState>(() => createGridClaimState(1));
  const [sync, setSync] = useState<SyncSwitchState>(() => createSyncSwitchState());
  const [roundMessage, setRoundMessage] = useState('');

  useEffect(() => {
    if (!hydrated || packOpenedRef.current) return;
    packOpenedRef.current = true;
    trackInteraction('pack_open', { game_slug: 'two_player_games' });
  }, [hydrated]);

  useEffect(() => {
    if (!tap || tap.roundWinner || tapCueVisible) return;
    const delay = Math.max(0, tap.cueAt - Date.now());
    const timer = window.setTimeout(() => setTapCueVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [tap, tapCueVisible]);

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.repeat || !hydrated) return;
      const player = playerForControlCode(event.code);
      if (!player) return;
      event.preventDefault();
      playerInput(player, 'keyboard');
    }
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  });

  function ensureGameStarted(currentMode: Mode) {
    if (modeStartedRef.current) return;
    modeStartedRef.current = true;
    trackInteraction('game_start', { game_slug: 'two_player_games', mode: currentMode });
  }

  function awardRound(winner: DuelPlayer) {
    const result = recordMatchRound(matchScore, winner);
    setMatchScore(result.score);
    setMatchWinner(result.winner);
    setRoundMessage(`${winner === 'one' ? text.p1 : text.p2} wins the round`);
    playPackTone(winner === 'one' ? 440 : 560);
    trackInteraction('round_end', { game_slug: 'two_player_games', mode, winner });
    if (result.winner) trackInteraction('match_end', { game_slug: 'two_player_games', mode, winner: result.winner });
  }

  function startTapRound() {
    setTap(createTapDuelState(Date.now() + 700));
    setTapCueVisible(false);
    setRoundMessage(text.wait);
    ensureGameStarted('tap');
  }

  function playerInput(player: DuelPlayer, controlType: 'keyboard' | 'touch') {
    trackInteraction('control_type', { game_slug: 'two_player_games', mode, control_type: controlType });
    if (mode === 'tap' && tap && !tap.roundWinner) {
      const next = registerTapDuelInput(tap, player, Date.now());
      setTap(next);
      if (next.roundWinner) {
        awardRound(next.roundWinner);
        setRoundMessage(Date.now() < tap.cueAt ? `${text.falseStart} · ${next.roundWinner === 'one' ? text.p1 : text.p2}` : `${next.roundWinner === 'one' ? text.p1 : text.p2} · ${next.reactionMs}ms`);
      }
    }
    if (mode === 'sync') {
      if (sync.successes >= 5) return;
      ensureGameStarted('sync');
      const next = registerSyncSwitchInput(sync, player, Date.now());
      setSync(next);
      if (next.successes > sync.successes) {
        playPackTone(620);
        setRoundMessage(`${text.team}: ${next.successes}`);
        if (next.successes === 5) trackInteraction('round_end', { game_slug: 'two_player_games', mode: 'sync', result: 'team_complete' });
      }
    }
  }

  function selectMode(next: Mode) {
    setMode(next); setRoundMessage('');
    modeStartedRef.current = false;
    if (next === 'tap') setTap(null);
    if (next === 'grid') setGrid(createGridClaimState(matchScore.one * 31 + matchScore.two * 17 + 7));
    if (next === 'sync') setSync(createSyncSwitchState());
    trackInteraction('mode_select', { game_slug: 'two_player_games', mode: next });
  }

  function claim(index: number) {
    if (mode !== 'grid' || matchWinner) return;
    ensureGameStarted('grid');
    const next = claimGridCell(grid, index);
    if (next === grid) return;
    setGrid(next);
    if (next.finished) {
      if (next.score.one === next.score.two) setRoundMessage('Grid draw');
      else awardRound(next.score.one > next.score.two ? 'one' : 'two');
    }
  }

  function rematch() {
    setMatchScore({ one: 0, two: 0 }); setMatchWinner(null); setTap(null); setTapCueVisible(false); setGrid(createGridClaimState(Date.now() % 997)); setSync(createSyncSwitchState()); setRoundMessage('');
    modeStartedRef.current = false;
    trackInteraction('rematch', { game_slug: 'two_player_games', mode });
  }

  function nextRound() {
    modeStartedRef.current = false;
    setRoundMessage('');
    if (mode === 'grid') {
      setGrid(createGridClaimState(matchScore.one * 31 + matchScore.two * 17 + 11));
    }
    if (mode === 'sync') setSync(createSyncSwitchState());
  }

  const modes = [
    { id: 'tap' as const, title: text.tap, label: text.reaction },
    { id: 'grid' as const, title: text.grid, label: text.strategy },
    { id: 'sync' as const, title: text.sync, label: text.cooperation },
  ];
  const instructions = mode === 'tap'
    ? text.tapInstructions
    : mode === 'grid'
      ? text.gridInstructions
      : text.syncInstructions;

  return (
    <section data-two-player-games data-interactive-ready={hydrated} aria-busy={!hydrated} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-xl">
      <header className="border-b border-slate-800 p-4 sm:p-6">
        <p className="text-sm text-slate-300">{text.ready}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Choose a game">
          {modes.map((item) => <button key={item.id} id={item.id === 'tap' ? 'tap-duel' : item.id === 'grid' ? 'grid-claim' : 'sync-switch'} type="button" disabled={!hydrated} aria-pressed={mode === item.id} onClick={() => selectMode(item.id)} className="min-h-16 rounded-xl border border-slate-600 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"><span className="block text-xs uppercase tracking-wide text-fuchsia-300">{item.label}</span><span className="mt-1 block font-black">{item.title}</span></button>)}
        </div>
        <p className="mt-4 rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm leading-6 text-slate-200" data-mode-instructions>{instructions}</p>
      </header>
      <div className="grid grid-cols-3 gap-px bg-slate-800 text-center">
        <div className="bg-slate-900 p-3"><p className="text-xs text-slate-400">{text.p1}</p><p className="text-2xl font-black text-cyan-300">{matchScore.one}</p></div>
        <div className="bg-slate-900 p-3"><p className="text-xs text-slate-400">{text.score}</p><p className="text-sm font-bold text-white">{matchWinner ? `${matchWinner === 'one' ? text.p1 : text.p2} ✓` : 'first to 2'}</p></div>
        <div className="bg-slate-900 p-3"><p className="text-xs text-slate-400">{text.p2}</p><p className="text-2xl font-black text-fuchsia-300">{matchScore.two}</p></div>
      </div>
      <div className="p-4 sm:p-6">
        {mode === 'tap' && <div className="space-y-4">
          <div className={`rounded-2xl border p-8 text-center text-4xl font-black ${tapCueVisible ? 'border-emerald-300 bg-emerald-300 text-slate-950' : 'border-slate-700 bg-slate-900 text-slate-300'}`} aria-live="assertive">{tapCueVisible ? text.go : text.wait}</div>
          <button type="button" disabled={!hydrated || Boolean(tap && !tap.roundWinner)} onClick={startTapRound} className="min-h-12 w-full rounded-lg bg-fuchsia-300 font-black text-slate-950 disabled:opacity-40">{text.start}</button>
        </div>}
        {mode === 'grid' && <div className="space-y-4">
          <div className="mx-auto grid max-w-sm grid-cols-3 gap-2" role="grid" aria-label="Grid Claim board">
            {grid.cells.map((owner, index) => <button key={index} type="button" role="gridcell" disabled={!hydrated || Boolean(owner) || grid.finished} onClick={() => claim(index)} aria-label={`Cell ${index + 1}${owner ? ` claimed by ${owner}` : ''}`} className={`aspect-square min-h-16 rounded-xl border-2 text-xl font-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white ${owner === 'one' ? 'border-cyan-200 bg-cyan-400 text-slate-950' : owner === 'two' ? 'border-fuchsia-200 bg-fuchsia-400 text-slate-950' : grid.bonusCells.includes(index) ? 'border-amber-300 bg-amber-300/10' : 'border-slate-600 bg-slate-900'}`}>{owner === 'one' ? 'P1' : owner === 'two' ? 'P2' : grid.bonusCells.includes(index) ? '◇' : ''}</button>)}
          </div>
          {grid.finished && !matchWinner ? <button type="button" onClick={nextRound} className="min-h-12 w-full rounded-lg border border-slate-600 font-semibold">{text.next}</button> : null}
        </div>}
        {mode === 'sync' && <div className="space-y-4 text-center">
          <div className="grid grid-cols-2 gap-2"><div className="rounded-xl border border-slate-700 p-4"><p className="text-xs text-slate-400">{text.team}</p><p className="text-3xl font-black text-emerald-300">{sync.successes}/5</p></div><div className="rounded-xl border border-slate-700 p-4"><p className="text-xs text-slate-400">{text.window}</p><p className="text-3xl font-black text-amber-300">{sync.windowMs}ms</p></div></div>
          <p className="text-sm text-slate-300">{text.syncInstructions}</p>
          {sync.successes >= 5 ? <button type="button" onClick={nextRound} className="min-h-12 w-full rounded-lg border border-slate-600 font-semibold">{text.next}</button> : null}
        </div>}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" data-player-zone="one" disabled={!hydrated || Boolean(matchWinner) || (mode === 'sync' && sync.successes >= 5)} onPointerDown={() => playerInput('one', 'touch')} className="min-h-24 touch-manipulation rounded-2xl bg-cyan-400 text-xl font-black text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white">{text.p1}<span className="mt-1 block text-xs">A / Space</span></button>
          <button type="button" data-player-zone="two" disabled={!hydrated || Boolean(matchWinner) || (mode === 'sync' && sync.successes >= 5)} onPointerDown={() => playerInput('two', 'touch')} className="min-h-24 touch-manipulation rounded-2xl bg-fuchsia-400 text-xl font-black text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white">{text.p2}<span className="mt-1 block text-xs">L / Enter</span></button>
        </div>
        <p className="mt-4 min-h-6 text-center text-sm font-semibold text-amber-200" aria-live="polite">{roundMessage}</p>
        <button type="button" onClick={rematch} disabled={!hydrated} className="mt-2 min-h-12 w-full rounded-lg border border-slate-600 font-semibold disabled:opacity-40">{text.rematch}</button>
      </div>
    </section>
  );
}
