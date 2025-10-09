import { promises as fs } from 'node:fs';
import path from 'node:path';

import { generateSlug, ensureUniqueSlug } from '../lib/utils/slug';

interface RawRow {
  sourcePath: string;
  title: string;
  pageUrl: string;
  iframeUrl: string;
}

interface ImportedGame {
  slug: string;
  title: string;
  titleEn: string;
  iframeUrl: string;
  sourcePageUrl: string;
  sourcePath: string;
  sourceHost: string;
}

async function readTsv(filePath: string): Promise<RawRow[]> {
  const raw = await fs.readFile(filePath, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => Boolean(line) && !line.startsWith('#'))
    .map((line) => {
      const [sourcePath, title, pageUrl, iframeUrl] = line.split('\t');
      if (!sourcePath || !title || !pageUrl || !iframeUrl) {
        throw new Error(`TSV 数据格式错误：${line}`);
      }
      return { sourcePath, title, pageUrl, iframeUrl };
    });
}

function normalizeTitle(title: string): string {
  return title.replace(/\s+-\s+Play Free Online Games Without Ads/i, '').trim();
}

function buildGames(rows: RawRow[], limit?: number): ImportedGame[] {
  const uniqueSlugs: string[] = [];
  return rows.slice(0, limit ?? rows.length).map((row) => {
    const normalizedTitle = normalizeTitle(row.title);
    const baseSlug = generateSlug(normalizedTitle || row.title);
    const slug = ensureUniqueSlug(baseSlug || 'game', uniqueSlugs);
    uniqueSlugs.push(slug);
    const iframeHost = new URL(row.iframeUrl).hostname;
    return {
      slug,
      title: normalizedTitle || row.title,
      titleEn: normalizedTitle || row.title,
      iframeUrl: row.iframeUrl,
      sourcePageUrl: row.pageUrl,
      sourcePath: row.sourcePath,
      sourceHost: iframeHost,
    };
  });
}

interface Options {
  limit?: number;
  outputPath: string;
  inputPath: string;
}

function parseArgs(cwd: string): Options {
  const args = process.argv.slice(2);
  const options: Options = {
    inputPath: path.join(cwd, 'game_iframes.tsv'),
    outputPath: path.join(cwd, 'public/data/4399-sample.json'),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--limit') {
      const limitValue = args[i + 1];
      if (!limitValue || Number.isNaN(Number(limitValue))) {
        throw new Error('请在 --limit 后面提供数字参数');
      }
      options.limit = Number(limitValue);
      i += 1;
    } else if (arg === '--output') {
      const outputValue = args[i + 1];
      if (!outputValue) {
        throw new Error('请在 --output 后面提供输出文件路径');
      }
      options.outputPath = path.isAbsolute(outputValue) ? outputValue : path.join(cwd, outputValue);
      i += 1;
    } else if (arg === '--input') {
      const inputValue = args[i + 1];
      if (!inputValue) {
        throw new Error('请在 --input 后面提供输入文件路径');
      }
      options.inputPath = path.isAbsolute(inputValue) ? inputValue : path.join(cwd, inputValue);
      i += 1;
    }
  }

  return options;
}

async function writeJson(filePath: string, games: ImportedGame[]): Promise<void> {
  const directory = path.dirname(filePath);
  await fs.mkdir(directory, { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    total: games.length,
    games,
  };
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

async function main() {
  try {
    const cwd = process.cwd();
    const options = parseArgs(cwd);
    const rows = await readTsv(options.inputPath);
    const games = buildGames(rows, options.limit);
    await writeJson(options.outputPath, games);
    const hosts = new Map<string, number>();
    for (const game of games) {
      hosts.set(game.sourceHost, (hosts.get(game.sourceHost) ?? 0) + 1);
    }
    console.log(`已生成 ${games.length} 个游戏条目 -> ${options.outputPath}`);
    console.log('iframe 域名分布：');
    hosts.forEach((count, host) => {
      console.log(`  ${host}: ${count}`);
    });
  } catch (error) {
    console.error('导入失败：', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

void main();
