import { describe, expect, it } from 'vitest';
import { validateCommitMessage } from '../../scripts/lib/commit-message.ts';

describe('validateCommitMessage', () => {
  it.each([
    'feat: add projects page',
    'fix(i18n): translate 404 title',
    'feat!: drop node 20 support',
    'chore(deps)!: bump astro to 8',
    'docs: update readme\n\nLonger body.\n\nCo-Authored-By: Someone <a@b.c>',
    '# comment line from git\nci: add workflow',
    'Merge branch "main" into feature',
    'Revert "feat: add projects page"',
    'fixup! feat: add projects page',
  ])('accepts %j', (message) => {
    expect(validateCommitMessage(message)).toBeUndefined();
  });

  it.each([
    'add projects page',
    'Feat: add projects page',
    'feature: add projects page',
    'feat:add projects page',
    'feat(I18N): uppercase scope',
    'feat: ',
    `feat: ${'x'.repeat(101)}`,
    '',
  ])('rejects %j', (message) => {
    expect(validateCommitMessage(message)).toMatch(/Invalid commit message header/);
  });
});
