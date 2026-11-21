// @ts-check
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: ['dist/', '.astro/', 'node_modules/', 'test-results/', 'playwright-report/', '.lighthouseci/'],
  },

  js.configs.recommended,

  // TypeScript: strict, type-aware rules.
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },

  // Astro components: Astro rules + strict accessibility rules for templates.
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  {
    files: ['**/*.astro'],
    // Only the rules: the parser must stay astro-eslint-parser (which delegates scripts to TS).
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      ...Object.assign({}, ...tseslint.configs.strict.map((config) => config.rules ?? {})),
      // Enforces the "zero client-side JavaScript / nothing inline" rules from AGENTS.md.
      'astro/no-set-html-directive': 'off', // only used for the JSON-LD data block, which is escaped
      'astro/no-unsafe-inline-scripts': 'error',
      'astro/no-exports-from-components': 'error',
    },
  },

  // Node scripts and config files.
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.node },
  },
);
