---
title: Stack Tecnológico
sidebar_position: 3
---

# Stack Tecnológico — GiroDirecto TOBE

| Capa | Tecnología | Detalle |
|------|-----------|---------|
| **Frontend** | Angular + Node.js | TypeScript, MVC — reemplaza Blazor/DNN |
| **Backend** | C# / .NET Core 6 | Arquitectura Limpia, Entity Framework |
| **Base de Datos** | SQL Server 2019 | On-premise en Internexa |
| **BI / Tableros** | Power BI | Publicado en servidor ADRES, enlazado desde la app |
| **Notificaciones** | SMTP | Correo durante postulación y pagos |
| **Firma Digital** | Servicio externo | HTTPS/TCP — firma de certificados de pago |
| **Gestión Documental** | ORFEO (Azure) | Cargue, almacenamiento y descargue de documentos |
| **Autenticación** | Auth Azure | Roles, grupos y perfiles de usuario |
| **Background Jobs** | Hangfire | Generación asincrónica de reportes |
| **Almacenamiento** | Azure Blob Storage | Archivos CSV/Excel de reportes |
| **Mensajería** | Azure Graph API | Envío de reportes por email |
| **Testing** | Postman | Pruebas de APIs |

## Arquitectura objetivo 2026+

```
                    ┌──────────────────────────────┐
                    │   Nuevo Ecosistema ADRES 2026 │
                    │  PUR · TRÁMITES · SIA · GD ⭐ │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
       Microservicios         Contenedores          APIs REST
       (escalabilidad)        (flexibilidad)        (seguridad)
```

GiroDirecto evoluciona hacia una arquitectura de **microservicios** dentro del ecosistema tecnológico unificado de ADRES.
