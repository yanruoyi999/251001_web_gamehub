import type { SeoLandingPage } from '@/lib/seo-landing-content';

const noun = 'https://www.duden.de/rechtschreibung/Stuttgarter_Einwohner';
const adjective = 'https://www.duden.de/rechtschreibung/Stuttgarter_aus_von_Stuttgart';
const puzzle = 'https://beebom.com/puzzle/what-does-stuttgarter-mean-connections-nov-20/';

export const STUTTGARTER_GUIDE: SeoLandingPage = {
  slug: 'stuttgarter-meaning',
  primaryKeyword: 'stuttgarter meaning',
  keywords: ['Stuttgarter meaning', 'Stuttgarter in English', 'Stuttgarter Connections clue', 'Stuttgarter adjective'],
  updatedAt: '2026-11-24T00:00:00.000Z',
  indexable: true,
  documentNavigation: true,
  homepageFeatured: false,
  relatedSlugs: ['word-chain-game-examples', 'categories-game-topics'],
  locales: {
    en: {
      metaTitle: 'Stuttgarter Meaning in English and the Connections Clue',
      metaDescription: 'Stuttgarter means a person from Stuttgart, or “of Stuttgart” before a noun. See German examples, reveal the November 20 clue if you want it, and try a fresh word puzzle.',
      heading: 'What does Stuttgarter mean?',
      subheading: 'A Stuttgarter is someone from Stuttgart, Germany. Before a noun, Stuttgarter means “of Stuttgart” or “from Stuttgart.”',
      overview: ['The November 20, 2026 Connections puzzle used this German word for an English spelling trick. You can read the definition without revealing the solution.'],
      sections: [
        { title: 'Read it in a sentence', body: '“Mein Nachbar ist Stuttgarter” means “My neighbor is from Stuttgart.” Here the word names a person. In “der Stuttgarter Hauptbahnhof” it describes a place: Stuttgart’s main railway station.' },
        { title: 'Translating a station sign or a headline', body: 'Try replacing Stuttgarter with “from Stuttgart.” A Stuttgarter Zeitung can be translated as a newspaper from Stuttgart. In an English headline, “Stuttgart newspaper” usually reads more naturally. If the words are the publication’s proper name, keep the name and explain it on first mention. The same shortcut works with a train station, but it does not turn the name of the station into the name of a person.' },
        { title: 'How to recognize the two forms', body: 'Stuttgart is the city name. For residents, German uses der Stuttgarter, die Stuttgarterin and the plural die Stuttgarter. As a city adjective, Stuttgarter keeps its capital S and its ending: ein Stuttgarter Bahnhof, zwei Stuttgarter Bahnhöfe.' },
      ],
      faqs: [
        { question: 'How do I say “a woman from Stuttgart” in German?', answer: 'Use eine Stuttgarterin. For example, “Meine Freundin ist Stuttgarterin” means “My friend is from Stuttgart.” Add -in to the name for a male resident, not to the spelling of the city itself.' },
        { question: 'Does it mean someone born in Stuttgart?', answer: 'It can describe a native or a resident. The word alone does not tell you where someone was born.' },
        { question: 'Do I need to speak German to solve the November 20 clue?', answer: 'No German is required. Open the dated clue explanation when you are ready for the solution.' },
      ],
      recommendations: [],
      externalLinks: [
        { href: noun, label: 'Duden: the noun Stuttgarter', description: 'Check its grammatical gender and plural.' },
        { href: adjective, label: 'Duden: the adjective Stuttgarter', description: 'See the fixed adjective form and the railway station example.' },
        { href: puzzle, label: 'Beebom: November 20 Connections explanation (spoiler)', description: 'Dated coverage of puzzle #1258.' },
      ],
      ctaLabel: 'Browse games', ctaDescription: 'Find another game to play on Luma.',
    },
    zh: {
      metaTitle: 'Stuttgarter 是什么意思？德语用法与 Connections 谜题提示',
      metaDescription: 'Stuttgarter 可以指斯图加特人，也可以表示“斯图加特的”。用两个德语例句学会区分，再自行展开 11 月 20 日的谜底，试一道原创英文藏词题。',
      heading: 'Stuttgarter 是什么意思？',
      subheading: 'Stuttgarter 作名词指德国斯图加特人，放在名词前则表示“斯图加特的”或“来自斯图加特的”。',
      overview: ['2026 年 11 月 20 日的 Connections 用这个德语词出了一道英语字母谜题。谜底可以自行展开，只想查词义也能读下去。'],
      sections: [
        { title: '对照两个德语例句', body: 'Mein Nachbar ist Stuttgarter 意思是“我的邻居是斯图加特人”，说的是人。der Stuttgarter Hauptbahnhof 意思是“斯图加特中央火车站”，Stuttgarter 在这里修饰车站。' },
        { title: '车站标牌和报纸名称怎样翻译？', body: '先把 Stuttgarter 替换成“来自斯图加特的”，再看它修饰什么。Stuttgarter Zeitung 可以理解为“斯图加特的报纸”。如果上下文给的是某份报纸的专名，就保留报名，再向读者解释它来自哪座城市。把这个方法用在车站名上，就不会误译为“斯图加特人中央火车站”。' },
        { title: '怎样辨认名词和形容词', body: 'Stuttgart 是城市名。指居民时，阳性单数为 der Stuttgarter，阴性单数为 die Stuttgarterin，复数可用 die Stuttgarter。修饰地点时首字母仍大写，词尾也不随名词变化：ein Stuttgarter Bahnhof（一座斯图加特的车站），zwei Stuttgarter Bahnhöfe（两座斯图加特的车站）。' },
      ],
      faqs: [
        { question: '“一位来自斯图加特的女性”用德语怎么说？', answer: '可以说 eine Stuttgarterin。例如，Meine Freundin ist Stuttgarterin 是“我的朋友来自斯图加特”。先从 Stuttgart 得到居民称谓 Stuttgarter，再加上 -in。' },
        { question: 'Stuttgarter 一定指出生在斯图加特的人吗？', answer: '它也可以指当地居民。只凭这个词无法确定一个人的出生地。' },
        { question: '不会德语也能解开 11 月 20 日的题吗？', answer: '可以。想知道它为什么会出现在这道题里，再展开上方带有日期的谜底。' },
      ],
      recommendations: [],
      externalLinks: [
        { href: noun, label: 'Duden 词典：名词 Stuttgarter', description: '查看词性和复数形式。' },
        { href: adjective, label: 'Duden 词典：形容词 Stuttgarter', description: '查看不变词尾和火车站的例子。' },
        { href: puzzle, label: 'Beebom：11 月 20 日当期谜题（含剧透）', description: '核对第 1258 期的题解。' },
      ],
      ctaLabel: '浏览游戏', ctaDescription: '在 Luma 找一款接着玩的游戏。',
    },
  },
};
