import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { YEAR_MONTH } from '@/lib/dates';

/** A string that must be provided in every locale. */
const localized = z.object({
  en: z.string().trim().min(1),
  es: z.string().trim().min(1),
});

const yearMonth = z.string().regex(YEAR_MONTH, 'Use the YYYY-MM format, e.g. 2024-03');

const httpsUrl = z.url({ protocol: /^https$/ });

const technologies = z.array(z.string().trim().min(1)).default([]);

const profile = defineCollection({
  loader: file('src/content/profile/profile.json'),
  schema: z.object({
    name: z.string().trim().min(1),
    headline: localized,
    location: localized,
    summary: localized,
    about: z.object({
      en: z.array(z.string().trim().min(1)).min(1),
      es: z.array(z.string().trim().min(1)).min(1),
    }),
    email: z.email(),
    links: z
      .array(
        z.object({
          kind: z.enum(['github', 'linkedin', 'credly', 'website', 'other']),
          label: z.string().trim().min(1),
          url: httpsUrl,
        }),
      )
      .default([]),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '{en,es}/**/*.md', base: './src/content/experience' }),
  schema: z
    .object({
      role: z.string().trim().min(1),
      company: z.string().trim().min(1),
      companyUrl: httpsUrl.optional(),
      location: z.string().trim().min(1),
      start: yearMonth,
      // Omit `end` for the current role.
      end: yearMonth.optional(),
      technologies,
    })
    .refine((d) => d.end === undefined || d.end >= d.start, {
      message: '`end` must be the same month as `start` or later',
      path: ['end'],
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '{en,es}/**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1).max(200),
    date: yearMonth,
    featured: z.boolean().default(false),
    repoUrl: httpsUrl.optional(),
    siteUrl: httpsUrl.optional(),
    technologies,
  }),
});

const certifications = defineCollection({
  loader: file('src/content/certifications/certifications.json'),
  schema: z
    .object({
      name: z.string().trim().min(1),
      acronym: z.string().trim().min(1).optional(),
      issuer: z.string().trim().min(1),
      issued: yearMonth,
      expires: yearMonth.optional(),
      credentialId: z.string().trim().min(1).optional(),
      verifyUrl: httpsUrl.optional(),
    })
    .refine((c) => c.expires === undefined || c.expires >= c.issued, {
      message: '`expires` must not be before `issued`',
      path: ['expires'],
    }),
});

const skills = defineCollection({
  loader: file('src/content/skills/skills.json'),
  schema: z.object({
    order: z.number().int().nonnegative(),
    name: localized,
    items: z.array(z.string().trim().min(1)).min(1),
  }),
});

export const collections = { profile, experience, projects, certifications, skills };
