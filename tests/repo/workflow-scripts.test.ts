import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Workflows run repository scripts through an interpreter (`node` or `bash`), never directly:
 * commits from Windows drop the executable bit and the job then fails with "Permission denied".
 * This test reads files only (no git): browser jobs run it inside a container where git refuses
 * the checkout as "dubious ownership".
 */
const calls = readdirSync('.github/workflows')
  .filter((f) => f.endsWith('.yml'))
  .flatMap((file) =>
    [...readFileSync(`.github/workflows/${file}`, 'utf8').matchAll(/(\S*)\s+(\.?\/?scripts\/[\w./-]+)/g)]
      .filter((m) => !(m[1] ?? '').startsWith('#'))
      .map((m) => ({ file, interpreter: m[1] ?? '', script: (m[2] ?? '').replace(/^\.?\//, '') })),
  );

describe('scripts called from workflows', () => {
  it('finds the calls', () => {
    expect(calls.length).toBeGreaterThan(0);
  });

  it.each(calls)('$file runs $script through an interpreter', ({ interpreter, script }) => {
    expect(existsSync(script), `${script} does not exist`).toBe(true);
    expect(['node', 'bash'], `run it as "node ${script}" or "bash ${script}"`).toContain(interpreter);
    if (interpreter === 'node') expect(script).toMatch(/\.(ts|mjs|js)$/);
  });
});
