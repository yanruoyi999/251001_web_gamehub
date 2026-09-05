export const SOLITAIRE_PROGRESS_KEY = 'luma-daily-solitaire:progress:v1';
export interface SolitaireProgress { version: 1; completedDates: string[] }

export function isSolitaireDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}

export function decodeSolitaireProgress(raw: string | null): SolitaireProgress {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1 ||
      !('completedDates' in value) || !Array.isArray(value.completedDates)) throw new Error('Invalid progress');
    return { version: 1, completedDates: [...new Set(value.completedDates.filter(isSolitaireDateKey))].sort() };
  } catch {
    return { version: 1, completedDates: [] };
  }
}

export function recordSolitaireCompletion(progress: SolitaireProgress, challengeDate: string, playedDate: string): SolitaireProgress {
  // A historical replay must not invent a visit on the historical calendar day.
  if (challengeDate !== playedDate || !isSolitaireDateKey(playedDate)) return progress;
  return { version: 1, completedDates: [...new Set([...progress.completedDates, playedDate])].sort() };
}

export function getSolitaireStreak(progress: SolitaireProgress, today: string): number {
  if (!isSolitaireDateKey(today)) return 0;
  const days = new Set(progress.completedDates);
  const cursor = new Date(`${today}T00:00:00.000Z`);
  if (!days.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function readSolitaireBest(raw: string | null): number {
  try {
    const value = JSON.parse(raw ?? 'null') as { best?: unknown } | null;
    const best = value?.best;
    return typeof best === 'number' && Number.isFinite(best) && best >= 0 && best <= 1000 ? best : 0;
  } catch { return 0; }
}
