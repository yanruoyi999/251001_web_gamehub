import React from 'react';
import type { Locale } from '@/i18n/config';
import {
  CRIBBAGE_CHART_NOTES,
  CRIBBAGE_CHART_ROWS,
  CRIBBAGE_RUN_SHORTCUTS,
  CRIBBAGE_SOURCES,
  type CribbageCell,
} from '@/lib/cribbage-guide-content';
import styles from './cribbage-scoring-chart.module.css';

function cell(value: CribbageCell, locale: Locale) {
  if (value === 'na') return locale === 'en' ? 'Not applicable' : '不适用';
  return typeof value === 'number' ? value : value[locale];
}

export function CribbageScoringChart({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <section
      data-cribbage-print-root
      className={styles.root}
      aria-labelledby="cribbage-chart-heading"
    >
      <h2 id="cribbage-chart-heading">
        {en ? 'Cribbage scoring reference' : 'Cribbage计分参考'}
      </h2>
      <p>
        {en
          ? 'Standard two-player, six-card deal. Hand and crib = four held cards + starter; the starter is excluded from pegging. All values are points.'
          : '标准双人、每人发六张。手牌与底牌 = 原有四张 + 起始牌；起始牌不参与出牌阶段。数值单位均为分。'}
      </p>
      <div
        className={styles.tableScroll}
        role="region"
        aria-label={
          en
            ? 'Scoring chart, scroll horizontally if needed'
            : '计分表，必要时可横向滚动'
        }
        tabIndex={0}
      >
        <table>
          <caption>
            {en ? 'Points by scoring context' : '按计分情境查分'}
          </caption>
          <thead>
            <tr>
              {(en
                ? ['Combination', 'Hand', 'Crib', 'Pegging']
                : ['组合', '手牌', '庄家底牌', '出牌阶段']
              ).map(label => (
                <th key={label} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CRIBBAGE_CHART_ROWS.map(row => (
              <tr key={row.id}>
                <th scope="row">{row.label[locale]}</th>
                <td>{cell(row.hand, locale)}</td>
                <td>{cell(row.crib, locale)}</td>
                <td>{cell(row.pegging, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.event}>
        <strong>
          {en ? 'Separate starter event — heels:' : '独立起始牌事件——heels：'}
        </strong>
        {en
          ? ' Turn a J: dealer +2, outside hand/crib totals. This is not nobs or a pegging play.'
          : ' 翻出J，庄家另加2，不计入手牌或底牌总分；这不是nobs，也不是出牌。'}
      </p>
      <div
        className={styles.tableScroll}
        role="region"
        aria-label={
          en
            ? 'Multiple-run shortcuts, scroll horizontally if needed'
            : '多重顺子快捷表，必要时可横向滚动'
        }
        tabIndex={0}
      >
        <table>
          <caption>
            {en
              ? 'Hand/crib multiple-run shortcuts'
              : '手牌与底牌的多重顺子快捷分'}
          </caption>
          <thead>
            <tr>
              {(en
                ? ['Structure', 'Calculation', 'Subtotal']
                : ['结构', '计算', '小计']
              ).map(label => (
                <th key={label} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CRIBBAGE_RUN_SHORTCUTS.map(row => (
              <tr key={row.total}>
                <th scope="row">{row.label[locale]}</th>
                <td>
                  {row.runs} × {row.length} + {row.pairPoints.join(' + ')}
                </td>
                <td>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        {en
          ? 'These subtotals already include pair points. Add any separate fifteens, flush or nobs; do not use these shortcuts in pegging.'
          : '这些小计已包含对子分。其他15、同花或nobs另加；出牌阶段不能使用这些快捷分。'}
      </p>
      <h3>
        {en ? 'Exceptions to keep beside the chart' : '查表时必须保留的例外'}
      </h3>
      <ul>
        {CRIBBAGE_CHART_NOTES[locale].map(note => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <footer className={styles.sources}>
        <p>
          {en
            ? 'Edition: ACC 2025 Tournament Rules. Documentation checked 2026-11-04. Original explanation and layout; unaffiliated with ACC. For standard two-player play, not tournament adjudication.'
            : '版本：ACC 2025锦标赛规则。资料核查：2026-11-04。原创解释与版式，与ACC无合作关联；适用于标准双人玩法，不作锦标赛裁判依据。'}
        </p>
        <p>
          {en ? 'Sources: ' : '来源：'}
          <a href={CRIBBAGE_SOURCES.rules}>
            {en ? 'ACC 2025 rulebook' : 'ACC 2025规则书'}
          </a>
          {en
            ? ' (§1.3, §1.5–1.7, §6.3, §7.1–7.2, §8.2, §9.2–9.3); '
            : '（1.3、1.5–1.7、6.3、7.1–7.2、8.2、9.2–9.3节）；'}
          <a href={CRIBBAGE_SOURCES.index}>{en ? 'rules index' : '规则目录'}</a>
          {' · '}
          <a href={CRIBBAGE_SOURCES.crossCheck}>
            {en ? 'ACC scoring cross-check' : 'ACC计分数值核对'}
          </a>
          .
        </p>
      </footer>
    </section>
  );
}
