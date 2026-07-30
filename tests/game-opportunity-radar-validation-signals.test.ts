import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const formPath = path.join(
  process.cwd(),
  'components/creator/game-opportunity-radar-form.tsx',
);

describe('Game Opportunity Radar validation signals', () => {
  it('labels the untouched result as an example instead of a personalized assessment', () => {
    const source = readFileSync(formPath, 'utf8');

    expect(source).toContain('默认示例');
    expect(source).toContain('Example defaults');
    expect(source).toContain('已按你的选择更新');
    expect(source).toContain('Updated for your choices');
  });

  it('records one personalized-result signal and report-intent clicks without sending selections', () => {
    const source = readFileSync(formPath, 'utf8');

    expect(source).toContain('game_opportunity_radar_result_personalized');
    expect(source).toContain('game_opportunity_radar_report_intent_clicked');
    expect(source).toContain("mailto:dev@lumagamehub.com");
    expect(source).toContain("source: 'game_opportunity_radar'");
    expect(source).not.toContain('trackInteraction(\n        \'game_opportunity_radar_result_personalized\',\n        { platform');
  });
});
