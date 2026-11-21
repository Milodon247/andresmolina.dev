import type { Locale } from './config';

/**
 * Every page of the site and its path in each locale. Slugs are translated, so this map (not a
 * prefix rule) is what links a page to its counterpart in the other language.
 */
export const routes = {
  home: { en: '/', es: '/es/' },
  experience: { en: '/experience/', es: '/es/experiencia/' },
  certifications: { en: '/certifications/', es: '/es/certificaciones/' },
  projects: { en: '/projects/', es: '/es/proyectos/' },
  contact: { en: '/contact/', es: '/es/contacto/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof routes;

export const pageKeys = Object.keys(routes) as PageKey[];

export function pathFor(page: PageKey, locale: Locale): string {
  return routes[page][locale];
}

/** Finds the page key and locale for a path such as `/es/proyectos/`. */
export function lookupPath(path: string): { page: PageKey; locale: Locale } | undefined {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  for (const page of pageKeys) {
    for (const [locale, candidate] of Object.entries(routes[page]) as [Locale, string][]) {
      if (candidate === normalized) return { page, locale };
    }
  }
  return undefined;
}
