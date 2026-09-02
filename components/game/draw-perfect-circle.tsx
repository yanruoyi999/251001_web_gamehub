'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import {
  buildDrawShareResult,
  calculateDailyStreak,
  getDailyShape,
  scoreDrawingStroke,
  type DrawingScore,
  type DrawingPoint,
  type DrawingShape,
} from '@/lib/games/draw-perfect-circle';
import { useHydrated } from '@/lib/react/use-hydrated';

const SHAPES: DrawingShape[] = ['circle', 'square', 'triangle', 'spiral'];

function shanghaiDateKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function scoreBucket(score: number) {
  if (score >= 90) return '90-100';
  if (score >= 75) return '75-89';
  if (score >= 50) return '50-74';
  return '0-49';
}

function drawGuide(context: CanvasRenderingContext2D, shape: DrawingShape, width: number, height: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.29;
  context.save();
  context.strokeStyle = '#475569';
  context.lineWidth = 3;
  context.setLineDash([10, 10]);
  context.beginPath();
  if (shape === 'circle') context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  if (shape === 'square') context.rect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  if (shape === 'triangle') {
    context.moveTo(centerX, centerY - radius);
    context.lineTo(centerX + radius, centerY + radius);
    context.lineTo(centerX - radius, centerY + radius);
    context.closePath();
  }
  if (shape === 'spiral') {
    for (let index = 0; index <= 90; index += 1) {
      const angle = index * 0.16;
      const spiralRadius = (radius * index) / 90;
      const x = centerX + Math.cos(angle) * spiralRadius;
      const y = centerY + Math.sin(angle) * spiralRadius;
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
  }
  context.stroke();
  context.restore();
}

const copy = {
  en: {
    practice: 'Practice', daily: 'Daily', start: 'Start drawing', submit: 'Score stroke', undo: 'Undo stroke', restart: 'Restart', share: 'Share result',
    roundness: 'Roundness', shapeMatch: 'Shape match', closure: 'Closure', endpointFit: 'Endpoint fit', centering: 'Centering', best: 'Local best', streak: 'Daily streak', hint: 'Follow the guide in one steady stroke.', ready: 'Choose a mode, then draw inside the canvas.', review: 'Review your line, then score it or undo.',
  },
  zh: {
    practice: '自由练习', daily: '每日挑战', start: '开始绘图', submit: '计算分数', undo: '撤销轨迹', restart: '重新开始', share: '分享结果',
    roundness: '圆度', shapeMatch: '图形匹配', closure: '闭合度', endpointFit: '端点匹配', centering: '居中度', best: '本地最高分', streak: '连续天数', hint: '沿辅助线保持一笔匀速。', ready: '选择模式，然后在画布中绘图。', review: '检查轨迹，再计算分数或撤销。',
  },
} as const;

export function DrawPerfectCircle({ locale }: { locale: 'en' | 'zh' }) {
  const hydrated = useHydrated();
  const text = copy[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const pointsRef = useRef<DrawingPoint[]>([]);
  const [points, setPoints] = useState<DrawingPoint[]>([]);
  const [mode, setMode] = useState<'practice' | 'daily'>('practice');
  const [shape, setShape] = useState<DrawingShape>('circle');
  const [score, setScore] = useState<DrawingScore | null>(null);
  const [inputType, setInputType] = useState('mouse');
  const [best, setBest] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    try {
      setBest(Number(window.localStorage.getItem('luma-draw-perfect-circle:best')) || 0);
      const completions = JSON.parse(window.localStorage.getItem('luma-draw-perfect-circle:daily') || '[]') as string[];
      setStreak(calculateDailyStreak(completions, shanghaiDateKey()));
    } catch {
      setBest(0);
      setStreak(0);
    }
  }, [hydrated]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#020617';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawGuide(context, shape, canvas.width, canvas.height);
    if (points.length > 0) {
      context.strokeStyle = '#22d3ee';
      context.lineWidth = 7;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.setLineDash([]);
      context.beginPath();
      points.forEach((point, index) => index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y));
      context.stroke();
    }
  }, [points, shape]);

  useEffect(() => paint(), [paint]);

  function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * canvas.width, y: ((event.clientY - rect.top) / rect.height) * canvas.height };
  }

  function beginStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!hydrated) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const nextPoint = pointFromEvent(event);
    drawingRef.current = true;
    pointsRef.current = [nextPoint];
    setPoints([nextPoint]);
    setScore(null);
    setInputType(event.pointerType || 'mouse');
    trackInteraction('game_start', { game_slug: 'draw_a_perfect_circle', mode, shape });
    trackInteraction('stroke_start', { game_slug: 'draw_a_perfect_circle', input_type: event.pointerType || 'mouse' });
  }

  function extendStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const next = [...pointsRef.current, pointFromEvent(event)];
    pointsRef.current = next;
    setPoints(next);
  }

  function finishStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    trackInteraction('stroke_submit', { game_slug: 'draw_a_perfect_circle', input_type: inputType, shape });
  }

  function submitScore() {
    const canvas = canvasRef.current;
    if (!canvas || points.length < 8) return;
    const nextScore = scoreDrawingStroke(
      points,
      { width: canvas.width, height: canvas.height },
      shape,
    );
    if (!nextScore.valid) return;
    setScore(nextScore);
    const bucket = scoreBucket(nextScore.total);
    trackInteraction('score_shown', { game_slug: 'draw_a_perfect_circle', score_bucket: bucket, input_type: inputType, shape });
    if (nextScore.total > best) {
      setBest(nextScore.total);
      try { window.localStorage.setItem('luma-draw-perfect-circle:best', String(nextScore.total)); } catch {}
    }
    if (mode === 'daily') {
      const today = shanghaiDateKey();
      try {
        const saved = JSON.parse(window.localStorage.getItem('luma-draw-perfect-circle:daily') || '[]') as string[];
        const completions = [...new Set([...saved, today])].slice(-14);
        window.localStorage.setItem('luma-draw-perfect-circle:daily', JSON.stringify(completions));
        setStreak(calculateDailyStreak(completions, today));
      } catch {}
      trackInteraction('daily_complete', { game_slug: 'draw_a_perfect_circle', score_bucket: bucket, shape });
    }
  }

  function reset() {
    pointsRef.current = [];
    setPoints([]);
    setScore(null);
    trackInteraction('restart', { game_slug: 'draw_a_perfect_circle', mode, shape });
  }

  async function shareResult() {
    if (!score) return;
    const value = buildDrawShareResult({
      shape,
      scoreBucket: scoreBucket(score.total),
      challengeId: mode === 'daily' ? `${shanghaiDateKey()}:${shape}` : undefined,
      pageUrl: window.location.href,
    });
    try {
      const canvas = canvasRef.current;
      const blob = canvas
        ? await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
        : null;
      const file = blob ? new File([blob], `luma-${shape}.png`, { type: 'image/png' }) : null;
      if (file && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Luma drawing result', text: value, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: 'Luma drawing result', text: value });
      } else {
        await navigator.clipboard?.writeText(value);
      }
    } catch {}
    trackInteraction('share_result', { game_slug: 'draw_a_perfect_circle', score_bucket: scoreBucket(score.total), shape });
  }

  function selectMode(nextMode: 'practice' | 'daily') {
    setMode(nextMode);
    const nextShape = nextMode === 'daily' ? getDailyShape(shanghaiDateKey()) : 'circle';
    setShape(nextShape);
    reset();
  }

  return (
    <section data-draw-perfect-circle data-interactive-ready={hydrated} aria-busy={!hydrated} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-xl">
      <header className="border-b border-slate-800 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Precision studio</p><h2 className="mt-1 text-2xl font-black">{text.start}</h2></div>
          <div className="flex gap-2" aria-label="Challenge mode">
            {(['practice', 'daily'] as const).map((value) => <button key={value} type="button" disabled={!hydrated} aria-pressed={mode === value} onClick={() => selectMode(value)} className="min-h-11 rounded-full border border-slate-600 px-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">{value === 'practice' ? text.practice : text.daily}</button>)}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Shape">
          {SHAPES.map((value) => <button key={value} type="button" disabled={!hydrated || mode === 'daily'} aria-pressed={shape === value} onClick={() => { setShape(value); reset(); trackInteraction('shape_select', { game_slug: 'draw_a_perfect_circle', shape: value }); }} className="min-h-11 rounded-lg border border-slate-700 px-3 capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:opacity-50">{value}</button>)}
        </div>
      </header>
      <div className="p-3 sm:p-6">
        <canvas ref={canvasRef} width={600} height={400} aria-label="Drawing canvas" className="aspect-[3/2] w-full touch-none rounded-xl border border-slate-700 bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300" onPointerDown={beginStroke} onPointerMove={extendStroke} onPointerUp={finishStroke} onPointerCancel={finishStroke} />
        <p className="mt-3 min-h-6 text-sm text-slate-300" aria-live="polite">{score ? `${score.total}/100` : points.length > 0 ? text.review : text.ready} · {text.hint}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button type="button" disabled={!hydrated || points.length < 8 || Boolean(score)} onClick={submitScore} className="min-h-12 rounded-lg bg-cyan-300 px-3 font-bold text-slate-950 disabled:opacity-40">{text.submit}</button>
          <button type="button" disabled={!hydrated || points.length === 0 || Boolean(score)} onClick={reset} className="min-h-12 rounded-lg border border-slate-600 px-3 font-semibold disabled:opacity-40">{text.undo}</button>
          <button type="button" disabled={!hydrated} onClick={reset} className="min-h-12 rounded-lg border border-slate-600 px-3 font-semibold disabled:opacity-40">{text.restart}</button>
          <button type="button" disabled={!score} onClick={shareResult} className="min-h-12 rounded-lg border border-slate-600 px-3 font-semibold disabled:opacity-40">{text.share}</button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-slate-800 sm:grid-cols-5">
          {[[shape === 'circle' ? text.roundness : text.shapeMatch, score?.shapeMatch ?? '—'], [shape === 'spiral' ? text.endpointFit : text.closure, score?.pathScore ?? '—'], [text.centering, score?.centering ?? '—'], [text.best, best], [text.streak, streak]].map(([label, value]) => <div key={String(label)} className="bg-slate-900 p-3 text-center"><p className="text-xs uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-xl font-black text-cyan-300">{value}</p></div>)}
        </div>
      </div>
    </section>
  );
}
