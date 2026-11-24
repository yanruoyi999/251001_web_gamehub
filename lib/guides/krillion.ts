import { bilingualReference } from './bilingual-reference';

export const krillionGuide = bilingualReference({
  slug: 'krillion',
  homepageFeatured: true,
  keywords: ['krillion', 'krillion daily game', 'krillion roblox', 'how to play krillion'],
  related: ['categories-game-topics', 'word-chain-game-examples'],
  title: ['Krillion: Play the Daily Browser Game or Find the Roblox Lobby', 'Krillion 怎么玩？网页版每日题与 Roblox 联机入口'],
  heading: ['Which Krillion do you want to play?', '你想玩哪个 Krillion？'],
  summary: ['Open the original daily trivia dive in your browser or find the Hypr Games experience on Roblox. Learn what makes a rare answer count.', '一键找到网页版每日答题或 Hypr Games 的 Roblox 房间，弄清答案为什么能得分，以及怎样跟朋友进同一局。'],
  introduction: ['If someone shared a numbered daily dive, open the browser game. If a friend named Hypr Games or shared a Roblox party code, open that Roblox experience. Both reward unusual answers, but the invitation tells you where to go.', '朋友发来带期数的每日挑战，选网页版。如果对方说的是 Hypr Games，或发了 Roblox 房间码，选对应的 Roblox 游戏。两边都鼓励想少见答案，认清邀请来自哪里就容易进对局。'],
  sections: [
    [['Choose your game', '先选玩法'], ['For a shared daily challenge, go to krillion.io and select Daily Dive. To enter a Hypr Games lobby, use its Roblox listing and follow your friend into a public or private game. If your invitation specifically says Puffer Party, stay on the browser site and select that mode.', '每日同题从 krillion.io 的 Daily Dive 进入。想进 Hypr Games 的公共或私人房间，用它的 Roblox 入口跟朋友会合。如果邀请写的是 Puffer Party，则回到网页版选这个模式。']],
    [['Try one category before you dive', '用一道原创类别题热身'], ['Try “name a musical instrument with strings.” Think of two answers before reading on. Violin fits. So does a hammered dulcimer, even though its strings are struck. A clarinet has a reed and misses the category. First check that your answer fits, then think about which valid answer other players might overlook. This Luma example illustrates the reasoning and awards no official points.', '试着回答“说出一种用弦发声的乐器”，先想两个答案。小提琴符合；扬琴也符合，虽然它是敲弦发声。单簧管靠簧片振动，不在这一类。先检查类别，再考虑别人容易漏掉哪些正确答案。这是 Luma 原创热身题，没有官方分值。']],
    [['Why an answer can miss', '答案合理，为什么没命中？'], ['The browser developer curates a set of accepted answers for each prompt. It can miss a valid item, and an alias can lead autocorrect to select a different one. Read the matched answer, check the category, and consult the developer FAQ if the result still looks odd. An unfamiliar spelling alone does not establish a higher score.', '每题有整理过的答案集，合理答案也可能没被收录。自动纠错还可能把别名匹配到另一个答案。先看游戏实际匹配的词，再核类别；仍有疑问时可以看作者的答疑。拼法冷僻本身不能保证高分。']],
  ],
  questions: [
    [['Why did my Puffer Party turn end so quickly?', '网页版 Puffer Party 为什么刚接手就快没时间了？'], ['In the browser party game, the fuse follows the puffer around the room. Under the default rules a fresh fuse starts between 10 and 30 seconds. The next player inherits the remaining time, with a floor of eight seconds when it changes hands. If the countdown surprises you, first check the mode and room settings.', '网页版派对的引线在房间内共享。默认规则下，新引线从 10 至 30 秒之间开始倒数；传给下一位时会继承剩余时间，交接时不足 8 秒则回到 8 秒。感觉回合长短不一时，先看是不是这个模式以及房间采用的设置。']],
    [['Where do I play yesterday’s browser puzzle?', '在哪里回玩以前的网页版题目？'], ['Open the Archive from the menu on krillion.io. If you want a fresh practice round instead of a particular past dive, choose Unlimited and check the options shown by the game.', '在 krillion.io 菜单里选 Archive，按往期挑战找题。只想练新一轮，可以选 Unlimited，并以游戏页面实际显示的使用条件为准。']],
    [['What should I send to a friend?', '约朋友一起玩，该发什么？'], ['For the same daily challenge, share the browser link and dive number. For Roblox, send the exact experience link and any private party code directly to your friend. A dive number identifies a puzzle; it is not a Roblox room code.', '约做同一期题，发网页版链接和期数；约 Roblox 联机，发具体游戏入口，把私人房间码直接告诉朋友。每日题期数用来指明题目，不能当成 Roblox 房间码。']],
  ],
  sources: [
    ['https://krillion.io/', ['Play the browser Daily Dive', '玩网页版 Daily Dive'], ['Open the original game on krillion.io.', '到 krillion.io 打开原版每日挑战。'], 'open_daily'],
    ['https://www.roblox.com/games/115175190808402/Krillion', ['Play Hypr Games’ Krillion on Roblox', '玩 Hypr Games 的 Roblox 版'], ['Open this experience for a public lobby or a private party.', '进入这个 Roblox 游戏的公共或私人房间。'], 'open_roblox'],
    ['https://krillion.io/faq', ['Read the browser developer’s FAQ', '看网页版作者的答疑'], ['How the accepted answer sets, aliases and rarity work.', '核对收录、别名与稀有度的规则。']],
  ],
});
