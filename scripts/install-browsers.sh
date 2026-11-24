#!/usr/bin/env bash
# Installs the Playwright browsers and their system packages on CI runners, with bounded retries.
# An Ubuntu mirror once stalled mid-download and hung the job for 30 minutes; apt now drops stalled
# connections and each attempt has a hard time limit.
set -euo pipefail

attempts=3
limit_seconds=300

# apt: give up on a stalled connection after 30 s and retry each download up to 5 times.
printf 'Acquire::Retries "5";\nAcquire::http::Timeout "30";\nAcquire::https::Timeout "30";\n' |
  sudo tee /etc/apt/apt.conf.d/80-ci-retries >/dev/null

for ((attempt = 1; attempt <= attempts; attempt++)); do
  if timeout "${limit_seconds}" npx playwright install --with-deps chromium webkit; then
    exit 0
  fi
  echo "::warning::Browser install failed or timed out (attempt ${attempt}/${attempts})"
  sleep 15
done

echo "::error::Could not install the Playwright browsers after ${attempts} attempts"
exit 1
