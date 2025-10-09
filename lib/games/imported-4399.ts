import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface Imported4399Game {
  slug: string;
  title: string;
  titleEn: string;
  iframeUrl: string;
  sourcePageUrl: string;
  sourcePath: string;
  sourceHost: string;
}

interface Imported4399Payload {
  generatedAt?: string;
  total?: number;
  games?: Imported4399Game[];
}

const DATA_FILE = path.join(process.cwd(), 'public/data/4399-sample.json');

export async function loadImported4399Games(limit?: number): Promise<Imported4399Game[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Imported4399Payload;
    const list = Array.isArray(parsed.games) ? parsed.games : [];
    const sanitized = list
      .map((game) => ({
        ...game,
        slug: String(game.slug ?? '').trim(),
        title: String(game.title ?? '').trim(),
        titleEn: String(game.titleEn ?? '').trim(),
        iframeUrl: String(game.iframeUrl ?? '').trim(),
        sourcePageUrl: String(game.sourcePageUrl ?? '').trim(),
        sourcePath: String(game.sourcePath ?? '').trim(),
        sourceHost: String(game.sourceHost ?? '').trim(),
      }))
      .filter((game) => game.slug && game.iframeUrl);
    return sanitized.slice(0, limit ?? sanitized.length);
  } catch (error) {
    console.error('[imported-4399] 加载样本数据失败', error);
    return [];
  }
}
