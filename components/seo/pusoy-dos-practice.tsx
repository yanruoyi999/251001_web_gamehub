'use client';

import { useEffect, useRef, useState } from 'react';
import { getLocalizedPath, type Locale } from '@/i18n/config';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { trackInteraction } from '@/lib/analytics/events';

const hands = [
  '4♣ 4♦ 5♠ 5♥ 6♣ 6♠ 7♦ J♠ J♥ Q♠ K♥ A♦ 2♣',
  '3♠ 4♠ 5♣ 7♣ 8♠ 8♦ 10♦ J♣ Q♣ Q♥ Q♦ K♠ K♦',
  '3♣ 3♦ 6♥ 6♦ 9♣ 9♠ 9♥ 9♦ 10♣ 10♠ K♣ A♣ A♥',
  '3♥ 4♥ 5♦ 7♠ 7♥ 8♣ 8♥ 10♥ J♦ A♠ 2♠ 2♥ 2♦',
];
const seats = ['A', 'B', 'C', 'D'];
// Each row begins with a fresh lead. A dash marks a pass, not a missing move.
const tricks = [
  'C 3♣ 3♦ 9♣ 9♠ 9♥ → D 7♠ 7♥ 2♠ 2♥ 2♦ → A – → B – → C –',
  'D 3♥ → A 7♦ → B 10♦ → C K♣ → D A♠ → A A♦ → B – → C – → D –',
  'A 4♣ 4♦ → B 8♠ 8♦ → C 10♣ 10♠ → D – → A J♠ J♥ → B K♠ K♦ → C A♣ A♥ → A – → B –',
  'C 6♥ 6♦ → D 8♣ 8♥ → A – → B Q♣ Q♥ → C – → D –',
  'B Q♦ → C – → D – → A K♥ → B –',
  'A 5♠ 5♥ → B – → C – → D –',
  'A 6♣ 6♠ → B – → C – → D –',
  'A 2♣ → B – → C – → D –',
  'A Q♠',
];
const cases = {
  en: [
    { title: '1. Can a single two beat this pair?', prompt: 'A opens with 3♣ 3♥. B plays 4♣ 4♠. C holds only singles, including 2♦. What can C do?', options: ['Play 2♦', 'Pass', 'Lead any single'], answer: 1, why: 'C must pass. A single cannot beat a pair, even the highest single. If D and A also pass, B takes the lead and may switch to a single.' },
    { title: '2. Find the next lead', prompt: 'In a fresh trick B leads Q♦. C passes, D passes, A plays K♥, then B passes. A has only 9♣ 9♦ left. Who plays, and how can the deal end?', options: ['C gets another turn', 'A must lead a single', 'A leads the pair and wins'], answer: 2, why: 'C and D already sat out. Once B passes, A clears the table and may lead a pair. Playing both nines empties A’s hand and ends this teaching deal.' },
  ],
  zh: [
    { title: '1. 单张 2 能压这对牌吗？', prompt: 'A 首出 3♣ 3♥，B 接 4♣ 4♠。C 手中全是单张，其中有 2♦。C 现在能做什么？', options: ['出 2♦', '过牌', '领出任意单张'], answer: 1, why: 'C 只能过。最大的单张也不能接对子。若 D 和 A 都过，B 清桌后可以换成领单张。' },
    { title: '2. 判断谁能重新领出', prompt: '新一墩 B 领 Q♦，C、D 先后过，A 接 K♥，B 过。A 手里只剩 9♣ 9♦。接下来轮到谁，能怎样赢？', options: ['C 重新跟牌', 'A 必须领单张', 'A 领出这对 9 获胜'], answer: 2, why: 'C 和 D 已退出本墩。B 一过，A 就可以清桌改领对子。两张 9 一起出完，本桌到此结束。' },
  ],
} as const;

export function PusoyDosPractice({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const recorded = useRef(new Set<string>());
  useEffect(() => {
    setReady(true);
    // Measure a completed directory navigation on the destination, where GA can finish loading.
    const entryMark = 'luma-pusoy-directory-entry';
    if (!document.referrer || performance.getEntriesByName(entryMark, 'mark').length) return;
    const referrer = new URL(document.referrer);
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type !== 'navigate' || new URL(nav.name).pathname !== location.pathname ||
        referrer.origin !== location.origin ||
        referrer.pathname !== getLocalizedPath(locale, '/guides')) return;
    performance.mark(entryMark);
    const properties = getGuideIntentProperties('pusoy-dos-rules', 'open_from_guides', locale);
    if (properties) trackInteraction('guide_intent_click', properties, { waitForInitialization: true });
  }, [locale]);

  function track(action: string) {
    const properties = getGuideIntentProperties('pusoy-dos-rules', action, locale);
    if (properties) trackInteraction('guide_intent_click', properties, { waitForInitialization: true });
  }

  function choose(index: number, choice: number) {
    const step = index === 0 ? 'first' : 'second';
    if (recorded.current.has(step) || index !== answers.length) return;
    recorded.current.add(step);
    setAnswers(previous => [...previous, choice]);
    track(step + (choice === cases[locale][index].answer ? '_correct' : '_incorrect'));
    if (index === 1) track('practice_complete');
  }

  return (
    <section id="pusoy-practice" aria-labelledby="pusoy-practice-title" className="mb-8 space-y-5 rounded-xl border p-4 sm:p-6">
      <h2 id="pusoy-practice-title" className="text-xl font-semibold">{zh ? '轮到谁出？先答再看牌例' : 'Call the next play'}</h2>
      {cases[locale].slice(0, answers.length + 1).map((item, index) => (
        <div key={item.title} className="space-y-2">
          <h3 className="font-semibold">{item.title}</h3>
          <p>{item.prompt}</p>
          <fieldset disabled={!ready || answers[index] !== undefined}>
            <legend className="sr-only">{item.title}</legend>
            <div className="flex flex-wrap gap-2">
              {item.options.map((option, choice) => (
                <button key={option} type="button" onClick={() => choose(index, choice)} aria-pressed={answers[index] === choice}
                  className="min-h-11 rounded-md border px-3 text-sm focus-visible:ring-2 aria-pressed:bg-muted">{option}</button>
              ))}
            </div>
          </fieldset>
          <p role="status" aria-atomic="true" className="text-sm">
            {answers[index] !== undefined && ((answers[index] === item.answer ? (zh ? '正确。' : 'Correct. ') : (zh ? '再看看。' : 'Take another look. ')) + item.why)}
          </p>
        </div>
      ))}
      <a href="/printables/pusoy-dos-seat-slips.html" download className="inline-flex min-h-11 items-center font-semibold text-primary underline"
        onClick={() => track('download_table_sheet')}>
        {zh ? '下载英文桌单和四份可裁剪手牌（HTML，打开后打印）' : 'Download the table rules and four cut-out seat slips (HTML, open to print)'}
      </a>
      <details className="rounded-lg border p-3" onToggle={event => {
        if (event.currentTarget.open && !recorded.current.has('open_deal')) {
          recorded.current.add('open_deal');
          track('open_deal');
        }
      }}>
        <summary className="min-h-11 cursor-pointer py-2 font-semibold">{zh ? '摆一桌：四家手牌与完整出牌顺序' : 'Deal it at home: four hands and a complete play-through'}</summary>
        <p>{zh ? '按 A、B、C、D 顺时针排座。各拿下面的 13 张牌，从 C 开始。先试着自己打，再展开复盘。' : 'Sit clockwise in seat order A, B, C, D. Give each seat its 13 cards. C opens. Play your own deal first, then open the replay.'}</p>
        <ul className="my-3 space-y-1">{hands.map((cards, index) => <li key={cards}><strong>{seats[index]}</strong> · {cards}</li>)}</ul>
        <details>
          <summary className="min-h-11 cursor-pointer py-2 font-semibold">{zh ? '核对一条合法走法（含结局）' : 'Check one legal line of play (includes the finish)'}</summary>
          <p>{zh ? '每行从清桌领出开始。破折号表示过牌，箭头指向下一位实际行动的人。' : 'Each line starts with a fresh lead. A dash means pass. Follow the arrows to the next active seat.'}</p>
          <ol className="my-3 list-decimal space-y-2 pl-6">{tricks.map(line => <li key={line}>{line}</li>)}</ol>
          <p>{zh ? 'A 领出最后的 Q♠ 获胜；B、C、D 各余 5、1、4 张。' : 'A leads the last Q♠ to win. B has five cards left, C one and D four.'}</p>
        </details>
      </details>
    </section>
  );
}
