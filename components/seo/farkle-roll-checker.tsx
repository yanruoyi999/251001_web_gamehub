'use client';

import { useState, useSyncExternalStore, type FormEvent } from 'react';
import type { Locale } from '@/i18n/config';
import { trackInteraction } from '@/lib/analytics/events';
import { FARKLE_FACES, FARKLE_FIRST_BANK, checkFarkleRoll, type FarkleRollResult } from '@/lib/farkle-roll-check';
import { getGuideIntentProperties } from '@/lib/guide-intent';

const subscribe = () => () => undefined;
const clientReady = () => true;
const serverReady = () => false;

export function FarkleRollChecker({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [result, setResult] = useState<FarkleRollResult | null>();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const dice = fields.getAll('die').filter(value => value !== '').map(Number);
    const checked = checkFarkleRoll(dice, Number(fields.get('earlierPoints')), fields.has('hasBanked'));
    setResult(checked);
    if (checked) {
      const properties = getGuideIntentProperties('farkle-scoring', 'score_check', locale);
      if (properties) trackInteraction('guide_intent_click', properties);
    }
  }

  return (
    <section aria-labelledby="farkle-roll-check" className="mb-8 space-y-3 rounded-xl border p-4 sm:p-6">
      <h2 id="farkle-roll-check" className="text-2xl font-semibold">
        {zh ? '骰面验算' : 'Dice roll calculator'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {zh
          ? '按 PlayMonster 版本，输入同一次掷出的所有骰面，空格可留白。结果给出这一掷的最高合法得分。'
          : 'Enter every die from one throw. Leave unused fields blank to see the highest legal score under the PlayMonster rules.'}
      </p>
      <noscript><p className="text-sm">{zh ? '可用下方计分表手算。' : 'Use the scoring reference below to check by hand.'}</p></noscript>
      <form onSubmit={onSubmit} onChange={() => setResult(undefined)} onReset={() => setResult(undefined)}>
        <fieldset disabled={!ready} className="space-y-4">
          <legend className="sr-only">{zh ? '掷骰与累计得分' : 'Dice and running score'}</legend>
          <div className="grid max-w-xl grid-cols-3 gap-2 sm:grid-cols-6">
            {FARKLE_FACES.map(position => (
              <label key={position} className="flex min-w-0 flex-col gap-1 text-sm">
                {zh ? `骰子 ${position}` : `Die ${position}`}
                <select name="die" defaultValue="" className="min-h-11 rounded-md border bg-background px-2">
                  <option value="">–</option>
                  {FARKLE_FACES.map(face => <option key={face} value={face}>{face}</option>)}
                </select>
              </label>
            ))}
          </div>
          <label className="flex max-w-xs flex-col gap-1 text-sm">
            {zh ? '本回合先前累计' : 'Points from earlier rolls this turn'}
            <input
              name="earlierPoints"
              type="number"
              min="0"
              step="50"
              defaultValue="0"
              className="min-h-11 w-28 rounded-md border bg-background px-2"
            />
          </label>
          <label className="flex min-h-11 w-fit items-center gap-2 text-sm">
            <input type="checkbox" name="hasBanked" className="size-4" />
            {zh ? '我之前已经入账' : 'I have already banked in this game'}
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
              {zh ? '验算得分' : 'Check score'}
            </button>
            <button type="reset" className="min-h-11 rounded-md border px-4 text-sm font-medium">
              {zh ? '清空骰面' : 'Reset'}
            </button>
          </div>
        </fieldset>
      </form>
      {result !== undefined && (
        <div role="status" className="space-y-1 rounded-md border bg-muted/50 p-3 text-sm">
          {result ? (
            <>
              <p className="font-semibold">
                {zh ? `本次掷骰得 ${result.rollPoints} 分。` : `This roll: ${result.rollPoints} points.`}
              </p>
              <p>
                {zh ? `计分骰 ${result.scoringDice} 枚。本回合累计 ${result.turnPoints} 分。`
                  : `${result.scoringDice} dice score. Turn total: ${result.turnPoints} points.`}
              </p>
              <p>
                {result.status === 'farkle'
                  ? (zh ? 'Farkle，本回合暂存清零。' : 'Farkle. The unbanked turn points are lost.')
                  : result.status === 'first-bank-blocked'
                    ? (zh ? `首次入账须至少 ${FARKLE_FIRST_BANK} 分，本回合还不能入账。`
                      : `Your first bank requires at least ${FARKLE_FIRST_BANK} points. Keep rolling to reach it.`)
                    : (zh ? '可以入账。' : 'You can bank this turn.')}
              </p>
            </>
          ) : (
            <p>{zh ? '请选择至少一枚骰子，并核对先前累计分。' : 'Select at least one die and check the earlier turn points.'}</p>
          )}
        </div>
      )}
    </section>
  );
}
