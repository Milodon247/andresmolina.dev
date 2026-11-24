---
title: SIEM con Microsoft Sentinel
summary: Microsoft Sentinel como SIEM que consolida logs de identidad, red, WAF y nube, con alertas clasificadas por prioridad y escalado automático a PagerDuty en emergencias.
date: 2025-01
technologies: [Microsoft Sentinel, Microsoft Entra ID, Netskope, Cloudflare WAF, AWS Security Hub, PagerDuty]
---

Implementación de Microsoft Sentinel como SIEM central, para analizar y escalar desde un único punto
los eventos de seguridad de todas las capas:

- **Consolidación de logs**: logs de identidad de Microsoft Entra ID, de firewall de Netskope, de
  WAF de Cloudflare y hallazgos de nube de AWS Security Hub, todos ingeridos en Sentinel.
- **Clasificación de alertas**: las alertas se clasifican por prioridad, para que las críticas
  destaquen sobre el ruido.
- **Integración con PagerDuty**: los incidentes de alta prioridad activan PagerDuty de forma
  automática, poniendo en marcha la respuesta a emergencias sin pasos manuales.
