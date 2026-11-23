import { normalizePublicPathname } from '@/i18n/config';
import { shouldLoadProductionTelemetry } from '@/lib/analytics/runtime';
// PVUV's documented browser protocol: github.com/qiayue/pvuv.ai/blob/main/PROJECT_PLAN.md#5-ingest-endpoint-in
const endpoint = 'https://in.pvuv.ai/in';
const preference = 'pvuv-permission-v1';
const visitorKey = 'pvuv-visitor-v1';
const sessionKey = 'pvuv-session-v1';
const publicPages = new Set([
  '/',
  '/game/popcorn/how-to-play',
  '/games',
  '/games/2-player-unblocked',
  '/games/asmr-games',
  '/games/chinese-checkers',
  '/games/connect-the-dots',
  '/games/country-shape-quiz',
  '/games/daily-solitaire',
  '/games/draw-a-perfect-circle',
  '/games/mahjong-connect',
  '/games/monster-survivors',
  '/games/snake-3d',
  '/games/solitaire',
  '/games/sorting-games',
  '/games/spend-bill-gates-money',
  '/games/stacker-game',
  '/games/steal-a-brainrot-unblocked',
  '/games/tunnel-rush',
  '/games/two-player-games',
  '/games/word-ladder',
  '/guides',
  '/guides/keyboard-only-browser-games',
  '/guides/no-download-games',
  '/guides/quick-play-guide',
]);

export function hasPageCountPermission(): boolean {
  try {
    return localStorage.getItem(preference) === 'yes';
  } catch {
    return false;
  }
}

export function setPageCountPermission(allowed: boolean) {
  if (allowed) {
    localStorage.setItem(preference, 'yes');
  } else {
    localStorage.removeItem(preference);
    localStorage.removeItem(visitorKey);
    localStorage.removeItem(sessionKey);
  }
}

export function canCountHere() {
  if (
    window.top !== window.self ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
  )
    return false;
  if (
    !shouldLoadProductionTelemetry(window.location.hostname) ||
    window.location.origin !== 'https://www.lumagamehub.com'
  )
    return false;
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  return (
    !nav.webdriver &&
    !nav.globalPrivacyControl &&
    ![
      nav.doNotTrack,
      nav.msDoNotTrack,
      (window as Window & { doNotTrack?: string }).doNotTrack,
    ].some(v => v === '1' || v === 'yes')
  );
}

function publicPath(pathname: string) {
  const path = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (publicPages.has(path)) return true;
  // Dynamic catalogue pages supply their published path only after a successful lookup.
  if (
    !/^\/(?:games|guides)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path) ||
    path === '/games/saved'
  )
    return false;
  const page = document.querySelector<HTMLElement>('[data-pvuv-public-path]');
  return page?.dataset.pvuvPublicPath === pathname;
}

// Only locally minted UUIDs may enter an event, even when existing storage is malformed.
function readOrCreateId(key: string, lifetime: number, refresh: boolean) {
  const now = Date.now();
  const [storedId, expiry] = (localStorage.getItem(key) || '').split('|');
  const valid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      storedId
    ) &&
    Number(expiry) > now &&
    Number(expiry) <= now + lifetime;
  const id = valid ? storedId : crypto.randomUUID();
  if (!valid || refresh) localStorage.setItem(key, id + '|' + (now + lifetime));
  return id;
}

export function reportPageCount(routerPath: string) {
  const { pathname, origin, search, hash } = window.location;
  if (
    normalizePublicPathname(routerPath) !== pathname ||
    search ||
    hash ||
    !canCountHere() ||
    !hasPageCountPermission() ||
    !publicPath(pathname)
  )
    return false;
  try {
    const vid = readOrCreateId(visitorKey, 30 * 24 * 60 * 60 * 1000, false);
    const sid = readOrCreateId(sessionKey, 30 * 60 * 1000, true);
    void fetch(endpoint, {
      method: 'POST',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      redirect: 'error',
      headers: { 'Content-Type': 'text/plain' },
      keepalive: true,
      body: JSON.stringify({
        s: 'BF7JR89e',
        e: 'pageview',
        u: origin + pathname,
        vid,
        sid,
      }),
    }).catch(() => {});
    return true;
  } catch {
    // Storage restrictions also disable collection.
    return false;
  }
}
