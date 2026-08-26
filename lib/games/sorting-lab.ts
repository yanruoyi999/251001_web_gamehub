export type SortingMode = 'color' | 'shape' | 'size' | 'pattern';

export interface SortingOption {
  id: string;
  label: string;
  token: string;
}

export interface SortingChallenge {
  id: string;
  mode: SortingMode;
  level: 1 | 2 | 3;
  prompt: string;
  options: SortingOption[];
  answer: string;
  explanation: string;
}

const CHALLENGES: Record<SortingMode, [SortingChallenge, SortingChallenge, SortingChallenge]> = {
  color: [
    {
      id: 'color-1', mode: 'color', level: 1, prompt: 'Which group is a warm color?',
      options: [{ id: 'coral', label: 'Coral', token: 'bg-rose-300' }, { id: 'sky', label: 'Sky', token: 'bg-sky-300' }, { id: 'mint', label: 'Mint', token: 'bg-emerald-300' }],
      answer: 'coral', explanation: 'Coral belongs to the warm-color group in this round.',
    },
    {
      id: 'color-2', mode: 'color', level: 2, prompt: 'Sort the cool color family.',
      options: [{ id: 'amber', label: 'Amber', token: 'bg-amber-300' }, { id: 'violet', label: 'Violet', token: 'bg-violet-300' }, { id: 'orange', label: 'Orange', token: 'bg-orange-300' }],
      answer: 'violet', explanation: 'Violet is the cool family choice here.',
    },
    {
      id: 'color-3', mode: 'color', level: 3, prompt: 'Which tile is a green family color?',
      options: [{ id: 'teal', label: 'Teal', token: 'bg-teal-300' }, { id: 'red', label: 'Red', token: 'bg-red-300' }, { id: 'gold', label: 'Gold', token: 'bg-yellow-300' }],
      answer: 'teal', explanation: 'Teal is the green family tile in this set.',
    },
  ],
  shape: [
    {
      id: 'shape-1', mode: 'shape', level: 1, prompt: 'Pick the shape with three sides.',
      options: [{ id: 'circle', label: 'Circle', token: '●' }, { id: 'triangle', label: 'Triangle', token: '▲' }, { id: 'square', label: 'Square', token: '■' }],
      answer: 'triangle', explanation: 'A triangle has three sides.',
    },
    {
      id: 'shape-2', mode: 'shape', level: 2, prompt: 'Pick the shape with no corners.',
      options: [{ id: 'diamond', label: 'Diamond', token: '◆' }, { id: 'circle', label: 'Circle', token: '●' }, { id: 'hexagon', label: 'Hexagon', token: '⬢' }],
      answer: 'circle', explanation: 'A circle has no corners in this simple shape set.',
    },
    {
      id: 'shape-3', mode: 'shape', level: 3, prompt: 'Pick the shape with four equal sides.',
      options: [{ id: 'star', label: 'Star', token: '✦' }, { id: 'square', label: 'Square', token: '■' }, { id: 'triangle', label: 'Triangle', token: '▲' }],
      answer: 'square', explanation: 'The square is the four-equal-side choice.',
    },
  ],
  size: [
    {
      id: 'size-1', mode: 'size', level: 1, prompt: 'Choose the smallest tile.',
      options: [{ id: 'small', label: 'Small', token: 'w-8' }, { id: 'large', label: 'Large', token: 'w-16' }, { id: 'medium', label: 'Medium', token: 'w-12' }],
      answer: 'small', explanation: 'Small is the first size in the local scale.',
    },
    {
      id: 'size-2', mode: 'size', level: 2, prompt: 'Choose the middle size.',
      options: [{ id: 'large', label: 'Large', token: 'w-16' }, { id: 'medium', label: 'Medium', token: 'w-12' }, { id: 'small', label: 'Small', token: 'w-8' }],
      answer: 'medium', explanation: 'Medium sits between small and large.',
    },
    {
      id: 'size-3', mode: 'size', level: 3, prompt: 'Choose the largest tile.',
      options: [{ id: 'medium', label: 'Medium', token: 'w-12' }, { id: 'small', label: 'Small', token: 'w-8' }, { id: 'large', label: 'Large', token: 'w-16' }],
      answer: 'large', explanation: 'Large is the widest tile in the local scale.',
    },
  ],
  pattern: [
    {
      id: 'pattern-1', mode: 'pattern', level: 1, prompt: 'Choose the striped pattern.',
      options: [{ id: 'solid', label: 'Solid', token: '▰' }, { id: 'dots', label: 'Dots', token: '•••' }, { id: 'stripe', label: 'Stripe', token: '///' }],
      answer: 'stripe', explanation: 'The diagonal marks represent the stripe pattern.',
    },
    {
      id: 'pattern-2', mode: 'pattern', level: 2, prompt: 'Choose the dotted pattern.',
      options: [{ id: 'stripe', label: 'Stripe', token: '///' }, { id: 'dots', label: 'Dots', token: '•••' }, { id: 'solid', label: 'Solid', token: '▰' }],
      answer: 'dots', explanation: 'The repeated points represent the dotted pattern.',
    },
    {
      id: 'pattern-3', mode: 'pattern', level: 3, prompt: 'Choose the solid pattern.',
      options: [{ id: 'dots', label: 'Dots', token: '•••' }, { id: 'solid', label: 'Solid', token: '▰' }, { id: 'stripe', label: 'Stripe', token: '///' }],
      answer: 'solid', explanation: 'The filled block represents the solid pattern.',
    },
  ],
};

export const SORTING_MODES: SortingMode[] = ['color', 'shape', 'size', 'pattern'];

export function getSortingChallenge(mode: SortingMode, level: number): SortingChallenge {
  const safeLevel = Math.min(3, Math.max(1, level)) as 1 | 2 | 3;
  return CHALLENGES[mode][safeLevel - 1];
}

export function evaluateSortingAnswer(challenge: SortingChallenge, optionId: string) {
  return challenge.answer === optionId;
}
