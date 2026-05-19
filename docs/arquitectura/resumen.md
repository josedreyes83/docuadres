---
title: Resumen Ejecutivo
sidebar_position: 1
---

# Resumen Ejecutivo — GiroDirecto ADRES

## ¿Qué es ADRES?

La **Administradora de los Recursos del Sistema General de Seguridad Social en Salud** (ADRES) es la entidad del Estado colombiano responsable de administrar y girar los recursos del SGSSS, garantizando el pago oportuno a los prestadores de salud.

## Propósito del sistema

GiroDirecto implementa el mecanismo legal por el cual ADRES paga **directamente** a los prestadores (IPS) cuando las EPS acumulan deudas superiores a los límites establecidos, descontando el valor girado al saldo de la EPS.

## Modelo arquitectónico 4+1 (Kruchten)

| Vista | Descripción |
|-------|-------------|
| **Lógica** | Módulos: Alistamiento, Validación, Postulación, Liquidación |
| **Física** | Azure Cloud + OnPremise ADRES + Centro Datos Internexa |
| **Procesos** | Flujo: MinSalud → Alistamiento → Validación → Liquidación → ERP |
| **Interoperabilidad** | SIIFA, REPS, ERP/INTEGRA, ORFEO, MIPRES, BDUA |

## Alcance del proyecto 2026

- 255 Historias de Usuario en 9 módulos
- Stack: Angular + .NET Core 6 + SQL Server 2019
- Infraestructura: Azure Cloud + Internexa
- Integración: 9 sistemas externos
- Equipos: backend y frontend independientes (separación Back/Front desde HU ~4700)

## Contactos

| Rol | Nombre | Email |
|-----|--------|-------|
| Líder Técnico | Carlos Fernando Jaramillo | carlos.jaramillo@adres.gov.co |
| PM Proyecto | Sandra Rodríguez | sandra.rodriguez@adres.gov.co |
