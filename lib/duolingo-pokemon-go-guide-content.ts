import type { SeoLandingPage } from '@/lib/seo-landing-content';

const announcement = 'https://pokemongo.com/en/news/duolingo-2026';
const redemption = 'https://store.pokemongo.com/offer-redemption';
export const POKEMON_GO_QUEST_START = '2026-11-17T10:00:00+09:00';
const joinDeadline = '2026-12-21';
const lessonDeadline = '2026-12-29';
const researchDeadline = '2026-12-31';
export const POKEMON_GO_REQUIRED_DAYS = 7;

type QuestPlan =
  | { status: 'on-track'; remaining: number; finish: string; spare: number }
  | { status: 'not-enough-days'; remaining: number; available: number }
  | {
      status:
        | 'invalid'
        | 'before-start'
        | 'join-first'
        | 'join-closed'
        | 'claim-code'
        | 'practice-closed'
        | 'event-ended';
    };

const millisecondsPerDay = 86_400_000;

export function planPokemonGoQuest(
  date: string,
  completedDays: number,
  joined: boolean,
  firstLocalDate: string
): QuestPlan {
  // Treat the selected local calendar date as a day, independent of time zone and DST.
  const selected = new Date(date + 'T00:00:00.000Z');
  if (
    !Number.isFinite(selected.getTime()) ||
    selected.toISOString().slice(0, 10) !== date ||
    !Number.isInteger(completedDays) ||
    completedDays < 0 ||
    completedDays > POKEMON_GO_REQUIRED_DAYS
  ) {
    return { status: 'invalid' };
  }
  if (date < firstLocalDate) return { status: 'before-start' };
  if (date > researchDeadline) return { status: 'event-ended' };
  if (!joined)
    return { status: date <= joinDeadline ? 'join-first' : 'join-closed' };
  if (date > lessonDeadline) return { status: 'practice-closed' };

  const remaining = POKEMON_GO_REQUIRED_DAYS - completedDays;
  if (remaining === 0) return { status: 'claim-code' };

  const available =
    (Date.parse(lessonDeadline) - selected.getTime()) / millisecondsPerDay + 1;
  if (remaining > available)
    return { status: 'not-enough-days', remaining, available };

  const finish = new Date(
    selected.getTime() + (remaining - 1) * millisecondsPerDay
  );
  return {
    status: 'on-track',
    remaining,
    finish: finish.toISOString().slice(0, 10),
    spare: available - remaining,
  };
}

export const DUOLINGO_POKEMON_GO_GUIDE: SeoLandingPage = {
  slug: 'duolingo-pokemon-go',
  primaryKeyword: 'duolingo pokemon go',
  keywords: [
    'Duolingo Pokémon GO',
    'Duo’s Pokémon Party',
    'Pokémon GO Timed Research',
    'Duolingo Pokémon GO offer code',
  ],
  updatedAt: '2026-11-20',
  homepageFeatured: true,
  relatedSlugs: ['word-chain-game-examples', 'best-free-iphone-games'],
  locales: {
    en: {
      metaTitle: 'Duolingo Pokémon GO 2026 | Quest Dates and Code Guide',
      metaDescription:
        'Check the three deadlines for the 2026 Duolingo and Pokémon GO event, calculate your remaining lesson days, and find the official code redemption page.',
      heading: 'Duolingo Pokémon GO Event Guide',
      subheading:
        'Plan seven lesson days, claim your offer code, and finish Timed Research before its separate deadline.',
      overview: [
        'The 2026 event takes place in both apps. Keep track of joining, earning the code, and claiming your in-game rewards separately.',
      ],
      sections: [
        {
          title: 'The three deadlines',
          body: 'The 2026 event requires a lesson on each of seven different dates. The deadlines below are at 11:59 p.m. in your local time.',
          bullets: [
            'December 21 — Join Duo’s Pokémon Party in Duolingo.',
            'December 29 — Finish your seven lesson days and claim the Duolingo reward.',
            'December 31 — Complete Timed Research and claim the rewards in Pokémon GO.',
          ],
        },
        {
          title: 'Join in Duolingo and count calendar days',
          body: 'Open the quest in the latest Duolingo app. The event began on November 17 at 10 a.m. Japan time. After joining, finish at least one lesson in any course on each of seven different dates. The planner counts the date you select as an available day, so enter only the lesson days before it.',
        },
        {
          title: 'Claim the code and finish in Pokémon GO',
          body: 'Claim the offer code in Duolingo and enter it in the official Pokémon GO Web Store while signed in to the Pokémon GO account you use. Open the game to start your Timed Research. Leave time to finish the tasks and collect the in-game rewards by December 31.',
        },
        {
          title: 'If the quest or code is missing',
          body: 'Update Duolingo and check that the quest is visible on your account. Check the quest’s recorded progress against your lesson dates. If you redeemed a code but cannot see the research, first check that the store and game use the same Pokémon GO account.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Do seven lessons in one day qualify?',
          answer:
            'No. The event counts seven different dates with at least one lesson completed per date.',
        },
        {
          question: 'Can I start the lessons on December 23?',
          answer:
            'By the calendar, December 23 through 29 gives you exactly seven dates. You must have joined by December 21 and still claim the Duolingo reward by December 29.',
        },
        {
          question:
            'Do I have to finish the Pokémon GO tasks on the day I claim the code?',
          answer:
            'The game has a separate deadline. After opening the research, finish the tasks and claim their rewards by December 31 at 11:59 p.m. local time.',
        },
      ],
      quickAnswerLink: {
        href: announcement,
        label: 'Pokémon GO official event announcement',
        description:
          'Verify the local deadlines and the rules for earning the offer code.',
      },
      externalLinks: [
        {
          href: redemption,
          label: 'Official Pokémon GO code redemption',
          description:
            'Use the Pokémon GO account on which you want to receive Timed Research.',
        },
      ],
      ctaLabel: 'Browse browser games',
      ctaDescription:
        'Play a short game while you wait for another qualifying day.',
    },
    zh: {
      metaTitle: 'Duolingo × Pokémon GO 2026 攻略｜期限、进度与兑换',
      metaDescription:
        '查看 2026 多邻国和 Pokémon GO 联动的三项截止时间，计算还差几天课程，并找到官方兑换码入口。',
      heading: 'Duolingo × Pokémon GO 联动攻略',
      subheading:
        '安排七天课程、领取兑换码，再按另一项期限完成 Pokémon GO 限时调查。',
      overview: [
        '2026 年联动需要在两个应用里完成。报名、领取兑换码、领取游戏奖励各有一个截止时间。',
      ],
      sections: [
        {
          title: '三个截止时间',
          body: '2026 年活动要在七个不同日期完成课程。下面的截止时间均为当地时间晚上 11:59。',
          bullets: [
            '12 月 21 日前在多邻国加入 Duo’s Pokémon Party。',
            '12 月 29 日前凑满七个学习日，并领取多邻国奖励。',
            '12 月 31 日前完成 Pokémon GO 的限时调查并领取奖励。',
          ],
        },
        {
          title: '在多邻国加入任务，按日期计数',
          body: '用最新版多邻国打开活动任务。活动于日本时间 11 月 17 日上午 10 点开始。加入后，任选课程，在七个不同日期各完成至少一课。下方工具把所选日期算作可用的一天，已完成天数只填所选日期之前的天数。',
        },
        {
          title: '领取兑换码并完成限时调查',
          body: '在多邻国领取兑换码，然后用平时玩的 Pokémon GO 账号登录官方商店兑换。回到游戏开始限时调查，预留时间在 12 月 31 日前完成任务并领取游戏奖励。',
        },
        {
          title: '找不到活动或兑换后没看到任务',
          body: '先更新多邻国，确认账号能看到活动，再对照实际课程日期和任务进度。兑码成功却没看到限时调查时，先查商店和游戏登录的是不是同一个 Pokémon GO 账号。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '一天做七课能拿到兑换码吗？',
          answer: '不能。活动按不同日期计算，同一天完成多课仍只算一天。',
        },
        {
          question: '12 月 23 日才开始做课还来得及吗？',
          answer:
            '按日历，12 月 23 日至 29 日刚好七天。前提是 12 月 21 日前已经加入，且 12 月 29 日前要领到多邻国奖励。',
        },
        {
          question: '领取兑换码当天就要做完 Pokémon GO 任务吗？',
          answer:
            '游戏任务有自己的期限。开启限时调查后，在当地时间 12 月 31 日晚上 11:59 前完成任务并领取奖励。',
        },
      ],
      quickAnswerLink: {
        href: announcement,
        label: 'Pokémon GO 官方联动公告',
        description: '核对各项当地时间和获取兑换码的条件。',
      },
      externalLinks: [
        {
          href: redemption,
          label: 'Pokémon GO 官方兑换入口',
          description: '用需要领取限时调查的游戏账号登录。',
        },
      ],
      ctaLabel: '浏览在线小游戏',
      ctaDescription: '等下一个学习日时，可以玩一局短游戏。',
    },
  },
};
