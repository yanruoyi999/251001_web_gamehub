import { describe, expect, it } from 'vitest';

import { getSeoLandingPage } from '@/lib/seo-landing-content';

describe('Big Tower Tiny Square long-tail support', () => {
  it('adds ending and game-order answers to the existing guide without a new URL', () => {
    const page = getSeoLandingPage('big-tower-tiny-square-walkthrough');
    const english = page?.locales.en;
    const text = [
      ...(english?.sections.flatMap(section => [
        section.title,
        section.body,
        ...(section.bullets ?? []),
      ]) ?? []),
      ...(english?.faqs.flatMap(faq => [faq.question, faq.answer]) ?? []),
    ].join(' ');

    expect(page?.keywords).toEqual(
      expect.arrayContaining([
        'big tower tiny square ending',
        'big tower tiny square games in order',
      ]),
    );
    expect(text).toMatch(/Ending and Game Order/);
    expect(text).toMatch(/Does Big Tower Tiny Square have an ending/);
    expect(text).toMatch(/play Big Tower Tiny Square first/);
  });
});
