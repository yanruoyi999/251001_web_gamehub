import { describe, expect, it } from 'vitest';
import {
  decodeSolitaireProgress, recordSolitaireCompletion, getSolitaireStreak,
  isSolitaireDateKey, readSolitaireBest,
} from '@/lib/games/daily-solitaire-progress';

describe('daily solitaire calendar and safe local records', () => {
  it('deduplicates wins and increases only across consecutive actual daily challenges', () => {
    let progress = decodeSolitaireProgress(null);
    progress = recordSolitaireCompletion(progress, '2026-09-04', '2026-09-04');
    progress = recordSolitaireCompletion(progress, '2026-09-04', '2026-09-04');
    expect(progress.completedDates).toEqual(['2026-09-04']);
    expect(getSolitaireStreak(progress, '2026-09-05')).toBe(1);
    progress = recordSolitaireCompletion(progress, '2026-09-05', '2026-09-05');
    expect(getSolitaireStreak(progress, '2026-09-05')).toBe(2);
    expect(getSolitaireStreak(progress, '2026-09-07')).toBe(0);
  });
  it('does not turn replaying a past or future challenge into a fabricated streak', () => {
    const empty = decodeSolitaireProgress(null);
    expect(recordSolitaireCompletion(empty, '2026-09-03', '2026-09-05')).toEqual(empty);
    expect(recordSolitaireCompletion(empty, '2026-09-06', '2026-09-05')).toEqual(empty);
  });
  it('handles year and leap-day boundaries and rejects overflowed dates', () => {
    const progress = decodeSolitaireProgress(JSON.stringify({ version: 1, completedDates: ['2024-02-28', '2024-02-29', '2024-03-01', '2024-02-29'] }));
    expect(getSolitaireStreak(progress, '2024-03-01')).toBe(3);
    expect(isSolitaireDateKey('2026-02-29')).toBe(false);
    expect(isSolitaireDateKey('2026-02-31')).toBe(false);
    expect(isSolitaireDateKey('')).toBe(false);
    expect(getSolitaireStreak({ version: 1, completedDates: ['2025-12-31', '2026-01-01'] }, '2026-01-01')).toBe(2);
  });
  it.each([null, '', '{bad', 'null', '[]', '{"version":2,"completedDates":["2026-09-05"]}'])('recovers malformed progress %j', raw => {
    expect(decodeSolitaireProgress(raw)).toEqual({ version: 1, completedDates: [] });
  });
  it('preserves valid legacy per-date best, never interprets legacy repeat wins as daily activity', () => {
    expect(readSolitaireBest('{"best":720,"streak":10}')).toBe(720);
    expect(decodeSolitaireProgress('{"best":720,"streak":10}').completedDates).toEqual([]);
    for (const raw of ['null', '{"best":-1}', '{"best":"999"}', '{"best":999999}', '{bad']) expect(readSolitaireBest(raw)).toBe(0);
  });
});
