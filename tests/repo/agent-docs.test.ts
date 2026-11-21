import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** AGENTS.md is the single source of truth; tool-specific files must only point to it. */
describe('agent instruction files', () => {
  it('AGENTS.md exists and states the hard rules', () => {
    const agents = readFileSync('AGENTS.md', 'utf8');
    expect(agents).toMatch(/Zero client-side JavaScript/);
    expect(agents).toMatch(/Never relax the CSP/);
  });

  it.each(['CLAUDE.md', '.github/copilot-instructions.md', '.cursor/rules/project.mdc'])(
    '%s exists and points to AGENTS.md',
    (path) => {
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, 'utf8')).toContain('AGENTS.md');
    },
  );

  it('CLAUDE.md imports AGENTS.md', () => {
    expect(readFileSync('CLAUDE.md', 'utf8')).toMatch(/^@AGENTS\.md$/m);
  });
});
