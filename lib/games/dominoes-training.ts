export type DominoSide = 'left' | 'right';

export interface DominoTile {
  id: string;
  left: number;
  right: number;
}

export interface DominoesTrainingScenario {
  id: string;
  title: string;
  board: DominoTile[];
  hand: DominoTile[];
  answer: {
    tileId: string;
    side: DominoSide;
  };
  hint: string;
  explanation: string;
}

export interface DominoesTrainingState {
  scenarioIndex: number;
  board: DominoTile[];
  hand: DominoTile[];
  attempts: number;
  completed: boolean;
}

export interface DominoesMoveInput {
  board: DominoTile[];
  hand: DominoTile[];
  tileId: string;
  side: DominoSide;
}

export interface DominoesMoveResult {
  legal: boolean;
  connectedEnd: number | null;
  reason: string;
  tile?: DominoTile;
}

export function createDominoTile(left: number, right: number): DominoTile {
  const low = Math.min(left, right);
  const high = Math.max(left, right);
  return { id: `${low}-${high}`, left: low, right: high };
}

export function createDoubleSixSet(): DominoTile[] {
  const tiles: DominoTile[] = [];

  for (let left = 0; left <= 6; left += 1) {
    for (let right = left; right <= 6; right += 1) {
      tiles.push(createDominoTile(left, right));
    }
  }

  return tiles;
}

export function getDominoEnds(board: DominoTile[]) {
  if (board.length === 0) {
    return { left: null, right: null } as const;
  }

  return {
    left: board[0].left,
    right: board[board.length - 1].right,
  } as const;
}

function matchesEnd(tile: DominoTile, end: number | null) {
  return end === null || tile.left === end || tile.right === end;
}

function formatSide(side: DominoSide) {
  return side === 'left' ? 'left' : 'right';
}

function orientTileForSide(tile: DominoTile, side: DominoSide, end: number | null) {
  if (end === null) return tile;

  if (side === 'left') {
    return tile.right === end
      ? tile
      : { ...tile, left: tile.right, right: tile.left };
  }

  return tile.left === end
    ? tile
    : { ...tile, left: tile.right, right: tile.left };
}

export function evaluateDominoMove(input: DominoesMoveInput): DominoesMoveResult {
  const tile = input.hand.find((candidate) => candidate.id === input.tileId);
  if (!tile) {
    return {
      legal: false,
      connectedEnd: null,
      reason: 'That tile is not in the current hand.',
    };
  }

  const ends = getDominoEnds(input.board);
  const connectedEnd = input.side === 'left' ? ends.left : ends.right;

  if (matchesEnd(tile, connectedEnd)) {
    return {
      legal: true,
      connectedEnd,
      reason:
        connectedEnd === null
          ? `Legal move: start the chain with ${tile.id}.`
          : `Legal move: connect ${tile.id} to the ${formatSide(input.side)} end at ${connectedEnd}.`,
      tile,
    };
  }

  return {
    legal: false,
    connectedEnd,
    reason: `This tile does not match the ${formatSide(input.side)} end. It needs ${connectedEnd}, but it has ${tile.left} and ${tile.right}.`,
    tile,
  };
}

export function submitDominoMove(
  state: DominoesTrainingState,
  tileId: string,
  side: DominoSide,
): { move: DominoesMoveResult; state: DominoesTrainingState } {
  const move = evaluateDominoMove({
    board: state.board,
    hand: state.hand,
    tileId,
    side,
  });
  const attempts = state.attempts + 1;

  if (!move.legal || !move.tile) {
    return {
      move,
      state: { ...state, attempts },
    };
  }

  const ends = getDominoEnds(state.board);
  const orientedTile = orientTileForSide(
    move.tile,
    side,
    side === 'left' ? ends.left : ends.right,
  );
  const nextScenarioIndex = state.scenarioIndex + 1;
  const nextScenario = DOMINO_TRAINING_SCENARIOS[nextScenarioIndex];

  if (!nextScenario) {
    return {
      move,
      state: {
        ...state,
        board: side === 'left' ? [orientedTile, ...state.board] : [...state.board, orientedTile],
        hand: state.hand.filter((tile) => tile.id !== tileId),
        attempts,
        completed: true,
      },
    };
  }

  return {
    move,
    state: {
      scenarioIndex: nextScenarioIndex,
      board: nextScenario.board,
      hand: nextScenario.hand,
      attempts,
      completed: false,
    },
  };
}

const scenario = (
  id: string,
  title: string,
  board: Array<[number, number]>,
  hand: Array<[number, number]>,
  answer: { tileId: string; side: DominoSide },
  hint: string,
  explanation: string,
): DominoesTrainingScenario => ({
  id,
  title,
  board: board.map(([left, right]) => ({ id: `${left}-${right}`, left, right })),
  hand: hand.map(([left, right]) => createDominoTile(left, right)),
  answer,
  hint,
  explanation,
});

export const DOMINO_TRAINING_SCENARIOS: DominoesTrainingScenario[] = [
  scenario(
    'ends-1',
    'Read both open ends',
    [[1, 6], [6, 4]],
    [[2, 3], [4, 5], [0, 0]],
    { tileId: '4-5', side: 'right' },
    'The right end is 4. Find a tile that contains 4.',
    'The chain ends in 4 on the right, so 4-5 is a legal connection.',
  ),
  scenario(
    'ends-2',
    'Match the left end',
    [[2, 5]],
    [[1, 2], [3, 4], [5, 6]],
    { tileId: '1-2', side: 'left' },
    'The left end is 2, even though the right end is 5.',
    'A tile can be turned around. 1-2 connects to the left end through its 2.',
  ),
  scenario(
    'ends-3',
    'Doubles still expose one number',
    [[0, 3], [3, 3]],
    [[2, 2], [3, 6], [4, 5]],
    { tileId: '3-6', side: 'right' },
    'A double 3 still leaves 3 as the open right number.',
    'The right side is 3. The 3-6 tile fits and opens a 6.',
  ),
  scenario(
    'ends-4',
    'Use a matching pip, not a similar value',
    [[4, 4]],
    [[0, 1], [1, 5], [2, 4]],
    { tileId: '2-4', side: 'right' },
    'Only one tile in the hand contains the open number 4.',
    'The 2-4 tile matches the 4 on the right. The 1-5 tile does not.',
  ),
  scenario(
    'ends-5',
    'Flip a tile when the other side matches',
    [[6, 2], [2, 1]],
    [[0, 6], [1, 3], [4, 5]],
    { tileId: '0-6', side: 'left' },
    'The left end is 6. The matching 6 is on the second half of the tile.',
    'Dominoes may be rotated. Turn 0-6 so the 6 touches the left end.',
  ),
  scenario(
    'ends-6',
    'Choose the side before the tile',
    [[3, 5], [5, 0]],
    [[2, 6], [0, 4], [1, 1]],
    { tileId: '0-4', side: 'right' },
    'The right end is 0. The 0-4 tile belongs on the right.',
    'The side matters: 0-4 fits the right end because it contains 0.',
  ),
  scenario(
    'ends-7',
    'Build from the current end',
    [[1, 1], [1, 4]],
    [[4, 6], [2, 3], [5, 5]],
    { tileId: '4-6', side: 'right' },
    'Ignore the earlier 1. The active right end is 4.',
    'Only the exposed end controls the next connection. 4-6 opens a 6.',
  ),
  scenario(
    'ends-8',
    'Finish with the other end',
    [[2, 6], [6, 3]],
    [[0, 2], [3, 5], [1, 4]],
    { tileId: '0-2', side: 'left' },
    'The left end is 2, not 3.',
    '0-2 connects to the left 2 and leaves 0 at the outside of the chain.',
  ),
];
