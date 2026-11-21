import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) };

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts', 'tests/security/**/*.test.ts', 'tests/repo/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        resolve: { alias },
        test: {
          // Inspects the production build: run `npm run build` first.
          name: 'dist',
          include: ['tests/dist/**/*.test.ts'],
          environment: 'node',
        },
      },
    ],
  },
});
