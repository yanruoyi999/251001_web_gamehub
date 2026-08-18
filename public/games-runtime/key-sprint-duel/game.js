(() => {
  'use strict';

  const GAME_SLUG = 'key-sprint-duel';
  const GOAL = 20;
  const board = document.getElementById('board');
  const runnerOne = document.getElementById('runner-one');
  const runnerTwo = document.getElementById('runner-two');
  const scoreOne = document.getElementById('score-one');
  const scoreTwo = document.getElementById('score-two');
  const status = document.getElementById('status');

  const state = {
    running: false,
    finished: false,
    one: 0,
    two: 0,
    lastOne: null,
    lastTwo: null,
  };

  function render() {
    const maxLeft = 88;
    runnerOne.style.left = `${3 + (state.one / GOAL) * maxLeft}%`;
    runnerTwo.style.left = `${3 + (state.two / GOAL) * maxLeft}%`;
    scoreOne.textContent = String(state.one);
    scoreTwo.textContent = String(state.two);
  }

  function reset() {
    state.running = true;
    state.finished = false;
    state.one = 0;
    state.two = 0;
    state.lastOne = null;
    state.lastTwo = null;
    status.hidden = true;
    render();
    board.focus({ preventScroll: true });
  }

  function finish(player) {
    state.running = false;
    state.finished = true;
    status.hidden = false;
    status.textContent = `${player} wins · Press Enter to race again`;
  }

  function step(player, code) {
    if (!state.running || state.finished) return;

    if (player === 'P1') {
      if (state.lastOne === code) return;
      state.lastOne = code;
      state.one = Math.min(GOAL, state.one + 1);
      render();
      if (state.one === GOAL) finish('P1');
      return;
    }

    if (state.lastTwo === code) return;
    state.lastTwo = code;
    state.two = Math.min(GOAL, state.two + 1);
    render();
    if (state.two === GOAL) finish('P2');
  }

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      if (!state.running || state.finished) reset();
      return;
    }

    if (event.repeat) return;

    if (event.code === 'KeyA' || event.code === 'KeyD') {
      event.preventDefault();
      step('P1', event.code);
    }

    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      event.preventDefault();
      step('P2', event.code);
    }
  });

  render();
  window.parent.postMessage({ type: 'luma-game-ready', gameSlug: GAME_SLUG }, '*');
})();
