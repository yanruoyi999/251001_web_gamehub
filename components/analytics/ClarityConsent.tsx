'use client';

import { useEffect, useState } from 'react';

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

function setClarityConsent(analyticsStorage: AnalyticsConsent) {
  const clarity = window.clarity;

  if (typeof clarity === 'function') {
    clarity('consentv2', {
      ad_Storage: 'denied',
      analytics_Storage: analyticsStorage,
    });
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
  const [consent, setConsent] = useState<
    AnalyticsConsent | 'prompt' | 'unknown'
  >('unknown');

  useEffect(() => {
    if (!clarityProjectId || !isFormalProductionHost(window.location.hostname))
      return;

    const saved = window.localStorage.getItem(storageKey);
    if (saved === 'granted') {
      setConsent('granted');
      loadClarity(clarityProjectId);
      return;
    }

    setConsent(saved === 'denied' ? 'denied' : 'prompt');
  }, []);

  if (consent !== 'prompt') return null;

  const isChinese = locale === 'zh';
  const copy = isChinese
    ? '我们使用匿名分析帮助改进页面和游戏体验。'
    : 'We use anonymous analytics to improve the site and game experience.';

  const grant = () => {
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
      data-consent-overlay
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 flex w-[calc(100vw-1.5rem)] max-w-md items-center gap-3 rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur sm:left-6 sm:right-auto sm:gap-4 sm:p-4"
    >
      <p className="min-w-0 flex-1 text-xs leading-5 text-foreground sm:text-sm">
        {copy}
      </p>
      <div className="flex shrink-0 gap-1.5 sm:gap-2">
        <button
          type="button"
          className="min-h-10 rounded-md bg-primary px-2.5 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:text-sm"
          onClick={grant}
        >
          {isChinese ? '允许分析' : 'Allow analytics'}
        </button>
        <button
          type="button"
          className="min-h-10 rounded-md border border-border px-2.5 py-2 text-xs font-semibold text-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:text-sm"
          onClick={deny}
        >
          {isChinese ? '拒绝' : 'Decline'}
        </button>
      </div>
    </aside>
  );
}
