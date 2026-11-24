---
title: Centralized AWS security services
summary: Design and implementation of AWS Organizations and OUs, with security services delegated to a dedicated security account for centralized management.
date: 2025-06
technologies: [AWS, AWS Organizations, AWS Security Hub, AWS Config, IAM Access Analyzer, Amazon GuardDuty]
---

Design and implementation of the AWS security foundation, so every account is covered by the same
security services and managed from one place:

- **AWS Organizations and OUs**: account structure organized in organizational units, so security
  baselines apply by OU instead of account by account.
- **Delegated administration**: the security services are delegated to a dedicated security
  account, which manages them for the whole organization.
- **AWS Security Hub**: findings from every account aggregated in the security account.
- **AWS Config**: configuration and compliance of resources recorded across accounts and
  aggregated centrally.
- **IAM Access Analyzer**: organization-wide analysis of resources shared outside the organization.
- **Amazon GuardDuty**: threat detection enabled across the organization and managed centrally.
