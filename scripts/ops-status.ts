import './load-env';

import { getHealthSummary } from '@/lib/ops/health';

async function main() {
  const summary = await getHealthSummary('internal', 5000);
  const results = Object.entries(summary.services);

  console.log('Luma Game Hub Ops Status:\n');
  results.forEach(([name, item]) => {
    const icon = item.status === 'ok' ? '✅' : item.status === 'degraded' ? '⚠️ ' : '❌';
    console.log(`${icon} ${name}: ${item.status}${item.message ? ` (${item.message})` : ''}`);
  });

  console.log(`\nOverall: ${summary.status}\n`);

  process.exit(summary.status === 'error' ? 1 : 0);
}

main();
