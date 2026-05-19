---
title: Validación
sidebar_position: 3
---

# ✅ Validación

**56 HUs** · Epic #5375 · Riesgo: **Alto**

| Estado | HUs |
|--------|-----|
| ✅ Done | 11 (20%) |
| 🔄 Committed | 12 |
| 🆕 New | 18 (mayor pendiente) |
| ~~Removed~~ | 1 |

## ¿Qué hace?

Verifica que las facturas de los prestadores cumplan todos los criterios de elegibilidad para recibir el giro. Aplica tres tipos de validación:

- **Entrada**: formato correcto y datos completos
- **Consistencia**: coherencia entre datos (IPS en REPS, condición aplica para EPS)
- **Calidad**: sin duplicados, sin facturas ya pagadas

## Sub-módulos

| Sub-módulo | HUs | Descripción |
|------------|-----|-------------|
| Proceso (Ventana) | 8 | Gestión de ventanas de validación |
| Ítem | 11 | Validación a nivel de ítem de factura |
| Ítem Línea Proceso | 10 | Validación por línea de proceso |
| Factura Resultado Agregado | 4 | Resultado consolidado por factura |
| General (PM) | 13 | Validaciones generales de nivel PM |
| Inclusión Validaciones | 3 | Inclusión de casos especiales |
| Reportes | 7 | Exportación de resultados de validación |

## Dependencias

Este módulo depende de **todos los datos maestros de Alistamiento**:

- EPS configuradas
- REPS actualizado (prestadores habilitados)
- ERPF (facturas de referencia)
- Condiciones de Giro activas
- Pre-liquidaciones creadas

:::note
La fase de Validación **no cambia en la arquitectura TOBE** — se mantiene igual al AS-IS.
:::
