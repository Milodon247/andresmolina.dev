import { z } from 'astro/zod';
import { YEAR_MONTH } from '@/lib/dates';
import { iconNames } from '@/lib/icons';

/**
 * Zod schemas for every content collection. Kept free of `astro:content` so unit tests can import
 * them directly; `src/content.config.ts` wires them to their loaders.
 */

/** A string that must be provided in every locale. */
const localized = z.object({
  en: z.string().trim().min(1),
  es: z.string().trim().min(1),
});

const yearMonth = z.string().regex(YEAR_MONTH, 'Use the YYYY-MM format, e.g. 2024-03');

const httpsUrl = z.url({ protocol: /^https$/ });

const technologies = z.array(z.string().trim().min(1)).default([]);

export const profileSchema = z.object({
  name: z.string().trim().min(1),
  headline: localized,
  location: localized.optional(),
  /** Spoken languages and level, shown under the headline, e.g. { en: 'English (C1)', es: 'Inglés (C1)' }. */
  languages: z.array(localized).default([]),
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
});

export const experienceSchema = z
  .object({
    role: z.string().trim().min(1),
    company: z.string().trim().min(1),
    companyUrl: httpsUrl.optional(),
    location: z.string().trim().min(1).optional(),
    start: yearMonth,
    // Omit `end` for the current role.
    end: yearMonth.optional(),
    technologies,
  })
  .refine((d) => d.end === undefined || d.end >= d.start, {
    message: '`end` must be the same month as `start` or later',
    path: ['end'],
  });

export const projectSchema = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1).max(200),
  // Omit `date` for ongoing work: undated projects are listed first.
  date: yearMonth.optional(),
  featured: z.boolean().default(false),
  repoUrl: httpsUrl.optional(),
  siteUrl: httpsUrl.optional(),
  technologies,
});

/** Certifications are listed by `order` (most relevant first); dates are optional. */
export const certificationSchema = z
  .object({
    order: z.number().int().nonnegative(),
    name: z.string().trim().min(1),
    acronym: z.string().trim().min(1).optional(),
    issuer: z.string().trim().min(1),
    issued: yearMonth.optional(),
    expires: yearMonth.optional(),
    credentialId: z.string().trim().min(1).optional(),
    verifyUrl: httpsUrl.optional(),
  })
  .refine((c) => c.expires === undefined || c.issued === undefined || c.expires >= c.issued, {
    message: '`expires` must not be before `issued`',
    path: ['expires'],
  });

/** A skill is either a language-neutral term ("Terraform") or a phrase translated per locale. */
const skillItem = z.union([z.string().trim().min(1), localized]);

/**
 * A tool shown in the logo carousel. `brand` is a slug in `src/icons/brands/` (the build fails if it
 * does not exist); without it, the tool is shown with the group's icon.
 */
const toolSchema = z.object({
  name: z.string().trim().min(1),
  brand: z
    .string()
    .regex(/^[a-z0-9]+$/, 'Use a Simple Icons slug, e.g. terraform')
    .optional(),
});

export const skillGroupSchema = z.object({
  order: z.number().int().nonnegative(),
  name: localized,
  icon: z.enum(iconNames),
  items: z.array(skillItem).min(1),
  tools: z.array(toolSchema).default([]),
});
