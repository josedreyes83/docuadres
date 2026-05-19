---
title: Arquitectura TOBE
sidebar_position: 6
---

# Arquitectura TO-BE — Estado Objetivo

## Comparación AS-IS vs TO-BE

| Área | AS-IS (actual) | TO-BE (objetivo) |
|------|---------------|-----------------|
| **Frontend** | Blazor / DNN | Angular + TypeScript |
| **Autenticación** | Básica interna | Auth Azure (Roles + Grupos + Perfiles) |
| **Notificaciones** | Sin soporte | SMTP automático |
| **Firma documentos** | Manual | Servicio Firma Digital HTTPS/TCP |
| **Portal EPS** | Sin interfaz | Portal consulta + postulación EPS |
| **Tableros** | Sin control | Power BI semáforo vencimientos |
| **Certificados** | Sin exportación | PDF desde JSON firmado |
| **Arquitectura** | Monolítica (IIS) | Microservicios + Contenedores (2026+) |
| **Fuente datos** | Archivos planos SFTP | Réplica TCP directa o BAK |

## Roadmap de implementación

| Año | Actividades |
|-----|-------------|
| **2025** | Estandarización documental · Solución tecnológica AS-IS · Comunicación ADRES-EPS/IPS |
| **2026** | Escalamiento tecnológico · Integración ORFEO, FEV-RIPS, entidades financieras · Indicadores |
| **2027** | Automatización avanzada con BI · Operación madura con trazabilidad punta a punta |

## Flujo TOBE — Fase de Pagos

```
Postulación cerrada
       │
       ▼
Notificación SMTP automática a funcionales
       │
       ▼
Genera certificado desde JSON
       │
       ▼
Servicio Firma Digital (HTTPS/TCP)
       │
       ▼
Certificado firmado ──► PDF pre-ordenación
       │
       ▼
Creación terceros en ERP ──► Ordenación contable
       │
       ▼
ERP ejecuta pago bancario a IPS
       │
       ├──► ERP notifica ADRES (OK)
       └──► SIIFA notifica EPS (confirmación)
```
