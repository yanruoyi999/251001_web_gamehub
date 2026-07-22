import { submitIndexNow } from '@/lib/indexnow';

function readExplicitUrls(args: string[]): string[] {
  const urls: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== '--url') {
      throw new Error(`Unknown argument: ${args[index]}`);
    }

    const value = args[index + 1];
    if (!value) {
      throw new Error('Each --url flag must be followed by a path or absolute URL.');
    }

    urls.push(value);
    index += 1;
  }

  if (urls.length === 0) {
    throw new Error(
      'Pass each changed production URL explicitly, for example: pnpm seo:indexnow -- --url /en/games/google-snake',
    );
  }

  return urls;
}

async function main() {
  const urls = readExplicitUrls(process.argv.slice(2));
  const result = await submitIndexNow(urls);
  // eslint-disable-next-line no-console
  console.info(`IndexNow accepted ${result.submitted} URL(s) with HTTP ${result.status}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
