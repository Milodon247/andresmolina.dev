---
title: Microsoft Sentinel SIEM
summary: Microsoft Sentinel as the SIEM consolidating identity, network, WAF and cloud security logs, with priority-based alerts and automatic PagerDuty escalation for emergencies.
date: 2025-01
technologies: [Microsoft Sentinel, Microsoft Entra ID, Netskope, Cloudflare WAF, AWS Security Hub, PagerDuty]
---

Implementation of Microsoft Sentinel as the central SIEM, so security events from every layer are
analyzed and escalated in one place:

- **Log consolidation**: identity logs from Microsoft Entra ID, firewall logs from Netskope, WAF logs
  from Cloudflare and cloud findings from AWS Security Hub, all ingested into Sentinel.
- **Alert classification**: alerts are classified by priority, so the critical ones stand out from
  the noise.
- **PagerDuty integration**: high-priority incidents automatically trigger PagerDuty, activating the
  emergency response without manual steps.
