import { describe, expect, it } from 'vitest';

import { buildReport, type RuntimeResult } from '@/scripts/audit-runtime-quality';

describe('runtime quality report', () => {
  it('ends with exactly one newline so diff checks remain clean', () => {
    const result: RuntimeResult = {
      path: '/en',
      type: 'static',
      url: 'http://localhost:3000/en',
      status: 200,
      score: 100,
      responseStartMs: 10,
      loadMs: 20,
      domContentLoadedMs: 15,
      firstContentfulPaintMs: 18,
      totalTransferKb: 100,
      requestCount: 10,
      consoleErrors: 0,
      hasCanonical: true,
      robotsMeta: '',
      hasHorizontalOverflow: false,
      playButtonVisible: false,
      iframeElementVisibleAfterPlay: null,
      externalFrameLoaded: null,
      fullscreenButtonVisible: null,
      reason: 'passed',
    };

    const report = buildReport(
      [result],
      'http://localhost:3000',
      '2026-07-21T00:00:00.000Z',
    );

    expect(report).toMatch(/[^\n]\n$/);
  });

  it('never turns an intentionally unverified external frame into a success signal', () => {
    const result: RuntimeResult = {
      path: '/en/games/example',
      type: 'game',
      requiresPlayableIframe: true,
      url: 'http://localhost:3000/en/games/example',
      status: 200,
      score: 100,
      responseStartMs: 10,
      loadMs: 20,
      domContentLoadedMs: 15,
      firstContentfulPaintMs: 18,
      totalTransferKb: 100,
      requestCount: 10,
      consoleErrors: 0,
      hasCanonical: true,
      robotsMeta: '',
      hasHorizontalOverflow: false,
      playButtonVisible: true,
      iframeElementVisibleAfterPlay: true,
      externalFrameLoaded: null,
      fullscreenButtonVisible: true,
      reason: 'passed',
    };

    const report = buildReport([result], 'http://localhost:3000');

    expect(report).toContain('Iframe shell');
    expect(report).toContain('External load');
    expect(report).toContain('not-verified');
    expect(report).not.toContain('| yes | yes | yes | passed |');
  });
});
