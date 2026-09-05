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

  let session = null;
  let parentOrigin = null;
  let firstInput = false;
  let inputSent = false;

  function signalReady() {
    if (!session || !parentOrigin) return;
    window.parent.postMessage({ type: 'luma-game-ready', gameSlug: GAME_SLUG, session }, parentOrigin);
    signalInput();
  }

  function signalInput(event) {
    if (event && event.isTrusted) firstInput = true;
    if (!firstInput || inputSent || !session || !parentOrigin) return;
    inputSent = true;
    window.parent.postMessage({ type: 'luma-game-input', gameSlug: GAME_SLUG, session }, parentOrigin);
  }

  function score(owner) {
    return state.cells.filter((cell) => cell === owner).length;
  }

  function coordinates(index) {
    return { row: Math.floor(index / SIZE), column: index % SIZE };
  }

  function toIndex(row, column) {
    return row * SIZE + column;
  }

  function moveCursor(rowDelta, columnDelta, event) {
    if (state.finished) return;
    const { row, column } = coordinates(state.cursor);
    const nextRow = Math.max(0, Math.min(SIZE - 1, row + rowDelta));
    const nextColumn = Math.max(0, Math.min(SIZE - 1, column + columnDelta));
    const nextCursor = toIndex(nextRow, nextColumn);
    if (nextCursor !== state.cursor) signalInput(event);
    state.cursor = nextCursor;
    render();
  }

  function claim(event) {
    if (state.finished || state.cells[state.cursor]) return;
    signalInput(event);
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

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (
      event.source === window.parent &&
      event.origin === window.location.origin &&
      message && typeof message === 'object' &&
      typeof message.session === 'string' && /^[a-zA-Z0-9-]{16,128}$/.test(message.session) &&
      message.type === 'luma-parent-ready' &&
      message.gameSlug === GAME_SLUG
    ) {
      if (session && session !== message.session) return;
      session = message.session;
      parentOrigin = event.origin;
      signalReady();
    }
  });

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
        moveCursor(move[0], move[1], event);
      } else if (event.code === 'KeyF') {
        event.preventDefault();
        claim(event);
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
      moveCursor(move[0], move[1], event);
    } else if (event.code === 'Enter') {
      event.preventDefault();
      claim(event);
    }
  });

  render();
  signalReady();
})();
