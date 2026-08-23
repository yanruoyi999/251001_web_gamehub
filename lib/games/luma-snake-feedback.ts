export type SnakeFeedbackKind = 'eat' | 'milestone' | 'game-over';

export type SnakeFeedbackTone = {
  frequencyHz: number;
  durationMs: number;
  gain: number;
  type: OscillatorType;
};

const FEEDBACK_TONES: Record<SnakeFeedbackKind, SnakeFeedbackTone> = {
  eat: {
    frequencyHz: 520,
    durationMs: 55,
    gain: 0.045,
    type: 'sine',
  },
  milestone: {
    frequencyHz: 760,
    durationMs: 110,
    gain: 0.055,
    type: 'triangle',
  },
  'game-over': {
    frequencyHz: 190,
    durationMs: 190,
    gain: 0.06,
    type: 'sawtooth',
  },
};

const SCORE_MILESTONES = [5, 10, 20, 30] as const;

export function getSnakeFeedbackTone(kind: SnakeFeedbackKind): SnakeFeedbackTone {
  return FEEDBACK_TONES[kind];
}

export function getSnakeScoreMilestone(
  previousScore: number,
  nextScore: number
): number | null {
  if (!Number.isFinite(previousScore) || !Number.isFinite(nextScore)) return null;
  if (nextScore <= previousScore) return null;

  return (
    SCORE_MILESTONES.find(
      (milestone) => previousScore < milestone && nextScore >= milestone
    ) ?? null
  );
}
