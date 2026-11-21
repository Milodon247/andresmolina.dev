import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { locales } from '@/i18n/config';
import { pageKeys, pathFor } from '@/i18n/routes';

/** Checks on the production build in dist/. Run `npm run build` first. */
const DIST = 'dist';
const SITE = 'https://andresmolina.dev';

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

let htmlFiles: { url: string; html: string }[] = [];

beforeAll(() => {
  if (!existsSync(DIST)) throw new Error('dist/ not found: run `npm run build` before `npm run test:dist`');
  htmlFiles = walk(DIST)
    .filter((f) => f.endsWith('.html'))
    .map((file) => {
      const rel = `/${relative(DIST, file).split(sep).join('/')}`;
      const url = rel === '/404.html' ? rel : rel.replace(/index\.html$/, '');
      return { url, html: readFileSync(file, 'utf8') };
    });
});

describe('build output', () => {
  it('builds every page in every locale plus the 404 page', () => {
    const expected = [...pageKeys.flatMap((p) => locales.map((l) => pathFor(p, l))), '/404.html'].sort();
    expect(htmlFiles.map((f) => f.url).sort()).toEqual(expected);
  });

  it('ships the security and SEO files', () => {
    for (const file of [
      '_headers',
      '.well-known/security.txt',
      'robots.txt',
      'sitemap-index.xml',
      'favicon.svg',
      'og/default.png',
    ]) {
      expect(existsSync(join(DIST, file)), file).toBe(true);
    }
  });

  it('ships no JavaScript files', () => {
    expect(walk(DIST).filter((f) => /\.(m?js)$/.test(f))).toEqual([]);
  });
});

describe('no inline code (keeps the CSP free of unsafe-inline)', () => {
  it('has no executable <script> (only JSON-LD data blocks)', () => {
    for (const { url, html } of htmlFiles) {
      const scripts = html.match(/<script\b[^>]*>/gi) ?? [];
      for (const tag of scripts) expect(tag, url).toBe('<script type="application/ld+json">');
    }
  });

  it('has no <style> elements, style attributes or inline event handlers', () => {
    for (const { url, html } of htmlFiles) {
      expect(html, url).not.toMatch(/<style\b/i);
      expect(html, url).not.toMatch(/\sstyle\s*=/i);
      expect(html, url).not.toMatch(/\son[a-z]+\s*=/i);
      expect(html, url).not.toMatch(/javascript:/i);
    }
  });
});

describe('no third-party resources', () => {
  it('loads every subresource from the same origin', () => {
    const resource = /<(?:link|img|source|script|iframe|video|audio|embed|object)\b[^>]*\s(?:src|href|srcset)="([^"]+)"/gi;
    for (const { url, html } of htmlFiles) {
      for (const [tag, value] of html.matchAll(resource)) {
        // <link rel="canonical|alternate"> are references, not fetched resources.
        if (/rel="(canonical|alternate)"/.test(tag)) continue;
        expect(value, `${url}: ${tag}`).toMatch(/^\/(?!\/)/);
      }
    }
  });

  it('uses only self-hosted fonts and same-origin URLs in CSS', () => {
    const cssFiles = walk(DIST).filter((f) => f.endsWith('.css'));
    expect(cssFiles.length).toBeGreaterThan(0);
    for (const file of cssFiles) {
      const css = readFileSync(file, 'utf8');
      for (const [, ref] of css.matchAll(/url\(\s*['"]?([^'")]+)/g)) {
        expect(ref, file).not.toMatch(/^(https?:)?\/\//);
      }
      expect(css, file).not.toMatch(/@import\s+(url\()?['"]?https?:/);
    }
  });
});

describe('per-page SEO and i18n markup', () => {
  it('every page has lang, title, description and viewport', () => {
    for (const { url, html } of htmlFiles) {
      expect(html, url).toMatch(/<html lang="(en|es)"/);
      expect(html, url).toMatch(/<title>[^<]{5,}<\/title>/);
      expect(html, url).toMatch(/<meta name="description" content="[^"]{30,}"/);
      expect(html, url).toMatch(/<meta name="viewport"/);
    }
  });

  it('every indexable page has a canonical URL and an hreflang pair with x-default', () => {
    for (const page of pageKeys) {
      for (const locale of locales) {
        const url = pathFor(page, locale);
        const html = htmlFiles.find((f) => f.url === url)?.html ?? '';
        expect(html, url).toContain(`<html lang="${locale}"`);
        expect(html, url).toContain(`<link rel="canonical" href="${SITE}${url}">`);
        for (const l of locales) {
          expect(html, url).toContain(`<link rel="alternate" hreflang="${l}" href="${SITE}${pathFor(page, l)}">`);
        }
        expect(html, url).toContain(`hreflang="x-default" href="${SITE}${pathFor(page, 'en')}"`);
      }
    }
  });

  it('the 404 page is not indexable', () => {
    const html = htmlFiles.find((f) => f.url === '/404.html')?.html ?? '';
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(html).not.toContain('rel="canonical"');
  });

  it('the language switcher links each page to its counterpart', () => {
    for (const page of pageKeys) {
      for (const locale of locales) {
        const url = pathFor(page, locale);
        const target = pathFor(page, locale === 'en' ? 'es' : 'en');
        const html = htmlFiles.find((f) => f.url === url)?.html ?? '';
        expect(html, url).toMatch(new RegExp(`<a href="${target}" hreflang="(en|es)" lang="(en|es)" aria-label=`));
      }
    }
  });
});
