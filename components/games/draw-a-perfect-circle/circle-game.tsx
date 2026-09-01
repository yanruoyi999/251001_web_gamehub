'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

export interface CirclePoint {
  x: number;
  y: number;
}

export interface CircleResult {
  totalScore: number;
  closureScore: number;
  roundnessScore: number;
  smoothnessScore: number;
  explanation: string;
}

interface SampleCircleOptions {
  centerX: number;
  centerY: number;
  radius: number;
  samples: number;
}

const EMPTY_RESULT: CircleResult = {
  totalScore: 0,
  closureScore: 0,
  roundnessScore: 0,
  smoothnessScore: 0,
  explanation: 'Draw a closed loop to see your score.',
};

function clampScore(value: number) {
  return Math.round(Math.max(0, Math.min(100, value)));
}

function distance(left: CirclePoint, right: CirclePoint) {
  return Math.hypot(right.x - left.x, right.y - left.y);
}

function mean(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function sampleCirclePoints({
  centerX,
  centerY,
  radius,
  samples,
}: SampleCircleOptions): CirclePoint[] {
  if (!Number.isSafeInteger(samples) || samples < 8 || radius <= 0) return [];
  return Array.from({ length: samples }, (_, index) => {
    const angle = (index / (samples - 1)) * Math.PI * 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });
}

export function evaluateCircle(points: CirclePoint[]): CircleResult {
  if (points.length < 8) return EMPTY_RESULT;

  const center = {
    x: mean(points.map((point) => point.x)),
    y: mean(points.map((point) => point.y)),
  };
  const radii = points.map((point) => distance(point, center));
  const averageRadius = mean(radii);
  if (!Number.isFinite(averageRadius) || averageRadius < 4) return EMPTY_RESULT;

  const closureRatio = distance(points[0], points.at(-1)!) / averageRadius;
  const radiusDeviation = mean(
    radii.map((radius) => Math.abs(radius - averageRadius)),
  ) / averageRadius;
  const segmentLengths = points
    .slice(1)
    .map((point, index) => distance(points[index], point));
  const averageSegment = mean(segmentLengths);
  const segmentDeviation = averageSegment > 0
    ? mean(segmentLengths.map((length) => Math.abs(length - averageSegment))) / averageSegment
    : 1;

  const closureScore = clampScore(100 - closureRatio * 72);
  const roundnessScore = clampScore(100 - radiusDeviation * 260);
  const smoothnessScore = clampScore(100 - segmentDeviation * 210);
  const totalScore = clampScore(
    closureScore * 0.35 + roundnessScore * 0.4 + smoothnessScore * 0.25,
  );

  const explanation = totalScore >= 90
    ? 'Excellent: the loop is closed, round, and smooth.'
    : totalScore >= 70
      ? 'Good circle. Use the detail scores to make the next loop more closed, round, and smooth.'
      : 'Keep the loop closed, hold a steadier radius, and draw with a smoother pace.';

  return {
    totalScore,
    closureScore,
    roundnessScore,
    smoothnessScore,
    explanation,
  };
}

function canvasPoint(
  event: ReactPointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
): CirclePoint {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
    y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
  };
}

export function CircleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<CirclePoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [result, setResult] = useState<CircleResult>(EMPTY_RESULT);
  const [inputType, setInputType] = useState('pointer');

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#071526';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#1d3b55';
    context.lineWidth = 2;
    context.setLineDash([8, 10]);
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.31, 0, Math.PI * 2);
    context.stroke();
    context.setLineDash([]);

    if (points.length < 2) return;
    context.strokeStyle = '#67e8f9';
    context.lineWidth = 7;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) context.lineTo(point.x, point.y);
    context.stroke();
  }, [points]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const reset = (nextAttempt = attempt) => {
    setPoints([]);
    setResult(EMPTY_RESULT);
    setIsDrawing(false);
    setAttempt(nextAttempt);
  };

  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!event.isPrimary) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setInputType(event.pointerType || 'pointer');
    setPoints([canvasPoint(event, event.currentTarget)]);
    setResult(EMPTY_RESULT);
    setIsDrawing(true);
  };

  const continueDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !event.isPrimary) return;
    const point = canvasPoint(event, event.currentTarget);
    setPoints((current) => {
      const last = current.at(-1);
      if (last && distance(last, point) < 2.5) return current;
      return [...current, point];
    });
  };

  const finishDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !event.isPrimary) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDrawing(false);
    setPoints((current) => {
      setResult(evaluateCircle(current));
      return current;
    });
  };

  return (
    <section
      aria-labelledby="circle-game-title"
      className="overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-950 text-white shadow-2xl shadow-cyan-950/40"
      data-circle-game
    >
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:p-8">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Attempt {attempt} · {inputType}
              </p>
              <h2 id="circle-game-title" className="mt-1 text-xl font-black sm:text-2xl">
                Draw one continuous loop
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => reset()}
                className="min-h-11 rounded-xl border border-slate-600 px-4 py-2 font-semibold text-slate-100 hover:border-cyan-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => reset(attempt + 1)}
                className="min-h-11 rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100"
              >
                Try again
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={720}
            height={720}
            aria-label="Circle drawing canvas. Draw with a mouse, touch, or pen."
            onPointerDown={startDrawing}
            onPointerMove={continueDrawing}
            onPointerUp={finishDrawing}
            onPointerCancel={finishDrawing}
            style={{ touchAction: 'none' }}
            className="aspect-square w-full max-w-[720px] cursor-crosshair rounded-2xl border border-slate-700 bg-[#071526] shadow-inner focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/60"
          />
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Mouse, touch, and pen are supported. Lift after closing the loop to score it.
          </p>
        </div>

        <aside aria-live="polite" className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Local score</p>
          <p className="mt-2 text-6xl font-black tabular-nums text-cyan-300">{result.totalScore}</p>
          <p className="mt-3 text-sm leading-6 text-slate-200">{result.explanation}</p>
          <dl className="mt-6 space-y-4">
            {[
              ['Closure', result.closureScore],
              ['Roundness', result.roundnessScore],
              ['Smoothness', result.smoothnessScore],
            ].map(([label, score]) => (
              <div key={label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <dt className="font-semibold text-slate-200">{label}</dt>
                  <dd className="font-bold tabular-nums text-white">{score}/100</dd>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full rounded-full bg-cyan-300" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </dl>
          <p className="mt-6 rounded-xl bg-emerald-400/10 p-3 text-xs leading-5 text-emerald-200">
            Your stroke stays in this tab and is discarded when you reset or leave.
          </p>
        </aside>
      </div>
    </section>
  );
}
