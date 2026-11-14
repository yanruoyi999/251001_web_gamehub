export const ladders = [
  { path: ['cold', 'cord', 'card', 'ward', 'warm'] },
  { path: ['head', 'heal', 'teal', 'tell', 'tall', 'tail'] },
  { path: ['mate', 'made', 'mode', 'more'] },
  { path: ['fall', 'fail', 'foil', 'foul', 'soul'] },
  { path: ['soft', 'soot', 'boot', 'boat', 'coat'] },
  { path: ['love', 'live', 'line', 'link', 'pink'] },
  { path: ['sand', 'band', 'bend', 'bead', 'beat', 'boat'] },
  { path: ['fire', 'fine', 'line', 'lane', 'late', 'lake'] },
  { path: ['book', 'boot', 'bolt', 'belt', 'melt'] },
  { path: ['moon', 'moan', 'mean', 'meat', 'seat'] },
  { path: ['hand', 'band', 'bond', 'pond', 'fond'] },
  { path: ['blue', 'glue', 'glum', 'plum', 'plug'] },
  { path: ['dusk', 'dust', 'rust', 'rest', 'best'] },
  { path: ['rose', 'role', 'roll', 'toll', 'tall'] },
  { path: ['pine', 'wine', 'wide', 'wade', 'wave'] },
  { path: ['east', 'fast', 'fest', 'fist', 'fish'] },
] as const;

const extraWords = [
  'bake bald ball bane bank bare bark base bash bath bean bear bell bent bike bind bite',
  'bold bone bore born bowl buck bulk bull bump bunk burn cake call calm came camp cane',
  'cape care carp cart case cash cast cave cell cent chat chew chin chip chop clam clan',
  'clap clay clip clot club clue coal code coil coin colt comb come cone cook cool cope',
  'core cork corn cost cove crab cram crop crow cube cuff curb cure curl cute dale damp',
  'dare dark darn dart dash date dawn days dead deaf deal dean dear deck deep deer dent',
  'desk dial dice diet dime dine ding dire dirt dish disk dive dock dole dome done doom',
  'door dose dove down drag draw drew drip drop drum dual duck duel dull dump dune dunk',
  'earn ease edit even ever face fact fade fair fake fame fang fare farm fate fawn fear',
  'feat feed feel feet fell felt fend fern file fill film find fizz flag flap flat flaw',
  'flea fled flew flip flop flow foam fold folk fond font food fool foot ford fore fork',
  'form fort four free frog from fuel full fund fuse gain gale gall game gang gate gave',
  'gaze gear gift gild girl give glad glee glen glow goal goat gold golf gone gong good',
  'gown grab gram gray grew grid grim grin grip grit grow gulf gull gulp gust hack hail',
  'hair hale half hall halt hang hard hare harm harp hash hate haul have hawk haze heap',
  'hear heat heed heel heir held helm help herb herd here hero hide high hike hill hind',
  'hint hire hiss hive hoax hold hole holy home hone hood hoof hook hoop hoot hope horn',
  'hose host howl huge hulk hull hump hung hunt hurt hush husk idea idle idol inch info',
  'into iris iron isle itch jack jade jail jazz jeep jerk jest jolt judo jump junk jury',
  'just kale keen keep kelp kept kick kiln kilo kind king kiss kite knee knew knit knob',
  'knot know lace lack lady lair lamb lame lamp land lark lash lass last lawn lazy lead',
  'leaf leak lean leap leek left lend lens lent less liar lice lick lied life lift like',
  'lily limb lime limp lint lion list loaf loam loan lobe lock loft logo lone long look',
  'loom loon loop loot lord lore lose loss lost loud luck lull lump lung lure lush lute',
  'lynx mace mock rock sock sack sick mark word worm wing wink sink silk milk mile mine',
].join(' ').split(' ');
const words = new Set<string>([...ladders.flatMap(({ path }) => [...path]), ...extraWords]);

function oneLetterApart(left: string, right: string) {
  return left.length === right.length &&
    [...left].filter((letter, position) => right[position] !== letter).length === 1;
}

export function checkMove(path: readonly string[], input: string) {
  const word = input.trim().toLowerCase();
  if (path.includes(word)) return 'repeat';
  if (!oneLetterApart(path.at(-1) ?? '', word)) return 'letters';
  if (!words.has(word)) return 'unknown';
  return 'valid';
}

export function nextHint(path: readonly string[], target: string) {
  const current = path.at(-1);
  if (!current || current === target || path.includes(target)) return null;

  const frontier = [{ word: current, first: '' }];
  const visited = new Set(path);
  for (const { word, first } of frontier) {
    for (const candidate of words) {
      if (visited.has(candidate) || !oneLetterApart(word, candidate)) continue;
      if (candidate === target) return first || candidate;
      visited.add(candidate);
      frontier.push({ word: candidate, first: first || candidate });
    }
  }
  return null;
}
