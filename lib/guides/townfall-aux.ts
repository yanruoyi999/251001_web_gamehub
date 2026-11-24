import { bilingualReference } from './bilingual-reference';

export const townfallAuxGuide = bilingualReference({
  slug: 'silent-hill-townfall-aux-valve-puzzle',
  keywords: ['Silent Hill Townfall AUX valve puzzle', 'auxiliary lines puzzle', 'AUX Disk'],
  related: ['0h-h1-binary-puzzle-guide'],
  title: ['Silent Hill: Townfall AUX Valve Puzzle — Two Spoiler-Light Hints', '寂静岭：Townfall 辅助管线阀门谜题｜两层轻提示'],
  heading: ['Read the AUX wall in Silent Hill: Townfall', '寂静岭：Townfall 的 AUX 阀门墙怎么看？'],
  summary: ['At the wall of levers in Part 6? Try the AUX Disk puzzle with two optional hints, then check your reading on a short practice wall.', '第六部的 AUX 房里有一面手柄墙。先自己读磁盘图，卡住时再展开提示，也可以用一道小题练习辨认方向。'],
  introduction: ['Use this once you have entered the AUX Room at SWDP and can see the wall of levers. If a console is asking you to open Valve B on CCTV, that is an earlier step.', '这份提示适用于已经走进 SWDP 的 AUX 房、眼前是一面管线手柄墙的玩家。若你还在监控台上操作 Valve B，那是更早的一步。'],
  sections: [
    [['Where to find the diagram', '去哪里找图'], ['In the AUX Room, check the cabinet for the AUX Disk. Insert it into the computer in the same room and open the Auxiliary Lines file. Keep that diagram handy as you work on the wall.', '在 AUX 房的柜子里找到 AUX Disk，插进同一房间的电脑，打开 Auxiliary Lines 文件。去墙边时留一份图在手边，方便对照。']],
    [['If a line still shows incomplete', '只剩一路未完成时'], ['Leave the completed lines alone. Return to the start of the unfinished line and check it against your disk. Look for a missed handle around a corner or a position you counted from the other end.', '保留已经完成的管线。从剩下那一路的起点重新对图，留意拐角有没有漏掉一个手柄，或是否从相反的一端开始计数。']],
  ],
  questions: [
    [['Why might my wall look different from a video?', '为什么我看到的墙和视频不同？'], ['Konami redrew the AUX pipe layout in patch 1.4.0. Patch 1.6.0 improved the valve status lights for colourblind players. Use the diagram inside your own game for the handle positions.', '科乐美在 1.4.0 调整了 AUX 管线布局，又在 1.6.0 改善了阀门状态灯的辨色效果。请以自己游戏中的磁盘图确定手柄朝向。']],
  ],
  sources: [
    ['https://www.konami.com/games/silenthill/townfall/updates/as/en/patch-note_v1-4-0', ['Konami: pipe layout update', '科乐美：管线布局更新'], ['Patch 1.4.0, puzzle information design.', '1.4.0 版本的谜题信息设计改动。']],
    ['https://www.konami.com/games/silenthill/townfall/updates/us/en/patch-note_v1-6-0', ['Konami: valve light update', '科乐美：阀门状态灯更新'], ['Patch 1.6.0, gameplay and accessibility.', '1.6.0 版本的可访问性改动。']],
  ],
});
