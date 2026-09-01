import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import circleModule from '../../components/games/draw-a-perfect-circle/circle-game.tsx';

const { evaluateCircle, sampleCirclePoints } = circleModule;

const pageSource = await readFile(
  new URL('../../app/en/games/draw-a-perfect-circle/page.tsx', import.meta.url),
  'utf8',
);
const gameSource = await readFile(
  new URL('../../components/games/draw-a-perfect-circle/circle-game.tsx', import.meta.url),
  'utf8',
);

test('circle_canvas_pointer_touch scores a closed smooth circle and explains the result', () => {
  const smoothCircle = sampleCirclePoints({
    centerX: 160,
    centerY: 160,
    radius: 100,
    samples: 96,
  });
  const result = evaluateCircle(smoothCircle);

  assert.ok(result.totalScore >= 95);
  assert.ok(result.closureScore >= 98);
  assert.ok(result.roundnessScore >= 98);
  assert.ok(result.smoothnessScore >= 98);
  assert.match(result.explanation, /closed|round|smooth/i);
});

test('circle_canvas_pointer_touch penalizes an open or irregular stroke', () => {
  const circle = sampleCirclePoints({
    centerX: 160,
    centerY: 160,
    radius: 100,
    samples: 64,
  });
  const openStroke = circle.slice(0, 48);
  const irregularStroke = circle.map((point, index) => ({
    x: point.x + (index % 2 === 0 ? 36 : -28),
    y: point.y + (index % 3 === 0 ? 25 : -18),
  }));

  assert.ok(evaluateCircle(openStroke).closureScore < 70);
  assert.ok(evaluateCircle(irregularStroke).totalScore < evaluateCircle(circle).totalScore);
});

test('page keeps the exact canonical, local interaction, privacy, and link contract', () => {
  assert.match(pageSource, /draw a perfect circle/i);
  assert.match(pageSource, /https:\/\/www\.lumagamehub\.com\/en\/games\/draw-a-perfect-circle/);
  assert.match(pageSource, /robots[\s\S]*index:\s*false/);
  assert.match(pageSource, /href="\/en\/games\/connect-the-dots"/);
  assert.match(pageSource, /href="\/en\/games\/sorting-games"/);

  assert.match(gameSource, /onPointerDown/);
  assert.match(gameSource, /onPointerMove/);
  assert.match(gameSource, /onPointerUp/);
  assert.match(gameSource, /pointerType/);
  assert.match(gameSource, /touchAction:\s*'none'/);
  assert.match(gameSource, /Reset/);
  assert.match(gameSource, /Try again/);
  assert.doesNotMatch(gameSource, /fetch\(|sendBeacon|localStorage|sessionStorage|trackInteraction/);
  assert.doesNotMatch(gameSource, /raw_pointer|rawPointer/);
});
