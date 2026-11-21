import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** RFC 9116 checks for /.well-known/security.txt. */
const fields = new Map<string, string[]>();
for (const line of readFileSync('public/.well-known/security.txt', 'utf8').split(/\r?\n/)) {
  const match = /^([A-Za-z-]+):\s*(.+)$/.exec(line);
  if (!match?.[1] || !match[2]) continue;
  const name = match[1].toLowerCase();
  fields.set(name, [...(fields.get(name) ?? []), match[2].trim()]);
}

const DAY = 24 * 60 * 60 * 1000;

describe('security.txt', () => {
  it('has at least one Contact with a mailto: or https: URI', () => {
    const contacts = fields.get('contact') ?? [];
    expect(contacts.length).toBeGreaterThan(0);
    for (const contact of contacts) expect(contact).toMatch(/^(mailto:|https:\/\/)/);
  });

  it('has exactly one Expires, valid for at least 30 more days and at most one year', () => {
    const expires = fields.get('expires') ?? [];
    expect(expires).toHaveLength(1);
    const date = new Date(expires[0] ?? '');
    expect(Number.isNaN(date.getTime())).toBe(false);
    const remaining = date.getTime() - Date.now();
    expect(remaining, 'security.txt expires in less than 30 days: renew it').toBeGreaterThan(30 * DAY);
    expect(remaining, 'RFC 9116 recommends Expires less than a year away').toBeLessThanOrEqual(366 * DAY);
  });

  it('declares its canonical https URL on the site domain', () => {
    expect(fields.get('canonical')).toEqual(['https://andresmolina.dev/.well-known/security.txt']);
  });

  it('lists the site languages', () => {
    expect(fields.get('preferred-languages')?.[0]).toBe('en, es');
  });
});
