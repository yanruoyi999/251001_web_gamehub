import type { Metadata } from 'next';

import { getLocalizedPath, type Locale } from '@/i18n/config';
import {
  NEW_EXPERIMENT_PAGE_DEFINITIONS,
  NEW_EXPERIMENT_PAGE_SUMMARIES,
  type NewExperimentSlug,
} from '@/lib/games/luma-original-experiment-pages-20260830';
import { DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES, buildAbsoluteUrl } from '@/lib/seo';

export const ORIGINAL_EXPERIMENT_PUBLISHED_AT = '2026-08-26T00:00:00.000Z';
export const ORIGINAL_EXPERIMENT_UPDATED_AT = '2026-08-30T00:00:00.000Z';

export const ORIGINAL_EXPERIMENT_PAGE_SUMMARIES = [
  {
    slug: 'daily-solitaire',
    path: '/games/daily-solitaire',
    keyword: 'daily solitaire',
    pageType: 'game',
    qualityScore: 94,
  },
  {
    slug: 'connect-the-dots',
    path: '/games/connect-the-dots',
    keyword: 'connect the dots game',
    pageType: 'game',
    qualityScore: 92,
  },
  {
    slug: 'sorting-games',
    path: '/games/sorting-games',
    keyword: 'sorting games',
    pageType: 'game_collection',
    qualityScore: 91,
  },
  {
    slug: 'mahjong-connect',
    path: '/games/mahjong-connect',
    keyword: 'mahjong connect',
    pageType: 'game',
    qualityScore: 93,
  },
  {
    slug: 'asmr-games',
    path: '/games/asmr-games',
    keyword: 'asmr games',
    pageType: 'game',
    qualityScore: 90,
  },
  ...NEW_EXPERIMENT_PAGE_SUMMARIES,
] as const;

export type OriginalExperimentSlug = (typeof ORIGINAL_EXPERIMENT_PAGE_SUMMARIES)[number]['slug'];

export interface OriginalExperimentSection {
  title: string;
  body: string;
}

export interface OriginalExperimentFaq {
  question: string;
  answer: string;
}

export interface OriginalExperimentRelatedLink {
  href: string;
  title: string;
  description: string;
}

export interface OriginalExperimentLocaleCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  title: string;
  intro: string;
  originalNote: string;
  sections: OriginalExperimentSection[];
  faqTitle: string;
  faqs: OriginalExperimentFaq[];
  relatedTitle: string;
  related: OriginalExperimentRelatedLink[];
  home: string;
  games: string;
  backToGames: string;
}

export interface OriginalExperimentPageDefinition {
  slug: OriginalExperimentSlug;
  path: string;
  keyword: string;
  pageType: string;
  qualityScore: number;
  playMode?: 'SinglePlayer' | 'MultiPlayer' | Array<'SinglePlayer' | 'MultiPlayer'>;
  collectionItems?: Array<{ name: string; anchor: string }>;
  locales: Record<Locale, OriginalExperimentLocaleCopy>;
}

const pageDefinitions: Record<OriginalExperimentSlug, OriginalExperimentPageDefinition> = {
  'daily-solitaire': {
    slug: 'daily-solitaire',
    path: '/games/daily-solitaire',
    keyword: 'daily solitaire',
    pageType: 'game',
    qualityScore: 94,
    locales: {
      en: {
        metaTitle: 'Daily Solitaire - Play a Seeded Daily Challenge Online',
        metaDescription:
          'Play a replayable daily solitaire challenge with draw 1 or draw 3, undo, hints, a calendar date, local progress, and touch-friendly card controls.',
        keywords: [
          'daily solitaire',
          'daily challenge solitaire',
          'solitaire daily challenge',
          'solitaire game online',
          'draw 3 solitaire',
        ],
        eyebrow: 'Luma original card challenge',
        title: 'Daily Solitaire',
        intro:
          'Play one deterministic card deal at a time. Choose draw 1 or draw 3, move cards between the tableau and foundations, and replay the same date whenever you want to improve your score.',
        originalNote:
          'This is a clean-room Luma implementation of public-domain solitaire rules with original layout, code, and visual treatment. It does not copy a third-party game, artwork, or proprietary deal service.',
        sections: [
          {
            title: 'How the daily deal works',
            body:
              'The selected calendar date becomes the deal seed, so the same date always opens the same deck order in this browser. The tableau uses familiar alternating-color descending moves, while each foundation accepts its suit from Ace through King. A reset keeps the date and starts the deal from its original state.',
          },
          {
            title: 'Draw 1 or draw 3',
            body:
              'Draw 1 exposes the next card and is the gentler way to learn the board. Draw 3 creates a tighter stock puzzle: three cards move to the waste at a time, and only the top waste card is available. Change the mode before a new replay so your move count remains easy to compare.',
          },
          {
            title: 'Moves, undo, hints, and local progress',
            body:
              'Every legal move increases the move counter. Undo is kept in the current tab so a risky tableau move can be reversed without an account. Hint highlights a legal next step when one is visible. Best score, streak, and the last selected date stay in local browser storage; no play history is uploaded.',
          },
          {
            title: 'Phone and keyboard play',
            body:
              'Cards are buttons with labels, so they can be reached by keyboard or touch. On a phone, select a face-up card and tap its destination foundation or tableau column. On desktop, double-clicking a movable top card attempts the next foundation move. If a small screen feels crowded, use portrait mode and scroll the page rather than zooming the browser.',
          },
        ],
        faqTitle: 'Daily Solitaire FAQ',
        faqs: [
          {
            question: 'Is each daily solitaire deal the same every day?',
            answer:
              'The selected date creates a deterministic deal. A different date creates a different replayable deck order, while resetting the same date returns to the same starting state.',
          },
          {
            question: 'What is the difference between draw 1 and draw 3?',
            answer:
              'Draw 1 moves one stock card to the waste at a time. Draw 3 moves three cards at a time and makes the available waste card order more restrictive.',
          },
          {
            question: 'Does Daily Solitaire save my score online?',
            answer:
              'No. The current best score, streak, and last date are saved only in this browser. You do not need an account, and the page does not upload a personal profile.',
          },
          {
            question: 'Can I play Daily Solitaire on a phone?',
            answer:
              'Yes. The controls use accessible buttons and work with touch. A physical keyboard is optional, not required.',
          },
        ],
        relatedTitle: 'Keep exploring Luma',
        related: [
          {
            href: '/games/solitaire',
            title: 'Classic Solitaire',
            description: 'Open the existing classic card-game page and its rules overview.',
          },
          {
            href: '/games',
            title: 'Browse all games',
            description: 'Find more short-session browser games without an installer.',
          },
          {
            href: '/games/category/puzzle',
            title: 'Puzzle games',
            description: 'Switch from cards to other focused logic and timing challenges.',
          },
        ],
        home: 'Home',
        games: 'Games',
        backToGames: 'Back to games',
      },
      zh: {
        metaTitle: '每日纸牌 Solitaire - 固定牌局在线挑战',
        metaDescription:
          '在线玩可重复挑战的每日 Solitaire 纸牌局，支持抽 1 张或抽 3 张、撤销、提示、日期日历、本地进度和触控操作。',
        keywords: ['每日纸牌', '每日 Solitaire', '每日挑战纸牌', '在线纸牌游戏', '抽三张纸牌'],
        eyebrow: 'Luma 原创纸牌挑战',
        title: '每日纸牌 Solitaire',
        intro:
          '一次玩一局确定性牌局。选择抽 1 张或抽 3 张，把牌移动到 Tableau 和四个花色基础堆，随时重玩同一天来刷新自己的步数。',
        originalNote:
          '这是 Luma 基于公共领域纸牌规则独立实现的版本，布局、代码和视觉均为原创，不复制第三方游戏、美术或私有牌局服务。',
        sections: [
          {
            title: '每日牌局怎样生成',
            body:
              '你选择的日期会成为牌局种子，同一个日期在本浏览器中总是打开同一套牌序。Tableau 遵循熟悉的红黑交替降序移动，四个基础堆则按花色从 A 到 K 收牌。重置会保留日期，并恢复到本局初始状态。',
          },
          {
            title: '抽 1 张和抽 3 张',
            body:
              '抽 1 张会逐张翻开牌库，适合先读懂牌面。抽 3 张一次把三张牌移到废牌堆，只有最上方的牌可用，牌局限制更紧。开始新的重玩前可以切换模式，这样步数更容易比较。',
          },
          {
            title: '步数、撤销、提示和本地进度',
            body:
              '每次合法移动都会增加步数。撤销只保留在当前标签页中，可以撤回一次冒险的 Tableau 移动，不需要账号。提示会在存在明显下一步时指出可行移动。最高分、连续挑战和上次日期只保存在当前浏览器，不上传游戏历史。',
          },
          {
            title: '手机和键盘操作',
            body:
              '每张牌都是带标签的按钮，可以用键盘或触控操作。手机上先选择一张明牌，再点击目标基础堆或 Tableau 列；桌面端双击可移动的顶牌，会尝试放入对应基础堆。小屏拥挤时建议保持页面滚动，不要强行缩放。',
          },
        ],
        faqTitle: '每日纸牌常见问题',
        faqs: [
          {
            question: '每日 Solitaire 每天都是同一局吗？',
            answer:
              '选择的日期会生成确定性牌局，同一个日期可以反复重玩；换到其他日期会生成另一套可重复的牌序。',
          },
          {
            question: '抽 1 张和抽 3 张有什么区别？',
            answer:
              '抽 1 张一次把一张牌移到废牌堆；抽 3 张一次移动三张，能直接使用的废牌顺序更受限制。',
          },
          {
            question: '每日纸牌会把成绩保存到网上吗？',
            answer:
              '不会。最高分、连续挑战和上次日期只保存在当前浏览器，不需要账号，也不会创建个人资料。',
          },
          {
            question: '手机可以玩每日纸牌吗？',
            answer: '可以。操作使用可访问按钮，支持触控，不要求实体键盘。',
          },
        ],
        relatedTitle: '继续探索 Luma',
        related: [
          {
            href: '/games/solitaire',
            title: '经典 Solitaire',
            description: '打开现有经典纸牌页面，查看规则和玩法说明。',
          },
          {
            href: '/games',
            title: '浏览全部游戏',
            description: '寻找更多无需安装、适合短局游玩的浏览器游戏。',
          },
          {
            href: '/games/category/puzzle',
            title: '益智游戏',
            description: '从纸牌切换到其他专注的逻辑和节奏挑战。',
          },
        ],
        home: '首页',
        games: '游戏',
        backToGames: '返回游戏库',
      },
    },
  },
  'connect-the-dots': {
    slug: 'connect-the-dots',
    path: '/games/connect-the-dots',
    keyword: 'connect the dots game',
    pageType: 'game',
    qualityScore: 92,
    locales: {
      en: {
        metaTitle: 'Connect the Dots Game - Number Trail and Color Link',
        metaDescription:
          'Play an original connect the dots game with a 12-step Number Trail and a 20-grid Color Link mode, designed for keyboard and touch.',
        keywords: [
          'connect the dots game',
          'connect the dots game online',
          'number trail puzzle',
          'color link puzzle',
        ],
        eyebrow: 'Luma original dot puzzle',
        title: 'Connect the Dots Game',
        intro:
          'Two compact ways to connect a path: follow numbered points in order, or pair colored points without losing track of the grid. Every board is generated locally and can be replayed.',
        originalNote:
          'This is a clean-room Luma puzzle. It uses original SVG-like board geometry, symbols, and validators rather than copying a third-party game, artwork, or level file.',
        sections: [
          {
            title: 'Number Trail: follow 1 to 12',
            body:
              'Number Trail places twelve numbered points on a responsive board. Start with 1 and tap the next number until 12 is complete. The board order changes across twelve local boards, but the rule stays intentionally clear: a future number cannot be selected before the current target.',
          },
          {
            title: 'Color Link: pair the grid',
            body:
              'Color Link presents a small grid with ten colored pairs. Select one dot, then select its matching color. A correct pair disappears from the board; a mismatched pair leaves both dots in place so you can try again. The twenty local grids use symbols as well as color to keep the puzzle readable.',
          },
          {
            title: 'Keyboard and touch controls',
            body:
              'Each point is a real button with a visible focus ring and an accessible label. Tab through the board on desktop or tap the large targets on a phone. The game does not require drag gestures, and the status line explains the next valid number or whether a color pair matched.',
          },
          {
            title: 'A short puzzle loop',
            body:
              'Start a board, make a small sequence of choices, and use the next board button after completion. The current board number and best completion count stay local to the browser. There is no account, download, third-party asset, or hidden time pressure.',
          },
        ],
        faqTitle: 'Connect the Dots FAQ',
        faqs: [
          {
            question: 'How do I play Number Trail?',
            answer:
              'Select 1, then 2, continuing in order through 12. Selecting a future number early does not advance the board.',
          },
          {
            question: 'How does Color Link work?',
            answer:
              'Select one colored point and then select the matching color. Correct pairs clear from the grid; incorrect pairs remain available.',
          },
          {
            question: 'Can I play Connect the Dots on a phone?',
            answer:
              'Yes. The targets are touch-friendly buttons, and no drag-only gesture is required. Keyboard navigation is also supported.',
          },
          {
            question: 'Are these copied levels?',
            answer:
              'No. The boards, symbols, layout, and validation logic are generated as an original Luma clean-room puzzle.',
          },
        ],
        relatedTitle: 'More focused puzzles',
        related: [
          {
            href: '/games/category/puzzle',
            title: 'Puzzle games',
            description: 'Browse more logic, timing, and pattern challenges.',
          },
          {
            href: '/games',
            title: 'All browser games',
            description: 'Return to the full Luma catalogue for a different session length.',
          },
          {
            href: '/games/sorting-games',
            title: 'Sorting Games',
            description: 'Try a separate collection of color, shape, size, and pattern tasks.',
          },
        ],
        home: 'Home',
        games: 'Games',
        backToGames: 'Back to games',
      },
      zh: {
        metaTitle: '连连点点游戏 - 数字路径与颜色配对',
        metaDescription:
          '在线玩 Luma 原创连连点点游戏：12 步数字路径和 20 个颜色配对网格，支持键盘和触控，不要求拖拽。',
        keywords: ['连连点点游戏', '连点游戏在线玩', '数字路径益智', '颜色配对益智'],
        eyebrow: 'Luma 原创连点益智',
        title: '连连点点游戏',
        intro:
          '用两种轻量方式连接路径：按顺序点击数字，或在网格中配对颜色。每个棋盘都在本地生成，可以反复挑战。',
        originalNote:
          '这是 Luma 独立制作的 clean-room 益智游戏，棋盘几何、符号和校验逻辑均为原创，不复制第三方游戏、美术或关卡文件。',
        sections: [
          {
            title: '数字路径：从 1 点到 12',
            body:
              '数字路径会在响应式棋盘上放置 12 个编号点。从 1 开始依次点击到 12；如果提前点击未来数字，棋盘不会推进。总共有 12 个本地棋盘，顺序会变化，但规则保持清楚。',
          },
          {
            title: '颜色连线：完成网格配对',
            body:
              '颜色连线会展示包含 10 对颜色的小网格。先选择一个点，再选择相同颜色的点；配对正确后会从棋盘消失，配错则保留两个点供你重新尝试。每个点同时有符号，避免只能依赖颜色判断。',
          },
          {
            title: '键盘和触控操作',
            body:
              '每个点都是带可见焦点样式的真实按钮。桌面端可以按 Tab 浏览，手机端直接点击较大的目标。游戏不要求拖拽，状态提示会告诉你下一个正确数字，或说明颜色是否配对成功。',
          },
          {
            title: '短而清楚的益智循环',
            body:
              '开始一个棋盘，完成一小段选择，完成后进入下一个棋盘。当前棋盘序号和最佳完成数只保存在浏览器本地。没有账号、下载、第三方素材或隐藏倒计时。',
          },
        ],
        faqTitle: '连连点点常见问题',
        faqs: [
          {
            question: '数字路径怎么玩？',
            answer: '先点击 1，再按顺序点击 2 到 12；提前点击未来数字不会推进棋盘。',
          },
          {
            question: '颜色连线怎样配对？',
            answer: '先选择一个颜色点，再选择对应颜色。正确配对会清除，错误配对会留在网格中。',
          },
          {
            question: '手机可以玩连连点点吗？',
            answer: '可以。目标点是适合触控的按钮，不要求只能拖拽；桌面端也支持键盘浏览。',
          },
          {
            question: '这些关卡是复制的吗？',
            answer: '不是。棋盘、符号、布局和校验逻辑都是 Luma 独立制作的 clean-room 内容。',
          },
        ],
        relatedTitle: '继续玩专注益智',
        related: [
          {
            href: '/games/category/puzzle',
            title: '益智游戏',
            description: '浏览更多逻辑、节奏和图案挑战。',
          },
          {
            href: '/games',
            title: '全部浏览器游戏',
            description: '返回 Luma 游戏目录，选择不同长度的下一局。',
          },
          {
            href: '/games/sorting-games',
            title: 'Sorting Games 排序游戏',
            description: '尝试另一组颜色、形状、大小和图案任务。',
          },
        ],
        home: '首页',
        games: '游戏',
        backToGames: '返回游戏库',
      },
    },
  },
  'sorting-games': {
    slug: 'sorting-games',
    path: '/games/sorting-games',
    keyword: 'sorting games',
    pageType: 'game_collection',
    qualityScore: 91,
    locales: {
      en: {
        metaTitle: 'Sorting Games - Four Original Modes, Twelve Levels',
        metaDescription:
          'Play an original sorting games collection with color, shape, size, and pattern modes. Twelve short levels work with keyboard and touch.',
        keywords: [
          'sorting games',
          'sorting games online',
          'color sorting game',
          'shape sorting game',
          'pattern sorting puzzle',
        ],
        eyebrow: 'Luma original sorting collection',
        title: 'Sorting Games',
        intro:
          'Pick a rule, scan the options, and sort one small decision at a time. Four modes and three levels each make a compact collection for a quick browser session.',
        originalNote:
          'This collection is an original Luma clean-room project. The prompts, tokens, validators, and interface are authored for this page and do not reuse third-party art or level data.',
        sections: [
          {
            title: 'Four ways to sort',
            body:
              'Color Sort asks you to identify a color family. Shape Sort uses simple geometric labels. Size Sort tests small, medium, and large ordering. Pattern Sort asks you to separate stripes, dots, and solid fills. The rule is written above every challenge so the task stays a reasoning exercise rather than a guessing game.',
          },
          {
            title: 'Twelve short levels',
            body:
              'Each mode contains three levels, for twelve total challenges. A correct answer moves to the next level and records a completion. A wrong answer leaves the current level in place and explains the expected category, so you can learn the rule without a life counter or pressure timer.',
          },
          {
            title: 'Designed for touch and keyboard',
            body:
              'Options are full-width buttons on small screens and remain keyboard reachable on desktop. No drag-and-drop interaction is required. The active mode and level are visible in the status area, and the reset action returns to level one without changing other modes.',
          },
          {
            title: 'A collection, not a copied catalogue',
            body:
              'The page groups several original mechanics because the search phrase covers more than one kind of sorting play. Each mode has its own prompt, option set, and validation path, while the shared shell keeps the controls familiar.',
          },
        ],
        faqTitle: 'Sorting Games FAQ',
        faqs: [
          {
            question: 'How many sorting games are on the page?',
            answer:
              'There are four original modes with three levels each: twelve short levels in total.',
          },
          {
            question: 'What are the four sorting modes?',
            answer:
              'The collection includes Color Sort, Shape Sort, Size Sort, and Pattern Sort.',
          },
          {
            question: 'Do the sorting games require drag and drop?',
            answer:
              'No. Every choice is a real button, so the collection works with touch and keyboard input without relying on a drag-only gesture.',
          },
          {
            question: 'Are the levels copied from another site?',
            answer:
              'No. The prompts, tokens, and validators are original Luma clean-room work.',
          },
        ],
        relatedTitle: 'Try another puzzle shelf',
        related: [
          {
            href: '/games/category/puzzle',
            title: 'Puzzle games',
            description: 'Browse focused logic and pattern games in the Luma catalogue.',
          },
          {
            href: '/games/category/casual',
            title: 'Casual games',
            description: 'Switch to lighter short-session games with simple controls.',
          },
          {
            href: '/games/connect-the-dots',
            title: 'Connect the Dots',
            description: 'Follow a number trail or pair colors in a separate original puzzle.',
          },
        ],
        home: 'Home',
        games: 'Games',
        backToGames: 'Back to games',
      },
      zh: {
        metaTitle: 'Sorting Games 排序游戏 - 四种模式十二关原创合集',
        metaDescription:
          '在线玩 Luma 原创 Sorting Games 排序游戏合集，包含颜色、形状、大小和图案四种模式，共 12 个短关卡，支持键盘和触控。',
        keywords: ['排序游戏', 'Sorting Games', '颜色排序', '形状排序', '图案排序益智'],
        eyebrow: 'Luma 原创排序合集',
        title: 'Sorting Games 排序游戏',
        intro:
          '先选择分类规则，再观察选项，一次完成一个小决定。四种模式、每种三关，适合在浏览器里进行短时挑战。',
        originalNote:
          '这是 Luma 独立制作的 clean-room 合集。题目、图形、校验逻辑和界面均为本页原创，不复用第三方美术或关卡数据。',
        sections: [
          {
            title: '四种排序方式',
            body:
              '颜色排序要求识别色彩家族；形状排序使用简单几何标签；大小排序区分小、中、大；图案排序则区分条纹、点状和纯色。每道题上方都会写出规则，让任务成为观察和判断，而不是盲猜。',
          },
          {
            title: '十二个短关卡',
            body:
              '每种模式包含三关，合计十二个小挑战。答对后进入下一关并记录完成数；答错会留在当前关卡，并解释期待的分类，不设置生命值或强制倒计时。',
          },
          {
            title: '为触控和键盘设计',
            body:
              '选项在小屏上使用大按钮，桌面端也可以用键盘依次访问。不要求拖放操作。当前模式和关卡会显示在状态区，重置只回到当前模式第一关，不影响其他模式。',
          },
          {
            title: '这是原创合集，不是复制目录',
            body:
              '“Sorting Games”可能包含多种排序玩法，因此本页将不同机制放在同一合集里。每种模式都有独立题目、选项和校验路径，同时共用清楚的操作外壳。',
          },
        ],
        faqTitle: '排序游戏常见问题',
        faqs: [
          {
            question: '页面上有多少个排序关卡？',
            answer: '共有四种原创模式，每种三关，合计 12 个短关卡。',
          },
          {
            question: '四种排序模式是什么？',
            answer: '包括颜色排序、形状排序、大小排序和图案排序。',
          },
          {
            question: '排序游戏需要拖放吗？',
            answer: '不需要。每个选项都是按钮，支持触控和键盘，不依赖只能拖拽的手势。',
          },
          {
            question: '这些关卡是从其他网站复制的吗？',
            answer: '不是。题目、图形和校验器都是 Luma 独立制作的 clean-room 内容。',
          },
        ],
        relatedTitle: '继续浏览益智货架',
        related: [
          {
            href: '/games/category/puzzle',
            title: '益智游戏',
            description: '浏览 Luma 目录中的逻辑和图案游戏。',
          },
          {
            href: '/games/category/casual',
            title: '休闲游戏',
            description: '切换到操作简单、适合短局的轻量游戏。',
          },
          {
            href: '/games/connect-the-dots',
            title: '连连点点',
            description: '在另一款原创益智游戏中跟随数字或配对颜色。',
          },
        ],
        home: '首页',
        games: '游戏',
        backToGames: '返回游戏库',
      },
    },
  },
  'mahjong-connect': {
    slug: 'mahjong-connect',
    path: '/games/mahjong-connect',
    keyword: 'mahjong connect',
    pageType: 'game',
    qualityScore: 93,
    locales: {
      en: {
        metaTitle: 'Mahjong Connect - Original Link-Matching Puzzle Online',
        metaDescription:
          'Play an original Mahjong Connect-style link puzzle with 12 seeded levels, a two-turn path rule, hints, shuffle, timer, and mobile controls.',
        keywords: [
          'mahjong connect',
          'mahjong connect game',
          'mahjong matching game',
          'link pair puzzle online',
        ],
        eyebrow: 'Luma original link puzzle',
        title: 'Mahjong Connect',
        intro:
          'Match identical vector tiles when a path between them uses no more than two turns. Clear twelve small boards, use a hint when the grid is tight, and keep your progress in this browser.',
        originalNote:
          'This is a clean-room original Luma link-pair puzzle using newly drawn vector-like tile faces and local board generation. It does not use third-party tiles, screenshots, or embedded game code.',
        sections: [
          {
            title: 'The two-turn path rule',
            body:
              'A pair can clear when both tiles show the same symbol and an empty route connects them with at most two changes of direction. The route can travel around the outside edge of the board. A crowded-looking pair may still be legal if the path bends around an open border.',
          },
          {
            title: 'Twelve seeded levels',
            body:
              'The level number seeds the tile arrangement, so restarting a level brings back the same puzzle. Each board uses matching pairs and is checked by the local move validator. Completing a board advances the level counter and records the highest level reached in local storage.',
          },
          {
            title: 'Hint, shuffle, timer, and score',
            body:
              'Hint reveals one currently legal pair and costs a small amount of score. Shuffle rearranges the remaining symbols when you need a new visual read without adding tiles. The timer and score are session values; the reached-level marker is the only progress saved locally.',
          },
          {
            title: 'Touch, keyboard, and readable tiles',
            body:
              'Every tile is a labeled button with a large touch target. Use Tab and Enter on desktop, or tap once to select and again to match on a phone. Tile faces use both symbol and color so the board does not depend on color alone.',
          },
        ],
        faqTitle: 'Mahjong Connect FAQ',
        faqs: [
          {
            question: 'What does the two-turn rule mean?',
            answer:
              'Two identical tiles can be removed when an empty path connects them with no more than two changes of direction, including a route around the outside border.',
          },
          {
            question: 'How many levels are included?',
            answer: 'The collection includes twelve deterministic local levels. Restarting a level restores its seeded arrangement.',
          },
          {
            question: 'Can I use a hint or shuffle?',
            answer:
              'Yes. Hint points to a legal pair and reduces the session score. Shuffle rearranges remaining tiles without adding new ones.',
          },
          {
            question: 'Does Mahjong Connect work on mobile?',
            answer:
              'Yes. Tiles are touch-friendly labeled buttons, and keyboard focus plus Enter also work on desktop.',
          },
        ],
        relatedTitle: 'More matching and puzzle games',
        related: [
          {
            href: '/games/category/puzzle',
            title: 'Puzzle games',
            description: 'Browse the wider collection of logic and matching challenges.',
          },
          {
            href: '/games',
            title: 'All games',
            description: 'Return to the Luma catalogue for more short browser sessions.',
          },
          {
            href: '/games/daily-solitaire',
            title: 'Daily Solitaire',
            description: 'Try a deterministic card challenge with undo, hints, and draw modes.',
          },
        ],
        home: 'Home',
        games: 'Games',
        backToGames: 'Back to games',
      },
      zh: {
        metaTitle: 'Mahjong Connect 连连麻将 - 两转路径配对益智',
        metaDescription:
          '在线玩 Luma 原创 Mahjong Connect 连连麻将：12 个固定种子关卡、最多两次转弯的路径规则、提示、洗牌、计时和手机操作。',
        keywords: ['Mahjong Connect', '连连麻将', '麻将配对游戏', '两转路径益智'],
        eyebrow: 'Luma 原创路径配对',
        title: 'Mahjong Connect 连连麻将',
        intro:
          '当相同图案之间的路径最多转两次时即可消除。完成 12 个小棋盘，网格拥挤时使用提示，并把进度保存在当前浏览器。',
        originalNote:
          '这是 Luma 原创的路径配对益智游戏，牌面使用新绘制的矢量风格图案和本地棋盘生成，不使用第三方牌面、截图或嵌入代码。',
        sections: [
          {
            title: '最多两次转弯的路径规则',
            body:
              '两个相同图案的牌面之间，如果存在一条空路径，且路径改变方向不超过两次，就可以消除。路径也可以沿棋盘外侧绕行；看起来被挡住的牌，有时可以通过开放边界连接。',
          },
          {
            title: '十二个固定种子关卡',
            body:
              '关卡编号会决定牌面排列，因此重启同一关会恢复同一套谜题。每个棋盘由成对图案组成，并由本地移动校验器判断。完成后进入下一关，最高到达关卡保存在浏览器本地。',
          },
          {
            title: '提示、洗牌、计时和分数',
            body:
              '提示会指出一组当前可消除的牌，并扣除少量分数。洗牌只重新排列剩余牌，不增加新牌，适合换一个观察角度。计时和分数属于当前会话，只有到达关卡会保存。',
          },
          {
            title: '触控、键盘和可读牌面',
            body:
              '每张牌都是带标签的大按钮。桌面端可以用 Tab 和 Enter，手机端先点选一张，再点选匹配牌。牌面同时使用图案和颜色，不依赖颜色本身来判断。',
          },
        ],
        faqTitle: 'Mahjong Connect 常见问题',
        faqs: [
          {
            question: '最多两次转弯是什么意思？',
            answer:
              '两张相同牌之间存在空路径，且路径改变方向不超过两次时可以消除；路径可以绕过棋盘外侧边界。',
          },
          {
            question: '一共有多少关？',
            answer: '合集包含 12 个确定性本地关卡，重启关卡会恢复它的固定排列。',
          },
          {
            question: '可以使用提示或洗牌吗？',
            answer: '可以。提示指出合法配对并扣分；洗牌会重新排列剩余牌，但不会增加新牌。',
          },
          {
            question: '手机可以玩 Mahjong Connect 吗？',
            answer: '可以。牌面是适合触控的带标签按钮，桌面端也支持键盘焦点和 Enter。',
          },
        ],
        relatedTitle: '更多配对和益智游戏',
        related: [
          {
            href: '/games/category/puzzle',
            title: '益智游戏',
            description: '浏览更多逻辑和配对挑战。',
          },
          {
            href: '/games',
            title: '全部游戏',
            description: '返回 Luma 目录，寻找更多短局浏览器游戏。',
          },
          {
            href: '/games/daily-solitaire',
            title: '每日 Solitaire',
            description: '尝试支持撤销、提示和抽牌模式的固定纸牌挑战。',
          },
        ],
        home: '首页',
        games: '游戏',
        backToGames: '返回游戏库',
      },
    },
  },
  'asmr-games': {
    slug: 'asmr-games',
    path: '/games/asmr-games',
    keyword: 'asmr games',
    pageType: 'game',
    qualityScore: 90,
    locales: {
      en: {
        metaTitle: 'ASMR Games - Four Original Low-Stimulation Browser Scenes',
        metaDescription:
          'Explore four original ASMR-inspired browser scenes with optional sound, mute persistence, low particles, reduced-motion support, and no downloads.',
        keywords: [
          'asmr games',
          'asmr games online',
          'asmr simulation',
          'calm browser game',
          'sensory interaction game',
        ],
        eyebrow: 'Luma original sensory scenes',
        title: 'ASMR Games',
        intro:
          'Choose a small interactive scene: tap soft rain, place pebbles, draw a quiet line garden, or sort gentle color tiles. Sound is always opt-in and the visual field stays intentionally light.',
        originalNote:
          'This is a clean-room original Luma sensory interaction collection. It uses local CSS shapes and optional browser audio created after a user gesture; it does not reuse third-party videos, sounds, artwork, or medical claims.',
        sections: [
          {
            title: 'Four original experiences',
            body:
              'Soft Rain lets you place a few expanding drops. Pebble Stack builds a small pile with each tap. Line Garden adds short strokes to a quiet canvas. Color Sort lets you move through a simple set of soft tiles. Each scene has a clear reset and a small interaction budget rather than an endless particle stream.',
          },
          {
            title: 'Sound only after a gesture',
            body:
              'The page starts muted. Tap Enable sound to allow a very small local tone on later interactions; no audio context is created before that choice. The mute state is stored in this browser so a later visit respects the last selection. You can mute again at any time.',
          },
          {
            title: 'Reduced motion and low visual load',
            body:
              'Animations are short and decorative, with no flashing, jump-scare, or medical promise. The reduced-motion preference removes transitions and floating movement. The scene limits the number of marks on screen and keeps the main interaction reachable on narrow phones.',
          },
          {
            title: 'A gentle browser interaction, not a treatment',
            body:
              'These scenes are entertainment and sensory play only. They are not medical, sleep, anxiety, focus, or therapeutic tools. Take a break if sound or motion feels uncomfortable, and use the mute and reset controls whenever you prefer a quieter screen.',
          },
        ],
        faqTitle: 'ASMR Games FAQ',
        faqs: [
          {
            question: 'Does the page play sound automatically?',
            answer:
              'No. The page starts muted and creates optional local audio only after you press Enable sound. You can mute it again at any time.',
          },
          {
            question: 'What are the four scenes?',
            answer:
              'The collection includes Soft Rain, Pebble Stack, Line Garden, and Color Sort.',
          },
          {
            question: 'Does ASMR Games make medical or sleep claims?',
            answer:
              'No. These are small entertainment interactions, not medical, sleep, focus, anxiety, or therapeutic tools.',
          },
          {
            question: 'Can I use the collection with reduced motion?',
            answer:
              'Yes. The interface respects the browser reduced-motion preference and removes decorative movement while keeping the controls available.',
          },
        ],
        relatedTitle: 'Keep the session simple',
        related: [
          {
            href: '/games/category/casual',
            title: 'Casual games',
            description: 'Find other short browser interactions with straightforward rules.',
          },
          {
            href: '/games',
            title: 'Browse all games',
            description: 'Return to the Luma catalogue without leaving the browser.',
          },
          {
            href: '/games/sorting-games',
            title: 'Sorting Games',
            description: 'Try a more rule-based color and pattern collection next.',
          },
        ],
        home: 'Home',
        games: 'Games',
        backToGames: 'Back to games',
      },
      zh: {
        metaTitle: 'ASMR Games 感官小游戏 - 四种原创低刺激浏览器场景',
        metaDescription:
          '体验四种 Luma 原创 ASMR 风格浏览器场景：可选声音、记住静音设置、低粒子、支持减少动态效果，无需下载。',
        keywords: ['ASMR Games', 'ASMR 小游戏', '感官互动游戏', '低刺激浏览器游戏', '舒缓互动场景'],
        eyebrow: 'Luma 原创感官场景',
        title: 'ASMR Games 感官小游戏',
        intro:
          '选择一个轻量互动场景：点击软雨滴、堆放小石子、画安静的线条花园，或整理柔和色块。声音始终需要主动开启，画面也会控制在低负担范围。',
        originalNote:
          '这是 Luma 原创的感官互动合集，使用本地 CSS 图形和用户手势之后才创建的可选浏览器声音，不复用第三方视频、声音、美术，也不做医疗功效承诺。',
        sections: [
          {
            title: '四种原创体验',
            body:
              '软雨滴可以点击放置少量扩散的雨滴；石子堆叠会在每次点击后增加一块小石子；线条花园会在安静画布上增加短线；柔和排序则让你浏览并整理色块。每个场景都有明确的重置和数量上限，不制造无尽粒子流。',
          },
          {
            title: '只有手动操作后才会有声音',
            body:
              '页面默认静音。点击“开启声音”后，后续互动才可能播放很轻的本地音调；在你做出选择前不会创建音频上下文。静音状态会保存在当前浏览器，下次访问会尊重上次选择，也可以随时重新静音。',
          },
          {
            title: '减少动态效果与低视觉负担',
            body:
              '动画短暂且只用于装饰，不包含闪烁、惊吓或医疗承诺。浏览器开启“减少动态效果”后，会移除过渡和漂浮移动，但保留所有控制。画面上的标记数量有限，窄屏手机也能操作。',
          },
          {
            title: '是轻量娱乐，不是治疗工具',
            body:
              '这些场景只用于娱乐和感官互动，不是医疗、睡眠、焦虑、专注或治疗工具。如果声音或动态让你不舒服，请暂停使用，并随时使用静音和重置按钮让页面回到更安静的状态。',
          },
        ],
        faqTitle: 'ASMR Games 常见问题',
        faqs: [
          {
            question: '页面会自动播放声音吗？',
            answer: '不会。页面默认静音，只有点击“开启声音”后才会创建可选的本地声音，之后也可以再次静音。',
          },
          {
            question: '四种场景是什么？',
            answer: '包括软雨滴、石子堆叠、线条花园和柔和排序。',
          },
          {
            question: 'ASMR Games 会做医疗或助眠宣传吗？',
            answer: '不会。这些是轻量娱乐互动，不是医疗、睡眠、专注、焦虑或治疗工具。',
          },
          {
            question: '可以使用减少动态效果吗？',
            answer: '可以。页面会读取浏览器的减少动态效果偏好，移除装饰性移动，同时保留互动按钮。',
          },
        ],
        relatedTitle: '继续保持轻量',
        related: [
          {
            href: '/games/category/casual',
            title: '休闲游戏',
            description: '寻找规则简单、适合短时间游玩的浏览器互动。',
          },
          {
            href: '/games',
            title: '浏览全部游戏',
            description: '返回 Luma 目录，继续在浏览器中选择下一局。',
          },
          {
            href: '/games/sorting-games',
            title: 'Sorting Games 排序游戏',
            description: '接着尝试更偏规则和图案判断的色彩合集。',
          },
        ],
        home: '首页',
        games: '游戏',
        backToGames: '返回游戏库',
      },
    },
  },
  ...(NEW_EXPERIMENT_PAGE_DEFINITIONS as unknown as Record<
    NewExperimentSlug,
    OriginalExperimentPageDefinition
  >),
};

const contextualInboundLinks: Partial<
  Record<OriginalExperimentSlug, Record<Locale, OriginalExperimentRelatedLink[]>>
> = {
  'daily-solitaire': {
    en: [
      { href: '/games/chinese-checkers', title: 'Chinese Checkers', description: 'Move from cards to a local board strategy challenge.' },
      { href: '/games/two-player-games', title: 'Two Player Games', description: 'Share one screen for three short original games.' },
    ],
    zh: [
      { href: '/games/chinese-checkers', title: '中国跳棋', description: '从纸牌切换到本地棋盘策略挑战。' },
      { href: '/games/two-player-games', title: '双人游戏', description: '两人共享屏幕玩三款原创短局。' },
    ],
  },
  'connect-the-dots': {
    en: [
      { href: '/games/draw-a-perfect-circle', title: 'Draw a Perfect Circle', description: 'Test a continuous mouse, pen or touch stroke.' },
      { href: '/games/two-player-games', title: 'Two Player Games', description: 'Turn precision into a same-device duel.' },
    ],
    zh: [
      { href: '/games/draw-a-perfect-circle', title: '画一个完美圆形', description: '测试鼠标、手写笔或触控的一笔轨迹。' },
      { href: '/games/two-player-games', title: '双人游戏', description: '把准确度练习切换为同设备对战。' },
    ],
  },
  'sorting-games': {
    en: [
      { href: '/games/draw-a-perfect-circle', title: 'Draw a Perfect Circle', description: 'Swap sorting for a transparent geometry score.' },
      { href: '/games/stacker-game', title: 'Stacker Game', description: 'Test timing with an original one-button tower.' },
    ],
    zh: [
      { href: '/games/draw-a-perfect-circle', title: '画一个完美圆形', description: '从排序切换到透明几何评分。' },
      { href: '/games/stacker-game', title: 'Stacker Game', description: '用原创一键堆塔测试节奏。' },
    ],
  },
  'mahjong-connect': {
    en: [
      { href: '/games/chinese-checkers', title: 'Chinese Checkers', description: 'Try a traditional no-capture jump strategy.' },
    ],
    zh: [
      { href: '/games/chinese-checkers', title: '中国跳棋', description: '尝试传统的无吃子跳跃策略。' },
    ],
  },
  'asmr-games': {
    en: [
      { href: '/games/stacker-game', title: 'Stacker Game', description: 'Move from calm interaction to measured timing.' },
    ],
    zh: [
      { href: '/games/stacker-game', title: 'Stacker Game', description: '从舒缓互动切换到节奏挑战。' },
    ],
  },
};

export function getOriginalExperimentPage(
  slug: OriginalExperimentSlug,
  locale: Locale,
): OriginalExperimentPageDefinition & { copy: OriginalExperimentLocaleCopy } {
  const page = pageDefinitions[slug];
  const copy = page.locales[locale];
  return {
    ...page,
    copy: {
      ...copy,
      related: [...copy.related, ...(contextualInboundLinks[slug]?.[locale] ?? [])],
    },
  };
}

export function getOriginalExperimentPageByPath(path: string) {
  return Object.values(pageDefinitions).find((page) => page.path === path);
}

export function buildOriginalExperimentMetadata(
  page: OriginalExperimentPageDefinition,
  locale: Locale,
): Metadata {
  const content = page.locales[locale];
  const canonical = getLocalizedPath(locale, page.path);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    alternates: {
      canonical: buildAbsoluteUrl(canonical),
      languages: {
        'zh-CN': buildAbsoluteUrl(getLocalizedPath('zh', page.path)),
        'en-US': buildAbsoluteUrl(getLocalizedPath('en', page.path)),
        'x-default': buildAbsoluteUrl(getLocalizedPath('en', page.path)),
      },
    },
    openGraph: {
      type: 'website',
      url: buildAbsoluteUrl(canonical),
      title: content.metaTitle,
      description: content.metaDescription,
      siteName: 'Luma Game Hub',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      images: DEFAULT_OPEN_GRAPH_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}
