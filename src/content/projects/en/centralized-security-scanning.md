---
title: Centralized security scanning for 800+ GitHub repositories
summary: Centralized SCA, SAST, DAST and IaC scanning across more than 800 GitHub repositories with OpenGrep, Trivy, Grype, Syft and OWASP ZAP, plus GitHub Advanced Security.
featured: true
technologies: [OpenGrep, Trivy, Grype, Syft, OWASP ZAP, GitHub Advanced Security]
---

Instead of configuring scanners repository by repository, scanning is defined once and applied
centrally to more than 800 GitHub repositories:

- **SAST**: static analysis of the source code with **OpenGrep**.
- **SCA**: open-source dependencies and their known vulnerabilities with **Trivy**, plus software
  bills of materials (SBOMs) generated with **Syft** and scanned with **Grype**.
- **IaC**: security misconfigurations in infrastructure-as-code definitions with **Trivy**.
- **DAST**: dynamic testing of running applications with **OWASP ZAP**.
- **Secret detection**: **GitHub Advanced Security** secret scanning.
