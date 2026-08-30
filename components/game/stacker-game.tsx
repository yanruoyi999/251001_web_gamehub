'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import {
  createSeededStackerSetup,
  dropTowerBlock,
  getBlockSpeed,
  getSprintSecondsRemaining,
  PERFECT_DROP_TOLERANCE,
  type TowerAxis,
  type TowerBlock,
} from '@/lib/games/stacker-game';
import { useHydrated } from '@/lib/react/use-hydrated';

type Mode = 'classic' | 'sprint';

const copy = {
  en: { start: 'Start run', restart: 'Restart', classic: 'Classic', sprint: '60s Sprint', score: 'Score', height: 'Height', best: 'Local best', time: 'Time', muted: 'Muted', sound: 'Sound on', ready: 'Focus this surface, then tap, click, Space or Enter to drop.', missed: 'Missed — start another run.', timed: 'Sprint complete — start another run.', paused: 'Paused while this tab or window is hidden.' },
  zh: { start: '开始本局', restart: '重新开始', classic: '经典', sprint: '60 秒冲刺', score: '分数', height: '高度', best: '本地最高分', time: '时间', muted: '已静音', sound: '声音开启', ready: '让游戏区域获得焦点，再触摸、点击或按 Space/Enter 落块。', missed: '落空了——开始新一局。', timed: '冲刺结束——开始新一局。', paused: '标签页或窗口不可见时已暂停。' },
} as const;

function bucket(value: number) {
  if (value >= 30) return '30+';
  if (value >= 15) return '15-29';
  if (value >= 5) return '5-14';
  return '0-4';
}

function playTone(muted: boolean, perfect: boolean) {
  if (muted || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = perfect ? 620 : 360;
    gain.gain.setValueAtTime(0.04, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.09);
    oscillator.addEventListener('ended', () => void context.close());
  } catch {}
}

export function StackerGame({ locale }: { locale: 'en' | 'zh' }) {
  const hydrated = useHydrated();
  const text = copy[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<TowerBlock[]>([{ x: 0, z: 0, width: 150, depth: 150 }]);
  const movingRef = useRef<TowerBlock>({ x: -155, z: 0, width: 150, depth: 150 });
  const axisRef = useRef<TowerAxis>('x');
  const directionRef = useRef(1);
  const lastFrameRef = useRef(0);
  const elapsedRef = useRef(0);
  const colorSeedRef = useRef(188);
  const [mode, setMode] = useState<Mode>('classic');
  const [running, setRunning] = useState(false);
  const [ended, setEnded] = useState(false);
  const [endReason, setEndReason] = useState<'miss' | 'timer' | null>(null);
  const [paused, setPaused] = useState(false);
  const [height, setHeight] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [muted, setMuted] = useState(true);
  const [smokeSeed, setSmokeSeed] = useState<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    try {
      setBest(Number(window.localStorage.getItem('luma-stacker-game:best')) || 0);
      setMuted(window.localStorage.getItem('luma-stacker-game:muted') !== 'false');
      const smokeValue = new URLSearchParams(window.location.search).get('smoke');
      setSmokeSeed(smokeValue === null ? null : Number(smokeValue) || 1);
    } catch {}
  }, [hydrated]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#020617');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const blocks = blocksRef.current.slice(-11);
    blocks.forEach((block, index) => {
      const level = blocks.length - 1 - index;
      const x = canvas.width / 2 + block.x + block.z * 0.28 - block.width / 2;
      const y = canvas.height - 36 - level * 25;
      context.fillStyle = `hsl(${(colorSeedRef.current + index * 17) % 360} 80% ${52 + (index % 3) * 5}%)`;
      context.fillRect(x, y, block.width, 21);
      context.strokeStyle = '#e2e8f0';
      context.lineWidth = 1;
      context.strokeRect(x, y, block.width, 21);
    });
    if (running && !ended) {
      const moving = movingRef.current;
      const x = canvas.width / 2 + moving.x + moving.z * 0.28 - moving.width / 2;
      const y = canvas.height - 36 - blocks.length * 25;
      context.fillStyle = '#fbbf24';
      context.fillRect(x, y, moving.width, 21);
      context.strokeStyle = '#fff7ed';
      context.lineWidth = 2;
      context.strokeRect(x, y, moving.width, 21);
    }
  }, [ended, running]);

  useEffect(() => draw(), [draw, height, score]);

  useEffect(() => {
    function pause() {
      setPaused(true);
      lastFrameRef.current = 0;
    }

    function resume() {
      setPaused(document.hidden);
      lastFrameRef.current = 0;
    }

    function visibility() {
      if (document.hidden) pause();
      else resume();
    }

    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', pause);
    window.addEventListener('focus', resume);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', pause);
      window.removeEventListener('focus', resume);
    };
  }, []);

  useEffect(() => {
    if (!running || ended || paused) return;
    let frame = 0;
    const tick = (now: number) => {
      const delta = lastFrameRef.current ? Math.min(40, now - lastFrameRef.current) : 0;
      lastFrameRef.current = now;
      elapsedRef.current += delta;
      if (mode === 'sprint') {
        const remaining = getSprintSecondsRemaining(elapsedRef.current);
        setSeconds(remaining);
        if (remaining === 0) {
          setEnded(true);
          setRunning(false);
          setEndReason('timer');
          setBest((currentBest) => {
            const nextBest = Math.max(currentBest, score);
            try { window.localStorage.setItem('luma-stacker-game:best', String(nextBest)); } catch {}
            return nextBest;
          });
          trackInteraction('run_end', { game_slug: 'stacker_game', mode, end_reason: 'timer', height_bucket: bucket(height), score_bucket: bucket(score) });
          return;
        }
      }
      const moving = movingRef.current;
      const axis = axisRef.current;
      const next = moving[axis] + directionRef.current * getBlockSpeed(height) * delta * 0.085;
      if (Math.abs(next) > 165) directionRef.current *= -1;
      movingRef.current = { ...moving, [axis]: Math.max(-165, Math.min(165, next)) };
      draw();
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [draw, ended, height, mode, paused, running, score]);

  function startRun() {
    const setup = createSeededStackerSetup(smokeSeed ?? Date.now());
    blocksRef.current = [setup.base];
    movingRef.current = smokeSeed === null
      ? { ...setup.moving, [setup.axis]: -155 * setup.direction }
      : setup.moving;
    axisRef.current = setup.axis;
    directionRef.current = setup.direction;
    colorSeedRef.current = setup.hue;
    elapsedRef.current = 0;
    lastFrameRef.current = 0;
    setHeight(0); setScore(0); setCombo(0); setSeconds(60); setEnded(false); setEndReason(null); setRunning(true);
    trackInteraction('game_start', { game_slug: 'stacker_game', mode });
  }

  function endRun(reason: 'miss') {
    setEnded(true);
    setRunning(false);
    setEndReason(reason);
    const nextBest = Math.max(best, score);
    setBest(nextBest);
    try { window.localStorage.setItem('luma-stacker-game:best', String(nextBest)); } catch {}
    trackInteraction('run_end', { game_slug: 'stacker_game', mode, end_reason: reason, height_bucket: bucket(height), score_bucket: bucket(score) });
  }

  function drop() {
    if (!running || ended || paused) return;
    const previous = blocksRef.current[blocksRef.current.length - 1];
    const result = dropTowerBlock(
      previous,
      movingRef.current,
      axisRef.current,
      PERFECT_DROP_TOLERANCE,
    );
    if (result.status === 'missed' || !result.block) {
      endRun('miss');
      return;
    }
    const nextCombo = result.status === 'perfect' ? combo + 1 : 0;
    const nextHeight = height + 1;
    const nextScore = score + 1 + (result.status === 'perfect' ? Math.min(5, nextCombo) : 0);
    blocksRef.current = [...blocksRef.current, result.block];
    axisRef.current = axisRef.current === 'x' ? 'z' : 'x';
    const nextAxis = axisRef.current;
    movingRef.current = { ...result.block, [nextAxis]: -165 };
    directionRef.current = 1;
    setHeight(nextHeight); setScore(nextScore); setCombo(nextCombo);
    playTone(muted, result.status === 'perfect');
    trackInteraction('block_drop', { game_slug: 'stacker_game', mode, height_bucket: bucket(nextHeight), score_bucket: bucket(nextScore) });
    if (result.status === 'perfect') trackInteraction('perfect_drop', { game_slug: 'stacker_game', mode, height_bucket: bucket(nextHeight) });
  }

  function selectMode(next: Mode) {
    setMode(next);
    setRunning(false); setEnded(false); setEndReason(null); setSeconds(60);
    trackInteraction('mode_select', { game_slug: 'stacker_game', mode: next });
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    try { window.localStorage.setItem('luma-stacker-game:muted', String(next)); } catch {}
    trackInteraction('mute_toggle', { game_slug: 'stacker_game', muted: next });
  }

  return (
    <section data-stacker-game data-interactive-ready={hydrated} data-smoke-mode={smokeSeed === null ? 'false' : 'true'} aria-busy={!hydrated} tabIndex={0} onKeyDown={(event) => { if ((event.code === 'Space' || event.code === 'Enter') && event.currentTarget === document.activeElement) { event.preventDefault(); drop(); } }} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-4 sm:p-6">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Tower lab</p><p className="mt-1 text-sm text-slate-300">{paused ? text.paused : ended ? endReason === 'timer' ? text.timed : text.missed : text.ready}</p></div>
        <div className="flex flex-wrap gap-2">
          {(['classic', 'sprint'] as const).map((value) => <button key={value} type="button" disabled={!hydrated || running} aria-pressed={mode === value} onClick={() => selectMode(value)} className="min-h-11 rounded-full border border-slate-600 px-4 font-semibold disabled:opacity-50">{value === 'classic' ? text.classic : text.sprint}</button>)}
          <button type="button" disabled={!hydrated} onClick={toggleMute} className="min-h-11 rounded-full border border-slate-600 px-4 font-semibold">{muted ? text.muted : text.sound}</button>
        </div>
      </header>
      <div className="p-3 sm:p-6">
        <canvas ref={canvasRef} width={640} height={420} aria-label="Stacker tower" onPointerUp={drop} className="aspect-[16/10] w-full touch-manipulation rounded-xl border border-slate-700 bg-slate-950" />
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-slate-800 sm:grid-cols-5">
          {[[text.score, score], [text.height, height], ['Combo', combo], [text.best, best], [text.time, mode === 'sprint' ? `${seconds}s` : '∞']].map(([label, value]) => <div key={String(label)} className="bg-slate-900 p-3 text-center"><p className="text-xs uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-xl font-black text-amber-300">{value}</p></div>)}
        </div>
        <button type="button" disabled={!hydrated} onClick={() => { if (ended || running) trackInteraction('restart', { game_slug: 'stacker_game', mode }); startRun(); }} className="mt-4 min-h-12 w-full rounded-lg bg-amber-300 px-4 font-black text-slate-950 disabled:opacity-40">{running && !ended ? text.restart : text.start}</button>
      </div>
    </section>
  );
}
