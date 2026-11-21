import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, sitePages, test } from './fixtures.ts';

/** WCAG 2.2 AA plus axe best practices, on every page, in both color schemes and every viewport. */
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const schemes = ['light', 'dark'] as const;

async function expectNoViolations(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
  const summary = violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => n.target.join(' ')),
  }));
  expect(summary).toEqual([]);
}

for (const { path } of sitePages) {
  for (const scheme of schemes) {
    test(`${path} (${scheme}) has no accessibility violations @a11y`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await expectNoViolations(page);
    });
  }
}

test.describe('404 page', () => {
  test.use({ allowedConsoleErrors: [/status of 404/] });

  for (const scheme of schemes) {
    test(`404 (${scheme}) has no accessibility violations @a11y`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/this-page-does-not-exist/');
      await expectNoViolations(page);
    });
  }
});
