import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { brandIcon, brandIcons } from '@/lib/brand-icons';

const skills = JSON.parse(readFileSync('src/content/skills/skills.json', 'utf8')) as {
  tools?: { name: string; brand?: string }[];
}[];
const referenced = skills.flatMap((g) => g.tools ?? []).flatMap((t) => (t.brand ? [t.brand] : []));

describe('brand icons', () => {
  it('loads every SVG in src/icons/brands', () => {
    const files = readdirSync('src/icons/brands').filter((f) => f.endsWith('.svg'));
    expect(Object.keys(brandIcons).sort()).toEqual(files.map((f) => f.replace(/\.svg$/, '')).sort());
  });

  it.each(Object.entries(brandIcons))('%s is a titled single path', (_slug, icon) => {
    expect(icon.title.length).toBeGreaterThan(0);
    expect(icon.path).toMatch(/^[Mm][\d\s.,MmLlHhVvCcSsQqTtAaZz-]+$/);
  });

  it('has a file for every brand referenced in skills.json', () => {
    expect(referenced.length).toBeGreaterThan(0);
    for (const slug of referenced) expect(() => brandIcon(slug)).not.toThrow();
  });

  it('fails loudly on an unknown brand', () => {
    expect(() => brandIcon('nope')).toThrow(/Unknown brand icon/);
  });
});
