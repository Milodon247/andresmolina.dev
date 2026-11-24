import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  certificationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillGroupSchema,
} from '@/content/schemas';

const readJson = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8'));

describe('experienceSchema', () => {
  const valid = {
    role: 'Architect',
    company: 'Acme',
    location: 'Remote',
    start: '2023-02',
    technologies: ['Kubernetes'],
  };

  it('accepts a current role without end date and defaults technologies', () => {
    expect(experienceSchema.safeParse(valid).success).toBe(true);
    expect(experienceSchema.parse({ ...valid, technologies: undefined }).technologies).toEqual([]);
  });

  it('accepts end equal to or after start', () => {
    expect(experienceSchema.safeParse({ ...valid, end: '2023-02' }).success).toBe(true);
    expect(experienceSchema.safeParse({ ...valid, end: '2024-01' }).success).toBe(true);
  });

  it('rejects end before start', () => {
    const result = experienceSchema.safeParse({ ...valid, end: '2022-12' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['end']);
  });

  it.each(['2023-13', '2023-2', 'Feb 2023', '2023-02-01'])('rejects start date %j', (start) => {
    expect(experienceSchema.safeParse({ ...valid, start }).success).toBe(false);
  });

  it('rejects non-https company URLs', () => {
    expect(experienceSchema.safeParse({ ...valid, companyUrl: 'http://acme.example' }).success).toBe(false);
    expect(experienceSchema.safeParse({ ...valid, companyUrl: 'https://acme.example' }).success).toBe(true);
  });

  it('rejects blank required strings', () => {
    expect(experienceSchema.safeParse({ ...valid, role: '   ' }).success).toBe(false);
  });
});

describe('projectSchema', () => {
  const valid = { title: 'Site', summary: 'Short summary', date: '2026-11' };

  it('defaults featured to false', () => {
    expect(projectSchema.parse(valid).featured).toBe(false);
  });

  it('accepts an ongoing project without date but validates a date when present', () => {
    expect(projectSchema.safeParse({ title: 'Site', summary: 'Short summary' }).success).toBe(true);
    expect(projectSchema.safeParse({ ...valid, date: '2026-13' }).success).toBe(false);
  });

  it('limits the summary to 200 characters', () => {
    expect(projectSchema.safeParse({ ...valid, summary: 'x'.repeat(201) }).success).toBe(false);
  });

  it('rejects javascript: and http: links', () => {
    expect(projectSchema.safeParse({ ...valid, repoUrl: 'javascript:alert(1)' }).success).toBe(false);
    expect(projectSchema.safeParse({ ...valid, siteUrl: 'http://example.com' }).success).toBe(false);
  });
});

describe('certificationSchema', () => {
  const valid = { order: 1, name: 'CISSP', issuer: 'ISC2', issued: '2023-06' };

  it('accepts a certification without expiry', () => {
    expect(certificationSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an expiry before the issue date', () => {
    expect(certificationSchema.safeParse({ ...valid, expires: '2023-05' }).success).toBe(false);
  });

  it('accepts a certification without dates but still validates them when present', () => {
    expect(certificationSchema.safeParse({ order: 1, name: 'CISSP', issuer: 'ISC2' }).success).toBe(true);
    expect(
      certificationSchema.safeParse({ order: 1, name: 'CISSP', issuer: 'ISC2', issued: '2023-6' }).success,
    ).toBe(false);
  });
});

describe('skillGroupSchema', () => {
  const group = { order: 1, name: { en: 'Cloud', es: 'Cloud' }, icon: 'cloud', items: ['AWS'] };

  it('accepts language-neutral terms and translated phrases', () => {
    const items = ['Terraform', { en: 'Policy as code', es: 'Políticas como código' }];
    expect(skillGroupSchema.safeParse({ ...group, items }).success).toBe(true);
  });

  it('rejects a phrase missing one language', () => {
    expect(skillGroupSchema.safeParse({ ...group, items: [{ en: 'Policy as code' }] }).success).toBe(false);
  });

  it('requires a known category icon', () => {
    expect(skillGroupSchema.safeParse({ ...group, icon: 'rocket' }).success).toBe(false);
    expect(skillGroupSchema.safeParse({ ...group, icon: undefined }).success).toBe(false);
  });

  it('defaults tools to none and only accepts Simple Icons slugs as brand', () => {
    expect(skillGroupSchema.parse(group).tools).toEqual([]);
    const tools = (brand: string) => ({ ...group, tools: [{ name: 'Terraform', brand }] });
    expect(skillGroupSchema.safeParse(tools('terraform')).success).toBe(true);
    expect(skillGroupSchema.safeParse(tools('../terraform')).success).toBe(false);
  });
});

describe('profileSchema', () => {
  it('requires every localized field in both languages', () => {
    const profile = readJson('src/content/profile/profile.json') as Record<string, unknown>[];
    const entry = { ...profile[0], summary: { en: 'Only English' } };
    expect(profileSchema.safeParse(entry).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const profile = readJson('src/content/profile/profile.json') as Record<string, unknown>[];
    expect(profileSchema.safeParse({ ...profile[0], email: 'not-an-email' }).success).toBe(false);
  });
});

describe('content JSON files', () => {
  it.each([
    ['src/content/profile/profile.json', profileSchema],
    ['src/content/certifications/certifications.json', certificationSchema],
    ['src/content/skills/skills.json', skillGroupSchema],
  ] as const)('%s matches its schema and has unique ids', (path, schema) => {
    const entries = readJson(path) as { id: string }[];
    expect(entries.length).toBeGreaterThan(0);
    expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length);
    for (const entry of entries) {
      const result = schema.safeParse(entry);
      expect(result.error?.issues ?? [], `entry "${entry.id}"`).toEqual([]);
    }
  });
});
