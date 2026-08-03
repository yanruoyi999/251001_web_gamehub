'use client';

import * as React from 'react';

import { SpendBillGatesMoneyShareSheet } from '@/components/game/spend-bill-gates-money-share-sheet';
import { trackInteraction } from '@/lib/analytics/events';
import {
  BILLIONAIRE_STYLE_COPY,
  INITIAL_WEALTH,
  PRODUCTS,
  calculateBillionaireStyle,
  calculateRemainingWealth,
  calculateTotalSpent,
  formatCompactUsd,
  formatFullUsd,
  getProductById,
  getSpentBucket,
  upsertPurchase,
  type FeedbackLevel,
  type Product,
  type Purchase,
  type SpendGameLocale,
} from '@/lib/games/spend-bill-gates-money';
import { decrementPurchase } from '@/lib/games/spend-bill-gates-money-purchases';
import type { ShareMethod } from '@/lib/games/spend-bill-gates-money-share';

interface SpendBillGatesMoneyGameProps {
  locale: SpendGameLocale;
}

interface FeedbackState {
  product: Product;
  level: FeedbackLevel;
  action: 'buy' | 'remove';
}

const copy = {
  zh: {
    inherited: '你刚刚继承了',
    question: '你能把它全部花完吗？',
    start: '开始花钱 💰',
    promise: '没有限制。没有后果。只有你的财富。',
    fortune: '你的财富',
    products: '选择你想买的东西',
    productsIntro: '可以重复购买，也可以随时减掉并退回金额。',
    buy: '增加一件',
    remove: '减少一件',
    cannotAfford: '余额不足',
    bought: '已购买',
    refunded: '已退回',
    epicPrefix: '你刚刚买下了',
    purchases: '你的购买记录',
    emptyPurchases: '还没有购买任何东西。',
    done: '我买完了',
    viewResult: '查看结果',
    doneHint: '至少购买一件商品后才能生成结果。',
    identityTitle: '你的亿万富翁身份',
    totalSpent: '你一共花了',
    moneyLeft: '还剩',
    share: '分享结果',
    playAgain: '再玩一次',
    resultLead: '我在 Luma Game Hub 的亿万富翁模拟器中花了',
    resultIdentity: '我的亿万富翁身份是',
    resultChallenge: '你会怎么花这 1000 亿美元？',
    units: '件商品',
    progressLabel: '剩余财富比例',
    quantity: '数量',
  },
  en: {
    inherited: 'YOU JUST INHERITED',
    question: 'Can you spend it all?',
    start: 'START SPENDING 💰',
    promise: 'No limits. No consequences. Just your fortune.',
    fortune: 'YOUR FORTUNE',
    products: 'Choose what you want to buy',
    productsIntro: 'Buy items more than once, or remove one to get the money back.',
    buy: 'Add one',
    remove: 'Remove one',
    cannotAfford: 'Not enough money',
    bought: 'Purchased',
    refunded: 'Refunded',
    epicPrefix: 'YOU JUST BOUGHT',
    purchases: 'YOUR PURCHASES',
    emptyPurchases: 'You have not bought anything yet.',
    done: "I'M DONE",
    viewResult: 'VIEW RESULT',
    doneHint: 'Buy at least one item before generating your result.',
    identityTitle: 'YOUR BILLIONAIRE IDENTITY',
    totalSpent: 'You spent',
    moneyLeft: 'Money left',
    share: 'SHARE RESULT',
    playAgain: 'PLAY AGAIN',
    resultLead: 'I spent',
    resultIdentity: 'My billionaire identity is',
    resultChallenge: 'How would you spend $100 billion?',
    units: 'items',
    progressLabel: 'Fortune remaining',
    quantity: 'Quantity',
  },
} as const;

function getLocalizedText(
  value: { zh: string; en: string },
  locale: SpendGameLocale,
): string {
  return value[locale];
}

function countPurchasedUnits(purchases: Purchase[]): number {
  return purchases.reduce((total, purchase) => total + purchase.count, 0);
}

function getPurchaseCount(purchases: Purchase[], productId: string): number {
  return purchases.find((purchase) => purchase.productId === productId)?.count ?? 0;
}

export function SpendBillGatesMoneyGame({
  locale,
}: SpendBillGatesMoneyGameProps) {
  const text = copy[locale];
  const [started, setStarted] = React.useState(false);
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [finished, setFinished] = React.useState(false);
  const [feedback, setFeedback] = React.useState<FeedbackState | null>(null);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');
  const purchasesRef = React.useRef<Purchase[]>([]);
  const feedbackTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const remaining = calculateRemainingWealth(purchases);
  const totalSpent = calculateTotalSpent(purchases);
  const purchaseCount = countPurchasedUnits(purchases);
  const progress = Math.max(
    0,
    Math.min(100, Math.round((remaining / INITIAL_WEALTH) * 100)),
  );
  const identity = calculateBillionaireStyle(purchases);
  const identityCopy = BILLIONAIRE_STYLE_COPY[identity];
  const identityLabel = getLocalizedText(identityCopy.label, locale);
  const shareTitle =
    locale === 'zh'
      ? '花光比尔·盖茨的钱 - 亿万富翁模拟器'
      : 'Spend Bill Gates Money - Billionaire Life Simulator';

  const showFeedback = React.useCallback(
    (product: Product, action: FeedbackState['action']) => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }

      setFeedback({ product, level: product.feedback, action });
      feedbackTimerRef.current = setTimeout(() => {
        setFeedback(null);
        feedbackTimerRef.current = null;
      }, 1500);
    },
    [],
  );

  const handleStart = () => {
    setStarted(true);
    setFinished(false);
    setShareOpen(false);
    trackInteraction('billionaire_game_start', {
      source: 'spend_bill_gates_money',
      locale,
    });

    window.requestAnimationFrame(() => {
      document
        .getElementById('billionaire-game-area')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleBuy = (product: Product) => {
    if (!started || finished) return;

    const currentPurchases = purchasesRef.current;
    const currentRemaining = calculateRemainingWealth(currentPurchases);
    if (currentRemaining < product.price) return;

    const updatedPurchases = upsertPurchase(currentPurchases, product.id);
    purchasesRef.current = updatedPurchases;
    setPurchases(updatedPurchases);
    showFeedback(product, 'buy');

    trackInteraction('billionaire_product_buy', {
      source: 'spend_bill_gates_money',
      locale,
      product_id: product.id,
      feedback_level: product.feedback,
      purchase_count: countPurchasedUnits(updatedPurchases),
    });
  };

  const handleRemove = (product: Product) => {
    if (!started || finished) return;

    const currentPurchases = purchasesRef.current;
    if (getPurchaseCount(currentPurchases, product.id) <= 0) return;

    const updatedPurchases = decrementPurchase(currentPurchases, product.id);
    purchasesRef.current = updatedPurchases;
    setPurchases(updatedPurchases);
    showFeedback(product, 'remove');

    trackInteraction('billionaire_product_remove', {
      source: 'spend_bill_gates_money',
      locale,
      product_id: product.id,
      feedback_level: product.feedback,
      purchase_count: countPurchasedUnits(updatedPurchases),
    });
  };

  const handleFinish = () => {
    const currentPurchases = purchasesRef.current;
    if (currentPurchases.length === 0) return;

    const currentIdentity = calculateBillionaireStyle(currentPurchases);
    const currentSpent = calculateTotalSpent(currentPurchases);
    setFinished(true);
    setFeedback(null);
    setShareOpen(false);

    trackInteraction('billionaire_game_finish', {
      source: 'spend_bill_gates_money',
      locale,
      identity: currentIdentity,
      purchase_count: countPurchasedUnits(currentPurchases),
      spent_bucket: getSpentBucket(currentSpent),
    });

    window.requestAnimationFrame(() => {
      document
        .getElementById('billionaire-result')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const buildShareText = React.useCallback(() => {
    if (locale === 'zh') {
      return `${text.resultLead} ${formatFullUsd(totalSpent, locale)}。${text.resultIdentity}「${identityLabel}」。${text.resultChallenge}`;
    }

    return `${text.resultLead} ${formatFullUsd(totalSpent, locale)} in Luma Game Hub's billionaire simulator. ${text.resultIdentity} “${identityLabel}.” ${text.resultChallenge}`;
  }, [identityLabel, locale, text.resultChallenge, text.resultIdentity, text.resultLead, totalSpent]);

  const recordShare = React.useCallback(
    (method: ShareMethod) => {
      trackInteraction('billionaire_share_click', {
        source: 'spend_bill_gates_money',
        locale,
        identity,
        share_method: method,
        purchase_count: purchaseCount,
        spent_bucket: getSpentBucket(totalSpent),
      });
    },
    [identity, locale, purchaseCount, totalSpent],
  );

  const closeShare = React.useCallback(() => {
    setShareOpen(false);
  }, []);

  const handleOpenShare = () => {
    setShareUrl(`${window.location.origin}${window.location.pathname}`);
    setShareOpen(true);
    trackInteraction('billionaire_share_open', {
      source: 'spend_bill_gates_money',
      locale,
      identity,
      purchase_count: purchaseCount,
      spent_bucket: getSpentBucket(totalSpent),
    });
  };

  const handleRestart = () => {
    purchasesRef.current = [];
    setPurchases([]);
    setStarted(false);
    setFinished(false);
    setFeedback(null);
    setShareOpen(false);
    setShareUrl('');
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }

    trackInteraction('billionaire_game_restart', {
      source: 'spend_bill_gates_money',
      locale,
    });

    window.requestAnimationFrame(() => {
      document
        .getElementById('billionaire-game-hero')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <section className="overflow-x-hidden bg-slate-950 text-white">
      <div
        id="billionaire-game-hero"
        className="flex min-h-[min(70svh,44rem)] flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 py-12 text-center sm:px-6"
      >
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300 sm:text-base">
          {text.inherited}
        </p>
        <p className="mt-6 whitespace-nowrap text-[clamp(2.1rem,10vw,4.5rem)] font-black leading-none tracking-tight text-white [font-variant-numeric:tabular-nums]">
          $100,000,000,000
        </p>
        <p className="mt-5 text-lg text-slate-300 sm:text-xl">{text.question}</p>
        <button
          type="button"
          data-testid="billionaire-start"
          onClick={handleStart}
          className="mt-10 inline-flex h-14 w-60 animate-[billionaire-breathe_2s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-amber-300 px-6 text-base font-black text-slate-950 shadow-lg shadow-amber-300/20 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 motion-reduce:animate-none"
        >
          {text.start}
        </button>
        <p className="mt-4 max-w-sm text-sm text-slate-400">{text.promise}</p>
      </div>

      {started ? (
        <div id="billionaire-game-area" className="scroll-mt-32 pb-16">
          {!finished ? (
            <>
              <div
                data-testid="billionaire-hud"
                className="fixed left-0 right-0 top-16 z-40 border-y border-white/10 bg-slate-950/95 px-3 py-2 shadow-lg backdrop-blur sm:px-6"
              >
                <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center gap-2 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-amber-300 sm:text-[0.65rem] sm:tracking-[0.18em]">
                      {text.fortune}
                    </p>
                    <p className="truncate text-lg font-black [font-variant-numeric:tabular-nums] sm:text-2xl">
                      💰 {formatCompactUsd(remaining, locale)}
                    </p>
                  </div>
                  <div className="w-20 flex-shrink-0 sm:w-48">
                    <div className="mb-1 flex items-center justify-between text-[0.6rem] text-slate-400 sm:text-[0.65rem]">
                      <span className="hidden sm:inline">{text.progressLabel}</span>
                      <span>{progress}%</span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-slate-800"
                      role="progressbar"
                      aria-label={text.progressLabel}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                    >
                      <div
                        className="h-full rounded-full bg-amber-300 transition-[width] duration-300 motion-reduce:transition-none"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    data-testid="billionaire-hud-finish"
                    onClick={handleFinish}
                    disabled={purchases.length === 0}
                    className="inline-flex min-h-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-300 px-3 text-xs font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 sm:px-5 sm:text-sm"
                  >
                    {text.viewResult}
                  </button>
                </div>
              </div>
              <div
                data-testid="billionaire-hud-spacer"
                className="h-[72px]"
                aria-hidden="true"
              />
            </>
          ) : null}

          <div aria-live="polite" aria-atomic="true">
            {feedback &&
            (feedback.action === 'remove' || feedback.level !== 'epic') ? (
              <div
                className={`fixed left-4 right-4 top-36 z-[70] mx-auto max-w-md rounded-2xl border px-5 py-4 text-center shadow-2xl motion-safe:animate-in motion-safe:slide-in-from-top-3 ${
                  feedback.action === 'remove'
                    ? 'border-emerald-200/30 bg-emerald-950'
                    : 'border-amber-200/30 bg-slate-900'
                }`}
              >
                <p className="text-2xl" aria-hidden="true">
                  {feedback.product.emoji}
                </p>
                <p className="mt-1 font-bold text-white">
                  {feedback.action === 'remove'
                    ? `+${formatCompactUsd(feedback.product.price, locale)} · ${getLocalizedText(feedback.product.name, locale)} ${text.refunded}`
                    : feedback.level === 'legendary' && feedback.product.toast
                      ? getLocalizedText(feedback.product.toast, locale)
                      : `-${formatCompactUsd(feedback.product.price, locale)} · ${getLocalizedText(feedback.product.name, locale)} ${text.bought}`}
                </p>
              </div>
            ) : null}
          </div>

          {feedback &&
          feedback.action === 'buy' &&
          feedback.product.feedback === 'epic' ? (
            <div
              className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-6 text-center backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in"
              aria-hidden="true"
            >
              <div className="rounded-3xl border border-amber-300/50 bg-slate-900 px-8 py-10 shadow-2xl motion-safe:animate-in motion-safe:zoom-in-95 motion-reduce:animate-none">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">
                  {text.epicPrefix}
                </p>
                <p className="mt-4 text-5xl">{feedback.product.emoji}</p>
                <p className="mt-4 text-3xl font-black text-white">
                  {getLocalizedText(feedback.product.name, locale)}
                </p>
              </div>
            </div>
          ) : null}

          {!finished ? (
            <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
              <header className="mb-7">
                <h2 className="text-2xl font-black sm:text-3xl">{text.products}</h2>
                <p className="mt-2 text-sm text-slate-400">{text.productsIntro}</p>
              </header>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {PRODUCTS.map((product) => {
                  const count = getPurchaseCount(purchases, product.id);
                  const canAfford = remaining >= product.price;
                  const isEpic = product.feedback === 'epic';
                  const isLegendary = product.feedback === 'legendary';
                  const productName = getLocalizedText(product.name, locale);

                  return (
                    <article
                      key={product.id}
                      className={`flex min-h-72 flex-col rounded-2xl border bg-[#111827] p-6 shadow-sm ${
                        isEpic
                          ? 'border-amber-300/70'
                          : isLegendary
                            ? 'border-fuchsia-300/60'
                            : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-4xl" aria-hidden="true">
                          {product.emoji}
                        </span>
                        {isEpic ? (
                          <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2.5 py-1 text-[0.65rem] font-black tracking-wide text-amber-200">
                            ⭐ EPIC
                          </span>
                        ) : null}
                        {isLegendary ? (
                          <span className="rounded-full border border-fuchsia-300/40 bg-fuchsia-300/10 px-2.5 py-1 text-[0.65rem] font-black tracking-wide text-fuchsia-200">
                            🌙 LEGENDARY
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-5 text-xl font-black">{productName}</h3>
                      <p className="mt-2 text-2xl font-black text-amber-300 [font-variant-numeric:tabular-nums]">
                        {formatCompactUsd(product.price, locale)}
                      </p>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                        {getLocalizedText(product.description, locale)}
                      </p>
                      <div className="mt-auto pt-6">
                        <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
                          <button
                            type="button"
                            data-testid={`remove-${product.id}`}
                            onClick={() => handleRemove(product)}
                            disabled={count === 0}
                            title={`${text.remove}: ${productName}`}
                            aria-label={`${text.remove}: ${productName}`}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-xl font-black text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:text-slate-600"
                          >
                            −
                          </button>
                          <div
                            data-testid={`quantity-${product.id}`}
                            aria-label={`${text.quantity}: ${count}`}
                            className="flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 px-3 text-center font-black text-emerald-300 [font-variant-numeric:tabular-nums]"
                          >
                            ×{count}
                          </div>
                          <button
                            type="button"
                            data-testid={`buy-${product.id}`}
                            onClick={() => handleBuy(product)}
                            disabled={!canAfford}
                            title={canAfford ? `${text.buy}: ${productName}` : text.cannotAfford}
                            aria-label={canAfford ? `${text.buy}: ${productName}` : `${productName}: ${text.cannotAfford}`}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-white text-xl font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/40 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                          >
                            +
                          </button>
                        </div>
                        {!canAfford ? (
                          <p className="mt-2 text-center text-xs text-slate-500">
                            {text.cannotAfford}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>

              <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-black">{text.purchases}</h2>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                    {purchaseCount} {text.units}
                  </span>
                </div>
                {purchases.length > 0 ? (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {purchases.map((purchase) => {
                      const product = getProductById(purchase.productId);
                      if (!product) return null;
                      return (
                        <li
                          key={purchase.productId}
                          className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3"
                        >
                          <span className="min-w-0 truncate font-semibold">
                            {product.emoji}{' '}
                            {getLocalizedText(product.name, locale)}
                          </span>
                          <span className="font-black text-amber-300">
                            ×{purchase.count}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">{text.emptyPurchases}</p>
                )}

                <div className="mt-7 flex flex-col items-center">
                  <button
                    type="button"
                    data-testid="billionaire-finish"
                    onClick={handleFinish}
                    disabled={purchases.length === 0}
                    className="inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-xl bg-amber-300 px-6 py-3 font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  >
                    {text.done}
                  </button>
                  {purchases.length === 0 ? (
                    <p className="mt-2 text-center text-xs text-slate-500">{text.doneHint}</p>
                  ) : null}
                </div>
              </section>
            </div>
          ) : (
            <div
              id="billionaire-result"
              className="scroll-mt-24 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6"
            >
              <section className="rounded-3xl border border-amber-300/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center shadow-2xl sm:p-10">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">
                  {text.identityTitle}
                </p>
                <p className="mt-6 text-6xl" aria-hidden="true">
                  {identityCopy.emoji}
                </p>
                <h2 className="mt-4 text-3xl font-black sm:text-5xl">
                  {identityLabel}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
                  {getLocalizedText(identityCopy.description, locale)}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">{text.totalSpent}</p>
                    <p className="mt-2 text-2xl font-black text-amber-300 sm:text-3xl">
                      {formatFullUsd(totalSpent, locale)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">{text.moneyLeft}</p>
                    <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
                      {formatFullUsd(remaining, locale)}
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-left">
                  <h3 className="text-lg font-black">{text.purchases}</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {purchases.map((purchase) => {
                      const product = getProductById(purchase.productId);
                      if (!product) return null;
                      return (
                        <li
                          key={purchase.productId}
                          className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                        >
                          <span className="min-w-0 truncate font-semibold">
                            {product.emoji}{' '}
                            {getLocalizedText(product.name, locale)}
                          </span>
                          <span className="font-black text-amber-300">
                            ×{purchase.count}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    data-testid="billionaire-share"
                    onClick={handleOpenShare}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-300 px-7 py-3 font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
                  >
                    {text.share}
                  </button>
                  <button
                    type="button"
                    data-testid="billionaire-restart"
                    onClick={handleRestart}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3 font-black text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                  >
                    {text.playAgain}
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      ) : null}

      <SpendBillGatesMoneyShareSheet
        locale={locale}
        open={shareOpen}
        onClose={closeShare}
        shareText={buildShareText()}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        identityEmoji={identityCopy.emoji}
        identityLabel={identityLabel}
        totalSpentLabel={text.totalSpent}
        totalSpentValue={formatFullUsd(totalSpent, locale)}
        onShare={recordShare}
      />

      <style jsx>{`
        @keyframes billionaire-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          button {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </section>
  );
}
