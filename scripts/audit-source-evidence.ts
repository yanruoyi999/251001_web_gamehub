import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { mockGames } from '@/lib/mock-games';
import { canRenderGameIframe, shouldNoIndexGame } from '@/lib/games/quality-policy';
import { APPROVED_CATALOGUE_SOURCES, hasFrozenLegacySource, hasReviewedCatalogueSource, isCompleteSourceEvidence } from '@/lib/games/source-evidence';

for (const record of APPROVED_CATALOGUE_SOURCES) {
  if (!isCompleteSourceEvidence(record) || !existsSync(path.resolve(record.evidencePath))) throw new Error(`Incomplete source evidence: ${record.slug}`);
}
const records = mockGames.map((game) => ({
  游戏: game.slug,
  嵌入地址: game.iframeUrl,
  来源页面: game.sourcePageUrl,
  许可状态: hasReviewedCatalogueSource(game) ? '有审核记录' : '未获取到授权证据',
  存量来源匹配: hasFrozenLegacySource(game),
  当前可嵌入: canRenderGameIframe(game),
  当前禁止索引: shouldNoIndexGame(game),
}));
if (new Set(records.map((record) => record.游戏)).size !== records.length) throw new Error('Duplicate source slugs');
const unreviewedNew = records.filter((record) => !record.存量来源匹配 && record.许可状态 !== '有审核记录');
if (unreviewedNew.length) throw new Error(`Unreviewed new/changed catalogue sources: ${unreviewedNew.map((record) => record.游戏).join(', ')}`);
const report = {
  基线: 'main@bd0abb3',
  去重口径: '目录 slug，每条记录同时保存准确的 iframe URL 与来源页面；不与运行时或日志层相加',
  说明: '许可记录未获取到不等于侵权结论。存量例外不是授权证明；无联网版权方核实。',
  目录数量: records.length,
  已审核新增来源数: APPROVED_CATALOGUE_SOURCES.length,
  记录: records,
};
const destination = process.argv[process.argv.indexOf('--write') + 1];
if (process.argv.includes('--write') && destination) {
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, JSON.stringify(report, null, 2) + '\n');
}
console.log(`Source evidence gate passed for ${records.length} unique catalogue slugs; ${records.filter((record) => record.许可状态 === '未获取到授权证据').length} documentary coverage gaps remain.`);
