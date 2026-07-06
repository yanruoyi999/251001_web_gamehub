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
  'big-tower-tiny-square': {
    en: {
      metaTitle: 'Big Tower Tiny Square Online - Controls, Double Jump and Tips',
      metaDescription:
        'Play Big Tower Tiny Square online with double-jump controls, tower climbing tips, spike and laser advice, FAQs, and related platformer guides.',
      title: 'Big Tower Tiny Square quick guide',
      summary:
        'Big Tower Tiny Square is a precision platformer about patient climbing, double-jump timing, and learning each hazard pattern before committing. The tower looks simple, but every spike, laser, and moving platform asks for controlled jumps instead of rushing.',
      overview: [
        'The useful mindset is to treat every room as a rhythm test. Watch a laser cycle, test one jump arc, and use checkpoints as practice points rather than proof that you failed.',
        'This detail page gives the compact version of the walkthrough: what the controls do, when to save the double jump, and how to stop losing runs to panic movement.',
      ],
      howToPlay: [
        'Climb upward through the tower, avoid spikes, lasers, and moving hazards, and reach the next checkpoint.',
        'Use the first jump to set direction and save the second jump until the gap or obstacle actually demands it.',
        'Pause near safe ledges to read the next cycle before moving into a trap-heavy section.',
      ],
      controls: [
        { label: 'Move', value: 'Use the arrow keys or WASD in most browser builds.' },
        { label: 'Jump / double jump', value: 'Press jump once from the ground, then press again in mid-air when you need extra height or distance.' },
        { label: 'Retry from checkpoint', value: 'After a mistake, restart from the latest checkpoint and adjust only one timing detail.' },
      ],
      tips: [
        'Save the second jump until the top of the arc; using it too early makes long gaps feel impossible.',
        'For lasers and fireballs, watch one full cycle before committing to a route.',
        'Small hops matter. Some narrow ledges are easier with a short tap than a full-height jump.',
        'If a room keeps beating you, slow down and solve the first obstacle cleanly before worrying about the exit.',
      ],
      faqs: [
        {
          question: 'How do you double jump in Big Tower Tiny Square?',
          answer:
            'Press jump again while in the air. The safest timing is often near the top of your first jump, not immediately after takeoff.',
        },
        {
          question: 'Why is Big Tower Tiny Square so hard?',
          answer:
            'The controls are simple, but the tower tests timing and patience. Most hard rooms are pattern checks, not random traps.',
        },
        {
          question: 'Is Big Tower Tiny Square better on keyboard or mobile?',
          answer:
            'Keyboard is more reliable for precise double jumps. Mobile may work for casual attempts, but difficult rooms are easier on desktop.',
        },
      ],
      relatedGuides: [
        {
          slug: 'big-tower-tiny-square-walkthrough',
          title: 'Big Tower Tiny Square walkthrough',
          description: 'A deeper guide to double jumps, spike rooms, lasers, and tower checkpoints.',
        },
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'More precision platformers and quick-retry browser challenges.',
        },
      ],
    },
    zh: {
      metaTitle: 'Big Tower Tiny Square 在线玩 - 二段跳、爬塔操作与技巧',
      metaDescription:
        '在线玩 Big Tower Tiny Square，查看二段跳操作、爬塔技巧、尖刺与激光应对、FAQ 和相关平台游戏攻略。',
      title: 'Big Tower Tiny Square 快速玩法指南',
      summary:
        'Big Tower Tiny Square 是一款精准平台游戏，核心在耐心爬塔、二段跳时机，以及行动前读懂每个陷阱规律。高塔看起来简单，但每处尖刺、激光和移动平台都要求玩家控制跳跃，而不是盲目冲刺。',
      overview: [
        '更有效的思路是把每个房间当成节奏测试。先看一轮激光，试一次跳跃弧线，把存档点当成练习点，而不是失败证明。',
        '这个详情页提供精简版攻略：操作怎么用、什么时候保留二段跳，以及如何避免因为慌乱移动而连续失误。',
      ],
      howToPlay: [
        '一路向上爬塔，避开尖刺、激光和移动机关，到达下一个存档点。',
        '第一次跳跃用来确定方向，第二段跳留到缺口或障碍真正需要时再用。',
        '在安全平台边缘先停一下，读清下一段机关节奏再行动。',
      ],
      controls: [
        { label: '移动', value: '大多数浏览器版本使用方向键或 WASD。' },
        { label: '跳跃 / 二段跳', value: '地面起跳后，在空中再次按跳跃键获得额外高度或距离。' },
        { label: '从存档点重试', value: '失败后从最近存档点继续，每次只调整一个时机细节。' },
      ],
      tips: [
        '把第二段跳留到第一跳最高点附近，太早使用会让长距离缺口变难。',
        '遇到激光和火球，先看完整一轮循环再走。',
        '小跳很重要。有些窄平台用轻点短跳比满高度跳更稳定。',
        '如果某个房间反复失败，先慢下来解决第一个障碍，再考虑出口。',
      ],
      faqs: [
        {
          question: 'Big Tower Tiny Square 怎么二段跳？',
          answer: '空中再按一次跳跃键即可。最稳的时机通常是在第一跳接近最高点时，而不是刚起跳就按。',
        },
        {
          question: 'Big Tower Tiny Square 为什么这么难？',
          answer: '操作很简单，但关卡考的是时机和耐心。多数困难房间是规律测试，不是随机陷阱。',
        },
        {
          question: 'Big Tower Tiny Square 用键盘还是手机更好？',
          answer: '精准二段跳更适合键盘。手机可以随手玩，但困难房间更建议用桌面端。',
        },
      ],
      relatedGuides: [
        {
          slug: 'big-tower-tiny-square-walkthrough',
          title: 'Big Tower Tiny Square 攻略',
          description: '更详细的二段跳、尖刺房、激光和存档点打法。',
        },
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的游戏',
          description: '更多精准平台和快速重试浏览器挑战。',
        },
      ],
    },
  },
  'g-switch-3': {
    en: {
      metaTitle: 'G-Switch 3 Online - Gravity Controls and Multiplayer Tips',
      metaDescription:
        'Play G-Switch 3 online with gravity-flip controls, multiplayer notes, survival tips, FAQ answers, and related reflex game guides.',
      title: 'G-Switch 3 quick guide',
      summary:
        'G-Switch 3 is a gravity-flipping runner where one input changes everything. You survive by flipping at the last safe moment, reading both the floor and ceiling, and staying calm as the speed climbs.',
      overview: [
        'The game looks like a one-button runner, but good runs are about restraint. Early flips usually drop you into the next hazard, while late, deliberate flips keep more options open.',
        'Use this page to review the core mechanic before playing solo or local multiplayer. The goal is not to press faster, but to stop panic-flipping when the tunnel gets crowded.',
      ],
      howToPlay: [
        'Run automatically through the stage while hazards appear on the floor and ceiling.',
        'Flip gravity to move between surfaces and pass through open gaps.',
        'In multiplayer, each player uses one assigned key; the last runner alive wins.',
      ],
      controls: [
        { label: 'Flip gravity', value: 'Click, tap, or press the assigned key to switch between floor and ceiling.' },
        { label: 'Multiplayer keys', value: 'Each local player uses one key, depending on the in-game setup screen.' },
        { label: 'Restart', value: 'Use the in-game restart after everyone crashes or a solo run ends.' },
      ],
      tips: [
        'Flip late. If you switch too early, the next saw or gap often has more time to catch you.',
        'Read both surfaces before every flip, not only the lane you are currently running on.',
        'Quick double-flips can skip a hazard and return you to the same side.',
        'In multiplayer, do not copy another player blindly; their lane timing may not match yours.',
      ],
      faqs: [
        {
          question: 'How do you play G-Switch 3?',
          answer:
            'Use one input to flip gravity between the floor and ceiling. The skill is choosing the last safe moment to flip through hazards.',
        },
        {
          question: 'Does G-Switch 3 have multiplayer?',
          answer:
            'Yes. It supports local multiplayer with several players sharing one keyboard, each using a single key.',
        },
        {
          question: 'Is G-Switch 3 safe to play without downloads?',
          answer:
            'Yes on Luma. Use the browser player and avoid pages that ask for installers, extensions, or unrelated permissions.',
        },
      ],
      relatedGuides: [
        {
          slug: 'g-switch-3',
          title: 'G-Switch 3 guide',
          description: 'A deeper guide to controls, multiplayer setup, and survival timing.',
        },
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'Fast movement games with precision and retry-heavy loops.',
        },
      ],
    },
    zh: {
      metaTitle: 'G-Switch 3 在线玩 - 重力翻转操作与多人技巧',
      metaDescription:
        '在线玩 G-Switch 3，查看重力翻转操作、多人模式说明、生存技巧、FAQ 和相关反应类游戏攻略。',
      title: 'G-Switch 3 快速玩法指南',
      summary:
        'G-Switch 3 是一款重力翻转跑酷，一个输入就会改变全部路线。想活得更久，关键是等到最后安全时刻再翻转，同时读清地面和天花板，并在速度提升后保持冷静。',
      overview: [
        '它看起来像一键跑酷，但好成绩来自克制。太早翻转经常会掉进下一个危险，晚一点、稳一点的翻转才能保留更多选择。',
        '这个页面适合单人或本地多人开始前快速复习机制。重点不是按得更快，而是在画面变密集时少做慌乱翻转。',
      ],
      howToPlay: [
        '角色会自动前进，地面和天花板上会出现锯齿、缺口等障碍。',
        '通过翻转重力在两侧表面之间切换，从开口处通过。',
        '多人模式中，每个玩家使用一个指定按键，活到最后者胜。',
      ],
      controls: [
        { label: '翻转重力', value: '点击、触控或按下分配按键，在地面和天花板之间切换。' },
        { label: '多人按键', value: '本地每个玩家使用一个键，具体按键以游戏内设置为准。' },
        { label: '重新开始', value: '全员失败或单人结束后，使用游戏内重开。' },
      ],
      tips: [
        '晚一点翻。太早切换时，下一个锯齿或缺口有更多时间追上你。',
        '每次翻转前读清两侧表面，不要只看当前正在跑的一边。',
        '快速双翻可以跳过一个危险后回到原来的表面。',
        '多人时不要盲目模仿别人，因为他的节奏不一定适合你的位置。',
      ],
      faqs: [
        {
          question: 'G-Switch 3 怎么玩？',
          answer: '用一个输入在地面和天花板之间翻转重力。核心技巧是在最后安全一刻完成翻转。',
        },
        {
          question: 'G-Switch 3 有多人模式吗？',
          answer: '有。它支持本地多人共用一个键盘，每个玩家只用一个按键。',
        },
        {
          question: 'G-Switch 3 可以不下载玩吗？',
          answer: '可以。在 Luma 使用浏览器播放器即可，避开要求安装器、扩展或无关权限的页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'g-switch-3',
          title: 'G-Switch 3 攻略',
          description: '更详细的操作、多人设置和生存时机说明。',
        },
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的游戏',
          description: '更多快节奏移动和高重试浏览器游戏。',
        },
      ],
    },
  },
  'fireboy-watergirl-6': {
    en: {
      metaTitle: 'Fireboy and Watergirl 6 Online - Controls and Co-op Tips',
      metaDescription:
        'Play Fireboy and Watergirl 6 online with two-player controls, element rules, co-op puzzle tips, FAQ answers, and related browser game guides.',
      title: 'Fireboy and Watergirl 6 quick guide',
      summary:
        'Fireboy and Watergirl 6 is a co-op puzzle platformer built around two characters with different hazards. The best clears come from planning who holds a switch, who moves first, and how both players reach their doors safely.',
      overview: [
        'The central rule is simple: Fireboy handles fire, Watergirl handles water, and green hazards are unsafe for both. Most failed levels come from forgetting that rule while rushing for a switch or diamond.',
        'This page is for quick browser play with a partner or solo control. Review the controls, decide the order of each puzzle step, then use the related guide when a level needs a deeper walkthrough.',
      ],
      howToPlay: [
        'Guide Fireboy and Watergirl through the level, collecting matching diamonds when safe.',
        'Use switches, buttons, and platforms so one character can open a route for the other.',
        'Finish only when both characters reach their matching exits.',
      ],
      controls: [
        { label: 'Fireboy', value: 'Use A, W, and D for movement in most versions.' },
        { label: 'Watergirl', value: 'Use the left, up, and right arrow keys.' },
        { label: 'Solo play', value: 'Control one character at a time and switch attention as the puzzle requires.' },
      ],
      tips: [
        'Before moving, identify which pool is safe for each character and which hazards are unsafe for both.',
        'Let one character hold a button while the other crosses, then plan how to reunite them.',
        'Do not collect a diamond if it strands the wrong character on the wrong side of a gate.',
        'Solo players should move in short steps instead of sending one character too far ahead.',
      ],
      faqs: [
        {
          question: 'Can Fireboy and Watergirl 6 be played solo?',
          answer:
            'Yes. You can control both characters yourself, but it is slower than playing with a partner because many puzzles need back-and-forth switching.',
        },
        {
          question: 'What hazards kill each character?',
          answer:
            'Fireboy is safe in fire and unsafe in water. Watergirl is safe in water and unsafe in fire. Green hazards are unsafe for both.',
        },
        {
          question: 'Is Fireboy and Watergirl 6 a download game?',
          answer:
            'No. Use the browser player on Luma and avoid unofficial installers, APKs, or extension prompts.',
        },
      ],
      relatedGuides: [
        {
          slug: 'fireboy-and-watergirl-walkthrough',
          title: 'Fireboy and Watergirl walkthrough',
          description: 'A deeper co-op guide to controls, element rules, and puzzle order.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'Short browser games when you want a lighter session.',
        },
      ],
    },
    zh: {
      metaTitle: 'Fireboy and Watergirl 6 在线玩 - 双人操作与合作技巧',
      metaDescription:
        '在线玩 Fireboy and Watergirl 6，查看双人操作、元素规则、合作解谜技巧、FAQ 和相关浏览器游戏攻略。',
      title: 'Fireboy and Watergirl 6 快速玩法指南',
      summary:
        'Fireboy and Watergirl 6 是双人合作解谜平台游戏，两个角色面对不同元素危险。更稳的通关方式是先规划谁踩开关、谁先移动，以及两名角色如何安全到达各自出口。',
      overview: [
        '核心规则很简单：Fireboy 适合火，Watergirl 适合水，绿色危险两个都不能碰。大多数失败来自赶着踩开关或拿钻石时忘了这条规则。',
        '这个页面适合和朋友一起玩，也适合单人控制双角色。先确认操作和步骤顺序，再在卡关时进入相关攻略看更细的合作思路。',
      ],
      howToPlay: [
        '控制 Fireboy 和 Watergirl 穿过关卡，在安全时收集对应颜色钻石。',
        '使用开关、按钮和平台，让一个角色为另一个角色打开路线。',
        '只有两个角色都到达对应出口，关卡才算完成。',
      ],
      controls: [
        { label: 'Fireboy', value: '大多数版本使用 A、W、D 移动。' },
        { label: 'Watergirl', value: '使用左、上、右方向键移动。' },
        { label: '单人玩法', value: '一次关注一个角色，根据谜题需要来回切换。' },
      ],
      tips: [
        '行动前先判断哪个水池适合哪个角色，以及哪些危险两个角色都不能碰。',
        '一个角色踩住按钮，另一个角色通过，然后再规划两人如何会合。',
        '如果拿钻石会把错误角色困在门后，就先不要拿。',
        '单人操作时分短步骤推进，不要让一个角色跑得太远。',
      ],
      faqs: [
        {
          question: 'Fireboy and Watergirl 6 可以单人玩吗？',
          answer: '可以。你能一个人控制两个角色，但会比双人更慢，因为很多谜题需要来回切换。',
        },
        {
          question: 'Fireboy 和 Watergirl 分别怕什么？',
          answer: 'Fireboy 可以碰火但怕水，Watergirl 可以碰水但怕火，绿色危险两个角色都不能碰。',
        },
        {
          question: 'Fireboy and Watergirl 6 需要下载吗？',
          answer: '不需要。在 Luma 使用浏览器播放器即可，避开不明安装器、APK 或扩展提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'fireboy-and-watergirl-walkthrough',
          title: 'Fireboy and Watergirl 攻略',
          description: '更详细的双人操作、元素规则和关卡步骤说明。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '想玩轻一点时可切换的短局游戏清单。',
        },
      ],
    },
  },
  'monkey-mart': {
    en: {
      metaTitle: 'Monkey Mart Online - Unlock Order, Recipes and Tips',
      metaDescription:
        'Play Monkey Mart online with unlock order advice, appliance recipe notes, earning tips, FAQ answers, and related browser game guides.',
      title: 'Monkey Mart quick guide',
      summary:
        'Monkey Mart is an idle management game where stocking shelves is only the start. Growth gets faster when you unlock helpers, process basic crops into better goods, and keep the highest-value shelves filled before queues build up.',
      overview: [
        'The early game feels simple: harvest bananas, stock shelves, and collect money. The real decision is what to buy next, because workers and appliances change how quickly the mart can run without constant manual movement.',
        'Use this page while playing the browser version to keep the priority clear: automate the repetitive jobs first, then expand into products that sell for more.',
      ],
      howToPlay: [
        'Harvest crops and place products on shelves so customers can buy them.',
        'Collect money and reinvest it into aisles, appliances, upgrades, and helpers.',
        'Open new sections only when the current mart can stay stocked without constant rushing.',
      ],
      controls: [
        { label: 'Move', value: 'Use keyboard movement keys or the active touch controls.' },
        { label: 'Collect / stock', value: 'Walk into crops, shelves, stations, and cash areas to interact automatically.' },
        { label: 'Upgrade', value: 'Step onto upgrade zones when you have enough money.' },
      ],
      tips: [
        'Hire helpers early so your own movement is spent on decisions, not repetitive stocking.',
        'Appliances matter because processed goods earn more than raw crops.',
        'Upgrade movement and carrying capacity when walking time becomes the bottleneck.',
        'Restock the most valuable shelves first when customers start queueing.',
      ],
      faqs: [
        {
          question: 'What should I unlock first in Monkey Mart?',
          answer:
            'Prioritize helpers and appliance paths that create higher-value goods. Pure expansion is weaker if you cannot keep shelves stocked.',
        },
        {
          question: 'Does Monkey Mart have promo codes?',
          answer:
            'No. Progress comes from unlocking aisles, appliances, workers, and upgrades rather than entering codes.',
        },
        {
          question: 'Can Monkey Mart be played without installing an app?',
          answer:
            'Yes. Use the browser player and avoid third-party APK or installer pages.',
        },
      ],
      relatedGuides: [
        {
          slug: 'monkey-mart-guide',
          title: 'Monkey Mart guide',
          description: 'A deeper guide to unlock order, recipes, helpers, and earning faster.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'More browser games for a relaxed short session.',
        },
      ],
    },
    zh: {
      metaTitle: 'Monkey Mart 在线玩 - 解锁顺序、配方与赚钱技巧',
      metaDescription:
        '在线玩 Monkey Mart，查看解锁顺序、器械配方、赚钱技巧、FAQ 和相关浏览器游戏攻略。',
      title: 'Monkey Mart 快速玩法指南',
      summary:
        'Monkey Mart 是放置经营游戏，上货架只是开始。想让超市成长更快，要尽早解锁帮手，把基础作物加工成更高价商品，并在顾客排队前优先补满高价值货架。',
      overview: [
        '前期看起来很简单：收香蕉、补货架、收钱。真正重要的是下一笔钱买什么，因为员工和器械会决定超市能否脱离手动奔跑也稳定运转。',
        '这个页面适合边玩浏览器版边参考，核心优先级很明确：先自动化重复工作，再扩展到卖价更高的商品。',
      ],
      howToPlay: [
        '收获作物并把商品放上货架，让顾客购买。',
        '收钱后投入货道、器械、升级和帮手。',
        '只有当前超市能稳定补货时，再开启新的区域。',
      ],
      controls: [
        { label: '移动', value: '使用键盘移动键，或当前版本提供的触控按钮。' },
        { label: '收集 / 补货', value: '走到作物、货架、加工台和收银区附近即可自动互动。' },
        { label: '升级', value: '钱足够时走到升级区域购买。' },
      ],
      tips: [
        '尽早雇帮手，让你的移动用于决策，而不是重复补货。',
        '器械很重要，因为加工品比原始作物更赚钱。',
        '当走路时间变成瓶颈时，升级移动速度和携带容量。',
        '顾客排队时先补最高价值货架。',
      ],
      faqs: [
        {
          question: 'Monkey Mart 先解锁什么最好？',
          answer: '优先解锁帮手和能产出高价值商品的器械路线。如果货架补不上，单纯扩张效果会很弱。',
        },
        {
          question: 'Monkey Mart 有兑换码吗？',
          answer: '没有。进度来自解锁货道、器械、员工和升级，而不是输入兑换码。',
        },
        {
          question: 'Monkey Mart 需要安装 App 吗？',
          answer: '不需要。使用浏览器播放器即可，避开第三方 APK 或安装页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'monkey-mart-guide',
          title: 'Monkey Mart 攻略',
          description: '更详细的解锁顺序、配方、员工和快速赚钱说明。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '更多适合轻松短局的浏览器游戏。',
        },
      ],
    },
  },
  dadish: {
    en: {
      metaTitle: 'Dadish Online - Controls, Platforming Tips and Safe Browser Play',
      metaDescription:
        'Play Dadish online with platforming controls, jump timing tips, mobile notes, FAQ answers, and related browser platformer guides.',
      title: 'Dadish quick guide',
      summary:
        'Dadish is a compact platform adventure where the safest route is usually the cleanest one. Good runs come from reading enemy movement, keeping jumps simple, and resisting the urge to rush through food-themed hazards.',
      overview: [
        'Dadish looks playful, but the level design still rewards careful platforming. Watch the first cycle of a moving enemy, check where the safe ledge is, and jump only when you know how to land.',
        'This page is built for quick browser play. Use it to learn the control rhythm, then switch to a deeper platformer guide or related game when you want harder precision challenges.',
      ],
      howToPlay: [
        'Move through each stage, avoid enemies and hazards, and reach the end of the level.',
        'Use short jumps for small platforms and save full jumps for wider gaps.',
        'Treat enemies as moving obstacles first; only pass when their cycle leaves a clean route.',
      ],
      controls: [
        { label: 'Move', value: 'Use arrow keys, WASD, or the active touch controls.' },
        { label: 'Jump', value: 'Press jump to cross gaps and avoid hazards; hold longer only when you need full height.' },
        { label: 'Restart', value: 'Use the in-game restart after a bad route or missed jump.' },
      ],
      tips: [
        'Do not jump as soon as a platform appears. Check the landing area first.',
        'Small taps help on narrow platforms where full jumps overshoot.',
        'If mobile touch controls feel cramped, use keyboard for longer sessions.',
        'When stuck, slow down and learn the enemy cycle instead of rushing another attempt.',
      ],
      faqs: [
        {
          question: 'Is Dadish difficult?',
          answer:
            'Dadish is approachable, but later stages still require timing. Most mistakes come from rushing jumps or not reading enemy movement.',
        },
        {
          question: 'Can I play Dadish on mobile?',
          answer:
            'Mobile can work, but platform jumps are usually cleaner on keyboard. Test one level before a longer session.',
        },
        {
          question: 'Does Dadish need a download?',
          answer:
            'No. Play in the browser on Luma and avoid pages that ask for APKs, installers, or extensions.',
        },
      ],
      relatedGuides: [
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'More platformers when you want tougher movement and faster retries.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'Short games for a quick, low-setup session.',
        },
      ],
    },
    zh: {
      metaTitle: 'Dadish 在线玩 - 平台跳跃操作、技巧与安全浏览器玩法',
      metaDescription:
        '在线玩 Dadish，查看平台跳跃操作、跳跃时机、手机体验、FAQ 和相关浏览器平台游戏攻略。',
      title: 'Dadish 快速玩法指南',
      summary:
        'Dadish 是紧凑的平台冒险游戏，最安全的路线通常也是最干净的路线。稳定通关来自读清敌人移动、保持跳跃简单，并克制自己不要急着冲过食物主题陷阱。',
      overview: [
        'Dadish 看起来轻松可爱，但关卡设计仍然奖励谨慎的平台操作。先观察移动敌人的第一轮节奏，确认安全落点，再决定什么时候跳。',
        '这个页面面向快速浏览器游玩。先用它掌握操作节奏，如果想要更难的精准挑战，再跳到相关平台游戏或专题攻略。',
      ],
      howToPlay: [
        '穿过每个关卡，避开敌人和陷阱，到达终点。',
        '小平台用短跳，较宽缺口再使用完整跳跃。',
        '先把敌人当成移动障碍，等路线清楚时再通过。',
      ],
      controls: [
        { label: '移动', value: '使用方向键、WASD，或当前版本提供的触控按钮。' },
        { label: '跳跃', value: '按跳跃键跨越缺口或躲避危险；只有需要满高度时才长按。' },
        { label: '重新开始', value: '路线失误或跳跃失败后，使用游戏内重开。' },
      ],
      tips: [
        '不要一看到平台就跳，先确认落点是否安全。',
        '窄平台更适合轻点短跳，满高度跳容易越过头。',
        '如果手机触控按钮拥挤，长时间游玩建议换键盘。',
        '卡关时放慢节奏，先学敌人循环，而不是急着再试一次。',
      ],
      faqs: [
        {
          question: 'Dadish 难吗？',
          answer: 'Dadish 上手不难，但后期仍然考时机。多数失误来自跳太急，或没有观察敌人移动。',
        },
        {
          question: 'Dadish 手机能玩吗？',
          answer: '可以尝试，但平台跳跃通常用键盘更干净。建议先试玩一关再决定是否长时间玩。',
        },
        {
          question: 'Dadish 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩，避开 APK、安装器或扩展提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的游戏',
          description: '想要更难移动和更快重试时可玩的平台游戏。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '适合快速打开、低设置成本的短局游戏。',
        },
      ],
    },
  },
  'adam-and-eve-4': {
    en: {
      metaTitle: 'Adam and Eve 4 Online - Puzzle Controls, Walkthrough Tips and Safe Play',
      metaDescription:
        'Play Adam and Eve 4 online with point-and-click controls, puzzle solving tips, FAQ answers, no-download safety notes, and related browser game guides.',
      title: 'Adam and Eve 4 quick guide',
      summary:
        'Adam and Eve 4 is a light point-and-click puzzle adventure where progress comes from reading the scene before clicking. The best approach is to test objects in order, notice what changes, and avoid random clicking that makes the puzzle harder to understand.',
      overview: [
        'Each screen is a small cause-and-effect puzzle. A branch, animal, lever, or hidden object usually changes the path only after another object has been used first, so slow observation beats fast clicking.',
        'Use this page while playing the browser version: start the scene, check what blocks Adam, then return to the tips when a chain reaction or hidden item is not obvious.',
      ],
      howToPlay: [
        'Click objects in the scene to discover what can move, open, scare, lift, or reveal a path.',
        'Watch the animation after every click, because one small change often unlocks the next object.',
        'Move Adam forward only after the route is clear and the visible hazard has been handled.',
      ],
      controls: [
        { label: 'Interact', value: 'Use the mouse or tap to click objects, levers, and scene details.' },
        { label: 'Observe', value: 'Wait for each animation to finish before clicking the next object.' },
        { label: 'Restart scene', value: 'Use the in-game restart if an action order no longer makes sense.' },
      ],
      tips: [
        'Click the obstacle first, then look for the object that could change it.',
        'If nothing responds, scan the corners and background instead of repeatedly clicking the same item.',
        'Many puzzles are ordered chains: one object reveals the next, so remember the last visible change.',
        'On mobile, tap slowly enough that you can see which object actually responded.',
      ],
      faqs: [
        {
          question: 'How do you solve Adam and Eve 4 puzzles faster?',
          answer:
            'Treat each scene as a chain. Identify the blocked path, test nearby objects once, then follow the animation to the next interactive item.',
        },
        {
          question: 'Is Adam and Eve 4 good for short sessions?',
          answer:
            'Yes. The scenes are compact, controls are simple, and each puzzle has a natural stopping point.',
        },
        {
          question: 'Does Adam and Eve 4 need a download?',
          answer:
            'No. Play in the browser on Luma and avoid pages that ask for installers, APK files, or browser extensions.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'A broader guide to the point-and-click puzzle pattern across the series.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'More short browser games with simple goals and quick stopping points.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve 4 在线玩 - 点击解谜操作、技巧与安全玩法',
      metaDescription:
        '在线玩 Adam and Eve 4，查看点击解谜操作、通关思路、FAQ、免下载安全说明和相关浏览器游戏攻略。',
      title: 'Adam and Eve 4 快速玩法指南',
      summary:
        'Adam and Eve 4 是轻量点击解谜冒险，进度来自先读懂场景再点击。更稳的做法是按顺序测试物体、观察每次动画变化，而不是随机乱点导致自己看不清谜题逻辑。',
      overview: [
        '每个画面都是一个小型因果谜题。树枝、机关、隐藏物件或挡路元素通常要在另一个物体触发后才会改变，所以慢慢观察比快速乱点更有效。',
        '这个页面适合边玩浏览器版边参考：先看 Adam 被什么挡住，再在连锁反应或隐藏物品不明显时回来对照技巧。',
      ],
      howToPlay: [
        '点击场景中的物体，找出哪些东西能移动、打开、抬起或露出道路。',
        '每次点击后等动画播完，因为一个小变化经常会解锁下一个可点对象。',
        '只有路线清楚、危险处理完后，再让 Adam 前进。',
      ],
      controls: [
        { label: '互动', value: '用鼠标或触控点击物体、机关和场景细节。' },
        { label: '观察', value: '每次动画结束后再点下一个对象。' },
        { label: '重开场景', value: '如果操作顺序混乱，使用游戏内重开。' },
      ],
      tips: [
        '先点击挡路物，再寻找可能改变它的对象。',
        '如果没有反应，扫一遍角落和背景，不要反复点同一个物体。',
        '很多谜题是顺序链条：一个对象露出下一个对象，所以记住上一次变化。',
        '手机端慢一点点，确保看清真正响应的是哪个物体。',
      ],
      faqs: [
        {
          question: 'Adam and Eve 4 怎么更快解谜？',
          answer: '把每个场景当成链条：先找挡路点，每个附近物体测试一次，再跟着动画变化找下一个互动对象。',
        },
        {
          question: 'Adam and Eve 4 适合短时间玩吗？',
          answer: '适合。场景短、操作简单，每个小谜题都有自然停止点。',
        },
        {
          question: 'Adam and Eve 4 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩即可，避开安装器、APK 或浏览器扩展提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '更完整的点击解谜思路和系列玩法说明。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多目标简单、容易停下来的短局浏览器游戏。',
        },
      ],
    },
  },
  'apple-knight': {
    en: {
      metaTitle: 'Apple Knight Online - Platform Controls, Combat Tips and Safe Play',
      metaDescription:
        'Play Apple Knight online with movement controls, combat timing tips, mobile notes, FAQ answers, and related action platformer guides.',
      title: 'Apple Knight quick guide',
      summary:
        'Apple Knight is an action platformer where movement discipline matters as much as attacking. Strong runs come from checking enemy patrols, jumping before contact, and using attacks only when there is enough space to recover.',
      overview: [
        'The game is fast, but rushing into every enemy usually costs health. Read the room first, use jumps to create distance, and only swing when the enemy path is predictable.',
        'This detail page gives a compact control and strategy reference for the browser version, with safer no-download framing and links to deeper platformer guides when you want more help.',
      ],
      howToPlay: [
        'Move through platform stages, avoid hazards, collect items, and defeat enemies when the opening is safe.',
        'Jump to create space before attacking instead of trading damage on the ground.',
        'Use checkpoints and short retries to learn enemy placement without rushing the same mistake.',
      ],
      controls: [
        { label: 'Move', value: 'Use keyboard movement keys or the active touch controls.' },
        { label: 'Jump', value: 'Jump to cross gaps, dodge enemies, and set up safer attacks.' },
        { label: 'Attack', value: 'Use the attack input only when you have room to step back or continue moving.' },
      ],
      tips: [
        'Stop at the edge of a new room long enough to see the first enemy route.',
        'Jump before attacking close enemies so you are not forced into a damage trade.',
        'If touch controls feel cramped, use keyboard for longer runs and tighter combat timing.',
        'Clear slowly when low on health; losing a few seconds is better than restarting.',
      ],
      faqs: [
        {
          question: 'Is Apple Knight hard?',
          answer:
            'It is approachable at first, but it punishes rushing. Careful jumps and patient attacks make the game much easier.',
        },
        {
          question: 'Can Apple Knight be played on mobile?',
          answer:
            'Mobile can work, but keyboard controls are more reliable for platforming and combat timing.',
        },
        {
          question: 'Does Apple Knight need an app install?',
          answer:
            'No. Use the browser player on Luma and avoid third-party APK or installer pages.',
        },
      ],
      relatedGuides: [
        {
          slug: 'apple-knight-mini-dungeons-guide',
          title: 'Apple Knight Mini Dungeons guide',
          description: 'A deeper action-platform guide for dungeon movement and combat habits.',
        },
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'More platformers and quick-retry browser games.',
        },
      ],
    },
    zh: {
      metaTitle: 'Apple Knight 在线玩 - 平台动作操作、战斗技巧与安全玩法',
      metaDescription:
        '在线玩 Apple Knight，查看移动操作、战斗时机、手机体验、FAQ 和相关动作平台游戏攻略。',
      title: 'Apple Knight 快速玩法指南',
      summary:
        'Apple Knight 是动作平台游戏，稳定移动和攻击同样重要。想跑得更远，要先看清敌人巡逻路线，接触前用跳跃拉开距离，并且只在有撤退空间时出手。',
      overview: [
        '游戏节奏很快，但每个敌人都硬冲通常会掉血。先进房间观察路线，用跳跃创造距离，再在敌人行动可预测时攻击。',
        '这个详情页提供浏览器版的简明操作和策略参考，同时保留免下载安全边界，并链接到更深入的平台动作攻略。',
      ],
      howToPlay: [
        '穿过平台关卡，避开陷阱，收集道具，并在安全窗口击败敌人。',
        '靠近敌人前先跳跃拉开空间，不要站在地面硬换血。',
        '利用存档点和短重试熟悉敌人位置，避免反复犯同一个错误。',
      ],
      controls: [
        { label: '移动', value: '使用键盘移动键，或当前版本提供的触控按钮。' },
        { label: '跳跃', value: '跨越缺口、躲避敌人，并为攻击创造安全空间。' },
        { label: '攻击', value: '只有在有后撤或继续移动空间时再攻击。' },
      ],
      tips: [
        '进入新房间前先停在边缘，看清第一个敌人的路线。',
        '近距离敌人先跳再打，避免被迫换血。',
        '如果手机虚拟按钮拥挤，长时间游玩建议用键盘。',
        '低血量时慢慢清理，比多贪几秒后重开更划算。',
      ],
      faqs: [
        {
          question: 'Apple Knight 难吗？',
          answer: '前期容易上手，但急着冲会被惩罚。谨慎跳跃和耐心攻击会让难度低很多。',
        },
        {
          question: 'Apple Knight 手机能玩吗？',
          answer: '可以尝试，但平台跳跃和战斗时机用键盘更可靠。',
        },
        {
          question: 'Apple Knight 需要安装 App 吗？',
          answer: '不需要。在 Luma 浏览器播放器中直接玩，避开第三方 APK 或安装页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'apple-knight-mini-dungeons-guide',
          title: 'Apple Knight Mini Dungeons 攻略',
          description: '更深入的地牢移动和战斗习惯说明。',
        },
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的游戏',
          description: '更多平台跳跃和高重试浏览器游戏。',
        },
      ],
    },
  },
  'dadish-2': {
    en: {
      metaTitle: 'Dadish 2 Online - Controls, Platform Tips and Browser Guide',
      metaDescription:
        'Play Dadish 2 online with platforming controls, timing tips, mobile notes, FAQ answers, and related browser game guides.',
      title: 'Dadish 2 quick guide',
      summary:
        'Dadish 2 builds on the original with tighter platforming and more movement traps. The safest clears come from watching enemy cycles, using short jumps on small platforms, and slowing down whenever the level starts hiding hazards behind momentum.',
      overview: [
        'Compared with the first Dadish, the sequel asks for more patience. You still move and jump with simple controls, but the stages punish rushing into unknown corners.',
        'Use this page as a compact reference while playing the browser version: check the controls, review the timing tips, and keep the session no-download and safe.',
      ],
      howToPlay: [
        'Move through each stage, dodge enemies and traps, and reach the goal without losing your route.',
        'Use smaller jumps when the platform is narrow, and save full jumps for wider gaps.',
        'Study moving hazards for one cycle before attempting the section at speed.',
      ],
      controls: [
        { label: 'Move', value: 'Use arrow keys, WASD, or active touch controls.' },
        { label: 'Jump', value: 'Tap for short hops and hold only when full height is needed.' },
        { label: 'Retry', value: 'Use the in-game restart after a missed route or unsafe jump.' },
      ],
      tips: [
        'Do not let early easy stages teach you to rush; later screens punish blind momentum.',
        'Use short hops on narrow platforms to avoid overshooting the landing.',
        'If an enemy patrol blocks the exit, wait one full cycle and move after it turns.',
        'Desktop keyboard is better for precision if mobile touch buttons feel crowded.',
      ],
      faqs: [
        {
          question: 'Is Dadish 2 harder than Dadish?',
          answer:
            'Yes, it generally asks for tighter timing and more patience, though the basic movement remains simple.',
        },
        {
          question: 'What is the best Dadish 2 habit for new players?',
          answer:
            'Pause before new hazards and watch one cycle. Most mistakes come from jumping before you know the landing.',
        },
        {
          question: 'Does Dadish 2 need a download?',
          answer:
            'No. Play it in the browser on Luma and avoid APK, installer, or extension prompts.',
        },
      ],
      relatedGuides: [
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'More platformers with tighter movement and quick retries.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'Short games for quick sessions when you want a lighter challenge.',
        },
      ],
    },
    zh: {
      metaTitle: 'Dadish 2 在线玩 - 平台跳跃操作、技巧与浏览器指南',
      metaDescription:
        '在线玩 Dadish 2，查看平台跳跃操作、时机技巧、手机体验、FAQ 和相关浏览器游戏攻略。',
      title: 'Dadish 2 快速玩法指南',
      summary:
        'Dadish 2 在原作基础上加入更紧的跳跃和更多移动陷阱。想稳定过关，要观察敌人循环，在小平台使用短跳，并在关卡开始利用惯性隐藏危险时主动放慢速度。',
      overview: [
        '和第一作相比，续作更考耐心。移动和跳跃依然简单，但关卡会惩罚不看角落就直接冲的玩家。',
        '这个页面适合边玩浏览器版边参考：确认操作，复习时机技巧，并保持免下载、安全游玩。',
      ],
      howToPlay: [
        '穿过每个关卡，避开敌人和陷阱，到达终点。',
        '窄平台用短跳，较宽缺口再使用完整跳跃。',
        '移动机关先观察一轮，再按节奏通过。',
      ],
      controls: [
        { label: '移动', value: '使用方向键、WASD，或当前版本提供的触控按钮。' },
        { label: '跳跃', value: '轻点用于短跳，只有需要满高度时才长按。' },
        { label: '重试', value: '路线失误或危险跳跃后，使用游戏内重开。' },
      ],
      tips: [
        '不要因为前几关简单就养成猛冲习惯，后面会惩罚盲目惯性。',
        '窄平台用短跳，避免越过落点。',
        '敌人挡住出口时，先等完整一轮巡逻，再在转身后通过。',
        '如果手机按钮拥挤，精准关更建议用桌面键盘。',
      ],
      faqs: [
        {
          question: 'Dadish 2 比 Dadish 更难吗？',
          answer: '通常更难一些，需要更紧的时机和更多耐心，但基础移动仍然很简单。',
        },
        {
          question: 'Dadish 2 新手最重要的习惯是什么？',
          answer: '新危险前先停一下看一轮。多数失误来自还没确认落点就起跳。',
        },
        {
          question: 'Dadish 2 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩，避开 APK、安装器或扩展提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的游戏',
          description: '更多移动更紧、重试更快的平台游戏。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '想轻一点时可玩的短局游戏。',
        },
      ],
    },
  },
  'blumgi-ball': {
    en: {
      metaTitle: 'Blumgi Ball Online - Aim, Dunk Controls and Puzzle Tips',
      metaDescription:
        'Play Blumgi Ball online with aiming controls, dunk puzzle tips, bounce advice, FAQ answers, and related browser game guides.',
      title: 'Blumgi Ball quick guide',
      summary:
        'Blumgi Ball is a basketball puzzle game where aiming matters more than speed. Each level is about reading the arc, using walls or platforms when needed, and adjusting power in small steps until the ball reaches the hoop.',
      overview: [
        'Do not treat every shot like a direct throw. Many stages expect a bank shot, a bounce, or a controlled lob that avoids obstacles before dropping into the basket.',
        'This page gives practical aiming notes for the browser version, especially for players who want a short puzzle break without installing an app or chasing unofficial downloads.',
      ],
      howToPlay: [
        'Aim the shot toward the hoop while accounting for walls, platforms, and obstacles.',
        'Adjust power carefully; a small change often matters more than a new angle.',
        'Use rebounds when the direct path is blocked.',
      ],
      controls: [
        { label: 'Aim', value: 'Drag or move the pointer to set direction, depending on the browser build.' },
        { label: 'Shoot', value: 'Release or click to launch the ball.' },
        { label: 'Retry', value: 'Use the quick restart after an overpowered shot or missed angle.' },
      ],
      tips: [
        'Start with medium power so you can tell whether the angle or strength is wrong.',
        'When the hoop is behind an obstacle, look for a wall bounce instead of forcing a direct shot.',
        'Tiny power changes are often enough; do not overcorrect after one miss.',
        'On touchscreens, lift your finger slowly to avoid changing the final angle by accident.',
      ],
      faqs: [
        {
          question: 'How do you aim better in Blumgi Ball?',
          answer:
            'Use medium power first, watch whether the miss was high, low, short, or long, then change only one detail on the next shot.',
        },
        {
          question: 'Is Blumgi Ball a basketball game or a puzzle game?',
          answer:
            'It is both. The theme is basketball, but each level is mostly an aiming and physics puzzle.',
        },
        {
          question: 'Can Blumgi Ball be played without download?',
          answer:
            'Yes. Play in the browser on Luma and avoid APK, installer, or extension pages.',
        },
      ],
      relatedGuides: [
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'More quick browser games with simple controls.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'Casual browser games for short sessions.',
        },
      ],
    },
    zh: {
      metaTitle: 'Blumgi Ball 在线玩 - 瞄准、投篮操作与解谜技巧',
      metaDescription:
        '在线玩 Blumgi Ball，查看瞄准操作、投篮解谜技巧、反弹建议、FAQ 和相关浏览器游戏指南。',
      title: 'Blumgi Ball 快速玩法指南',
      summary:
        'Blumgi Ball 是篮球主题的物理解谜游戏，关键不是出手速度，而是读准弧线、必要时利用墙面或平台反弹，并用很小的力度调整把球送进篮筐。',
      overview: [
        '不要把每一关都当成直接投篮。很多关卡需要擦板、反弹或控制抛物线，让球先绕开障碍再落入篮筐。',
        '这个页面提供浏览器版的实用瞄准建议，适合想短时间玩一局物理解谜、又不想安装 App 或追不明下载的玩家。',
      ],
      howToPlay: [
        '瞄准篮筐，同时考虑墙面、平台和障碍物。',
        '细调力度；很多时候小幅变化比换一个大角度更有效。',
        '直线路径被挡住时，尝试反弹路线。',
      ],
      controls: [
        { label: '瞄准', value: '根据浏览器版本，拖动或移动指针设置方向。' },
        { label: '投出', value: '松开或点击发射篮球。' },
        { label: '重试', value: '力度过大或角度失误后，使用快速重开。' },
      ],
      tips: [
        '先用中等力度试投，判断问题是角度还是力量。',
        '篮筐被障碍挡住时，先找墙面反弹，不要硬投直线。',
        '一次失误后只微调力度或角度，不要过度修正。',
        '触屏时手指慢慢离开，避免最后一刻改变角度。',
      ],
      faqs: [
        {
          question: 'Blumgi Ball 怎么瞄得更准？',
          answer: '先用中等力度观察球是高、低、短还是长，下一次只改一个细节。',
        },
        {
          question: 'Blumgi Ball 是篮球游戏还是解谜游戏？',
          answer: '两者都有。主题是篮球，但每一关主要是瞄准和物理路线谜题。',
        },
        {
          question: 'Blumgi Ball 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩，避开 APK、安装器或扩展页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多操作简单、适合短局的浏览器游戏。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '适合轻松短时间打开的休闲浏览器游戏。',
        },
      ],
    },
  },
  'monster-tracks': {
    en: {
      metaTitle: 'Monster Tracks Online - Truck Controls, Balance Tips and Safe Play',
      metaDescription:
        'Play Monster Tracks online with truck controls, balance and landing tips, mobile notes, FAQ answers, and related browser driving guides.',
      title: 'Monster Tracks quick guide',
      summary:
        'Monster Tracks is a side-view truck challenge where balance is the real difficulty. The vehicle can climb rough terrain, but careless throttle makes it tip, bounce, or land nose-first before the finish.',
      overview: [
        'The best runs are controlled, not fast. Read the slope, tap the throttle before bumps, and let the truck settle after jumps instead of holding acceleration through every obstacle.',
        'Use this page as a browser-play reference for vehicle balance, landing recovery, and safe no-download play before switching to related physics driving guides.',
      ],
      howToPlay: [
        'Drive across uneven tracks, climb obstacles, and reach the finish without flipping.',
        'Use throttle carefully on slopes so the truck does not rotate too far.',
        'After jumps, release input briefly to let the suspension settle before the next climb.',
      ],
      controls: [
        { label: 'Accelerate', value: 'Hold the throttle key or touch control to move forward.' },
        { label: 'Balance', value: 'Release or tap the input to manage tilt and landing angle.' },
        { label: 'Restart', value: 'Use the in-game restart when the truck is stuck or flipped.' },
      ],
      tips: [
        'Do not hold throttle on every hill; short taps keep the truck from rotating too far.',
        'Land with the wheels as flat as possible before starting the next obstacle.',
        'If the truck flips backward, enter the slope slower instead of adding more speed.',
        'Mobile players should use shorter taps because touch throttle is easy to over-hold.',
      ],
      faqs: [
        {
          question: 'How do you stop flipping in Monster Tracks?',
          answer:
            'Use shorter throttle taps and release before the truck reaches the top of steep bumps or ramps.',
        },
        {
          question: 'Is Monster Tracks like Drive Mad?',
          answer:
            'Yes, both are physics driving games, but Monster Tracks focuses more on truck balance and rough terrain.',
        },
        {
          question: 'Does Monster Tracks need a download?',
          answer:
            'No. Play in the browser on Luma and avoid APKs, installers, or browser extensions.',
        },
      ],
      relatedGuides: [
        {
          slug: 'drive-mad-walkthrough',
          title: 'Drive Mad walkthrough',
          description: 'More physics driving fixes for flips, jumps, and landing control.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'Short browser games that are easy to start and stop.',
        },
      ],
    },
    zh: {
      metaTitle: 'Monster Tracks 在线玩 - 卡车操作、平衡技巧与安全玩法',
      metaDescription:
        '在线玩 Monster Tracks，查看卡车操作、平衡和落地技巧、手机体验、FAQ 和相关浏览器驾驶指南。',
      title: 'Monster Tracks 快速玩法指南',
      summary:
        'Monster Tracks 是侧视角卡车挑战，真正难点是保持平衡。车辆能爬过崎岖地形，但油门过猛会让车身后仰、弹跳或车头先落地，导致终点前翻车。',
      overview: [
        '最稳的跑法不是最快，而是可控。先读坡度，遇到颠簸前短按油门，跳跃后等车身稳定再处理下一个障碍。',
        '这个页面适合作为浏览器版参考，帮助你理解车辆平衡、落地恢复和免下载安全玩法，再进入相关物理驾驶攻略。',
      ],
      howToPlay: [
        '驾驶卡车通过不平整赛道，爬过障碍，到达终点且不要翻车。',
        '上坡时谨慎控制油门，避免车身旋转过度。',
        '跳跃落地后短暂松开输入，让悬挂和车身稳定后再继续爬坡。',
      ],
      controls: [
        { label: '加速', value: '按住油门键或触控按钮前进。' },
        { label: '平衡', value: '通过松开或短按输入控制倾斜和落地角度。' },
        { label: '重新开始', value: '卡住或翻车时使用游戏内重开。' },
      ],
      tips: [
        '不要每个坡都长按油门，短按能防止车身旋转过度。',
        '尽量让四轮平稳落地，再进入下一个障碍。',
        '如果卡车总是后翻，上坡前减速，而不是继续加速。',
        '手机端油门容易按过头，更适合短促点击。',
      ],
      faqs: [
        {
          question: 'Monster Tracks 怎么避免翻车？',
          answer: '减少长按油门，在陡坡或跳台顶端前提前松开，让卡车更平稳落地。',
        },
        {
          question: 'Monster Tracks 像 Drive Mad 吗？',
          answer: '两者都是物理驾驶游戏，但 Monster Tracks 更强调卡车平衡和崎岖地形。',
        },
        {
          question: 'Monster Tracks 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩，避开 APK、安装器或浏览器扩展。',
        },
      ],
      relatedGuides: [
        {
          slug: 'drive-mad-walkthrough',
          title: 'Drive Mad 过关攻略',
          description: '更多翻车、跳跃和落地控制的物理驾驶解法。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多容易开始也容易停下来的短局浏览器游戏。',
        },
      ],
    },
  },
  'adam-and-eve-5-part-1': {
    en: {
      metaTitle: 'Adam and Eve 5 Part 1 Online - Puzzle Controls, Tips and Safe Play',
      metaDescription:
        'Play Adam and Eve 5 Part 1 online with point-and-click controls, scene order tips, FAQ answers, no-download safety notes, and related puzzle guides.',
      title: 'Adam and Eve 5 Part 1 quick guide',
      summary:
        'Adam and Eve 5: Part 1 is a point-and-click puzzle adventure where every scene is solved by changing the environment in the right order. The fastest progress comes from spotting the obstacle, testing nearby objects once, and watching each animation before choosing the next click.',
      overview: [
        'The puzzle logic is built around small chain reactions. A creature may move only after food appears, a path may open only after a lever is used, and a hidden object can matter more than the largest item on screen.',
        'Use this page as a companion to the browser version when a scene stalls. It focuses on reading the order of objects, avoiding random clicking, and staying in safe no-download browser play.',
      ],
      howToPlay: [
        'Click objects in the scene to discover what can move, open, scare, lift, or reveal a path.',
        'Let every animation finish before clicking again, because the next usable object often appears after the first change.',
        'Move Adam forward only after the visible hazard or blocker has been solved.',
      ],
      controls: [
        { label: 'Interact', value: 'Use the mouse or tap the screen to click scene objects and characters.' },
        { label: 'Observe', value: 'Pause after each click to see what changed before testing another object.' },
        { label: 'Retry', value: 'Restart the scene if the object order feels unclear or an animation was missed.' },
      ],
      tips: [
        'Start by clicking the item that blocks Adam, then look for the object that could change it.',
        'Do not spam-click; it makes it harder to notice which object triggered the useful animation.',
        'Scan the top corners and background details when the obvious foreground objects stop responding.',
        'On mobile, use slower taps so the game can register one object at a time.',
      ],
      faqs: [
        {
          question: 'How do you solve Adam and Eve 5 Part 1 scenes?',
          answer:
            'Find what blocks the path, test nearby objects once, and follow the animation chain. Most scenes are solved by order, not by speed.',
        },
        {
          question: 'Is Adam and Eve 5 Part 1 different from Part 2?',
          answer:
            'Part 1 starts the Adam and Eve 5 story and keeps the puzzles compact. Part 2 continues the same point-and-click pattern with new scenes.',
        },
        {
          question: 'Does Adam and Eve 5 Part 1 need a download?',
          answer:
            'No. Play in the browser on Luma and avoid APK, installer, or extension pages.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'A broader guide to the series puzzle logic and scene-by-scene habits.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'More short browser games with simple controls and natural stopping points.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve 5 Part 1 在线玩 - 点击解谜操作、技巧与安全玩法',
      metaDescription:
        '在线玩 Adam and Eve 5 Part 1，查看点击解谜操作、场景顺序技巧、FAQ、免下载安全说明和相关解谜指南。',
      title: 'Adam and Eve 5 Part 1 快速玩法指南',
      summary:
        'Adam and Eve 5: Part 1 是点击解谜冒险，每个场景都要按正确顺序改变环境。更快的过法不是乱点，而是先找挡路物，再逐个测试附近对象，并在每次动画结束后判断下一步。',
      overview: [
        '谜题逻辑围绕小型连锁反应：动物可能要先被食物吸引，路线可能要先拉动机关才会打开，隐藏在背景里的小物件有时比显眼的大物体更关键。',
        '这个页面适合作为浏览器版参考。当某个场景卡住时，先回来看互动顺序和观察方法，不需要下载 App、APK、插件或安装器。',
      ],
      howToPlay: [
        '点击场景中的物体，找出哪些东西能移动、打开、吓走、抬起或露出道路。',
        '每次点击后等动画播完，因为下一个可用对象经常会在变化后出现。',
        '只有挡路点或危险处理完后，再让 Adam 继续前进。',
      ],
      controls: [
        { label: '互动', value: '用鼠标或触屏点击场景物体和角色。' },
        { label: '观察', value: '每次点击后停一下，看清楚发生了什么变化。' },
        { label: '重试', value: '如果顺序乱了或漏看动画，重开当前场景。' },
      ],
      tips: [
        '先点击挡住 Adam 的物体，再找能改变它的对象。',
        '不要连续乱点，否则很难判断哪个物体触发了有效动画。',
        '前景物体都没反应时，检查画面上方、角落和背景细节。',
        '手机端慢一点点点按，避免一次误触多个对象。',
      ],
      faqs: [
        {
          question: 'Adam and Eve 5 Part 1 怎么解谜？',
          answer: '先确认路线被什么挡住，再逐个测试附近物体，并根据动画变化继续找下一个互动点。多数场景考的是顺序，不是速度。',
        },
        {
          question: 'Adam and Eve 5 Part 1 和 Part 2 有什么区别？',
          answer: 'Part 1 是 Adam and Eve 5 的前半段，谜题更紧凑；Part 2 延续同样的点击解谜逻辑并加入新场景。',
        },
        {
          question: 'Adam and Eve 5 Part 1 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩即可，避开 APK、安装器或扩展页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '更完整的系列解谜逻辑和场景观察方法。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多操作简单、容易停下来的短局浏览器游戏。',
        },
      ],
    },
  },
  'adam-and-eve-5-part-2': {
    en: {
      metaTitle: 'Adam and Eve 5 Part 2 Online - Walkthrough Tips and Safe Browser Play',
      metaDescription:
        'Play Adam and Eve 5 Part 2 online with point-and-click controls, scene-reading tips, FAQ answers, safe play notes, and related puzzle guides.',
      title: 'Adam and Eve 5 Part 2 quick guide',
      summary:
        'Adam and Eve 5: Part 2 continues the point-and-click puzzle format with new scenes and slightly trickier object order. Good runs come from treating each screen like a chain: solve the blocker, watch the reaction, then use the next object that appears or changes.',
      overview: [
        'Part 2 is still friendly and short-session focused, but it expects you to notice background details and delayed reactions. One click may not solve the puzzle directly; it may only prepare the next useful click.',
        'This guide keeps the focus on practical browser play: read the scene, avoid unsafe download prompts elsewhere, and use related Adam and Eve guides when the puzzle pattern is not obvious.',
      ],
      howToPlay: [
        'Inspect the whole scene before clicking, especially items near the obstacle or exit route.',
        'Click one likely object, wait for the animation, then decide whether a new object has become usable.',
        'Repeat the chain until Adam can safely move forward.',
      ],
      controls: [
        { label: 'Interact', value: 'Click with the mouse or tap on mobile to use scene objects.' },
        { label: 'Wait', value: 'Let movement, creature reactions, and object changes finish before the next click.' },
        { label: 'Reset', value: 'Restart the scene when repeated clicks stop revealing new information.' },
      ],
      tips: [
        'A useful object often changes after another click, so revisit items that did nothing earlier.',
        'Look for cause-and-effect pairs: food and creature, lever and platform, tool and blocker.',
        'If you are stuck, describe the blocker in one sentence; the answer is usually the item that changes that blocker.',
        'Keep mobile taps deliberate so small interactive items are not missed.',
      ],
      faqs: [
        {
          question: 'What is the best strategy for Adam and Eve 5 Part 2?',
          answer:
            'Think in chains. Click one object, watch what changes, then use the new clue instead of repeatedly clicking the same place.',
        },
        {
          question: 'Is Adam and Eve 5 Part 2 good for casual players?',
          answer:
            'Yes. The controls are simple and each scene is short, but the object order still rewards careful observation.',
        },
        {
          question: 'Can I play Adam and Eve 5 Part 2 safely in a browser?',
          answer:
            'Yes. Use the browser player and avoid third-party pages that ask for downloads, APKs, or extensions.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'Series-wide advice for point-and-click scenes and puzzle chains.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'More quick browser games for relaxed sessions.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve 5 Part 2 在线玩 - 通关技巧与安全浏览器玩法',
      metaDescription:
        '在线玩 Adam and Eve 5 Part 2，查看点击解谜操作、场景观察技巧、FAQ、安全玩法说明和相关解谜攻略。',
      title: 'Adam and Eve 5 Part 2 快速玩法指南',
      summary:
        'Adam and Eve 5: Part 2 延续点击解谜玩法，但场景和物体顺序更需要观察。稳妥的思路是把每个画面当成链条：先解决挡路点，看清反应，再使用刚出现或刚改变的下一个对象。',
      overview: [
        'Part 2 仍然适合轻松短局，但它更要求玩家注意背景细节和延迟反应。一次点击不一定直接通关，可能只是为下一次有效点击做准备。',
        '这个指南关注实际浏览器玩法：读懂场景、避开其他站点的不安全下载提示，并在不清楚谜题规律时进入相关 Adam and Eve 攻略。',
      ],
      howToPlay: [
        '点击前先检查整个场景，尤其是障碍物和出口路线附近的物品。',
        '点击一个可能有用的对象，等动画结束，再判断是否有新对象可用。',
        '重复这个连锁过程，直到 Adam 可以安全前进。',
      ],
      controls: [
        { label: '互动', value: '用鼠标点击或手机触屏点击场景物体。' },
        { label: '等待', value: '等移动、动物反应和物体变化结束后再继续。' },
        { label: '重置', value: '反复点击没有新信息时，重开当前场景。' },
      ],
      tips: [
        '某些物体要在另一个对象触发后才有用，所以之前没反应的物品可以回头再试。',
        '寻找因果配对：食物和动物、机关和平台、工具和障碍。',
        '卡住时用一句话说清楚挡路原因，答案通常就是能改变它的物品。',
        '手机端点按要准确，避免漏掉较小的互动对象。',
      ],
      faqs: [
        {
          question: 'Adam and Eve 5 Part 2 最好的解谜思路是什么？',
          answer: '按链条思考：点一个对象，看它改变了什么，再根据新线索继续，不要一直反复点同一个地方。',
        },
        {
          question: 'Adam and Eve 5 Part 2 适合休闲玩家吗？',
          answer: '适合。操作简单、场景短，但物体顺序仍然需要认真观察。',
        },
        {
          question: 'Adam and Eve 5 Part 2 可以安全在线玩吗？',
          answer: '可以。使用浏览器播放器即可，避开要求下载、APK 或扩展的第三方页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '覆盖系列点击场景和连锁解谜习惯的通用指南。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '更多适合轻松短局打开的浏览器游戏。',
        },
      ],
    },
  },
  'blumgi-bloom': {
    en: {
      metaTitle: 'Blumgi Bloom Online - Rope Puzzle Controls, Tips and Safe Play',
      metaDescription:
        'Play Blumgi Bloom online with rope-cutting controls, timing tips, flower puzzle advice, FAQ answers, and no-download browser safety notes.',
      title: 'Blumgi Bloom quick guide',
      summary:
        'Blumgi Bloom is a gentle physics puzzle game about cutting ropes and using timing to free the flower. The solution usually depends on which rope you cut first, how gravity moves the object, and whether you wait for the swing before making the next move.',
      overview: [
        'The game looks simple, but many levels are order puzzles. Cutting every rope immediately can ruin the angle, while one patient cut can create the swing or drop needed to clear the flower.',
        'Use this page to understand the browser controls, common timing mistakes, and safe no-download play before moving to more short-session puzzle collections.',
      ],
      howToPlay: [
        'Inspect the ropes, flower, obstacles, and moving objects before cutting anything.',
        'Cut the rope that creates a useful swing, drop, or clear path first.',
        'Wait for motion to settle when the next cut depends on timing.',
      ],
      controls: [
        { label: 'Cut', value: 'Click or tap a rope to cut it.' },
        { label: 'Observe motion', value: 'Watch the swing, bounce, or drop before the next cut.' },
        { label: 'Retry', value: 'Restart quickly when the first cut sends the object in the wrong direction.' },
      ],
      tips: [
        'Do not cut all ropes at once; most levels are solved by order and timing.',
        'If the object misses the flower, change only the first cut or the wait time on the next attempt.',
        'Look for ropes that control direction rather than ropes that only release weight.',
        'On mobile, tap ropes carefully because small rope segments can be easy to miss.',
      ],
      faqs: [
        {
          question: 'How do you solve Blumgi Bloom levels?',
          answer:
            'Study which rope controls direction, cut one rope at a time, and wait when the solution needs a swing or falling angle.',
        },
        {
          question: 'Is Blumgi Bloom hard?',
          answer:
            'It is calm at first, but later puzzles need more precise order and timing. The controls stay simple.',
        },
        {
          question: 'Does Blumgi Bloom require an app?',
          answer:
            'No. Play it in the browser on Luma and avoid installer, APK, or extension prompts.',
        },
      ],
      relatedGuides: [
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'More relaxed browser games with quick puzzle loops.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'Casual browser games for low-pressure short sessions.',
        },
      ],
    },
    zh: {
      metaTitle: 'Blumgi Bloom 在线玩 - 割绳解谜操作、技巧与安全玩法',
      metaDescription:
        '在线玩 Blumgi Bloom，查看割绳操作、时机技巧、花朵解谜建议、FAQ 和免下载浏览器安全说明。',
      title: 'Blumgi Bloom 快速玩法指南',
      summary:
        'Blumgi Bloom 是轻松的物理解谜游戏，核心是割绳顺序和时机，让花朵顺利解放。多数关卡要判断先割哪根绳、物体会怎样受重力摆动，以及下一刀是否需要等待。',
      overview: [
        '游戏看起来简单，但很多关卡其实是顺序谜题。一次性割掉所有绳子可能会破坏角度，而耐心等一次摆动，反而能创造正确落点。',
        '这个页面帮助你理解浏览器版操作、常见时机错误和免下载安全玩法，再进入更多短局解谜合集。',
      ],
      howToPlay: [
        '割绳前先观察绳子、花朵、障碍和移动物体的位置。',
        '先割能创造有用摆动、下落或通路的绳子。',
        '当下一刀依赖时机时，等待物体摆动到合适角度再操作。',
      ],
      controls: [
        { label: '割绳', value: '点击或触屏点按绳子。' },
        { label: '观察运动', value: '看清摆动、弹跳或下落后再割下一根。' },
        { label: '重试', value: '第一刀方向错了就快速重开。' },
      ],
      tips: [
        '不要一开始就把所有绳子割掉，多数关卡考顺序和时机。',
        '如果物体没碰到花朵，下一次只改第一刀或等待时间。',
        '优先找能改变方向的绳子，而不是只负责释放重量的绳子。',
        '手机端要点准绳子，小段绳索容易误触或漏点。',
      ],
      faqs: [
        {
          question: 'Blumgi Bloom 怎么过关？',
          answer: '先判断哪根绳控制方向，一次只割一根；需要摆动或下落角度时，等到时机合适再割下一根。',
        },
        {
          question: 'Blumgi Bloom 难吗？',
          answer: '前期很轻松，后面会更考验顺序和时机，但操作始终简单。',
        },
        {
          question: 'Blumgi Bloom 需要安装 App 吗？',
          answer: '不需要。在 Luma 浏览器里直接玩，避开安装器、APK 或扩展提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多轻松、短局循环的浏览器解谜游戏。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '适合低压力短时间打开的休闲浏览器游戏。',
        },
      ],
    },
  },
  'blockman-climb': {
    en: {
      metaTitle: 'Blockman Climb Online - Platform Controls, Co-op Tips and Safe Play',
      metaDescription:
        'Play Blockman Climb online with climbing controls, two-character coordination tips, mobile notes, FAQ answers, and safe browser play guidance.',
      title: 'Blockman Climb quick guide',
      summary:
        'Blockman Climb is a platform climbing challenge where coordination matters more than speed. Whether you play solo or with a friend, the safest progress comes from moving one block character at a time, using ledges carefully, and avoiding jumps that leave the partner trapped below.',
      overview: [
        'The main difficulty is shared positioning. If one character rushes ahead, the other may lose the angle or height needed to continue, so good runs use short climbs, stable ledges, and deliberate resets.',
        'This page gives a compact browser-play guide for controls, teamwork, and common climbing mistakes without pushing downloads, plugins, or unrelated clients.',
      ],
      howToPlay: [
        'Move the block characters upward through platforms and hazards.',
        'Use one character to reach a stable position before moving the other.',
        'Plan jumps so both characters can continue, not just the one currently moving.',
      ],
      controls: [
        { label: 'Move / jump', value: 'Use the active keyboard or touch controls shown by the browser build.' },
        { label: 'Switch / partner play', value: 'Coordinate the two characters according to the current control layout.' },
        { label: 'Restart', value: 'Use restart when one character is stuck below an unrecoverable gap.' },
      ],
      tips: [
        'Move in short steps and stop on safe ledges before making the next jump.',
        'Do not abandon the second character; every route should leave a path for both.',
        'If playing with another person, call out jump timing before moving through tight spaces.',
        'On touchscreens, avoid rapid double inputs because they can send a character past a narrow ledge.',
      ],
      faqs: [
        {
          question: 'Can Blockman Climb be played solo?',
          answer:
            'Yes, but it is easier when you move slowly and treat the two characters as a shared puzzle instead of racing ahead.',
        },
        {
          question: 'What makes Blockman Climb difficult?',
          answer:
            'The challenge is keeping both characters positioned safely. A jump that helps one character can trap the other.',
        },
        {
          question: 'Does Blockman Climb need a download?',
          answer:
            'No. Play in the browser on Luma and avoid third-party installers, APK files, or extensions.',
        },
      ],
      relatedGuides: [
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'More platformers and quick-retry browser challenges.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'Short browser games with simple controls and fast retries.',
        },
      ],
    },
    zh: {
      metaTitle: 'Blockman Climb 在线玩 - 平台攀爬操作、配合技巧与安全玩法',
      metaDescription:
        '在线玩 Blockman Climb，查看攀爬操作、双角色配合技巧、手机体验、FAQ 和安全浏览器玩法说明。',
      title: 'Blockman Climb 快速玩法指南',
      summary:
        'Blockman Climb 是平台攀爬挑战，配合比速度更重要。无论单人控制还是和朋友一起玩，更稳的方式都是一次移动一个方块角色，站稳平台，再确保另一个角色也能继续前进。',
      overview: [
        '主要难点在共享位置。如果一个角色冲太快，另一个可能失去继续攀爬的角度或高度，所以稳妥路线需要短距离跳跃、可靠落点和明确重试。',
        '这个页面提供浏览器版操作、协作和常见攀爬错误说明，不引导下载、插件或客户端。',
      ],
      howToPlay: [
        '控制方块角色向上穿过平台和障碍。',
        '先让一个角色到达稳定位置，再移动另一个角色。',
        '规划跳跃时要保证两个角色都能继续，而不是只让当前角色前进。',
      ],
      controls: [
        { label: '移动 / 跳跃', value: '使用当前浏览器版本显示的键盘或触控操作。' },
        { label: '切换 / 双人配合', value: '根据当前控制布局协调两个角色。' },
        { label: '重新开始', value: '有角色卡在无法补救的位置时重开。' },
      ],
      tips: [
        '短距离移动，先在安全平台停稳，再跳下一步。',
        '不要把第二个角色丢在下面，每条路线都要给两人留通路。',
        '双人玩时，进入窄平台前先沟通跳跃时机。',
        '触屏端避免连续乱按，容易让角色越过狭窄平台。',
      ],
      faqs: [
        {
          question: 'Blockman Climb 可以单人玩吗？',
          answer: '可以，但要慢一点，把两个角色当成同一个配合谜题，不要只顾一个角色往上冲。',
        },
        {
          question: 'Blockman Climb 难点在哪里？',
          answer: '难点是让两个角色都处在安全位置。一个角色能过的跳跃，可能会把另一个角色困住。',
        },
        {
          question: 'Blockman Climb 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩，避开第三方安装器、APK 或扩展。',
        },
      ],
      relatedGuides: [
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的平台小游戏',
          description: '更多平台跳跃和高重试浏览器挑战。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多操作简单、重试迅速的短局浏览器游戏。',
        },
      ],
    },
  },
  'rolling-ball': {
    en: {
      metaTitle: 'Rolling Ball Online - Balance Controls, Route Tips and Safe Play',
      metaDescription:
        'Play Rolling Ball online with movement controls, balance and route-planning tips, mobile notes, FAQ answers, and safe no-download browser guidance.',
      title: 'Rolling Ball quick guide',
      summary:
        'Rolling Ball is a balance-and-route browser challenge where small inputs matter. The goal is to keep the ball moving along narrow paths, ramps, and turns without overcorrecting, falling off, or losing the line before the next platform.',
      overview: [
        'The natural mistake is steering too sharply after every wobble. Better runs use early, gentle corrections and a clear route through ramps or turns before the ball reaches them.',
        'This guide focuses on practical browser play: how to control speed, read the next section, and avoid unsafe download pages that reuse generic rolling-ball keywords.',
      ],
      howToPlay: [
        'Guide the ball along the path while avoiding drops, gaps, and sharp turns.',
        'Use small steering changes before the ball reaches the edge instead of reacting late.',
        'Slow down before narrow bridges or curved platforms when the game allows it.',
      ],
      controls: [
        { label: 'Steer', value: 'Use arrow keys, WASD, or touch controls depending on the browser build.' },
        { label: 'Balance speed', value: 'Ease off movement before tight sections if the controls support it.' },
        { label: 'Retry', value: 'Restart quickly after a fall and adjust the approach earlier next time.' },
      ],
      tips: [
        'Look one platform ahead instead of staring only at the ball.',
        'Use gentle corrections; sharp steering often creates the next mistake.',
        'Enter ramps straight so the ball does not drift sideways on landing.',
        'On mobile, use shorter swipes or taps because long inputs can oversteer.',
      ],
      faqs: [
        {
          question: 'How do you control Rolling Ball better?',
          answer:
            'Start turning earlier and use smaller corrections. Waiting until the ball reaches the edge usually causes oversteer.',
        },
        {
          question: 'Is Rolling Ball a racing game?',
          answer:
            'It is closer to a balance and route-planning challenge than a pure race. Safe lines matter more than maximum speed.',
        },
        {
          question: 'Can Rolling Ball be played without download?',
          answer:
            'Yes. Play in the browser on Luma and avoid APK, installer, or extension pages.',
        },
      ],
      relatedGuides: [
        {
          slug: 'drive-mad-walkthrough',
          title: 'Drive Mad walkthrough',
          description: 'Physics-control advice for players who like balance and short retries.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'More quick browser games with readable goals and fast restarts.',
        },
      ],
    },
    zh: {
      metaTitle: 'Rolling Ball 在线玩 - 平衡操作、路线技巧与安全玩法',
      metaDescription:
        '在线玩 Rolling Ball，查看移动操作、平衡和路线规划技巧、手机体验、FAQ 和免下载浏览器安全说明。',
      title: 'Rolling Ball 快速玩法指南',
      summary:
        'Rolling Ball 是平衡和路线控制类浏览器挑战，关键在细小输入。目标是在窄路、坡道和转弯中保持球的路线，避免过度修正、掉落或在下一段平台前失去方向。',
      overview: [
        '常见错误是每次晃动后猛打方向。更稳的跑法是提前轻微修正，并在球到达坡道或弯道前先看清下一段路线。',
        '这个指南关注实际浏览器玩法：如何控速、读路线，并避开利用 rolling ball 关键词诱导下载的不安全页面。',
      ],
      howToPlay: [
        '控制滚球沿路线前进，避开掉落、缺口和急弯。',
        '在球接近边缘前提前小幅修正，不要等到最后一刻再猛转。',
        '如果游戏支持控速，窄桥和弯道前先慢下来。',
      ],
      controls: [
        { label: '转向', value: '根据浏览器版本，使用方向键、WASD 或触控操作。' },
        { label: '控制速度', value: '进入狭窄区域前减少输入，避免冲过头。' },
        { label: '重试', value: '掉落后快速重开，并把修正点提前。' },
      ],
      tips: [
        '视线看向下一个平台，不要只盯着球。',
        '用轻微修正，急转往往会制造下一个失误。',
        '上坡或跳台前尽量正向进入，落地时不容易横向偏移。',
        '手机端用短滑或短按，长输入很容易转向过度。',
      ],
      faqs: [
        {
          question: 'Rolling Ball 怎么控制更稳？',
          answer: '提前转向，并用更小的修正。等球到了边缘再操作，通常会转向过度。',
        },
        {
          question: 'Rolling Ball 是赛车游戏吗？',
          answer: '更接近平衡和路线规划挑战，不是纯竞速。安全路线比最高速度更重要。',
        },
        {
          question: 'Rolling Ball 可以免下载玩吗？',
          answer: '可以。在 Luma 浏览器里直接玩，避开 APK、安装器或扩展页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'drive-mad-walkthrough',
          title: 'Drive Mad 过关攻略',
          description: '适合喜欢物理控制、平衡和短局重试的玩家。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多目标清晰、重开迅速的短局浏览器游戏。',
        },
      ],
    },
  },
  'adam-and-eve-6': {
    en: {
      metaTitle: 'Adam and Eve 6 Online - Point-and-Click Puzzle Tips and Safe Play',
      metaDescription:
        'Play Adam and Eve 6 online with scene-reading tips, point-and-click controls, FAQ answers, no-download safety notes, and related puzzle guides.',
      title: 'Adam and Eve 6 quick guide',
      summary:
        'Adam and Eve 6 is a point-and-click puzzle adventure where each scene is solved by noticing the right cause-and-effect chain. The best approach is to identify what blocks Adam, test nearby objects carefully, and wait for every animation before deciding the next click.',
      overview: [
        'The puzzles are compact, but the order matters. A background object may prepare a path, a creature reaction may unlock a tool, and one small animation can completely change which item should be clicked next.',
        'Use this page as a browser-play companion when a scene stalls. It focuses on practical observation, clean no-download play, and series links for players who want a broader walkthrough pattern.',
      ],
      howToPlay: [
        'Inspect the full scene before clicking, including corners, background items, and the route ahead.',
        'Click one likely object, wait for the change, then use the next item that becomes relevant.',
        'Send Adam forward only after the visible blocker or hazard has been handled.',
      ],
      controls: [
        { label: 'Interact', value: 'Use the mouse or tap to click objects, tools, animals, and scene details.' },
        { label: 'Observe', value: 'Wait for the animation to finish before testing another object.' },
        { label: 'Retry', value: 'Restart the scene if the click order becomes confusing.' },
      ],
      tips: [
        'Start with the obstacle, then look for the object that could change that obstacle.',
        'If an item does nothing, come back to it after another object has moved or opened.',
        'Avoid rapid random clicks because the useful animation can be easy to miss.',
        'On mobile, tap slowly and deliberately so small scene objects register correctly.',
      ],
      faqs: [
        {
          question: 'How do you solve Adam and Eve 6 puzzles?',
          answer:
            'Think in ordered chains. Identify the blocker, click one related object, watch the result, and then follow the new clue.',
        },
        {
          question: 'Is Adam and Eve 6 good for short sessions?',
          answer:
            'Yes. Each scene is short and self-contained, so it works well for quick browser play.',
        },
        {
          question: 'Does Adam and Eve 6 need a download?',
          answer:
            'No. Play it in the browser on Luma and avoid APK, installer, or extension prompts.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'Series-wide puzzle advice for point-and-click scenes and object chains.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'More short browser games with simple controls and quick stopping points.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve 6 在线玩 - 点击解谜技巧与安全玩法',
      metaDescription:
        '在线玩 Adam and Eve 6，查看场景观察技巧、点击操作、FAQ、免下载安全说明和相关解谜攻略。',
      title: 'Adam and Eve 6 快速玩法指南',
      summary:
        'Adam and Eve 6 是点击解谜冒险，每个场景都要靠正确的因果链推进。更稳的做法是先确认 Adam 被什么挡住，再仔细测试附近物体，并等每段动画结束后再决定下一次点击。',
      overview: [
        '谜题都很短，但顺序很重要。背景物体可能先铺路，动物反应可能解锁工具，一个小动画就可能改变下一步该点哪里。',
        '这个页面适合作为浏览器版参考，帮助你在卡关时观察场景、保持免下载游玩，并进入系列攻略了解通用解谜模式。',
      ],
      howToPlay: [
        '点击前先看完整场景，包括角落、背景物体和前进路线。',
        '点击一个可能相关的对象，等变化结束，再使用下一个变得相关的物品。',
        '只有挡路点或危险处理好后，再让 Adam 前进。',
      ],
      controls: [
        { label: '互动', value: '用鼠标或触屏点击物体、工具、动物和场景细节。' },
        { label: '观察', value: '等动画结束后再测试另一个对象。' },
        { label: '重试', value: '点击顺序混乱时重开当前场景。' },
      ],
      tips: [
        '从挡路物开始，再找能改变它的对象。',
        '某个物品没反应时，等其他对象移动或打开后再回来试。',
        '不要快速乱点，否则很容易错过有效动画。',
        '手机端慢一点点按，小物体更容易准确触发。',
      ],
      faqs: [
        {
          question: 'Adam and Eve 6 怎么解谜？',
          answer: '按顺序链思考：先找挡路点，点击一个相关对象，观察变化，再跟随新线索继续。',
        },
        {
          question: 'Adam and Eve 6 适合短时间玩吗？',
          answer: '适合。每个场景都很短、目标明确，适合浏览器短局游玩。',
        },
        {
          question: 'Adam and Eve 6 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩即可，避开 APK、安装器或扩展提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '覆盖系列点击场景和物体链条的通用解谜建议。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多操作简单、容易停下来的短局浏览器游戏。',
        },
      ],
    },
  },
  'adam-and-eve-7': {
    en: {
      metaTitle: 'Adam and Eve 7 Online - Puzzle Controls, Tips and Browser Guide',
      metaDescription:
        'Play Adam and Eve 7 online with point-and-click controls, scene order tips, FAQ answers, no-download safety notes, and related browser puzzle guides.',
      title: 'Adam and Eve 7 quick guide',
      summary:
        'Adam and Eve 7 keeps the series focused on small scene puzzles, hidden interactions, and careful click order. The key is to read the whole screen first, then use one object at a time so the next clue becomes obvious.',
      overview: [
        'Later Adam and Eve entries often hide important interactions in quiet parts of the scene. A branch, cloud, animal, rope, or tool can be useful only after another object changes the layout.',
        'This guide gives a compact way to play the browser version without turning the page into a spoiler list: observe, test once, wait, and follow the visible change.',
      ],
      howToPlay: [
        'Scan the blocker, the exit path, and any object that could move or distract a creature.',
        'Click one object, wait for the full animation, then look for the new path or item.',
        'Continue the chain until Adam can move through the scene safely.',
      ],
      controls: [
        { label: 'Click / tap', value: 'Use mouse clicks or touch taps to interact with scene objects.' },
        { label: 'Wait', value: 'Let each reaction finish before clicking another detail.' },
        { label: 'Restart', value: 'Use the scene restart if the order is unclear after several attempts.' },
      ],
      tips: [
        'Do not assume large objects are the answer; small background details often matter.',
        'If a click changes the scene slightly, re-check every object near that change.',
        'Treat animals and moving parts as timing clues, not decorations.',
        'On mobile, zooming is not always available, so tap obvious clusters slowly.',
      ],
      faqs: [
        {
          question: 'What should I do when Adam and Eve 7 gets stuck?',
          answer:
            'Stop clicking randomly and describe the blocker. Then test only objects that could change that blocker or the route around it.',
        },
        {
          question: 'Is Adam and Eve 7 a puzzle game or adventure game?',
          answer:
            'It is both, but the moment-to-moment play is mostly point-and-click puzzle solving.',
        },
        {
          question: 'Can I play Adam and Eve 7 without installing anything?',
          answer:
            'Yes. Use the browser player on Luma and avoid third-party download prompts.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'A broader walkthrough-style guide for the series puzzle logic.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'More casual browser games for short sessions.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve 7 在线玩 - 点击解谜操作、技巧与浏览器指南',
      metaDescription:
        '在线玩 Adam and Eve 7，查看点击操作、场景顺序技巧、FAQ、免下载安全说明和相关浏览器解谜指南。',
      title: 'Adam and Eve 7 快速玩法指南',
      summary:
        'Adam and Eve 7 延续系列的小场景谜题、隐藏互动和点击顺序。关键是先读完整个画面，再一次只使用一个对象，让下一条线索自然出现。',
      overview: [
        '系列后续作品常把关键互动藏在安静的画面角落。树枝、云、动物、绳子或工具，可能只有在另一个对象改变布局后才有用。',
        '这个指南不会把页面写成纯剧透清单，而是帮助你掌握浏览器版解谜方法：观察、测试一次、等待动画、跟随可见变化。',
      ],
      howToPlay: [
        '先扫一遍挡路点、出口路线，以及任何可能移动或吸引动物的对象。',
        '点击一个对象，等完整动画结束，再找新路径或新物品。',
        '沿着连锁反应继续，直到 Adam 可以安全离开当前场景。',
      ],
      controls: [
        { label: '点击 / 点按', value: '用鼠标或触屏点击场景物体。' },
        { label: '等待', value: '每个反应结束后再点击下一个细节。' },
        { label: '重开', value: '多次尝试后顺序仍不清楚时重开当前场景。' },
      ],
      tips: [
        '不要只看大物体，小背景细节经常才是答案。',
        '如果一次点击让场景稍有变化，就重新检查变化附近的所有对象。',
        '动物和移动机关通常是时机线索，不只是装饰。',
        '手机端不一定方便缩放，所以明显物体群要慢慢点。',
      ],
      faqs: [
        {
          question: 'Adam and Eve 7 卡住时怎么办？',
          answer: '先停止乱点，用一句话说清楚挡路原因，再只测试可能改变挡路点或绕路路径的对象。',
        },
        {
          question: 'Adam and Eve 7 是解谜还是冒险游戏？',
          answer: '两者都有，但实际操作主要是点击解谜。',
        },
        {
          question: 'Adam and Eve 7 不安装可以玩吗？',
          answer: '可以。在 Luma 浏览器里直接玩，避开第三方下载提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '更完整的系列解谜逻辑和通关思路。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '更多适合短时间打开的休闲浏览器游戏。',
        },
      ],
    },
  },
  'adam-and-eve-8': {
    en: {
      metaTitle: 'Adam and Eve 8 Online - Scene Puzzle Tips and Safe Browser Play',
      metaDescription:
        'Play Adam and Eve 8 online with point-and-click scene tips, controls, FAQ answers, no-download safety notes, and related puzzle game guides.',
      title: 'Adam and Eve 8 quick guide',
      summary:
        'Adam and Eve 8 is another short-form point-and-click adventure built around scene logic. Progress comes from noticing what has changed after each click, then using the new object or path instead of repeating the same action.',
      overview: [
        'The challenge is not fast reactions. It is careful sequencing: move one object, wait for the reaction, then decide whether the blocker, creature, platform, or path has changed enough for the next step.',
        'Use this page when you want a practical browser guide rather than unsafe downloads or vague game listings. It gives enough structure to solve scenes without removing the fun of discovery.',
      ],
      howToPlay: [
        'Look for the current blocker and any object connected to it by position or theme.',
        'Click once, watch the animation, and re-check the scene for new clickable details.',
        'Repeat until Adam reaches the exit or next scene.',
      ],
      controls: [
        { label: 'Interact', value: 'Click or tap scene objects to trigger actions.' },
        { label: 'Read the scene', value: 'Use the animation as the clue for the next interaction.' },
        { label: 'Restart', value: 'Reset the scene if the order becomes hard to track.' },
      ],
      tips: [
        'After every successful click, look for what moved, disappeared, opened, or changed direction.',
        'Clickable objects can be small, so scan the scene edges before giving up.',
        'If a creature blocks the path, find what changes its attention rather than clicking it repeatedly.',
        'Keep play in the browser; the game does not need an installer or extension.',
      ],
      faqs: [
        {
          question: 'How do I find clickable objects in Adam and Eve 8?',
          answer:
            'Start near the obstacle and scan outward. Items near the path, creature, or tool chain are usually more important than decorative details.',
        },
        {
          question: 'Is Adam and Eve 8 beginner friendly?',
          answer:
            'Yes. The controls are simple, and the scenes are short enough to retry without much friction.',
        },
        {
          question: 'Is Adam and Eve 8 safe to play online?',
          answer:
            'Use the browser player and avoid any page that asks for APKs, installers, or unknown browser extensions.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'General series guidance for object order and point-and-click puzzle chains.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'More short-session games with simple browser controls.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve 8 在线玩 - 场景解谜技巧与安全浏览器玩法',
      metaDescription:
        '在线玩 Adam and Eve 8，查看点击场景技巧、操作、FAQ、免下载安全说明和相关解谜游戏指南。',
      title: 'Adam and Eve 8 快速玩法指南',
      summary:
        'Adam and Eve 8 继续采用短场景点击冒险玩法，核心是观察每次点击后发生了什么变化，再使用新出现的物体或路径，而不是重复同一个动作。',
      overview: [
        '难点不是反应速度，而是顺序判断：移动一个对象，等待反应，再看挡路物、动物、平台或路线是否已经改变到可以进行下一步。',
        '这个页面提供实用浏览器玩法说明，避免不安全下载或空泛游戏列表；内容足够帮助你理解谜题，又不会完全剥夺探索乐趣。',
      ],
      howToPlay: [
        '先找当前挡路点，以及位置或主题上与它相关的对象。',
        '点击一次，观察动画，再重新检查场景中是否出现新的可点细节。',
        '重复这个过程，直到 Adam 到达出口或下一场景。',
      ],
      controls: [
        { label: '互动', value: '点击或点按场景物体触发动作。' },
        { label: '读场景', value: '把动画变化当成下一次互动的线索。' },
        { label: '重开', value: '顺序难以追踪时重置当前场景。' },
      ],
      tips: [
        '每次有效点击后，先看清什么东西移动、消失、打开或改变方向。',
        '可点对象可能很小，放弃前先扫一遍画面边缘。',
        '如果动物挡路，找能转移它注意力的东西，不要反复点动物本身。',
        '保持浏览器游玩即可，这类游戏不需要安装器或扩展。',
      ],
      faqs: [
        {
          question: 'Adam and Eve 8 怎么找可点击物体？',
          answer: '从障碍物附近开始往外扫，靠近路线、动物或工具链的物品通常比纯装饰更重要。',
        },
        {
          question: 'Adam and Eve 8 适合新手吗？',
          answer: '适合。操作很简单，场景也短，失败后重试成本不高。',
        },
        {
          question: 'Adam and Eve 8 在线玩安全吗？',
          answer: '使用浏览器播放器即可，避开要求 APK、安装器或未知浏览器扩展的页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '关于物体顺序和点击解谜链条的系列通用指南。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多操作简单、适合短局的浏览器游戏。',
        },
      ],
    },
  },
  'big-tower-tiny-square-2': {
    en: {
      metaTitle: 'Big Tower Tiny Square 2 Online - Controls, Jump Tips and Safe Play',
      metaDescription:
        'Play Big Tower Tiny Square 2 online with platform controls, jump timing tips, checkpoint advice, FAQ answers, and no-download browser guidance.',
      title: 'Big Tower Tiny Square 2 quick guide',
      summary:
        'Big Tower Tiny Square 2 is a precision platformer built around small jumps, narrow hazards, and frequent retries. The safest way up the tower is to learn one obstacle at a time, reset quickly, and treat each checkpoint as a new practice segment.',
      overview: [
        'This sequel keeps the one-more-try rhythm of the first game. You will miss jumps, hit spikes, and restart often, but each attempt should teach one timing detail or route correction.',
        'Use this page for practical browser play: controls, jump habits, mobile notes, and links to broader platformer guides without pushing downloads or misleading shortcuts.',
      ],
      howToPlay: [
        'Move through tower rooms, avoid spikes and traps, and reach the next checkpoint.',
        'Practice each hazard in small pieces instead of rushing the full room.',
        'Use deaths as timing feedback: decide whether you jumped too early, too late, or too far.',
      ],
      controls: [
        { label: 'Move', value: 'Use the active keyboard movement keys shown by the browser build.' },
        { label: 'Jump', value: 'Tap jump for short hops and hold longer only when the gap requires it.' },
        { label: 'Retry', value: 'Restart from the checkpoint and adjust one timing detail at a time.' },
      ],
      tips: [
        'Stop at safe ledges before starting a new trap pattern.',
        'Use short jumps when spikes are close; over-jumping is a common mistake.',
        'Memorize the first hazard after each checkpoint so the next attempt starts cleanly.',
        'Keyboard is usually more reliable than touch controls for tight platforming.',
      ],
      faqs: [
        {
          question: 'Is Big Tower Tiny Square 2 harder than the first game?',
          answer:
            'It follows the same precision-platforming style and can feel harder because rooms ask for tighter timing and cleaner retries.',
        },
        {
          question: 'How do I get better at Big Tower Tiny Square 2?',
          answer:
            'Practice one hazard at a time, use checkpoints as training points, and change only one input detail after each failed attempt.',
        },
        {
          question: 'Does Big Tower Tiny Square 2 need a download?',
          answer:
            'No. Play in the browser on Luma and avoid APK, installer, or extension pages.',
        },
      ],
      relatedGuides: [
        {
          slug: 'big-tower-tiny-square-walkthrough',
          title: 'Big Tower Tiny Square walkthrough',
          description: 'Core precision-platforming advice that also helps with the sequel.',
        },
        {
          slug: 'games-like-ovo',
          title: 'Games like OvO',
          description: 'More high-retry platformers and movement-focused browser games.',
        },
      ],
    },
    zh: {
      metaTitle: 'Big Tower Tiny Square 2 在线玩 - 操作、跳跃技巧与安全玩法',
      metaDescription:
        '在线玩 Big Tower Tiny Square 2，查看平台操作、跳跃时机、检查点建议、FAQ 和免下载浏览器玩法说明。',
      title: 'Big Tower Tiny Square 2 快速玩法指南',
      summary:
        'Big Tower Tiny Square 2 是精准平台跳跃游戏，围绕小跳、窄陷阱和频繁重试展开。最稳的爬塔方式是一次练一个障碍，快速重开，并把每个检查点当成新的练习段。',
      overview: [
        '续作延续第一作的“再来一次”节奏。你会错过跳跃、碰到尖刺、反复重开，但每次尝试都应该学到一个时机或路线修正。',
        '这个页面提供实用浏览器玩法：操作、跳跃习惯、手机体验和相关平台游戏指南，不引导下载或误导捷径。',
      ],
      howToPlay: [
        '穿过塔内房间，避开尖刺和机关，到达下一个检查点。',
        '把每个陷阱拆成小段练习，不要急着一次冲完整个房间。',
        '把失败当成时机反馈：判断是跳早了、跳晚了还是跳太远。',
      ],
      controls: [
        { label: '移动', value: '使用当前浏览器版本显示的键盘移动键。' },
        { label: '跳跃', value: '短距离轻按跳跃，只有大缺口才长按。' },
        { label: '重试', value: '从检查点重新开始，每次只调整一个输入细节。' },
      ],
      tips: [
        '进入新机关前先停在安全平台上观察。',
        '尖刺很近时用短跳，跳过头是常见失误。',
        '记住每个检查点后的第一个陷阱，让下一次开局更稳定。',
        '键盘通常比触屏更适合精细平台跳跃。',
      ],
      faqs: [
        {
          question: 'Big Tower Tiny Square 2 比第一作更难吗？',
          answer: '它延续同样的精准平台风格，因为房间更考验时机和重试质量，所以可能会感觉更难。',
        },
        {
          question: 'Big Tower Tiny Square 2 怎么提升？',
          answer: '一次练一个障碍，把检查点当成训练点；每次失败后只调整一个输入细节。',
        },
        {
          question: 'Big Tower Tiny Square 2 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩，避开 APK、安装器或扩展页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'big-tower-tiny-square-walkthrough',
          title: 'Big Tower Tiny Square 攻略',
          description: '同样适用于续作的精准平台跳跃核心建议。',
        },
        {
          slug: 'games-like-ovo',
          title: '类似 OvO 的高重试小游戏',
          description: '更多重视移动和跳跃手感的浏览器平台游戏。',
        },
      ],
    },
  },
  'blumgi-rocket': {
    en: {
      metaTitle: 'Blumgi Rocket Online - Boost Controls, Landing Tips and Safe Play',
      metaDescription:
        'Play Blumgi Rocket online with boost controls, physics driving tips, landing advice, FAQ answers, and no-download browser safety notes.',
      title: 'Blumgi Rocket quick guide',
      summary:
        'Blumgi Rocket is a physics driving game about using rocket boost without losing control. Strong runs come from short bursts, stable landings, and reading the next ramp before holding acceleration.',
      overview: [
        'The rocket boost makes the car feel powerful, but holding it too long often sends the vehicle into a flip. The safest rhythm is boost, release, land flat, then boost again only when the road gives you space.',
        'This page is a compact browser guide for players who like Drive Mad-style balance challenges but want a faster, rocket-powered feel without installing anything.',
      ],
      howToPlay: [
        'Drive through each stage, use boost to clear gaps or climb ramps, and reach the finish without flipping.',
        'Release boost before landing so the vehicle can settle on its wheels.',
        'Use small bursts when the track is narrow or the next platform is close.',
      ],
      controls: [
        { label: 'Accelerate / boost', value: 'Hold the active key or touch control to drive and use rocket power.' },
        { label: 'Release', value: 'Let go before steep landings or when the car starts rotating too far.' },
        { label: 'Retry', value: 'Restart quickly after a flip and adjust boost timing on the next attempt.' },
      ],
      tips: [
        'Boost in bursts; long holds are the main cause of flips.',
        'Land flat before using the next boost, especially after steep ramps.',
        'If you overshoot a platform, reduce boost duration instead of changing the whole route.',
        'On mobile, short taps are easier to control than continuous pressure.',
      ],
      faqs: [
        {
          question: 'How do you stop flipping in Blumgi Rocket?',
          answer:
            'Use shorter boosts and release before the vehicle reaches the top of ramps or starts rotating too far in the air.',
        },
        {
          question: 'Is Blumgi Rocket like Drive Mad?',
          answer:
            'Yes, both reward physics control and quick retries, but Blumgi Rocket adds stronger boost and faster jumps.',
        },
        {
          question: 'Does Blumgi Rocket require a download?',
          answer:
            'No. Play in the browser on Luma and avoid APK, installer, or extension pages.',
        },
      ],
      relatedGuides: [
        {
          slug: 'drive-mad-walkthrough',
          title: 'Drive Mad walkthrough',
          description: 'More physics-driving advice for flips, jumps, and landing control.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'Short browser games with fast retries and readable goals.',
        },
      ],
    },
    zh: {
      metaTitle: 'Blumgi Rocket 在线玩 - 火箭加速操作、落地技巧与安全玩法',
      metaDescription:
        '在线玩 Blumgi Rocket，查看加速操作、物理驾驶技巧、落地建议、FAQ 和免下载浏览器安全说明。',
      title: 'Blumgi Rocket 快速玩法指南',
      summary:
        'Blumgi Rocket 是物理驾驶游戏，核心是使用火箭加速但不失控。更好的跑法来自短促推进、平稳落地，以及在长按加速前先看清下一段坡道。',
      overview: [
        '火箭加速让车辆很有力量，但长按太久经常会直接翻车。更稳的节奏是短促加速、松开、四轮落地，再在路面允许时继续推进。',
        '这个页面适合喜欢 Drive Mad 式平衡挑战、但想要更快火箭推进手感的玩家；全程浏览器游玩，不需要安装任何东西。',
      ],
      howToPlay: [
        '驾驶车辆穿过关卡，用加速越过缺口或爬上坡道，并尽量不翻车到达终点。',
        '落地前提前松开加速，让车辆回到四轮着地。',
        '赛道狭窄或下个平台很近时，用短促推进。',
      ],
      controls: [
        { label: '加速 / 推进', value: '按住当前键盘或触控按钮前进并使用火箭动力。' },
        { label: '松开', value: '陡坡落地前或车辆旋转过度时松开输入。' },
        { label: '重试', value: '翻车后快速重开，并在下一次调整推进时机。' },
      ],
      tips: [
        '用短促推进，长按是最常见的翻车原因。',
        '陡坡后先平稳落地，再进行下一次加速。',
        '如果总是飞过平台，先减少推进时间，不要立刻换整条路线。',
        '手机端短按更容易控制，长按很容易冲过头。',
      ],
      faqs: [
        {
          question: 'Blumgi Rocket 怎么避免翻车？',
          answer: '减少长按推进，在坡顶前或空中旋转过度前松开，让车辆更平稳落地。',
        },
        {
          question: 'Blumgi Rocket 像 Drive Mad 吗？',
          answer: '相似，两者都考验物理控制和短局重试，但 Blumgi Rocket 的加速更强、跳跃更快。',
        },
        {
          question: 'Blumgi Rocket 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩，避开 APK、安装器或扩展页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'drive-mad-walkthrough',
          title: 'Drive Mad 过关攻略',
          description: '更多翻车、跳跃和落地控制的物理驾驶建议。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多重试迅速、目标清晰的短局浏览器游戏。',
        },
      ],
    },
  },
  'adam-and-eve-go': {
    en: {
      metaTitle: 'Adam and Eve Go Online - Controls, Level Tips and Safe Browser Play',
      metaDescription:
        'Play Adam and Eve Go online with movement controls, fruit and key tips, obstacle advice, FAQ answers, and no-download browser safety notes.',
      title: 'Adam and Eve Go quick guide',
      summary:
        'Adam and Eve Go turns the point-and-click series into a simple side-scrolling puzzle platformer. Instead of only clicking scene objects, you move Adam through short levels, collect useful items, avoid hazards, and work out the safest route to Eve.',
      overview: [
        'The best runs come from reading the whole stage before moving too far. Check where the fruit, keys, ladders, doors, creatures, and traps sit, then decide which item must be collected first.',
        'This page focuses on practical browser play. Use it when a level feels blocked, when mobile controls feel cramped, or when you want clear no-download guidance instead of installer or APK prompts.',
      ],
      howToPlay: [
        'Move Adam through each level while collecting fruit, keys, or other required objects.',
        'Watch hazards and creatures before committing to a jump or ladder route.',
        'Reach Eve after the path is clear and the necessary items have been collected.',
      ],
      controls: [
        { label: 'Move', value: 'Use the active arrow keys, WASD keys, or on-screen movement controls.' },
        { label: 'Jump / climb', value: 'Use the browser build controls shown in the game for jumps, ladders, and platforms.' },
        { label: 'Retry', value: 'Restart the level when an item order or hazard timing leaves the route blocked.' },
      ],
      tips: [
        'Collect keys and route-opening items before rushing toward the exit.',
        'Pause at ladders and platform edges so moving hazards reveal their pattern.',
        'If a level seems impossible, check whether you skipped fruit or an object that changes another part of the stage.',
        'On mobile, move in short taps because narrow platforms are easier to overshoot.',
      ],
      faqs: [
        {
          question: 'How is Adam and Eve Go different from the older Adam and Eve games?',
          answer:
            'Adam and Eve Go uses direct movement through small levels, while many older entries are mostly point-and-click scene puzzles.',
        },
        {
          question: 'What should I do when a level is blocked?',
          answer:
            'Look for keys, fruit, ladders, or switches you passed earlier. The solution is usually an item order or route problem, not speed.',
        },
        {
          question: 'Does Adam and Eve Go need a download?',
          answer:
            'No. Play it in the browser on Luma and avoid pages that ask for APKs, installers, or browser extensions.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'Series-wide advice for puzzle order, obstacles, and getting unstuck.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'More quick browser games with simple rules and short levels.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve Go 在线玩 - 操作、关卡路线与安全浏览器玩法',
      metaDescription:
        '在线玩 Adam and Eve Go，查看移动操作、收集物顺序、障碍路线技巧、FAQ 和免下载浏览器安全说明。',
      title: 'Adam and Eve Go 快速玩法指南',
      summary:
        'Adam and Eve Go 把系列从传统点击解谜变成更直接的横版关卡玩法。你需要控制 Adam 穿过短关卡，收集水果、钥匙或其他关键物品，避开危险，并找到通向 Eve 的安全路线。',
      overview: [
        '想稳定过关，先不要急着往前跑。进入关卡后先观察水果、钥匙、梯子、门、动物和陷阱的位置，再判断哪个物品必须先拿。',
        '这个页面关注实际浏览器游玩。当某一关像是被挡住、手机操作显得拥挤，或你想确认不需要下载时，可以把这里当成快速参考。',
      ],
      howToPlay: [
        '控制 Adam 在关卡中移动，并收集水果、钥匙或其他必要物品。',
        '跳跃或爬梯前先观察危险和动物的移动节奏。',
        '路线清理完成、必要物品收集后，到达 Eve 所在位置。',
      ],
      controls: [
        { label: '移动', value: '使用当前游戏显示的方向键、WASD 或屏幕移动按钮。' },
        { label: '跳跃 / 爬梯', value: '根据浏览器版本提示进行跳跃、爬梯和平台移动。' },
        { label: '重试', value: '物品顺序或危险时机导致路线卡死时，重开当前关卡。' },
      ],
      tips: [
        '先拿钥匙和能打开路线的物品，不要只盯着出口。',
        '到梯子和平台边缘先停一下，看清移动危险的规律。',
        '如果关卡看似无解，检查是否漏掉水果或能改变场景的物品。',
        '手机端用短促点按移动，窄平台很容易冲过头。',
      ],
      faqs: [
        {
          question: 'Adam and Eve Go 和早期 Adam and Eve 有什么不同？',
          answer: 'Go 版需要直接移动角色穿过小关卡，而很多早期作品主要是点击场景物体解谜。',
        },
        {
          question: 'Adam and Eve Go 关卡被挡住怎么办？',
          answer: '回头找钥匙、水果、梯子或开关。多数情况是物品顺序或路线选择问题，不是速度不够。',
        },
        {
          question: 'Adam and Eve Go 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩即可，避开要求 APK、安装器或浏览器扩展的页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '覆盖系列物品顺序、障碍处理和卡关思路的通用指南。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多规则简单、关卡较短的浏览器小游戏。',
        },
      ],
    },
  },
  'adam-and-eve-go-2': {
    en: {
      metaTitle: 'Adam and Eve Go 2 Online - Route Tips, Controls and Safe Play',
      metaDescription:
        'Play Adam and Eve Go 2 online with route planning tips, movement controls, item order advice, FAQs, and no-download browser guidance.',
      title: 'Adam and Eve Go 2 quick guide',
      summary:
        'Adam and Eve Go 2 keeps the side-scrolling puzzle format and adds new level layouts that reward cleaner routing. The goal is still simple: collect what the stage asks for, avoid hazards, and guide Adam safely to Eve.',
      overview: [
        'Compared with the first Go game, the sequel puts more pressure on route order. A missed key, fruit, or ladder path can make the end of the level feel blocked even when the solution is only a few steps behind you.',
        'Use this guide to make each attempt more deliberate. It covers controls, route reading, mobile notes, and safe browser play without directing players toward downloads or unofficial clients.',
      ],
      howToPlay: [
        'Scan the level before moving and identify the required collectibles or route unlocks.',
        'Move through platforms carefully, avoiding creatures, gaps, and timed obstacles.',
        'Finish by reaching Eve after the correct item sequence is complete.',
      ],
      controls: [
        { label: 'Move', value: 'Use the keyboard or touch movement controls shown in the embedded game.' },
        { label: 'Jump / interact', value: 'Follow the in-game controls for jumps, ladders, doors, and route objects.' },
        { label: 'Restart', value: 'Retry when the route order leaves Adam trapped or missing an item.' },
      ],
      tips: [
        'Trace the route backward from Eve: what door, ladder, or item must be solved before the final approach?',
        'Do not rush past collectibles near the start; they often matter later.',
        'When an enemy patrols a small space, wait for a full movement cycle before crossing.',
        'If touch controls feel imprecise, play slowly and avoid holding a direction for too long.',
      ],
      faqs: [
        {
          question: 'Is Adam and Eve Go 2 harder than Adam and Eve Go?',
          answer:
            'It uses the same basic controls, but the route order can be less forgiving, especially when keys or collectibles are placed off the direct path.',
        },
        {
          question: 'How do I stop getting stuck near the end of a level?',
          answer:
            'Check whether you skipped a required item earlier. Many late blocks happen because the route was not prepared before reaching the exit.',
        },
        {
          question: 'Can I play Adam and Eve Go 2 without installing anything?',
          answer:
            'Yes. Use the browser player on Luma and avoid third-party download prompts.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'A broader guide to Adam and Eve puzzle logic and spin-off patterns.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'More casual browser games for short, low-pressure sessions.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve Go 2 在线玩 - 路线技巧、操作与安全玩法',
      metaDescription:
        '在线玩 Adam and Eve Go 2，查看路线规划、移动操作、物品顺序、FAQ 和免下载浏览器玩法说明。',
      title: 'Adam and Eve Go 2 快速玩法指南',
      summary:
        'Adam and Eve Go 2 延续横版解谜关卡玩法，并加入更需要路线判断的新布局。目标依然清晰：收集关卡要求的物品，避开危险，把 Adam 安全带到 Eve 身边。',
      overview: [
        '相比第一作，续作更考验路线顺序。漏掉钥匙、水果或某条梯子路线后，关卡末尾可能看似被挡住，但真正答案往往在前面几步。',
        '这个指南帮助你把每次尝试变得更有目的：先读路线，再移动，遇到卡点时检查物品顺序；全程浏览器游玩，不引导下载或第三方客户端。',
      ],
      howToPlay: [
        '移动前先扫一遍关卡，确认必须收集的物品和打开路线的条件。',
        '小心穿过平台、缺口、动物和计时障碍。',
        '完成正确物品顺序后，到达 Eve 所在位置通关。',
      ],
      controls: [
        { label: '移动', value: '使用嵌入游戏显示的键盘或触控移动按钮。' },
        { label: '跳跃 / 互动', value: '根据游戏内提示处理跳跃、梯子、门和路线物体。' },
        { label: '重开', value: '路线顺序错误、角色被困或漏掉物品时重试。' },
      ],
      tips: [
        '从 Eve 的位置倒推路线：最后接近前需要先解决哪扇门、哪段梯子或哪个物品？',
        '不要急着越过开局附近的收集物，它们经常在后面有用。',
        '敌人或危险在小区域巡逻时，先看完一个完整循环再通过。',
        '触屏不够精准时，放慢速度，不要长按方向键。',
      ],
      faqs: [
        {
          question: 'Adam and Eve Go 2 比第一作更难吗？',
          answer: '基础操作相同，但路线顺序更容易出错，尤其是钥匙和收集物不在直线路径上时。',
        },
        {
          question: '为什么我总在关卡末尾卡住？',
          answer: '通常是前面漏掉了必要物品。很多末尾障碍需要提前准备路线，而不是到出口才解决。',
        },
        {
          question: 'Adam and Eve Go 2 不安装可以玩吗？',
          answer: '可以。在 Luma 使用浏览器播放器即可，避开第三方下载提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '覆盖 Adam and Eve 解谜逻辑和衍生玩法的通用指南。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '更多适合短时间轻松打开的休闲浏览器游戏。',
        },
      ],
    },
  },
  'adam-and-eve-go-3': {
    en: {
      metaTitle: 'Adam and Eve Go 3 Online - Item Order, Controls and Level Tips',
      metaDescription:
        'Play Adam and Eve Go 3 online with item-order advice, movement controls, hazard tips, FAQ answers, and safe no-download browser play.',
      title: 'Adam and Eve Go 3 quick guide',
      summary:
        'Adam and Eve Go 3 is a compact route-planning platform puzzle. Each level asks you to move Adam through a small scene, collect the right objects, avoid simple hazards, and keep the path open long enough to reach Eve.',
      overview: [
        'The third Go entry is useful for short sessions because levels are readable, but it still punishes careless movement. If you run straight ahead, you may miss a key item or enter a hazard at the wrong time.',
        'Use this page as a practical checklist: read the route, collect deliberately, time hazards, and keep the experience in the browser rather than chasing downloads elsewhere.',
      ],
      howToPlay: [
        'Identify the exit route, then note which collectibles or doors are required before you can finish.',
        'Move Adam through platforms and ladders without rushing through hazards.',
        'Complete the item order and reach Eve to clear the level.',
      ],
      controls: [
        { label: 'Move', value: 'Use the keyboard or touch controls active in the game frame.' },
        { label: 'Jump / climb', value: 'Use the shown action controls for jumps, ladders, and small platforms.' },
        { label: 'Retry', value: 'Restart quickly when the first route choice blocks progress.' },
      ],
      tips: [
        'Think of every level as an item-order puzzle before treating it like a platformer.',
        'If a collectible sits away from the main path, assume it matters until the level proves otherwise.',
        'Let moving hazards pass once before crossing, especially on mobile.',
        'Avoid unknown APK or extension pages; the browser version is enough for normal play.',
      ],
      faqs: [
        {
          question: 'What is the main strategy for Adam and Eve Go 3?',
          answer:
            'Plan the item order first. Most problems come from collecting in the wrong sequence or skipping a route-opening object.',
        },
        {
          question: 'Is Adam and Eve Go 3 good for quick play?',
          answer:
            'Yes. Levels are short, but they still have enough route logic to feel more satisfying than a simple runner.',
        },
        {
          question: 'Is Adam and Eve Go 3 safe to play online?',
          answer:
            'Use the browser player on Luma and avoid pages that request downloads, installers, or extensions.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'Series guidance for puzzle chains, route blockers, and common stuck points.',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: 'Best browser games for a 5-minute break',
          description: 'More browser games that start quickly and stop cleanly.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve Go 3 在线玩 - 物品顺序、操作与关卡技巧',
      metaDescription:
        '在线玩 Adam and Eve Go 3，查看物品顺序、移动操作、障碍技巧、FAQ 和免下载安全浏览器玩法。',
      title: 'Adam and Eve Go 3 快速玩法指南',
      summary:
        'Adam and Eve Go 3 是短小的路线规划平台解谜。每关都要控制 Adam 穿过小场景，收集正确物品，避开简单危险，并保持路线通畅直到见到 Eve。',
      overview: [
        '第三部 Go 适合短时间游玩，因为关卡容易读懂，但它仍然会惩罚粗心移动。一路往前冲，可能会漏掉关键物品，或在错误时机进入危险区域。',
        '这个页面可以当作实用检查表：先读路线，有目的地收集，看清危险节奏，并坚持使用浏览器版本，不去追逐其他站点的下载提示。',
      ],
      howToPlay: [
        '先确认出口路线，再判断通关前需要哪些收集物或门。',
        '控制 Adam 穿过平台和梯子，不要急着冲过危险。',
        '完成物品顺序后到达 Eve 即可过关。',
      ],
      controls: [
        { label: '移动', value: '使用游戏框内当前启用的键盘或触控控制。' },
        { label: '跳跃 / 爬梯', value: '根据画面提示处理跳跃、梯子和小平台。' },
        { label: '重试', value: '第一条路线选择导致卡死时，快速重开。' },
      ],
      tips: [
        '先把每关当成物品顺序谜题，再当成平台游戏。',
        '如果收集物偏离主路线，先默认它有用，除非关卡证明不需要。',
        '移动危险经过一次后再通过，手机端尤其要慢一点。',
        '避开未知 APK 或扩展页面，浏览器版足够正常游玩。',
      ],
      faqs: [
        {
          question: 'Adam and Eve Go 3 的核心策略是什么？',
          answer: '先规划物品顺序。多数问题来自收集顺序错误，或漏掉了打开路线的对象。',
        },
        {
          question: 'Adam and Eve Go 3 适合短时间玩吗？',
          answer: '适合。关卡较短，但仍有路线逻辑，比纯跑酷更有解谜感。',
        },
        {
          question: 'Adam and Eve Go 3 在线玩安全吗？',
          answer: '使用 Luma 浏览器播放器即可，避开要求下载、安装器或扩展的页面。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '覆盖谜题链条、路线阻碍和常见卡关点的系列指南。',
        },
        {
          slug: 'best-browser-games-5-minute-break',
          title: '适合 5 分钟休息的浏览器游戏',
          description: '更多启动快、容易停下来的浏览器游戏。',
        },
      ],
    },
  },
  'adam-and-eve-go-xmas': {
    en: {
      metaTitle: 'Adam and Eve Go Xmas Online - Holiday Level Tips and Safe Play',
      metaDescription:
        'Play Adam and Eve Go Xmas online with holiday route tips, movement controls, collectible advice, FAQs, and no-download browser safety notes.',
      title: 'Adam and Eve Go Xmas quick guide',
      summary:
        'Adam and Eve Go Xmas is the seasonal version of the Go-style Adam and Eve levels. It keeps the same short route-planning structure, but wraps it in holiday scenes where gifts, platforms, and obstacles still need the right order.',
      overview: [
        'Do not let the festive theme make you rush. The level logic is still about reading paths, checking collectibles, and timing movement through hazards before Adam reaches Eve.',
        'This guide is for players who want a quick browser session with clear controls and safe play notes. It avoids download framing and focuses on what actually helps during a stuck holiday level.',
      ],
      howToPlay: [
        'Move Adam through the Xmas-themed stage and collect the required items.',
        'Check whether a gift, key, door, or platform must be handled before the final route opens.',
        'Avoid hazards and reach Eve once the route is prepared.',
      ],
      controls: [
        { label: 'Move', value: 'Use the active keyboard or on-screen movement controls.' },
        { label: 'Jump / route actions', value: 'Follow the in-game controls for platforms, ladders, and route objects.' },
        { label: 'Restart', value: 'Retry when you miss a required item or mistime a hazard.' },
      ],
      tips: [
        'Treat gifts and seasonal objects as possible puzzle items, not just decoration.',
        'Look at the whole route before collecting the first nearby item.',
        'When a hazard repeats, wait for the slowest safe crossing instead of forcing it.',
        'Keep the game in the browser; no seasonal version should require an installer.',
      ],
      faqs: [
        {
          question: 'Is Adam and Eve Go Xmas a separate game?',
          answer:
            'Yes, it is a holiday-themed Go entry with familiar movement and route-planning mechanics.',
        },
        {
          question: 'How do I solve Xmas levels faster?',
          answer:
            'Identify required items first, then move through the route in order. Seasonal objects may still be part of the puzzle.',
        },
        {
          question: 'Does Adam and Eve Go Xmas require a download?',
          answer:
            'No. Play in the browser on Luma and avoid APK, installer, or extension prompts.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'General Adam and Eve puzzle and route-solving advice.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'More quick browser games for casual sessions.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve Go Xmas 在线玩 - 节日关卡技巧与安全玩法',
      metaDescription:
        '在线玩 Adam and Eve Go Xmas，查看节日路线技巧、移动操作、收集物建议、FAQ 和免下载浏览器安全说明。',
      title: 'Adam and Eve Go Xmas 快速玩法指南',
      summary:
        'Adam and Eve Go Xmas 是 Go 风格关卡的节日版本。它保留短路线规划结构，只是把场景换成圣诞主题；礼物、平台和障碍依然需要按正确顺序处理。',
      overview: [
        '不要因为节日主题看起来轻松就一路冲。关卡逻辑仍然是先读路线、检查收集物、看清危险节奏，再让 Adam 到达 Eve。',
        '这个指南适合想快速玩一局浏览器节日关卡的玩家，重点放在操作、路线和安全游玩说明，不引导下载或安装。',
      ],
      howToPlay: [
        '控制 Adam 穿过圣诞主题关卡，并收集必要物品。',
        '检查礼物、钥匙、门或平台是否需要在最终路线前先处理。',
        '避开危险，准备好路线后到达 Eve。',
      ],
      controls: [
        { label: '移动', value: '使用当前键盘或屏幕移动按钮。' },
        { label: '跳跃 / 路线动作', value: '根据游戏提示处理平台、梯子和路线物体。' },
        { label: '重开', value: '漏掉必要物品或危险时机错误时重试。' },
      ],
      tips: [
        '礼物和节日物件也可能是谜题物品，不只是装饰。',
        '先看完整路线，再拿第一个最近的物品。',
        '危险循环出现时，等最稳的空档通过，不要硬冲。',
        '保持浏览器游玩，节日版本也不应该要求安装器。',
      ],
      faqs: [
        {
          question: 'Adam and Eve Go Xmas 是单独游戏吗？',
          answer: '是，它是带圣诞主题的 Go 系列作品，操作和路线规划机制仍然熟悉。',
        },
        {
          question: 'Adam and Eve Go Xmas 怎么更快过关？',
          answer: '先确认必要物品，再按顺序走路线。节日物件也可能参与解谜。',
        },
        {
          question: 'Adam and Eve Go Xmas 需要下载吗？',
          answer: '不需要。在 Luma 浏览器里直接玩，避开 APK、安装器或扩展提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '通用 Adam and Eve 解谜和路线规划建议。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '更多适合休闲短局的浏览器游戏。',
        },
      ],
    },
  },
  'adam-and-eve-night': {
    en: {
      metaTitle: 'Adam and Eve Night Online - Spooky Puzzle Tips and Safe Browser Play',
      metaDescription:
        'Play Adam and Eve Night online with scene-puzzle controls, spooky object-order tips, FAQ answers, and safe no-download browser guidance.',
      title: 'Adam and Eve Night quick guide',
      summary:
        'Adam and Eve Night is a darker seasonal point-and-click entry in the Adam and Eve series. The tone changes, but the useful solving habit stays familiar: inspect the blocker, test nearby objects, watch what changes, then continue the chain.',
      overview: [
        'The night theme can make objects harder to notice, so slow scanning matters more than fast clicking. Small background details, creatures, or props may become the next step after another action changes the scene.',
        'Use this page as a safe browser-play companion. It gives enough structure for stuck scenes without pushing downloads, horror bait, or unrelated installers.',
      ],
      howToPlay: [
        'Inspect the whole scene and identify what keeps Adam from moving forward.',
        'Click or tap likely objects one at a time, then wait for the full reaction.',
        'Use each change as the clue for the next object until the path opens.',
      ],
      controls: [
        { label: 'Interact', value: 'Click with a mouse or tap on touchscreens to use scene objects.' },
        { label: 'Observe', value: 'Wait after each action so hidden changes are not missed.' },
        { label: 'Restart', value: 'Reset the scene if the click order becomes confusing.' },
      ],
      tips: [
        'Scan dark corners and background props; the night palette can hide useful objects.',
        'Do not repeatedly click Adam. Solve the obstacle in front of him first.',
        'If a creature blocks the route, look for what distracts, moves, or scares it.',
        'Keep play in the browser and avoid pages that turn the game into a download.',
      ],
      faqs: [
        {
          question: 'Is Adam and Eve Night scary?',
          answer:
            'It has a spooky seasonal style, but it still plays like a light point-and-click puzzle rather than a horror game.',
        },
        {
          question: 'How do I find hidden objects in Adam and Eve Night?',
          answer:
            'Start near the blocker, then scan dark edges and background props. Watch animations because new objects can become useful after a click.',
        },
        {
          question: 'Can I play Adam and Eve Night safely online?',
          answer:
            'Yes. Use the browser player on Luma and avoid APK, installer, or extension prompts.',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve walkthrough',
          description: 'Point-and-click solving habits for the broader Adam and Eve series.',
        },
        {
          slug: 'games-to-play-when-bored',
          title: 'Games to play when bored',
          description: 'More relaxed browser games for short sessions.',
        },
      ],
    },
    zh: {
      metaTitle: 'Adam and Eve Night 在线玩 - 夜间解谜技巧与安全浏览器玩法',
      metaDescription:
        '在线玩 Adam and Eve Night，查看场景点击操作、夜间物品顺序技巧、FAQ 和免下载浏览器安全说明。',
      title: 'Adam and Eve Night 快速玩法指南',
      summary:
        'Adam and Eve Night 是 Adam and Eve 系列里氛围更暗的季节点击解谜作品。画面风格变了，但有效思路仍然熟悉：先看挡路点，测试附近物体，观察变化，再沿着连锁反应继续。',
      overview: [
        '夜间主题会让某些物体不那么显眼，所以慢慢扫描比快速乱点更重要。小背景细节、动物或道具，可能要在前一个动作改变场景后才会变得有用。',
        '这个页面可以作为安全浏览器游玩的参考：帮你理解卡关场景，但不引导下载、恐怖噱头或无关安装器。',
      ],
      howToPlay: [
        '先检查整个场景，找出阻止 Adam 前进的原因。',
        '一次点击或点按一个可能对象，然后等完整反应结束。',
        '把每次变化当成下一步线索，直到路线打开。',
      ],
      controls: [
        { label: '互动', value: '用鼠标点击或触屏点按场景物体。' },
        { label: '观察', value: '每次操作后等一下，避免漏掉隐藏变化。' },
        { label: '重开', value: '点击顺序变得混乱时，重置当前场景。' },
      ],
      tips: [
        '仔细扫暗角和背景道具，夜间配色可能会藏住有用物品。',
        '不要反复点击 Adam 本人，先解决他前方的障碍。',
        '如果动物挡路，找能吸引、移动或吓走它的对象。',
        '保持浏览器游玩，避开把游戏包装成下载的页面。',
      ],
      faqs: [
        {
          question: 'Adam and Eve Night 吓人吗？',
          answer: '它有夜间和轻微 spooky 风格，但玩法仍然是轻量点击解谜，不是恐怖游戏。',
        },
        {
          question: 'Adam and Eve Night 怎么找隐藏物体？',
          answer: '从挡路点附近开始，再扫暗色边缘和背景道具；注意动画变化，因为新对象可能在点击后才有用。',
        },
        {
          question: 'Adam and Eve Night 可以安全在线玩吗？',
          answer: '可以。使用 Luma 浏览器播放器即可，避开 APK、安装器或扩展提示。',
        },
      ],
      relatedGuides: [
        {
          slug: 'adam-and-eve-walkthrough',
          title: 'Adam and Eve 系列攻略',
          description: '覆盖更广 Adam and Eve 系列的点击解谜习惯。',
        },
        {
          slug: 'games-to-play-when-bored',
          title: '无聊时可玩的浏览器小游戏',
          description: '更多适合短时间放松的浏览器游戏。',
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
