import { bilingualReference } from './bilingual-reference';

export const mw4Guide = bilingualReference({
  homepageFeatured: true,
  slug: 'mw4', keywords: ['mw4', 'cod mw4', 'MW4 campaign', 'MW4 multiplayer', 'MW4 DMZ', 'MW4 Steam'],
  related: ['gta-6-platforms', 'best-free-iphone-games'],
  title: ['MW4 Guide: Platforms, Installation, Campaign, Multiplayer and DMZ', 'MW4 入门指南：平台、安装、战役、多人和 DMZ 怎么选'],
  heading: ['MW4: which version and mode should you open?', 'MW4 是哪款游戏？先选平台，再选模式'],
  summary: ['Call of Duty: Modern Warfare 4 launched on October 23, 2026. Check your platform, find the official store, and choose between Campaign, Multiplayer and DMZ.', '这里的 MW4 指 2026 年 10 月 23 日推出的《使命召唤：现代战争 4》。先核对设备及商店，再按想玩的体验选择战役、多人或 DMZ。'],
  introduction: ['Start with the full title and the system you own. Similar-looking search results can lead to Call of Duty 4: Modern Warfare, Modern Warfare III, the separate Warzone experience, or the older MechWarrior series.', '先确认完整名称和设备。搜索 MW4 也可能遇到早年的《使命召唤 4：现代战争》、Modern Warfare III、独立的 Warzone 或机甲题材的 MechWarrior。'],
  sections: [
    [['Find the version for your device', '先确认买哪一版'], ['The publisher lists PlayStation 5, Xbox Series X|S, PC and Nintendo Switch 2. On PC, follow the store link for the library where you want to own the game: Steam, Battle.net or Xbox on PC. A listing for an older Modern Warfare on your console is not confirmation that the 2026 game supports it. Check the hardware name on the actual product page before paying.', '发行方列出的平台是 PS5、Xbox Series X|S、PC 和 Nintendo Switch 2。PC 玩家可以从官网进入 Steam、Battle.net 或 Xbox on PC 对应的商店。核对具体主机代数和完整游戏名，再决定购买；旧主机上的其他《现代战争》条目容易混淆。']],
    [['Pick a mode for the session you want', '按这一局想做什么选模式'], ['Choose Campaign to follow the authored story in order. Choose Multiplayer for matches that end and start fresh; the publisher counted 20 multiplayer maps at launch, not 20 maps for each playlist. Choose DMZ if you want the extraction loop in Hajin: set an objective for the trip, decide what to keep, and make it back out. Starting Campaign is not how you join a multiplayer match.', '想按故事顺序玩就选战役 Campaign；想打完一场再排下一场，选多人 Multiplayer。发行方公布的首发多人地图共 20 张，是整个模式的总数。DMZ 的地点是 Hajin，核心是一次入场、完成目标、权衡收益，再设法撤出；它和传统多人对局的结束条件不同。']],
    [['Installing the game you actually selected', '安装时怎样避免下载错内容'], ['Look for Modern Warfare 4 as a standalone title in your library. The launch notes describe an installation choice for Warzone alongside MW4. If you only intend to play the new story, read the content selection before accepting an extra download. If a friend is waiting in DMZ, first agree on the game and mode; resolving that mismatch is more useful than reinstalling a different Call of Duty title.', '在游戏库里找到 Modern Warfare 4 的独立条目。首发补丁说明记录了安装时可同时选择 Warzone。只打算玩新作战役时，先看内容选项再确认下载，避免多装一份游戏。跟朋友约好玩 DMZ 时，先对齐游戏名与模式，再查安装是否齐全。']],
  ],
  questions: [
    [['Can I play MW4 in my web browser?', '网页里能直接玩 MW4 吗？'], ['This is a guide to the retail game. The publisher directs players to supported console and PC storefronts. Start at that page to check a listing rather than downloading a similarly named browser file.', '本页是正版主机和 PC 游戏的指南。用发行方给出的商店入口查版本与配置；搜索结果里的同名网页文件不能当作官方客户端。']],
    [['Was MW4 on Game Pass on launch day?', '首发当天加入 Game Pass 了吗？'], ['Activision explicitly said it was not included at launch. If a subscription matters to your decision today, check the current catalogue on the account and platform you intend to use.', '官方公告明确写明首发未加入 Game Pass。订阅目录会变化，准备购买或订阅时请用实际游玩的账户和设备核对当前目录。']],
    [['Does Switch 2 have an official release?', 'Switch 2 版有官方发售记录吗？'], ['Yes. Nintendo posted its own out-now announcement. Check that the store page names Nintendo Switch 2 when comparing editions.', '有。任天堂自己发布了 Switch 2 版已上线的公告。比较不同商店中的版本时，看清商品页写的是 Nintendo Switch 2。']],
  ],
  sources: [
    ['https://www.callofduty.com/modernwarfare4',['Official MW4 platform selector','MW4 官方平台入口'],['Open the publisher’s store choices.','选择设备对应的官方商店。']],
    ['https://www.callofduty.com/blog/2026/10/call-of-duty-modern-warfare-4-live-worldwide-now',['Launch announcement and modes','首发公告与模式'],['Campaign, Multiplayer and DMZ at launch.','核实战役、多人和 DMZ。']],
    ['https://www.callofduty.com/patchnotes/2026/10/call-of-duty-modern-warfare-4-launch-patch-notes',['Official launch patch notes','首发补丁记录'],['Installation and content selection.','核对安装选项。']],
    ['https://www.nintendo.com/us/whatsnew/call-of-duty-r-modern-warfare-r-4-is-out-now-for-nintendo-switch-2-stay-frosty/',['Nintendo release notice','任天堂发售公告'],['Switch 2 product confirmation.','确认 Switch 2 版本。']],
    ['https://www.callofduty.com/blog/2026/10/call-of-duty-intel-modern-warfare-4-launch-xbox-game-pass/',['Game Pass launch statement','Game Pass 首发说明'],['Check the dated launch terms.','核实首发时的订阅安排。']],
  ],
});
