export const NEW_EXPERIMENT_PAGE_SUMMARIES = [
  {
    slug: 'draw-a-perfect-circle',
    path: '/games/draw-a-perfect-circle',
    keyword: 'draw a perfect circle',
    pageType: 'game',
    qualityScore: 92,
  },
  {
    slug: 'chinese-checkers',
    path: '/games/chinese-checkers',
    keyword: 'chinese checkers',
    pageType: 'game',
    qualityScore: 91,
  },
  {
    slug: 'stacker-game',
    path: '/games/stacker-game',
    keyword: 'stacker game',
    pageType: 'game',
    qualityScore: 90,
  },
  {
    slug: 'two-player-games',
    path: '/games/two-player-games',
    keyword: 'games to play with 2 people',
    pageType: 'game_collection',
    qualityScore: 93,
  },
] as const;

export type NewExperimentSlug = (typeof NEW_EXPERIMENT_PAGE_SUMMARIES)[number]['slug'];

export const NEW_EXPERIMENT_PAGE_DEFINITIONS = {
  'draw-a-perfect-circle': {
    ...NEW_EXPERIMENT_PAGE_SUMMARIES[0],
    playMode: 'SinglePlayer',
    locales: {
      en: {
        metaTitle: 'Draw a Perfect Circle - Test Your Accuracy Online',
        metaDescription:
          'Draw a circle with transparent roundness, closure and centering scores, then practice shape-match scoring for square, triangle, spiral and a private daily challenge.',
        keywords: ['draw a perfect circle', 'draw perfect circle', 'circle accuracy game'],
        eyebrow: 'Luma original geometry challenge',
        title: 'Draw a Perfect Circle — Test Your Accuracy Online',
        intro:
          'Draw with a mouse, pen or finger and see exactly how round, closed and centered your stroke is. Practice freely or complete the deterministic daily shape.',
        originalNote:
          'This clean-room Luma game uses an original geometric formula, constants, colors, canvas shapes and copy. It contains no third-party code, image, sound, screenshot, score formula or iframe, and raw drawing points never leave the browser.',
        sections: [
          {
            title: 'How the score is calculated',
            body:
              'For circles, roundness compares every sampled radius, closure measures the first-to-last gap, and centering compares the stroke with the target. Square and triangle use guide match plus closure; the open spiral uses guide match plus endpoint fit. The visible components form the total instead of an unexplained percentage.',
          },
          {
            title: 'Three ways to improve',
            body:
              'Start with a comfortable wrist position, keep one steady speed, and aim to meet your starting point without a last-second hook. A larger stroke is usually easier to control than a tiny circle, especially on a phone.',
          },
          {
            title: 'Circle, square, triangle and spiral',
            body:
              'Circle is the default challenge. Square, triangle and spiral use shape-specific target geometry, so an open spiral is never penalized for not closing. Shape selection changes only the local guide and formula; it never downloads a level or sends your stroke to a server.',
          },
          {
            title: 'Daily challenge and privacy',
            body:
              'The Asia/Shanghai calendar date selects one deterministic daily shape. Best scores and the seven-day streak stay in local browser storage. Sharing creates a short result summary without coordinates, identity, account or device fingerprint.',
          },
        ],
        faqTitle: 'Perfect Circle FAQ',
        faqs: [
          { question: 'Can I draw on a phone?', answer: 'Yes. The canvas supports touch, pen and mouse input and fits a 360px viewport without page overflow.' },
          { question: 'What affects the score?', answer: 'Circle uses roundness, closure and centering. Other shapes use visible guide match plus closure or spiral endpoint fit. No copied or secret competitor formula is used.' },
          { question: 'How does the daily challenge work?', answer: 'The local calendar date deterministically selects a shape. Replaying the same date does not inflate the streak.' },
          { question: 'Is my drawing uploaded?', answer: 'No. Practice, scoring, best results and streak calculations happen in this browser; analytics receives only coarse score and input-type buckets.' },
        ],
        relatedTitle: 'More original precision games',
        related: [
          { href: '/games', title: 'Browse all games', description: 'Return to the browser-game hub.' },
          { href: '/games/connect-the-dots', title: 'Connect the Dots', description: 'Practice ordered taps and visual precision.' },
          { href: '/games/sorting-games', title: 'Sorting Games', description: 'Switch to short pattern and classification challenges.' },
        ],
        home: 'Home', games: 'Games', backToGames: 'Back to games',
      },
      zh: {
        metaTitle: '画一个完美圆形 - 在线测试绘图准确度',
        metaDescription: '用鼠标、触控或手写笔画圆，查看圆度、闭合度和居中度，并挑战方形、三角形、螺旋与本地每日题。',
        keywords: ['画一个完美圆', '在线画圆', '圆形准确度游戏'],
        eyebrow: 'Luma 原创几何挑战',
        title: '画一个完美圆形 — 在线测试准确度',
        intro: '用鼠标、手写笔或手指完成一笔画，分别查看圆度、闭合度和居中度；可自由练习，也可完成确定性的每日图形。',
        originalNote: '这是 Luma 原创 clean-room 几何游戏，公式、常量、配色、Canvas 图形与文案均独立完成，不含第三方代码、图片、声音、截图、评分公式或 iframe，原始轨迹不会离开浏览器。',
        sections: [
          { title: '分数怎样计算', body: '圆形使用圆度、首尾闭合度和居中度；方形与三角形使用辅助线匹配、闭合度和居中度；开放螺旋则使用端点匹配，不会因不闭合而被扣分。总分只由这些可见分数组成。' },
          { title: '三个改进方法', body: '先让手腕保持舒服，再用稳定速度完成一笔，最后自然回到起点，避免临近结束时突然勾线。手机上画得稍大通常更容易控制。' },
          { title: '圆形、方形、三角形和螺旋', body: '圆形是默认挑战，方形、三角形和螺旋各自使用对应的目标几何；开放螺旋不会被闭合度规则误判。切换图形只改变本地辅助线与公式，不下载关卡，也不会上传轨迹。' },
          { title: '每日挑战与隐私', body: 'Asia/Shanghai 日期会确定当天图形。最高分和七日连续记录只保存在本地浏览器；分享结果不包含坐标、身份、账号或设备指纹。' },
        ],
        faqTitle: '完美圆形常见问题',
        faqs: [
          { question: '手机可以画吗？', answer: '可以。画布支持触控、手写笔和鼠标，并适配 360px 视口。' },
          { question: '哪些因素影响分数？', answer: '圆形使用圆度、闭合度和居中度；其他图形使用可见的辅助线匹配，以及闭合度或螺旋端点匹配，不使用复制或隐藏公式。' },
          { question: '每日挑战怎样运行？', answer: '本地日期确定每日图形，同一天重复完成不会虚增连续记录。' },
          { question: '我的绘图会上传吗？', answer: '不会。轨迹、评分、最高分和连续记录都在浏览器中处理，分析事件只使用粗粒度分数与输入类型。' },
        ],
        relatedTitle: '更多原创精度游戏',
        related: [
          { href: '/games', title: '浏览全部游戏', description: '返回浏览器游戏库。' },
          { href: '/games/connect-the-dots', title: 'Connect the Dots', description: '练习顺序点击和视觉准确度。' },
          { href: '/games/sorting-games', title: 'Sorting Games', description: '切换到短局图案与分类挑战。' },
        ],
        home: '首页', games: '游戏', backToGames: '返回游戏库',
      },
    },
  },
  'chinese-checkers': {
    ...NEW_EXPERIMENT_PAGE_SUMMARIES[1],
    playMode: ['SinglePlayer', 'MultiPlayer'],
    locales: {
      en: {
        metaTitle: 'Chinese Checkers Online - Play Against AI or a Friend',
        metaDescription: 'Play an original 121-hole Chinese Checkers board locally or against Easy, Medium and Hard AI, with legal steps, chained jumps, hints and undo.',
        keywords: ['chinese checkers', 'chinese checkers game', 'how to play chinese checkers'],
        eyebrow: 'Luma original strategy board',
        title: 'Chinese Checkers Online — Play Against AI or a Friend',
        intro: 'Move all ten marbles into the opposite camp. Play two people on one device or choose a deterministic AI level, with every legal step and jump highlighted.',
        originalNote: 'This clean-room Luma implementation uses the public rules of the traditional board game with original code, SVG geometry, colors and copy. It does not copy a commercial app, board image, animation, sound, level file or opponent engine.',
        sections: [
          { title: 'The honest two-player MVP', body: 'This page implements the standard 121-hole star for two opposite players, not a six-player tournament. Each side starts with ten marbles and wins only after all ten reach the opposite camp.' },
          { title: 'Steps and chained jumps', body: 'A marble may step to one adjacent empty hole, or jump an occupied neighbor into the empty hole directly beyond it. Additional legal jumps can continue in the same move; jumped marbles are never captured.' },
          { title: 'Local play and three AI levels', body: 'Local mode alternates two people on one device. Easy samples a legal move, Medium favors forward moves, and Hard chooses the strongest deterministic progress score. The labels describe this bounded search, not human skill ratings.' },
          { title: 'Phone and keyboard controls', body: 'Select a marble, then a highlighted destination. Every hole is a labeled button with a visible focus state; touch and keyboard activation use the same legal-move validator. Hint and undo never change the public rules.' },
        ],
        faqTitle: 'Chinese Checkers FAQ',
        faqs: [
          { question: 'Is this the full six-player version?', answer: 'No. This transparent MVP uses the standard board with two opposite ten-marble sides.' },
          { question: 'Can jumps be chained?', answer: 'Yes. A move may continue through legal occupied-neighbor jumps to empty landing holes, without capturing any marble.' },
          { question: 'How do the AI levels differ?', answer: 'All use legal moves. Easy samples deterministically, Medium prioritizes progress, and Hard uses the strongest bounded progress score.' },
          { question: 'Can two people share a phone?', answer: 'Yes. Local mode alternates turns on one device and uses large labeled controls.' },
        ],
        relatedTitle: 'More strategy games',
        related: [
          { href: '/games', title: 'Browse all games', description: 'Return to the browser-game hub.' },
          { href: '/games/daily-solitaire', title: 'Daily Solitaire', description: 'Try a deterministic card challenge.' },
          { href: '/games/mahjong-connect', title: 'Mahjong Connect', description: 'Practice route finding and matching.' },
        ],
        home: 'Home', games: 'Games', backToGames: 'Back to games',
      },
      zh: {
        metaTitle: '中国跳棋 - 本地双人或三档 AI 在线玩',
        metaDescription: '在原创 121 孔中国跳棋棋盘上本地双人或挑战 Easy、Medium、Hard AI，支持合法步进、连续跳、提示和撤销。',
        keywords: ['中国跳棋', '在线中国跳棋', '中国跳棋怎么玩'],
        eyebrow: 'Luma 原创策略棋盘',
        title: '中国跳棋 — 本地双人或挑战 AI',
        intro: '把自己的十枚棋子全部移入对面营地。可两人共用设备，也可选择确定性的 AI 难度，所有合法步进和跳跃都会明确标出。',
        originalNote: '这是 Luma 基于传统公开规则独立完成的 clean-room 原创实现，代码、SVG 几何、配色与文案均为原创，不复制商业应用、棋盘图片、动画、声音、关卡或对手引擎。',
        sections: [
          { title: '如实说明的双人 MVP', body: '本页使用标准 121 孔星形棋盘和两组相对玩家，不冒充六人锦标赛。双方各有十枚棋子，只有全部进入对面营地才获胜。' },
          { title: '步进与连续跳', body: '棋子可以走到相邻空孔，也可以越过相邻任意棋子，落在其正后方空孔；如果下一段仍合法，可以继续跳。被越过的棋子不会被吃掉。' },
          { title: '本地双人与三档 AI', body: '本地模式让两人轮流操作。Easy 从合法走法中确定性采样，Medium 偏向前进，Hard 选择有界评分最高的进度走法；这些标签不是人类段位承诺。' },
          { title: '手机与键盘操作', body: '先选择棋子，再选择高亮目标。每个孔位都是有标签和焦点样式的按钮，触控与键盘共用同一合法走法校验器；提示和撤销不会改变规则。' },
        ],
        faqTitle: '中国跳棋常见问题',
        faqs: [
          { question: '这是完整六人版本吗？', answer: '不是。本 MVP 如实提供标准棋盘上的两组相对十子玩法。' },
          { question: '可以连续跳吗？', answer: '可以，只要每一段都越过相邻棋子并落在空孔中，且不会吃掉任何棋子。' },
          { question: '三档 AI 有什么区别？', answer: '全部只走合法步；Easy 确定性采样，Medium 偏向前进，Hard 使用最强的有界进度评分。' },
          { question: '两个人能共用手机玩吗？', answer: '可以。本地模式在同一设备上轮流操作，并提供较大的标记控件。' },
        ],
        relatedTitle: '更多策略游戏',
        related: [
          { href: '/games', title: '浏览全部游戏', description: '返回浏览器游戏库。' },
          { href: '/games/daily-solitaire', title: '每日纸牌', description: '尝试确定性的每日卡牌挑战。' },
          { href: '/games/mahjong-connect', title: 'Mahjong Connect', description: '练习路径判断与配对。' },
        ],
        home: '首页', games: '游戏', backToGames: '返回游戏库',
      },
    },
  },
  'stacker-game': {
    ...NEW_EXPERIMENT_PAGE_SUMMARIES[2],
    playMode: 'SinglePlayer',
    locales: {
      en: {
        metaTitle: 'Stacker Game - Build the Tallest Tower Online',
        metaDescription: 'Play an original one-button stacker game with overlap trimming, perfect-drop combos, Classic and 60-second Sprint modes, touch and keyboard controls.',
        keywords: ['stacker game', 'stack game online', 'tower stacking game'],
        eyebrow: 'Luma original one-button arcade',
        title: 'Stacker Game — Build the Tallest Tower Online',
        intro: 'Drop each moving block over the tower. The overlap survives, a total miss ends the run, and every perfect placement builds your combo.',
        originalNote: 'This clean-room Luma game uses original 2D geometry, independently chosen tolerance, combo and speed constants, generated colors and local Web Audio. It includes no third-party game code, art, level, audio, screenshot, trademark or iframe.',
        sections: [
          { title: 'Controls and scoring', body: 'Tap, click, Space or Enter to drop. A successful overlap adds one level; a near-perfect drop snaps into place and grows the combo. Classic continues until a miss, while Sprint stops exactly after sixty seconds.' },
          { title: 'Five practical tower tips', body: 'Watch one edge instead of the whole block, learn the current speed before tapping, stay centered early, protect width after a trim, and use the same rhythm rather than chasing the moving color.' },
          { title: 'Classic and 60-second Sprint', body: 'Classic is an endless precision run. Sprint uses the same overlap rules with a visible one-minute clock. Speed rises gradually and is capped so the game stays readable on touch screens.' },
          { title: 'Local best, pause and accessibility', body: 'Best scores stay in this browser. The game pauses when the tab is hidden, defaults to muted, respects reduced motion and provides a high-contrast outline and visible keyboard focus.' },
        ],
        faqTitle: 'Stacker Game FAQ',
        faqs: [
          { question: 'Does it work on mobile?', answer: 'Yes. Tap the large game surface to drop a block; no download or external asset is required.' },
          { question: 'Can I use the keyboard?', answer: 'Yes. Focus the game surface and press Space or Enter.' },
          { question: 'What counts as a perfect drop?', answer: 'A drop inside the original three-unit tolerance snaps to the previous block and advances the combo.' },
          { question: 'Where is my best score saved?', answer: 'Only in local browser storage. Analytics receives coarse mode, height and score buckets, not a personal profile.' },
        ],
        relatedTitle: 'Keep testing your timing',
        related: [
          { href: '/games', title: 'Browse all games', description: 'Return to the browser-game hub.' },
          { href: '/games/sorting-games', title: 'Sorting Games', description: 'Switch from timing to visual classification.' },
          { href: '/games/snake-3d', title: 'Snake 3D', description: 'Try another original keyboard-and-touch challenge.' },
        ],
        home: 'Home', games: 'Games', backToGames: 'Back to games',
      },
      zh: {
        metaTitle: 'Stacker Game 堆塔游戏 - 在线搭建最高塔',
        metaDescription: '玩原创一键堆塔游戏，包含重叠裁切、完美落点连击、经典与 60 秒冲刺，并支持触控和键盘。',
        keywords: ['堆塔游戏', 'Stacker Game', '在线叠方块'],
        eyebrow: 'Luma 原创一键街机',
        title: 'Stacker Game — 在线搭建最高塔',
        intro: '把移动方块落在塔顶，只有重叠部分会保留；完全落空会结束本局，连续完美落点则会累积连击。',
        originalNote: '这是 Luma clean-room 原创游戏，使用独立完成的 2D 几何、自定容差/连击/速度常量、生成配色与本地 Web Audio，不含第三方游戏代码、美术、关卡、音频、截图、商标或 iframe。',
        sections: [
          { title: '操作与计分', body: '点击、触摸或按 Space/Enter 落块。成功重叠会增加一层，接近完美的落点会自动对齐并累积连击；经典模式持续到失误，冲刺模式在六十秒整结束。' },
          { title: '五个实用技巧', body: '观察一侧边缘而不是整块；先熟悉当前速度；前期尽量居中；裁切后优先保护剩余宽度；保持同一节奏，不要追着颜色变化点击。' },
          { title: '经典与 60 秒冲刺', body: '经典模式是持续的准确度挑战；冲刺模式使用相同重叠规则和可见的一分钟计时。速度逐渐上升并设有上限，触屏仍可读。' },
          { title: '本地最高分、暂停与可访问性', body: '最高分只保存在当前浏览器。标签页隐藏时自动暂停，默认静音，支持减少动态、高对比轮廓和清晰键盘焦点。' },
        ],
        faqTitle: 'Stacker Game 常见问题',
        faqs: [
          { question: '手机可以玩吗？', answer: '可以。触摸较大的游戏区域即可落块，不需要下载或外部素材。' },
          { question: '可以使用键盘吗？', answer: '可以。让游戏区域获得焦点后按 Space 或 Enter。' },
          { question: '怎样算完美落点？', answer: '偏差位于原创三单位容差内时，会对齐上一块并增加连击。' },
          { question: '最高分保存在哪里？', answer: '只保存在本地浏览器；分析事件只接收粗粒度模式、高度和分数区间。' },
        ],
        relatedTitle: '继续测试节奏',
        related: [
          { href: '/games', title: '浏览全部游戏', description: '返回浏览器游戏库。' },
          { href: '/games/sorting-games', title: 'Sorting Games', description: '从节奏切换到视觉分类。' },
          { href: '/games/snake-3d', title: 'Snake 3D', description: '尝试另一款原创键盘与触控挑战。' },
        ],
        home: '首页', games: '游戏', backToGames: '返回游戏库',
      },
    },
  },
  'two-player-games': {
    ...NEW_EXPERIMENT_PAGE_SUMMARIES[3],
    playMode: 'MultiPlayer',
    collectionItems: [
      { name: 'Tap Duel', anchor: 'tap-duel' },
      { name: 'Grid Claim', anchor: 'grid-claim' },
      { name: 'Sync Switch', anchor: 'sync-switch' },
    ],
    locales: {
      en: {
        metaTitle: 'Games to Play With 2 People - 3 Free Same-Screen Games',
        metaDescription: 'Play Tap Duel, Grid Claim and Sync Switch on one device with split touch and keyboard controls, shared best-of-three scoring and no download.',
        keywords: ['games to play with 2 people', 'two player games online', 'same device games'],
        eyebrow: 'Three Luma original same-device games',
        title: 'Games to Play With 2 People — 3 Free Same-Screen Games',
        intro: 'Pick reaction, strategy or cooperation. Tap Duel, Grid Claim and Sync Switch are three separate original games with shared best-of-three scoring for two people beside one screen.',
        originalNote: 'This clean-room Luma collection contains three original reducers, layouts, symbols, timing rules and split controls. It does not embed, copy or reskin the existing iframe collection, third-party Pong code, art, sound, levels or screenshots.',
        sections: [
          { title: 'Tap Duel: reaction', body: 'Wait for the visible cue, then race to press your side. A false start awards the point to the other player. Keyboard repeat is ignored, and touch uses two non-overlapping player zones.' },
          { title: 'Grid Claim: strategy', body: 'Take turns claiming a seeded three-by-three grid. Completing a row, column or diagonal scores once, so the goal is to build your line while blocking the other player.' },
          { title: 'Sync Switch: cooperation', body: 'Both players press within the same timing window. Every success narrows the window to a safe floor, turning communication and rhythm into the challenge rather than raw speed.' },
          { title: 'Shared score and private play', body: 'The first player to win two rounds takes the best-of-three match. Everything runs after page load without accounts, downloads, identity tracking, a public lobby or a remote opponent.' },
        ],
        faqTitle: 'Two Player Games FAQ',
        faqs: [
          { question: 'Are all three games playable?', answer: 'Yes. Reaction, strategy and cooperation each have an independent state and interaction loop.' },
          { question: 'Can both players use touch?', answer: 'Yes. Each player has a separate large touch zone, and the controls also support A/Space and L/Enter on a keyboard.' },
          { question: 'Do we need two devices?', answer: 'No. These are same-device games for two people beside one phone, tablet or computer.' },
          { question: 'Does it work offline?', answer: 'After the page loads, all three game loops run locally without additional game, font, image or audio downloads.' },
        ],
        relatedTitle: 'More ways to play together',
        related: [
          { href: '/games/2-player-unblocked', title: 'Two-player collection', description: 'Open the existing licensed and original local collection.' },
          { href: '/games/connect-the-dots', title: 'Connect the Dots', description: 'Take turns on a calmer precision puzzle.' },
          { href: '/games', title: 'Browse all games', description: 'Return to the full browser-game hub.' },
        ],
        home: 'Home', games: 'Games', backToGames: 'Back to games',
      },
      zh: {
        metaTitle: '两个人玩的游戏 - 三款同设备原创挑战',
        metaDescription: '同一设备上玩 Tap Duel、Grid Claim 与 Sync Switch，支持分区触控和键盘、共享三局两胜，不用下载。',
        keywords: ['两个人玩的游戏', '双人在线游戏', '同设备双人游戏'],
        eyebrow: '三款 Luma 原创同设备游戏',
        title: '两个人玩的游戏 — 三款同设备挑战',
        intro: '从反应、策略和合作中选择。Tap Duel、Grid Claim 与 Sync Switch 是三款独立原创游戏，两个人围着同一屏幕完成共享三局两胜。',
        originalNote: '这是 Luma clean-room 原创合集，包含三套独立 reducer、布局、符号、计时规则和分区操作，不嵌入、复制或换皮现有 iframe 合集、第三方 Pong 代码、美术、声音、关卡或截图。',
        sections: [
          { title: 'Tap Duel：反应', body: '等待可见提示后再按自己一侧；抢按会把本分交给对手。键盘重复事件会被忽略，触屏使用两个不重叠的玩家区域。' },
          { title: 'Grid Claim：策略', body: '双方轮流占领确定性三乘三棋盘；完成横线、竖线或对角线只计一次分，因此既要构建自己的线，也要阻止对手。' },
          { title: 'Sync Switch：合作', body: '两位玩家需要在同一个时间窗口内按下控制。每次成功都会把窗口缩小到安全下限，挑战的是沟通与节奏，不只是手速。' },
          { title: '共享比分与私密游玩', body: '先赢两局的玩家拿下三局两胜。页面加载后全部在本地运行，不需要账号、下载、身份跟踪、公开大厅或远程对手。' },
        ],
        faqTitle: '双人游戏常见问题',
        faqs: [
          { question: '三款游戏都能玩吗？', answer: '可以。反应、策略和合作各自拥有独立状态与交互循环。' },
          { question: '两个人都能用触控吗？', answer: '可以。双方各有独立的大触控区，也支持键盘 A/Space 与 L/Enter。' },
          { question: '需要两台设备吗？', answer: '不需要。这些是两个人围着同一手机、平板或电脑玩的同设备游戏。' },
          { question: '离线还能玩吗？', answer: '页面加载完成后，三款循环都在本地运行，不再下载游戏、字体、图片或音频。' },
        ],
        relatedTitle: '更多一起玩的方式',
        related: [
          { href: '/games/2-player-unblocked', title: '现有双人合集', description: '打开已有授权与原创本地双人合集。' },
          { href: '/games/connect-the-dots', title: 'Connect the Dots', description: '轮流挑战更安静的精度益智游戏。' },
          { href: '/games', title: '浏览全部游戏', description: '返回完整浏览器游戏库。' },
        ],
        home: '首页', games: '游戏', backToGames: '返回游戏库',
      },
    },
  },
} as const;
