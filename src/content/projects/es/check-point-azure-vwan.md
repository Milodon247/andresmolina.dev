---
title: Firewalls Check Point en Azure Virtual WAN
summary: Gateways y gestión de Check Point desplegados en Azure, con el firewall integrado directamente en el hub de Azure Virtual WAN.
date: 2023-10
technologies: [Check Point, CloudGuard Network Security, Azure, Azure Virtual WAN]
---

Implementación de la infraestructura de seguridad de Check Point en Azure:

- **Gateways en el hub de Virtual WAN**: el firewall de Check Point se ejecuta directamente dentro
  del hub de Azure Virtual WAN, de modo que el tráfico que pasa por el hub se inspecciona allí mismo.
- **Gestión en Azure**: el servidor de gestión de Check Point desplegado en Azure para administrar
  las políticas y los gateways de forma centralizada.
