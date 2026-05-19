---
title: Flujo del Proceso
sidebar_position: 2
---

# Flujo del Proceso GiroDirecto

## Diagrama general

```
MinSalud
(SFTP archivos) 
     │
     ▼
┌─────────────────┐
│  ALISTAMIENTO   │ ← EPS, Condiciones, Giro Límite, REPS, ERPF
└────────┬────────┘
         │ datos configurados
         ▼
┌─────────────────┐
│ PRE-LIQUIDACIÓN │ ← cálculo anticipado
└────────┬────────┘
         │ pre-liquidaciones
         ▼
┌─────────────────┐
│   VALIDACIÓN    │ ← verifica facturas, ítems, condiciones
└────────┬────────┘
         │ ventanas validadas
         ▼
┌─────────────────┐
│   POSTULACIÓN   │ ← IPS se postula dentro de ventana de giro
└────────┬────────┘
         │ postulaciones aprobadas
         ▼
┌─────────────────┐
│   LIQUIDACIÓN   │ ← certificado + firma digital + PDF
└────────┬────────┘
         │ orden de pago
         ▼
┌─────────────────┐
│   ERP/INTEGRA   │ ← transferencia bancaria a IPS
└────────┬────────┘
         │ notificación
         ▼
      SIIFA → EPS
```

## Descripción por etapa

### 1. Alistamiento
Carga de información desde MinSalud (REPS, BDUA) y configuración de datos maestros: EPS participantes, condiciones de giro, giros límite por prestador, terceros ERPF.

### 2. Pre-Liquidación
Cálculo anticipado del monto a girar. Asignación de prestadores a ventanas de giro límite.

### 3. Validación
Aplicación de reglas de negocio sobre las facturas: verificación de habilitación en REPS, aplicación de condición para la EPS, detección de duplicados.

### 4. Postulación
Registro y aprobación de postulaciones de giro dentro de ventanas de tiempo. La EPS avala las facturas y notifica el cierre.

### 5. Liquidación
Cálculo definitivo. Generación de certificado, firma digital, exportación PDF, ordenación contable en ERP, pago bancario a IPS, notificación a SIIFA y confirmación a EPS.

## Sistemas de soporte transversales

| Sistema | Rol |
|---------|-----|
| **AUTH** | Autenticación de todos los usuarios (prerequisito #1) |
| **REPS** | Catálogo de prestadores habilitados |
| **Reportes/Hangfire** | Generación asincrónica de reportes en todos los módulos |
| **OFAS** | Portal ciudadano independiente (no interfiere con el flujo principal) |
