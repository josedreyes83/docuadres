---
title: Alistamiento
sidebar_position: 2
---

# ⚙️ Alistamiento

**109 HUs** · Epic #5339 · Riesgo: Medio

| Estado | HUs |
|--------|-----|
| ✅ Done | 37 (34%) |
| 🔄 Committed | 25 |
| 🆕 New | 38 |
| ⚡ Approved | 9 |

## ¿Qué hace?

Configura todos los **datos maestros** que el sistema necesita para operar: qué EPS aplica para Giro Directo, bajo qué condiciones, cuáles son los topes de giro, y qué prestadores están habilitados.

## Sub-módulos

| Sub-módulo | HUs | Descripción |
|------------|-----|-------------|
| EPS | 8 | Configuración de EPS participantes |
| Condición | 9 | Reglas que activan el GD por EPS |
| Condición EPS | 5 | Cruce condición-EPS |
| Giro Límite | 14 | Topes máximos de giro por prestador |
| ERPF | 4 | Estructura de recaudo y pago de facturas |
| Pagos Tesorería ERP | 4 | Referencia de pagos ERP |
| REPS — Prestador | 12 | Gestión de prestadores en REPS |
| REPS — Sede | 12 | Gestión de sedes |
| REPS — Sede Servicio | 12 | Gestión de servicios por sede |
| REPS — Capacidad | 17 | Capacidad instalada |
| Proceso Interno | 5 | Configuración de procesos internos |

## Patrón de operaciones

Cada sub-módulo implementa el ciclo completo:
`Listar → Filtrar → Crear → Detalle → Editar → Eliminar`

Los sub-módulos de REPS adicionalmente incluyen:
`[Entidad] → [Audit] → [Audit Histórico]`

## Fuente de datos

Los datos maestros de REPS llegan desde **MinSalud** vía SFTP (archivos planos) o réplica TCP directa.
