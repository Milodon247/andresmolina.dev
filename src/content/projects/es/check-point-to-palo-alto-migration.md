---
title: Migración de Check Point a Palo Alto
summary: Migración completa de los firewalls de una institución pública con dos sedes de Check Point a NGFW de Palo Alto Networks, desde el diseño hasta la puesta en producción.
date: 2021-11
technologies: [Palo Alto Networks, Check Point, IPsec VPN, GlobalProtect, Dynamic routing, AWS]
---

Una institución pública con dos sedes unidas por un enlace de capa 2 sustituyó sus firewalls Check
Point por firewalls de nueva generación de Palo Alto Networks. Como consultor de Innova-net, llevé el
proyecto desde el diseño hasta la implementación:

- **Diseño**: diseño de alto y bajo nivel de la nueva arquitectura de seguridad de ambas sedes.
- **Políticas**: migración de las reglas de seguridad y de NAT.
- **Enrutamiento**: enrutamiento dinámico en los nuevos firewalls.
- **VPN**: túneles IPsec sitio a sitio, incluidos los de AWS, y VPN SSL de acceso remoto para los
  usuarios.
- **Descifrado**: políticas de descifrado TLS para que la prevención de amenazas pudiera
  inspeccionar el tráfico cifrado.
