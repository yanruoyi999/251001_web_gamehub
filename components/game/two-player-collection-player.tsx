'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { parseTrustedRuntimeMessage } from '@/lib/analytics/runtime-message';
import { trackInteraction } from '@/lib/analytics/events';
import type { TwoPlayerGame } from '@/lib/games/two-player-unblocked';

interface TwoPlayerCollectionPlayerProps {
  locale: 'zh' | 'en';
  games: TwoPlayerGame[];
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const READY_TIMEOUT_MS = 8_000;

export function TwoPlayerCollectionPlayer({ locale, games }: TwoPlayerCollectionPlayerProps) {
  const [selectedSlug, setSelectedSlug] = useState(games[0]?.slug ?? '');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [playVerified, setPlayVerified] = useState(false);
  const runtimeSessionRef = useRef('');
  const inputSessionRef = useRef<string | null>(null);
  const errorSessionRef = useRef<string | null>(null);
  const observedSessionRef = useRef<string | null>(null);
  const [frameVersion, setFrameVersion] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isViewportFullscreen, setIsViewportFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const readySessionRef = useRef<string | null>(null);
  const collectionTrackedRef = useRef(false);

  const selectedGame = useMemo(
    () => games.find((game) => game.slug === selectedSlug) ?? games[0],
    [games, selectedSlug],
  );

  const activeGame = useMemo(
    () => games.find((game) => game.slug === activeSlug),
    [activeSlug, games],
  );

  useEffect(() => {
    if (collectionTrackedRef.current) return;
    collectionTrackedRef.current = true;
    trackInteraction('two_player_collection_view', {
      locale,
      source: 'two_player_collection',
      game_count: games.length,
    });
  }, [games.length, locale]);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    };

    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  useEffect(() => {
    if (!isViewportFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    const exitWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsViewportFullscreen(false);
      trackInteraction('game_fullscreen_toggle', {
        game_slug: activeSlug ?? selectedSlug,
        locale,
        source: 'two_player_collection',
        entering: false,
        mode: 'viewport_fallback',
      });
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', exitWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', exitWithEscape);
    };
  }, [activeSlug, isViewportFullscreen, locale, selectedSlug]);

  useEffect(() => {
    if (!activeSlug) return;

    const handleRuntimeMessage = (event: MessageEvent<unknown>) => {
      const message = parseTrustedRuntimeMessage(event, iframeRef.current?.contentWindow, activeSlug, runtimeSessionRef.current);
      if (!message) return;

      const sessionKey = runtimeSessionRef.current;
      if (message.type === 'luma-game-ready') {
        if (readySessionRef.current === sessionKey) return;
        readySessionRef.current = sessionKey;
        setLoadState('ready');
        trackInteraction('game_load_success', {
          game_slug: activeSlug,
          locale,
          source: 'two_player_collection',
          schema_version: 2, evidence: 'validated_runtime_handshake',
        });
      }

      if (message.type === 'luma-game-input') {
        if (readySessionRef.current !== sessionKey || inputSessionRef.current === sessionKey || errorSessionRef.current === sessionKey) return;
        inputSessionRef.current = sessionKey;
        setPlayVerified(true);
        trackInteraction('game_play_start', {
          game_slug: activeSlug, locale, source: 'two_player_collection',
          schema_version: 2, evidence: 'validated_first_control_input',
        });
      }

      if (message.type === 'luma-game-error') {
        if (errorSessionRef.current === sessionKey) return;
        errorSessionRef.current = sessionKey;
        setLoadState('error');
        trackInteraction('game_load_error', {
          game_slug: activeSlug,
          locale,
          source: 'two_player_collection',
          reason: 'runtime_message',
        });
      }
    };

    window.addEventListener('message', handleRuntimeMessage);
    return () => window.removeEventListener('message', handleRuntimeMessage);
  }, [activeSlug, frameVersion, locale]);

  useEffect(() => {
    if (!activeSlug || loadState !== 'loading') return;

    const timeout = window.setTimeout(() => {
      setLoadState((current) => {
        if (current !== 'loading') return current;
        trackInteraction('game_load_error', {
          game_slug: activeSlug,
          locale,
          source: 'two_player_collection',
          reason: 'ready_timeout',
        });
        return 'error';
      });
    }, READY_TIMEOUT_MS);

    // A cached document may acknowledge before an effect listener is attached.
    // Retry the same challenge, never a new session, until ready or timeout.
    const handshake = window.setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage({ type: 'luma-parent-ready', gameSlug: activeSlug, session: runtimeSessionRef.current }, '*');
    }, 500);
    return () => { window.clearTimeout(timeout); window.clearInterval(handshake); };
  }, [activeSlug, loadState, locale]);

  useEffect(() => {
    if (!activeSlug || loadState !== 'ready' || !playVerified) return;
    let elapsed = 0;
    let previous = performance.now();
    let visible = !document.hidden;
    const sent = new Set<number>();
    const tick = () => {
      const now = performance.now();
      if (visible) elapsed += Math.max(0, now - previous);
      previous = now;
      visible = !document.hidden;
      for (const [threshold, name] of [[10_000, 'game_play_10s'], [30_000, 'game_play_30s']] as const) {
        if (elapsed < threshold || sent.has(threshold)) continue;
        sent.add(threshold);
        trackInteraction(name, { game_slug: activeSlug, locale, source: 'two_player_collection', schema_version: 2, evidence: 'visible_time_after_first_input' });
      }
    };
    const timer = window.setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
  }, [activeSlug, frameVersion, playVerified, loadState, locale]);

  const selectGame = (game: TwoPlayerGame) => {
    trackInteraction('two_player_game_click', {
      game_slug: game.slug,
      locale,
      source: 'two_player_collection',
      genre: game.genre,
    });

    if (activeSlug && activeSlug !== game.slug) {
      trackInteraction('game_switch', {
        game_slug: game.slug,
        from_game_slug: activeSlug,
        to_game_slug: game.slug,
        locale,
        source: 'two_player_collection',
      });
      setActiveSlug(null);
      setLoadState('idle');
      readySessionRef.current = null;
      runtimeSessionRef.current = '';
      setPlayVerified(false);
    }

    setSelectedSlug(game.slug);
  };

  const startGame = () => {
    if (!selectedGame) return;

    readySessionRef.current = null;
    runtimeSessionRef.current = window.crypto.randomUUID();
    inputSessionRef.current = null;
    errorSessionRef.current = null;
    observedSessionRef.current = null;
    setPlayVerified(false);
    setFrameVersion((current) => current + 1);
    setActiveSlug(selectedGame.slug);
    setLoadState('loading');
    trackInteraction('game_start_attempt', {
      game_slug: selectedGame.slug,
      locale,
      source: 'two_player_collection',
      genre: selectedGame.genre,
      schema_version: 2, evidence: 'user_start_request',
    });
  };

  const handleIframeLoad = () => {
    if (!activeGame) return;
    if (observedSessionRef.current !== runtimeSessionRef.current) {
      observedSessionRef.current = runtimeSessionRef.current;
      trackInteraction('game_iframe_load', { game_slug: activeGame.slug, locale, source: 'two_player_collection', schema_version: 2, evidence: 'load_event_only' });
    }
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'luma-parent-ready', gameSlug: activeGame.slug, session: runtimeSessionRef.current },
      '*',
    );
  };

  const handleIframeError = () => {
    if (!activeGame) return;
    setLoadState('error');
    trackInteraction('game_load_error', {
      game_slug: activeGame.slug,
      locale,
      source: 'two_player_collection',
      reason: 'iframe_error',
    });
  };

  const toggleFullscreen = async () => {
    const shell = playerRef.current;
    const gameSlug = activeSlug ?? selectedSlug;
    if (!shell || !gameSlug) return;

    if (isViewportFullscreen) {
      setIsViewportFullscreen(false);
      trackInteraction('game_fullscreen_toggle', {
        game_slug: gameSlug,
        locale,
        source: 'two_player_collection',
        entering: false,
        mode: 'viewport_fallback',
      });
      return;
    }

    try {
      if (document.fullscreenElement === shell) {
        await document.exitFullscreen();
        trackInteraction('game_fullscreen_toggle', {
          game_slug: gameSlug,
          locale,
          source: 'two_player_collection',
          entering: false,
          mode: 'native',
        });
      } else {
        await shell.requestFullscreen();
        trackInteraction('game_fullscreen_toggle', {
          game_slug: gameSlug,
          locale,
          source: 'two_player_collection',
          entering: true,
          mode: 'native',
        });
      }
    } catch {
      setIsViewportFullscreen(true);
      trackInteraction('game_fullscreen_toggle', {
        game_slug: gameSlug,
        locale,
        source: 'two_player_collection',
        entering: true,
        mode: 'viewport_fallback',
      });
    }
  };

  const copy = locale === 'zh'
    ? {
        select: '选择游戏',
        play: '开始双人游戏',
        replay: '重新开始',
        loading: '正在加载本地游戏…',
        ready: '游戏已加载。点击游戏画面后即可使用键盘。',
        error: '游戏没有正常启动。你可以重试或切换另一款。',
        fullscreen: '全屏',
        exitFullscreen: '退出全屏',
        players: '2 Players',
        keyboardOnly: '键盘双人',
        mobileUnsupported: '手机仅可浏览，本版游戏需要实体键盘',
      }
    : {
        select: 'Choose a game',
        play: 'Play two-player game',
        replay: 'Restart game',
        loading: 'Loading the self-hosted game…',
        ready: 'Game loaded. Click the game area, then use the keyboard controls.',
        error: 'The game did not start correctly. Retry or switch to another game.',
        fullscreen: 'Fullscreen',
        exitFullscreen: 'Exit fullscreen',
        players: '2 Players',
        keyboardOnly: 'Same keyboard',
        mobileUnsupported: 'Browse on mobile; this game requires a physical keyboard',
      };

  if (!selectedGame) return null;

  const expanded = isFullscreen || isViewportFullscreen;

  return (
    <section className="space-y-6" aria-label={copy.select}>
      <div className="grid gap-4 md:grid-cols-3">
        {games.map((game) => {
          const selected = game.slug === selectedSlug;
          return (
            <article
              key={game.slug}
              className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition ${
                selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              }`}
            >
              <button
                type="button"
                onClick={() => selectGame(game)}
                className="block min-h-11 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                aria-pressed={selected}
                data-game-selector={game.slug}
              >
                <Image
                  src={game.thumbnailPath}
                  alt={`${game.title[locale]} preview`}
                  width={800}
                  height={450}
                  className="aspect-video w-full object-cover"
                  unoptimized
                />
                <span className="block space-y-2 p-4">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-base text-foreground">{game.title[locale]}</strong>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {copy.players}
                    </span>
                  </span>
                  <span className="block text-sm text-muted-foreground">{game.summary[locale]}</span>
                  <span className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{game.genre}</span>
                    <span>·</span>
                    <span>{copy.keyboardOnly}</span>
                  </span>
                  <span className="grid gap-1 text-xs text-foreground/80">
                    <span>P1: {game.playerOneControls}</span>
                    <span>P2: {game.playerTwoControls}</span>
                  </span>
                </span>
              </button>
            </article>
          );
        })}
      </div>

      <div
        ref={playerRef}
        className={
          isViewportFullscreen
            ? 'fixed inset-0 z-[120] flex h-[100dvh] w-screen flex-col bg-black p-2 sm:p-4'
            : 'overflow-hidden rounded-2xl border border-border bg-slate-950 shadow-lg'
        }
        data-two-player-shell
        data-play-verified={playVerified}
        data-load-state={loadState}
        data-viewport-fullscreen={isViewportFullscreen ? 'true' : 'false'}
      >
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950 px-4 py-3 text-white">
          <div>
            <p className="font-semibold">{selectedGame.title[locale]}</p>
            <p className="text-xs text-white/70">
              P1 {selectedGame.playerOneControls} · P2 {selectedGame.playerTwoControls}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startGame}
              className="min-h-11 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              data-two-player-start
            >
              {activeSlug === selectedGame.slug ? copy.replay : copy.play}
            </button>
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="min-h-11 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-pressed={expanded}
              data-two-player-fullscreen
            >
              {expanded ? copy.exitFullscreen : copy.fullscreen}
            </button>
          </div>
        </div>

        <div className={isViewportFullscreen ? 'min-h-0 flex-1' : 'aspect-video'}>
          {activeGame ? (
            <iframe
              key={`${activeGame.slug}:${frameVersion}`}
              ref={iframeRef}
              src={activeGame.runtimePath}
              title={activeGame.title[locale]}
              sandbox="allow-scripts"
              allow="fullscreen"
              allowFullScreen
              referrerPolicy="no-referrer"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              className="h-full min-h-[260px] w-full border-0 bg-slate-950 sm:min-h-0"
              data-two-player-runtime={activeGame.slug}
            />
          ) : (
            <div className="relative flex h-full min-h-[280px] items-center justify-center overflow-hidden bg-slate-950 text-center text-white">
              <Image
                src={selectedGame.thumbnailPath}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover opacity-30"
                unoptimized
              />
              <div className="relative z-10 max-w-lg space-y-3 px-6">
                <p className="text-xl font-bold">{selectedGame.title[locale]}</p>
                <p className="text-sm text-white/80">{selectedGame.summary[locale]}</p>
                <button
                  type="button"
                  onClick={startGame}
                  className="min-h-11 rounded-lg bg-white px-5 py-2.5 font-semibold text-slate-950 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  {copy.play}
                </button>
              </div>
            </div>
          )}
        </div>

        {activeGame ? (
          <div className="border-t border-white/10 bg-slate-950 px-4 py-3 text-sm text-white/80" aria-live="polite">
            {loadState === 'loading' ? copy.loading : null}
            {loadState === 'ready' ? copy.ready : null}
            {loadState === 'error' ? copy.error : null}
          </div>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">{copy.mobileUnsupported}</p>
    </section>
  );
}
