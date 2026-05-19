---
title: REPS
sidebar_position: 4
---

# 🏥 REPS — Registro Especial de Prestadores

**53 HUs** · Riesgo: **Crítico** (0% Done)

## ¿Qué hace?

Mantiene el catálogo oficial de IPS habilitadas para recibir giros. Sin REPS actualizado no es posible validar ni girar recursos a ningún prestador.

## Jerarquía de entidades

```
Prestador
  └── Sede
        └── Sede-Servicio
              └── Capacidad
```

Cada nivel tiene **3 capas**:
- `[Entidad]` — estado actual
- `[Audit]` — registro de auditoría
- `[Audit Histórico]` — historial completo

Y **2 implementaciones** por operación: **Backend + Frontend** = 2 HUs por función.

## Distribución de HUs

| Entidad | HUs |
|---------|-----|
| Prestador | 12 |
| Sede | 12 |
| Sede-Servicio | 12 |
| Capacidad | 17 |
| **Total** | **53** |

## Estado del módulo

:::danger Riesgo Crítico
REPS tiene **0 HUs completadas** (0%). Bloquea directamente el módulo de Alistamiento (ConfigEPS) y todo el módulo de Validación. Es el módulo de mayor complejidad estructural del sistema.
:::

## Fuente de datos

Los datos de REPS provienen de **MinSalud** mediante:
- Archivos planos por SFTP
- Réplica TCP directa (objetivo TOBE)
- Archivo BAK de base de datos (respaldo)
