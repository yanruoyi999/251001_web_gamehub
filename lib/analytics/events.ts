"use client";

import { track } from '@vercel/analytics';
import { trackEvent } from '@/lib/gtag';

type AnalyticsValue = string | number | boolean;
type AnalyticsProperties = Record<string, AnalyticsValue | null | undefined>;
type WindowWithClarity = Window & {
  clarity?: (...args: unknown[]) => void;
};

function cleanProperties(properties?: AnalyticsProperties): Record<string, AnalyticsValue> {
  if (!properties) return {};

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== null && value !== undefined),
  ) as Record<string, AnalyticsValue>;
}

function getGa4Properties(properties: Record<string, AnalyticsValue>) {
  const { source, ...ga4Properties } = properties;

  if (source !== undefined && ga4Properties.interaction_source === undefined) {
    ga4Properties.interaction_source = source;
  }

  return ga4Properties;
}

export function trackInteraction(eventName: string, properties?: AnalyticsProperties) {
  const cleanedProperties = cleanProperties(properties);

  track(eventName, cleanedProperties);
  trackEvent(eventName, getGa4Properties(cleanedProperties));

  if (typeof window !== 'undefined') {
    const clarity = (window as WindowWithClarity).clarity;
    if (typeof clarity === 'function') {
      clarity('event', eventName);
    }
  }
}
