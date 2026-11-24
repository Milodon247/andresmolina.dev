// Waits until a deployed site answers 200 over HTTPS, e.g. while Cloudflare provisions the DNS record
// and certificate of a new custom domain. Used by the deploy and rollback workflows before smoke tests.
// Usage: node scripts/wait-for-site.ts <url> [max-seconds]
// Node's fetch, not curl: the browser jobs run in the Playwright image, which does not promise curl.
import { setTimeout as sleep } from 'node:timers/promises';

const [url, maxArg = '600'] = process.argv.slice(2);
const max = Number(maxArg);
if (!url?.startsWith('https://') || !Number.isInteger(max) || max < 0) {
  console.error('Usage: node scripts/wait-for-site.ts <https://url> [max-seconds]');
  process.exit(2);
}

const intervalSeconds = 10;

for (let waited = 0; waited <= max; waited += intervalSeconds) {
  let status: string;
  try {
    const response = await fetch(`${url}/`, { redirect: 'manual', signal: AbortSignal.timeout(10_000) });
    status = String(response.status);
  } catch (error) {
    status =
      error instanceof Error ? (error.cause instanceof Error ? error.cause.message : error.message) : 'error';
  }
  if (status === '200') {
    console.log(`${url} is up (after ${String(waited)}s)`);
    process.exit(0);
  }
  console.log(`${url} answered '${status}'`);
  if (waited + intervalSeconds > max) break;
  await sleep(intervalSeconds * 1000);
}

console.log(`::error::${url} did not answer 200 within ${String(max)}s`);
process.exit(1);
