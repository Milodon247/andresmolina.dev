import { test as base, expect } from '@playwright/test';
import { locales } from '../../src/i18n/config.ts';
import { pageKeys, pathFor, type PageKey } from '../../src/i18n/routes.ts';
import type { Locale } from '../../src/i18n/config.ts';

export interface SitePage {
  page: PageKey;
  locale: Locale;
  path: string;
}

/** Every page of the site in every locale. */
export const sitePages: SitePage[] = pageKeys.flatMap((page) =>
  locales.map((locale) => ({ page, locale, path: pathFor(page, locale) })),
);

/**
 * Every test automatically fails if the page logs a console error (CSP violations included),
 * throws, or tries to reach any origin other than the local preview server.
 */
export const test = base.extend<{ allowedConsoleErrors: RegExp[]; guard: undefined }>({
  /** Console errors a specific test expects, e.g. the 404 of the document itself. */
  allowedConsoleErrors: [[], { option: true }],
  guard: [
    async ({ page, baseURL, allowedConsoleErrors }, use) => {
      const problems: string[] = [];
      const origin = new URL(baseURL ?? 'http://localhost').origin;

      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        if (allowedConsoleErrors.some((pattern) => pattern.test(message.text()))) return;
        problems.push(`console error: ${message.text()}`);
      });
      page.on('pageerror', (error) => problems.push(`page error: ${error.message}`));
      await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (url.startsWith(origin) || url.startsWith('data:')) {
          await route.continue();
        } else {
          problems.push(`external request: ${url}`);
          await route.abort();
        }
      });

      await use(undefined);

      expect(problems, 'console errors, page errors or external requests').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
