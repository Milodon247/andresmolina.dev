---
title: Servicios de seguridad centralizados en AWS
summary: Diseño e implementación de AWS Organizations y OU, con los servicios de seguridad delegados en una cuenta de seguridad dedicada para su gestión centralizada.
date: 2025-06
technologies: [AWS, AWS Organizations, AWS Security Hub, AWS Config, IAM Access Analyzer, Amazon GuardDuty]
---

Diseño e implementación de la base de seguridad de AWS, para que todas las cuentas estén cubiertas
por los mismos servicios de seguridad y se gestionen desde un único punto:

- **AWS Organizations y OU**: estructura de cuentas organizada en unidades organizativas, de modo
  que las líneas base de seguridad se aplican por OU y no cuenta por cuenta.
- **Administración delegada**: los servicios de seguridad se delegan en una cuenta de seguridad
  dedicada, que los gestiona para toda la organización.
- **AWS Security Hub**: hallazgos de todas las cuentas agregados en la cuenta de seguridad.
- **AWS Config**: registro de la configuración y el cumplimiento de los recursos en todas las
  cuentas, con agregación centralizada.
- **IAM Access Analyzer**: análisis a nivel de organización de los recursos compartidos fuera de
  ella.
- **Amazon GuardDuty**: detección de amenazas activada en toda la organización y gestionada de
  forma centralizada.
