---
id: api-pagos
title: API Pagos / Integración ERP
sidebar_label: Pagos (ERP)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# API Pagos — Integración ERP

Conecta GiroDirecto con el **sistema ERP de Tesorería de ADRES** para ejecutar las transferencias bancarias reales a los prestadores de salud.

| Atributo | Valor |
|----------|-------|
| Proyecto | `APP.API_PAGOS` |
| Framework | .NET 8.0 |
| Controllers | 2 |
| Base de datos | `ADRES_GiroDirecto` |
| ERP URL | `https://integraerppru.adres.gov.co/` |
| Despliegue | Kubernetes AKS |

---

## Flujo de integración

```
Liquidación (Aprobada)
        │
        ▼
 API Pagos ──▶ ERP ADRES (Tesorería)
        │           └── Validar Tercero
        │           └── Registrar Presupuesto
        │
        ▼
 Respuesta: SuccessCount / ErrorCount
        │
        ▼
 Transferencia bancaria efectiva al IPS
```

---

## Autenticación

```http
Authorization: Bearer {token}
```

El ERP utiliza autenticación **Basic Auth** internamente:

```
Usuario: GD_INTEGRAERP
Password: [configurado en appsettings]
```

---

## Integrar Presupuesto ERP

### `POST /pagos/integraciones/presupuesto/ejecutar`

Envía los registros de presupuesto aprobados al ERP de Tesorería para generar las órdenes de pago.

:::info Endpoint crítico
Este es el endpoint que materializa el pago. Una vez ejecutado exitosamente, el ERP genera las transferencias bancarias reales a los prestadores.
:::

**Cuerpo de la solicitud:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| *(body según Command)* | object | ✅ | Parámetros del proceso a integrar |

**Códigos de respuesta:**

| Código HTTP | Significado |
|-------------|-------------|
| `200 OK` | Todos los registros procesados exitosamente |
| `204 No Content` | Sin datos que procesar (SuccessCount=0 y ErrorCount=0) |
| `207 Multi-Status` | Éxito parcial — algunos registros fallaron |
| `502 Bad Gateway` | Todos los registros fallaron (error en ERP) |

<Tabs>
<TabItem value="request" label="Solicitud">

```http
POST /pagos/integraciones/presupuesto/ejecutar
Authorization: Bearer {token}
Content-Type: application/json

{
  "idLiquidacion": 55,
  "idProcesoInterno": 42,
  "fechaEjecucion": "2024-04-16T08:00:00"
}
```

</TabItem>
<TabItem value="200" label="200 OK — Éxito total">

```json
{
  "successCount": 28,
  "errorCount": 0,
  "errores": []
}
```

</TabItem>
<TabItem value="207" label="207 — Éxito parcial">

```json
{
  "successCount": 25,
  "errorCount": 3,
  "errores": [
    {
      "idRegistro": "PRES-2024-00101",
      "nitPrestador": "900123456",
      "mensaje": "Cuenta bancaria no registrada en ERP"
    },
    {
      "idRegistro": "PRES-2024-00102",
      "nitPrestador": "900654321",
      "mensaje": "Tercero no existe en sistema ERP"
    },
    {
      "idRegistro": "PRES-2024-00103",
      "nitPrestador": "800987654",
      "mensaje": "Saldo presupuestal insuficiente"
    }
  ]
}
```

</TabItem>
<TabItem value="502" label="502 — Fallo total">

```json
{
  "successCount": 0,
  "errorCount": 28,
  "errores": [
    {
      "mensaje": "Error de conexión con ERP: timeout después de 30 segundos"
    }
  ]
}
```

</TabItem>
</Tabs>

---

## Verificar Tercero en ERP

### `POST /pagos/integraciones/tercero/verificar`

Verifica si un tercero (prestador/IPS) existe en el sistema ERP antes de intentar el pago.

:::tip Buena práctica
Ejecutar este endpoint **antes** de `/ejecutar` para identificar terceros no registrados y evitar fallos parciales.
:::

<Tabs>
<TabItem value="request" label="Solicitud">

```http
POST /pagos/integraciones/tercero/verificar
Authorization: Bearer {token}
Content-Type: application/json

{
  "nitTercero": "900123456",
  "tipoDocumento": "NIT"
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "nitTercero": "900123456",
  "existe": true,
  "nombreTercero": "Clínica General S.A.",
  "cuentaBancaria": "****8542",
  "banco": "Banco de Bogotá",
  "estadoCuenta": "Activa"
}
```

</TabItem>
<TabItem value="no-existe" label="Tercero no existe">

```json
{
  "nitTercero": "900999999",
  "existe": false,
  "mensaje": "El NIT 900999999 no está registrado en el sistema ERP"
}
```

</TabItem>
</Tabs>

---

## Manejo de errores

| Error | Causa | Solución |
|-------|-------|----------|
| `Cuenta bancaria no registrada` | El prestador no tiene cuenta en ERP | Registrar cuenta en módulo de Terceros ERP |
| `Tercero no existe` | NIT no está en ERP | Crear tercero antes de ejecutar pago |
| `Saldo presupuestal insuficiente` | Presupuesto agotado en partida | Escalar a Tesorería para ampliar partida |
| `Timeout ERP` | ERP no responde en 30 seg | Reintentar en horario no pico |
| `Autenticación fallida ERP` | Credenciales expiradas | Rotar credenciales en `appsettings` |

---

## Integración con ERP — Detalle técnico

El ERP de ADRES expone un único endpoint REST:

```
POST https://integraerppru.adres.gov.co/IntegraERP/IntegrarListadoRegistrosPresupuestoERP
Authorization: Basic {base64(usuario:password)}
Content-Type: application/json
```

API Pagos actúa como **facade** que:
1. Recibe la solicitud desde GiroDirecto
2. Transforma el formato de datos
3. Llama al ERP externo
4. Interpreta la respuesta y la normaliza
5. Retorna el resultado consolidado

```
GiroDirecto API Pagos
  [recibe solicitud]
        │
        ▼
  [consulta BD: obtiene registros a pagar]
        │
        ▼
  [llama ERP: POST /IntegrarListadoRegistrosPresupuestoERP]
        │
        ├── [éxito] marca registros como "Enviado" en BD
        └── [error] registra log de error, marca como "Fallido"
```
