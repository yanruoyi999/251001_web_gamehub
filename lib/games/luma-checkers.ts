export const CHECKERS_SIZE = 8;

export type CheckersPlayer = 'red' | 'black';

export type CheckersPiece = {
  player: CheckersPlayer;
  king: boolean;
};

export type CheckersSquare = {
  row: number;
  col: number;
};

export type CheckersMove = {
  from: CheckersSquare;
  to: CheckersSquare;
  captured?: CheckersSquare;
};

export type CheckersBoard = Array<Array<CheckersPiece | null>>;

export type CheckersState = {
  board: CheckersBoard;
  turn: CheckersPlayer;
  forcedFrom: CheckersSquare | null;
  winner: CheckersPlayer | null;
  moveCount: number;
};

export type CheckersDurationBucket =
  | 'under-30s'
  | '30s-to-3m'
  | '3m-to-10m'
  | 'over-10m'
  | 'invalid';

export function getCheckersDurationBucket(
  durationMs: number | null
): CheckersDurationBucket {
  if (durationMs === null || !Number.isFinite(durationMs) || durationMs < 0)
    return 'invalid';
  if (durationMs < 30_000) return 'under-30s';
  if (durationMs < 180_000) return '30s-to-3m';
  if (durationMs < 600_000) return '3m-to-10m';
  return 'over-10m';
}

const RED_START_ROWS = [5, 6, 7];
const BLACK_START_ROWS = [0, 1, 2];

function createBoard(): CheckersBoard {
  return Array.from({ length: CHECKERS_SIZE }, () =>
    Array<CheckersPiece | null>(CHECKERS_SIZE).fill(null)
  );
}

function isInside(square: CheckersSquare) {
  return (
    square.row >= 0 &&
    square.row < CHECKERS_SIZE &&
    square.col >= 0 &&
    square.col < CHECKERS_SIZE
  );
}

function isPlayableSquare(square: CheckersSquare) {
  return (square.row + square.col) % 2 === 1;
}

function otherPlayer(player: CheckersPlayer): CheckersPlayer {
  return player === 'red' ? 'black' : 'red';
}

function sameSquare(first: CheckersSquare, second: CheckersSquare) {
  return first.row === second.row && first.col === second.col;
}

function cloneBoard(board: CheckersBoard): CheckersBoard {
  return board.map(row => row.map(piece => (piece ? { ...piece } : null)));
}

function getDirections(
  piece: CheckersPiece
): Array<{ row: number; col: number }> {
  if (piece.king) {
    return [
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 },
    ];
  }

  const rowDirection = piece.player === 'red' ? -1 : 1;
  return [
    { row: rowDirection, col: -1 },
    { row: rowDirection, col: 1 },
  ];
}

function getCaptureMoves(
  board: CheckersBoard,
  from: CheckersSquare,
  piece: CheckersPiece
): CheckersMove[] {
  return getDirections(piece).flatMap(direction => {
    const captured = {
      row: from.row + direction.row,
      col: from.col + direction.col,
    };
    const to = {
      row: from.row + direction.row * 2,
      col: from.col + direction.col * 2,
    };

    if (
      !isInside(captured) ||
      !isInside(to) ||
      !isPlayableSquare(to) ||
      board[to.row][to.col] !== null
    ) {
      return [];
    }

    const capturedPiece = board[captured.row][captured.col];
    return capturedPiece && capturedPiece.player !== piece.player
      ? [{ from, to, captured }]
      : [];
  });
}

function getStepMoves(
  board: CheckersBoard,
  from: CheckersSquare,
  piece: CheckersPiece
): CheckersMove[] {
  return getDirections(piece).flatMap(direction => {
    const to = {
      row: from.row + direction.row,
      col: from.col + direction.col,
    };

    return isInside(to) &&
      isPlayableSquare(to) &&
      board[to.row][to.col] === null
      ? [{ from, to }]
      : [];
  });
}

function getPlayerSquares(board: CheckersBoard, player: CheckersPlayer) {
  const squares: CheckersSquare[] = [];
  for (let row = 0; row < CHECKERS_SIZE; row += 1) {
    for (let col = 0; col < CHECKERS_SIZE; col += 1) {
      if (board[row][col]?.player === player) squares.push({ row, col });
    }
  }
  return squares;
}

export function createCheckersState(): CheckersState {
  const board = createBoard();

  for (const row of BLACK_START_ROWS) {
    for (let col = 0; col < CHECKERS_SIZE; col += 1) {
      if (isPlayableSquare({ row, col }))
        board[row][col] = { player: 'black', king: false };
    }
  }
  for (const row of RED_START_ROWS) {
    for (let col = 0; col < CHECKERS_SIZE; col += 1) {
      if (isPlayableSquare({ row, col }))
        board[row][col] = { player: 'red', king: false };
    }
  }

  return { board, turn: 'red', forcedFrom: null, winner: null, moveCount: 0 };
}

export function getLegalMoves(
  state: CheckersState,
  player: CheckersPlayer = state.turn
): CheckersMove[] {
  if (state.winner || player !== state.turn) return [];

  const squares = state.forcedFrom
    ? [state.forcedFrom]
    : getPlayerSquares(state.board, player);
  const captures = squares.flatMap(from => {
    const piece = state.board[from.row][from.col];
    return piece?.player === player
      ? getCaptureMoves(state.board, from, piece)
      : [];
  });

  if (captures.length > 0 || state.forcedFrom) return captures;

  return squares.flatMap(from => {
    const piece = state.board[from.row][from.col];
    return piece?.player === player
      ? getStepMoves(state.board, from, piece)
      : [];
  });
}

function hasPieces(board: CheckersBoard, player: CheckersPlayer) {
  return board.some(row => row.some(piece => piece?.player === player));
}

function getWinnerForState(state: CheckersState): CheckersPlayer | null {
  const playerToMove = state.turn;
  const previousPlayer = otherPlayer(playerToMove);
  if (!hasPieces(state.board, playerToMove)) return previousPlayer;

  return getLegalMoves({ ...state, winner: null }).length === 0
    ? previousPlayer
    : null;
}

function matchesMove(first: CheckersMove, second: CheckersMove) {
  return (
    sameSquare(first.from, second.from) &&
    sameSquare(first.to, second.to) &&
    (first.captured === undefined
      ? second.captured === undefined
      : second.captured !== undefined &&
        sameSquare(first.captured, second.captured))
  );
}

export function applyCheckersMove(
  state: CheckersState,
  move: CheckersMove
): CheckersState {
  if (state.winner) throw new Error('The game is already complete.');

  const legalMove = getLegalMoves(state).find(candidate =>
    matchesMove(candidate, move)
  );
  if (!legalMove) throw new Error('That move is not legal.');

  const board = cloneBoard(state.board);
  const piece = board[legalMove.from.row][legalMove.from.col];
  if (!piece) throw new Error('The selected square is empty.');

  board[legalMove.from.row][legalMove.from.col] = null;
  if (legalMove.captured)
    board[legalMove.captured.row][legalMove.captured.col] = null;

  const promoted =
    !piece.king &&
    ((piece.player === 'red' && legalMove.to.row === 0) ||
      (piece.player === 'black' && legalMove.to.row === CHECKERS_SIZE - 1));
  const movedPiece = { ...piece, king: piece.king || promoted };
  board[legalMove.to.row][legalMove.to.col] = movedPiece;

  const intermediate: CheckersState = {
    board,
    turn: state.turn,
    forcedFrom: null,
    winner: null,
    moveCount: state.moveCount + 1,
  };
  const continuation =
    legalMove.captured && !promoted
      ? getCaptureMoves(board, legalMove.to, movedPiece)
      : [];

  if (continuation.length > 0)
    return { ...intermediate, forcedFrom: legalMove.to };

  const nextState: CheckersState = {
    ...intermediate,
    turn: otherPlayer(state.turn),
  };
  return { ...nextState, winner: getWinnerForState(nextState) };
}
