// commit-msg hook: `node scripts/check-commit-msg.ts <path-to-message-file>` (run by lefthook).
import { readFileSync } from 'node:fs';
import { validateCommitMessage } from './lib/commit-message.ts';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/check-commit-msg.ts <commit message file>');
  process.exit(2);
}

const error = validateCommitMessage(readFileSync(file, 'utf8'));
if (error) {
  console.error(error);
  process.exit(1);
}
