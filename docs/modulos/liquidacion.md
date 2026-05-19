---
title: Liquidación
sidebar_position: 6
---

# 💰 Liquidación

**10 HUs** · Epic #5377 · Riesgo: Bajo ✅

| Estado | HUs |
|--------|-----|
| ✅ Done | 5 |
| 🔄 Committed | 5 |
| **Avance total** | **100%** 🎯 |

## ¿Qué hace?

Calcula el monto definitivo a girar a cada prestador. Toma las facturas validadas, aplica los giros límite, genera el certificado de pago y lo envía a la Tesorería (ERP) para la transferencia bancaria real.

## Sub-módulos

| Sub-módulo | HUs | Descripción |
|------------|-----|-------------|
| Principal | 5 | Liquidación base del giro |
| Ventana Giro Límite | 5 | Liquidación vinculada a topes |

## Nota importante

:::warning Módulo completo pero bloqueado
Liquidación es el **único módulo al 100%** del sistema. Sin embargo, **no puede operar** en producción porque depende de los módulos anteriores (Validación, Postulación) que aún están incompletos.
:::

## Flujo TOBE — Fase de Pagos

En la arquitectura TOBE, este módulo se enriquece con:
1. Generación de certificado desde JSON
2. Firma digital del certificado (servicio externo HTTPS/TCP)
3. Exportación PDF de la pre-ordenación
4. Creación de nuevos terceros en ERP
5. Ordenación contable y transferencia bancaria
6. Notificación a SIIFA y confirmación a EPS
