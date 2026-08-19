'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import {
  buildCouplePromptOrder,
  COUPLE_GAMES,
  createChallengeCode,
  normalizeChallengeCode,
  type CoupleGameSlug,
  type CouplePrompt,
} from '@/lib/games/online-games-for-couples';

interface OnlineGamesForCouplesPlayerProps {
  locale: 'en' | 'zh';
  initialChallengeCode?: string | null;
}

type Choice = 0 | 1;

const supportedGameSlugs: CoupleGameSlug[] = [
  'this-or-that-duo',
  'couple-match-quiz',
  'quick-couple-challenge',
];

const ROUND_LIMIT = 6;

export function OnlineGamesForCouplesPlayer({
  locale,
  initialChallengeCode,
}: OnlineGamesForCouplesPlayerProps) {
  const [selectedSlug, setSelectedSlug] = useState<CoupleGameSlug>('this-or-that-duo');
  const [challengeCode, setChallengeCode] = useState(() =>
    normalizeChallengeCode(initialChallengeCode),
  );
  const [started, setStarted] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [playerOneChoice, setPlayerOneChoice] = useState<Choice | null>(null);
  const [playerTwoChoice, setPlayerTwoChoice] = useState<Choice | null>(null);
  const [matchCount, setMatchCount] = useState(0);
  const [revealedMatch, setRevealedMatch] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const collectionTrackedRef = useRef(false);
  const completionTrackedRef = useRef(false);

  const copy = locale === 'zh'
    ? {
        eyebrow: 'Luma Original · 本地运行',
        choose: '选择情侣小游戏',
        start: '开始这一局',
        restart: '重新开始',
        playerOne: '玩家 1',
        playerTwo: '玩家 2',
        locked: '已锁定选择，交给另一位玩家',
        matched: '这一题你们选得一样。',
        different: '这一题你们选择不同。',
        next: '下一题',
        done: '完成这个挑战',
        finishPrompt: '完成这一条，继续下一条',
        score: '本轮匹配度',
        code: '异地同题挑战码',
        codeHint: '复制链接给对方，两边会得到同一组题和顺序；答案不会写进链接。',
        copyLink: '复制同题链接',
        copied: '链接已复制',
        copyFailed: '无法自动复制，请复制浏览器地址。',
        newDeck: '换一组挑战码',
        localOnly: '答案只保存在当前浏览器内存中；刷新页面后不会保留。',
        round: '进度',
      }
    : {
        eyebrow: 'Luma Original · Local only',
        choose: 'Choose a couples game',
        start: 'Start this game',
        restart: 'Restart',
        playerOne: 'Player 1',
        playerTwo: 'Player 2',
        locked: 'Choice locked. Hand the screen to the other player.',
        matched: 'You matched on this one.',
        different: 'Different picks this round.',
        next: 'Next prompt',
        done: 'Finish challenge',
        finishPrompt: 'Done — show the next prompt',
        score: 'Match score',
        code: 'Long-distance challenge code',
        codeHint: 'Copy the link to give both people the same prompt deck and order. Answers are never placed in the URL.',
        copyLink: 'Copy same-deck link',
        copied: 'Link copied',
        copyFailed: 'Could not copy automatically. Copy the browser address instead.',
        newDeck: 'Create a new deck',
        localOnly: 'Answers stay only in this tab’s memory and disappear on refresh.',
        round: 'Progress',
      };

  const games = useMemo(
    () => supportedGameSlugs
      .map((slug) => COUPLE_GAMES.find((game) => game.slug === slug))
      .filter((game): game is (typeof COUPLE_GAMES)[number] => Boolean(game)),
    [],
  );

  const selectedGame = useMemo(
    () => games.find((game) => game.slug === selectedSlug) ?? games[0],
    [games, selectedSlug],
  );

  const orderedPrompts = useMemo(
    () => buildCouplePromptOrder(selectedSlug, challengeCode).slice(0, ROUND_LIMIT),
    [challengeCode, selectedSlug],
  );

  const currentPrompt = orderedPrompts[roundIndex];

  useEffect(() => {
    if (collectionTrackedRef.current) return;
    collectionTrackedRef.current = true;
    trackInteraction('couples_collection_view', {
      locale,
      source: 'couples_collection',
      game_count: games.length,
    });
  }, [games.length, locale]);

  const resetRoundState = () => {
    setRoundIndex(0);
    setPlayerOneChoice(null);
    setPlayerTwoChoice(null);
    setMatchCount(0);
    setRevealedMatch(null);
    setCompleted(false);
    completionTrackedRef.current = false;
  };

  const selectGame = (slug: CoupleGameSlug) => {
    if (slug === selectedSlug) return;
    setSelectedSlug(slug);
    setStarted(false);
    resetRoundState();
    trackInteraction('couple_game_select', {
      game_slug: slug,
      locale,
      source: 'couples_collection',
      challenge_code: challengeCode,
    });
  };

  const startGame = () => {
    resetRoundState();
    setStarted(true);
    trackInteraction('couple_game_start', {
      game_slug: selectedSlug,
      locale,
      source: 'couples_collection',
      challenge_code: challengeCode,
    });
  };

  const completeGame = (finalMatches = matchCount) => {
    setCompleted(true);
    if (completionTrackedRef.current) return;
    completionTrackedRef.current = true;

    const matchPercent = selectedGame.mode === 'prompt'
      ? undefined
      : Math.round((finalMatches / orderedPrompts.length) * 100);

    trackInteraction('couple_game_complete', {
      game_slug: selectedSlug,
      locale,
      source: 'couples_collection',
      challenge_code: challengeCode,
      round_count: orderedPrompts.length,
      ...(typeof matchPercent === 'number' ? { match_percent: matchPercent } : {}),
    });
  };

  const choose = (player: 1 | 2, choice: Choice) => {
    if (!currentPrompt || revealedMatch !== null || completed) return;

    if (player === 1) {
      setPlayerOneChoice(choice);
      return;
    }

    if (playerOneChoice === null) return;
    setPlayerTwoChoice(choice);
    const isMatch = playerOneChoice === choice;
    setRevealedMatch(isMatch);
    if (isMatch) setMatchCount((current) => current + 1);
  };

  const nextChoiceRound = () => {
    if (revealedMatch === null) return;
    const nextMatchCount = matchCount;
    if (roundIndex >= orderedPrompts.length - 1) {
      completeGame(nextMatchCount);
      return;
    }
    setRoundIndex((current) => current + 1);
    setPlayerOneChoice(null);
    setPlayerTwoChoice(null);
    setRevealedMatch(null);
  };

  const nextPromptRound = () => {
    if (roundIndex >= orderedPrompts.length - 1) {
      completeGame();
      return;
    }
    setRoundIndex((current) => current + 1);
  };

  const copyChallengeLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('challenge', challengeCode);
    url.hash = 'play-couple-games';

    try {
      await navigator.clipboard.writeText(url.toString());
      setShareStatus(copy.copied);
      trackInteraction('couple_share', {
        game_slug: selectedSlug,
        locale,
        source: 'couples_collection',
        challenge_code: challengeCode,
        method: 'clipboard',
      });
    } catch {
      setShareStatus(copy.copyFailed);
    }
  };

  const createNewDeck = () => {
    const nextCode = createChallengeCode(Date.now());
    setChallengeCode(nextCode);
    setStarted(false);
    resetRoundState();
    setShareStatus('');
  };

  const renderChoiceButtons = (prompt: CouplePrompt, player: 1 | 2) => {
    if (!prompt.options) return null;
    const disabled = revealedMatch !== null || (player === 2 && playerOneChoice === null);
    const playerChoice = player === 1 ? playerOneChoice : playerTwoChoice;

    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {prompt.options.map((option, index) => (
          <button
            key={`${prompt.id}-${player}-${index}`}
            type="button"
            onClick={() => choose(player, index as Choice)}
            disabled={disabled || playerChoice !== null}
            aria-pressed={playerChoice === index}
            className="min-h-12 rounded-xl border border-border bg-background px-4 py-3 text-left font-medium text-foreground transition hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60 aria-pressed:border-primary aria-pressed:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            data-couple-choice={`${player}-${index}`}
          >
            {option[locale]}
          </button>
        ))}
      </div>
    );
  };

  const matchPercent = orderedPrompts.length > 0
    ? Math.round((matchCount / orderedPrompts.length) * 100)
    : 0;

  return (
    <section id="play-couple-games" className="scroll-mt-24 space-y-6" data-couples-player>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{copy.eyebrow}</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{copy.code}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{copy.codeHint}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded-lg border border-border bg-background px-3 py-2 text-base font-bold tracking-[0.18em] text-foreground" data-couple-challenge-code>
              {challengeCode}
            </code>
            <button type="button" onClick={() => void copyChallengeLink()} className="min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-couple-share>
              {copy.copyLink}
            </button>
            <button type="button" onClick={createNewDeck} className="min-h-11 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-couple-new-deck>
              {copy.newDeck}
            </button>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">{shareStatus}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-foreground">{copy.choose}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {games.map((game) => {
            const selected = game.slug === selectedSlug;
            return (
              <button
                key={game.slug}
                type="button"
                onClick={() => selectGame(game.slug)}
                aria-pressed={selected}
                data-couple-game={game.slug}
                className="min-h-40 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary aria-pressed:border-primary aria-pressed:ring-2 aria-pressed:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="text-lg font-semibold text-foreground">{game.title[locale]}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{game.summary[locale]}</span>
                <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-primary">~{game.estimatedMinutes} min</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7" data-couple-stage>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">{selectedGame.title[locale]}</p>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{selectedGame.summary[locale]}</p>
          </div>
          {started ? (
            <p className="text-sm font-medium text-muted-foreground" data-couple-progress>
              {copy.round}: {Math.min(roundIndex + 1, orderedPrompts.length)}/{orderedPrompts.length}
            </p>
          ) : null}
        </div>

        {!started ? (
          <button type="button" onClick={startGame} className="mt-6 min-h-12 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-couple-start>
            {copy.start}
          </button>
        ) : completed ? (
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6" aria-live="polite" data-couple-complete>
            <p className="text-xl font-semibold text-foreground">{selectedGame.title[locale]}</p>
            {selectedGame.mode !== 'prompt' ? (
              <p className="mt-2 text-3xl font-bold text-primary">{copy.score}: {matchPercent}%</p>
            ) : (
              <p className="mt-2 text-base text-foreground">{locale === 'zh' ? '挑战完成。你们已经一起走完这一组提示。' : 'Challenge complete. You made it through the shared deck together.'}</p>
            )}
            <button type="button" onClick={startGame} className="mt-5 min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {copy.restart}
            </button>
          </div>
        ) : currentPrompt ? (
          <div className="mt-6 space-y-6">
            <h3 className="text-2xl font-semibold leading-snug text-foreground" data-couple-prompt>
              {currentPrompt.prompt[locale]}
            </h3>

            {selectedGame.mode === 'prompt' ? (
              <button type="button" onClick={nextPromptRound} className="min-h-12 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-couple-prompt-done>
                {roundIndex >= orderedPrompts.length - 1 ? copy.done : copy.finishPrompt}
              </button>
            ) : (
              <>
                <div className="space-y-3" data-couple-player-one>
                  <p className="font-semibold text-foreground">{copy.playerOne}</p>
                  {renderChoiceButtons(currentPrompt, 1)}
                  {playerOneChoice !== null && playerTwoChoice === null ? (
                    <p className="text-sm text-muted-foreground">{copy.locked}</p>
                  ) : null}
                </div>

                <div className="space-y-3" data-couple-player-two>
                  <p className="font-semibold text-foreground">{copy.playerTwo}</p>
                  {renderChoiceButtons(currentPrompt, 2)}
                </div>

                <div aria-live="polite">
                  {revealedMatch !== null ? (
                    <div className="rounded-xl border border-border bg-secondary/40 p-4" data-couple-round-result>
                      <p className="font-medium text-foreground">{revealedMatch ? copy.matched : copy.different}</p>
                      <button type="button" onClick={nextChoiceRound} className="mt-3 min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-couple-next>
                        {roundIndex >= orderedPrompts.length - 1 ? copy.done : copy.next}
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{copy.localOnly}</p>
    </section>
  );
}
