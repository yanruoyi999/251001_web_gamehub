(() => {
  'use strict';

  const GAME_SLUG = 'classic-pong-duel';
  const board = document.getElementById('board');
  const paddleOne = document.getElementById('paddle-one');
  const paddleTwo = document.getElementById('paddle-two');
  const ball = document.getElementById('ball');
  const status = document.getElementById('status');
  const scoreOne = document.getElementById('score-one');
  const scoreTwo = document.getElementById('score-two');

  const keys = new Set();
  const state = {
    running: false,
    lastTime: 0,
    paddleOneY: 39,
    paddleTwoY: 39,
    ballX: 48.7,
    ballY: 47.7,
    ballVX: 28,
    ballVY: 19,
    scoreOne: 0,
    scoreTwo: 0,
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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function resetBall(direction) {
    state.ballX = 48.7;
    state.ballY = 47.7;
    state.ballVX = 28 * direction;
    state.ballVY = (Math.random() > 0.5 ? 1 : -1) * (17 + Math.random() * 8);
  }

  function render() {
    paddleOne.style.top = `${state.paddleOneY}%`;
    paddleTwo.style.top = `${state.paddleTwoY}%`;
    ball.style.left = `${state.ballX}%`;
    ball.style.top = `${state.ballY}%`;
    scoreOne.textContent = String(state.scoreOne);
    scoreTwo.textContent = String(state.scoreTwo);
  }

  function score(player) {
    if (player === 'one') {
      state.scoreOne += 1;
      resetBall(1);
    } else {
      state.scoreTwo += 1;
      resetBall(-1);
    }
    render();
  }

  function intersectsPaddle(ballX, ballY, paddleX, paddleY) {
    const ballSize = 2.6;
    const paddleWidth = 2.3;
    const paddleHeight = 22;
    return (
      ballX + ballSize >= paddleX &&
      ballX <= paddleX + paddleWidth &&
      ballY + ballSize >= paddleY &&
      ballY <= paddleY + paddleHeight
    );
  }

  function update(deltaSeconds) {
    const paddleSpeed = 62;
    if (keys.has('KeyW')) state.paddleOneY -= paddleSpeed * deltaSeconds;
    if (keys.has('KeyS')) state.paddleOneY += paddleSpeed * deltaSeconds;
    if (keys.has('ArrowUp')) state.paddleTwoY -= paddleSpeed * deltaSeconds;
    if (keys.has('ArrowDown')) state.paddleTwoY += paddleSpeed * deltaSeconds;
    state.paddleOneY = clamp(state.paddleOneY, 0, 78);
    state.paddleTwoY = clamp(state.paddleTwoY, 0, 78);

    state.ballX += state.ballVX * deltaSeconds;
    state.ballY += state.ballVY * deltaSeconds;

    if (state.ballY <= 0) {
      state.ballY = 0;
      state.ballVY = Math.abs(state.ballVY);
    } else if (state.ballY >= 97.4) {
      state.ballY = 97.4;
      state.ballVY = -Math.abs(state.ballVY);
    }

    if (state.ballVX < 0 && intersectsPaddle(state.ballX, state.ballY, 4, state.paddleOneY)) {
      state.ballX = 6.4;
      state.ballVX = Math.abs(state.ballVX) * 1.03;
      const impact = (state.ballY + 1.3 - (state.paddleOneY + 11)) / 11;
      state.ballVY = clamp(state.ballVY + impact * 10, -38, 38);
    }

    if (state.ballVX > 0 && intersectsPaddle(state.ballX, state.ballY, 93.7, state.paddleTwoY)) {
      state.ballX = 91.1;
      state.ballVX = -Math.abs(state.ballVX) * 1.03;
      const impact = (state.ballY + 1.3 - (state.paddleTwoY + 11)) / 11;
      state.ballVY = clamp(state.ballVY + impact * 10, -38, 38);
    }

    if (state.ballX < -3) score('two');
    if (state.ballX > 101) score('one');
  }

  function frame(time) {
    if (!state.running) return;
    const deltaSeconds = Math.min((time - state.lastTime) / 1000 || 0, 0.035);
    state.lastTime = time;
    update(deltaSeconds);
    render();
    requestAnimationFrame(frame);
  }

  function start() {
    if (state.running) return;
    state.running = true;
    state.lastTime = performance.now();
    status.hidden = true;
    board.focus({ preventScroll: true });
    requestAnimationFrame(frame);
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
    if (['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
      event.preventDefault();
      keys.add(event.code);
      if (state.running) signalInput(event);
    }
    if (event.code === 'Enter') {
      event.preventDefault();
      start();
    }
  });

  window.addEventListener('blur', () => keys.clear());

  window.addEventListener('keyup', (event) => {
    keys.delete(event.code);
  });

  render();
  signalReady();
})();
