---
title: Centralized security scanning for 800+ GitHub repositories
summary: Centralized SCA, SAST, DAST and IaC scanning across more than 800 GitHub repositories, with every finding consolidated in DefectDojo as the ASPM platform.
featured: true
technologies: [DefectDojo, OpenGrep, Trivy, Grype, Syft, OWASP ZAP, GitHub Advanced Security]
---

Instead of configuring scanners repository by repository, scanning is defined once and applied
centrally to more than 800 GitHub repositories:

- **SAST**: static analysis of the source code with **OpenGrep**.
- **SCA**: open-source dependencies and their known vulnerabilities with **Trivy**, plus software
  bills of materials (SBOMs) generated with **Syft** and scanned with **Grype**.
- **IaC**: security misconfigurations in infrastructure-as-code definitions with **Trivy**.
- **DAST**: dynamic testing of running applications with **OWASP ZAP**.
- **Secret detection**: **GitHub Advanced Security** secret scanning.

All scanner results are consolidated in **DefectDojo**, used as the ASPM (application security
posture management) platform: a single place to review, deduplicate, prioritize and track findings
across every repository.
