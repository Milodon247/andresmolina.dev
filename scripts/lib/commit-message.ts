/** Conventional Commits check for the commit-msg hook (https://www.conventionalcommits.org). */

export const COMMIT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
] as const;

const HEADER = new RegExp(`^(${COMMIT_TYPES.join('|')})(\\([a-z0-9-]+\\))?!?: \\S.{0,99}$`);

/** Messages git generates itself (merges, reverts, fixups) are accepted as-is. */
const GENERATED = /^(Merge |Revert "|fixup! |squash! |amend! )/;

export function validateCommitMessage(message: string): string | undefined {
  const header = message.split(/\r?\n/).find((line) => line.trim() !== '' && !line.startsWith('#')) ?? '';
  if (GENERATED.test(header)) return undefined;
  if (HEADER.test(header)) return undefined;
  return [
    `Invalid commit message header: "${header}"`,
    'Expected Conventional Commits: <type>(<optional scope>): <description> (max 100 chars after the type)',
    `Allowed types: ${COMMIT_TYPES.join(', ')}`,
  ].join('\n');
}
