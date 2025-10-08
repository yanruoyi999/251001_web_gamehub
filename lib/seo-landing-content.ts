import { statSync } from 'node:fs';
import path from 'node:path';
import type { Locale } from '@/i18n/config';

export interface SeoLandingSection {
  title: string;
  body: string;
  bullets?: string[];
}

export interface SeoLandingRecommendation {
  slug: string;
  pitch: string;
}

export interface SeoLandingFaq {
  question: string;
  answer: string;
}

export interface SeoLandingLocaleContent {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  overview: string[];
  sections: SeoLandingSection[];
  recommendations: SeoLandingRecommendation[];
  faqs: SeoLandingFaq[];
  ctaLabel: string;
  ctaDescription: string;
}

export interface SeoLandingPage {
  slug: string;
  primaryKeyword: string;
  keywords: string[];
  updatedAt: string;
  relatedSlugs: string[];
  locales: Record<Locale, SeoLandingLocaleContent>;
}

const seoContentUpdatedAt = (() => {
  try {
    const stats = statSync(path.join(process.cwd(), 'lib', 'seo-landing-content.ts'));
    return stats.mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
})();

const SEO_LANDING_PAGES: SeoLandingPage[] = [
  {
    slug: 'free-games-no-ads',
    primaryKeyword: 'free games no ads',
    keywords: [
      'free games no ads',
      'ad-free browser games',
      'free games without popups',
      'no ads puzzle games',
    ],
    updatedAt: seoContentUpdatedAt,
    relatedSlugs: ['ad-free-games', 'games-to-play-when-bored'],
    locales: {
      en: {
        metaTitle: 'Free Games With No Ads | Distraction-Free Browser Games',
        metaDescription:
          'Play free games with no ads on GameHub. Every title launches instantly, keeps your screen clean, and includes puzzle and arcade hits you can enjoy anywhere.',
        heading: 'Free Games With No Ads',
        subheading: 'Instant-play browser hits curated to stay clean, fast, and distraction-free.',
        overview: [
          'Each game on this list was tested on desktop and mobile to ensure it launches without pre-roll videos, pop-up banners, or sneaky interstitials. If you crave a quiet gaming break, these titles keep the focus on gameplay.',
          'Bookmark this hub to explore new ad-free additions as soon as they are reviewed by the GameHub editorial team.',
        ],
        sections: [
          {
            title: 'What Makes a Game Truly Ad-Free',
            body: 'We check for hidden audio spots, redirects, and monetisation scripts that could trigger mid-session interruptions. Only games that remain ad-free after multiple play sessions make it onto this page.',
            bullets: [
              'Zero pop-ups, auto-playing audio, or pre-roll video interruptions.',
              'Lightweight assets that load quickly even on low bandwidth connections.',
              'Responsive layouts that keep controls accessible on touchscreens.',
            ],
          },
          {
            title: 'How to Keep GameHub Clean',
            body: 'We monitor creator updates so new monetisation does not slip through. If a developer adds intrusive ad tech, we rotate the game out and highlight an alternative from the community backlog.',
          },
          {
            title: 'Playlists for Different Moods',
            body: 'Whether you want a quick brain teaser, a zen arcade loop, or a strategic challenge, there is an ad-free option ready to launch immediately.',
            bullets: [
              'Fast-focus puzzles that sharpen your brain between meetings.',
              'Classic retro loops ideal for short mobile sessions.',
              'Featured strategy picks when you want a deeper run without distractions.',
            ],
          },
        ],
        recommendations: [
          {
            slug: '2048',
            pitch:
              'Slide matching tiles to hit 2048. This calm-but-addictive puzzle never interrupts your flow with full-screen ads.',
          },
          {
            slug: 'hextris',
            pitch:
              'A modern twist on Tetris with neon style and precise controls. No overlays, just pure arcade momentum.',
          },
          {
            slug: 'super-sudoku',
            pitch:
              'Thousands of handcrafted Sudoku boards with helpful notes, undo, and zero commercial clutter.',
          },
          {
            slug: 'snake',
            pitch:
              'The iconic retro snake experience optimised for touch. Perfect for quick breaks when you need something simple and ad-free.',
          },
        ],
        faqs: [
          {
            question: 'Are these games completely free to play?',
            answer:
              'Yes. All listed titles are free-to-play browser games. You do not need to create an account or watch reward videos to unlock levels.',
          },
          {
            question: 'Do I need to install an ad blocker?',
            answer:
              'No. Every recommendation was tested without an ad blocker enabled. The game itself contains no embedded ad scripts.',
          },
          {
            question: 'Can I play these ad-free games on my phone?',
            answer:
              'Absolutely. Each game is responsive and touch-friendly, so you can launch it on iPhone, Android, or tablet with the same clean experience.',
          },
        ],
        ctaLabel: 'Browse all ad-free games',
        ctaDescription: 'Jump into the full catalogue and filter by genre, difficulty, or popularity.',
      },
      zh: {
        metaTitle: '免费无广告游戏 | 极速纯净的在线小游戏',
        metaDescription:
          '在 GameHub 畅玩免费无广告游戏。所有作品均已实测，无需等待或忍受弹窗，随时在电脑与手机上享受益智、街机等不同体验。',
        heading: '免费无广告游戏推荐',
        subheading: '精挑细选，保证加载迅速、界面纯净、专注玩法体验。',
        overview: [
          '本页收录的每一款游戏都经过多轮人工测试，确认没有前贴片视频、弹窗广告或暗藏的跳转脚本，真正实现“free games no ads”的纯净体验。',
          '我们会持续跟进开发者的更新，一旦发现植入广告，会立即替换为新的无广告作品，方便玩家收藏长期使用。',
        ],
        sections: [
          {
            title: '如何判断游戏真的无广告',
            body: '审核团队会在桌面与移动端反复游玩，确认没有隐藏音频、激励视频或突兀的商业弹窗，确保游戏过程始终干净。',
            bullets: [
              '无弹窗、无自动播放音频、无强制前贴片视频。',
              '资源轻量化，弱网环境也能快速进入游戏。',
              '自适应布局，手机触屏操作同样顺手。',
            ],
          },
          {
            title: '保持页面内容长期纯净',
            body: '我们持续监控作者更新，若后续加入广告会及时下架，并用社区候选列表中的新作品补位，保持 GameHub 的“ad free games”形象。',
          },
          {
            title: '不同心情的精选清单',
            body: '想要快速放松、动脑，或是进行策略挑战？这里都有对应的无广告选择，即开即玩无干扰。',
            bullets: [
              '会议间隙的轻量益智游戏，迅速进入状态。',
              '复古街机节奏，适合移动端短时游玩。',
              '策略深度作品，让你专注通关而不被广告打断。',
            ],
          },
        ],
        recommendations: [
          {
            slug: '2048',
            pitch: '滑动数字方块叠加到 2048，全程没有广告打扰，适合碎片时间动脑。',
          },
          {
            slug: 'hextris',
            pitch: '霓虹风六边形俄罗斯方块，操作流畅，无叠加遮挡，节奏紧凑又纯净。',
          },
          {
            slug: 'super-sudoku',
            pitch: '数千道手工数独题库，自带标注与撤销功能，界面干净专注。',
          },
          {
            slug: 'snake',
            pitch: '经典贪吃蛇优化触控体验，轻松上手游玩，不担心弹窗跳出。',
          },
        ],
        faqs: [
          {
            question: '这些游戏真的全部免费吗？',
            answer: '是的，全部为浏览器里的免费小游戏，无需注册账号，也没有观看广告解锁关卡的限制。',
          },
          {
            question: '需要开启广告拦截器才能保持纯净吗？',
            answer: '不需要。我们在无拦截器的环境下测试，确保游戏本体不加载任何广告脚本。',
          },
          {
            question: '手机上也能体验无广告版本吗？',
            answer: '完全可以。列表中的游戏都适配 iPhone、Android 与平板触屏，保持同样流畅的“free games no ads”体验。',
          },
        ],
        ctaLabel: '查看更多无广告游戏',
        ctaDescription: '进入完整库，按分类、难度或热度继续探索。',
      },
    },
  },
  {
    slug: 'ad-free-games',
    primaryKeyword: 'ad free games',
    keywords: [
      'ad free games',
      'ad-free casual games',
      'clean browser games',
      'ad-free strategy games',
    ],
    updatedAt: seoContentUpdatedAt,
    relatedSlugs: ['free-games-no-ads', 'best-free-iphone-games'],
    locales: {
      en: {
        metaTitle: 'Ad-Free Games | Curated Collections for Every Device',
        metaDescription:
          'Explore ad-free games by genre and device on GameHub. From puzzles to strategy hits, every pick loads instantly without pop-up interruptions.',
        heading: 'Ad-Free Games',
        subheading: 'Browse curated categories of clean gaming experiences on any screen.',
        overview: [
          'GameHub tags each title with device support, play length, and input style so you can find the ad-free experience that fits your routine.',
          'Use this guide as your starting point to discover new favourites and jump straight into gameplay without banners, timers, or idling offers.',
        ],
        sections: [
          {
            title: 'Choose the Right Genre for Your Mood',
            body: 'Switch between calming puzzles, energetic arcade loops, or tactical defence games. Every category stays ad-free and consistent across devices.',
          },
          {
            title: 'Optimised for Touch and Keyboard',
            body: 'Annotation labels show which games thrive on tap controls and which shine with a keyboard. Swap devices without losing the ad-free advantage.',
            bullets: [
              'Touch-first games for commuters and quick breaks.',
              'Mouse-friendly precision titles for desktop sessions.',
              'Controller-compatible picks for living room play.',
            ],
          },
          {
            title: 'How We Keep Recommendations Fresh',
            body: 'We review community suggestions weekly. If a game introduces aggressive monetisation, it is replaced with a new ad-free alternative.',
          },
        ],
        recommendations: [
          {
            slug: 'hextris',
            pitch: 'Fast-paced rotation puzzle that keeps focus through spotless visuals and no monetisation hooks.',
          },
          {
            slug: 'minesweeper',
            pitch: 'Classic grid logic refreshed with clean UI and timed challenges—ideal for concentration without ad clutter.',
          },
          {
            slug: 'html5-tower-defense',
            pitch: 'Layer your defences across waves of enemies with zero pop-ups, even during hectic boss rounds.',
          },
          {
            slug: 'crossword-puzzle',
            pitch: 'Daily word challenges with crisp hints and no banners covering your clues.',
          },
        ],
        faqs: [
          {
            question: 'How often are ad-free lists updated?',
            answer:
              'We evaluate the catalogue every week and rotate in new titles sourced from the community backlog and developer submissions.',
          },
          {
            question: 'Can I filter ad-free games by difficulty?',
            answer:
              'Yes. Visit the full games listing, combine the “featured” or “new” filters with search keywords, and you will stay within ad-free selections.',
          },
          {
            question: 'Do these ad-free games support multiplayer?',
            answer:
              'Most highlighted titles are single-player to guarantee clean sessions. Multiplayer games are labelled clearly when they provide the same ad-free experience.',
          },
        ],
        ctaLabel: 'Open the full ad-free catalogue',
        ctaDescription: 'Filter by platform, genre, and play length to find your perfect session.',
      },
      zh: {
        metaTitle: 'Ad Free Games 精选 | 多设备无广告游戏合集',
        metaDescription:
          '在 GameHub 按分类与设备探索 ad free games。益智、策略、街机等作品全部经过筛选，保证无弹窗、无广告，随开随玩。',
        heading: 'Ad Free Games 合集',
        subheading: '按心情、设备、时长挑选干净的游戏体验，随时切换不失真。',
        overview: [
          'GameHub 为每个作品标注设备适配、游玩时长与操作方式，帮助你快速找到符合需求的“ad free games”。',
          '从此页出发即可快速发现新宠，保持零广告、零干扰的顺畅体验。',
        ],
        sections: [
          {
            title: '按心情切换不同类型',
            body: '轻松益智、节奏街机或深度策略任你挑选，所有分类都保证无广告干扰，桌面与移动端体验一致。',
          },
          {
            title: '同时优化触控与键鼠操作',
            body: '标记清楚哪些作品更适合触控，哪些在键鼠操作下更流畅，换设备也能保持 ad free 优势。',
            bullets: [
              '通勤时用触控快速开局。',
              '桌面上享受高精度的鼠标操控。',
              '客厅里用手柄进行长时间的沉浸对战。',
            ],
          },
          {
            title: '推荐列表如何保持新鲜',
            body: '我们每周查看社区提案与开发者提交，一旦发现插入广告，会立即替换为新的干净作品。',
          },
        ],
        recommendations: [
          {
            slug: 'hextris',
            pitch: '高速旋转的霓虹拼图，无任何广告脚本，专注追求高分。',
          },
          {
            slug: 'minesweeper',
            pitch: '经典扫雷焕然一新，界面干净、节奏紧凑，适合专注力训练。',
          },
          {
            slug: 'html5-tower-defense',
            pitch: '布阵升级迎战敌潮，全程无弹窗，就算是 Boss 战也毫无干扰。',
          },
          {
            slug: 'crossword-puzzle',
            pitch: '每日单词挑战，提示清晰不被横幅遮挡，英语学习好帮手。',
          },
        ],
        faqs: [
          {
            question: '多久更新一次推荐列表？',
            answer: '我们每周整理一次库，加入社区投票的作品，同时剔除添加广告的旧版本。',
          },
          {
            question: '可以按照难度筛选 ad free games 吗？',
            answer: '可以，进入全部游戏列表后结合“精选”“新品”等筛选条件，就能锁定干净的体验。',
          },
          {
            question: '这些无广告游戏支持多人联机吗？',
            answer: '页面上推荐的作品以单人体验为主，若有多人模式会在详情中标注，并确保同样没有广告。',
          },
        ],
        ctaLabel: '打开完整无广告清单',
        ctaDescription: '可按平台、类型、时长筛选，打造理想游玩节奏。',
      },
    },
  },
  {
    slug: 'best-free-iphone-games',
    primaryKeyword: 'best free iphone games',
    keywords: [
      'best free iphone games',
      'iphone browser games',
      'mobile friendly puzzle games',
      'touch friendly free games',
    ],
    updatedAt: seoContentUpdatedAt,
    relatedSlugs: ['ad-free-games', 'games-to-play-when-bored'],
    locales: {
      en: {
        metaTitle: 'Best Free iPhone Games | Touch-Friendly Browser Hits',
        metaDescription:
          'Discover the best free iPhone games you can play instantly in Safari. No storage required—just launch, swipe, and enjoy curated touch-friendly hits.',
        heading: 'Best Free iPhone Games',
        subheading: 'Play instantly in Safari or Chrome with zero installs and complete touch support.',
        overview: [
          'All titles on this page are lightweight, portrait-friendly, and responsive to one-handed play. They are perfect on iPhone, iPad, and modern Android devices too.',
          'Every recommendation syncs progress locally so you can step in and out during commutes, coffee breaks, or while waiting for friends.',
        ],
        sections: [
          {
            title: 'Optimised for Thumb-First Play',
            body: 'We test in real-world scenarios—standing on the train, walking between meetings, and lounging at home—to confirm buttons, swipes, and drag gestures feel natural on smaller screens.',
            bullets: [
              'Portrait layouts that keep action within comfortable thumb reach.',
              'Offline-friendly loops that do not break when your signal drops.',
              'Accessible difficulty curves so you can relax or chase high scores.',
            ],
          },
          {
            title: 'Why Browser Games Beat Native Installs',
            body: 'Skip the App Store download queue and storage warnings. Browser games launch within seconds and keep your device clutter-free.',
          },
          {
            title: 'Session Length You Control',
            body: 'Each game has checkpoints or endless modes that you can pause anytime. Perfect for filling three minutes or a full half hour.',
          },
        ],
        recommendations: [
          {
            slug: '2048',
            pitch: 'Swipe matching tiles with one thumb. Smooth animations make it ideal for quick iPhone play sessions.',
          },
          {
            slug: 'puzzle',
            pitch: 'Drag-and-drop jigsaw pieces with responsive touch controls and soothing background art.',
          },
          {
            slug: 'super-sudoku',
            pitch: 'Mobile-friendly number entry with smart notes and haptic-friendly feedback.',
          },
          {
            slug: 'snake',
            pitch: 'Flick in any direction to guide the snake. Short rounds are perfect while waiting in line.',
          },
        ],
        faqs: [
          {
            question: 'Do these iPhone games require downloads?',
            answer:
              'No. They run in your browser, so you can launch them instantly without installing anything from the App Store.',
          },
          {
            question: 'Will the games remember my progress?',
            answer:
              'Most games store progress in local browser storage. Keep the same device and you can pick up where you left off.',
          },
          {
            question: 'Are these games also available on iPad?',
            answer:
              'Yes. The responsive layouts stretch gracefully on larger iPad screens, giving you more room without breaking the controls.',
          },
        ],
        ctaLabel: 'Play more mobile-friendly games',
        ctaDescription: 'Open the games list and filter for portrait or casual tags to expand your library.',
      },
      zh: {
        metaTitle: 'Best Free iPhone Games | 触控友好的移动端小游戏',
        metaDescription:
          '精选 best free iPhone games，无需安装 App，直接在 Safari 中游玩。界面响应灵敏，适合通勤、排队等碎片时间。',
        heading: 'Best Free iPhone Games 推荐',
        subheading: '即开即玩，全面支持触控操作，不占存储空间。',
        overview: [
          '本页收录的游戏都经过移动端专项测试，兼顾竖屏体验与单手操作，iPhone、iPad 与主流 Android 设备都能流畅游玩。',
          '支持本地进度保存，随时暂停、继续，不再担心更新或下载占用流量。',
        ],
        sections: [
          {
            title: '专为触控优化',
            body: '我们在真实场景中测试——地铁上站立、会议间隙走动、沙发上休憩——确保按键、滑动、拖拽都符合拇指自然移动范围。',
            bullets: [
              '竖屏布局，将操作区集中在舒适的手指可达范围。',
              '弱网环境友好，信号不稳定时仍能保持游戏节奏。',
              '难度可控，可轻松放松，也能追求更高分数。',
            ],
          },
          {
            title: '为什么选择浏览器小游戏',
            body: '无需下载 App，不占用手机存储空间，也没有广告推送或后台更新，占用极少流量即可启动。',
          },
          {
            title: '自由掌控游玩长度',
            body: '每款游戏都提供短局或无限模式，可随时暂停，三分钟或半小时都能找到合适的体验。',
          },
        ],
        recommendations: [
          {
            slug: '2048',
            pitch: '单手滑动即可完成操作，动画顺滑，是 iPhone 上的经典动脑小游戏。',
          },
          {
            slug: 'puzzle',
            pitch: '拖放拼图碎片完成美图，触控反馈灵敏，搭配舒缓音乐放松心情。',
          },
          {
            slug: 'super-sudoku',
            pitch: '数字输入与标记功能为移动端量身打造，逻辑爱好者必备。',
          },
          {
            slug: 'snake',
            pitch: '轻触即走的贪吃蛇，随时开始随时结束，非常适合排队等待时打发时间。',
          },
        ],
        faqs: [
          {
            question: '这些 iPhone 游戏需要下载吗？',
            answer: '不需要，直接在浏览器中打开即可玩，不占用任何安装空间。',
          },
          {
            question: '退出后下次还能接着玩吗？',
            answer: '大部分支持本地存档，只要使用同一设备即可继续上次的进度。',
          },
          {
            question: 'iPad 上体验如何？',
            answer: '界面会自适应放大，控件布局保持合理，在大屏上操作更从容。',
          },
        ],
        ctaLabel: '查看更多移动端友好游戏',
        ctaDescription: '前往全部游戏列表，组合“休闲”“竖屏”等标签快速扩展收藏。',
      },
    },
  },
  {
    slug: 'games-to-play-when-bored',
    primaryKeyword: 'games to play when bored',
    keywords: [
      'games to play when bored',
      'quick games for boredom',
      'casual browser games',
      'short session games',
    ],
    updatedAt: seoContentUpdatedAt,
    relatedSlugs: ['free-games-no-ads', 'best-free-iphone-games'],
    locales: {
      en: {
        metaTitle: 'Games to Play When Bored | Quick Browser Boosters',
        metaDescription:
          'Beat boredom fast with these quick browser games. Launch in seconds, switch between puzzles and arcade thrills, and recharge your focus anytime.',
        heading: 'Games to Play When Bored',
        subheading: 'Launch in seconds to reset your brain, boost energy, or relax before heading back to work.',
        overview: [
          'Each pick starts instantly, delivers a satisfying gameplay loop in under five minutes, and adapts to desktop or mobile. No downloads, no commitment.',
          'Use these boredom busters as a reward between tasks, to reset your focus, or to make waiting in queues more enjoyable.',
        ],
        sections: [
          {
            title: 'Pick a Mood, Find a Game',
            body: 'Choose puzzles when you want calm focus, action when you crave a burst of energy, or strategy when you have a little more time to think.',
            bullets: [
              'Brain teasers to sharpen attention quickly.',
              'Arcade reflex loops that deliver instant dopamine hits.',
              'Slow-burn strategy runs for longer breaks.',
            ],
          },
          {
            title: 'Keep Sessions Short and Sweet',
            body: 'Every game here respects your time with fast restarts, generous checkpoints, or endless modes you can pause whenever a meeting starts.',
          },
          {
            title: 'Shareable Fun',
            body: 'Many recommendations include local scoreboards or challenge modes so you can compete with friends without logging in.',
          },
        ],
        recommendations: [
          {
            slug: 'hextris',
            pitch: 'Stack colours with split-second timing. Perfect for a two-minute adrenaline boost.',
          },
          {
            slug: '15-puzzle',
            pitch: 'Slide tiles until the picture aligns. Each round is a mini brain workout.',
          },
          {
            slug: 'xquest',
            pitch: 'Guide a tiny starship through neon mazes. Quick runs keep boredom far away.',
          },
          {
            slug: 'crossword-puzzle',
            pitch: 'Solve bite-sized crossword clues whenever you want a calmer challenge.',
          },
        ],
        faqs: [
          {
            question: 'Will these games interrupt me with ads?',
            answer:
              'No. They are curated from our ad-free catalogue, so you can jump in and out without disruptive pop-ups.',
          },
          {
            question: 'Can I save my progress between sessions?',
            answer:
              'Puzzles automatically remember your latest state. Arcade scores reset fast so you can chase personal bests anytime.',
          },
          {
            question: 'Which game is best for a five-minute break?',
            answer:
              'Try Hextris or 15 Puzzle for quick victories. If you have a bit longer, Super Sudoku offers a satisfying mental reset.',
          },
        ],
        ctaLabel: 'View more boredom busters',
        ctaDescription: 'Browse the full catalogue and filter by “hot” or “new” tags for fresh picks.',
      },
      zh: {
        metaTitle: '无聊时玩的小游戏 | 随时切换的在线放松清单',
        metaDescription:
          '打发无聊的最佳选择：即开即玩的在线小游戏。几秒钟进入状态，益智与街机任意切换，随时刷新精力。',
        heading: '无聊时玩的小游戏',
        subheading: '几分钟快速开局，随时提神或在回到工作前放松一下。',
        overview: [
          '本页所有游戏都能在数秒内加载完成，五分钟内提供完整一轮体验，电脑与手机均可畅玩，不用下载、不用等待。',
          '无论是任务间隙的小奖励、专注力不足的重启按键，还是排队等候的消遣，这些精选都能让时间过得更快。',
        ],
        sections: [
          {
            title: '按心情挑游戏',
            body: '需要冷静思考？想要瞬间刺激？还是打算长一点的策略回合？这里都有对应的选择。',
            bullets: [
              '动脑益智，快速唤醒注意力。',
              '街机反应，瞬间带来满足感。',
              '策略慢热，适合稍长的休息时间。',
            ],
          },
          {
            title: '控制节奏，随时暂停',
            body: '所有游戏都提供快速重开、自动存档或可随时暂停的模式，会议开始也能马上切回工作。',
          },
          {
            title: '分享乐趣更简单',
            body: '不少作品带有本地排行或挑战模式，无需登录即可与朋友比拼成绩。',
          },
        ],
        recommendations: [
          {
            slug: 'hextris',
            pitch: '高速堆叠的霓虹方块，两分钟就能完成一局，快速刷新状态。',
          },
          {
            slug: '15-puzzle',
            pitch: '经典 15 块滑块拼图，闯关短小却极具成就感。',
          },
          {
            slug: 'xquest',
            pitch: '驾驶小型飞船穿梭迷宫，手感灵敏，极易上瘾。',
          },
          {
            slug: 'crossword-puzzle',
            pitch: '随开随停的小型填字游戏，适合在安静时刻慢慢填完。',
          },
        ],
        faqs: [
          {
            question: '这些小游戏会不会突然弹广告？',
            answer: '不会，它们全部来自我们维护的无广告库，随时进入、随时退出都不会被打断。',
          },
          {
            question: '进度能保存吗？',
            answer: '益智类会自动记录当前状态，街机类则迅速重置，方便反复挑战高分。',
          },
          {
            question: '只有五分钟应该玩哪款？',
            answer: '推荐 Hextris 或 15 Puzzle，节奏紧凑且胜负明确；更长一点的空档可以尝试 Super Sudoku 重置思绪。',
          },
        ],
        ctaLabel: '探索更多解闷小游戏',
        ctaDescription: '进入全部游戏页面，结合“热门”“新品”等标签持续发现新作品。',
      },
    },
  },
];

export function getSeoLandingPages(): SeoLandingPage[] {
  return SEO_LANDING_PAGES;
}

export function getSeoLandingPage(slug: string): SeoLandingPage | undefined {
  return SEO_LANDING_PAGES.find((page) => page.slug === slug);
}
