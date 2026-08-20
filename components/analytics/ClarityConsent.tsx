"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { isFormalProductionHost } from '@/lib/analytics/runtime';

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

interface QueuedClarityFunction {
  (...args: unknown[]): void;
  q?: unknown[][];
}

interface ClarityConsentProps {
  locale?: 'en' | 'zh';
}

const storageKey = 'gamehub_clarity_consent';
type AnalyticsConsent = 'granted' | 'denied';
const clarityProjectId =
  process.env.NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ||
  '';

function isClarityExcludedPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname.replace(/\/+$/, '').endsWith('/games/online-games-for-couples');
}

function setClarityConsent(analyticsStorage: AnalyticsConsent) {
  const clarity = window.clarity;

  if (typeof clarity === 'function') {
    clarity('consentv2', {
      ad_Storage: 'denied',
      analytics_Storage: analyticsStorage,
    });
  }
}

function stopClarityTracking() {
  const clarity = window.clarity;

  if (typeof clarity === 'function') {
    clarity('consent', false);
  }
}

function loadClarity(projectId: string) {
  if (!projectId) return;

  if (!window.clarity) {
    (function initClarity(c: Window, l: Document, r: string, i: string) {
      const queuedClarity = c.clarity as QueuedClarityFunction | undefined;
      c.clarity =
        queuedClarity ||
        function clarityQueue(...args: unknown[]) {
          const clarity = c.clarity as QueuedClarityFunction;
          (clarity.q = clarity.q || []).push(args);
        };
      const script = l.createElement(r) as HTMLScriptElement;
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${i}`;
      const firstScript = l.getElementsByTagName(r)[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    })(window, document, 'script', projectId);
  }

  setClarityConsent('granted');
}

export function ClarityConsent({ locale = 'en' }: ClarityConsentProps = {}) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<AnalyticsConsent | 'prompt' | 'unknown'>('unknown');

  useEffect(() => {
    if (!clarityProjectId || !isFormalProductionHost(window.location.hostname)) return;

    const saved = window.localStorage.getItem(storageKey);

    if (isClarityExcludedPath(pathname)) {
      stopClarityTracking();
      setConsent(saved === 'granted' || saved === 'denied' ? saved : 'unknown');
      return;
    }

    if (saved === 'granted') {
      setConsent('granted');
      loadClarity(clarityProjectId);
      return;
    }

    setConsent(saved === 'denied' ? 'denied' : 'prompt');
  }, [pathname]);

  if (consent !== 'prompt' || isClarityExcludedPath(pathname)) return null;

  const isChinese = locale === 'zh';
  const copy = isChinese
    ? '我们使用匿名分析帮助改进页面和游戏体验。'
    : 'We use anonymous analytics to improve the site and game experience.';

  const grant = () => {
    if (isClarityExcludedPath(pathname)) return;
    window.localStorage.setItem(storageKey, 'granted');
    setConsent('granted');
    loadClarity(clarityProjectId);
  };

  const deny = () => {
    window.localStorage.setItem(storageKey, 'denied');
    setConsent('denied');
  };

  return (
    <aside
      aria-label={isChinese ? '分析同意' : 'Analytics consent'}
      className="fixed inset-x-4 bottom-4 z-50 flex max-w-xl flex-col gap-3 rounded-lg border border-border bg-background/95 p-4 shadow-lg backdrop-blur sm:left-6 sm:right-auto"
    >
      <p className="text-sm text-foreground">{copy}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          onClick={grant}
        >
          {isChinese ? '允许分析' : 'Allow analytics'}
        </button>
        <button
          type="button"
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground"
          onClick={deny}
        >
          {isChinese ? '拒绝' : 'Decline'}
        </button>
      </div>
    </aside>
  );
}