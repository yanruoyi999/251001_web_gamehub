export const shapeRegions = ['all', 'asia', 'europe', 'africa', 'americas', 'oceania'] as const;
export type ShapeRegion = (typeof shapeRegions)[number];

const countries = [
  ['JPN', 'asia', 'Japan', '日本', 'Look for a long island arc with a large island at its northern end.', '留意细长的岛弧和北端的一座大岛。'],
  ['IND', 'asia', 'India', '印度', 'The southern half narrows to a pointed peninsula.', '南半部逐渐收窄，形成一个尖角半岛。'],
  ['THA', 'asia', 'Thailand', '泰国', 'A thin southern arm extends from a much broader north.', '宽大的北部下方伸出一条细长的南部半岛。'],
  ['VNM', 'asia', 'Vietnam', '越南', 'The coastline curves into a long S, with a narrower middle.', '海岸形成细长的 S 形，中段最窄。'],
  ['LKA', 'asia', 'Sri Lanka', '斯里兰卡', 'The island looks like a teardrop with a pointed north.', '岛屿像一滴眼泪，北端略尖。'],
  ['IDN', 'asia', 'Indonesia', '印度尼西亚', 'A wide chain of islands stretches from west to east.', '一长串岛屿从西向东铺开。'],
  ['ITA', 'europe', 'Italy', '意大利', 'The peninsula resembles a boot, with a large island by the toe.', '半岛像一只靴子，靴尖外侧有一座大岛。'],
  ['PRT', 'europe', 'Portugal', '葡萄牙', 'The mainland is tall and narrow, with a comparatively straight east edge.', '大陆部分南北狭长，东侧边缘相对直。'],
  ['ISL', 'europe', 'Iceland', '冰岛', 'Several deep notches and peninsulas form a ragged coastline.', '深湾和半岛交错，海岸线凹凸明显。'],
  ['FIN', 'europe', 'Finland', '芬兰', 'The upper part tapers and a small arm reaches northwest.', '北部逐渐变窄，还有一小段向西北伸出。'],
  ['IRL', 'europe', 'Ireland', '爱尔兰', 'The west is jagged; a land border cuts into the northeast.', '西海岸曲折，东北部有一段陆地边界。'],
  ['CHE', 'europe', 'Switzerland', '瑞士', 'This landlocked outline is wider than it is tall and broadens near the middle.', '这个内陆轮廓横宽竖窄，中间较宽。'],
  ['EGY', 'africa', 'Egypt', '埃及', 'The main shape has straight edges, with a triangular peninsula in the northeast.', '主体有长直边，东北角有一个三角形半岛。'],
  ['MDG', 'africa', 'Madagascar', '马达加斯加', 'The large island points north and bends southwest.', '这座大岛的北端尖，南段向西南弯。'],
  ['GHA', 'africa', 'Ghana', '加纳', 'Fairly upright east and west sides meet the coast at the bottom.', '东西边缘大致竖直，下方是海岸。'],
  ['KEN', 'africa', 'Kenya', '肯尼亚', 'The long eastern edge runs down to a short southeast coastline.', '长长的东边界通向东南角一小段海岸。'],
  ['BWA', 'africa', 'Botswana', '博茨瓦纳', 'A straight western border meets a rounder southeast.', '平直的西部边界与较圆的东南部相接。'],
  ['BRA', 'americas', 'Brazil', '巴西', 'The eastern bulge tapers into a narrow southern tip.', '东部向外隆起，向南逐渐收成尖角。'],
  ['CHL', 'americas', 'Chile', '智利', 'This distinctive strip runs a long way north to south.', '轮廓是一条从北到南延伸很远的狭长地带。'],
  ['MEX', 'americas', 'Mexico', '墨西哥', 'Two peninsulas frame the country, one northwest and one east.', '西北和东部各有一个半岛。'],
  ['PER', 'americas', 'Peru', '秘鲁', 'The west coast slopes southeast while the upper half extends inland.', '西岸向东南倾斜，上半部向内陆伸展。'],
  ['AUS', 'oceania', 'Australia', '澳大利亚', 'A notch separates the northern peninsulas; an island sits off the southeast.', '北部两个半岛之间有海湾，东南方外海还有一座岛。'],
  ['NZL', 'oceania', 'New Zealand', '新西兰', 'Two main islands run diagonally from southwest to northeast.', '两座主岛沿西南—东北方向斜向排列。'],
  ['PNG', 'oceania', 'Papua New Guinea', '巴布亚新几内亚', 'A straight western edge meets an island group and a pointed eastern arm.', '西边界笔直，东侧有细长的半岛和一群岛屿。'],
] as const;

export const countryShapes = countries.map(([id, region, en, zh, tipEn, tipZh]) => ({
  id, region, en, zh, tip: { en: tipEn, zh: tipZh },
}));

export type CountryShape = (typeof countryShapes)[number];

const regionalPools = shapeRegions.slice(1).map(region => countryShapes.filter(country => country.region === region));
const worldPool = Array.from({ length: 6 }, (_, index) => regionalPools.flatMap(pool => pool.slice(index, index + 1))).flat();

export function makeShapeRound(region: ShapeRegion, replay: number) {
  const pool = region === 'all'
    ? worldPool
    : countryShapes.filter(country => country.region === region);
  const offset = region === 'all' ? replay * 5 : replay;
  return Array.from({ length: Math.min(8, pool.length) }, (_, index) => pool[(offset + index) % pool.length]);
}

export function shapeChoices(shape: CountryShape) {
  const local = countryShapes.filter(other => other.id !== shape.id && other.region === shape.region);
  const other = countryShapes.filter(country => country.region !== shape.region);
  const offset = countryShapes.indexOf(shape);
  const distractors = local.concat(other.slice(offset % other.length)).slice(0, 3);
  distractors.splice(offset % 4, 0, shape);
  return distractors;
}
