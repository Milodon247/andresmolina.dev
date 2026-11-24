#!/usr/bin/env bash
# Waits until a deployed site answers 200 over HTTPS, e.g. while Cloudflare provisions the DNS record
# and certificate of a new custom domain. Used by the deploy and rollback workflows before smoke tests.
# Usage: scripts/wait-for-site.sh <url> [max-seconds]
set -euo pipefail

url="${1:?usage: $0 <url> [max-seconds]}"
max="${2:-600}"
interval=10

for ((waited = 0; waited <= max; waited += interval)); do
  status="$(curl --silent --output /dev/null --write-out '%{http_code}' --max-time 10 "${url}/" || true)"
  if [ "${status}" = "200" ]; then
    echo "${url} is up (after ${waited}s)"
    exit 0
  fi
  echo "${url} answered '${status}', retrying in ${interval}s"
  sleep "${interval}"
done

echo "::error::${url} did not answer 200 within ${max}s"
exit 1
