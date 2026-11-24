import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { site } from '@/config/site';

/** The production URL is declared in several places that must change together. */
function productionUrl(workflow: string): string | undefined {
  return /^\s+PRODUCTION_URL:\s*(\S+)\s*$/m.exec(readFileSync(`.github/workflows/${workflow}`, 'utf8'))?.[1];
}

function customDomains(): string[] {
  // wrangler.jsonc allows comments and trailing commas; strip them before parsing.
  const jsonc = readFileSync('wrangler.jsonc', 'utf8')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/,(\s*[}\]])/g, '$1');
  const config = JSON.parse(jsonc) as { routes?: { pattern: string; custom_domain?: boolean }[] };
  return (config.routes ?? []).filter((r) => r.custom_domain).map((r) => r.pattern);
}

describe('production URL', () => {
  const deploy = productionUrl('deploy.yml');

  it('is the same in deploy.yml and rollback.yml', () => {
    expect(deploy).toMatch(/^https:\/\/[a-z0-9.-]+$/);
    expect(productionUrl('rollback.yml')).toBe(deploy);
  });

  it('matches the site URL used for canonical links and the sitemap', () => {
    expect(deploy).toBe(site.url);
    expect(readFileSync('astro.config.ts', 'utf8')).toContain(`const site = '${site.url}'`);
  });

  it('is served by a custom domain declared in wrangler.jsonc', () => {
    expect(customDomains()).toContain(new URL(deploy ?? 'https://invalid').host);
  });
});
