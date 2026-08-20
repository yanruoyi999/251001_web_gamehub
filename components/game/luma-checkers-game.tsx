'use client';

import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import {
  applyCheckersMove,
  CHECKERS_SIZE,
  createCheckersState,
  getCheckersDurationBucket,
  getLegalMoves,
  type CheckersMove,
  type CheckersPlayer,
  type CheckersSquare,
  type CheckersState,
} from '@/lib/games/luma-checkers';

type GameLocale = 'zh' | 'en';
type GamePhase = 'idle' | 'playing' | 'complete';

const copy = {
  en: {
    eyebrow: 'Luma original rules trainer',
    helper:
      'Select a piece, then a highlighted destination. The board enforces captures and promotions.',
    start: 'Start a game',
    newGame: 'New game',
    retry: 'Play again',
    redTurn: 'Red to move',
    blackTurn: 'Black to move',
    red: 'Red',
    black: 'Black',
    winner: 'wins',
    moves: 'Moves',
    captureRequired: 'A capture is required this turn.',
    forcedJump: 'Continue the capture with the same piece.',
    boardLabel: 'Luma Checkers board',
    pieceLabel: (player: CheckersPlayer, king: boolean) =>
      `${player}${king ? ' king' : ' piece'}`,
    emptySquare: 'empty playable square',
    unplayableSquare: 'unplayable square',
    localNote:
      'Original local two-player trainer. No account, matchmaking, board upload, or player profile is used.',
  },
  zh: {
    eyebrow: 'Luma 原创规则训练器',
    helper: '先选择棋子，再选择高亮落点。棋盘会自动执行强制吃子和升王规则。',
    start: '开始对局',
    newGame: '新开一局',
    retry: '再来一局',
    redTurn: '红方回合',
    blackTurn: '黑方回合',
    red: '红方',
    black: '黑方',
    winner: '获胜',
    moves: '步数',
    captureRequired: '本回合必须吃子。',
    forcedJump: '请继续使用同一个棋子跳吃。',
    boardLabel: 'Luma Checkers 棋盘',
    pieceLabel: (player: CheckersPlayer, king: boolean) =>
      `${player === 'red' ? '红方' : '黑方'}${king ? '王' : '棋子'}`,
    emptySquare: '空的可走格',
    unplayableSquare: '不可走格',
    localNote: '原创本地双人训练器，不需要账号、匹配、上传棋盘或玩家资料。',
  },
} as const;

function sameSquare(first: CheckersSquare, second: CheckersSquare) {
  return first.row === second.row && first.col === second.col;
}

function squareKey(square: CheckersSquare) {
  return `${square.row}-${square.col}`;
}

function isPlayableSquare(row: number, col: number) {
  return (row + col) % 2 === 1;
}

function getMoveType(move: CheckersMove) {
  return move.captured ? 'capture' : 'step';
}

export function LumaCheckersGame({ locale }: { locale: GameLocale }) {
  const content = copy[locale];
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [state, setState] = useState<CheckersState>(() =>
    createCheckersState()
  );
  const [selected, setSelected] = useState<CheckersSquare | null>(null);
  const [lastMove, setLastMove] = useState<CheckersMove | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    trackInteraction('checkers_game_ready', {
      game_slug: 'luma-checkers',
      mode: 'local-two-player',
    });
  }, []);

  const legalMoves = useMemo(() => getLegalMoves(state), [state]);
  const selectedMoves = useMemo(
    () =>
      selected
        ? legalMoves.filter(move => sameSquare(move.from, selected))
        : [],
    [legalMoves, selected]
  );
  const captureRequired = legalMoves.some(move => move.captured);
  const status = state.winner
    ? `${state.winner === 'red' ? content.red : content.black} ${content.winner}`
    : state.turn === 'red'
      ? content.redTurn
      : content.blackTurn;

  const startGame = useCallback(() => {
    const isRetry = phase === 'complete' || state.moveCount > 0;
    setPhase('playing');
    setState(createCheckersState());
    setSelected(null);
    setLastMove(null);
    startedAtRef.current = performance.now();
    trackInteraction(isRetry ? 'checkers_retry' : 'checkers_game_start', {
      game_slug: 'luma-checkers',
      mode: 'local-two-player',
    });
  }, [phase, state.moveCount]);

  const handleSquareClick = useCallback(
    (square: CheckersSquare) => {
      if (phase !== 'playing' || state.winner) return;

      const piece = state.board[square.row][square.col];
      const destinationMove = selectedMoves.find(move =>
        sameSquare(move.to, square)
      );
      if (destinationMove) {
        const nextState = applyCheckersMove(state, destinationMove);
        const durationMs =
          startedAtRef.current === null
            ? null
            : performance.now() - startedAtRef.current;
        setState(nextState);
        setLastMove(destinationMove);
        setSelected(nextState.forcedFrom);
        trackInteraction('checkers_move_attempt', {
          game_slug: 'luma-checkers',
          mode: 'local-two-player',
          valid: true,
          move_type: getMoveType(destinationMove),
          continuation: nextState.forcedFrom !== null,
        });
        if (nextState.winner) {
          setPhase('complete');
          trackInteraction('checkers_game_complete', {
            game_slug: 'luma-checkers',
            winner: nextState.winner,
            move_count: nextState.moveCount,
            duration_bucket: getCheckersDurationBucket(durationMs),
          });
        }
        return;
      }

      if (piece?.player === state.turn) {
        const pieceMoves = legalMoves.filter(move =>
          sameSquare(move.from, square)
        );
        if (pieceMoves.length > 0) {
          setSelected(square);
          return;
        }
        trackInteraction('checkers_move_attempt', {
          game_slug: 'luma-checkers',
          mode: 'local-two-player',
          valid: false,
          reason: 'piece_has_no_legal_move',
        });
        return;
      }

      if (selected) {
        trackInteraction('checkers_move_attempt', {
          game_slug: 'luma-checkers',
          mode: 'local-two-player',
          valid: false,
          reason: 'illegal_destination',
        });
        setSelected(null);
      }
    },
    [legalMoves, phase, selected, selectedMoves, state]
  );

  return (
    <section className="space-y-5" aria-labelledby="luma-checkers-title">
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            {content.eyebrow}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {content.helper}
          </p>
        </div>
        {phase === 'idle' ? (
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={startGame}
            data-checkers-play="true"
          >
            {content.start}
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={startGame}
            data-checkers-reset="true"
          >
            <RotateCcw aria-hidden="true" size={17} />
            {phase === 'complete' ? content.retry : content.newGame}
          </button>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,560px)_minmax(240px,1fr)] lg:items-start">
        <div
          className="mx-auto w-full max-w-[560px] overflow-hidden rounded-md border border-border bg-[#101b25] p-2 shadow-lg shadow-slate-950/10 sm:p-4"
          data-checkers-stage="true"
          data-checkers-phase={phase}
        >
          <div
            className="grid aspect-square grid-cols-8 overflow-hidden rounded-md border border-slate-700"
            role="grid"
            aria-label={content.boardLabel}
          >
            {Array.from(
              { length: CHECKERS_SIZE * CHECKERS_SIZE },
              (_, index) => {
                const row = Math.floor(index / CHECKERS_SIZE);
                const col = index % CHECKERS_SIZE;
                const square = { row, col };
                const piece = state.board[row][col];
                const playable = isPlayableSquare(row, col);
                const isSelected = selected
                  ? sameSquare(selected, square)
                  : false;
                const isDestination = selectedMoves.some(move =>
                  sameSquare(move.to, square)
                );
                const isLastMove =
                  lastMove !== null &&
                  (sameSquare(lastMove.from, square) ||
                    sameSquare(lastMove.to, square));

                return (
                  <button
                    key={squareKey(square)}
                    type="button"
                    aria-label={
                      piece
                        ? content.pieceLabel(piece.player, piece.king)
                        : playable
                          ? content.emptySquare
                          : content.unplayableSquare
                    }
                    aria-pressed={isSelected}
                    disabled={phase !== 'playing' || !playable}
                    onClick={() => handleSquareClick(square)}
                    data-checkers-square={squareKey(square)}
                    className={`relative flex aspect-square min-h-0 items-center justify-center transition focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${playable ? 'bg-[#2f5a59] hover:bg-[#3a706d]' : 'bg-[#d9c7a2]'} ${isSelected ? 'ring-4 ring-inset ring-[#ffc857]' : ''} ${isDestination ? 'after:absolute after:h-3 after:w-3 after:rounded-full after:bg-[#ffc857] after:shadow-[0_0_0_5px_rgba(255,200,87,0.2)] sm:after:h-4 sm:after:w-4' : ''} ${isLastMove ? 'brightness-110' : ''}`}
                  >
                    {piece && (
                      <span
                        className={`relative z-10 flex h-[72%] w-[72%] items-center justify-center rounded-full border-2 shadow-md ${piece.player === 'red' ? 'border-red-200/70 bg-[#e86565]' : 'border-slate-200/70 bg-[#263442]'} ${piece.king ? 'ring-2 ring-[#ffc857] ring-offset-2 ring-offset-transparent' : ''}`}
                      >
                        {piece.king && (
                          <span className="text-xs font-black text-[#ffc857] sm:text-sm">
                            K
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <aside
          className="space-y-4 rounded-md border border-border bg-card p-5"
          aria-live="polite"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {phase === 'complete' ? content.winner : content.moves}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {phase === 'idle' ? content.start : status}
            </p>
          </div>
          {phase !== 'idle' && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-border bg-background p-3">
                <p className="text-muted-foreground">{content.moves}</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                  {state.moveCount}
                </p>
              </div>
              <div className="rounded-md border border-border bg-background p-3">
                <p className="text-muted-foreground">
                  {captureRequired ? content.captureRequired : content.moves}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {state.forcedFrom ? content.forcedJump : status}
                </p>
              </div>
            </div>
          )}
          <p className="text-sm leading-6 text-muted-foreground">
            {content.localNote}
          </p>
        </aside>
      </div>
    </section>
  );
}
