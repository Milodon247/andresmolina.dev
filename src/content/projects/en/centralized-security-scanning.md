---
title: Centralized security scanning for 800+ GitHub repositories
summary: Implementation of centralized SCA, SAST, DAST and IaC scanning across more than 800 GitHub repositories.
featured: true
technologies: [GitHub, SCA, SAST, DAST, IaC scanning]
---

Instead of configuring scanners repository by repository, scanning is defined once and applied
centrally to more than 800 GitHub repositories, covering four types of analysis:

- **SCA**: open-source dependencies and their known vulnerabilities.
- **SAST**: static analysis of the source code.
- **DAST**: dynamic testing of running applications.
- **IaC**: security misconfigurations in infrastructure-as-code definitions.
