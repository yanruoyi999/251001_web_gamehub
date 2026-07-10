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
}

function canUseNextImage(src?: string | null) {
  return Boolean(
    src &&
      (src.startsWith('/') ||
        src.startsWith('https://res.cloudinary.com')),
  );
}

function needsUnsandboxedIframe(src: string) {
  try {
    const { hostname } = new URL(src);
    return hostname === '4399.com' || hostname.endsWith('.4399.com');
  } catch {
    return false;
  }
}

type WebkitFullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type WebkitFullscreenElement = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

export function GamePlayerFacade({
  iframeUrl,
  title,
  thumbnailUrl,
  locale,
  gameSlug,
  source = 'game_player',
}: GamePlayerFacadeProps) {
  const [loaded, setLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isViewportFullscreen, setIsViewportFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const sandbox = needsUnsandboxedIframe(iframeUrl)
    ? undefined
    : 'allow-scripts allow-fullscreen allow-pointer-lock allow-popups';

  useEffect(() => {
    const fullscreenDocument = document as WebkitFullscreenDocument;
    const syncFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement));
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
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isViewportFullscreen]);

  const isExpanded = isFullscreen || isViewportFullscreen;

  const toggleFullscreen = async () => {
    const player = playerRef.current as WebkitFullscreenElement | null;
    if (!player) return;

    const fullscreenDocument = document as WebkitFullscreenDocument;
    const activeElement = document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement;

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

    try {
      if (activeElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (fullscreenDocument.webkitExitFullscreen) {
          await Promise.resolve(fullscreenDocument.webkitExitFullscreen());
        }
      } else if (player.requestFullscreen) {
        await player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) {
        await Promise.resolve(player.webkitRequestFullscreen());
      } else {
        throw new Error('Fullscreen API unavailable');
      }

      trackInteraction('game_fullscreen_toggle', {
        game_slug: gameSlug ?? title,
        locale,
        source,
        entering: !activeElement,
        mode: 'native',
      });
    } catch {
      setIsViewportFullscreen(true);
      trackInteraction('game_fullscreen_toggle', {
        game_slug: gameSlug ?? title,
        locale,
        source,
        entering: true,
        mode: 'viewport_fallback',
      });
    }
  };

  if (loaded) {
    return (
      <div
        ref={playerRef}
        className={
          isViewportFullscreen
            ? 'fixed inset-0 z-[100] h-[100dvh] w-screen bg-black'
            : 'relative h-full w-full bg-black'
        }
      >
        <iframe
          src={iframeUrl}
          title={title}
          loading="lazy"
          allowFullScreen
          allow="fullscreen; gamepad"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox={sandbox}
          className="h-full w-full"
        />
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={toggleFullscreen}
          aria-pressed={isExpanded}
          aria-label={
            locale === 'zh'
              ? isExpanded ? '退出全屏' : '全屏游玩'
              : isExpanded ? 'Exit fullscreen' : 'Play fullscreen'
          }
          title={
            locale === 'zh'
              ? isExpanded ? '退出全屏' : '全屏游玩'
              : isExpanded ? 'Exit fullscreen' : 'Play fullscreen'
          }
          className="absolute right-3 top-3 z-20 h-10 w-10 bg-background/90 text-foreground shadow-md hover:bg-background"
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
            ? '点击后才会加载第三方游戏资源，首屏速度更快。'
            : 'The third-party game loads only after you click, keeping the first view faster.'}
        </p>
        <Button
          type="button"
          size="lg"
          onClick={() => {
            trackInteraction('game_play_start', {
              game_slug: gameSlug ?? title,
              locale,
              source,
            });
            setLoaded(true);
          }}
          aria-label={locale === 'zh' ? `开始游玩 ${title}` : `Play ${title}`}
          className="bg-white text-slate-950 hover:bg-white/90"
        >
          {locale === 'zh' ? '开始游戏' : 'Play now'}
        </Button>
      </div>
    </div>
  );
}
