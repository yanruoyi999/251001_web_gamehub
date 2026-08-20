'use client';

import { useEffect } from 'react';

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

const clarityProjectId =
  process.env.NEXT_PUBLIC_GAMEHUB_CLARITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ||
  '';

function setClarityConsent(analyticsStorage: 'granted') {
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
  useEffect(() => {
    if (!clarityProjectId || !isFormalProductionHost(window.location.hostname))
      return;

    loadClarity(clarityProjectId);
  }, []);

  void locale;
  return null;
}
