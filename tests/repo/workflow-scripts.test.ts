import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Repository scripts called from workflows must exist, and shell scripts run directly need the
 * executable bit in git: commits from Windows drop it, and the job then fails with "Permission denied".
 */
const calls = readdirSync('.github/workflows')
  .filter((f) => f.endsWith('.yml'))
  .flatMap((file) =>
    [
      ...readFileSync(`.github/workflows/${file}`, 'utf8').matchAll(
        /\brun:.*?(?<!\S)((?:node\s+)?)(scripts\/[\w./-]+)/g,
      ),
    ].map((m) => ({ file, script: m[2] ?? '', viaNode: (m[1] ?? '') !== '' })),
  );

const modes = new Map(
  execFileSync('git', ['ls-files', '-s', 'scripts'], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .map((line) => {
      const [mode = '', , , path = ''] = line.split(/\s+/);
      return [path, mode] as const;
    }),
);

describe('scripts called from workflows', () => {
  it('finds the calls', () => {
    expect(calls.length).toBeGreaterThan(0);
  });

  it.each(calls)('$file → $script is tracked and runnable', ({ script, viaNode }) => {
    expect(modes.has(script), `${script} is not tracked by git`).toBe(true);
    if (viaNode) expect(script).toMatch(/\.(ts|mjs|js)$/);
    else expect(modes.get(script), `${script} needs: git update-index --chmod=+x ${script}`).toBe('100755');
  });
});
