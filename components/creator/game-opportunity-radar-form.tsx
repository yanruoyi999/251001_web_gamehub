'use client';

import * as React from 'react';

import { trackInteraction } from '@/lib/analytics/events';
import type { Locale } from '@/i18n/config';
import {
  GAME_OPPORTUNITY_OPTIONS,
  evaluateGameOpportunity,
  type GameOpportunityBudget,
  type GameOpportunityGenre,
  type GameOpportunityPlatform,
  type GameOpportunityTeam,
  type GameOpportunityTimeline,
} from '@/lib/game-opportunity-radar';

interface GameOpportunityRadarFormProps {
  locale: Locale;
}

const copy = {
  zh: {
    eyebrow: '浏览器端快速初筛',
    title: 'MVP 可交付性',
    intro: '选择你的真实约束，先判断第一版是否能在预算和周期内完成。结果会即时更新。',
    platform: '目标平台',
    team: '团队规模',
    budget: '首版预算',
    timeline: '开发周期',
    genre: '计划玩法',
    score: '可交付性分数',
    exampleStatus: '默认示例：修改任意选项后，结果才代表你的约束。',
    personalizedStatus: '已按你的选择更新。',
    scope: '首版应该做多小',
    monetization: '第一轮怎么验证付费',
    risk: '当前最大风险',
    evidence: '下一步补什么证据',
    privacy: '你的选择只保留在当前页面，不会发送到服务器。仅记录匿名的“已更新结果”和“点击报告申请”事件。',
  },
  en: {
    eyebrow: 'Browser-only first screen',
    title: 'MVP delivery fit',
    intro: 'Select your real constraints to check whether a first release can fit the budget and schedule. The result updates instantly.',
    platform: 'Platform',
    team: 'Team size',
    budget: 'First-release budget',
    timeline: 'Development window',
    genre: 'Planned genre',
    score: 'Delivery-fit score',
    exampleStatus: 'Example defaults: change any option before treating this as your assessment.',
    personalizedStatus: 'Updated for your choices.',
    scope: 'How small the first release should be',
    monetization: 'First monetization test',
    risk: 'Largest current risk',
    evidence: 'Evidence to collect next',
    privacy: 'Your selections stay on this page and are not sent to a server. Only anonymous “result updated” and “report request clicked” events are recorded.',
  },
} as const;

export function GameOpportunityRadarForm({ locale }: GameOpportunityRadarFormProps) {
  const text = copy[locale];
  const [platform, setPlatform] = React.useState<GameOpportunityPlatform>('browser');
  const [team, setTeam] = React.useState<GameOpportunityTeam>('solo');
  const [budget, setBudget] = React.useState<GameOpportunityBudget>('lean');
  const [timeline, setTimeline] = React.useState<GameOpportunityTimeline>('60d');
  const [genre, setGenre] = React.useState<GameOpportunityGenre>('roguelike');
  const [hasPersonalizedResult, setHasPersonalizedResult] = React.useState(false);
  const hasTrackedPersonalizedResult = React.useRef(false);

  const markPersonalizedResult = React.useCallback(() => {
    setHasPersonalizedResult(true);

    if (hasTrackedPersonalizedResult.current) return;

    hasTrackedPersonalizedResult.current = true;
    trackInteraction('game_radar_result_personalized', {
      source: 'game_opportunity_radar',
      locale,
    });
  }, [locale]);

  React.useEffect(() => {
    const handleReportIntent = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href^="mailto:dev@lumagamehub.com"]');
      if (!link) return;

      const href = link.getAttribute('href') ?? '';
      if (!href.includes('Game%20Opportunity%20Radar')) return;

      trackInteraction('game_radar_report_intent_clicked', {
        source: 'game_opportunity_radar',
        locale,
      });
    };

    document.addEventListener('click', handleReportIntent);
    return () => document.removeEventListener('click', handleReportIntent);
  }, [locale]);

  const result = React.useMemo(
    () =>
      evaluateGameOpportunity(
        {
          platform,
          team,
          budget,
          timeline,
          genre,
        },
        locale,
      ),
    [budget, genre, locale, platform, team, timeline],
  );

  return (
    <section
      aria-labelledby="game-opportunity-radar-title"
      className="rounded-3xl border border-primary/25 bg-card p-5 shadow-sm sm:p-8"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {text.eyebrow}
        </p>
        <h2 id="game-opportunity-radar-title" className="mt-2 text-3xl font-bold text-foreground">
          {text.title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{text.intro}</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <label className="text-sm font-medium text-foreground">
          <span className="mb-2 block">{text.platform}</span>
          <select
            value={platform}
            onChange={(event) => {
              setPlatform(event.target.value as GameOpportunityPlatform);
              markPersonalizedResult();
            }}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {GAME_OPPORTUNITY_OPTIONS.platform.map((option) => (
              <option key={option.value} value={option.value}>
                {option[locale]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          <span className="mb-2 block">{text.team}</span>
          <select
            value={team}
            onChange={(event) => {
              setTeam(event.target.value as GameOpportunityTeam);
              markPersonalizedResult();
            }}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {GAME_OPPORTUNITY_OPTIONS.team.map((option) => (
              <option key={option.value} value={option.value}>
                {option[locale]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          <span className="mb-2 block">{text.budget}</span>
          <select
            value={budget}
            onChange={(event) => {
              setBudget(event.target.value as GameOpportunityBudget);
              markPersonalizedResult();
            }}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {GAME_OPPORTUNITY_OPTIONS.budget.map((option) => (
              <option key={option.value} value={option.value}>
                {option[locale]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          <span className="mb-2 block">{text.timeline}</span>
          <select
            value={timeline}
            onChange={(event) => {
              setTimeline(event.target.value as GameOpportunityTimeline);
              markPersonalizedResult();
            }}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {GAME_OPPORTUNITY_OPTIONS.timeline.map((option) => (
              <option key={option.value} value={option.value}>
                {option[locale]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-foreground">
          <span className="mb-2 block">{text.genre}</span>
          <select
            value={genre}
            onChange={(event) => {
              setGenre(event.target.value as GameOpportunityGenre);
              markPersonalizedResult();
            }}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {GAME_OPPORTUNITY_OPTIONS.genre.map((option) => (
              <option key={option.value} value={option.value}>
                {option[locale]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div aria-live="polite" className="mt-8 rounded-2xl border border-border bg-background p-5 sm:p-6">
        <p className="mb-4 text-sm font-medium text-primary">
          {hasPersonalizedResult ? text.personalizedStatus : text.exampleStatus}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{text.score}</p>
            <p className="mt-1 text-4xl font-bold text-foreground">
              {result.score}
              <span className="ml-1 text-lg font-medium text-muted-foreground">/ 100</span>
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {result.bandLabel}
          </span>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${result.score}%` }}
          />
        </div>

        <dl className="mt-7 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <dt className="font-semibold text-foreground">{text.scope}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.scope}</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="font-semibold text-foreground">{text.monetization}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {result.monetizationTest}
            </dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="font-semibold text-foreground">{text.risk}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.risk}</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="font-semibold text-foreground">{text.evidence}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {result.evidenceNext}
            </dd>
          </div>
        </dl>

        <p className="mt-6 rounded-xl bg-primary/5 p-4 text-sm leading-relaxed text-foreground/80">
          {result.disclaimer}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{text.privacy}</p>
      </div>
    </section>
  );
}
