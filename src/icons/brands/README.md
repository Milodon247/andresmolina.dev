# Brand icons

Single-path SVG logos copied from [Simple Icons](https://simpleicons.org) **16.36.0**
(`https://cdn.jsdelivr.net/npm/simple-icons@16.36.0/icons/<slug>.svg`), released under
[CC0 1.0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md). They are copied, not
installed, so the site keeps no runtime or build dependency on the package.

The logos are trademarks of their owners and are used only to name the tools I work with. Brands
that Simple Icons does not ship (for example Microsoft and AWS, removed at their owners' request)
are shown with a generic icon instead.

To add one: download `<slug>.svg` from the same version, check that it is a single `<path>` with a
`<title>` and nothing else (no scripts, links or styles), and reference the slug as `brand` in
`src/content/skills/skills.json`. The build fails on an unknown slug.
