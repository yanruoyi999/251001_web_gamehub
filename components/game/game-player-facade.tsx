"use client";

import Image from 'next/image';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { trackInteraction } from '@/lib/analytics/events';

interface GamePlayerFacadeProps {
  iframeUrl: string;
  title: string;
  thumbnailUrl?: string | null;
  locale: string;
  gameSlug?: string;
  source?: string;
  playLabel?: string;
  /** Only pass a source link whose rights/provenance have already been verified. */
  fallbackHref?: string;
}

function canUseNextImage(src?: string | null) {
  return Boolean(
    src &&
      (src.startsWith('/') ||
        src.startsWith('https://res.cloudinary.com')),
  );
}

type WebkitFullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type WebkitFullscreenElement = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type IframeLoadState = 'idle' | 'loading' | 'ready' | 'error';

const IFRAME_LOAD_TIMEOUT_MS = 12_000;

export function GamePlayerFacade({
  iframeUrl,
  title,
  thumbnailUrl,
  locale,
  gameSlug,
  source = 'game_player',
  playLabel,
  fallbackHref,
}: GamePlayerFacadeProps) {
  const [loaded, setLoaded] = useState(false);
  const [iframeAttempt, setIframeAttempt] = useState(0);
  const [iframeLoadState, setIframeLoadState] =
    useState<IframeLoadState>('idle');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isViewportFullscreen, setIsViewportFullscreen] = useState(false);
  const [isFullscreenTransitioning, setIsFullscreenTransitioning] =
    useState(false);
  const fullscreenTransitionRef = useRef(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const sandbox = 'allow-scripts allow-same-origin allow-pointer-lock';

  useEffect(() => {
    const fullscreenDocument = document as WebkitFullscreenDocument;
    const syncFullscreenState = () => {
      setIsFullscreen(
        Boolean(
          document.fullscreenElement ??
            fullscreenDocument.webkitFullscreenElement,
        ),
      );
    };

    document.addEventListener('fullscreenchange', syncFullscreenState);
    document.addEventListener('webkitfullscreenchange', syncFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
      document.removeEventListener('webkitfullscreenchange', syncFullscreenState);
    };
  }, []);

  useEffect(() => {
    if (!isViewportFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    const closeViewportFullscreen = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      setIsViewportFullscreen(false);
      trackInteraction('game_fullscreen_toggle', {
        game_slug: gameSlug ?? title,
        locale,
        source,
        entering: false,
        mode: 'viewport_fallback',
      });
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeViewportFullscreen);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeViewportFullscreen);
    };
  }, [gameSlug, isViewportFullscreen, locale, source, title]);

  useEffect(() => {
    if (!loaded || iframeLoadState !== 'loading') return;

    const timer = window.setTimeout(() => {
      setIframeLoadState('error');
    }, IFRAME_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [iframeAttempt, iframeLoadState, loaded]);

  const isExpanded = isFullscreen || isViewportFullscreen;
  const accessiblePlayLabel =
    playLabel ?? (locale === 'zh' ? `开始游玩 ${title}` : `Play ${title}`);
  const visiblePlayLabel =
    playLabel ?? (locale === 'zh' ? '开始游戏' : 'Play now');

  const startGame = () => {
    setLoaded(true);
    setIframeLoadState('loading');
    trackInteraction('game_play_start', {
      game_slug: gameSlug ?? title,
      locale,
      source,
    });
  };

  const retryGame = () => {
    setIframeAttempt((attempt) => attempt + 1);
    setIframeLoadState('loading');
    trackInteraction('game_play_retry', {
      game_slug: gameSlug ?? title,
      locale,
      source,
    });
  };

  const toggleFullscreen = async () => {
    if (fullscreenTransitionRef.current) return;

    const player = playerRef.current as WebkitFullscreenElement | null;
    if (!player) return;

    fullscreenTransitionRef.current = true;
    setIsFullscreenTransitioning(true);

    const fullscreenDocument = document as WebkitFullscreenDocument;
    const activeElement =
      document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement;

    try {
      if (isViewportFullscreen) {
        setIsViewportFullscreen(false);
        trackInteraction('game_fullscreen_toggle', {
          game_slug: gameSlug ?? title,
          locale,
          source,
          entering: false,
          mode: 'viewport_fallback',
        });
        return;
      }

      if (activeElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (fullscreenDocument.webkitExitFullscreen) {
          await Promise.resolve(fullscreenDocument.webkitExitFullscreen());
        }

        trackInteraction('game_fullscreen_toggle', {
          game_slug: gameSlug ?? title,
          locale,
          source,
          entering: false,
          mode: 'native',
        });
        return;
      }

      if (player.requestFullscreen) {
        await player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) {
        await Promise.resolve(player.webkitRequestFullscreen());
      } else {
        setIsViewportFullscreen(true);
        trackInteraction('game_fullscreen_toggle', {
          game_slug: gameSlug ?? title,
          locale,
          source,
          entering: true,
          mode: 'viewport_fallback',
        });
        return;
      }

      trackInteraction('game_fullscreen_toggle', {
        game_slug: gameSlug ?? title,
        locale,
        source,
        entering: true,
        mode: 'native',
      });
    } catch {
      setIsFullscreen(false);
      setIsViewportFullscreen(true);
      trackInteraction('game_fullscreen_toggle', {
        game_slug: gameSlug ?? title,
        locale,
        source,
        entering: true,
        mode: 'viewport_fallback',
      });
    } finally {
      fullscreenTransitionRef.current = false;
      setIsFullscreenTransitioning(false);
    }
  };

  if (loaded) {
    return (
      <div
        ref={playerRef}
        data-viewport-fullscreen={isViewportFullscreen ? 'true' : 'false'}
        data-game-frame-state={iframeLoadState}
        className={
          isViewportFullscreen
            ? 'fixed inset-0 z-[100] h-[100dvh] w-screen bg-black'
            : 'relative h-full w-full bg-black'
        }
      >
        <iframe
          key={iframeAttempt}
          src={iframeUrl}
          title={title}
          loading="lazy"
          allowFullScreen
          allow="fullscreen; gamepad"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox={sandbox}
          onLoad={() => setIframeLoadState('ready')}
          onError={() => setIframeLoadState('error')}
          className="h-full w-full"
        />

        {iframeLoadState === 'loading' ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/55 px-6 text-center text-sm text-white">
            {locale === 'zh' ? '正在加载游戏…' : 'Loading game…'}
          </div>
        ) : null}

        {iframeLoadState === 'error' ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/95 px-6 text-center text-white">
            <div className="max-w-md space-y-4">
              <p className="text-lg font-semibold">
                {locale === 'zh' ? '游戏暂时无法加载' : 'Game could not be loaded'}
              </p>
              <p className="text-sm text-white/75">
                {locale === 'zh'
                  ? '第三方资源可能暂时不可用或拒绝嵌入。你可以重试；本站不会把空白播放器当作加载成功。'
                  : 'The third-party resource may be unavailable or may reject embedding. Retry the player; an empty frame is not treated as a successful load.'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={retryGame}
                >
                  {locale === 'zh' ? '重试' : 'Retry'}
                </Button>
                {fallbackHref ? (
                  <Button asChild variant="outline">
                    <a
                      href={fallbackHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {locale === 'zh' ? '打开已验证来源' : 'Open verified source'}
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={() => void toggleFullscreen()}
          disabled={isFullscreenTransitioning || iframeLoadState === 'error'}
          aria-busy={isFullscreenTransitioning}
          aria-pressed={isExpanded}
          aria-label={
            locale === 'zh'
              ? isExpanded
                ? '退出全屏'
                : '全屏游玩'
              : isExpanded
                ? 'Exit fullscreen'
                : 'Play fullscreen'
          }
          title={
            locale === 'zh'
              ? isExpanded
                ? '退出全屏'
                : '全屏游玩'
              : isExpanded
                ? 'Exit fullscreen'
                : 'Play fullscreen'
          }
          className="absolute right-3 top-3 z-20 h-11 w-11 bg-background/90 text-foreground shadow-md hover:bg-background"
        >
          {isExpanded ? (
            <Minimize2 className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Maximize2 className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950">
      {thumbnailUrl ? (
        canUseNextImage(thumbnailUrl) ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover opacity-70"
            priority
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        )
      ) : (
        <div className="absolute inset-0 bg-slate-900" />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex max-w-md flex-col items-center gap-4 px-6 text-center text-white">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-white/80">
          {locale === 'zh'
            ? '点击后才会加载已通过页面权限门禁的游戏资源，首屏速度更快。'
            : 'The game resource loads only after you click and after the page-level rights gate has allowed embedding.'}
        </p>
        <Button
          type="button"
          size="lg"
          onClick={startGame}
          aria-label={accessiblePlayLabel}
          className="bg-white text-slate-950 hover:bg-white/90"
        >
          {visiblePlayLabel}
        </Button>
      </div>
    </div>
  );
}
