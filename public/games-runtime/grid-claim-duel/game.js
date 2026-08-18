(() => {
  'use strict';

  const GAME_SLUG = 'grid-claim-duel';
  const SIZE = 5;
  const board = document.getElementById('board');
  const scoreOne = document.getElementById('score-one');
  const scoreTwo = document.getElementById('score-two');
  const turnBanner = document.getElementById('turn-banner');

  const state = {
    cells: Array(SIZE * SIZE).fill(null),
    cursor: 12,
    turn: 'one',
    finished: false,
  };

  function score(owner) {
    return state.cells.filter((cell) => cell === owner).length;
  }

  function coordinates(index) {
    return { row: Math.floor(index / SIZE), column: index % SIZE };
  }

  function toIndex(row, column) {
    return row * SIZE + column;
  }

  function moveCursor(rowDelta, columnDelta) {
    if (state.finished) return;
    const { row, column } = coordinates(state.cursor);
    const nextRow = Math.max(0, Math.min(SIZE - 1, row + rowDelta));
    const nextColumn = Math.max(0, Math.min(SIZE - 1, column + columnDelta));
    state.cursor = toIndex(nextRow, nextColumn);
    render();
  }

  function claim() {
    if (state.finished || state.cells[state.cursor]) return;
    state.cells[state.cursor] = state.turn;
    state.turn = state.turn === 'one' ? 'two' : 'one';

    if (state.cells.every(Boolean)) {
      state.finished = true;
    }

    render();
  }

  function reset() {
    state.cells.fill(null);
    state.cursor = 12;
    state.turn = 'one';
    state.finished = false;
    render();
    board.focus({ preventScroll: true });
  }

  function render() {
    board.replaceChildren();
    state.cells.forEach((owner, index) => {
      const cell = document.createElement('div');
      cell.className = `cell${index === state.cursor ? ' cursor' : ''}`;
      if (owner) cell.dataset.owner = owner;
      cell.setAttribute('aria-label', `Cell ${index + 1}${owner ? ` claimed by ${owner === 'one' ? 'P1' : 'P2'}` : ''}`);
      cell.textContent = owner === 'one' ? 'P1' : owner === 'two' ? 'P2' : '';
      board.append(cell);
    });

    const one = score('one');
    const two = score('two');
    scoreOne.textContent = String(one);
    scoreTwo.textContent = String(two);

    if (state.finished) {
      const result = one === two ? 'Draw' : one > two ? 'P1 wins' : 'P2 wins';
      turnBanner.textContent = `${result} · Press R to restart`;
    } else if (state.turn === 'one') {
      turnBanner.textContent = 'P1 turn · move with WASD, claim with F';
    } else {
      turnBanner.textContent = 'P2 turn · move with arrow keys, claim with Enter';
    }
  }

  window.addEventListener('keydown', (event) => {
    if (state.finished && event.code === 'KeyR') {
      event.preventDefault();
      reset();
      return;
    }

    if (state.turn === 'one') {
      const moves = {
        KeyW: [-1, 0],
        KeyS: [1, 0],
        KeyA: [0, -1],
        KeyD: [0, 1],
      };
      const move = moves[event.code];
      if (move) {
        event.preventDefault();
        moveCursor(move[0], move[1]);
      } else if (event.code === 'KeyF') {
        event.preventDefault();
        claim();
      }
      return;
    }

    const moves = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const move = moves[event.code];
    if (move) {
      event.preventDefault();
      moveCursor(move[0], move[1]);
    } else if (event.code === 'Enter') {
      event.preventDefault();
      claim();
    }
  });

  render();
  window.parent.postMessage({ type: 'luma-game-ready', gameSlug: GAME_SLUG }, '*');
})();
