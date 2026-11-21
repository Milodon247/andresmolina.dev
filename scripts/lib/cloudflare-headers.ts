/**
 * Minimal parser for Cloudflare's `_headers` file format, shared by the local preview server
 * (astro.config.ts) and the security tests, so both read exactly what production will serve.
 *
 * Format: a URL pattern on its own line, followed by indented `Name: value` lines. `#` starts a
 * comment. Patterns support `*` (splat) and `:placeholder`. Every matching rule applies.
 * Only erasable TypeScript syntax is used so Node can run this file without a build step.
 */

export interface HeaderRule {
  pattern: string;
  headers: [name: string, value: string][];
}

export function parseHeadersFile(source: string): HeaderRule[] {
  const rules: HeaderRule[] = [];
  let current: HeaderRule | undefined;

  for (const [index, raw] of source.split(/\r?\n/).entries()) {
    const line = raw.trimEnd();
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    if (!/^\s/.test(line)) {
      current = { pattern: line.trim(), headers: [] };
      rules.push(current);
      continue;
    }

    if (!current) throw new Error(`_headers line ${index + 1}: header without a URL pattern`);
    const separator = line.indexOf(':');
    if (separator === -1) throw new Error(`_headers line ${index + 1}: expected "Name: value"`);
    const name = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (!name || !value) throw new Error(`_headers line ${index + 1}: empty header name or value`);
    current.headers.push([name, value]);
  }

  return rules;
}

function patternToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:[A-Za-z]\w*/g, '[^/]+'))
    .join('.*');
  return new RegExp(`^${escaped}$`);
}

/** Headers that apply to `path`, merged in file order (repeated names are comma-joined). */
export function headersForPath(rules: readonly HeaderRule[], path: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const rule of rules) {
    if (!patternToRegExp(rule.pattern).test(path)) continue;
    for (const [name, value] of rule.headers) {
      const key = Object.keys(result).find((k) => k.toLowerCase() === name.toLowerCase()) ?? name;
      result[key] = result[key] === undefined ? value : `${result[key]}, ${value}`;
    }
  }
  return result;
}

/** Splits a CSP into `{ directive: [sources] }`. */
export function parseCsp(policy: string): Map<string, string[]> {
  const directives = new Map<string, string[]>();
  for (const part of policy.split(';')) {
    const [name, ...values] = part.trim().split(/\s+/);
    if (name) directives.set(name.toLowerCase(), values);
  }
  return directives;
}
