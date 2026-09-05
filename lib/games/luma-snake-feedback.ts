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

export function getSnakeFeedbackTone(kind: SnakeFeedbackKind): SnakeFeedbackTone {
  return FEEDBACK_TONES[kind];
}
