/**
 * Brand logos from `src/icons/brands/*.svg` (Simple Icons, CC0), read at build time. Each file is a
 * single `<path>` with a `<title>`; only those two values are used, so nothing else in the file can
 * reach the page.
 */
const files = import.meta.glob<string>('../icons/brands/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export interface BrandIcon {
  title: string;
  path: string;
}

export const brandIcons: Record<string, BrandIcon> = Object.fromEntries(
  Object.entries(files).map(([file, svg]) => {
    const slug = /([a-z0-9]+)\.svg$/.exec(file)?.[1];
    const title = /<title>([^<]+)<\/title>/.exec(svg)?.[1];
    const path = /<path d="([^"]+)"\s*\/>/.exec(svg)?.[1];
    if (!slug || !title || !path || (svg.match(/<path\b/g) ?? []).length !== 1) {
      throw new Error(`${file} is not a single-path Simple Icons SVG`);
    }
    return [slug, { title, path }];
  }),
);

export function brandIcon(slug: string): BrandIcon {
  const icon = brandIcons[slug];
  if (!icon) throw new Error(`Unknown brand icon "${slug}": add src/icons/brands/${slug}.svg`);
  return icon;
}
