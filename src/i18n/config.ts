export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

interface LocaleMeta {
  /** Name of the language written in that language, e.g. "Español". */
  label: string;
  /** BCP 47 tag for `<html lang>` and `hreflang`. */
  htmlLang: string;
  /** Open Graph locale, e.g. `en_US`. */
  ogLocale: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { label: 'English', htmlLang: 'en', ogLocale: 'en_US' },
  es: { label: 'Español', htmlLang: 'es', ogLocale: 'es_ES' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}
