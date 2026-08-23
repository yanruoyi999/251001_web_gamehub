'use client';

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import { getSnakeFeedbackTone, type SnakeFeedbackKind } from '@/lib/games/luma-snake-feedback';
import {
  createSnakeGameState,
  getDailyChallengeId,
  getFirstDeathDurationBucket,
  getFirstDeathDurationMs,
  getSnakeScoreMilestone,
  getSnakeStepMs,
  getSwipeDirection,
  getUtcChallengeKey,
  queueSnakeDirection,
  stepSnakeGame,
  type FirstDeathDurationBucket,
  type SnakeDirection,
  type SnakeGameState,
} from '@/lib/games/luma-snake-3d';

type GameLocale = 'zh' | 'en';
type GamePhase = 'idle' | 'loading' | 'playing' | 'paused' | 'dead' | 'error';
type SnakeControlType = 'keyboard' | 'touch-button' | 'swipe';
type ThreeModule = typeof import('three');
type ThreeMesh = import('three').Mesh;
type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

type SnakeSceneController = {
  start: () => void;
  stop: () => void;
  setPaused: (paused: boolean) => void;
  dispose: () => void;
};

const BEST_SCORE_STORAGE_KEY = 'luma-snake-3d-best-score';
const SOUND_STORAGE_KEY = 'luma-snake-3d-muted';

const copy = {
  en: {
    eyebrow: 'Luma original game',
    title: 'Snake Game 3D',
    intro:
      'A small 3D score chase with one shared UTC daily challenge. Play in the browser, keep your best score locally, and come back for a new board tomorrow.',
    daily: 'UTC daily challenge',
    score: 'Score',
    best: 'Best',
    play: 'Play now',
    loading: 'Building the 3D board...',
    paused: 'Paused',
    resume: 'Resume',
    retry: 'Play again',
    error: 'The game could not start in this browser.',
    retryLoad: 'Try loading again',
    controls: 'Controls',
    keyboard: 'Arrow keys or WASD',
    touch: 'Swipe or use touch arrows on mobile',
    fullscreen: 'Fullscreen',
    pause: 'Pause',
    mute: 'Mute sound',
    unmute: 'Turn sound on',
    firstDeath: 'First run length',
    firstDeathHint: 'Measured from Play to your first collision in this attempt.',
    duration: {
      'under-30s': 'Under 30 seconds',
      '30s-to-45s': '30 to 45 seconds',
      '45s-to-3m': '45 seconds to 3 minutes',
      '3m-to-5m': '3 to 5 minutes',
      'over-5m': 'Over 5 minutes',
      invalid: 'Not available yet',
    } satisfies Record<FirstDeathDurationBucket, string>,
    canvasLabel: 'Luma Snake 3D game board',
    readyHint: 'Collect the glowing food, leave room to turn, and avoid the walls and your tail.',
    originalNote:
      'Luma Snake 3D is an original Luma Game Hub browser game. It is not Google Snake, Hexanaut, Electron Dash, or an official version of another game.',
  },
  zh: {
    eyebrow: 'Luma 原创游戏',
    title: '3D 贪吃蛇在线玩',
    intro:
      '一款轻量 3D 刷分游戏，每位玩家共享同一个 UTC 每日挑战。无需下载，最高分保存在当前浏览器，明天会有新的挑战棋盘。',
    daily: 'UTC 每日挑战',
    score: '分数',
    best: '最高分',
    play: '开始游戏',
    loading: '正在生成 3D 棋盘……',
    paused: '已暂停',
    resume: '继续游戏',
    retry: '再来一局',
    error: '当前浏览器无法启动游戏。',
    retryLoad: '重新加载',
    controls: '操作',
    keyboard: '方向键或 WASD',
    touch: '手机可滑动或使用触控方向键',
    fullscreen: '全屏',
    pause: '暂停',
    mute: '静音',
    unmute: '打开声音',
    firstDeath: '首局时长',
    firstDeathHint: '从点击开始到本次首次碰撞的时间。',
    duration: {
      'under-30s': '少于 30 秒',
      '30s-to-45s': '30 到 45 秒',
      '45s-to-3m': '45 秒到 3 分钟',
      '3m-to-5m': '3 到 5 分钟',
      'over-5m': '超过 5 分钟',
      invalid: '暂未获取',
    } satisfies Record<FirstDeathDurationBucket, string>,
    canvasLabel: 'Luma 3D 贪吃蛇游戏棋盘',
    readyHint: '吃掉发光食物，提前留出转弯空间，避开墙壁和自己的身体。',
    originalNote:
      'Luma Snake 3D 是 Luma Game Hub 的原创浏览器游戏，不是 Google Snake、Hexanaut、Electron Dash 或其他游戏的官方版本。',
  },
} as const;

function pointToWorld(point: { x: number; z: number }, gridSize: number) {
  const offset = (gridSize - 1) / 2;
  return { x: point.x - offset, z: point.z - offset };
}

function interpolate(from: number, to: number, alpha: number) {
  return from + (to - from) * alpha;
}

async function createSnakeScene(
  canvas: HTMLCanvasElement,
  initialState: SnakeGameState,
  consumeDirection: () => SnakeDirection,
  onState: (state: SnakeGameState) => void
): Promise<SnakeSceneController> {
  const THREE: ThreeModule = await import('three');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#07141a');

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, initialState.gridSize * 1.15, initialState.gridSize * 1.15);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;

  const ambientLight = new THREE.AmbientLight(0xa8d8d0, 1.7);
  scene.add(ambientLight);
  const keyLight = new THREE.DirectionalLight(0x72f2a7, 2.8);
  keyLight.position.set(4, 12, 6);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const gridSize = initialState.gridSize;
  const floorGeometry = new THREE.PlaneGeometry(gridSize + 1, gridSize + 1);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b242c,
    roughness: 0.86,
    metalness: 0.08,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(gridSize, gridSize, 0x23545a, 0x12343c);
  grid.position.y = 0.015;
  scene.add(grid);

  const snakeGroup = new THREE.Group();
  scene.add(snakeGroup);
  const bodyGeometry = new THREE.BoxGeometry(0.78, 0.78, 0.78);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x39d98a,
    emissive: 0x0b5b43,
    emissiveIntensity: 0.8,
    roughness: 0.42,
    metalness: 0.18,
  });
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xb6ffcc,
    emissive: 0x18a76d,
    emissiveIntensity: 0.95,
    roughness: 0.32,
    metalness: 0.25,
  });
  const snakeMeshes: ThreeMesh[] = [];

  function ensureSnakeMesh(index: number) {
    const existing = snakeMeshes[index];
    if (existing) return existing;

    const mesh = new THREE.Mesh(
      bodyGeometry,
      index === 0 ? headMaterial : bodyMaterial
    );
    mesh.castShadow = true;
    snakeMeshes[index] = mesh;
    snakeGroup.add(mesh);
    return mesh;
  }

  const foodGeometry = new THREE.SphereGeometry(0.36, 16, 16);
  const foodMaterial = new THREE.MeshStandardMaterial({
    color: 0xffc857,
    emissive: 0xb76413,
    emissiveIntensity: 1.2,
    roughness: 0.3,
    metalness: 0.2,
  });
  const food = new THREE.Mesh(foodGeometry, foodMaterial);
  food.castShadow = true;
  scene.add(food);

  let previousState = initialState;
  let state = initialState;
  let frameId = 0;
  let lastTimestamp = performance.now();
  let accumulator = 0;
  let running = false;
  let manuallyPaused = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function renderState(
    fromState: SnakeGameState,
    nextState: SnakeGameState,
    timestamp: number,
    alpha: number
  ) {
    nextState.snake.forEach((segment, index) => {
      const mesh = ensureSnakeMesh(index);
      const previousSegment =
        fromState.snake[index] ?? fromState.snake[fromState.snake.length - 1] ?? segment;
      const fromWorld = pointToWorld(previousSegment, nextState.gridSize);
      const nextWorld = pointToWorld(segment, nextState.gridSize);
      mesh.position.set(
        interpolate(fromWorld.x, nextWorld.x, alpha),
        index === 0 ? 0.57 : 0.48,
        interpolate(fromWorld.z, nextWorld.z, alpha)
      );
      mesh.visible = true;
    });

    for (let index = nextState.snake.length; index < snakeMeshes.length; index += 1) {
      snakeMeshes[index].visible = false;
    }

    const foodWorld = pointToWorld(nextState.food, nextState.gridSize);
    food.position.set(
      foodWorld.x,
      0.68 + Math.sin(timestamp / 220) * 0.08,
      foodWorld.z
    );
    food.rotation.y = timestamp / 700;
    renderer.render(scene, camera);
  }

  function animate(timestamp: number) {
    if (!running) return;

    const elapsed = Math.min(timestamp - lastTimestamp, 250);
    lastTimestamp = timestamp;

    if (!manuallyPaused && !document.hidden) {
      accumulator += elapsed;
      let stepMs = getSnakeStepMs(state.score);

      while (accumulator >= stepMs && state.status === 'playing') {
        accumulator -= stepMs;
        previousState = state;
        state = stepSnakeGame({
          ...state,
          direction: consumeDirection(),
        });
        onState(state);
        stepMs = getSnakeStepMs(state.score);
      }
    }

    const renderStepMs = getSnakeStepMs(state.score);
    const alpha = Math.min(1, accumulator / renderStepMs);
    renderState(previousState, state, timestamp, alpha);

    if (state.status === 'playing') {
      frameId = requestAnimationFrame(animate);
    } else {
      running = false;
    }
  }

  function handleVisibilityChange() {
    lastTimestamp = performance.now();
    accumulator = 0;
    previousState = state;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  resize();
  renderState(state, state, performance.now(), 1);

  return {
    start() {
      if (running) return;
      running = true;
      lastTimestamp = performance.now();
      frameId = requestAnimationFrame(animate);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frameId);
    },
    setPaused(paused: boolean) {
      manuallyPaused = paused;
      lastTimestamp = performance.now();
      accumulator = 0;
      previousState = state;
    },
    dispose() {
      running = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      headMaterial.dispose();
      foodGeometry.dispose();
      foodMaterial.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      const gridMaterial = grid.material;
      if (Array.isArray(gridMaterial)) {
        gridMaterial.forEach((material) => material.dispose());
      } else {
        gridMaterial.dispose();
      }
      renderer.dispose();
    },
  };
}

function formatDuration(
  locale: GameLocale,
  bucket: FirstDeathDurationBucket
) {
  return copy[locale].duration[bucket];
}

export function LumaSnake3DGame({ locale }: { locale: GameLocale }) {
  const content = copy[locale];
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SnakeSceneController | null>(null);
  const gameStateRef = useRef<SnakeGameState | null>(null);
  const directionRef = useRef<SnakeDirection>({ x: 1, z: 0 });
  const queuedDirectionRef = useRef<SnakeDirection | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const firstDeathReportedRef = useRef(false);
  const firstMoveReportedRef = useRef(false);
  const attemptRef = useRef(0);
  const challengeIdRef = useRef('');
  const controlTypeRef = useRef<SnakeControlType | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const reducedMotionRef = useRef(false);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [challengeKey, setChallengeKey] = useState('');
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [muted, setMuted] = useState(false);
  const [visualFeedback, setVisualFeedback] = useState<SnakeFeedbackKind | null>(null);
  const [playToReadyMs, setPlayToReadyMs] = useState<number | null>(null);
  const [firstDeathBucket, setFirstDeathBucket] =
    useState<FirstDeathDurationBucket>('invalid');

  useEffect(() => {
    setChallengeKey(getUtcChallengeKey());
    const storedBest = Number(window.localStorage.getItem(BEST_SCORE_STORAGE_KEY));
    if (Number.isFinite(storedBest) && storedBest > 0) setBestScore(storedBest);
    setMuted(window.localStorage.getItem(SOUND_STORAGE_KEY) === 'true');

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReducedMotion = () => {
      reducedMotionRef.current = reducedMotionQuery.matches;
    };
    syncReducedMotion();
    reducedMotionQuery.addEventListener('change', syncReducedMotion);

    return () => {
      reducedMotionQuery.removeEventListener('change', syncReducedMotion);
      sceneRef.current?.dispose();
      sceneRef.current = null;
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (audioContextRef.current) void audioContextRef.current.close();
      audioContextRef.current = null;
    };
  }, []);

  const ensureAudioContext = useCallback(async () => {
    const AudioContextConstructor =
      window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!AudioContextConstructor) return null;

    let context = audioContextRef.current;
    if (!context || context.state === 'closed') {
      context = new AudioContextConstructor();
      audioContextRef.current = context;
    }

    if (context.state === 'suspended') {
      try {
        await context.resume();
      } catch {
        return null;
      }
    }
    return context;
  }, []);

  const playFeedback = useCallback(
    (kind: SnakeFeedbackKind) => {
      if (muted) return;
      const context = audioContextRef.current;
      if (!context || context.state !== 'running') return;

      const tone = getSnakeFeedbackTone(kind);
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const end = now + tone.durationMs / 1_000;

      oscillator.type = tone.type;
      oscillator.frequency.setValueAtTime(tone.frequencyHz, now);
      gain.gain.setValueAtTime(tone.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(end);
    },
    [muted]
  );

  const showVisualFeedback = useCallback((kind: SnakeFeedbackKind) => {
    if (reducedMotionRef.current) return;
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setVisualFeedback(kind);
    feedbackTimeoutRef.current = setTimeout(() => {
      setVisualFeedback(null);
      feedbackTimeoutRef.current = null;
    }, kind === 'game-over' ? 220 : 140);
  }, []);

  const handleDirection = useCallback(
    (next: SnakeDirection, controlType: SnakeControlType) => {
      if (phase !== 'playing' && phase !== 'paused') return;

      const queuedBefore = queuedDirectionRef.current;
      const queuedNext = queueSnakeDirection(
        directionRef.current,
        queuedBefore,
        next
      );
      queuedDirectionRef.current = queuedNext;

      const accepted = queuedBefore === null && queuedNext !== null;
      if (!accepted) return;

      controlTypeRef.current ??= controlType;
      if (!firstMoveReportedRef.current) {
        firstMoveReportedRef.current = true;
        trackInteraction('snake_first_move', {
          game_slug: 'snake-3d',
          challenge_id: challengeIdRef.current,
          attempt: attemptRef.current,
          control_type: controlType,
        });
      }
    },
    [phase]
  );

  const consumeDirection = useCallback(() => {
    if (queuedDirectionRef.current) {
      directionRef.current = queuedDirectionRef.current;
      queuedDirectionRef.current = null;
    }
    return directionRef.current;
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (phase !== 'playing' && phase !== 'paused') return;

      const directions: Record<string, SnakeDirection> = {
        ArrowUp: { x: 0, z: -1 },
        w: { x: 0, z: -1 },
        W: { x: 0, z: -1 },
        ArrowDown: { x: 0, z: 1 },
        s: { x: 0, z: 1 },
        S: { x: 0, z: 1 },
        ArrowLeft: { x: -1, z: 0 },
        a: { x: -1, z: 0 },
        A: { x: -1, z: 0 },
        ArrowRight: { x: 1, z: 0 },
        d: { x: 1, z: 0 },
        D: { x: 1, z: 0 },
      };
      const next = directions[event.key];
      if (!next) return;

      event.preventDefault();
      handleDirection(next, 'keyboard');
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirection, phase]);

  useEffect(() => {
    function handleDocumentVisibility() {
      if (!document.hidden || phase !== 'playing') return;

      sceneRef.current?.setPaused(true);
      setPhase('paused');
      trackInteraction('snake_3d_auto_pause', {
        game_slug: 'snake-3d',
        reason: 'document_hidden',
      });
    }

    document.addEventListener('visibilitychange', handleDocumentVisibility);
    return () => document.removeEventListener('visibilitychange', handleDocumentVisibility);
  }, [phase]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (phase !== 'playing' || event.pointerType === 'mouse') return;

      swipeStartRef.current = { x: event.clientX, y: event.clientY };
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is an enhancement; swipe calculation still works without it.
      }
    },
    [phase]
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      if (!start || phase !== 'playing') return;

      const next = getSwipeDirection(start, {
        x: event.clientX,
        y: event.clientY,
      });
      if (next) handleDirection(next, 'swipe');
    },
    [handleDirection, phase]
  );

  const handlePointerCancel = useCallback(() => {
    swipeStartRef.current = null;
  }, []);

  const startGame = useCallback(async () => {
    if (phase === 'loading') return;

    const isRetry = phase === 'dead';
    const currentChallengeKey = challengeKey || getUtcChallengeKey();
    const startedAt = performance.now();
    const nextAttempt = attemptRef.current + 1;
    attemptRef.current = nextAttempt;
    startedAtRef.current = startedAt;
    firstDeathReportedRef.current = false;
    firstMoveReportedRef.current = false;
    controlTypeRef.current = null;
    swipeStartRef.current = null;
    setChallengeKey(currentChallengeKey);
    setPhase('loading');
    setScore(0);
    setPlayToReadyMs(null);
    setFirstDeathBucket('invalid');

    if (!muted) void ensureAudioContext();

    if (isRetry) {
      trackInteraction('snake_retry', {
        game_slug: 'snake-3d',
        attempt: nextAttempt,
      });
    }

    const initialState = createSnakeGameState({
      challengeKey: currentChallengeKey,
    });
    const challengeId = getDailyChallengeId(currentChallengeKey);
    challengeIdRef.current = challengeId;
    directionRef.current = initialState.direction;
    queuedDirectionRef.current = null;
    gameStateRef.current = initialState;

    trackInteraction('game_play_start', {
      game_slug: 'snake-3d',
      challenge_id: challengeId,
      challenge_mode: 'daily',
      attempt: nextAttempt,
    });

    sceneRef.current?.dispose();
    sceneRef.current = null;

    try {
      if (!canvasRef.current) throw new Error('Snake canvas is unavailable.');

      const controller = await createSnakeScene(
        canvasRef.current,
        initialState,
        consumeDirection,
        (nextState) => {
          const previousScore = gameStateRef.current?.score ?? 0;
          gameStateRef.current = nextState;
          setScore(nextState.score);

          const nextBestScore = Math.max(bestScore, nextState.score);
          if (nextState.score > bestScore) {
            setBestScore(nextState.score);
            window.localStorage.setItem(
              BEST_SCORE_STORAGE_KEY,
              String(nextState.score)
            );
          }

          if (nextState.score > previousScore) {
            const milestone = getSnakeScoreMilestone(nextState.score);
            const feedbackKind: SnakeFeedbackKind = milestone ? 'milestone' : 'eat';
            playFeedback(feedbackKind);
            showVisualFeedback(feedbackKind);

            if (milestone) {
              trackInteraction('snake_score_milestone', {
                game_slug: 'snake-3d',
                challenge_id: challengeIdRef.current,
                attempt: attemptRef.current,
                score: milestone,
                control_type: controlTypeRef.current ?? undefined,
              });
            }
          }

          if (nextState.status !== 'dead' || firstDeathReportedRef.current) {
            return;
          }

          firstDeathReportedRef.current = true;
          const durationMs = getFirstDeathDurationMs(
            startedAtRef.current ?? Number.NaN,
            performance.now()
          );
          const bucket = getFirstDeathDurationBucket(durationMs);
          setFirstDeathBucket(bucket);
          controller.stop();
          setPhase('dead');
          playFeedback('game-over');
          showVisualFeedback('game-over');

          trackInteraction('snake_game_over', {
            game_slug: 'snake-3d',
            challenge_id: challengeIdRef.current,
            attempt: attemptRef.current,
            final_score: nextState.score,
            best_score: nextBestScore,
            duration_ms: durationMs === null ? undefined : Math.round(durationMs),
            control_type: controlTypeRef.current ?? undefined,
          });
          trackInteraction('snake_3d_first_death', {
            game_slug: 'snake-3d',
            challenge_id: challengeIdRef.current,
            attempt: attemptRef.current,
            score: nextState.score,
            first_death_duration_seconds:
              durationMs === null ? undefined : Math.round(durationMs / 1_000),
            first_death_duration_bucket: bucket,
          });
        }
      );

      sceneRef.current = controller;
      const readyMs = Math.max(0, Math.round(performance.now() - startedAt));
      setPlayToReadyMs(readyMs);
      trackInteraction('snake_3d_ready', {
        game_slug: 'snake-3d',
        challenge_id: challengeId,
        challenge_mode: 'daily',
        attempt: nextAttempt,
        play_to_ready_ms: readyMs,
      });
      setPhase('playing');
      controller.start();
    } catch (error) {
      setPhase('error');
      trackInteraction('snake_3d_load_error', {
        game_slug: 'snake-3d',
        error_type: error instanceof Error ? error.name : 'unknown',
      });
    }
  }, [bestScore, challengeKey, consumeDirection, ensureAudioContext, muted, phase, playFeedback, showVisualFeedback]);

  const togglePause = useCallback(() => {
    if (phase === 'playing') {
      sceneRef.current?.setPaused(true);
      setPhase('paused');
    } else if (phase === 'paused') {
      sceneRef.current?.setPaused(false);
      setPhase('playing');
      if (!muted) void ensureAudioContext();
    }
  }, [ensureAudioContext, muted, phase]);

  const toggleAudio = useCallback(async () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    window.localStorage.setItem(SOUND_STORAGE_KEY, String(nextMuted));
    if (!nextMuted) await ensureAudioContext();
    trackInteraction('snake_audio_toggle', {
      game_slug: 'snake-3d',
      muted: nextMuted,
    });
  }, [ensureAudioContext, muted]);

  const toggleFullscreen = useCallback(async () => {
    if (!stageRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await stageRef.current.requestFullscreen();
      }
      trackInteraction('game_fullscreen_toggle', {
        game_slug: 'snake-3d',
        fullscreen: Boolean(document.fullscreenElement),
        source: 'snake_3d_controls',
      });
    } catch {
      trackInteraction('game_fullscreen_error', { game_slug: 'snake-3d' });
    }
  }, []);

  const displayedBestScore = Math.max(bestScore, score);
  const challengeLabel = challengeKey
    ? `${content.daily} · ${challengeKey}`
    : content.daily;
  const feedbackClass =
    visualFeedback === 'game-over'
      ? 'bg-rose-400/10 ring-2 ring-inset ring-rose-300/25'
      : visualFeedback === 'milestone'
        ? 'bg-amber-300/10 ring-2 ring-inset ring-amber-200/25'
        : 'bg-emerald-300/10 ring-1 ring-inset ring-emerald-200/20';

  return (
    <section className="space-y-4" aria-labelledby="luma-snake-3d-title">
      <div
        ref={stageRef}
        className="relative isolate overflow-hidden rounded-xl border border-slate-800 bg-[#07141a] shadow-2xl shadow-slate-950/20"
        data-snake-stage="true"
        data-snake-phase={phase}
        data-snake-play-to-ready-ms={playToReadyMs ?? undefined}
      >
        <canvas
          ref={canvasRef}
          className="block aspect-[4/3] min-h-[420px] w-full touch-none sm:aspect-[16/9] sm:min-h-[520px]"
          aria-label={content.canvasLabel}
          data-snake-canvas="true"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        />

        {visualFeedback && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-10 ${feedbackClass}`}
            data-snake-feedback={visualFeedback}
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-6">
          <div className="rounded-md border border-white/10 bg-slate-950/55 px-3 py-2 text-white backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              {content.daily}
            </p>
            <p className="mt-1 text-xs text-slate-300" data-challenge-key="true">
              {challengeLabel}
            </p>
          </div>
          <div className="flex gap-2 text-right text-white">
            <div className="rounded-md border border-white/10 bg-slate-950/55 px-3 py-2 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {content.score}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums" data-score="true">
                {score}
              </p>
            </div>
            <div className="hidden rounded-md border border-white/10 bg-slate-950/55 px-3 py-2 backdrop-blur-sm sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {content.best}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums" data-best-score="true">
                {displayedBestScore}
              </p>
            </div>
          </div>
        </div>

        {phase === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 p-6">
            <div className="max-w-md text-center text-white">
              <p className="text-sm leading-6 text-slate-200">{content.readyHint}</p>
              <button
                type="button"
                className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-px"
                onClick={startGame}
                data-snake-play="true"
              >
                <Play aria-hidden="true" size={18} />
                {content.play}
              </button>
            </div>
          </div>
        )}

        {phase === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 p-6 text-center text-white backdrop-blur-sm">
            <p className="text-sm font-semibold">{content.loading}</p>
          </div>
        )}

        {phase === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 p-6 text-center text-white backdrop-blur-sm">
            <div>
              <Pause aria-hidden="true" className="mx-auto text-emerald-300" size={26} />
              <p className="mt-3 text-sm font-semibold">{content.paused}</p>
              <button
                type="button"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-emerald-300/60 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                onClick={togglePause}
              >
                <Play aria-hidden="true" size={16} />
                {content.resume}
              </button>
            </div>
          </div>
        )}

        {phase === 'dead' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65 p-6 text-center text-white backdrop-blur-sm">
            <div>
              <p className="text-sm font-semibold text-emerald-200">{content.firstDeath}</p>
              <p className="mt-2 text-2xl font-bold">{formatDuration(locale, firstDeathBucket)}</p>
              <p className="mt-2 max-w-sm text-xs leading-5 text-slate-300">{content.firstDeathHint}</p>
              <button
                type="button"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-px"
                onClick={startGame}
                data-snake-retry="true"
              >
                <RotateCcw aria-hidden="true" size={17} />
                {content.retry}
              </button>
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 p-6 text-center text-white backdrop-blur-sm">
            <div>
              <p className="text-sm font-semibold">{content.error}</p>
              <button
                type="button"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-emerald-300/60 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                onClick={startGame}
              >
                {content.retryLoad}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{content.controls}</span>
          <span>{content.keyboard}</span>
          <span aria-hidden="true">·</span>
          <span>{content.touch}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => void toggleAudio()}
            aria-pressed={muted}
            aria-label={muted ? content.unmute : content.mute}
            title={muted ? content.unmute : content.mute}
            data-snake-audio-toggle="true"
          >
            {muted ? <VolumeX aria-hidden="true" size={16} /> : <Volume2 aria-hidden="true" size={16} />}
            <span className="sr-only">{muted ? content.unmute : content.mute}</span>
          </button>
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            onClick={togglePause}
            disabled={phase !== 'playing' && phase !== 'paused'}
            title={content.pause}
          >
            <Pause aria-hidden="true" size={16} />
            <span className="sr-only">{content.pause}</span>
          </button>
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            onClick={toggleFullscreen}
            disabled={phase === 'idle' || phase === 'loading' || phase === 'error'}
            title={content.fullscreen}
          >
            <Maximize2 aria-hidden="true" size={16} />
            <span className="sr-only">{content.fullscreen}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[220px] grid-cols-3 gap-2 sm:hidden" aria-label={content.controls}>
        <span />
        <button
          type="button"
          className="flex min-h-12 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm active:translate-y-px"
          onClick={() => handleDirection({ x: 0, z: -1 }, 'touch-button')}
          aria-label={locale === 'zh' ? '向上移动' : 'Move up'}
        >
          <ArrowUp aria-hidden="true" size={20} />
        </button>
        <span />
        <button
          type="button"
          className="flex min-h-12 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm active:translate-y-px"
          onClick={() => handleDirection({ x: -1, z: 0 }, 'touch-button')}
          aria-label={locale === 'zh' ? '向左移动' : 'Move left'}
        >
          <ArrowLeft aria-hidden="true" size={20} />
        </button>
        <button
          type="button"
          className="flex min-h-12 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm active:translate-y-px"
          onClick={() => handleDirection({ x: 0, z: 1 }, 'touch-button')}
          aria-label={locale === 'zh' ? '向下移动' : 'Move down'}
        >
          <ArrowDown aria-hidden="true" size={20} />
        </button>
        <button
          type="button"
          className="flex min-h-12 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm active:translate-y-px"
          onClick={() => handleDirection({ x: 1, z: 0 }, 'touch-button')}
          aria-label={locale === 'zh' ? '向右移动' : 'Move right'}
        >
          <ArrowRight aria-hidden="true" size={20} />
        </button>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{content.originalNote}</p>
    </section>
  );
}
