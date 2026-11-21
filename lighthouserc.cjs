// Lighthouse CI: audits every page of the production build (dist/) with budgets.
// Uses Playwright's browser so no separate Chrome install is needed.
// Results stay local (.lighthouseci/); nothing is uploaded to third-party storage.
const { existsSync } = require('node:fs');
const { chromium } = require('@playwright/test');

/**
 * Prefers Playwright's chrome-headless-shell (what Playwright itself runs headless), falling back
 * to its full Chromium. CHROME_PATH overrides both. Some Windows policies block launching the
 * unsigned full Chromium binary, while the headless shell runs fine.
 */
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const full = chromium.executablePath();
  const shell = full
    .replace(/chromium-(\d+)/, 'chromium_headless_shell-$1')
    .replace(/chrome-(win64|linux64|linux|mac-arm64|mac-x64)/, 'chrome-headless-shell-$1')
    .replace(
      /(chrome\.exe|Chromium\.app.*|chrome)$/,
      process.platform === 'win32' ? 'chrome-headless-shell.exe' : 'chrome-headless-shell',
    );
  return existsSync(shell) ? shell : full;
}

const paths = [
  '/',
  '/experience/',
  '/certifications/',
  '/projects/',
  '/contact/',
  '/es/',
  '/es/experiencia/',
  '/es/certificaciones/',
  '/es/proyectos/',
  '/es/contacto/',
];

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: paths.map((path) => `http://localhost${path}`),
      numberOfRuns: 3,
      chromePath: chromePath(),
      settings: {
        chromeFlags: '--headless --no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
        'categories:accessibility': ['error', { minScore: 1, aggregationMethod: 'median-run' }],
        'categories:best-practices': ['error', { minScore: 1, aggregationMethod: 'median-run' }],
        'categories:seo': ['error', { minScore: 1, aggregationMethod: 'median-run' }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
