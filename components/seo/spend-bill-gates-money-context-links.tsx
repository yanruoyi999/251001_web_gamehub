'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getLocalizedPath, type Locale } from '@/i18n/config';
import {
  SPEND_BILL_GATES_MONEY_GUIDE_LINK_SLUGS,
  SPEND_BILL_GATES_MONEY_PATH,
} from '@/lib/games/spend-bill-gates-money-seo';

interface ContextCopy {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
}

const guideCopy: Record<string, Record<Locale, ContextCopy>> = {
  'games-to-play-when-bored': {
    zh: {
      eyebrow: '互动挑战',
      title: '换一种方式消磨时间：规划1000亿美元',
      body: '这个亿万富翁消费模拟器无需下载，可以用加减控制随时修改购买方案。',
      action: '试玩亿万富翁消费模拟器',
    },
    en: {
      eyebrow: 'Interactive challenge',
      title: 'A different boredom challenge: spend $100 billion',
      body: 'This billionaire spending simulator needs no download and lets you revise every purchase with plus and minus controls.',
      action: 'Try the billionaire spending simulator',
    },
  },
  'best-browser-games-5-minute-break': {
    zh: {
      eyebrow: '五分钟游戏',
      title: '你能在短时间内规划好1000亿美元吗？',
      body: '快速购买、减少和比较商品，然后查看属于你的亿万富翁身份。',
      action: '打开在线花钱游戏',
    },
    en: {
      eyebrow: 'Five-minute game',
      title: 'Can you plan a $100 billion budget in one short break?',
      body: 'Buy, remove, and compare items quickly, then reveal a shareable billionaire identity.',
      action: 'Open the money spending game',
    },
  },
  'free-games-no-ads': {
    zh: {
      eyebrow: '免下载原创游戏',
      title: '试试透明、可撤销的在线花钱游戏',
      body: '页面直接在浏览器运行，不要求账号，并清楚显示购买、退款、余额和进度。',
      action: '开始花光比尔·盖茨的钱游戏',
    },
    en: {
      eyebrow: 'No-download original',
      title: 'Try a transparent money game with reversible purchases',
      body: 'It runs in the browser with no account and keeps purchases, refunds, balance, and progress visible.',
      action: 'Play Spend Bill Gates Money',
    },
  },
};

export function resolveSpendBillContext(pathname: string): {
  locale: Locale;
  copy: ContextCopy;
} | null {
  const hasEnglishPrefix = pathname === '/en' || pathname.startsWith('/en/');
  const hasChinesePrefix = pathname === '/zh' || pathname.startsWith('/zh/');
  const locale: Locale = hasEnglishPrefix ? 'en' : 'zh';
  const localizedPrefix = hasEnglishPrefix ? '/en' : hasChinesePrefix ? '/zh' : '';
  const pathWithoutLocale = pathname.slice(localizedPrefix.length) || '/';

  const guidePrefix = '/guides/';
  if (!pathWithoutLocale.startsWith(guidePrefix)) return null;

  const slug = pathWithoutLocale.slice(guidePrefix.length).replace(/\/$/, '');
  if (!(SPEND_BILL_GATES_MONEY_GUIDE_LINK_SLUGS as readonly string[]).includes(slug)) {
    return null;
  }

  const copy = guideCopy[slug]?.[locale];
  return copy ? { locale, copy } : null;
}

export function SpendBillGatesMoneyContextLinks() {
  const pathname = usePathname();
  const context = resolveSpendBillContext(pathname);

  if (!context) return null;

  return (
    <aside className="border-t border-border bg-muted/30 px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 rounded-3xl border border-amber-300/40 bg-gradient-to-r from-slate-950 to-slate-900 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
            {context.copy.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            {context.copy.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
            {context.copy.body}
          </p>
        </div>
        <Link
          href={getLocalizedPath(context.locale, SPEND_BILL_GATES_MONEY_PATH)}
          className="inline-flex min-h-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-300 px-6 py-3 font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
        >
          {context.copy.action} →
        </Link>
      </div>
    </aside>
  );
}
