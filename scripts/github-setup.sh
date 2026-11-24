#!/usr/bin/env bash
# One-time (idempotent) GitHub repository hardening with the GitHub CLI.
# Usage: scripts/github-setup.sh <owner>/<repo>
#   e.g. scripts/github-setup.sh octocat/andresmolina.dev
# Requires `gh auth login` with admin rights on the repository. It never handles secret values:
# set CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID yourself with `gh secret set` (see README).
# The production URL lives in .github/workflows/deploy.yml, next to the domain in wrangler.jsonc.
set -euo pipefail

repo="${1:?usage: $0 <owner>/<repo>}"

echo "== Security features: secret scanning, push protection, Dependabot alerts and security updates"
gh api -X PATCH "repos/${repo}" --silent \
  -f 'security_and_analysis[secret_scanning][status]=enabled' \
  -f 'security_and_analysis[secret_scanning_push_protection][status]=enabled'
gh api -X PUT "repos/${repo}/vulnerability-alerts" --silent
gh api -X PUT "repos/${repo}/automated-security-fixes" --silent
# Lets researchers report vulnerabilities privately (referenced by SECURITY.md and security.txt).
gh api -X PUT "repos/${repo}/private-vulnerability-reporting" --silent

echo "== Merge settings: squash only, linear history, delete merged branches"
gh api -X PATCH "repos/${repo}" --silent \
  -F allow_merge_commit=false -F allow_squash_merge=true -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true -F allow_auto_merge=false

echo "== Environments"
# production: only the main branch may deploy.
gh api -X PUT "repos/${repo}/environments/production" --silent --input - <<'JSON'
{ "deployment_branch_policy": { "protected_branches": false, "custom_branch_policies": true } }
JSON
gh api "repos/${repo}/environments/production/deployment-branch-policies" \
  --jq '.branch_policies[].name' | grep -qx main ||
  gh api -X POST "repos/${repo}/environments/production/deployment-branch-policies" --silent \
    -f name=main -f type=branch
# preview: used by pull requests from branches of this repository.
gh api -X PUT "repos/${repo}/environments/preview" --silent --input - <<'JSON'
{ "deployment_branch_policy": null }
JSON

echo "== Ruleset for main: PR required, required checks, no force push, no deletion, linear history"
ruleset='{
  "name": "main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true,
        "allowed_merge_methods": ["squash"] } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "Checks / test:all" },
          { "context": "Checks / npm audit" },
          { "context": "Checks / gitleaks" },
          { "context": "Checks / zizmor" },
          { "context": "Dependency review" },
          { "context": "Smoke tests (preview)" },
          { "context": "Analyze (javascript-typescript)" },
          { "context": "Analyze (actions)" }
        ] } }
  ]
}'
existing="$(gh api "repos/${repo}/rulesets" --jq '.[] | select(.name == "main") | .id')"
if [ -n "${existing}" ]; then
  gh api -X PUT "repos/${repo}/rulesets/${existing}" --silent --input - <<<"${ruleset}"
else
  gh api -X POST "repos/${repo}/rulesets" --silent --input - <<<"${ruleset}"
fi

echo "Done. Now set the Cloudflare secrets (values are prompted, never echoed):"
echo "  gh secret set CLOUDFLARE_API_TOKEN  --repo ${repo} --env production"
echo "  gh secret set CLOUDFLARE_ACCOUNT_ID --repo ${repo} --env production"
echo "  gh secret set CLOUDFLARE_API_TOKEN  --repo ${repo} --env preview"
echo "  gh secret set CLOUDFLARE_ACCOUNT_ID --repo ${repo} --env preview"
