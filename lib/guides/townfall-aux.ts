import { bilingualReference } from './bilingual-reference';

export const townfallAuxGuide = bilingualReference({
  slug: 'silent-hill-townfall-aux-valve-puzzle',
  keywords: ['Silent Hill Townfall AUX valve puzzle', 'auxiliary lines puzzle', 'AUX Disk', 'SWDP AUX room'],
  related: ['0h-h1-binary-puzzle-guide', 'string-theory-2-remastered-guide'],
  title: ['Silent Hill: Townfall AUX Valve Puzzle — Two Spoiler-Light Hints', '寂静岭：Townfall 辅助管线阀门谜题｜两层轻提示'],
  heading: ['Read the AUX wall in Silent Hill: Townfall', '寂静岭：Townfall 的 AUX 阀门墙怎么看？'],
  summary: ['At the wall of levers in Part 6? Try the AUX Disk puzzle with two optional hints, then check your reading on a short practice wall.', '第六部的 AUX 房里有一面手柄墙。先自己读磁盘图，卡住时再展开提示，也可以用一道小题练习辨认方向。'],
  introduction: ['Use this once you have entered the AUX Room at SWDP and can see the wall of levers. If a console is asking you to open Valve B on CCTV, that is an earlier step.', '这份提示适用于已经走进 SWDP 的 AUX 房、眼前是一面管线手柄墙的玩家。若你还在监控台上操作 Valve B，那是更早的一步。'],
  sections: [
    [['Where to find the diagram', '去哪里找图'], ['In the AUX Room, check the cabinet for the AUX Disk. Insert it into the computer in the same room and open the Auxiliary Lines file. Keep that diagram handy as you work on the wall.', '在 AUX 房的柜子里找到 AUX Disk，插进同一房间的电脑，打开 Auxiliary Lines 文件。去墙边时留一份图在手边，方便对照。']],
    [['Carry one line from the desk to the wall', '从桌边走到墙边，只记一路'], ['At the desk, pick one line from the Auxiliary Lines file. Sketch its start and the handle marks on a scrap of paper, leaving space to tick each one off. Once you stand at the wall, find the same line before touching anything. If you turn around to look at your notes, use the painted arrow to get your bearings again.', '在电脑上只选 Auxiliary Lines 图中的一路。用纸标出起点，抄下这一串手柄方向，每个位置旁留一点打勾的空隙。走到墙前先确认是哪一路，然后再动手柄。中途转身看笔记时，回头先找墙上箭头，以免把剩下半路读反。']],
    [['If a line still shows incomplete', '只剩一路未完成时'], ['Leave the completed lines alone. Return to the start of the unfinished line and check it against your disk. Look for a missed handle around a corner or a position you counted from the other end.', '保留已经完成的管线。从剩下那一路的起点重新对图，留意拐角有没有漏掉一个手柄，或是否从相反的一端开始计数。']],
  ],
  questions: [
    [['I can see buttons and a camera feed. Is this the right puzzle?', '我看到的是按键和监控画面，该用这份提示吗？'], ['The wall exercise starts inside the AUX Room, where you can walk up to the physical levers. At the Remote Systems Control desk you are still working through console commands. Continue until the operator log points you to the locker key, then take the key to the AUX door.', '本练习从能走到 AUX 房内的实体手柄前开始。在 Remote Systems Control 桌前按键时，操作对象还是监控台。顺着操作员日志往下走，看到柜中钥匙的线索后取出钥匙，再到 AUX 房门口。']],
    [['How do I check a line if the colours are hard to distinguish?', '看不清状态灯颜色，如何检查一路？'], ['Use the stripe count, painted arrow and handle orientation as your working references. At the far end, check each position back against your recorded row before moving a handle on another line. The drawing and the physical handle positions let you check your work even when the lamp alone is hard to read.', '先靠管旁条纹、墙上箭头和手柄朝向来核对。到终点后按你抄下的那一行逐个检查，再决定要不要动下一路。即使看不清灯色，也可以靠图纸和手柄的实际方向逐位排错。']],
    [['Why might my wall look different from a video?', '为什么我看到的墙和视频不同？'], ['Konami redrew the AUX pipe layout in patch 1.4.0. Patch 1.6.0 improved the valve status lights for colourblind players. Use the diagram inside your own game for the handle positions.', '科乐美在 1.4.0 调整了 AUX 管线布局，又在 1.6.0 改善了阀门状态灯的辨色效果。请以自己游戏中的磁盘图确定手柄朝向。']],
  ],
  sources: [
    ['https://www.konami.com/games/silenthill/townfall/updates/as/en/patch-note_v1-4-0', ['Konami: pipe layout update', '科乐美：管线布局更新'], ['Patch 1.4.0, puzzle information design.', '1.4.0 版本的谜题信息设计改动。']],
    ['https://www.konami.com/games/silenthill/townfall/updates/us/en/patch-note_v1-6-0', ['Konami: valve light update', '科乐美：阀门状态灯更新'], ['Patch 1.6.0, gameplay and accessibility.', '1.6.0 版本的可访问性改动。']],
  ],
});
