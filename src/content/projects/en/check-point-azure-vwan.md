---
title: Check Point firewalls in Azure Virtual WAN
summary: Check Point gateways and management deployed in Azure, with the firewall embedded directly in the Azure Virtual WAN hub.
date: 2023-10
technologies: [Check Point, CloudGuard Network Security, Azure, Azure Virtual WAN]
---

Implementation of the Check Point security infrastructure in Azure:

- **Gateways in the Virtual WAN hub**: the Check Point firewall runs directly inside the Azure
  Virtual WAN hub, so the traffic routed through the hub is inspected there.
- **Management in Azure**: the Check Point management server deployed in Azure to administer
  policies and gateways centrally.
