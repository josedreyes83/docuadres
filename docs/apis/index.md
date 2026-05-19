---
id: apis-index
title: Catálogo de APIs GiroDirecto
sidebar_label: Resumen de APIs
---

# Catálogo de APIs — GiroDirecto ADRES

El sistema GiroDirecto expone **5 microservicios REST independientes**, cada uno responsable de un dominio funcional del flujo de pago directo. Todos comparten el mismo stack tecnológico y patrones de diseño.

## Arquitectura general

```
Angular Frontend
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                     API Gateway / Auth (JWT Azure AD)    │
└──────┬───────────┬───────────┬───────────┬───────────────┘
       │           │           │           │           │
   API             API         API         API         API
ALISTAMIENTO   VALIDACIÓN  POSTULACIÓN LIQUIDACIÓN  PAGOS
  :7001           :7002       :7003       :7004      :7005
```

## Microservicios

| API | Responsabilidad | Controllers | Tecnología |
|-----|----------------|-------------|------------|
| [Alistamiento](./api-alistamiento) | Datos maestros: EPS, Condiciones, GiroLímite, REPS | 28 | .NET 8 / EF Core |
| [Validación](./api-validacion) | Verificación de facturas e ítems | 6 | .NET 8 / EF Core |
| [Postulación](./api-postulacion) | Registro de giros por ventana de tiempo | 17 | .NET 8 / EF Core |
| [Liquidación](./api-liquidacion) | Cálculo definitivo y orden de pago | 13 | .NET 8 / EF Core |
| [Pagos](./api-pagos) | Integración con ERP Tesorería | 2 | .NET 8 / EF Core |

## Stack tecnológico común

```
• .NET 8.0              — Web framework
• Entity Framework Core 8.0.4 — ORM + SQL Server Azure
• MediatR 12.2.0        — Patrón CQRS (Commands/Queries)
• FluentValidation 11.9.1 — Validación de entrada
• AutoMapper 12.0.1     — Mapeo de DTOs
• Swashbuckle 6.5.0     — OpenAPI / Swagger UI
• Hangfire 1.8.21       — Jobs en background
• Azure Blob Storage    — Archivos y plantillas
• MS Graph SDK 5.94.0   — Notificaciones por email
```

## Autenticación

Todos los endpoints (excepto `/api/Login/login`) requieren **JWT Bearer Token** emitido por **Azure Active Directory**.

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles disponibles

| Rol | Acceso |
|-----|--------|
| `SeniorCOM` | CRUD completo — régimen contributivo |
| `JuniorsCOM` | Lectura + creación — régimen contributivo |
| `SeniorLMA` | CRUD completo — régimen subsidiado |
| `Consumidor` | Solo lectura |

## Patrón de respuesta paginada

Todos los endpoints `GET /lista` devuelven:

```json
{
  "totalRegistros": 245,
  "numeroPagina": 1,
  "registrosPorPagina": 20,
  "totalPaginas": 13,
  "items": [ ... ]
}
```

### Parámetros de paginación comunes

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `numeroPagina` | int | 1 | Página solicitada |
| `registrosPorPagina` | int | 20 | Resultados por página |
| `sortColumn` | string | — | Columna de ordenamiento |
| `sortOrder` | string | `asc` | `asc` o `desc` |

## Base de datos

| Base de datos | Uso |
|---------------|-----|
| `ADRES_GiroDirecto` | Base principal — todas las APIs |
| `ADRES_Seguridad` | Usuarios y roles (solo lectura) |
| Servidor | `dbsrvgirodirectodev.database.windows.net` |

## Ambiente de desarrollo

Cada API tiene configuraciones por ambiente:

| Archivo | Ambiente |
|---------|----------|
| `appsettings.json` | Producción |
| `appsettings.Development.json` | Desarrollo |
| `appsettings.Local.json` | Local |

## Despliegue

```
Docker → Kubernetes (AKS Azure)
deployment-gm-api-{nombre}-{dev|test|prod}.yaml
```

## Swagger UI

Cada API expone su documentación interactiva en:

```
https://{host}/{api}/swagger
```
