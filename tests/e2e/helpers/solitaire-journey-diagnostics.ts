import type { Locator, Page, TestInfo } from '@playwright/test';

import type { DailySolitaireGameState } from '../../../lib/games/daily-solitaire';

type Action = {
  step: number;
  kind: 'draw' | 'waste-select' | 'waste-foundation' | 'tableau-select' | 'tableau-foundation';
  card?: string;
};

function boundedAttachment(payload: Record<string, unknown>, ringKey: string) {
  const entries = [...payload[ringKey] as unknown[]];
  let dropped = 0;
  const encode = () => JSON.stringify({ ...payload, [ringKey]: entries, truncated: dropped > 0, droppedForSize: dropped }, null, 2);
  let json = encode();
  while (Buffer.byteLength(json) > 64 * 1024 && entries.length > 0) {
    entries.shift();
    dropped += 1;
    json = encode();
  }
  if (Buffer.byteLength(json) > 64 * 1024) json = '{"truncated":true,"payloadOmitted":true}';
  return Buffer.from(json);
}

// This function is serialized by addInitScript: all browser values stay local.
export function installAuditCapture({ solitaireDiagnostics }: { solitaireDiagnostics: boolean }) {
  type Board = {
    moves: string | null;
    foundations: Record<string, string | null>;
    selected: Array<{ card: string; source: 'tableau' | 'waste' }>;
    faceUp: string[];
    status: string | null;
    completed: string | null;
  };
  type RecordEntry = {
    sequence: number;
    kind: string;
    pageClockMs: number;
    board: Board;
    target?: string;
    hitTarget?: string;
    x?: number;
    y?: number;
    rect?: { x: number; y: number; width: number; height: number };
    auditEventCount: number;
    lastAuditEvent: string | null;
  };
  const captureWindow = window as typeof window & {
    auditEvents: string[];
    clarity: (...args: string[]) => void;
    solitaireJourneyDiagnostics?: {
      records: RecordEntry[];
      snapshot: () => Board | null;
      diagnosticErrorCount: number;
      setupFailed: boolean;
    };
  };
  captureWindow.auditEvents = [];
  captureWindow.clarity = (command, event) => {
    if (command === 'event' && typeof event === 'string') captureWindow.auditEvents.push(event);
  };
  if (!solitaireDiagnostics) return;

  const diagnosticState = {
    records: [] as RecordEntry[],
    snapshot: (): Board | null => null,
    diagnosticErrorCount: 0,
    setupFailed: false,
  };
  captureWindow.solitaireJourneyDiagnostics = diagnosticState;
  try {
  const cardPattern = /^(?:A|[2-9]|10|J|Q|K) of (?:spades|hearts|diamonds|clubs)$/;
  const wastePattern = /^Select ((?:A|[2-9]|10|J|Q|K) of (?:spades|hearts|diamonds|clubs)) from waste$/;
  const allowedAuditEvents = new Set([
    'daily_solitaire_started', 'daily_solitaire_move', 'daily_solitaire_draw',
    'daily_solitaire_invalid_move', 'daily_solitaire_finished', 'daily_solitaire_undo',
    'daily_solitaire_replay', 'daily_solitaire_hint',
  ]);
  const generatedButtonPattern = /^(?:(?:Spades|Hearts|Diamonds|Clubs) foundation|Select (?:A|[2-9]|10|J|Q|K) of (?:spades|hearts|diamonds|clubs) from waste|Draw(?: [13])?|Undo|Hint|Restart|Play today’s deal|Replay this deal|Tableau column [1-7])$/;
  const root = () => document.querySelector('[data-daily-solitaire]');
  const readBoard = (): Board | null => {
    const game = root();
    if (!game) return null;
    const buttons = Array.from(game.querySelectorAll('button'));
    const label = (button: Element) => button.getAttribute('aria-label') ?? '';
    const moves = Array.from(game.querySelectorAll('p')).find(p => p.textContent === 'Moves');
    const moveText = moves?.nextElementSibling?.textContent ?? '';
    const statusText = game.querySelector('[role="status"]')?.textContent?.trim();
    const statuses: Record<string, string> = {
      'Choose Play to begin this date’s deal.': 'ready',
      'Choose a face-up card, then a foundation or another tableau column.': 'selected',
      'Nice move. Keep an open lane for the next card.': 'moved',
      'That move is not available yet.': 'invalid',
      'Deal complete. Replay the same date to improve your score.': 'completed',
    };
    return {
      moves: /^\d{1,5}$/.test(moveText) ? moveText : null,
      foundations: Object.fromEntries(['Spades', 'Hearts', 'Diamonds', 'Clubs'].map(suit => [
        suit,
        (() => {
          const button = buttons.find(candidate => label(candidate) === `${suit} foundation`);
          if (!button) return null;
          const values = Array.from(button.querySelectorAll('span')).map(span => span.textContent?.trim());
          return values.find(value => /^(?:[0-9]|1[0-3])\/13$/.test(value ?? '')) ?? (values.includes('Empty') ? 'empty' : null);
        })(),
      ])),
      selected: buttons.filter(button => button.getAttribute('aria-pressed') === 'true')
        .flatMap<Board['selected'][number]>(button => {
          const value = label(button);
          if (cardPattern.test(value)) return [{ card: value, source: 'tableau' as const }];
          const waste = value.match(wastePattern);
          return waste ? [{ card: waste[1], source: 'waste' as const }] : [];
        }).slice(0, 2),
      faceUp: buttons.map(label).filter(value => cardPattern.test(value)).slice(0, 52),
      status: statusText ? statuses[statusText] ?? 'unknown' : null,
      completed: ['true', 'false'].includes(game.getAttribute('data-completed') ?? '') ? game.getAttribute('data-completed') : null,
    };
  };
  const snapshot = (): Board | null => {
    try { return readBoard(); } catch { diagnosticState.diagnosticErrorCount += 1; return null; }
  };
  diagnosticState.snapshot = snapshot;
  const describeTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return 'non-element';
    const game = root();
    if (!game?.contains(target)) return 'outside-game';
    const button = target.closest('button');
    if (!button) return 'game-non-button';
    const value = button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '';
    return cardPattern.test(value) || generatedButtonPattern.test(value) ? value : 'game-other-button';
  };
  const records = diagnosticState.records;
  let sequence = 0;
  const record = (kind: string, event?: Event) => {
    try {
    const board = snapshot();
    if (!board) return;
    const auditEvents = captureWindow.auditEvents.filter(value => allowedAuditEvents.has(value));
    const entry: RecordEntry = {
      sequence: ++sequence, kind, pageClockMs: performance.now(), board,
      auditEventCount: auditEvents.length, lastAuditEvent: auditEvents.at(-1) ?? null,
    };
    if (event) {
      entry.target = describeTarget(event.target);
      if (event instanceof MouseEvent) {
        entry.x = Math.round(event.clientX);
        entry.y = Math.round(event.clientY);
        entry.hitTarget = describeTarget(document.elementFromPoint(event.clientX, event.clientY));
      }
      const button = event.target instanceof Element ? event.target.closest('button') : null;
      if (button && root()?.contains(button)) {
        const bounds = button.getBoundingClientRect();
        entry.rect = { x: Math.round(bounds.x), y: Math.round(bounds.y), width: Math.round(bounds.width), height: Math.round(bounds.height) };
      }
    }
    records.push(entry);
    if (records.length > 64) records.shift();
    } catch { diagnosticState.diagnosticErrorCount += 1; }
  };
  for (const kind of ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'touchstart', 'touchend']) {
    document.addEventListener(kind, event => record(`${kind}-capture`, event), { capture: true, passive: true });
    document.addEventListener(kind, event => record(`${kind}-bubble`, event), { passive: true });
  }
  let previousBoard = '';
  new MutationObserver(() => {
    try {
    const board = snapshot();
    if (!board) return;
    const current = JSON.stringify(board);
    // Timer-only updates cannot evict the last input during a locator wait.
    if (current !== previousBoard) {
      previousBoard = current;
      record('board-change');
    }
    } catch { diagnosticState.diagnosticErrorCount += 1; }
  }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed', 'data-completed'] });
  } catch {
    diagnosticState.diagnosticErrorCount += 1;
    diagnosticState.setupFailed = true;
  }
}

export function createSolitaireJourneyDiagnostics(drawCount: 1 | 3) {
  const started = process.hrtime.bigint();
  const elapsed = () => Math.round(Number(process.hrtime.bigint() - started) / 1e3) / 1e3;
  const actions: Array<Action & {
    index: number;
    startMs: number;
    endMs?: number;
    outcome?: 'returned' | 'threw';
    errorType?: string;
    model: { moves: number; foundations: Record<string, number>; stock: number; waste: number };
  }> = [];
  const phases: Array<{ name: string; atMs: number }> = [{ name: 'test-start', atMs: 0 }];
  let actionCount = 0;
  return {
    phase(name: 'page-loaded' | 'helper-start' | 'helper-complete' | 'journey-complete') {
      if (phases.length < 8) phases.push({ name, atMs: elapsed() });
    },
    async click(locator: Locator, action: Action, state: DailySolitaireGameState) {
      const entry: (typeof actions)[number] = {
        ...action,
        card: action.card && /^(?:A|[2-9]|10|J|Q|K) of (?:spades|hearts|diamonds|clubs)$/.test(action.card) ? action.card : undefined,
        index: ++actionCount, startMs: elapsed(),
        model: {
          moves: state.moves,
          foundations: Object.fromEntries(Object.entries(state.foundations).map(([suit, cards]) => [suit, cards.length])),
          stock: state.stock.length,
          waste: state.waste.length,
        },
      };
      actions.push(entry);
      if (actions.length > 32) actions.shift();
      try {
        await locator.click();
        entry.outcome = 'returned';
      } catch (error) {
        entry.outcome = 'threw';
        entry.errorType = error instanceof Error ? error.name === 'TimeoutError' ? 'TimeoutError' : 'Error' : 'UnknownError';
        throw error;
      } finally {
        entry.endMs = elapsed();
      }
    },
    async attachFailure(page: Page, info: TestInfo) {
      const attach = async (name: string, body: Buffer) => {
        try { await info.attach(name, { body, contentType: 'application/json' }); } catch { /* Retain the original test failure. */ }
      };
      // Attempt host evidence first, before any potentially unavailable renderer.
      try {
        await attach('solitaire-journey-node', boundedAttachment({ version: 1, drawCount, hostElapsedMs: elapsed(), phases, actionCount, actions }, 'actions'));
      } catch {
        await attach('solitaire-journey-node-unavailable', Buffer.from('{"nodeCaptureFailed":true}'));
      }
      try {
        const browser = await page.evaluate(() => {
          const capture = window as typeof window & {
            auditEvents?: string[];
            solitaireJourneyDiagnostics?: { records: unknown[]; snapshot: () => unknown; diagnosticErrorCount: number; setupFailed: boolean };
          };
          return {
            records: capture.solitaireJourneyDiagnostics?.records ?? [],
            finalBoard: capture.solitaireJourneyDiagnostics?.snapshot() ?? null,
            diagnosticErrorCount: capture.solitaireJourneyDiagnostics?.diagnosticErrorCount ?? null,
            setupFailed: capture.solitaireJourneyDiagnostics?.setupFailed ?? null,
            auditEvents: (capture.auditEvents ?? []).filter(event => [
              'daily_solitaire_started', 'daily_solitaire_move', 'daily_solitaire_draw',
              'daily_solitaire_invalid_move', 'daily_solitaire_finished', 'daily_solitaire_undo',
              'daily_solitaire_replay', 'daily_solitaire_hint',
            ].includes(event)).slice(-6),
          };
        });
        await attach('solitaire-journey-browser', boundedAttachment(browser, 'records'));
      } catch {
        await attach('solitaire-journey-browser-unavailable', Buffer.from('{"browserReadFailed":true}'));
      }
    },
  };
}
