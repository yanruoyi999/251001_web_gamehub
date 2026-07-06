import type { Locale } from '@/i18n/config';

export interface GameEditorialRelatedGuide {
  slug: string;
  title: string;
  description: string;
}

export interface GameEditorialFaq {
  question: string;
  answer: string;
}

export interface GameEditorialLocaleContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  summary: string;
  overview: string[];
  howToPlay: string[];
  controls: Array<{ label: string; value: string }>;
  tips: string[];
  faqs: GameEditorialFaq[];
  relatedGuides: GameEditorialRelatedGuide[];
}

type GameEditorialEntry = Record<Locale, GameEditorialLocaleContent>;

const GAME_EDITORIAL_CONTENT: Record<string, GameEditorialEntry> = {
  'drive-mad': {
    en: {
      metaTitle: 'Drive Mad Online - Controls, Tips and Safe Browser Play',
      metaDescription:
        'Play Drive Mad online with practical controls, landing tips, level advice, mobile notes, FAQs, and related browser game guides.',
      title: 'Drive Mad quick guide',
      summary:
        'Drive Mad is a physics driving challenge where the hard part is not raw speed. Each level asks you to control throttle, rotation, landing angle, and vehicle balance with very small inputs, so the best runs feel more like careful puzzle solving than racing.',
      overview: [
        'Treat every stage like a tiny driving puzzle. The safest run is usually slower than the first instinct: roll onto ramps, release before the nose drops, and let the vehicle settle before the next obstacle.',
        'This page is meant to sit next to the playable browser version. Start a run, notice why the car flips, then return to the tips and FAQ when a jump, bridge, or monster-truck stage starts costing repeated attempts.',
      ],
      howToPlay: [
        'Hold the throttle only long enough to build momentum for the next obstacle.',
        'Release before steep landings so the vehicle does not rotate too far forward.',
        'Use short retry loops: identify whether the level is about balance, jump timing, or a moving mechanism before changing your input.',
      ],
      controls: [
        { label: 'Accelerate / rotate', value: 'Hold the main throttle key or touch control.' },
        { label: 'Ease off', value: 'Release the input to slow down and control the landing angle.' },
        { label: 'Restart', value: 'Use the in-game restart when a vehicle is already unrecoverable.' },
      ],
      tips: [
        'Most crashes come from holding the throttle after the jump has already started.',
        'On mobile, use quick taps instead of long presses because touch controls are easy to over-hold.',
        'For bridge levels, enter gently and keep the vehicle level before the final push.',
        'If a vehicle keeps tipping backward, start the ramp with less speed rather than more.',
      ],
      faqs: [
        {
          question: 'Why does my car keep flipping in Drive Mad?',
          answer:
            'You are probably holding the throttle too long. Release before the car reaches the top of a ramp so the nose can settle before landing.',
        },
        {
          question: 'Is Drive Mad better on keyboard or mobile?',
          answer:
            'Keyboard is more predictable for fine throttle timing. Mobile can work, but short taps are safer than holding the pedal.',
        },
        {
          question: 'Do I need to download Drive Mad?',
          answer:
            'No. Use the browser player and avoid pages that turn the game into an APK, extension, or installer download.',
        },
      ],
      relatedGuides: [
        {
          slug: 'drive-mad-walkthrough',
          title: 'Drive Mad walkthrough',
          description: 'Detailed problem-based fixes for flips, jumps, monster trucks, and mobile controls.',
        },
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'More high-retry browser games with the same one-more-try loop.',
        },
      ],
    },
    zh: {
      metaTitle: 'Drive Mad 在线玩 - 操作、过关技巧与安全浏览器玩法',
      metaDescription:
        '在线玩 Drive Mad，并查看实用操作、落地技巧、关卡思路、手机玩法、FAQ 和相关浏览器游戏攻略。',
      title: 'Drive Mad 快速玩法指南',
      summary:
        'Drive Mad 是一款物理驾驶挑战，难点不在一味加速，而在用很小的输入控制油门、车身旋转、落地角度和车辆重心。每一关更像一个短小驾驶谜题，玩家需要判断坡度、跳台和落点，再决定什么时候按住或松开油门。',
      overview: [
        '把每一关都当成一个小型驾驶谜题。最稳的跑法通常不是最快的：上坡前轻推，起跳前松油门，落地后等车身稳定，再处理下一个机关。',
        '这个页面适合作为游玩时的参考。先进入浏览器版试玩一轮，观察车辆为什么翻车，再回来对照技巧和 FAQ 调整跳跃、桥面或大轮车关卡的操作。',
      ],
      howToPlay: [
        '只在需要动量时按住油门，不要把加速当成默认状态。',
        '陡坡或跳台前提前松开，让车头在空中自然回正。',
        '每次失败先判断关卡是考平衡、跳跃时机还是机关节奏，再改变输入。',
      ],
      controls: [
        { label: '加速 / 空中旋转', value: '按住主油门键或触控按钮。' },
        { label: '减速 / 稳定落地', value: '松开输入，让车身减少前翻或后仰。' },
        { label: '重新开始', value: '车辆已无法救回时，使用游戏内重开按钮。' },
      ],
      tips: [
        '多数翻车来自起跳后还继续长按油门。',
        '手机端更适合短按，不要像键盘一样长时间按住触控按钮。',
        '桥面关卡先慢速上桥，让车身水平后再推进。',
        '如果车辆总是后仰，减少上坡前速度，而不是继续加速。',
      ],
      faqs: [
        {
          question: 'Drive Mad 为什么总翻车？',
          answer: '通常是油门按太久。到达坡顶前先松开，让车头在落地前回到更稳定的角度。',
        },
        {
          question: 'Drive Mad 用键盘还是手机更好？',
          answer: '键盘更适合细控制油门。手机也能玩，但短按比长按更稳定。',
        },
        {
          question: 'Drive Mad 需要下载吗？',
          answer: '不需要。直接使用浏览器播放器即可，避开把游戏包装成 APK、插件或安装器的页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'drive-mad-walkthrough',
          title: 'Drive Mad 过关攻略',
          description: '按翻车、跳跃、大轮车和手机操作问题整理的详细解法。',
        },
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的高重试小游戏',
          description: '寻找同样有“再来一次”节奏的浏览器挑战。',
        },
      ],
    },
  },
  'google-snake': {
    en: {
      metaTitle: 'Google Snake Online - Controls, Tips and Mod Guide Links',
      metaDescription:
        'Play Google Snake online with safe browser-play notes, controls, score tips, FAQ answers, and links to Snake mod and menu guides.',
      title: 'Google Snake quick guide',
      summary:
        'Google Snake is a classic snake-style browser game built around route planning. The score improves when you think one turn ahead and keep escape lanes open.',
      overview: [
        'The easy mistake is chasing each apple directly. A better habit is to move in wide loops, avoid cutting the board in half, and leave room to turn before the snake gets long.',
        'This page focuses on clean browser play and practical scoring habits. It does not require a download, extension, ROM, or unofficial installer.',
      ],
      howToPlay: [
        'Guide the snake to food while avoiding walls and your own tail.',
        'Keep the route wide in the early game so the snake has space after it grows.',
        'When the board gets crowded, circle the outside and enter the center only for a safe apple.',
      ],
      controls: [
        { label: 'Move', value: 'Use arrow keys or WASD, depending on the active browser build.' },
        { label: 'Pause', value: 'Use the in-game pause or menu control when available.' },
        { label: 'Mobile', value: 'Swipe or tap controls may vary; test one short round first.' },
      ],
      tips: [
        'Do not reverse direction into your own body; plan the next two turns before taking tight apples.',
        'The outer-loop strategy is slower but safer once the snake covers much of the board.',
        'If you are exploring mods or menu options, keep them to documented browser settings and avoid download prompts.',
      ],
      faqs: [
        {
          question: 'What is the safest way to score higher in Google Snake?',
          answer:
            'Use wide loops and leave an exit path before collecting food. High scores usually come from space control, not from rushing every apple.',
        },
        {
          question: 'Can I play Google Snake on mobile?',
          answer:
            'Yes, but controls can vary by browser. Test one short round to confirm swipes or touch buttons feel reliable.',
        },
        {
          question: 'Are Google Snake mods required?',
          answer:
            'No. Mods are optional. If you research them, avoid unknown downloads and use clear browser-based instructions only.',
        },
      ],
      relatedGuides: [
        {
          slug: 'google-snake-mods',
          title: 'Google Snake mods guide',
          description: 'Safe notes about mod menus, settings, and what to avoid.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'Short browser games for quick sessions.',
        },
      ],
    },
    zh: {
      metaTitle: 'Google Snake 在线玩 - 操作、得分技巧与 Mod 指南入口',
      metaDescription:
        '在线玩 Google Snake，查看安全浏览器玩法说明、操作、得分技巧、FAQ，以及 Snake mod 和菜单指南入口。',
      title: 'Google Snake 快速玩法指南',
      summary:
        'Google Snake 是经典贪吃蛇式浏览器游戏，核心不是追着每个食物跑，而是提前规划路线，给变长后的蛇保留转向空间。',
      overview: [
        '新手常见错误是直接冲向最近的食物。更稳的方式是绕大圈移动，避免把棋盘切成两半，并在蛇身变长前保留逃生路线。',
        '这个页面强调干净的浏览器玩法和实用得分习惯，不需要下载、插件、ROM 或不明安装器。',
      ],
      howToPlay: [
        '控制蛇吃到食物，同时避开墙壁和自己的身体。',
        '前期尽量走宽路线，让蛇变长后仍有空间转弯。',
        '棋盘拥挤后，优先沿外圈循环，只有安全时再进入中心拿食物。',
      ],
      controls: [
        { label: '移动', value: '根据当前浏览器版本，使用方向键或 WASD。' },
        { label: '暂停', value: '如果游戏内提供暂停或菜单按钮，优先使用内置控制。' },
        { label: '手机端', value: '滑动或触控手感可能不同，先试玩一小局确认。' },
      ],
      tips: [
        '不要反向撞到自己的身体；吃窄位置食物前先想好后两步。',
        '外圈循环速度慢一点，但在蛇身变长后更安全。',
        '如果研究 mod 或菜单，只看清楚的浏览器设置说明，避开下载提示。',
      ],
      faqs: [
        {
          question: 'Google Snake 怎么提高分数最稳？',
          answer: '走大圈并保留出口，比抢最近食物更重要。高分通常来自空间控制，而不是盲目加速。',
        },
        {
          question: 'Google Snake 手机能玩吗？',
          answer: '可以，但不同浏览器的触控方式可能不同。建议先试玩一小局确认滑动或按钮是否可靠。',
        },
        {
          question: 'Google Snake 一定要用 mod 吗？',
          answer: '不需要。mod 只是可选玩法；如果研究相关设置，应避开不明下载和插件。',
        },
      ],
      relatedGuides: [
        {
          slug: 'google-snake-mods',
          title: 'Google Snake Mods 指南',
          description: '关于菜单、设置和安全边界的说明。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '适合短时间打开的轻量游戏清单。',
        },
      ],
    },
  },
  ovo: {
    en: {
      metaTitle: 'OvO Online - Parkour Controls, Wall Jumps and Tips',
      metaDescription:
        'Play OvO online with practical parkour controls, dive-jump and wall-jump tips, mobile notes, FAQs, and related platformer guides.',
      title: 'OvO quick guide',
      summary:
        'OvO is a precision parkour platformer where momentum matters more than mashing jump. Clean slides, wall jumps, and dive jumps carry most difficult rooms, while random retries usually hide the real mistake in timing, spacing, or direction input.',
      overview: [
        'The fastest improvement comes from learning why a room failed. If you missed a platform, check whether the mistake was the jump point, the slide timing, or losing momentum before the wall.',
        'Use this page as a compact control reference while you play. The longer walkthrough covers level-specific habits, but the basics below solve most early walls.',
      ],
      howToPlay: [
        'Run through each room, avoid spikes and hazards, and reach the exit.',
        'Combine slide, jump, wall jump, and dive movements instead of treating each obstacle separately.',
        'Retry quickly, but change one input at a time so you learn what actually fixed the section.',
      ],
      controls: [
        { label: 'Move', value: 'Use left/right movement keys or the active touch controls.' },
        { label: 'Jump / wall jump', value: 'Jump near walls and keep holding toward the wall for controlled rebounds.' },
        { label: 'Slide / dive', value: 'Use the slide or down input to pass low gaps and convert speed into distance.' },
      ],
      tips: [
        'Start jumps later than you think; early jumps often kill momentum.',
        'For wall jumps, press toward the wall before jumping away so the rebound feels controlled.',
        'Use slide before long gaps to keep speed through the takeoff.',
        'On mobile, expect harder timing; desktop keyboard is better for serious clears.',
      ],
      faqs: [
        {
          question: 'What is the most important OvO technique?',
          answer:
            'Momentum control. Sliding and jumping at the right moment lets you clear gaps that feel impossible with normal jumps.',
        },
        {
          question: 'Can OvO be played on mobile?',
          answer:
            'Yes, but precision sections are easier with a keyboard. Use mobile for casual attempts and desktop for hard clears.',
        },
        {
          question: 'How do I stop getting stuck on the same OvO room?',
          answer:
            'Change only one thing per retry: jump later, slide earlier, or hold the wall longer. Random retries make progress slower.',
        },
      ],
      relatedGuides: [
        {
          slug: 'ovo-walkthrough',
          title: 'OvO walkthrough',
          description: 'A deeper guide to core moves, level habits, and speedrun-style momentum.',
        },
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'More platformers and retry-heavy browser games.',
        },
      ],
    },
    zh: {
      metaTitle: 'OvO 在线玩 - 跑酷操作、蹬墙跳与技巧',
      metaDescription:
        '在线玩 OvO，并查看跑酷操作、俯冲跳、蹬墙跳、手机体验、FAQ 和相关平台游戏攻略。',
      title: 'OvO 快速玩法指南',
      summary:
        'OvO 是一款精准跑酷平台游戏，关键不是狂按跳跃，而是利用惯性、滑铲、蹬墙跳和俯冲跳通过困难房间。多数卡关并不是反应不够快，而是起跳点、贴墙方向或滑铲时机没有稳定下来。',
      overview: [
        '想进步最快，先判断失败原因。如果没跳到平台，通常要看起跳点、滑铲时机，或是在贴墙前是否已经损失速度。',
        '这个页面适合作为游玩时的操作速查。更长的 walkthrough 会讲关卡习惯，但下面这些基本动作已经能解决大多数前期卡点。',
      ],
      howToPlay: [
        '穿过每个房间，避开尖刺和机关，到达出口。',
        '把滑铲、跳跃、蹬墙和俯冲连成一套动作，而不是把每个障碍单独处理。',
        '快速重试，但每次只改一个输入，这样才能知道是哪一步真正起作用。',
      ],
      controls: [
        { label: '移动', value: '使用左右移动键，或当前版本提供的触控按钮。' },
        { label: '跳跃 / 蹬墙跳', value: '靠近墙面时跳跃，并保持朝墙方向输入，让反弹更稳定。' },
        { label: '滑铲 / 俯冲', value: '用下方向或滑铲输入穿过低矮空间，并把速度转化为距离。' },
      ],
      tips: [
        '起跳点通常要比直觉更晚，太早跳会丢失惯性。',
        '蹬墙跳前先朝墙压方向键，再跳离墙面，反弹会更可控。',
        '长距离缺口前先滑铲，保持起跳速度。',
        '手机端能玩，但困难关更适合键盘。',
      ],
      faqs: [
        {
          question: 'OvO 最重要的技巧是什么？',
          answer: '惯性控制。正确时机的滑铲和跳跃，能通过普通跳跃过不去的缺口。',
        },
        {
          question: 'OvO 手机能玩吗？',
          answer: '可以，但精准关卡用键盘更稳定。手机适合随手尝试，困难通关建议用桌面端。',
        },
        {
          question: 'OvO 卡在同一关怎么办？',
          answer: '每次重试只改一个点：晚一点跳、早一点滑，或贴墙时间长一点。随机重试会让进步变慢。',
        },
      ],
      relatedGuides: [
        {
          slug: 'ovo-walkthrough',
          title: 'OvO 跑酷攻略',
          description: '更详细的动作、关卡习惯和惯性技巧说明。',
        },
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的游戏',
          description: '更多平台跳跃和高重试浏览器游戏。',
        },
      ],
    },
  },
  'tunnel-rush': {
    en: {
      metaTitle: 'Tunnel Rush Online - Controls, Reflex Tips and High Score Guide',
      metaDescription:
        'Play Tunnel Rush online with controls, pattern-reading tips, mobile notes, FAQ answers, and related fast browser game guides.',
      title: 'Tunnel Rush quick guide',
      summary:
        'Tunnel Rush is a high-speed reflex game where survival depends on reading shapes early and staying centered before the tunnel speed rises. The strongest runs come from small steering corrections, calm visual focus, and learning repeated obstacle patterns.',
      overview: [
        'New players usually oversteer. The better habit is to make small corrections, keep the next obstacle in peripheral view, and return to center whenever the path opens.',
        'Because runs restart quickly, Tunnel Rush works well as a short-session browser game. Use the tips below to stretch each run without turning it into a download or extension hunt.',
      ],
      howToPlay: [
        'Rotate or move around the tunnel to avoid incoming barriers.',
        'Look past the nearest obstacle so your hands prepare for the next one.',
        'Use short runs to learn recurring shapes before chasing high scores.',
      ],
      controls: [
        { label: 'Steer', value: 'Use left/right arrows or A/D in most browser builds.' },
        { label: 'Restart', value: 'Use the in-game restart after a crash.' },
        { label: 'Mobile', value: 'Touch support can vary; landscape mode usually gives more room.' },
      ],
      tips: [
        'Stay near the center when the path is clear so both directions remain available.',
        'Avoid huge steering swings; small taps recover faster at high speed.',
        'Blink between runs, not during obstacle chains. Eye fatigue is a real score killer.',
        'If the tunnel feels too fast, focus on the outline of the next opening instead of the whole screen.',
      ],
      faqs: [
        {
          question: 'How do I get a higher score in Tunnel Rush?',
          answer:
            'Stay centered, make smaller corrections, and read the next opening before you finish dodging the current obstacle.',
        },
        {
          question: 'Is Tunnel Rush good for short breaks?',
          answer:
            'Yes. Runs are quick, restart instantly, and do not require account setup or downloads on Luma.',
        },
        {
          question: 'Should I use keyboard or mobile controls?',
          answer:
            'Keyboard is usually more precise. Mobile can work for casual runs if the touch controls and screen orientation feel comfortable.',
        },
      ],
      relatedGuides: [
        {
          slug: 'tunnel-rush-unblocked',
          title: 'Tunnel Rush guide',
          description: 'More high-score tips and pattern-reading advice.',
        },
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'Other quick-retry games for reflex and precision practice.',
        },
      ],
    },
    zh: {
      metaTitle: 'Tunnel Rush 在线玩 - 操作、反应技巧与高分指南',
      metaDescription:
        '在线玩 Tunnel Rush，查看操作、图形预判、高分技巧、手机体验、FAQ 和相关快节奏浏览器游戏指南。',
      title: 'Tunnel Rush 快速玩法指南',
      summary:
        'Tunnel Rush 是高速反应类游戏，能活多久取决于你是否提前读出障碍形状，并在隧道加速前保持居中位置。高手并不是一直大幅转向，而是用小幅修正、稳定视线和对重复障碍的记忆延长每一局。',
      overview: [
        '新手常见问题是转向过猛。更稳的习惯是小幅修正，用余光看下一个障碍，并在路径变宽时回到中心。',
        '因为失败后能很快重开，Tunnel Rush 很适合短时间浏览器游玩。下面的技巧可以帮你延长每一局，同时不需要下载或安装插件。',
      ],
      howToPlay: [
        '在隧道中左右移动或旋转，避开迎面而来的障碍。',
        '不要只盯最近的障碍，视线要提前看到下一个开口。',
        '先用短局熟悉常见形状，再尝试冲击高分。',
      ],
      controls: [
        { label: '转向', value: '大多数浏览器版本使用左右方向键或 A/D。' },
        { label: '重新开始', value: '撞到障碍后使用游戏内重开。' },
        { label: '手机端', value: '触控支持可能不同，横屏通常有更好的操作空间。' },
      ],
      tips: [
        '路径清楚时尽量回到中心，这样左右两边都有反应空间。',
        '不要大幅甩动方向，速度变快后小幅短按更容易恢复。',
        '眨眼和休息放在两局之间，不要在连续障碍中分神。',
        '觉得画面太快时，只看下一个开口的轮廓，不要试图看完整屏。',
      ],
      faqs: [
        {
          question: 'Tunnel Rush 怎么拿更高分？',
          answer: '保持居中、小幅修正，并在躲过当前障碍前就读出下一个开口。',
        },
        {
          question: 'Tunnel Rush 适合短休息吗？',
          answer: '适合。单局短、重开快，在 Luma 上不需要账号或下载。',
        },
        {
          question: 'Tunnel Rush 用键盘还是手机更好？',
          answer: '键盘通常更精准。手机适合随手玩，但要先确认触控和屏幕方向是否舒服。',
        },
      ],
      relatedGuides: [
        {
          slug: 'tunnel-rush-unblocked',
          title: 'Tunnel Rush 指南',
          description: '更详细的高分和图形预判建议。',
        },
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的游戏',
          description: '更多适合练反应和精准操作的高重试游戏。',
        },
      ],
    },
  },
  'apple-knight-mini-dungeons': {
    en: {
      metaTitle: 'Apple Knight Mini Dungeons - Controls, Tips and Browser Guide',
      metaDescription:
        'Play Apple Knight Mini Dungeons online with movement controls, combat tips, dungeon habits, mobile notes, FAQs, and related guides.',
      title: 'Apple Knight Mini Dungeons quick guide',
      summary:
        'Apple Knight Mini Dungeons is a compact action platformer about patient movement, short attack windows, and checking corners before rushing into a room.',
      overview: [
        'The game rewards careful platforming more than button mashing. Enter each room slowly, watch enemy patrols, and use jumps to create space before attacking.',
        'Use this guide while playing the browser build: the goal is to understand the control rhythm, avoid needless health loss, and decide when keyboard play is better than mobile touch controls.',
      ],
      howToPlay: [
        'Move through dungeon rooms, collect items, avoid hazards, and defeat enemies when the opening is safe.',
        'Jump before attacking when an enemy is close so you do not trade damage unnecessarily.',
        'Pause at doorways and ledges to read traps before committing to a jump.',
      ],
      controls: [
        { label: 'Move', value: 'Use keyboard movement keys or the active touch controls.' },
        { label: 'Jump', value: 'Jump to cross gaps, dodge enemies, and create attack space.' },
        { label: 'Attack', value: 'Use the attack input only when you have room to recover.' },
      ],
      tips: [
        'Do not sprint into new rooms; the first trap is often near the entrance.',
        'Fight from platforms or ledges when possible so enemies approach in predictable paths.',
        'If touch buttons feel cramped, switch to desktop keyboard before a longer run.',
        'Keep health by avoiding unnecessary trades; clearing slowly is faster than restarting.',
      ],
      faqs: [
        {
          question: 'Is Apple Knight Mini Dungeons hard?',
          answer:
            'It is fair but punishing if you rush. Most deaths come from entering rooms too quickly or attacking without space.',
        },
        {
          question: 'Can I play Apple Knight Mini Dungeons on mobile?',
          answer:
            'Mobile can work, but keyboard controls are more reliable for platforming and combat timing.',
        },
        {
          question: 'Do I need to install anything?',
          answer:
            'No. Play in the browser and avoid pages that offer APKs, installers, or unofficial downloads.',
        },
      ],
      relatedGuides: [
        {
          slug: 'apple-knight-mini-dungeons-guide',
          title: 'Apple Knight Mini Dungeons guide',
          description: 'A deeper walkthrough for controls, combat, and dungeon survival habits.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'More quick browser games for short sessions.',
        },
      ],
    },
    zh: {
      metaTitle: 'Apple Knight Mini Dungeons 在线玩 - 操作、战斗技巧与浏览器指南',
      metaDescription:
        '在线玩 Apple Knight Mini Dungeons，查看移动操作、战斗技巧、地牢习惯、手机体验、FAQ 和相关攻略。',
      title: 'Apple Knight Mini Dungeons 快速玩法指南',
      summary:
        'Apple Knight Mini Dungeons 是紧凑的动作平台游戏，重点在耐心移动、抓住短暂攻击窗口，并在冲进房间前先观察角落。',
      overview: [
        '这款游戏奖励谨慎的平台移动，而不是乱按攻击。进入每个房间前先放慢速度，看清敌人巡逻路线，再用跳跃拉开距离后攻击。',
        '这个指南适合在浏览器版旁边参考：目标是掌握操作节奏、减少无谓掉血，并判断什么时候桌面键盘比手机触控更合适。',
      ],
      howToPlay: [
        '穿过地牢房间，收集道具，避开陷阱，并在安全窗口击败敌人。',
        '敌人靠近时先跳跃拉开距离，再攻击，避免无意义换血。',
        '到门口或平台边缘先停一下，看清陷阱后再跳。',
      ],
      controls: [
        { label: '移动', value: '使用键盘移动键，或当前版本提供的触控按钮。' },
        { label: '跳跃', value: '用于跨越缺口、躲避敌人，并创造攻击空间。' },
        { label: '攻击', value: '只有在有撤退空间时再攻击。' },
      ],
      tips: [
        '不要直接冲进新房间，第一个陷阱经常就在入口附近。',
        '尽量站在平台或边缘处理敌人，让敌人的接近路线更可预测。',
        '如果手机虚拟按钮拥挤，长时间游玩前换成桌面键盘。',
        '慢一点清关比反复重开更快，重点是减少不必要换血。',
      ],
      faqs: [
        {
          question: 'Apple Knight Mini Dungeons 难吗？',
          answer: '难度公平，但急躁会被惩罚。大多数失败来自进房间太快，或没有空间就攻击。',
        },
        {
          question: 'Apple Knight Mini Dungeons 手机能玩吗？',
          answer: '可以尝试，但平台跳跃和战斗时机用键盘更可靠。',
        },
        {
          question: '需要安装 Apple Knight Mini Dungeons 吗？',
          answer: '不需要。直接在浏览器中玩，避开 APK、安装器和不明下载页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'apple-knight-mini-dungeons-guide',
          title: 'Apple Knight Mini Dungeons 攻略',
          description: '更详细的操作、战斗和地牢生存习惯说明。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '更多适合短时间打开的游戏。',
        },
      ],
    },
  },
};

export function getGameEditorialContent(slug: string | null | undefined, locale: string): GameEditorialLocaleContent | null {
  const normalized = (slug ?? '').trim().toLowerCase();
  const content = GAME_EDITORIAL_CONTENT[normalized];
  if (!content) return null;
  return locale === 'zh' ? content.zh : content.en;
}

export function getGameEditorialDescription(slug: string | null | undefined, locale: Locale): string | null {
  return getGameEditorialContent(slug, locale)?.summary ?? null;
}
