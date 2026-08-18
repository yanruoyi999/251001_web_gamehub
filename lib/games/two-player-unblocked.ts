export type TwoPlayerMobileSupport = 'supported' | 'limited' | 'unsupported';
export type TwoPlayerGenre = 'Arcade' | 'Racing' | 'Puzzle';

export interface TwoPlayerGame {
  slug: string;
  title: {
    en: string;
    zh: string;
  };
  summary: {
    en: string;
    zh: string;
  };
  genre: TwoPlayerGenre;
  mode: 'same-keyboard' | 'local-turn-based';
  players: 2;
  playerOneControls: string;
  playerTwoControls: string;
  runtimePath: string;
  thumbnailPath: string;
  mobileSupport: TwoPlayerMobileSupport;
  accountRequired: false;
  downloadRequired: false;
  extraNetworkResources: false;
  author: string;
  sourceUrl: string;
  sourceRevision: string;
  license: string;
  licenseNoticePath: string;
  provenanceStatus: 'approved';
}

export const TWO_PLAYER_GAMES: TwoPlayerGame[] = [
  {
    slug: 'classic-pong-duel',
    title: {
      en: 'Classic Pong Duel',
      zh: '经典 Pong 双人对战',
    },
    summary: {
      en: 'A same-keyboard Pong duel with one paddle per player and quick first-to-score rounds.',
      zh: '两名玩家共用一个键盘，各控制一侧球拍，进行节奏很快的 Pong 对战。',
    },
    genre: 'Arcade',
    mode: 'same-keyboard',
    players: 2,
    playerOneControls: 'W / S',
    playerTwoControls: 'Arrow Up / Arrow Down',
    runtimePath: '/games-runtime/classic-pong-duel/index.html',
    thumbnailPath: '/games-runtime/classic-pong-duel/preview.svg',
    mobileSupport: 'unsupported',
    accountRequired: false,
    downloadRequired: false,
    extraNetworkResources: false,
    author: 'James Nikolson; Luma integration changes',
    sourceUrl: 'https://github.com/sleepyrob0t/Two-Player-Pong',
    sourceRevision: 'a8f4034e49d875a26d5b6b83833429f28453f9e4',
    license: 'MIT',
    licenseNoticePath: '/games-runtime/classic-pong-duel/LICENSE.txt',
    provenanceStatus: 'approved',
  },
  {
    slug: 'key-sprint-duel',
    title: {
      en: 'Key Sprint Duel',
      zh: '按键冲刺双人赛',
    },
    summary: {
      en: 'An original two-player keyboard sprint: alternate your two keys cleanly to reach the finish first.',
      zh: 'Luma 原创双人键盘竞速：两名玩家分别交替按自己的两个按键，先冲线者获胜。',
    },
    genre: 'Racing',
    mode: 'same-keyboard',
    players: 2,
    playerOneControls: 'A / D (alternate)',
    playerTwoControls: 'Left / Right (alternate)',
    runtimePath: '/games-runtime/key-sprint-duel/index.html',
    thumbnailPath: '/games-runtime/key-sprint-duel/preview.svg',
    mobileSupport: 'unsupported',
    accountRequired: false,
    downloadRequired: false,
    extraNetworkResources: false,
    author: 'Luma Game Hub',
    sourceUrl: 'https://github.com/yanruoyi999/251001_web_gamehub',
    sourceRevision: 'luma-original-2026-08-18-key-sprint-duel',
    license: 'Luma Original / MIT',
    licenseNoticePath: '/games-runtime/key-sprint-duel/LICENSE.txt',
    provenanceStatus: 'approved',
  },
  {
    slug: 'grid-claim-duel',
    title: {
      en: 'Grid Claim Duel',
      zh: '方格争夺双人赛',
    },
    summary: {
      en: 'An original local puzzle duel where players take turns moving a cursor and claiming empty cells.',
      zh: 'Luma 原创本地双人益智对战：双方轮流移动光标占领空格，棋盘填满后比较领地。',
    },
    genre: 'Puzzle',
    mode: 'local-turn-based',
    players: 2,
    playerOneControls: 'WASD + F',
    playerTwoControls: 'Arrow keys + Enter',
    runtimePath: '/games-runtime/grid-claim-duel/index.html',
    thumbnailPath: '/games-runtime/grid-claim-duel/preview.svg',
    mobileSupport: 'unsupported',
    accountRequired: false,
    downloadRequired: false,
    extraNetworkResources: false,
    author: 'Luma Game Hub',
    sourceUrl: 'https://github.com/yanruoyi999/251001_web_gamehub',
    sourceRevision: 'luma-original-2026-08-18-grid-claim-duel',
    license: 'Luma Original / MIT',
    licenseNoticePath: '/games-runtime/grid-claim-duel/LICENSE.txt',
    provenanceStatus: 'approved',
  },
];

export function getTwoPlayerGame(slug: string): TwoPlayerGame | undefined {
  return TWO_PLAYER_GAMES.find((game) => game.slug === slug);
}
