import { locales, localeMeta, otherLocale } from '../../src/i18n/config.ts';
import { pageKeys, pathFor } from '../../src/i18n/routes.ts';
import { ui } from '../../src/i18n/ui.ts';
import { expect, sitePages, test } from './fixtures.ts';

for (const locale of locales) {
  test(`main navigation reaches every page (${locale})`, async ({ page }) => {
    await page.goto(pathFor('home', locale));
    const nav = page.getByRole('navigation', { name: ui[locale].mainNavLabel });

    for (const key of pageKeys) {
      await nav.getByRole('link', { name: ui[locale].nav[key], exact: true }).click();
      await expect(page).toHaveURL(pathFor(key, locale));
      await expect(nav.getByRole('link', { name: ui[locale].nav[key], exact: true })).toHaveAttribute(
        'aria-current',
        'page',
      );
    }
  });

  test(`skip link moves focus to the main content (${locale})`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard navigation is a desktop concern');
    await page.goto(pathFor('home', locale));
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: ui[locale].skipToContent });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
}

for (const { page: key, locale, path } of sitePages) {
  test(`language button on ${path} opens the same page in the other language`, async ({ page }) => {
    await page.goto(path);
    const target = otherLocale(locale);
    const button = page.getByRole('banner').getByRole('link', { name: ui[target].switchToThisLanguage });

    await expect(button).toBeInViewport();
    await expect(button).toHaveText(localeMeta[target].label);
    await button.click();

    await expect(page).toHaveURL(pathFor(key, target));
    await expect(page.locator('html')).toHaveAttribute('lang', localeMeta[target].htmlLang);
  });
}
