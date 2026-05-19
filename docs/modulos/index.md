---
sidebar_position: 1
title: Resumen de Módulos
---

# Módulos del Sistema GiroDirecto

| Módulo | HUs | Done | Riesgo |
|--------|-----|------|--------|
| ⚙️ [Alistamiento](./alistamiento) | 109 | 37 (34%) | Medio |
| ✅ [Validación](./validacion) | 56 | 11 (20%) | Alto |
| 🏥 [REPS](./reps) | 53 | 0 (0%) | **Crítico** |
| 📬 [Postulación](./postulacion) | 17 | 4 (24%) | Medio |
| 💰 [Liquidación](./liquidacion) | 10 | 10 (100%) | Bajo ✅ |
| 🔐 [AUTH](./auth) | 18 | 1 (6%) | **Crítico** |
| 📊 [Reportes](./reportes) | 19 | 0 (0%) | Alto |
| 📋 [Pre-Liquidación](./pre-liquidacion) | 7 | 4 (57%) | Bajo |
| 🏛️ [OFAS](./ofas) | 9 | 0 (0%) | Medio |

## Dependencias críticas

```
AUTH ──────────────────────────────► (bloquea TODO el sistema)
         │
         ▼
    Alistamiento ──► Condición ──► Pre-Liq ──► Validación
         │                                          │
         └──────── Giro Límite ──────────────► Postulación ──► Liquidación
         │
         └──────── REPS ──────────────────────► Validación
```

> ⚠️ **AUTH (HU_4726) es prerequisito de absolutamente todo el sistema.** Con solo 1 HU completada, esto representa el mayor riesgo del proyecto.
