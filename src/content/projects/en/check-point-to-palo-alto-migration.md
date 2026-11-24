---
title: Check Point to Palo Alto migration
summary: Migration of a public-sector institution's two-site firewall estate from Check Point to Palo Alto Networks NGFWs, from design to cutover.
date: 2021-11
technologies: [Palo Alto Networks, Check Point, IPsec VPN, GlobalProtect, Dynamic routing, AWS]
---

A public-sector institution with two sites joined by a layer 2 link replaced its Check Point
firewalls with Palo Alto Networks next-generation firewalls. As a consultant at Innova-net, I owned
the project from design to implementation:

- **Design**: high-level and low-level design of the new security architecture for both sites.
- **Policy**: migration of the security and NAT rule bases.
- **Routing**: dynamic routing on the new firewalls.
- **VPN**: site-to-site IPsec tunnels, including the ones to AWS, and SSL remote-access VPN for users.
- **Decryption**: TLS decryption policies, so threat prevention could inspect encrypted traffic.
