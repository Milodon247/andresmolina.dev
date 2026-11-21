import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import {
  certificationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillGroupSchema,
} from '@/content/schemas';

const profile = defineCollection({
  loader: file('src/content/profile/profile.json'),
  schema: profileSchema,
});

const experience = defineCollection({
  loader: glob({ pattern: '{en,es}/**/*.md', base: './src/content/experience' }),
  schema: experienceSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '{en,es}/**/*.md', base: './src/content/projects' }),
  schema: projectSchema,
});

const certifications = defineCollection({
  loader: file('src/content/certifications/certifications.json'),
  schema: certificationSchema,
});

const skills = defineCollection({
  loader: file('src/content/skills/skills.json'),
  schema: skillGroupSchema,
});

export const collections = { profile, experience, projects, certifications, skills };
