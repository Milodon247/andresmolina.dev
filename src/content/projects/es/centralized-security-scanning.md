---
title: Seguridad en el SDLC
summary: SAST, SCA, DAST, IaC y detección de secretos integrados en el ciclo de vida de desarrollo de más de 800 repositorios de GitHub, con todos los hallazgos consolidados en DefectDojo como plataforma ASPM.
featured: true
technologies: [DefectDojo, OpenGrep, Trivy, Grype, Syft, OWASP ZAP, GitHub Advanced Security]
---

En lugar de configurar los escáneres repositorio por repositorio, el escaneo se define una sola vez
y se aplica de forma centralizada a más de 800 repositorios de GitHub:

- **SAST**: análisis estático del código fuente con **OpenGrep**.
- **SCA**: dependencias de código abierto y sus vulnerabilidades conocidas con **Trivy**, además de
  listas de materiales de software (SBOM) generadas con **Syft** y analizadas con **Grype**.
- **IaC**: configuraciones inseguras en las definiciones de infraestructura como código con
  **Trivy**.
- **DAST**: pruebas dinámicas de las aplicaciones en ejecución con **OWASP ZAP**.
- **Detección de secretos**: secret scanning de **GitHub Advanced Security**.

Todos los resultados de los escáneres se consolidan en **DefectDojo**, usado como plataforma ASPM
(gestión de la postura de seguridad de aplicaciones): un único lugar para revisar, deduplicar,
priorizar y dar seguimiento a los hallazgos de todos los repositorios.
