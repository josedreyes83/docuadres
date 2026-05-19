---
sidebar_position: 1
title: ¿Qué es GiroDirecto?
---

# GiroDirecto — Sistema de Pago Directo a IPS

**GiroDirecto** es el módulo de **ADRES** (Administradora de los Recursos del SGSSS) que gestiona el proceso de pago directo a los Prestadores de Salud (IPS) cuando las EPS acumulan deudas superiores a los **Giros Límite** establecidos por ley.

## Base legal

| Norma | Descripción |
|-------|-------------|
| [**Ley 1122 de 2007**](/docs/Normativa/ley-1122-2007) | Primer mandato de giro directo; Art. 13d define plazos obligatorios de pago de EPS a IPS |
| **Decreto 780 de 2016** | Marco reglamentario general del SGSSS |
| [**Decreto 489 de 2024**](/docs/Normativa/decreto-489-2024) | Define el 80% mínimo de UPC y los tres casos en que ADRES activa el giro directo |

→ Ver explicación completa: [**⚖️ Marco Normativo**](/docs/Normativa)

## ¿Por qué existe?

Cuando una EPS tiene problemas financieros y no puede pagar a los hospitales y clínicas que le prestaron servicios médicos a sus afiliados, **ADRES interviene** pagando directamente al prestador y descontando ese valor a la EPS.

Esto garantiza que los hospitales no quiebren por falta de pago, asegurando la **continuidad de la atención en salud**.

## Flujo resumido

```
MinSalud (SFTP) ──► Alistamiento ──► Pre-Liquidación ──► Validación
                                                              │
                         ERP / Pago a IPS ◄── Liquidación ◄── Postulación
```

## El sistema en números

| Indicador | Valor |
|-----------|-------|
| Historias de Usuario | 255 |
| Módulos del sistema | 9 |
| HUs completadas (Done) | 80 |
| Módulo al 100% | Liquidación ✅ |
| Stack tecnológico | Angular + .NET Core 6 + SQL Server |

## Navegación rápida

- 📋 [Módulos del sistema](/docs/modulos/index) — todos los módulos con sus HUs y estado
- 🔄 [Flujo del proceso](/docs/arquitectura/flujo) — diagrama completo de las 5 etapas
- 🛠️ [Stack tecnológico](/docs/arquitectura/stack) — Angular, .NET Core 6, Azure
- 🔗 [Integraciones](/docs/arquitectura/integraciones) — SIIFA, REPS, ERP, ORFEO, MIPRES
- ⚖️ [Marco Normativo](/docs/Normativa) — Ley 1122/2007 y Decreto 489/2024
