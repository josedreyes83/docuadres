---
title: Infraestructura
sidebar_position: 5
---

# Infraestructura — GiroDirecto TOBE

## Tres zonas de despliegue

### ☁️ Azure Cloud
| Componente | Descripción |
|-----------|-------------|
| Auth Azure | Autenticación moderna (Roles + Grupos + Perfiles) |
| Azure Blob Storage | Almacenamiento de reportes CSV/Excel |
| ORFEO | Gestor documental institucional |
| Azure Graph API | Envío de emails de notificación |

### 🏢 OnPremise ADRES
| Componente | Descripción |
|-----------|-------------|
| SFTP Externo | Recepción de archivos desde MinSalud |
| ERP Frontend | Interfaz del sistema contable |
| Servidor Firma Digital | Firma de certificados HTTPS/TCP |
| Servidor SMTP | Envío de notificaciones por correo |

### 🏗️ Centro de Datos Internexa
| Componente | Descripción |
|-----------|-------------|
| IIS Server | Servidor web — Angular + .NET Core 6 |
| SQL Server 2019 | Base de datos principal GiroDirecto |
| BD GiroDirecto | Base de datos del sistema |
| BDUA, REPS | Bases de datos externas consultadas |
| ERP BD | Base de datos del sistema contable |

## Conectividad

| Conexión | Protocolo |
|----------|-----------|
| MinSalud → SFTP | SFTP (archivos planos) |
| Auth Azure → IIS | HTTPS |
| IIS → SQL Server | TCP (red interna Internexa) |
| IIS → SMTP | SMTP |
| IIS → Firma Digital | HTTPS/TCP |
| IIS → ERP | API REST interna |
| IIS → ORFEO | HTTPS (Azure) |
