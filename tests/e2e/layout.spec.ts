import { expect, sitePages, test } from './fixtures.ts';

const backgrounds = {
  light: 'rgb(255, 255, 255)',
  dark: 'rgb(11, 17, 32)',
} as const;

for (const scheme of ['light', 'dark'] as const) {
  test(`follows prefers-color-scheme: ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/');
    await expect(page.locator('body')).toHaveCSS('background-color', backgrounds[scheme]);
    const text = await page.locator('body').evaluate((el) => getComputedStyle(el).color);
    expect(text).not.toBe(backgrounds[scheme]);
  });
}

for (const { path } of sitePages) {
  test(`${path} has no horizontal overflow`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('uses the self-hosted Inter font', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')),
  );
  expect(loaded).toContain('Inter Variable');
});

test('ships no JavaScript to the browser', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') scripts.push(request.url());
  });
  await page.goto('/');
  await page.goto('/es/proyectos/');
  expect(scripts).toEqual([]);
});
