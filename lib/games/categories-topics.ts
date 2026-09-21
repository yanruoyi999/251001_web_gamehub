import type { Locale } from '@/i18n/config';

export type TopicGroup = 'warmup' | 'everyday' | 'creative';
export interface CategoryTopic {
  id: string;
  group: TopicGroup;
  label: Record<Locale, string>;
  example: Record<Locale, string>;
}

const rows: [TopicGroup, string, string, string, string][] = [
  ['warmup', 'Things you can stack', '可以堆叠的物品', 'cups', '杯子'],
  ['warmup', 'Foods eaten with a spoon', '用勺子吃的食物', 'porridge', '粥'],
  ['warmup', 'Objects with handles', '带把手的物品', 'suitcase', '手提箱'],
  ['warmup', 'Things that fit in a pocket', '放得进口袋的物品', 'coin', '硬币'],
  ['warmup', 'Things you can fold', '可以折叠的物品', 'napkin', '餐巾'],
  ['warmup', 'Things that can float', '可以漂浮的物品', 'cork', '软木塞'],
  ['warmup', 'Things usually sold in pairs', '通常成对出售的物品', 'gloves', '手套'],
  ['warmup', 'Tools for making a picture', '用来画图的工具', 'crayon', '蜡笔'],
  ['warmup', 'Things on a writing desk', '书桌上的物品', 'notebook', '笔记本'],
  ['warmup', 'Things that roll', '会滚动的物品', 'marble', '弹珠'],
  ['warmup', 'Things you can peel', '可以剥皮的食物', 'banana', '香蕉'],
  ['warmup', 'Things worn on feet', '穿在脚上的物品', 'slippers', '拖鞋'],
  ['warmup', 'Things that open and close', '可以打开和关闭的物品', 'zipper', '拉链'],
  ['warmup', 'Ways to travel a short distance', '短途出行方式', 'walking', '步行'],
  ['warmup', 'Containers that hold water', '可以装水的容器', 'bucket', '水桶'],
  ['warmup', 'Things to count in a room', '房间里可以数的东西', 'windows', '窗户'],
  ['everyday', 'Lunch ingredients that need no cooking', '无需烹饪的午餐食材', 'cucumber', '黄瓜'],
  ['everyday', 'Small jobs done in one minute', '一分钟能做的小事', 'watering a small plant', '给小盆栽浇水'],
  ['everyday', 'Things to check before leaving home', '出门前要检查的事项', 'keys', '钥匙'],
  ['everyday', 'Quiet activities for a waiting room', '等候室里安静的活动', 'reading', '阅读'],
  ['everyday', 'Things that need recharging', '需要充电的设备', 'headphones', '耳机'],
  ['everyday', 'Signs you might pass on a walk', '散步路上会见到的标志', 'street name', '路牌'],
  ['everyday', 'Things to bring on a rainy day', '雨天出门会带的东西', 'umbrella', '雨伞'],
  ['everyday', 'Things you might borrow from a neighbour', '可能向邻居借的东西', 'ladder', '梯子'],
  ['everyday', 'Places to sit down', '可以坐下的地方', 'park bench', '公园长椅'],
  ['everyday', 'Items to put on a shopping list', '购物清单上的物品', 'rice', '大米'],
  ['everyday', 'Things to label so they do not get mixed up', '需要贴标签区分的东西', 'lunch boxes', '饭盒'],
  ['everyday', 'Things you can carry with one hand', '单手可以提的物品', 'small bag', '小袋子'],
  ['everyday', 'Reasons to set a timer', '需要设定计时器的事情', 'baking bread', '烤面包'],
  ['everyday', 'Ways to make a room brighter', '让房间变亮的方法', 'open the curtains', '拉开窗帘'],
  ['everyday', 'Things to organise before a trip', '旅行前要整理的东西', 'tickets', '车票'],
  ['everyday', 'Things a visitor might ask about', '访客可能询问的事情', 'Wi-Fi access', '无线网络'],
  ['creative', 'Unusual uses for a cardboard box', '纸箱的意想不到用途', 'puppet theatre', '木偶舞台'],
  ['creative', 'Things a tiny robot could help with', '小机器人可以帮忙做的事', 'finding a lost button', '找遗失的纽扣'],
  ['creative', 'Names for an imaginary island', '想象中的岛屿名称', 'Cloud Harbour', '云朵港'],
  ['creative', 'Things to pack for a moon picnic', '月球野餐会带的物品', 'a sealed cup', '密封杯'],
  ['creative', 'Reasons a dragon might miss a bus', '龙错过公交车的原因', 'wings stuck in a doorway', '翅膀卡在门口'],
  ['creative', 'New sounds for a doorbell', '门铃可以发出的新声音', 'a short whistle', '短口哨声'],
  ['creative', 'Things a talking tree might say', '会说话的树可能说的话', 'Please move that swing', '请挪一下秋千'],
  ['creative', 'Inventions for a very windy town', '大风小镇需要的发明', 'a hat with a tether', '带绳子的帽子'],
  ['creative', 'Things to sell in a shop for giants', '巨人商店会卖的东西', 'extra-long shoelaces', '超长鞋带'],
  ['creative', 'Rules for a school under the sea', '海底学校的规则', 'leave shells at the door', '贝壳放在门外'],
  ['creative', 'Jobs for a friendly ghost', '友善幽灵可以做的工作', 'checking dark cupboards', '检查黑暗的柜子'],
  ['creative', 'Items in a time traveller’s bag', '时间旅行者包里的物品', 'an old map', '旧地图'],
  ['creative', 'Games played without using hands', '不用手玩的游戏', 'guessing a tune', '猜旋律'],
  ['creative', 'Presents for someone who lives in a cloud', '送给住在云上之人的礼物', 'a rainbow scarf', '彩虹围巾'],
  ['creative', 'Ways to send a message in a fairy tale', '童话中传递消息的方法', 'a singing pebble', '会唱歌的石头'],
  ['creative', 'Names for a new constellation', '新星座的名字', 'The Paper Boat', '纸船座'],
];

export const CATEGORY_TOPICS: CategoryTopic[] = rows.map(([group, en, zh, exampleEn, exampleZh], index) => ({
  id: `topic-${index + 1}`, group, label: { en, zh }, example: { en: exampleEn, zh: exampleZh },
}));

export function chooseCategoryTopics(group: string, count: number, random: () => number = Math.random): CategoryTopic[] {
  if (!['all', 'warmup', 'everyday', 'creative'].includes(group) || ![6, 8, 12].includes(count)) {
    throw new RangeError('Choose a listed group and 6, 8 or 12 topics.');
  }
  const pool = CATEGORY_TOPICS.filter(topic => group === 'all' || topic.group === group);
  for (let i = pool.length - 1; i > 0; i--) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random value must be in [0, 1).');
    const j = Math.floor(sample * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
