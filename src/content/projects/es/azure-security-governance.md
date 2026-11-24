---
title: Gobierno de seguridad en Azure
summary: Controles seguros por defecto para más de 60 suscripciones de Azure con Azure Policy a nivel de management groups, junto con Defender for Cloud CSPM.
date: 2025-03
technologies: [Azure, Azure Policy, Microsoft Defender for Cloud, CSPM, MCSB]
---

Implementado siguiendo el **Microsoft cloud security benchmark** (MCSB, antes Azure Security
Benchmark) en más de 60 suscripciones: sus controles se aplican con Azure Policy a nivel de
management groups y el cumplimiento se mide con Defender for Cloud CSPM. Principales áreas de
control:

- **Seguridad de red**: sin exposición a internet por defecto.
- **Gestión de identidades y acceso privilegiado**: identidad centralizada y mínimo privilegio.
- **Protección de datos**: cifrado y regiones permitidas para la residencia de los datos.
- **Gestión de activos**: inventario y servicios y ubicaciones aprobados.
- **Registro y detección de amenazas**: logs centralizados y alertas de seguridad.
- **Gestión de postura y vulnerabilidades**: evaluación continua y corrección de configuraciones
  inseguras.
- **Gobierno y estrategia**: controles definidos una sola vez y heredados por todas las
  suscripciones.
