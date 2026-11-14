'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { checkMove, ladders, nextHint } from '@/lib/games/word-ladder';

const copy = {
  en: {
    puzzle: 'Puzzle', target: 'Target', word: 'Next four-letter word', submit: 'Add word',
    hint: 'Hint', undo: 'Undo', reset: 'Restart', next: 'Next puzzle', moves: 'Moves',
    letters: 'Change exactly one letter and keep all four positions.',
    unknown: 'That word is outside this practice word list.',
    repeat: 'You already used that word. Try a different step or undo.',
    noHint: 'This route is blocked. Undo a step to try another route.',
    hintPrefix: 'Try changing to', solved: 'Ladder completed!', puzzleLabel: 'Word Ladder puzzle',
  },
  zh: {
    puzzle: '挑战', target: '目标词', word: '下一个四字母英文单词', submit: '加入单词',
    hint: '提示', undo: '撤销', reset: '重开此题', next: '下一题', moves: '步数',
    letters: '只替换一个字母，其余三个字母的位置保持不动。',
    unknown: '这个词不在本游戏的练习词表里。',
    repeat: '已经用过这个词。试另一条路径，或撤销一步。',
    noHint: '这条路径走不通，可以撤销一步再试。',
    hintPrefix: '可以先改成', solved: '字梯完成！', puzzleLabel: '英文单词字梯游戏',
  },
} as const;

export function WordLadder({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const [round, setRound] = useState(0);
  const [path, setPath] = useState<string[]>([ladders[0].path[0]]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const started = useRef(false);
  const hasStarted = useRef(false);
  const completed = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const target = ladders[round].path.at(-1)!;
  const solved = path.at(-1) === target;

  function restart(index: number) {
    started.current = false;
    completed.current = false;
    setRound(index);
    setPath([ladders[index].path[0]]);
    setInput('');
    setMessage('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const word = input.trim().toLowerCase();
    const verdict = checkMove(path, word);
    if (verdict !== 'valid') {
      setMessage(text[verdict]);
      return;
    }
    if (!started.current) {
      started.current = true;
      trackInteraction('word_ladder_started', { locale, puzzle: round + 1 });
      if (hasStarted.current) trackInteraction('word_ladder_replay', { locale, puzzle: round + 1 });
      hasStarted.current = true;
    }
    setPath([...path, word]);
    setInput('');
    setMessage(word === target ? text.solved : '');
    if (word === target) {
      if (!completed.current) {
        completed.current = true;
        trackInteraction('word_ladder_completed', { locale, puzzle: round + 1, move_count: path.length });
      }
    } else {
      inputRef.current?.focus();
    }
  }

  return (
    <section aria-label={text.puzzleLabel} data-clarity-mask="true" className="space-y-5 rounded-xl border border-border bg-card p-4 text-card-foreground sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{text.puzzle} {round + 1}/{ladders.length}</p>
        <p>{text.target} <strong className="ml-2 font-mono text-lg uppercase tracking-wider">{target}</strong></p>
      </div>
      <ol className="flex flex-wrap gap-2">
        {path.map((word) => (
          <li key={word} className="rounded border border-border bg-muted px-3 py-2 font-mono uppercase tracking-wide">{word}</li>
        ))}
      </ol>
      <p className="text-sm text-muted-foreground">{text.moves} {path.length - 1}</p>
      <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
        <label className="min-w-0 flex-1 basis-36 text-sm font-medium">
          {text.word}
          <input ref={inputRef} name="word" value={input} onChange={(event) => setInput(event.target.value)}
            maxLength={4} autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={solved}
            className="mt-1 block min-h-11 w-full rounded-md border border-input bg-background px-3 font-mono text-base uppercase text-foreground" />
        </label>
        <Button className="min-h-11" type="submit" disabled={solved || input.trim().length !== 4}>{text.submit}</Button>
      </form>
      <p role="status" className="min-h-5 text-sm font-medium">{message}</p>
      <div className="flex flex-wrap gap-2">
        <Button className="min-h-11" type="button" variant="outline" disabled={solved} onClick={() => {
          const hint = nextHint(path, target);
          setMessage(hint ? `${text.hintPrefix} ${hint.toUpperCase()}` : text.noHint);
        }}>{text.hint}</Button>
        <Button className="min-h-11" type="button" variant="outline" disabled={path.length < 2} onClick={() => {
          setPath(path.slice(0, -1));
          setInput('');
          setMessage('');
        }}>{text.undo}</Button>
        <Button className="min-h-11" type="button" variant="outline" onClick={() => restart(round)}>{text.reset}</Button>
        <Button className="min-h-11" type="button" onClick={() => restart((round + 1) % ladders.length)}>{text.next}</Button>
      </div>
    </section>
  );
}
