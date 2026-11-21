import { locales, type Locale } from '@/i18n/config';

/**
 * Markdown collections store one file per locale: `en/<slug>.md` and `es/<slug>.md`.
 * These helpers split ids like `es/acme-corp` and enforce that every slug exists in every locale.
 */

export function splitLocaleId(id: string): { locale: Locale; slug: string } {
  const [prefix, ...rest] = id.split('/');
  const slug = rest.join('/');
  if (!prefix || !slug || !(locales as readonly string[]).includes(prefix)) {
    throw new Error(`Entry "${id}" must live in a locale folder (${locales.join(', ')})`);
  }
  return { locale: prefix as Locale, slug };
}

/** Returns slugs missing per locale. An empty object means the collection is complete. */
export function findMissingTranslations(ids: readonly string[]): Partial<Record<Locale, string[]>> {
  const slugsByLocale = new Map<Locale, Set<string>>(locales.map((l) => [l, new Set()]));
  for (const id of ids) {
    const { locale, slug } = splitLocaleId(id);
    slugsByLocale.get(locale)?.add(slug);
  }
  const allSlugs = new Set([...slugsByLocale.values()].flatMap((s) => [...s]));
  const missing: Partial<Record<Locale, string[]>> = {};
  for (const locale of locales) {
    const have = slugsByLocale.get(locale) ?? new Set();
    const lacking = [...allSlugs].filter((slug) => !have.has(slug)).sort();
    if (lacking.length > 0) missing[locale] = lacking;
  }
  return missing;
}

export function assertTranslationParity(collection: string, ids: readonly string[]): void {
  const missing = findMissingTranslations(ids);
  const problems = Object.entries(missing).map(([locale, slugs]) => `${locale}: ${slugs.join(', ')}`);
  if (problems.length > 0) {
    throw new Error(`Collection "${collection}" is missing translations -> ${problems.join('; ')}`);
  }
}
