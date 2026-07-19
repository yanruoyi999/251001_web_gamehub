export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

type GtagParams = {
  page_path: string;
  page_location: string;
  page_title: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;

  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  } satisfies GtagParams);
};

export const trackEvent = (action: string, params: EventParams = {}) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', action, params);
};
