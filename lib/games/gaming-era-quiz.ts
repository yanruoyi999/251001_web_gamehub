export const gamingEraQuiz = {
  title: {
    zh: '你的游戏记忆属于哪个年代？',
    en: 'Which gaming era feels like home?',
  },
  intro: {
    zh: '五个选择，看看你更偏爱街机厅、客厅主机，还是在线联机。本测验只看你的玩法偏好，不推断真实年龄。无需账号或照片。',
    en: 'Make five choices to find your gaming era: arcade halls, couch co-op or online worlds. This quiz explores your taste and never estimates your real age. No account or photo needed.',
  },
  questions: [
    {
      prompt: {
        zh: '又有二十分钟可玩，你想打开什么？',
        en: 'You have twenty minutes to play. What do you load up?',
      },
      choices: [
        {
          zh: '再投一枚币，冲一次本机最高分',
          en: 'One more credit to beat the local high score',
        },
        {
          zh: '从记忆卡读档，接着探索昨天的地图',
          en: 'Load a memory card and explore yesterday’s map',
        },
        {
          zh: '进好友房，看看今晚还有谁在线',
          en: 'Join a lobby and see who is around',
        },
      ],
    },
    {
      prompt: {
        zh: '一位朋友想加入，你把什么递给对方？',
        en: 'A friend wants in. What do you hand them?',
      },
      choices: [
        {
          zh: '排下一局用的代币',
          en: 'A token to claim the next turn',
        },
        {
          zh: '沙发上的第二只手柄',
          en: 'The spare controller on the sofa',
        },
        {
          zh: '能直接加入的房间码',
          en: 'A room code to jump right in',
        },
      ],
    },
    {
      prompt: {
        zh: '碰到很难的一关，你最想怎么找线索？',
        en: 'You get stuck. Where do you look for a clue?',
      },
      choices: [
        {
          zh: '站在旁边，观察上一位玩家怎么走位',
          en: 'Watch the player at the next cabinet',
        },
        {
          zh: '翻开折角的攻略，找手绘地图',
          en: 'Unfold a dog-eared guide and its hand-drawn map',
        },
        {
          zh: '请联机队友标出下一个目标',
          en: 'Ask a teammate to mark the next objective',
        },
      ],
    },
    {
      prompt: {
        zh: '终于过关，你最想留住哪一刻？',
        en: 'You clear the stage. What would you save?',
      },
      choices: [
        {
          zh: '把三个字母留在高分榜首',
          en: 'Stamp three initials on the leaderboard',
        },
        {
          zh: '圈出通关地图，夹进游戏盒',
          en: 'Circle the final room on a map and tuck it into the box',
        },
        {
          zh: '把全队逆转的十秒剪给朋友',
          en: 'Send friends a ten-second clip of the team comeback',
        },
      ],
    },
    {
      prompt: {
        zh: '周六晚上，哪种比赛最想参加？',
        en: 'Which Saturday-night challenge sounds best?',
      },
      choices: [
        {
          zh: '一条命轮流上场，围观的人帮忙数分',
          en: 'A one-life challenge with onlookers counting the score',
        },
        {
          zh: '朋友带手柄来家里，输的人换位',
          en: 'A living-room bracket where the loser passes the pad',
        },
        {
          zh: '几座城市的队友同步开一场合作挑战',
          en: 'A co-op challenge with friends in several cities',
        },
      ],
    },
  ],
  eras: [
    {
      name: {
        zh: '街机厅',
        en: 'the arcade hall',
      },
      description: {
        zh: '你喜欢一局见分晓的挑战，也享受旁观者一起数分。',
        en: 'You enjoy a challenge decided in one run and a crowd following the score.',
      },
    },
    {
      name: {
        zh: '客厅主机',
        en: 'couch co-op',
      },
      description: {
        zh: '你的选择偏向本地存档、共用屏幕和触手可及的搭档。',
        en: 'Your picks lean toward local saves, shared screens and a partner within reach.',
      },
    },
    {
      name: {
        zh: '在线联机',
        en: 'online worlds',
      },
      description: {
        zh: '房间码、队友和分享精彩片段最对你的胃口。',
        en: 'Lobbies, teammates and shareable highlights fit your play style.',
      },
    },
  ],
} as const;
