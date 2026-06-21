"use client";

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface GamePlayerFacadeProps {
  iframeUrl: string;
  title: string;
  thumbnailUrl?: string | null;
  locale: string;
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

export function GamePlayerFacade({
  iframeUrl,
  title,
  thumbnailUrl,
  locale,
}: GamePlayerFacadeProps) {
  const [loaded, setLoaded] = useState(false);
  const sandbox = needsUnsandboxedIframe(iframeUrl)
    ? undefined
    : 'allow-scripts allow-fullscreen allow-pointer-lock allow-popups';

  if (loaded) {
    return (
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
          onClick={() => setLoaded(true)}
          aria-label={locale === 'zh' ? `开始游玩 ${title}` : `Play ${title}`}
          className="bg-white text-slate-950 hover:bg-white/90"
        >
          {locale === 'zh' ? '开始游戏' : 'Play now'}
        </Button>
      </div>
    </div>
  );
}
