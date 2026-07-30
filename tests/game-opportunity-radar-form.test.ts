import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { GameOpportunityRadarForm } from '@/components/creator/game-opportunity-radar-form';

describe('GameOpportunityRadarForm', () => {
  it('renders the English evaluator with labelled controls and its evidence boundary', () => {
    const html = renderToStaticMarkup(
      createElement(GameOpportunityRadarForm, { locale: 'en' }),
    );

    expect(html).toContain('MVP delivery fit');
    expect(html).toContain('Platform');
    expect(html).toContain('Browser / HTML5');
    expect(html).toContain('not a revenue forecast');
    expect(html).toContain('not sent to a server');
  });

  it('renders the Chinese evaluator and local-only privacy note', () => {
    const html = renderToStaticMarkup(
      createElement(GameOpportunityRadarForm, { locale: 'zh' }),
    );

    expect(html).toContain('MVP 可交付性');
    expect(html).toContain('目标平台');
    expect(html).toContain('不是收入预测');
    expect(html).toContain('不会发送到服务器');
  });
});
