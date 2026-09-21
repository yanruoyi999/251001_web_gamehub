'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import { CATEGORY_TOPICS, chooseCategoryTopics, type CategoryTopic } from '@/lib/games/categories-topics';

export function CategoriesTopics({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const [group, setGroup] = useState('all');
  const [count, setCount] = useState(6);
  const [round, setRound] = useState<CategoryTopic[]>(CATEGORY_TOPICS.slice(0, 6));
  const [notice, setNotice] = useState('');
  const text = round.map((topic, index) => `${index + 1}. ${topic.label[locale]}`).join('\n');
  const groups = [
    ['warmup', zh ? '热身' : 'Warm-up'],
    ['everyday', zh ? '日常生活' : 'Everyday life'],
    ['creative', zh ? '想象与讨论' : 'Creative conversation'],
  ];
  const reset = () => { setRound([]); setNotice(''); };
  async function copyRound() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setNotice(zh ? '本轮题目已复制。' : 'Round copied.');
    } catch {
      setNotice(zh ? '无法自动复制，请选择下面文本框中的题目手动复制。' : 'Copy unavailable. Select the text below and copy it manually.');
    }
  }
  return (
    <section id="topic-picker" tabIndex={-1} data-categories-topics className="mt-8 rounded-xl border border-border bg-card p-4 sm:p-6">
      <h2 className="text-2xl font-bold">{zh ? '准备一轮 Categories 题目' : 'Build a Categories round'}</h2>
      <p className="mt-2 text-sm">{zh ? '抽题只在本地运行；例子只作说明，不是标准答案。' : 'Selection runs locally. Examples illustrate topics; they are not answer keys.'}</p>
      <noscript><p className="mt-3">{zh ? '抽题与复制按钮需要 JavaScript；完整题单仍可在下方阅读。' : 'The picker and copy button need JavaScript. The complete topic list below is still readable.'}</p></noscript>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="grid gap-1" htmlFor="category-group">{zh ? '题目组' : 'Topic group'}
          <select id="category-group" className="min-h-11 rounded border border-border bg-background px-3" value={group}
            onChange={event => { setGroup(event.target.value); reset(); }}>
            <option value="all">{zh ? '全部题目' : 'All topics'}</option>
            {groups.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="grid gap-1" htmlFor="category-count">{zh ? '本轮题数' : 'Topics per round'}
          <select id="category-count" className="min-h-11 rounded border border-border bg-background px-3" value={count}
            onChange={event => { setCount(Number(event.target.value)); reset(); }}>
            {[6, 8, 12].map(value => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <button type="button" className="min-h-11 rounded bg-primary px-4 font-semibold text-primary-foreground"
          onClick={() => { setRound(chooseCategoryTopics(group, count)); setNotice(''); }}>
          {zh ? '抽取新一轮' : 'Pick a new round'}
        </button>
      </div>
      <div className="mt-5" aria-live="polite" aria-atomic="true">
        {round.length ? <ol className="list-decimal space-y-2 pl-6">{round.map(topic => (
          <li key={topic.id} data-category-topic={topic.id}>{topic.label[locale]}</li>
        ))}</ol> : <p>{zh ? '选择完成后，点击抽取新一轮。' : 'Choose your settings, then pick a new round.'}</p>}
      </div>
      {round.length > 0 && <div className="mt-4">
        <button type="button" onClick={copyRound} className="min-h-11 rounded border border-border px-4 font-semibold">
          {zh ? '复制本轮题目' : 'Copy this round'}
        </button>
        <label className="mt-3 block text-sm" htmlFor="category-copy">{zh ? '可选择复制的文本' : 'Selectable round text'}</label>
        <textarea id="category-copy" readOnly value={text} rows={Math.min(count, 8)} className="mt-1 w-full rounded border border-border bg-background p-3 text-sm" />
      </div>}
      <p role="status" className="mt-2 text-sm">{notice}</p>
      <details className="mt-6 border-t border-border pt-4" open>
        <summary className="min-h-11 cursor-pointer py-3 text-lg font-bold">{zh ? '完整的 48 条原创题目与例子' : 'All 48 original topics and examples'}</summary>
        <div className="grid gap-6 md:grid-cols-3">
          {groups.map(([value, label]) => <section key={value}>
            <h3 className="mb-3 font-bold">{label}</h3>
            <ol className="list-decimal space-y-3 pl-5">{CATEGORY_TOPICS.filter(topic => topic.group === value).map(topic => (
              <li key={topic.id} data-full-topic={topic.id}>
                <span className="font-medium">{topic.label[locale]}</span>
                <span className="block text-sm text-muted-foreground">{zh ? '例如：' : 'Example: '}{topic.example[locale]}</span>
              </li>
            ))}</ol>
          </section>)}
        </div>
      </details>
    </section>
  );
}
