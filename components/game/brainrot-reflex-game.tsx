'use client';

import { Clock3, Play, RotateCcw, Target, Trophy, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { trackInteraction } from '@/lib/analytics/events';

const ROUND_SECONDS = 20;

type GameState = 'idle' | 'playing' | 'finished';

interface TargetPosition {
  x: number;
  y: number;
  hue: number;
}

interface BrainrotReflexGameProps {
  locale: 'zh' | 'en';
}

const copy = {
  zh: {
    eyebrow: 'Luma 原创反应小游戏',
    title: '快速点中目标，20 秒看你能拿几分',
    description:
      '这是 Luma 自制的轻量反应挑战，不是 Roblox 官方游戏副本，也不需要下载或登录。',
    start: '开始挑战',
    restart: '再来一局',
    score: '得分',
    time: '剩余时间',
    best: '最高分',
    ready: '准备好了吗？',
    finished: '时间到',
    target: '点击目标',
    tapHint: '点击或轻触彩色目标',
    targetAria: '点击彩色目标得分',
    seconds: '秒',
    points: '分',
  },
  en: {
    eyebrow: 'Luma Original Reflex Game',
    title:
      'Hit the target fast and score as many points as you can in 20 seconds',
    description:
      'This is an original Luma reflex challenge, not a copy of the official Roblox experience. No download or login is required.',
    start: 'Start challenge',
    restart: 'Play again',
    score: 'Score',
    time: 'Time left',
    best: 'Best',
    ready: 'Ready?',
    finished: 'Time up',
    target: 'Hit target',
    tapHint: 'Click or tap the colored target',
    targetAria: 'Hit the colored target to score',
    seconds: 'sec',
    points: 'pts',
  },
} as const;

function makeTarget(seed: number): TargetPosition {
  const wave = (value: number) => (Math.sin(value) + 1) / 2;

  return {
    x: 16 + wave(seed * 1.71 + 0.4) * 68,
    y: 18 + wave(seed * 2.23 + 1.1) * 64,
    hue: Math.round(wave(seed * 0.93 + 2.3) * 120) + 12,
  };
}

export function BrainrotReflexGame({ locale }: BrainrotReflexGameProps) {
  const text = copy[locale];
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [bestScore, setBestScore] = useState(0);
  const [target, setTarget] = useState<TargetPosition>(() => makeTarget(1));
  const scoreRef = useRef(0);

  useEffect(() => {
    try {
      const storedBest = window.localStorage.getItem(
        'luma-brainrot-reflex-best'
      );
      const parsedBest = storedBest ? Number(storedBest) : 0;
      if (Number.isFinite(parsedBest) && parsedBest > 0) {
        setBestScore(parsedBest);
      }
    } catch {
      // The game remains playable when browser storage is disabled.
    }
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = window.setInterval(() => {
      setTimeLeft(current => {
        if (current <= 1) {
          setGameState('finished');
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'finished') return;

    trackInteraction('brainrot_reflex_game_finished', {
      source: 'steal_a_brainrot_unblocked_experiment',
      locale,
      score: scoreRef.current,
      round_seconds: ROUND_SECONDS,
    });
  }, [gameState, locale]);

  const startGame = () => {
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setTarget(makeTarget((Date.now() % 1000) + 1));
    setGameState('playing');
    trackInteraction('brainrot_reflex_game_started', {
      source: 'steal_a_brainrot_unblocked_experiment',
      locale,
      round_seconds: ROUND_SECONDS,
    });
  };

  const hitTarget = () => {
    if (gameState !== 'playing') return;

    const nextScore = scoreRef.current + 1;
    scoreRef.current = nextScore;
    setScore(nextScore);
    setTarget(makeTarget(nextScore + Date.now() / 1000));

    if (nextScore > bestScore) {
      setBestScore(nextScore);
      try {
        window.localStorage.setItem(
          'luma-brainrot-reflex-best',
          String(nextScore)
        );
      } catch {
        // A private or restricted browser can still play without saving a best score.
      }
    }
  };

  const statusText =
    gameState === 'finished'
      ? `${text.finished}: ${score} ${text.points}`
      : gameState === 'playing'
        ? `${timeLeft} ${text.seconds}`
        : text.ready;

  return (
    <section
      aria-labelledby="brainrot-reflex-title"
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl"
    >
      <div className="flex flex-col gap-5 border-b border-slate-800 p-5 sm:p-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
            <Zap aria-hidden="true" className="h-4 w-4" />
            {text.eyebrow}
          </p>
          <h2
            id="brainrot-reflex-title"
            className="mt-3 text-2xl font-black sm:text-3xl"
          >
            {text.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            {text.description}
          </p>
        </div>
        <button
          type="button"
          onClick={gameState === 'playing' ? undefined : startGame}
          disabled={gameState === 'playing'}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
        >
          {gameState === 'finished' ? (
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Play aria-hidden="true" className="h-4 w-4" />
          )}
          {gameState === 'finished' ? text.restart : text.start}
        </button>
      </div>

      <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900/80">
        <div className="p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {text.score}
          </p>
          <p className="mt-1 text-2xl font-black tabular-nums text-amber-300">
            {score}
          </p>
        </div>
        <div className="p-4 text-center">
          <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
            {text.time}
          </p>
          <p className="mt-1 text-2xl font-black tabular-nums text-cyan-300">
            {timeLeft}
          </p>
        </div>
        <div className="p-4 text-center">
          <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Trophy aria-hidden="true" className="h-3.5 w-3.5" />
            {text.best}
          </p>
          <p className="mt-1 text-2xl font-black tabular-nums text-emerald-300">
            {bestScore}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 md:aspect-[16/9]"
          aria-label={text.tapHint}
        >
          {gameState === 'playing' ? (
            <button
              type="button"
              onClick={hitTarget}
              aria-label={text.targetAria}
              className="absolute flex aspect-square w-[clamp(3.5rem,11vw,5rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/80 text-[0.65rem] font-black uppercase tracking-wide text-slate-950 shadow-[0_0_0_8px_rgba(251,191,36,0.14),0_12px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                backgroundColor: `hsl(${target.hue} 92% 68%)`,
              }}
            >
              <Target aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">{text.target}</span>
            </button>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <Target aria-hidden="true" className="h-10 w-10 text-amber-300" />
              <p className="mt-4 text-xl font-bold text-white">{statusText}</p>
              <p className="mt-2 text-sm text-slate-400">{text.tapHint}</p>
            </div>
          )}
        </div>
        <p
          className="mt-3 text-center text-sm text-slate-400"
          aria-live="polite"
        >
          {statusText}
        </p>
      </div>
    </section>
  );
}
