import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/config';
import { compareYearMonthDesc } from './dates';
import { assertTranslationParity, splitLocaleId } from './locale-entries';

type LocalizedCollection = 'experience' | 'projects';

/** Entries of a per-locale Markdown collection, failing the build if a translation is missing. */
async function getLocalized<C extends LocalizedCollection>(
  collection: C,
  locale: Locale,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);
  assertTranslationParity(
    collection,
    entries.map((e) => e.id),
  );
  return entries.filter((e) => splitLocaleId(e.id).locale === locale);
}

export async function getProfile(): Promise<CollectionEntry<'profile'>['data']> {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('Missing profile entry with id "main" in src/content/profile/profile.json');
  return entry.data;
}

export async function getExperience(locale: Locale): Promise<CollectionEntry<'experience'>[]> {
  const entries = await getLocalized('experience', locale);
  return entries.sort((a, b) => compareYearMonthDesc(a.data.start, b.data.start));
}

export async function getProjects(locale: Locale): Promise<CollectionEntry<'projects'>[]> {
  const entries = await getLocalized('projects', locale);
  return entries.sort((a, b) => compareYearMonthDesc(a.data.date, b.data.date));
}

export async function getCertifications(): Promise<CollectionEntry<'certifications'>[]> {
  const entries = await getCollection('certifications');
  return entries.sort((a, b) => compareYearMonthDesc(a.data.issued, b.data.issued));
}

export async function getSkills(): Promise<CollectionEntry<'skills'>[]> {
  const entries = await getCollection('skills');
  return entries.sort((a, b) => a.data.order - b.data.order);
}
