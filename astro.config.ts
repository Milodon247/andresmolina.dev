import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { localeMeta, locales } from './src/i18n/config';
import { lookupPath, pathFor } from './src/i18n/routes';

const site = 'https://andresmolina.dev';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',

  build: {
    // Never inline CSS: lets the CSP use `style-src 'self'` without hashes or 'unsafe-inline'.
    inlineStylesheets: 'never',
    format: 'directory',
  },

  // Prefetch injects client JS; the site ships zero JS.
  prefetch: false,

  devToolbar: { enabled: false },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      // Slugs are translated, so hreflang pairs come from the route map, not from URL prefixes.
      serialize(item) {
        const match = lookupPath(new URL(item.url).pathname);
        if (match) {
          item.links = locales.map((locale) => ({
            lang: localeMeta[locale].htmlLang,
            url: new URL(pathFor(match.page, locale), site).href,
          }));
        }
        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
