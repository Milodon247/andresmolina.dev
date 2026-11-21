// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://andresmolina.dev',
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

  vite: {
    plugins: [tailwindcss()],
  },
});