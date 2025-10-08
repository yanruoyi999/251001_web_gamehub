export const GA_TRACKING_ID =
  process.env.NEXT_PUBLIC_GA_ID ?? 'G-5T9XBE2WZD';

type GtagParams = {
  page_path: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;

  if (typeof window.gtag !== 'function') return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  } satisfies GtagParams);
};
