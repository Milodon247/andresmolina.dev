import { describe, expect, it } from 'vitest';
import { defaultLocale, isLocale, localeMeta, locales, otherLocale } from '@/i18n/config';
import { lookupPath, pageKeys, pathFor, routes } from '@/i18n/routes';
import { ui } from '@/i18n/ui';

describe('locale config', () => {
  it('has English as default and Spanish as alternative', () => {
    expect(defaultLocale).toBe('en');
    expect([...locales]).toEqual(['en', 'es']);
    expect(otherLocale('en')).toBe('es');
    expect(otherLocale('es')).toBe('en');
  });

  it('labels each language in that language', () => {
    expect(localeMeta.en.label).toBe('English');
    expect(localeMeta.es.label).toBe('Español');
  });

  it('recognises only supported locales', () => {
    expect(isLocale('es')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });
});

describe('route map', () => {
  const allPaths = pageKeys.flatMap((page) => locales.map((locale) => pathFor(page, locale)));

  it('serves the default locale without prefix and Spanish under /es/', () => {
    for (const page of pageKeys) {
      expect(pathFor(page, 'en').startsWith('/es/')).toBe(false);
      expect(pathFor(page, 'es').startsWith('/es/')).toBe(true);
    }
  });

  it('uses absolute paths with a trailing slash', () => {
    for (const path of allPaths) expect(path).toMatch(/^\/([a-z0-9-]+\/)*$/);
  });

  it('has no duplicate paths', () => {
    expect(new Set(allPaths).size).toBe(allPaths.length);
  });

  it('round-trips every path through lookupPath', () => {
    for (const page of pageKeys) {
      for (const locale of locales) {
        expect(lookupPath(pathFor(page, locale))).toEqual({ page, locale });
      }
    }
  });

  it('accepts paths without trailing slash and rejects unknown ones', () => {
    expect(lookupPath('/es/proyectos')).toEqual({ page: 'projects', locale: 'es' });
    expect(lookupPath('/nope/')).toBeUndefined();
  });

  it('defines every page for every locale', () => {
    for (const page of pageKeys) expect(Object.keys(routes[page]).sort()).toEqual([...locales].sort());
  });
});

describe('ui dictionary', () => {
  function keyPaths(value: unknown, prefix = ''): string[] {
    if (typeof value !== 'object' || value === null) return [prefix];
    return Object.entries(value).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }

  function leaves(value: unknown): unknown[] {
    if (typeof value !== 'object' || value === null) return [value];
    return Object.values(value).flatMap(leaves);
  }

  it('has the same keys in every locale', () => {
    expect(keyPaths(ui.es).sort()).toEqual(keyPaths(ui.en).sort());
  });

  it('has no empty strings', () => {
    for (const locale of locales) {
      for (const value of leaves(ui[locale])) {
        expect(typeof value === 'string' && value.trim().length > 0).toBe(true);
      }
    }
  });

  it('names the language switcher in the target language, including its visible label', () => {
    // WCAG 2.5.3 Label in Name: the accessible name contains the visible text.
    for (const locale of locales) {
      expect(ui[locale].switchToThisLanguage.toLowerCase()).toContain(localeMeta[locale].label.toLowerCase());
    }
  });
});
