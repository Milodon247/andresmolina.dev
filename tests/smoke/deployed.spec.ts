import { readFileSync } from 'node:fs';
import { localeMeta, otherLocale } from '../../src/i18n/config.ts';
import { pathFor } from '../../src/i18n/routes.ts';
import { ui } from '../../src/i18n/ui.ts';
import { headersForPath, parseHeadersFile } from '../../scripts/lib/cloudflare-headers.ts';
import { expect, sitePages, test } from '../e2e/fixtures.ts';

/** The headers Cloudflare must serve are exactly the ones declared in public/_headers. */
const rules = parseHeadersFile(readFileSync('public/_headers', 'utf8'));

function expectDeclaredHeaders(path: string, actual: Record<string, string>): void {
  for (const [name, value] of Object.entries(headersForPath(rules, path))) {
    expect(actual[name.toLowerCase()], `${name} on ${path}`).toBe(value);
  }
}

test('is served over HTTPS', ({ baseURL }) => {
  expect(baseURL).toMatch(/^https:\/\//);
});

for (const { page: key, locale, path } of sitePages) {
  test(`${path} returns 200 with every security header`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expectDeclaredHeaders(path, (await response?.allHeaders()) ?? {});
    await expect(page).toHaveTitle(new RegExp(ui[locale].meta[key].title));
    await expect(page.locator('html')).toHaveAttribute('lang', localeMeta[locale].htmlLang);
  });
}

test('fingerprinted assets are cached as immutable', async ({ page, request }) => {
  await page.goto('/');
  const css = (await page.locator('link[rel="stylesheet"]').first().getAttribute('href')) ?? '';
  expect(css).toMatch(/^\/_astro\//);
  const response = await request.get(css);
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toContain('immutable');
  expectDeclaredHeaders(css, response.headers());
});

test('paths without trailing slash redirect to the canonical URL', async ({ request }) => {
  const response = await request.get('/experience', { maxRedirects: 0 });
  expect([301, 307, 308]).toContain(response.status());
  expect(new URL(response.headers().location ?? '', 'https://x').pathname).toBe('/experience/');
});

test('well-known files are served with the right content type', async ({ request }) => {
  for (const [path, type] of [
    ['/.well-known/security.txt', 'text/plain'],
    ['/robots.txt', 'text/plain'],
    ['/sitemap-index.xml', 'xml'],
  ] as const) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type'], path).toContain(type);
  }
});

test('_headers is applied but not published as a file', async ({ request }) => {
  expect((await request.get('/_headers')).status()).toBe(404);
});

test.describe('404', () => {
  test.use({ allowedConsoleErrors: [/status of 404/] });

  test('unknown paths return the bilingual 404 page with security headers', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');
    expect(response?.status()).toBe(404);
    expect((await response?.allHeaders())?.['content-security-policy']).toBeDefined();
    await expect(page.getByRole('heading', { name: ui.en.notFound.title })).toBeVisible();
  });
});

test('the language button works on the deployed site', async ({ page }) => {
  await page.goto(pathFor('experience', 'en'));
  const target = otherLocale('en');
  await page.getByRole('banner').getByRole('link', { name: ui[target].switchToThisLanguage }).click();
  await expect(page).toHaveURL(pathFor('experience', target));
});
