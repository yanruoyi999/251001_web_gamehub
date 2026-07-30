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

  it('records GA4-compatible validation events without sending user selections', () => {
    const source = readFileSync(formPath, 'utf8');
    const eventNames = Array.from(
      source.matchAll(/trackInteraction\('([^']+)'/g),
      (match) => match[1],
    );
    const personalizedProperties =
      source.match(
        /trackInteraction\('game_radar_result_personalized',\s*\{([\s\S]*?)\}\);/,
      )?.[1] ?? '';

    expect(eventNames).toContain('game_radar_result_personalized');
    expect(eventNames).toContain('game_radar_report_intent_clicked');
    expect(eventNames.every((eventName) => eventName.length <= 40)).toBe(true);
    expect(source).toContain('mailto:dev@lumagamehub.com');
    expect(source).toContain("source: 'game_opportunity_radar'");
    expect(personalizedProperties).not.toContain('platform');
    expect(personalizedProperties).not.toContain('team');
    expect(personalizedProperties).not.toContain('budget');
    expect(personalizedProperties).not.toContain('timeline');
    expect(personalizedProperties).not.toContain('genre');
  });
});
