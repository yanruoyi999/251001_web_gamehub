import type { Locale } from '@/i18n/config';
import type { SeoLandingPage } from '@/lib/seo-landing-content';

type ChainWords = readonly [string, string, string, string, string, string];

interface WordChainPuzzle {
  words: ChainWords;
  links: readonly { phrase: string; meaning: Record<Locale, string> }[];
}

export const WORD_CHAIN_PUZZLES: readonly WordChainPuzzle[] = [
  {
    words: ['door', 'bell', 'tower', 'block', 'party', 'hat'],
    links: [
      {
        phrase: 'doorbell',
        meaning: {
          en: 'A bell announcing a visitor.',
          zh: '门铃，用来提醒有人来访。',
        },
      },
      {
        phrase: 'bell tower',
        meaning: {
          en: 'A tower housing bells.',
          zh: '钟楼，内部悬挂一口或多口钟。',
        },
      },
      {
        phrase: 'tower block',
        meaning: {
          en: 'A UK term for a high-rise apartment building.',
          zh: '英式用语，指高层公寓楼。',
        },
      },
      {
        phrase: 'block party',
        meaning: {
          en: 'A party for neighbourhood residents.',
          zh: '同一街区居民一起参加的聚会。',
        },
      },
      {
        phrase: 'party hat',
        meaning: {
          en: 'A hat worn at celebrations.',
          zh: '庆祝活动中戴的派对帽。',
        },
      },
    ],
  },
  {
    words: ['rain', 'coat', 'pocket', 'watch', 'dog', 'house'],
    links: [
      {
        phrase: 'raincoat',
        meaning: {
          en: 'A coat for rainy weather.',
          zh: '雨衣，用于挡雨的外套。',
        },
      },
      {
        phrase: 'coat pocket',
        meaning: { en: 'A pocket in a coat.', zh: '外套上的口袋。' },
      },
      {
        phrase: 'pocket watch',
        meaning: {
          en: 'A watch carried in a pocket.',
          zh: '放在口袋中携带的怀表。',
        },
      },
      {
        phrase: 'watchdog',
        meaning: {
          en: 'A dog that guards a property.',
          zh: '负责看守房屋或场所的看门狗。',
        },
      },
      {
        phrase: 'doghouse',
        meaning: {
          en: 'An outdoor shelter for a dog.',
          zh: '供狗休息的小型户外狗屋。',
        },
      },
    ],
  },
  {
    words: ['snow', 'ball', 'room', 'service', 'station', 'master'],
    links: [
      {
        phrase: 'snowball',
        meaning: { en: 'Snow pressed into a ball.', zh: '把雪压成的雪球。' },
      },
      {
        phrase: 'ballroom',
        meaning: {
          en: 'A large room for dancing.',
          zh: '供人跳舞的大型舞厅。',
        },
      },
      {
        phrase: 'room service',
        meaning: {
          en: 'Hotel meals delivered to a room.',
          zh: '酒店把餐食或饮料送到客房的服务。',
        },
      },
      {
        phrase: 'service station',
        meaning: {
          en: 'A fuel stop, sometimes offering repairs.',
          zh: '提供燃油，有时也提供车辆维修的服务站。',
        },
      },
      {
        phrase: 'stationmaster',
        meaning: {
          en: 'The railway official responsible for a station.',
          zh: '负责管理火车站的铁路工作人员，即站长。',
        },
      },
    ],
  },
  {
    words: ['beach', 'ball', 'game', 'night', 'light', 'bulb'],
    links: [
      {
        phrase: 'beach ball',
        meaning: {
          en: 'An inflatable ball for beach play.',
          zh: '适合沙滩玩耍的轻型充气球。',
        },
      },
      {
        phrase: 'ball game',
        meaning: {
          en: 'A game using a ball.',
          zh: '使用球来进行的游戏或运动。',
        },
      },
      {
        phrase: 'game night',
        meaning: {
          en: 'An evening for playing games.',
          zh: '专门安排来一起玩游戏的夜晚。',
        },
      },
      {
        phrase: 'nightlight',
        meaning: {
          en: 'A small lamp for nighttime.',
          zh: '夜间留着照明的小夜灯。',
        },
      },
      {
        phrase: 'light bulb',
        meaning: {
          en: 'The light source in a lamp.',
          zh: '灯具中可更换的发光灯泡。',
        },
      },
    ],
  },
  {
    words: ['house', 'plant', 'pot', 'hole', 'punch', 'line'],
    links: [
      {
        phrase: 'houseplant',
        meaning: { en: 'A plant grown indoors.', zh: '在室内养的植物。' },
      },
      {
        phrase: 'plant pot',
        meaning: { en: 'A container for a plant.', zh: '用来种植物的花盆。' },
      },
      {
        phrase: 'pothole',
        meaning: {
          en: 'A damaged hollow in a road.',
          zh: '路面损坏后形成的坑洞。',
        },
      },
      {
        phrase: 'hole punch',
        meaning: {
          en: 'A tool for punching paper holes.',
          zh: '给纸张打孔的打孔器。',
        },
      },
      {
        phrase: 'punchline',
        meaning: {
          en: 'A joke’s final, funny words.',
          zh: '笑话结尾引出笑点的那句话。',
        },
      },
    ],
  },
  {
    words: ['school', 'bus', 'stop', 'sign', 'post', 'card'],
    links: [
      {
        phrase: 'school bus',
        meaning: {
          en: 'A bus carrying school pupils.',
          zh: '接送学生的校车。',
        },
      },
      {
        phrase: 'bus stop',
        meaning: {
          en: 'A place to board a bus.',
          zh: '指定供人上下公交车的站点。',
        },
      },
      {
        phrase: 'stop sign',
        meaning: {
          en: 'A sign ordering drivers to stop.',
          zh: '要求驾驶者停车的道路标志。',
        },
      },
      {
        phrase: 'signpost',
        meaning: {
          en: 'A post bearing direction signs.',
          zh: '装有方向标志的路标柱。',
        },
      },
      {
        phrase: 'postcard',
        meaning: {
          en: 'A card mailed without an envelope.',
          zh: '无需信封即可邮寄的明信片。',
        },
      },
    ],
  },
  {
    words: ['foot', 'ball', 'park', 'bench', 'press', 'room'],
    links: [
      {
        phrase: 'football',
        meaning: {
          en: 'A sport whose exact rules depend on the region.',
          zh: '一种球类运动；具体指哪种足球取决于地区。',
        },
      },
      {
        phrase: 'ballpark',
        meaning: {
          en: 'A ground for playing baseball.',
          zh: '用于打棒球的球场。',
        },
      },
      {
        phrase: 'park bench',
        meaning: { en: 'A public seat in a park.', zh: '公园里供人坐的长椅。' },
      },
      {
        phrase: 'bench press',
        meaning: {
          en: 'A weightlifting exercise on a bench.',
          zh: '躺在训练凳上推举重量的卧推动作。',
        },
      },
      {
        phrase: 'pressroom',
        meaning: {
          en: 'A printing room or journalists’ workspace.',
          zh: '可以指印刷车间，也可以指记者工作室。',
        },
      },
    ],
  },
  {
    words: ['moon', 'light', 'house', 'boat', 'yard', 'sale'],
    links: [
      {
        phrase: 'moonlight',
        meaning: { en: 'Light from the moon.', zh: '月亮照来的月光。' },
      },
      {
        phrase: 'lighthouse',
        meaning: {
          en: 'A tower guiding ships with light.',
          zh: '用灯光为船只指引方向的灯塔。',
        },
      },
      {
        phrase: 'houseboat',
        meaning: {
          en: 'A boat fitted as a home.',
          zh: '布置成居住空间的船屋。',
        },
      },
      {
        phrase: 'boatyard',
        meaning: {
          en: 'A place building or repairing boats.',
          zh: '建造或修理船只的船厂。',
        },
      },
      {
        phrase: 'yard sale',
        meaning: {
          en: 'Household belongings sold outside a home.',
          zh: '在自家屋外出售闲置物品的庭院旧货售卖。',
        },
      },
    ],
  },
];

export function getWordChainClues(words: ChainWords): string[] {
  return words.map((word, index) =>
    index === 0 || index === words.length - 1
      ? word
      : word[0] + '_'.repeat(word.length - 1)
  );
}

export const WORD_CHAIN_GUIDE: SeoLandingPage = {
  slug: 'word-chain-game-examples',
  primaryKeyword: 'word chain game examples',
  keywords: [
    'word chain game examples',
    'word chain game examples with answers',
    'word chain puzzles with answers',
    'compound word chain',
  ],
  updatedAt: '2026-10-31T10:03:11+08:00',
  relatedSlugs: ['word-games-for-seniors', 'categories-game-topics'],
  interactiveWidget: 'word-chain-examples',
  locales: {
    en: {
      metaTitle: 'Word Chain Game Examples: 8 Puzzles with Answers',
      metaDescription:
        'Try 8 original word chain game examples with first-letter and length clues, reveal each answer, and check all five compound or phrase links in every puzzle.',
      heading: 'Word Chain Game Examples: 8 Puzzles with Answers',
      subheading:
        'Eight original English phrase chains, with four missing words in each puzzle.',
      overview: [],
      sections: [
        {
          title: 'Join neighbouring words into familiar phrases',
          body: 'Keep the end words. Fill four gaps using the first letters and lengths. Each neighbouring pair, read forwards, must form a familiar compound or established phrase: door → bell gives doorbell. CardYard’s rule reference below describes this format.',
        },
        {
          title: 'How to solve from both ends',
          body: 'List familiar partners matching either end clue. From DOOR, a four-letter B word suggests BELL. Before HAT, a five-letter P word suggests PARTY. Then check the middle: each candidate must work with both neighbours. Replace guesses that break the chain.',
        },
        {
          title: 'Check the links, not just the letters',
          body: 'Read each pair aloud and explain its meaning; matching letters alone prove nothing. Joined compounds such as doorbell and spaced phrases such as bell tower both count. Dialect and spelling vary: tower block is British, while ballpark is especially familiar in American English.',
        },
        {
          title: 'A different last-letter word chain',
          body: 'Last-letter chains use the final letter to start the next word: lamp → pear → road → desk. Those pairs need not form phrases. PlayWordChain’s FAQ distinguishes styles; agree on yours first. These eight puzzles use compound and phrase links.',
        },
        {
          title: 'Make your own six-word chain',
          body: 'Write six words with five natural links, then ask someone else to try them. Keep the end words and replace middle words with first letters and matching blanks. Avoid unfamiliar expressions; use a shared dictionary for doubtful phrases.',
        },
        {
          title: 'Optional turns and scoring',
          body: 'Solve alone, take turns suggesting words, or cooperate on paper. Optional house rules: one point per accepted link, up to five; agree on hints, alternative answers and passes beforehand. No timer is required. The page does not judge or score.',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: 'Is the revealed answer the only solution?',
          answer:
            'It is one valid solution. Accept alternatives matching every clue with five natural forward pairs. Discuss disputed meanings.',
        },
        {
          question: 'Can we play without JavaScript?',
          answer:
            'Yes. Clues and answers are in the page. Open a reveal control or copy clues onto paper.',
        },
        {
          question: 'Can I translate the puzzles into another language?',
          answer:
            'Translate instructions, but rebuild puzzles with expressions in that language. English letter lengths cannot transfer directly into Chinese characters.',
        },
      ],
      quickAnswerLink: {
        href: 'https://www.cardyard.ai/word-chain-game-rules',
        label: 'CardYard: compound-chain rules',
        description:
          'Primary rule reference for joining consecutive words into compounds and phrases.',
      },
      externalLinks: [
        {
          href: 'https://playwordchain.com/faq',
          label: 'PlayWordChain: word-chain FAQ',
          description:
            'Compare the compound and last-letter styles before choosing rules. These eight puzzle boards are original.',
        },
      ],
      ctaLabel: 'Browse more games',
      ctaDescription:
        'For other word activities, use the related guides below.',
    },
    zh: {
      metaTitle: '英语复合词接龙练习：8题附答案',
      metaDescription:
        '8道原创英语复合词接龙练习，保留首尾词，按首字母与长度补全中间四词。逐题展开答案，核对五组复合词或固定短语，并阅读中文解释。',
      heading: '英语复合词接龙练习：8题附答案',
      subheading: '题目使用英语单词，说明与释义使用中文；每题补全四个词。',
      overview: [],
      sections: [
        {
          title: '让相邻两个词组成常见表达',
          body: '保留首尾词，按提示的首字母和单词长度补全中间四词。每两个相邻词都要按从左到右的顺序组成常见复合词或固定短语，例如 door → bell 合成 doorbell（门铃）。这里采用下方 CardYard 规则来源介绍的复合词与短语接龙形式。',
        },
        {
          title: '可以从两端一起推',
          body: '先从任一已知词想搭配，再核对下一个词的首字母和长度。DOOR 后的四字母 B 开头词可以想到 BELL；HAT 前的五字母 P 开头词可以想到 PARTY。随后检查中间连接：一个候选词需要同时和左右邻词搭配，不能只看其中一边。整条链不通时，再换一个词。',
        },
        {
          title: '不只核对字母，还要核对词义',
          body: '首字母与长度符合只是第一步。把每对词读出来，说明组合后的含义。doorbell 这类连写复合词与 bell tower 这类分写短语在本页都算有效连接。方言和拼写可能不同：tower block 是英式的高层公寓楼说法，ballpark 则常见于美式英语。',
        },
        {
          title: '与末字母接龙区分',
          body: '另一种英语接龙让前词的末字母成为后词的首字母，例如 lamp → pear → road → desk；相邻词不需要组成短语。PlayWordChain 的 FAQ 区分了接龙形式，开始前应先说清采用哪一种。上方八题始终使用复合词与短语连接，不使用这条独立的字母规则。',
        },
        {
          title: '自己设计一条六词链',
          body: '先写六个词，确认五个连接都是自然表达，再隐藏答案。逐对核对短语，并请另一人试做。保留首尾词，把每个中间词改成首字母与对应数量的空格。除非大家熟悉，尽量避开生僻用法；对某个短语有疑问时，可以共同查词典确认。不能把英语字母题直接逐字翻成汉语。',
        },
        {
          title: '轮流与计分都可自行约定',
          body: '可以独自解题、轮流提一个词，或在纸上合作。一种可选家庭规则是每个被接受的连接得一分，每条链最多五分。是否允许提示、替代答案和跳过，需要开始前商量。没有必须使用的计时器，页面不自动判答案，也不保存分数。',
        },
      ],
      recommendations: [],
      faqs: [
        {
          question: '展开后的答案是唯一解吗？',
          answer:
            '这是一组有效解。其他答案只要符合所有首字母和长度提示，且五个顺序连接都属于自然表达，也可以接受。有争议时一起解释词义。',
        },
        {
          question: '关闭 JavaScript 后还能玩吗？',
          answer:
            '可以。题目、答案和解释都在网页正文中，用每题的展开控件即可查看答案，也可以把线索抄到纸上。',
        },
        {
          question: '能把题目翻成中文接龙吗？',
          answer:
            '说明可以翻译，但题目需要按目标语言的表达重新设计。英语单词长度与复合词连接不能直接对应成汉字数量或中文词语关系。',
        },
      ],
      quickAnswerLink: {
        href: 'https://www.cardyard.ai/word-chain-game-rules',
        label: 'CardYard：复合词接龙规则',
        description: '相邻词组成复合词或短语的原始规则参考。',
      },
      externalLinks: [
        {
          href: 'https://playwordchain.com/faq',
          label: 'PlayWordChain：接龙常见问题',
          description:
            '比较复合词与末字母接龙后再选规则。本页八组练习为原创题目。',
        },
      ],
      ctaLabel: '浏览更多游戏',
      ctaDescription: '想换一种词语活动，可以继续看下方相关指南。',
    },
  },
};
