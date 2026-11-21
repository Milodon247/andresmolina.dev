import { describe, expect, it } from 'vitest';
import { assertTranslationParity, findMissingTranslations, splitLocaleId } from '@/lib/locale-entries';

describe('splitLocaleId', () => {
  it('splits locale and slug', () => {
    expect(splitLocaleId('es/acme-corp')).toEqual({ locale: 'es', slug: 'acme-corp' });
    expect(splitLocaleId('en/2024/acme')).toEqual({ locale: 'en', slug: '2024/acme' });
  });

  it.each(['acme', 'fr/acme', 'en/', '/acme'])('rejects %j', (id) => {
    expect(() => splitLocaleId(id)).toThrow(/locale folder/);
  });
});

describe('findMissingTranslations', () => {
  it('returns nothing when every slug exists in every locale', () => {
    expect(findMissingTranslations(['en/a', 'es/a', 'en/b', 'es/b'])).toEqual({});
  });

  it('reports missing slugs per locale', () => {
    expect(findMissingTranslations(['en/a', 'en/b', 'es/a', 'es/c'])).toEqual({ es: ['b'], en: ['c'] });
  });
});

describe('assertTranslationParity', () => {
  it('passes for a complete collection', () => {
    expect(() => {
      assertTranslationParity('projects', ['en/a', 'es/a']);
    }).not.toThrow();
  });

  it('names the collection and the missing entries', () => {
    expect(() => {
      assertTranslationParity('projects', ['en/a', 'en/b', 'es/a']);
    }).toThrow('Collection "projects" is missing translations -> es: b');
  });
});
