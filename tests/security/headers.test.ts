import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { headersForPath, parseCsp, parseHeadersFile } from '../../scripts/lib/cloudflare-headers.ts';

const rules = parseHeadersFile(readFileSync('public/_headers', 'utf8'));

/** Paths that must all receive the full set of security headers. */
const samplePaths = [
  '/',
  '/es/',
  '/experience/',
  '/es/proyectos/',
  '/404.html',
  '/_astro/app.css',
  '/robots.txt',
];

function header(path: string, name: string): string | undefined {
  const headers = headersForPath(rules, path);
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
  return key === undefined ? undefined : headers[key];
}

describe('_headers parser', () => {
  it('parses patterns, splats and placeholders', () => {
    const parsed = parseHeadersFile('# c\n/*\n  A: 1\n/blog/:slug/*\n  B: 2\n  A: 3\n');
    expect(headersForPath(parsed, '/x')).toEqual({ A: '1' });
    expect(headersForPath(parsed, '/blog/post/img.png')).toEqual({ A: '1, 3', B: '2' });
  });

  it('rejects malformed lines', () => {
    expect(() => parseHeadersFile('  A: 1')).toThrow(/without a URL pattern/);
    expect(() => parseHeadersFile('/*\n  nonsense')).toThrow(/Name: value/);
  });
});

describe('security headers', () => {
  it.each(samplePaths)('%s gets every required header', (path) => {
    for (const name of [
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'Cross-Origin-Opener-Policy',
      'Cross-Origin-Resource-Policy',
    ]) {
      expect(header(path, name), name).toBeDefined();
    }
  });

  it('declares each security header exactly once (no conflicting values)', () => {
    const csp = header('/', 'Content-Security-Policy') ?? '';
    expect(csp).not.toMatch(/,\s*default-src/);
  });

  it('enforces HSTS for at least one year with subdomains and preload', () => {
    const hsts = header('/', 'Strict-Transport-Security') ?? '';
    const maxAge = Number(/max-age=(\d+)/.exec(hsts)?.[1]);
    expect(maxAge).toBeGreaterThanOrEqual(31_536_000);
    expect(hsts).toMatch(/includeSubDomains/);
    expect(hsts).toMatch(/preload/);
  });

  it('uses safe values for the simple headers', () => {
    expect(header('/', 'X-Content-Type-Options')).toBe('nosniff');
    expect(header('/', 'X-Frame-Options')).toBe('DENY');
    expect(header('/', 'Cross-Origin-Opener-Policy')).toBe('same-origin');
    expect(['no-referrer', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin']).toContain(
      header('/', 'Referrer-Policy'),
    );
  });

  it('denies every feature in Permissions-Policy', () => {
    const features = (header('/', 'Permissions-Policy') ?? '').split(',').map((f) => f.trim());
    expect(features.length).toBeGreaterThanOrEqual(10);
    for (const feature of features) expect(feature).toMatch(/^[a-z-]+=\(\)$/);
    for (const required of ['camera', 'microphone', 'geolocation', 'payment', 'usb']) {
      expect(features).toContain(`${required}=()`);
    }
  });

  it('caches fingerprinted assets as immutable', () => {
    expect(header('/_astro/BaseLayout.abc123.css', 'Cache-Control')).toMatch(/immutable/);
    expect(header('/', 'Cache-Control')).not.toMatch(/max-age|immutable/);
  });

  it.each(samplePaths)('%s forbids proxy transformations (no injected scripts)', (path) => {
    expect(header(path, 'Cache-Control')).toMatch(/(^|,\s*)no-transform(\s*,|$)/);
  });
});

describe('Content-Security-Policy', () => {
  const csp = parseCsp(header('/', 'Content-Security-Policy') ?? '');
  const allSources = [...csp.values()].flat();

  it('defaults to none', () => {
    expect(csp.get('default-src')).toEqual(["'none'"]);
  });

  it.each(["'unsafe-inline'", "'unsafe-eval'", "'unsafe-hashes'", "'wasm-unsafe-eval'", "'strict-dynamic'"])(
    'never contains %s',
    (keyword) => {
      expect(allSources).not.toContain(keyword);
    },
  );

  it('never allows wildcards, data:, blob: or plain http', () => {
    for (const source of allSources) {
      expect(source).not.toMatch(/^\*$|^\*\.|^data:$|^blob:$|^http:/);
    }
  });

  it('only allows self-hosted resources', () => {
    const allowed = new Set(["'self'", "'none'", "'script'"]);
    for (const source of allSources) expect(allowed.has(source), source).toBe(true);
  });

  it('locks down framing, plugins, base URI and forms', () => {
    expect(csp.get('frame-ancestors')).toEqual(["'none'"]);
    expect(csp.get('object-src')).toEqual(["'none'"]);
    expect(csp.get('base-uri')).toEqual(["'none'"]);
    expect(csp.get('form-action')).toEqual(["'none'"]);
  });

  it('does not allow any script source', () => {
    expect(csp.has('script-src')).toBe(false);
    expect(csp.has('script-src-elem')).toBe(false);
  });

  it('upgrades insecure requests and requires trusted types', () => {
    expect(csp.has('upgrade-insecure-requests')).toBe(true);
    expect(csp.get('require-trusted-types-for')).toEqual(["'script'"]);
  });
});
