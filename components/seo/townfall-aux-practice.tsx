'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { trackInteraction } from '@/lib/analytics/events';

const handles = [
  ['A', 2, false], ['B', 2, false], ['C', 1, true], ['D', 2, false], ['E', 2, true],
] as const;

export function TownfallAuxPractice({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [ready, setReady] = useState(false);
  const [level, setLevel] = useState(0);
  const [choice, setChoice] = useState('');
  const sent = useRef(new Set<string>());
  useEffect(() => setReady(true), []);

  function recordOnce(key: string, action: string) {
    if (sent.current.has(key)) return;
    sent.current.add(key);
    const properties = getGuideIntentProperties('silent-hill-townfall-aux-valve-puzzle', action, locale);
    if (properties) trackInteraction('guide_intent_click', properties, { waitForInitialization: true });
  }
  const hints = zh ? [
    '先找哪些手柄属于同一路。再找起点：面对墙时的左右顺序，未必是读图顺序。',
    '数手柄旁的条纹，双纹对应第二路。沿墙上箭头依次只数同纹手柄，将它们逐个调到磁盘图对应的竖向或横向。换一路时重新找箭头。',
  ] : [
    'Look for the handles that belong to one line. Then find its starting end. The order you see across the wall may differ from the order on the disk.',
    'Count the stripes beside a handle: two marks identify line 2. Follow its painted arrow, counting only matching handles. Set each handle vertical or horizontal to match the next mark on your disk. Find the arrow again for each new line.',
  ];
  return <section aria-label={zh ? '阀门提示与练习' : 'Valve hints and practice'} className="my-6 max-w-3xl space-y-4 rounded-xl border p-5">
    <h2 className="text-xl font-semibold">{zh ? '按需要展开提示' : 'Take a hint when you need one'}</h2>
    {hints.slice(0, level).map((hint, i) => <p key={i}>{i + 1}. {hint}</p>)}
    {level < hints.length && <button disabled={!ready} type="button" className="min-h-11 rounded-md border px-4" onClick={() => {
      const next = level + 1;
      recordOnce('hint_' + next, 'hint_' + next);
      setLevel(next);
    }}>{zh ? '看第 ' + (level + 1) + ' 层提示' : 'Show hint ' + (level + 1)}</button>}
    <fieldset disabled={!ready || choice === 'B'} className="space-y-3 border-t pt-4">
      <legend className="font-semibold">{zh ? '原创练习墙：只翻一只手柄' : 'Practice wall: flip just one handle'}</legend>
      <p>{zh ? '箭头朝左 ←。磁盘上的第二路从起点依次是：竖、横、竖、横。下表按你眼前从左到右的顺序列出。点选唯一需要翻动的手柄，其他管线保持原样。' : 'The wall arrow points left ←. From its start, line 2 on the disk reads vertical, horizontal, vertical, horizontal. The handles below are listed from left to right as you see them. Choose the one handle to flip, leaving other lines alone.'}</p>
      <div className="flex flex-wrap gap-2">{handles.map(([name, stripes, vertical]) => <button key={name} type="button" aria-pressed={choice === name} className="min-h-11 rounded-md border px-3 py-2 focus-visible:ring-2" onClick={() => {
        recordOnce('first', 'first_' + (name === 'B' ? 'correct_' : 'incorrect_') + level);
        if (name === 'B') recordOnce('solved', 'practice_solved_' + level);
        setChoice(name);
      }}>{name} · {zh ? stripes + ' 纹' : stripes + (stripes === 1 ? ' stripe' : ' stripes')} · {zh ? (vertical ? '竖' : '横') : (vertical ? 'vertical' : 'horizontal')}</button>)}</div>
    </fieldset>
    <p role="status" aria-live="polite">{choice === '' ? '' : choice === 'B'
      ? (zh ? '答对了。箭头从右向左，依次核 E、D、B、A。把 B 从横转竖即可；单纹的 C 属于另一路。' : 'Correct. Follow the arrow through E, D, B and A. Turn B from horizontal to vertical. C has one stripe and belongs to another line.')
      : (zh ? '这一次还没对上。保留其他路，沿箭头再对照一次磁盘。' : 'That change leaves a mismatch. Keep the other line intact and compare the handles with the disk again.')}</p>
  </section>;
}
