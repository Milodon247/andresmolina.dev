# AGENTS.md

Single source of truth for AI coding agents (Claude Code, GitHub Copilot, Cursor, Codex, …).
Tool-specific files (`CLAUDE.md`, `.github/copilot-instructions.md`, `.cursor/rules/project.mdc`)
only point here. **Edit this file, not those.**

## Project

Personal CV / portfolio of Andrés Molina Bustamante (DevSecOps architect, CISSP), served at
`https://andresmolina.dev`. The site and the repository are a showcase of security, quality and
automation practices, so every change must keep those standards.

- Astro 7, `output: 'static'`, TypeScript `strictest`, Tailwind CSS 4 (via `@tailwindcss/vite`).
- Node `>=22.23.4` (`.nvmrc` = 26). npm only, `package-lock.json` committed, `npm ci` in CI.
- Bilingual: English is the default locale (no prefix, `/`), Spanish lives under `/es/`.
- Deployment: Cloudflare Workers Static Assets on `andresmolina.dev` and `www.andresmolina.dev`
  (custom domains in `wrangler.jsonc`), only from GitHub Actions. Production URL: `PRODUCTION_URL`
  in `deploy.yml` / `rollback.yml`.
- License: code under MIT (`LICENSE`); personal content (CV data, name, descriptions, images) is
  all rights reserved (`CONTENT-LICENSE.md`). Keep that list current when adding personal files.

## Commands

| Command                   | What it does                                                          |
| ------------------------- | --------------------------------------------------------------------- |
| `npm run dev`             | Dev server on `http://localhost:4321`                                 |
| `npm run build`           | `astro check` + static build into `dist/`                             |
| `npm run preview`         | Serve `dist/` locally **with the production security headers**        |
| `npm run typecheck`       | `astro check` + `tsc --noEmit`                                        |
| `npm run lint`            | ESLint (TypeScript type-aware, Astro, jsx-a11y strict)                |
| `npm run format`          | Prettier write (`format:check` to verify)                             |
| `npm run test:unit`       | Vitest: utilities, i18n, schemas, `_headers`/CSP, security.txt, repo  |
| `npm run test:dist`       | Vitest on `dist/`: nothing inline, no third-party resources, SEO      |
| `npm run test:html`       | html-validate on `dist/`                                              |
| `npm run test:links`      | linkinator on `dist/` (internal + external)                           |
| `npm run test:e2e`        | Playwright against `astro preview` (3 browser projects)               |
| `npm run test:a11y`       | axe, WCAG 2.2 AA, every page, light and dark                          |
| `npm run test:lighthouse` | Lighthouse CI budgets (perf ≥ 95, others = 100)                       |
| `npm run test:all`        | Everything above, in order, stopping at the first failure (~9 min)    |
| `npm run test:quick`      | typecheck, lint, format, unit, build, dist checks (~1–2 min)          |
| `npm run test:smoke`      | Smoke tests against a deployed URL (`BASE_URL=https://…`), used by CI |
| `npm run images`          | Regenerate PNG icons and OG image from SVGs                           |

**Before finishing any change, run at least `npm run test:quick`.** CI runs the full `test:all` on
every pull request and before every deployment, and nothing merges without it. Run `test:all`
locally at the end of a phase and for changes to layout, styles, headers or tests. Tests that need
the build (`test:dist`,
`test:html`, `test:links`, `test:e2e`, `test:a11y`, `test:lighthouse`) read `dist/`, so run
`npm run build` first when running them individually.

## Layout

```
.github/workflows/      checks (reusable), pr (+ preview), pr-cleanup, deploy, rollback, codeql, scorecard
.github/dependabot.yml  grouped weekly updates with cooldown
wrangler.jsonc          Cloudflare Workers Static Assets config (assets-only, no Worker script)
astro.config.ts         Astro config (static output, sitemap with hreflang, Tailwind, preview headers)
design/                 SVG sources for generated images (OG image)
scripts/                maintenance scripts, commit-msg check
scripts/lib/            shared tooling: `_headers` parser, commit message validator
public/                 static files copied as-is (_headers, .well-known/security.txt, icons, og/)
tests/unit|security|repo  Vitest suites that run on sources
tests/dist/             Vitest suite that inspects the build
tests/e2e/              Playwright + axe suites (fixtures.ts fails on console errors/external requests)
src/content.config.ts   content collections (schemas live in src/content/schemas.ts)
src/content/            CV data (edit these to update the CV), one folder per collection
src/i18n/               locales, UI dictionary, route map, helpers
src/config/site.ts      site-wide settings (URL, author, social links)
src/layouts/            BaseLayout (html shell, SEO head, header, footer)
src/components/         seo/, layout/, cv/ components
src/lib/                pure, framework-free utilities (unit-testable)
src/pages/              English pages at the root, Spanish pages in src/pages/es/
src/styles/global.css   Tailwind entry, design tokens (light/dark), print styles
```

## Hard rules

1. **Zero client-side JavaScript.** No `<script>` tags, no `client:*` directives, no View
   Transitions, no prefetch. Interactive needs are solved with HTML/CSS (`<details>`, links).
   If JS ever becomes unavoidable, stop and ask the owner first, with a justification.
   The only allowed `<script>` is the non-executable `type="application/ld+json"` data block
   emitted by `src/components/seo/Head.astro` (CSP does not apply to data blocks).
2. **Nothing inline.** No `<style>` blocks that end up inline, no `style=""` attributes, no inline
   event handlers. `build.inlineStylesheets` stays `'never'`. This is what allows the CSP in
   `public/_headers` to use `style-src 'self'` with no hashes and no `'unsafe-inline'`.
3. **No third-party origins.** Fonts, images, icons and CSS are self-hosted. Never add CDNs,
   Google Fonts, analytics, trackers or embeds.
4. **Never relax the CSP** or remove a security header to make something work. Fix the cause.
5. **Content lives in `src/content/`**, validated by Zod. Components never hard-code CV data.
   Every entry must exist in both `en` and `es`.
6. **UI strings live in `src/i18n/ui.ts`**, never hard-coded in components. New pages need an
   entry in `src/i18n/routes.ts` (translated slugs) and a thin route file per locale in
   `src/pages/` that renders a shared component from `src/components/pages/`.
7. **Accessibility: WCAG 2.2 AA.** Semantic HTML, one `<h1>` per page, visible focus, 24×24 px
   minimum target size, sufficient contrast in both color schemes, `lang` on the document and on
   foreign-language fragments.
8. **Dependencies:** do not add any package that the owner has not approved. Versions are pinned
   exactly (`.npmrc` has `save-exact=true`). Dependency install scripts are blocked by npm unless
   listed in `allowScripts`; never approve one without asking. Vulnerable transitive packages are
   fixed with `overrides` (documented in the commit), never with `npm audit fix --force`.
9. **Deployments happen only in GitHub Actions** (`deploy.yml`, `pr.yml`, `rollback.yml`). Never
   run `wrangler deploy`, `wrangler preview` or `wrangler rollback` locally, and never ask for or
   handle the Cloudflare token. Changes to Cloudflare resources (custom domain, token scopes) need
   the owner's approval.
10. Never commit secrets. `.env*` files are git-ignored; gitleaks runs on every commit and in CI.
    **The repository is public:** never add personal data that the site does not need (phone,
    address, personal email, local paths, employer-internal information).
11. **Never weaken a test to make it pass** (skip lists, thresholds, allowed errors). If a check
    must be relaxed, ask the owner and document why next to the change.
12. Git hooks (lefthook) must not be bypassed (`--no-verify`).
13. **Workflows:** pin every action to a full commit SHA with the version in a comment, keep
    `permissions: {}` at the top and the minimum per job, `persist-credentials: false`, a
    `timeout-minutes` on every job, no `pull_request_target`, no `${{ }}` expressions inside `run:`
    (pass them through `env:`). zizmor runs in CI with the pedantic persona and must stay clean.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `build:`, `ci:`, `test:`,
  `refactor:`), small and focused.
- Code, comments and identifiers in English. Content in both English and Spanish.
- Prefer Astro components with typed `Props` interfaces. Import aliases: `@/…` → `src/…`.
- Dates in content use `YYYY-MM`. An absent `end` means "present".
- Tailwind utility classes in markup; shared tokens (colors, fonts) in `global.css` under `@theme`.

## Updating the CV

- Profile, summary, links: `src/content/profile/profile.json`
- Jobs: `src/content/experience/{en,es}/<slug>.md` (same slug in both locales)
- Projects: `src/content/projects/{en,es}/<slug>.md`
- Certifications: `src/content/certifications/certifications.json`
- Skills: `src/content/skills/skills.json`

`npm run build` fails if any entry breaks its schema or is missing a translation.

## Known exceptions (documented on purpose)

- Pull requests from Dependabot (and forks) skip the Cloudflare preview: GitHub does not give them
  Actions secrets. They still run every check; production smoke tests run after merge.
- `allowScripts` denies the install scripts of lefthook, esbuild and workerd: nothing we run needs
  them (hooks are installed by our own `prepare` script; wrangler deploy/preview work without them).

- `astro preview` drops `upgrade-insecure-requests` from the CSP: WebKit would otherwise rewrite
  `http://localhost` assets to https. Production keeps it, enforced by `tests/security`.
- `linkinator.config.json` skips linkedin.com (HTTP 999 for bots). HTTP 403 is reported as a
  warning, not a failure: github.com answers 403 to requests from GitHub Actions runners while the
  page exists. 404s and connection errors still fail the check.
- `lighthouserc.cjs` uses Playwright's `chrome-headless-shell`: some Windows policies block the
  unsigned full Chromium binary. `CHROME_PATH` overrides it.

## Roadmap

- Phase 1: local site. Done.
- Phase 2: tests and git hooks. Done.
- Phase 3: CI/CD to Cloudflare Workers Static Assets. Done.
- Phase 4 (current): custom domain `andresmolina.dev`. HSTS preload needs no submission (the
  `.dev` TLD is preloaded). `www` → apex is a Cloudflare Single Redirect rule (301, path and query
  kept), managed in the dashboard. securityheaders.com and Mozilla Observatory: A+ (2026-11-24).
