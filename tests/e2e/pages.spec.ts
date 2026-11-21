import { localeMeta } from '../../src/i18n/config.ts';
import { ui } from '../../src/i18n/ui.ts';
import { expect, sitePages, test } from './fixtures.ts';

for (const { page: key, locale, path } of sitePages) {
  test(`${path} loads with status 200 and correct metadata`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', localeMeta[locale].htmlLang);
    await expect(page).toHaveTitle(new RegExp(ui[locale].meta[key].title));
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main#main')).toBeVisible();
  });
}

test.describe('404', () => {
  // The browser logs the 404 status of the document itself; nothing else may fail.
  test.use({ allowedConsoleErrors: [/status of 404/] });

  test('unknown paths return the bilingual 404 page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: ui.en.notFound.title })).toBeVisible();
    await expect(page.getByRole('heading', { name: ui.es.notFound.title })).toBeVisible();
  });
});

test('the preview server applies the production security headers', async ({ page }) => {
  const response = await page.goto('/');
  const headers = response?.headers() ?? {};
  expect(headers['content-security-policy']).toContain("default-src 'none'");
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['cross-origin-opener-policy']).toBe('same-origin');
});
