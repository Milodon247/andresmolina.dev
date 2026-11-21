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
- Deployment target: Cloudflare (Phase 3, not configured yet).

## Commands

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Dev server on `http://localhost:4321`          |
| `npm run build`   | `astro check` + static build into `dist/`      |
| `npm run preview` | Serve `dist/` locally                          |
| `npm run check`   | Type-check `.astro` and `.ts` files            |

## Layout

```
public/                 static files copied as-is (_headers, .well-known/security.txt, og/)
src/content.config.ts   content collections + Zod schemas
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
2. **Nothing inline.** No `<style>` blocks that end up inline, no `style=""` attributes, no inline
   event handlers. `build.inlineStylesheets` stays `'never'`. This is what allows the CSP in
   `public/_headers` to use `style-src 'self'` with no hashes and no `'unsafe-inline'`.
3. **No third-party origins.** Fonts, images, icons and CSS are self-hosted. Never add CDNs,
   Google Fonts, analytics, trackers or embeds.
4. **Never relax the CSP** or remove a security header to make something work. Fix the cause.
5. **Content lives in `src/content/`**, validated by Zod. Components never hard-code CV data.
   Every entry must exist in both `en` and `es`.
6. **UI strings live in `src/i18n/ui.ts`**, never hard-coded in components.
7. **Accessibility: WCAG 2.2 AA.** Semantic HTML, one `<h1>` per page, visible focus, 24×24 px
   minimum target size, sufficient contrast in both color schemes, `lang` on the document and on
   foreign-language fragments.
8. **Dependencies:** do not add any package that the owner has not approved. Versions are pinned
   exactly (`.npmrc` has `save-exact=true`).
9. **No Cloudflare/deploy changes** until the owner explicitly approves Phase 3.
10. Never commit secrets. `.env*` files are git-ignored.

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

## Roadmap

- Phase 1 (current): local site.
- Phase 2: tests (lint, unit, e2e, axe, headers, links, HTML validation, Lighthouse, git hooks).
- Phase 3: CI/CD to Cloudflare. Only after the owner approves.
