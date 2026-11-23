# Security policy

## Scope

This repository builds and deploys the static site served at `https://andresmolina.dev`. Only the
current `main` branch (what is deployed to production) is supported; there are no versioned
releases.

In scope: the site's code, its build and deployment pipeline (GitHub Actions, Cloudflare
configuration) and its HTTP security headers.

Out of scope: third-party services (GitHub, Cloudflare), findings that require a compromised
browser or device, and reports from automated scanners without a demonstrated impact.

## Reporting a vulnerability

Please **do not open a public issue**. Report privately through either channel:

1. **GitHub private vulnerability reporting**:
   [Security → Report a vulnerability](https://github.com/Milodon247/andresmolina.dev/security/advisories/new).
2. **Email**: `security@andresmolina.dev` (also listed in
   [`/.well-known/security.txt`](https://andresmolina.dev/.well-known/security.txt)).

Include a description, the affected URL or file, steps to reproduce and the impact you observed.

## What to expect

- Acknowledgement within 5 business days.
- An initial assessment within 10 business days.
- A fix deployed through the normal pipeline (pull request, full test suite, preview, production)
  and credit in the advisory if you want it.

Reports in English or Spanish are welcome.
