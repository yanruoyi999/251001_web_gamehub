'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import {
  buildColorStackPuzzle,
  buildNumberSprint,
  buildShapeOrder,
  createSortingChallengeCode,
  normalizeSortingChallengeCode,
  SORTING_GAMES,
  type ShapeShelf,
  type SortingColor,
  type SortingGameSlug,
  type SortingShape,
} from '@/lib/games/sorting-games';

interface SortingGamesPlayerProps {
  locale: 'en' | 'zh';
  initialChallengeCode?: string | null;
}

const supportedGameSlugs: SortingGameSlug[] = [
  'color-stack-sort',
  'number-order-sprint',
  'shape-shelf-sort',
];

const colorClasses: Record<SortingColor, string> = {
  coral: 'bg-rose-400 border-rose-500',
  sky: 'bg-sky-400 border-sky-500',
  mint: 'bg-emerald-400 border-emerald-500',
  violet: 'bg-violet-400 border-violet-500',
};

const shelfOrder: ShapeShelf[] = ['three-sides', 'four-sides', 'round-other'];

export function SortingGamesPlayer({ locale, initialChallengeCode }: SortingGamesPlayerProps) {
  const [selectedSlug, setSelectedSlug] = useState<SortingGameSlug>('color-stack-sort');
  const [challengeCode, setChallengeCode] = useState(() =>
    normalizeSortingChallengeCode(initialChallengeCode),
  );
  const [started, setStarted] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [liveStatus, setLiveStatus] = useState('');
  const [numberProgress, setNumberProgress] = useState(0);
  const [numberMistakes, setNumberMistakes] = useState(0);
  const [colorStacks, setColorStacks] = useState<SortingColor[][]>(() =>
    buildColorStackPuzzle(challengeCode),
  );
  const [selectedStack, setSelectedStack] = useState<number | null>(null);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [shapeMistakes, setShapeMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);
  const collectionTrackedRef = useRef(false);
  const completionTrackedRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);

  const copy = locale === 'zh'
    ? {
        eyebrow: 'Luma Original · 浏览器本地运行',
        choose: '选择排序小游戏',
        start: '开始这一局',
        restart: '重新开始',
        code: '同题挑战码',
        codeHint: '复制链接后，对方会得到相同的初始题面；移动、答案、成绩不会写进链接。',
        copyLink: '复制同题链接',
        copied: '链接已复制',
        copyFailed: '无法自动复制，请复制浏览器地址。',
        newChallenge: '换一组挑战码',
        localOnly: '游戏进度只保存在当前标签页内存中，刷新后会重置。',
        numberInstruction: '从最小数字开始，按从小到大的顺序点击。',
        numberNext: '下一个目标',
        mistakes: '失误',
        colorInstruction: '先点一个非空堆叠，再点目标堆叠。只能移动顶部色块到空位或相同颜色上。',
        selectStack: '已选择堆叠',
        invalidMove: '这里不能放这个色块，换一个目标堆叠。',
        moved: '移动成功。',
        shapeInstruction: '看当前图形，把它放到正确的分类货架。',
        correct: '分类正确。',
        wrong: '分类不对，再试一次。',
        complete: '挑战完成！',
        threeSides: '3 边',
        fourSides: '4 边',
        roundOther: '圆形 / 其他',
      }
    : {
        eyebrow: 'Luma Original · Local browser play',
        choose: 'Choose a sorting game',
        start: 'Start this game',
        restart: 'Restart',
        code: 'Same-challenge code',
        codeHint: 'Copy the link to give someone the same starting puzzle. Moves, answers, and scores are never placed in the URL.',
        copyLink: 'Copy challenge link',
        copied: 'Link copied',
        copyFailed: 'Could not copy automatically. Copy the browser address instead.',
        newChallenge: 'Create a new challenge',
        localOnly: 'Progress stays only in this tab memory and resets on refresh.',
        numberInstruction: 'Tap the numbers from smallest to largest.',
        numberNext: 'Next target',
        mistakes: 'Mistakes',
        colorInstruction: 'Choose a non-empty stack, then choose a destination. Only move the top tile onto an empty stack or the same color.',
        selectStack: 'Selected stack',
        invalidMove: 'That tile cannot go there. Pick another destination.',
        moved: 'Move accepted.',
        shapeInstruction: 'Look at the current shape and place it on the correct shelf.',
        correct: 'Correct shelf.',
        wrong: 'Not that shelf. Try again.',
        complete: 'Challenge complete!',
        threeSides: '3 sides',
        fourSides: '4 sides',
        roundOther: 'Round / other',
      };

  const games = useMemo(
    () => supportedGameSlugs
      .map((slug) => SORTING_GAMES.find((game) => game.slug === slug))
      .filter((game): game is (typeof SORTING_GAMES)[number] => Boolean(game)),
    [],
  );

  const selectedGame = useMemo(
    () => games.find((game) => game.slug === selectedSlug) ?? games[0],
    [games, selectedSlug],
  );

  const numberChallenge = useMemo(
    () => buildNumberSprint(challengeCode),
    [challengeCode],
  );
  const sortedNumbers = useMemo(
    () => [...numberChallenge].sort((left, right) => left - right),
    [numberChallenge],
  );
  const shapeChallenge = useMemo(
    () => buildShapeOrder(challengeCode),
    [challengeCode],
  );
  const currentShape = shapeChallenge[shapeIndex];

  useEffect(() => {
    if (initialChallengeCode) return;
    const sharedChallenge = new URLSearchParams(window.location.search).get('challenge');
    if (!sharedChallenge) return;
    setChallengeCode(normalizeSortingChallengeCode(sharedChallenge));
  }, [initialChallengeCode]);

  useEffect(() => {
    if (collectionTrackedRef.current) return;
    collectionTrackedRef.current = true;
    trackInteraction('sorting_collection_view', {
      locale,
      source: 'sorting_collection',
      game_count: games.length,
    });
  }, [games.length, locale]);

  const resetLocalState = (code = challengeCode) => {
    setNumberProgress(0);
    setNumberMistakes(0);
    setColorStacks(buildColorStackPuzzle(code));
    setSelectedStack(null);
    setShapeIndex(0);
    setShapeMistakes(0);
    setCompleted(false);
    setLiveStatus('');
    completionTrackedRef.current = false;
    startedAtRef.current = null;
  };

  const selectGame = (slug: SortingGameSlug) => {
    if (slug === selectedSlug) return;
    setSelectedSlug(slug);
    setStarted(false);
    setShareStatus('');
    resetLocalState();
    trackInteraction('sorting_game_switch', {
      game_slug: slug,
      locale,
      source: 'sorting_collection',
      challenge_code: challengeCode,
    });
  };

  const startGame = () => {
    resetLocalState();
    setStarted(true);
    startedAtRef.current = Date.now();
    trackInteraction('sorting_game_start', {
      game_slug: selectedSlug,
      locale,
      source: 'sorting_collection',
      challenge_code: challengeCode,
    });
  };

  const completeGame = (mistakes: number, roundCount: number) => {
    setCompleted(true);
    setLiveStatus(copy.complete);
    if (completionTrackedRef.current) return;
    completionTrackedRef.current = true;

    trackInteraction('sorting_game_complete', {
      game_slug: selectedSlug,
      locale,
      source: 'sorting_collection',
      challenge_code: challengeCode,
      round_count: roundCount,
      mistake_count: mistakes,
      completion_ms: startedAtRef.current === null
        ? 0
        : Math.max(0, Date.now() - startedAtRef.current),
    });
  };

  const clickNumber = (value: number) => {
    if (!started || completed) return;
    const expected = sortedNumbers[numberProgress];

    if (value !== expected) {
      setNumberMistakes((current) => current + 1);
      setLiveStatus(`${copy.mistakes}: ${numberMistakes + 1}`);
      return;
    }

    const nextProgress = numberProgress + 1;
    setNumberProgress(nextProgress);
    if (nextProgress >= sortedNumbers.length) {
      completeGame(numberMistakes, sortedNumbers.length);
      return;
    }

    setLiveStatus(`${copy.numberNext}: ${sortedNumbers[nextProgress]}`);
  };

  const isColorPuzzleComplete = (stacks: SortingColor[][]) => {
    const filled = stacks.filter((stack) => stack.length > 0);
    return filled.length === 4 && filled.every(
      (stack) => stack.length === 3 && stack.every((color) => color === stack[0]),
    );
  };

  const clickColorStack = (stackIndex: number) => {
    if (!started || completed) return;
    const stack = colorStacks[stackIndex];

    if (selectedStack === null) {
      if (stack.length === 0) return;
      setSelectedStack(stackIndex);
      setLiveStatus(`${copy.selectStack}: ${stackIndex + 1}`);
      return;
    }

    if (selectedStack === stackIndex) {
      setSelectedStack(null);
      setLiveStatus('');
      return;
    }

    const source = colorStacks[selectedStack];
    const movingColor = source[source.length - 1];
    const destination = colorStacks[stackIndex];
    const destinationTop = destination[destination.length - 1];
    const canMove = Boolean(movingColor)
      && destination.length < 3
      && (destination.length === 0 || destinationTop === movingColor);

    if (!canMove) {
      setLiveStatus(copy.invalidMove);
      return;
    }

    const nextStacks = colorStacks.map((current) => [...current]);
    nextStacks[selectedStack].pop();
    nextStacks[stackIndex].push(movingColor);
    setColorStacks(nextStacks);
    setSelectedStack(null);
    setLiveStatus(copy.moved);

    if (isColorPuzzleComplete(nextStacks)) {
      completeGame(0, 12);
    }
  };

  const chooseShapeShelf = (shelf: ShapeShelf) => {
    if (!started || completed || !currentShape) return;

    if (currentShape.shelf !== shelf) {
      setShapeMistakes((current) => current + 1);
      setLiveStatus(copy.wrong);
      return;
    }

    const nextIndex = shapeIndex + 1;
    if (nextIndex >= shapeChallenge.length) {
      setShapeIndex(nextIndex);
      completeGame(shapeMistakes, shapeChallenge.length);
      return;
    }

    setShapeIndex(nextIndex);
    setLiveStatus(copy.correct);
  };

  const copyChallengeLink = async () => {
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set('challenge', challengeCode);
    url.hash = 'play-sorting-games';

    try {
      await navigator.clipboard.writeText(url.toString());
      setShareStatus(copy.copied);
      trackInteraction('sorting_challenge_share', {
        game_slug: selectedSlug,
        locale,
        source: 'sorting_collection',
        challenge_code: challengeCode,
        method: 'clipboard',
      });
    } catch {
      setShareStatus(copy.copyFailed);
    }
  };

  const createNewChallenge = () => {
    const nextCode = createSortingChallengeCode(Date.now());
    setChallengeCode(nextCode);
    setStarted(false);
    setShareStatus('');
    resetLocalState(nextCode);
  };

  const renderShape = (shape: SortingShape) => {
    const common = 'mx-auto h-16 w-16 bg-primary/80';
    const shapeClass = shape.cssShape === 'circle'
      ? 'rounded-full'
      : shape.cssShape === 'square'
        ? 'rounded-md'
        : shape.cssShape === 'rectangle'
          ? 'h-12 w-20 rounded-md'
          : '';
    const clipPath = shape.cssShape === 'triangle'
      ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
      : shape.cssShape === 'pentagon'
        ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
        : shape.cssShape === 'hexagon'
          ? 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)'
          : undefined;

    return <div aria-hidden="true" className={`${common} ${shapeClass}`} style={{ clipPath }} />;
  };

  return (
    <section id="play-sorting-games" className="space-y-6 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{copy.eyebrow}</p>
        <h2 className="text-2xl font-bold text-foreground">{copy.choose}</h2>
        <p className="text-sm text-muted-foreground">{copy.localOnly}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {games.map((game) => (
          <button
            key={game.slug}
            type="button"
            data-sorting-game={game.slug}
            aria-pressed={selectedSlug === game.slug}
            onClick={() => selectGame(game.slug)}
            className={`rounded-xl border p-4 text-left transition ${
              selectedSlug === game.slug
                ? 'border-primary bg-primary/10'
                : 'border-border bg-background hover:border-primary/50'
            }`}
          >
            <span className="block font-semibold text-foreground">{game.title[locale]}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{game.summary[locale]}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{copy.code}</p>
            <code data-sorting-challenge-code className="text-lg font-bold tracking-[0.18em] text-foreground">
              {challengeCode}
            </code>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={copyChallengeLink} className="rounded-md border border-border px-3 py-2 text-sm font-medium">
              {copy.copyLink}
            </button>
            <button type="button" onClick={createNewChallenge} className="rounded-md border border-border px-3 py-2 text-sm font-medium">
              {copy.newChallenge}
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{copy.codeHint}</p>
        {shareStatus ? <p className="mt-2 text-sm font-medium text-foreground">{shareStatus}</p> : null}
      </div>

      <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-foreground">{selectedGame.title[locale]}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{selectedGame.summary[locale]}</p>
          </div>
          <button
            type="button"
            data-sorting-start
            onClick={startGame}
            className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"
          >
            {started ? copy.restart : copy.start}
          </button>
        </div>

        {!started ? null : selectedSlug === 'number-order-sprint' ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{copy.numberInstruction}</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {numberChallenge.map((value) => {
                const alreadyDone = sortedNumbers.slice(0, numberProgress).includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    data-number-tile={value}
                    disabled={alreadyDone || completed}
                    onClick={() => clickNumber(value)}
                    className="min-h-14 rounded-lg border border-border bg-card text-lg font-bold text-foreground disabled:opacity-35"
                  >
                    {value}
                  </button>
                );
              })}
            </div>
            <p className="text-sm font-medium text-foreground">{copy.mistakes}: {numberMistakes}</p>
          </div>
        ) : selectedSlug === 'color-stack-sort' ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{copy.colorInstruction}</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {colorStacks.map((stack, stackIndex) => (
                <button
                  key={`stack-${stackIndex}`}
                  type="button"
                  data-color-stack={stackIndex}
                  aria-pressed={selectedStack === stackIndex}
                  onClick={() => clickColorStack(stackIndex)}
                  className={`flex min-h-40 flex-col-reverse justify-start gap-2 rounded-xl border p-3 ${
                    selectedStack === stackIndex ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  {stack.map((color, tileIndex) => (
                    <span
                      key={`${stackIndex}-${tileIndex}-${color}`}
                      className={`block h-8 w-full rounded-md border ${colorClasses[color]}`}
                      aria-label={color}
                    />
                  ))}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{copy.shapeInstruction}</p>
            {currentShape && !completed ? (
              <div data-shape-card={currentShape.id} className="rounded-xl border border-border bg-card p-6 text-center">
                {renderShape(currentShape)}
                <p className="mt-3 font-semibold text-foreground">{currentShape.label[locale]}</p>
              </div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-3">
              {shelfOrder.map((shelf) => {
                const label = shelf === 'three-sides'
                  ? copy.threeSides
                  : shelf === 'four-sides'
                    ? copy.fourSides
                    : copy.roundOther;
                return (
                  <button
                    key={shelf}
                    type="button"
                    data-shape-shelf={shelf}
                    disabled={completed}
                    onClick={() => chooseShapeShelf(shelf)}
                    className="rounded-lg border border-border bg-card px-4 py-3 font-semibold text-foreground disabled:opacity-50"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-sm font-medium text-foreground">{copy.mistakes}: {shapeMistakes}</p>
          </div>
        )}

        <p aria-live="polite" className="mt-4 min-h-6 text-sm font-medium text-foreground">
          {liveStatus}
        </p>
        {completed ? (
          <div data-sorting-complete className="mt-3 rounded-lg border border-primary/30 bg-primary/10 p-3 font-semibold text-foreground">
            {copy.complete}
          </div>
        ) : null}
      </div>
    </section>
  );
}
