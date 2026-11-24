# andresmolina.dev

[![Deploy](https://github.com/Milodon247/andresmolina.dev/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/Milodon247/andresmolina.dev/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/Milodon247/andresmolina.dev/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/Milodon247/andresmolina.dev/actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/Milodon247/andresmolina.dev/badge)](https://scorecard.dev/viewer/?uri=github.com/Milodon247/andresmolina.dev)
[![Security headers](https://img.shields.io/security-headers?url=https%3A%2F%2Fandresmolina.dev)](https://securityheaders.com/?q=andresmolina.dev&followRedirects=on)

CV and portfolio of **Andrés Molina Bustamante**, DevSecOps architect (CISSP).

The site doubles as a technical showcase: it is fully static, bilingual (English / Spanish), ships
**zero client-side JavaScript**, loads nothing from third-party origins and is served with a strict
Content Security Policy and hardened security headers.

> Status: **Phase 4 (custom domain)**, live at <https://andresmolina.dev>. Every change goes
> through a pull request, the full test suite, a Cloudflare preview with smoke tests, and is
> deployed to production by GitHub Actions only.

## Stack

| Piece     | Choice                                                                      |
| --------- | --------------------------------------------------------------------------- |
| Framework | [Astro](https://astro.build) 7, `output: 'static'`                          |
| Language  | TypeScript, `strictest` config                                              |
| Styles    | Tailwind CSS 4 (`@tailwindcss/vite`), light/dark via `prefers-color-scheme` |
| Content   | Astro Content Collections validated with Zod                                |
| Font      | Inter (variable), self-hosted via Fontsource                                |
| SEO       | `@astrojs/sitemap` with hreflang, `robots.txt`, Open Graph, JSON-LD         |
| Runtime   | Node `>=22.23.4` (`.nvmrc`: 26), npm with committed lockfile                |

## Getting started

Prerequisites: Node (see `.nvmrc`) and [gitleaks](https://github.com/gitleaks/gitleaks) on your
`PATH` for the pre-commit hook (`winget install Gitleaks.Gitleaks` on Windows,
`brew install gitleaks` on macOS).

```bash
nvm use                                  # or: fnm use
npm ci                                   # also installs the git hooks
npx playwright install --with-deps chromium webkit   # browsers for E2E, a11y and Lighthouse (CI uses the Playwright image)
npm run dev                              # http://localhost:4321
```

| Command              | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `npm run dev`        | Development server with hot reload                           |
| `npm run build`      | Type-check (`astro check`) and build into `dist/`            |
| `npm run preview`    | Serve the production build locally with the security headers |
| `npm run test:all`   | Run every check and test (see [Testing](#testing)), ~9 min   |
| `npm run test:quick` | Fast local loop: typecheck, lint, format, unit, build, dist  |
| `npm run test:smoke` | Smoke tests against a deployed URL (`BASE_URL=https://…`)    |
| `npm run format`     | Format the code with Prettier                                |
| `npm run images`     | Regenerate icons and the OG image from their SVG sources     |

## Testing

`npm run test:all` runs every step below in order and stops at the first failure. It takes about
9 minutes, mostly Lighthouse (10 pages × 3 runs). For day-to-day edits, `npm run test:quick` runs
the first five steps plus `test:dist` in 1–2 minutes; CI always runs the full suite on every pull
request and before every deployment.

| Step              | Tool                          | What it guarantees                                                                                                         |
| ----------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `typecheck`       | `astro check`, `tsc --noEmit` | Strict types in `.astro` and `.ts`                                                                                         |
| `lint`            | ESLint                        | Type-aware TypeScript rules, Astro rules, strict jsx-a11y, no inline scripts                                               |
| `format:check`    | Prettier                      | Consistent formatting                                                                                                      |
| `test:unit`       | Vitest                        | Dates, i18n routes and dictionary parity, content schemas, `_headers` and CSP, `security.txt` expiry                       |
| `build`           | Astro                         | Content validates against schemas; every entry exists in both languages                                                    |
| `test:dist`       | Vitest                        | No inline scripts/styles, no JS files, no third-party resources, canonical + hreflang on every page                        |
| `test:html`       | html-validate                 | Valid, well-formed HTML                                                                                                    |
| `test:links`      | linkinator                    | No broken internal or external links                                                                                       |
| `test:e2e`        | Playwright                    | 200/404 status, navigation, language button, light/dark, no overflow, zero console errors, zero external requests, zero JS |
| `test:a11y`       | axe-core                      | Zero WCAG 2.2 AA violations on every page, in light and dark mode                                                          |
| `test:lighthouse` | Lighthouse CI                 | Performance ≥ 95, Accessibility = Best Practices = SEO = 100 on every page                                                 |

E2E, a11y and Lighthouse run on three browser projects or presets: desktop Chromium, mobile
Chromium (Pixel 7) and mobile WebKit (iPhone 15). `npm run preview` (used by Playwright) serves the
site with the headers from `public/_headers`, so any CSP violation fails the tests locally.

**Git hooks** (lefthook, installed by `npm ci`):

- `pre-commit`: gitleaks on staged changes, ESLint and Prettier on staged files, typecheck.
- `commit-msg`: [Conventional Commits](https://www.conventionalcommits.org) format.

## Languages and URLs

English is the default language; Spanish lives under `/es/` with translated slugs. Every page has
a visible language button (header and footer) linking to the same page in the other language.

| Page           | English            | Spanish                |
| -------------- | ------------------ | ---------------------- |
| About          | `/`                | `/es/`                 |
| Experience     | `/experience/`     | `/es/experiencia/`     |
| Certifications | `/certifications/` | `/es/certificaciones/` |
| Projects       | `/projects/`       | `/es/proyectos/`       |
| Contact        | `/contact/`        | `/es/contacto/`        |

## Updating the CV

All CV data lives in `src/content/`. Edit the files and run `npm run build`; the build fails with
a clear message if something does not match its schema (`src/content.config.ts`) or if an entry is
missing in one of the languages.

| What                                                | File(s)                                                |
| --------------------------------------------------- | ------------------------------------------------------ |
| Name, headline, summary, about, email, social links | `src/content/profile/profile.json`                     |
| Jobs                                                | `src/content/experience/en/<slug>.md` + `es/<slug>.md` |
| Projects                                            | `src/content/projects/en/<slug>.md` + `es/<slug>.md`   |
| Certifications                                      | `src/content/certifications/certifications.json`       |
| Skills                                              | `src/content/skills/skills.json`                       |
| Interface text (menus, headings)                    | `src/i18n/ui.ts`                                       |

Conventions:

- Dates use `YYYY-MM`. Omit `end` on the current job.
- Translatable fields in JSON are objects: `{ "en": "…", "es": "…" }`.
- A Markdown entry must use the **same file name** in `en/` and `es/`; its body (bullets or
  paragraphs) is rendered on the page.
- Links must be `https://`.
- **This repository is public.** Only add what you want on the public site: no phone number, home
  address, date of birth or ID numbers. Prefer a dedicated email alias over a personal inbox, and
  only add a certification's credential ID if the issuer expects it to be shared for verification.

Example job (`src/content/experience/en/acme.md`):

```markdown
---
role: DevSecOps Architect
company: Acme
companyUrl: https://acme.example
location: Remote
start: 2023-02
technologies: [Kubernetes, Terraform]
---

- What you did and the measurable outcome.
```

## Security

- **CSP** (`public/_headers`): `default-src 'none'` and only `'self'` for styles, images, fonts and
  the manifest. No `unsafe-inline`, no `unsafe-eval`, no hashes needed: the build emits no inline
  scripts or styles (`build.inlineStylesheets: 'never'`, no client JS).
- **Other headers**: HSTS (2 years, `includeSubDomains`, `preload`), `X-Frame-Options: DENY` +
  `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, deny-all
  `Permissions-Policy`, COOP / COEP / CORP.
- **No third parties**: fonts and icons are self-hosted, no analytics, no cookies.
- **Vulnerability disclosure**: [`/.well-known/security.txt`](public/.well-known/security.txt)
  (RFC 9116). A test fails 30 days before `Expires`, so it gets renewed in time.
- **Supply chain**: exact versions, committed lockfile, npm install scripts blocked by default
  (`allowScripts` in `package.json`), vulnerable transitive packages pinned with `overrides`,
  gitleaks on every commit.

`_headers` is applied by Cloudflare in production and by `astro preview` locally (minus
`upgrade-insecure-requests`, which would break `http://localhost` in WebKit). `astro dev` does not
apply it.

## Deployment pipeline

The site runs on **Cloudflare Workers with Static Assets** (an assets-only Worker serving `dist/`,
configured in [`wrangler.jsonc`](wrangler.jsonc)), which Cloudflare recommends over Pages for new
projects. Nothing is deployed from a laptop or the Cloudflare dashboard: the Worker is created by
the first `wrangler deploy` in CI.

| Workflow                                             | Trigger                 | What it does                                                                                                                                           |
| ---------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`checks.yml`](.github/workflows/checks.yml)         | called by the two below | `test:all`, `npm audit --audit-level=high` + `npm audit signatures`, gitleaks on the full history, zizmor on the workflows. Uploads the tested `dist/` |
| [`pr.yml`](.github/workflows/pr.yml)                 | pull request to `main`  | Checks + dependency review, then `wrangler preview` of the tested build as `pr-<number>` and smoke tests against that URL (real HTTP headers)          |
| [`pr-cleanup.yml`](.github/workflows/pr-cleanup.yml) | pull request closed     | Deletes the PR's preview                                                                                                                               |
| [`deploy.yml`](.github/workflows/deploy.yml)         | push to `main`          | Checks → `wrangler deploy --strict` of the tested build (environment `production`) → smoke tests against production                                    |
| [`rollback.yml`](.github/workflows/rollback.yml)     | manual                  | `wrangler rollback` to a given (or the previous) version, then production smoke tests                                                                  |
| [`codeql.yml`](.github/workflows/codeql.yml)         | PR, push, weekly        | CodeQL `security-extended` for TypeScript and GitHub Actions                                                                                           |
| [`scorecard.yml`](.github/workflows/scorecard.yml)   | push, weekly            | OpenSSF Scorecard, published for the badge and uploaded to Code Scanning                                                                               |
| [`dependabot.yml`](.github/dependabot.yml)           | weekly                  | Grouped npm and Actions updates with a 7-day cooldown (security updates are not delayed)                                                               |

Pipeline hardening: every action pinned to a full commit SHA, `permissions: {}` by default and the
minimum per job, `persist-credentials: false`, `timeout-minutes` on every job, `concurrency` so two
production changes never overlap, no `pull_request_target`, no dependency cache in deploy paths,
gitleaks installed from a checksum-verified release, wrangler run from the lockfile (no third-party
deploy action). Pull requests from forks and from Dependabot run all checks but never receive
secrets or previews. zizmor (pedantic) reports no findings.

### Cloudflare API token (least privilege)

Create it in **Cloudflare dashboard → My Profile → API Tokens → Create Token → Create Custom Token**:

| Field               | Value                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| Permissions         | **Account → Workers Scripts → Edit** and **Zone → Workers Routes → Edit** (nothing else)                      |
| Account Resources   | **Include → your account** only                                                                               |
| Zone Resources      | **Include → Specific zone → `andresmolina.dev`** only                                                         |
| Client IP filtering | Leave empty: GitHub-hosted runners have no fixed IP range                                                     |
| TTL                 | **End date ≤ 90 days**. Rotate before it expires (create a new token, update the secrets, delete the old one) |

The zone permission lets `wrangler deploy` attach the custom domains declared in
[`wrangler.jsonc`](wrangler.jsonc) (`andresmolina.dev` and `www.andresmolina.dev`); Cloudflare then
creates their DNS records and certificates. Your **Account ID** is shown on the Workers & Pages overview page; it is an identifier, not a
credential, but it is still stored as a secret to keep it out of logs.

### GitHub repository setup

[`scripts/github-setup.sh`](scripts/github-setup.sh) applies the whole configuration with the
GitHub CLI and is safe to re-run:

```bash
scripts/github-setup.sh Milodon247/andresmolina.dev
```

It enables secret scanning, push protection, Dependabot alerts and security updates; allows only
squash merges; creates the `production` environment (deployable from `main` only) and the `preview`
environment; and creates this **ruleset for `main`**. The production URL is not a GitHub setting:
it is `PRODUCTION_URL` in [`deploy.yml`](.github/workflows/deploy.yml) and
[`rollback.yml`](.github/workflows/rollback.yml), changed in the same commit as the domain in
`wrangler.jsonc` (a unit test keeps the three and `site` in `astro.config.ts` in sync).

- Pull request required; review threads must be resolved; squash merge only.
- Required status checks (branch must be up to date): `Checks / test:all`, `Checks / npm audit`,
  `Checks / gitleaks`, `Checks / zizmor`, `Dependency review`, `Smoke tests (preview)`,
  `Analyze (javascript-typescript)`, `Analyze (actions)`.
- No force pushes, no deletion, linear history.

Then store the Cloudflare secrets in both environments (the CLI prompts for the values):

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo Milodon247/andresmolina.dev --env production
gh secret set CLOUDFLARE_ACCOUNT_ID --repo Milodon247/andresmolina.dev --env production
gh secret set CLOUDFLARE_API_TOKEN --repo Milodon247/andresmolina.dev --env preview
gh secret set CLOUDFLARE_ACCOUNT_ID --repo Milodon247/andresmolina.dev --env preview
```

### Rollback

If the production smoke tests fail, the `Deploy` run turns red and its summary shows the version
that was live before. To restore it: **Actions → Rollback → Run workflow**, paste that
`version_id` (or leave it empty for the version before the current one) and give a reason. The
workflow runs `wrangler rollback` and the production smoke tests again. Afterwards, fix the cause in
a pull request: the next merge to `main` deploys normally.

**Rollback restores code, not infrastructure.** Custom domains, the `workers.dev` toggle and zone
settings belong to the Worker or the zone, not to a version, so `wrangler rollback` (and even a
revert PR) leaves them as they are. If the failure is in the domain itself (DNS or certificate not
ready, a zone feature rewriting pages, an extra header added by a zone rule):

1. Check the run's logs: `Wait for production to answer` failing means DNS/certificate; a smoke
   test mentioning `/cdn-cgi/` or an unexpected header means a zone setting.
2. Fix it in the Cloudflare dashboard (zone `andresmolina.dev`: Scrape Shield, Rules, SSL/TLS), or,
   to take the domain out of service, detach it under **Workers & Pages → andresmolina-dev →
   Settings → Domains & Routes** and re-enable `workers.dev` there.
3. Re-run the failed jobs of the `Deploy` run, or open a PR that matches `wrangler.jsonc` and
   `PRODUCTION_URL` to the state you chose.

Limits (Cloudflare): only the 100 most recent versions can be restored, and versions older than
30 days may be deleted by retention. `npx wrangler deployments list` and `npx wrangler versions list`
show the history.

## Project structure

```
.github/              workflows, Dependabot, Copilot instructions
astro.config.ts       site URL, static output, sitemap (hreflang), Tailwind, preview headers
wrangler.jsonc        Cloudflare Worker (static assets) configuration
public/               _headers, security.txt, icons, OG image, manifest
design/               SVG sources of generated images
scripts/              maintenance scripts, commit-msg check, shared tooling (scripts/lib)
tests/                unit, security, repo, dist (Vitest), e2e (Playwright + axe), smoke (deployed URL)
src/content/          CV data (see above) and its Zod schemas (schemas.ts)
src/content.config.ts collections wiring
src/i18n/             locales, translated route map, UI strings
src/components/       layout, SEO head, CV building blocks, shared page bodies
src/layouts/          BaseLayout
src/lib/              pure utilities (dates, translation checks) and content queries
src/pages/            English routes at the root, Spanish in es/
src/styles/global.css design tokens, light/dark, print styles
```

## AI agents

Instructions for coding agents live in a single file, [`AGENTS.md`](AGENTS.md).
`CLAUDE.md`, `.github/copilot-instructions.md` and `.cursor/rules/project.mdc` only point to it.

## Roadmap

1. **Phase 1, local site**: done.
2. **Phase 2, tests**: done.
3. **Phase 3, CI/CD**: done.
4. **Phase 4, custom domain**: `andresmolina.dev` (and `www`) served by the Worker; the main
   `workers.dev` route is off (version and PR preview URLs stay on `workers.dev` with `noindex`,
   because `wrangler preview` needs them); email routing with SPF, DKIM and DMARC `p=reject`. HSTS
   preload needs no submission: the whole `.dev` TLD is preloaded in browsers.
