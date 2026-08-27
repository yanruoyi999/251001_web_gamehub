import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AsmrExperiences } from '@/components/game/asmr-experiences';
import { ConnectTheDots } from '@/components/game/connect-the-dots';
import { DailySolitaire } from '@/components/game/daily-solitaire';
import { MahjongConnect } from '@/components/game/mahjong-connect';
import { SortingLab } from '@/components/game/sorting-lab';

const reactGlobal = globalThis as typeof globalThis & { React?: typeof React };
const previousReact = reactGlobal.React;

beforeAll(() => {
  reactGlobal.React = React;
});

afterAll(() => {
  if (previousReact) reactGlobal.React = previousReact;
  else Reflect.deleteProperty(reactGlobal, 'React');
});

const games = [
  {
    name: 'Daily Solitaire',
    render: () => renderToStaticMarkup(createElement(DailySolitaire, { locale: 'en' })),
    controlMarker: 'Play today’s deal',
  },
  {
    name: 'Connect the Dots',
    render: () => renderToStaticMarkup(createElement(ConnectTheDots, { locale: 'en' })),
    controlMarker: 'Start board',
  },
  {
    name: 'Sorting Lab',
    render: () => renderToStaticMarkup(createElement(SortingLab, { locale: 'en' })),
    controlMarker: 'Start mode',
  },
  {
    name: 'Mahjong Connect',
    render: () => renderToStaticMarkup(createElement(MahjongConnect, { locale: 'en' })),
    controlMarker: 'Start level 1',
  },
  {
    name: 'ASMR Experiences',
    render: () => renderToStaticMarkup(createElement(AsmrExperiences, { locale: 'en' })),
    controlMarker: 'data-asmr-surface',
  },
] as const;

function openingButtonTag(html: string, marker: string) {
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing control marker: ${marker}`);

  const buttonStart = html.lastIndexOf('<button', markerIndex);
  const buttonEnd = html.indexOf('>', buttonStart);
  if (buttonStart < 0 || buttonEnd < 0) {
    throw new Error(`Missing button for control marker: ${marker}`);
  }

  return html.slice(buttonStart, buttonEnd + 1);
}

describe.each(games)('$name hydration gate', ({ render, controlMarker }) => {
  it('keeps the first interaction disabled in server-rendered HTML', () => {
    const html = render();

    expect(html).toContain('data-interactive-ready="false"');
    expect(openingButtonTag(html, controlMarker)).toContain('disabled=""');
  });
});
