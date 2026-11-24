---
title: Azure security governance
summary: Secure-by-default guardrails for more than 60 Azure subscriptions with Azure Policy at management group level, plus Defender for Cloud CSPM.
date: 2025-03
technologies: [Azure, Azure Policy, Microsoft Defender for Cloud, CSPM, MCSB]
---

Implemented following the **Microsoft cloud security benchmark** (MCSB, formerly Azure Security
Benchmark) across more than 60 subscriptions: its controls are enforced with Azure Policy at
management group level and compliance is measured with Defender for Cloud CSPM. Main control areas:

- **Network security**: no internet exposure by default.
- **Identity management and privileged access**: centralized identity and least privilege.
- **Data protection**: encryption and allowed regions for data residency.
- **Asset management**: inventory and approved services and locations.
- **Logging and threat detection**: centralized logs and security alerts.
- **Posture and vulnerability management**: continuous assessment and remediation of
  misconfigurations.
- **Governance and strategy**: guardrails defined once and inherited by every subscription.
