---
title: Integraciones
sidebar_position: 4
---

# Integraciones del Sistema

## Mapa de integraciones

```
                    ┌─────────────────┐
     MinSalud ─────►│                 │◄──── Auth Azure
     REPS ─────────►│  GiroDirecto   │◄──── BDUA
     SIIFA ─────────►│   ADRES       │◄──── MIPRES
     ORFEO ─────────►│                │◄──── Firma Digital
     ERP/INTEGRA ───►│                │
                    └────────┬────────┘
                             │
                          SMTP (notif.)
```

## Integraciones detalladas

### SIIFA — MinSalud
- **Tipo**: Notificación saliente
- **Protocolo**: HTTPS/REST
- **Propósito**: Notifica a MinSalud y EPS cuando se ejecuta un pago

### REPS — MinSalud
- **Tipo**: Sincronización entrante
- **Protocolo**: SFTP (archivos planos) / Réplica TCP directa (TOBE)
- **Propósito**: Catálogo actualizado de prestadores habilitados

### ERP / INTEGRA
- **Tipo**: Integración bidireccional
- **Propósito**: Envía la orden de pago; recibe confirmación de ejecución bancaria
- **Acciones**: Creación de terceros, ordenación contable, pago a IPS

### ORFEO (Azure)
- **Tipo**: Gestión documental
- **Propósito**: Cargue y descargue de documentos del proceso

### MIPRES
- **Tipo**: Consulta entrante
- **Propósito**: Verificación de prescripciones no cubiertas por el Plan de Beneficios

### BDUA
- **Tipo**: Consulta entrante
- **Propósito**: Verificación de afiliados al SGSSS

### Firma Digital
- **Tipo**: Servicio externo
- **Protocolo**: HTTPS/TCP
- **Propósito**: Firma digital de certificados de pago (nuevo en TOBE)

### SMTP
- **Tipo**: Notificaciones salientes (nuevo en TOBE)
- **Propósito**: Correos automáticos en apertura/seguimiento/cierre de postulación y pagos

### Auth Azure
- **Tipo**: Autenticación centralizada (nuevo en TOBE)
- **Propósito**: Roles, grupos y perfiles — reemplaza auth interna básica
