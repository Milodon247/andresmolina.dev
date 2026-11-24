import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Browser jobs run in the official Playwright image, pinned by digest. Its browsers only work with
 * the same @playwright/test version, and Dependabot does not update container images in workflows.
 */
const playwrightVersion = (
  JSON.parse(readFileSync('package.json', 'utf8')) as {
    devDependencies: Record<string, string>;
  }
).devDependencies['@playwright/test'];

const images = readdirSync('.github/workflows')
  .filter((f) => f.endsWith('.yml'))
  .flatMap((file) =>
    [
      ...readFileSync(`.github/workflows/${file}`, 'utf8').matchAll(/^\s+image:\s*(\S+)(?:\s*#\s*(\S+))?/gm),
    ].map((m) => ({ file, ref: m[1] ?? '', tag: m[2] })),
  );

describe('Playwright container image', () => {
  it('is used by the browser jobs', () => {
    expect(images.map((i) => i.file).sort()).toEqual(['checks.yml', 'deploy.yml', 'pr.yml', 'rollback.yml']);
  });

  it.each(images)('$file pins the image by digest and matches @playwright/test', ({ ref, tag }) => {
    expect(ref).toMatch(/^mcr\.microsoft\.com\/playwright@sha256:[a-f0-9]{64}$/);
    expect(tag).toBe(`v${playwrightVersion ?? '?'}-noble`);
  });

  it('uses the same digest everywhere', () => {
    expect(new Set(images.map((i) => i.ref)).size).toBe(1);
  });
});
