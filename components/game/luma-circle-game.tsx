'use client';

import { RotateCcw, Share2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import {
  getCircleChallenge,
  getCircleDurationBucket,
  getUtcDateKey,
  scoreCircle,
  type CircleChallenge,
  type CircleDurationBucket,
  type CirclePoint,
  type CircleScore,
} from '@/lib/games/luma-circle';

type GameLocale = 'zh' | 'en';
type CircleMode = 'practice' | 'daily';
type CirclePhase = 'idle' | 'ready' | 'drawing' | 'result';
type CircleResult = CircleScore & { durationBucket: CircleDurationBucket };

const PRACTICE_RADIUS = 0.32;
const PRACTICE_BEST_KEY = 'luma-circle-practice-best';

const copy = {
  en: {
    eyebrow: 'Luma original drawing game',
    title: 'Draw a perfect circle',
    intro: 'Draw one continuous circle, get a geometry-based score, and try again without an account or upload.',
    practice: 'Practice',
    daily: 'UTC daily challenge',
    start: 'Start drawing',
    drawHint: 'Press and hold, then draw one smooth loop around the dot.',
    score: 'Score',
    roundness: 'Roundness',
    closure: 'Closure',
    smoothness: 'Smoothness',
    coverage: 'Coverage',
    best: 'Best',
    retry: 'Try again',
    share: 'Share score',
    shareCopied: 'Score link copied',
    shareUnavailable: 'Copy is unavailable',
    dailyDate: 'Challenge date',
    points: 'points',
    originalNote: 'Luma Circle is an original Luma Game Hub experiment. Your drawing stays in this browser and is never uploaded.',
    resultHint: 'A higher score needs a complete loop, steady spacing, and a clean finish near the starting point.',
    canvasLabel: 'Circle drawing canvas',
    modeHint: 'Practice uses a stable target. Daily uses one UTC challenge target for everyone on the same UTC date.',
  },
  zh: {
    eyebrow: 'Luma 原创绘图游戏',
    title: '画一个完美的圆',
    intro: '一笔画完一个圆，获得基于几何分析的分数；无需注册，不上传轨迹，画完可以立即重试。',
    practice: '练习模式',
    daily: 'UTC 每日挑战',
    start: '开始绘制',
    drawHint: '按住并围绕圆点平滑画一圈，尽量不要中途修正。',
    score: '总分',
    roundness: '圆度',
    closure: '闭合度',
    smoothness: '平滑度',
    coverage: '覆盖度',
    best: '最高分',
    retry: '再画一次',
    share: '分享成绩',
    shareCopied: '成绩链接已复制',
    shareUnavailable: '当前无法复制',
    dailyDate: '挑战日期',
    points: '个采样点',
    originalNote: 'Luma Circle 是 Luma Game Hub 的原创实验。你的绘图只保存在当前浏览器，不会上传。',
    resultHint: '想获得高分，需要完整闭合、间距稳定，并在接近起点的位置结束。',
    canvasLabel: '画圆画布',
    modeHint: '练习模式使用稳定目标；每日挑战按 UTC 日期生成，同一 UTC 日期的玩家看到相同目标。',
  },
} as const;

function getCanvasPoint(event: ReactPointerEvent<HTMLCanvasElement>): CirclePoint {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
  };
}

function getScoreBucket(score: number) {
  if (score >= 90) return '90-100';
  if (score >= 75) return '75-89';
  if (score >= 50) return '50-74';
  return '0-49';
}

function getBestKey(mode: CircleMode, dateKey: string) {
  return mode === 'daily' ? `luma-circle-daily-${dateKey}` : PRACTICE_BEST_KEY;
}

function drawCircleCanvas(
  canvas: HTMLCanvasElement,
  challenge: CircleChallenge,
  mode: CircleMode,
  points: CirclePoint[],
  drawing: boolean,
) {
  const width = canvas.clientWidth || 600;
  const height = canvas.clientHeight || 600;
  const context = canvas.getContext('2d');
  if (!context) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.max(1, Math.round(width * dpr));
  const pixelHeight = Math.max(1, Math.round(height * dpr));
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#07141a';
  context.fillRect(0, 0, width, height);

  const size = Math.min(width, height);
  const centerX = width * challenge.center.x;
  const centerY = height * challenge.center.y;
  const radius = size * (mode === 'daily' ? challenge.radius : PRACTICE_RADIUS);

  context.save();
  context.setLineDash([8, 9]);
  context.strokeStyle = 'rgba(139, 246, 191, 0.55)';
  context.lineWidth = 2;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.stroke();
  context.restore();

  context.fillStyle = '#ffc857';
  context.beginPath();
  context.arc(centerX, centerY, 4, 0, Math.PI * 2);
  context.fill();

  if (points.length < 1) return;
  context.strokeStyle = drawing ? '#ffffff' : '#6ee7b7';
  context.lineWidth = 4;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.beginPath();
  points.forEach((point, index) => {
    const x = point.x * width;
    const y = point.y * height;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
}

export function LumaCircleGame({ locale }: { locale: GameLocale }) {
  const content = copy[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<CirclePoint[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const inputTypeRef = useRef('unknown');
  const challengeKeyRef = useRef(getUtcDateKey());
  const [mode, setMode] = useState<CircleMode>('practice');
  const [phase, setPhase] = useState<CirclePhase>('idle');
  const [result, setResult] = useState<CircleResult | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [shareMessage, setShareMessage] = useState('');
  const challenge = useMemo(
    () => getCircleChallenge(challengeKeyRef.current),
    [],
  );

  const redraw = useCallback(() => {
    if (!canvasRef.current) return;
    drawCircleCanvas(
      canvasRef.current,
      challenge,
      mode,
      pointsRef.current,
      phase === 'drawing',
    );
  }, [challenge, mode, phase]);

  useEffect(() => {
    trackInteraction('circle_game_ready', {
      game_slug: 'luma-circle',
      mode: 'practice',
      challenge_date: challengeKeyRef.current,
    });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(redraw);
    resizeObserver.observe(canvas);
    redraw();
    return () => resizeObserver.disconnect();
  }, [redraw]);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(getBestKey(mode, challenge.dateKey)));
    setBestScore(Number.isFinite(stored) ? stored : 0);
    redraw();
  }, [challenge.dateKey, mode, redraw]);

  const resetDrawing = useCallback(() => {
    pointsRef.current = [];
    startedAtRef.current = null;
    setResult(null);
    setShareMessage('');
    setPhase('idle');
  }, []);

  const selectMode = useCallback(
    (nextMode: CircleMode) => {
      if (nextMode === mode) return;
      trackInteraction('circle_mode_change', {
        game_slug: 'luma-circle',
        mode: nextMode,
        challenge_date: challenge.dateKey,
      });
      setMode(nextMode);
      resetDrawing();
    },
    [challenge.dateKey, mode, resetDrawing],
  );

  const startDrawing = useCallback(() => {
    setShareMessage('');
    setResult(null);
    setPhase('ready');
    trackInteraction('circle_game_start', {
      game_slug: 'luma-circle',
      mode,
      challenge_date: challenge.dateKey,
    });
  }, [challenge.dateKey, mode]);

  const finishDrawing = useCallback(() => {
    if (phase !== 'drawing') return;
    const score = scoreCircle(pointsRef.current);
    const durationMs =
      startedAtRef.current === null ? null : performance.now() - startedAtRef.current;
    const durationBucket = getCircleDurationBucket(durationMs);
    const nextResult = { ...score, durationBucket };
    setResult(nextResult);
    setPhase('result');

    const scoreBucket = getScoreBucket(score.score);
    trackInteraction('circle_draw_complete', {
      game_slug: 'luma-circle',
      mode,
      challenge_date: challenge.dateKey,
      score_bucket: scoreBucket,
      duration_bucket: durationBucket,
      input_type: inputTypeRef.current,
    });
    if (mode === 'daily') {
      trackInteraction('circle_daily_complete', {
        game_slug: 'luma-circle',
        challenge_date: challenge.dateKey,
        score_bucket: scoreBucket,
      });
    }

    if (score.score > bestScore) {
      setBestScore(score.score);
      window.localStorage.setItem(getBestKey(mode, challenge.dateKey), String(score.score));
    }
  }, [bestScore, challenge.dateKey, mode, phase]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (phase !== 'ready') return;
      event.currentTarget.setPointerCapture(event.pointerId);
      pointsRef.current = [getCanvasPoint(event)];
      startedAtRef.current = performance.now();
      inputTypeRef.current = event.pointerType || 'unknown';
      setPhase('drawing');
      trackInteraction('circle_draw_start', {
        game_slug: 'luma-circle',
        mode,
        challenge_date: challenge.dateKey,
        input_type: inputTypeRef.current,
      });
      redraw();
    },
    [challenge.dateKey, mode, phase, redraw],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (phase !== 'drawing') return;
      pointsRef.current.push(getCanvasPoint(event));
      redraw();
    },
    [phase, redraw],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (phase !== 'drawing') return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      finishDrawing();
    },
    [finishDrawing, phase],
  );

  const shareScore = useCallback(async () => {
    if (!result) return;
    const scoreBucket = getScoreBucket(result.score);
    const text =
      locale === 'zh'
        ? `我在 Luma Circle 得到了 ${scoreBucket} 分段的成绩。`
        : `I scored in the ${scoreBucket} range on Luma Circle.`;
    let method = 'copy';
    try {
      if (navigator.share) {
        await navigator.share({ title: content.title, text, url: window.location.href });
        method = 'native';
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      }
      setShareMessage(content.shareCopied);
    } catch {
      setShareMessage(content.shareUnavailable);
      method = 'failed';
    }
    trackInteraction('circle_share', {
      game_slug: 'luma-circle',
      mode,
      score_bucket: scoreBucket,
      method,
    });
  }, [content, locale, mode, result]);

  const modeLabel = mode === 'daily' ? content.daily : content.practice;

  return (
    <section className="space-y-4" aria-labelledby="luma-circle-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{modeLabel}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {content.dailyDate}: {challenge.dateKey}
          </p>
        </div>
        <div className="inline-flex rounded-md border border-border bg-card p-1" aria-label={content.modeHint}>
          <button
            type="button"
            className={`min-h-10 rounded px-3 py-2 text-sm font-semibold ${mode === 'practice' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            aria-pressed={mode === 'practice'}
            onClick={() => selectMode('practice')}
          >
            {content.practice}
          </button>
          <button
            type="button"
            className={`min-h-10 rounded px-3 py-2 text-sm font-semibold ${mode === 'daily' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            aria-pressed={mode === 'daily'}
            onClick={() => selectMode('daily')}
          >
            {content.daily}
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#07141a] shadow-2xl shadow-slate-950/20" data-circle-stage="true" data-circle-phase={phase}>
        <canvas
          ref={canvasRef}
          className="block aspect-square min-h-[300px] w-full touch-none sm:min-h-[520px]"
          aria-label={content.canvasLabel}
          data-circle-canvas="true"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {phase === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/25 p-6 text-center text-white">
            <div className="max-w-sm">
              <p className="text-sm leading-6 text-slate-200">{content.drawHint}</p>
              <button
                type="button"
                className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-px"
                onClick={startDrawing}
                data-circle-play="true"
              >
                {content.start}
              </button>
            </div>
          </div>
        )}

        {phase === 'ready' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-slate-950/65 px-4 py-3 text-center text-sm font-semibold text-white">
            {content.drawHint}
          </div>
        )}

        {phase === 'result' && result && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/75 p-6 text-center text-white backdrop-blur-sm">
            <div className="w-full max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-200">{content.score}</p>
              <p className="mt-2 text-6xl font-bold tabular-nums">{result.score}</p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-left sm:grid-cols-4">
                {[
                  [content.roundness, result.roundness],
                  [content.closure, result.closure],
                  [content.smoothness, result.smoothness],
                  [content.coverage, result.coverage],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
                    <p className="mt-1 text-lg font-bold tabular-nums">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{content.resultHint}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  onClick={() => {
                    trackInteraction('circle_retry', { game_slug: 'luma-circle', mode });
                    resetDrawing();
                  }}
                  data-circle-retry="true"
                >
                  <RotateCcw aria-hidden="true" size={17} />
                  {content.retry}
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-emerald-300/60 px-4 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-emerald-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                  onClick={shareScore}
                >
                  <Share2 aria-hidden="true" size={17} />
                  {content.share}
                </button>
              </div>
              {shareMessage && <p className="mt-3 text-xs text-emerald-200" role="status">{shareMessage}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          {content.best}: <span className="font-semibold text-foreground" data-circle-best="true">{bestScore}</span> · {content.points}: {pointsRef.current.length}
        </p>
        <p className="max-w-xl text-right">{content.modeHint}</p>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{content.originalNote}</p>
    </section>
  );
}
