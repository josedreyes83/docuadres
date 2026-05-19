---
title: Reportes
sidebar_position: 8
---

# 📊 Reportes / Background Jobs

**19 HUs** · Riesgo: Alto (0% Done)

## ¿Qué hace?

Infraestructura compartida de generación asincrónica de reportes. Usa Hangfire como motor de jobs en background para exportar datos en CSV/Excel, subirlos a Azure Blob Storage y enviarlos por email vía Azure Graph API.

## HUs de infraestructura base

| HU | Descripción |
|----|-------------|
| HU_7409 | Hangfire — motor de background jobs |
| HU_7410 | Generación de CSV dinámico |
| HU_7411 | Azure Blob Storage — almacenamiento |
| HU_7412 | Azure Graph API — envío por email |

:::warning Prerequisito crítico
**Sin las HUs 7409-7412, ningún reporte de ningún módulo funciona.** Esta infraestructura base es compartida por Alistamiento, Validación y Postulación.
:::

## Réplica en módulos

| Módulo | HUs de reporte |
|--------|---------------|
| Alistamiento | ~18 HUs |
| Validación | 7 HUs (HU_8338–8341) |
| Postulación | 7 HUs (HU_8345–8348) |
