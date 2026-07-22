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
      iframeVisibleAfterPlay: null,
      fullscreenButtonVisible: null,
      reason: 'passed',
    };

    const report = buildReport([result], 'http://localhost:3000', '2026-07-21T00:00:00.000Z');

    expect(report).toMatch(/[^\n]\n$/);
  });
});
