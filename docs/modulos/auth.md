---
title: AUTH
sidebar_position: 7
---

# 🔐 AUTH — Autenticación y Acceso

**18 HUs** (14 Auth + 4 Login ajuste flujo) · Riesgo: **Crítico**

| Estado | HUs |
|--------|-----|
| ✅ Done | 1 (6%) |
| 🆕 New | 17 |

## ¿Qué hace?

Gestiona la autenticación, autorización y control de acceso para **todos los usuarios** del sistema. Es el prerequisito número uno de absolutamente toda funcionalidad.

## Funcionalidades

- Inicio de sesión
- Gestión de usuarios externos (EPS, IPS)
- Roles y perfiles
- Aplicaciones registradas
- MFA / TOTP 2FA
- Cambio de contraseña
- API de seguridad

## Objetivo TOBE

En la arquitectura objetivo se migra a **Auth Azure**:
- Roles, grupos y perfiles de usuario
- Integración con directorio corporativo
- Portal de consulta y postulación para EPS
- Soporte para firma digital de documentos

:::danger Riesgo Crítico #1
AUTH es el **cuello de botella más crítico** del proyecto. Con solo 1 HU completada de 18, bloquea el acceso a los 8 módulos restantes del sistema. Sin AUTH funcional, ningún usuario puede acceder a ninguna funcionalidad.
:::
