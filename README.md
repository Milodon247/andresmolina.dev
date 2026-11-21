# andresmolina.dev

CV and portfolio of **Andrés Molina Bustamante**, DevSecOps architect (CISSP).

The site doubles as a technical showcase: it is fully static, bilingual (English / Spanish), ships
**zero client-side JavaScript**, loads nothing from third-party origins and is served with a strict
Content Security Policy and hardened security headers.

> Status: **Phase 2 (tests)**. The site runs locally and is covered by the full test suite. The
> Cloudflare CI/CD pipeline (Phase 3) is not set up yet; badges will be added with it.

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
npx playwright install chromium webkit   # browsers for E2E, a11y and Lighthouse
npm run dev                              # http://localhost:4321
```

| Command            | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `npm run dev`      | Development server with hot reload                           |
| `npm run build`    | Type-check (`astro check`) and build into `dist/`            |
| `npm run preview`  | Serve the production build locally with the security headers |
| `npm run test:all` | Run every check and test (see [Testing](#testing))           |
| `npm run format`   | Format the code with Prettier                                |
| `npm run images`   | Regenerate icons and the OG image from their SVG sources     |

## Testing

`npm run test:all` runs every step below in order and stops at the first failure.

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

## Project structure

```
astro.config.ts       site URL, static output, sitemap (hreflang), Tailwind, preview headers
public/               _headers, security.txt, icons, OG image, manifest
design/               SVG sources of generated images
scripts/              maintenance scripts, commit-msg check, shared tooling (scripts/lib)
tests/                unit, security, repo, dist (Vitest) and e2e (Playwright + axe)
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
2. **Phase 2, tests**: done, pending review.
3. **Phase 3, CI/CD**: GitHub Actions to Cloudflare with preview deploys, smoke tests and
   repository hardening.
