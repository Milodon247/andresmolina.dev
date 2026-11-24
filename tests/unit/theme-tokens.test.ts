import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * The CSS-only theme switch repeats the light and dark color tokens. If a color changes in one
 * place and not in the other, the switched page would differ from the system scheme (and could
 * break contrast), so the four lists must stay identical in pairs.
 */
const css = readFileSync('src/styles/global.css', 'utf8');

function tokens(block: string): Record<string, string> {
  const entries = [...block.matchAll(/(--color-[\w-]+):\s*([^;]+);/g)].map((m): [string, string] => [
    m[1] ?? '',
    m[2] ?? '',
  ]);
  return Object.fromEntries(entries);
}

function blockAfter(marker: string): string {
  const start = css.indexOf(marker);
  if (start === -1) throw new Error(`Not found in global.css: ${marker}`);
  return css.slice(start, css.indexOf('}', start));
}

const light = tokens(blockAfter('@theme {'));
const dark = tokens(blockAfter('@media (prefers-color-scheme: dark) {\n  :root {'));
const switchedToDark = tokens(
  blockAfter('@media (prefers-color-scheme: light) {\n  :root:has(#theme-toggle:checked) {'),
);
const switchedToLight = tokens(
  blockAfter('@media (prefers-color-scheme: dark) {\n  :root:has(#theme-toggle:checked) {'),
);

describe('theme tokens', () => {
  it('define the same colors in both schemes', () => {
    expect(Object.keys(light).length).toBeGreaterThan(5);
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  it('switch to exactly the dark tokens on a light system', () => {
    expect(switchedToDark).toEqual(dark);
  });

  it('switch to exactly the light tokens on a dark system', () => {
    expect(switchedToLight).toEqual(light);
  });
});
