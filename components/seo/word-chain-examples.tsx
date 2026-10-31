import React from 'react';
import type { Locale } from '@/i18n/config';
import {
  getWordChainClues,
  WORD_CHAIN_PUZZLES,
} from '@/lib/word-chain-guide-content';

export function WordChainExamples({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  return (
    <section
      id="word-chain-practice"
      aria-labelledby="word-chain-heading"
      className="mb-10 max-w-5xl scroll-mt-24"
    >
      <h2
        id="word-chain-heading"
        className="text-xl font-black text-foreground sm:text-2xl"
      >
        {zh ? '试做八条英语词链' : 'Try the eight word chains'}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {zh
          ? '下划线各代表一个缺失字母；括号标出完整词长。先猜，再展开一组有效答案与五个连接的解释。'
          : 'Each underscore is a missing letter; parentheses give word lengths. Reveal answers to check all five links.'}
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {WORD_CHAIN_PUZZLES.map((puzzle, index) => (
          <div
            key={puzzle.words.join('-')}
            className="min-w-0 rounded-lg border border-[#cbdccf] bg-white p-3 sm:p-4 dark:border-border dark:bg-card"
          >
            <h3 className="font-bold text-foreground">
              {zh ? `第 ${index + 1} 题` : `Puzzle ${index + 1}`}
            </h3>
            <ol
              lang="en"
              aria-label={
                zh ? '六词线索，按顺序阅读' : 'Six word clues in order'
              }
              className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-3"
            >
              {getWordChainClues(puzzle.words).map((clue, wordIndex) => (
                <li
                  key={wordIndex}
                  className="flex max-w-full items-center gap-2"
                >
                  {wordIndex > 0 ? (
                    <span aria-hidden="true" className="text-muted-foreground">
                      →
                    </span>
                  ) : null}
                  <span className="rounded border border-border bg-secondary/60 px-2 py-1 font-mono text-sm tracking-wider text-foreground">
                    {clue.toUpperCase()}
                    {wordIndex > 0 && wordIndex < 5 ? (
                      <span className="ml-1 text-xs tracking-normal text-muted-foreground">
                        ({puzzle.words[wordIndex].length})
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>
            <details className="mt-4 border-t border-border pt-2">
              <summary className="min-h-11 cursor-pointer rounded px-2 py-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {zh
                  ? `展开第 ${index + 1} 题答案与解释`
                  : `Reveal answer ${index + 1}`}
              </summary>
              <p
                lang="en"
                className="mt-2 break-words text-sm font-semibold leading-7 text-foreground"
              >
                {puzzle.words.join(' → ')}
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                {puzzle.links.map(link => (
                  <li key={link.phrase}>
                    <strong lang="en" className="font-semibold text-foreground">
                      {link.phrase}
                    </strong>
                    : {link.meaning[locale]}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>
    </section>
  );
}
