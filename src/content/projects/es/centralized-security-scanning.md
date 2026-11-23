---
title: Escaneo de seguridad centralizado para más de 800 repositorios de GitHub
summary: Escaneo centralizado SCA, SAST, DAST e IaC en más de 800 repositorios de GitHub con OpenGrep, Trivy, Grype, Syft y OWASP ZAP, junto con GitHub Advanced Security.
featured: true
technologies: [OpenGrep, Trivy, Grype, Syft, OWASP ZAP, GitHub Advanced Security]
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
