---
id: api-validacion
title: API Validación
sidebar_label: Validación
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# API Validación

Gestiona la **verificación de facturas e ítems** antes de que puedan ser postuladas o liquidadas. Define las reglas de negocio que determina si una factura es elegible para giro directo.

| Atributo | Valor |
|----------|-------|
| Proyecto | `APP.API_VALIDACION` |
| Framework | .NET 8.0 |
| Controllers | 6 |
| Base de datos | `ADRES_GiroDirecto` |
| Despliegue | Kubernetes AKS |

---

## Modelo conceptual

```
ValidacionProceso
    └── ValidacionItem  (reglas de negocio individuales)
            ├── ValidacionItemLineaProceso  (aplica por línea de proceso)
            └── ValidacionPasoAprobacion
                    └── ValidacionPasoAprobacionValidacionItem

ValidacionFacturaResultadoAgregado  (resultado final por factura)
```

---

## Autenticación

```http
Authorization: Bearer {token}
```

---

## Ítems de Validación

Un **Ítem de Validación** es una regla de negocio específica que se evalúa sobre una factura (ej: "La fecha de la factura no puede ser mayor a 30 días", "El NIT del emisor debe estar en REPS").

### `GET /api/ValidacionItem`

Lista todos los ítems de validación configurados.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/ValidacionItem?numeroPagina=1&registrosPorPagina=20
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "totalRegistros": 38,
  "numeroPagina": 1,
  "registrosPorPagina": 20,
  "totalPaginas": 2,
  "items": [
    {
      "idValidacionItem": 1,
      "codigoItem": "VAL-001",
      "descripcion": "El prestador debe estar inscrito en REPS con sede activa",
      "idLineaProceso": 201,
      "lineaProcesoDescripcion": "Capitación",
      "esCritico": true,
      "activo": true,
      "fechaCreacion": "2024-01-10T09:00:00"
    },
    {
      "idValidacionItem": 2,
      "codigoItem": "VAL-002",
      "descripcion": "La factura no puede tener más de 60 días de antigüedad",
      "idLineaProceso": 202,
      "lineaProcesoDescripcion": "Evento",
      "esCritico": true,
      "activo": true,
      "fechaCreacion": "2024-01-10T09:00:00"
    }
  ]
}
```

</TabItem>
</Tabs>

---

### `GET /api/ValidacionItem/{IdValidacionItem}`

Obtiene el detalle de un ítem de validación.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/ValidacionItem/1
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idValidacionItem": 1,
  "codigoItem": "VAL-001",
  "descripcion": "El prestador debe estar inscrito en REPS con sede activa",
  "idLineaProceso": 201,
  "lineaProcesoDescripcion": "Capitación",
  "esCritico": true,
  "activo": true,
  "observaciones": "Verificar contra tabla REPS en tiempo real",
  "fechaCreacion": "2024-01-10T09:00:00",
  "fechaModificacion": "2024-02-15T11:30:00"
}
```

</TabItem>
</Tabs>

---

### `POST /api/ValidacionItem`

Crea un nuevo ítem de validación (regla de negocio).

**Cuerpo de la solicitud:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `CodigoItem` | string | ✅ | Código único de la regla |
| `Descripcion` | string | ✅ | Descripción de la regla |
| `IdLineaProceso` | long | ✅ | Línea de proceso a la que aplica |
| `EsCritico` | bool | ✅ | Si falla, bloquea la factura |
| `Activo` | bool | — | Default: `true` |
| `Observaciones` | string? | — | Notas técnicas |

<Tabs>
<TabItem value="request" label="Solicitud">

```http
POST /api/ValidacionItem
Authorization: Bearer {token}
Content-Type: application/json

{
  "codigoItem": "VAL-039",
  "descripcion": "El servicio facturado debe estar habilitado en la sede del prestador",
  "idLineaProceso": 202,
  "esCritico": true,
  "activo": true,
  "observaciones": "Cruce con REPS SedeServicio"
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idValidacionItem": 39
}
```

</TabItem>
</Tabs>

---

### `PUT /api/ValidacionItem`

Actualiza un ítem de validación existente.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
PUT /api/ValidacionItem
Authorization: Bearer {token}
Content-Type: application/json

{
  "idValidacionItem": 39,
  "codigoItem": "VAL-039",
  "descripcion": "El servicio facturado debe estar habilitado en la sede del prestador (actualizado)",
  "idLineaProceso": 202,
  "esCritico": false,
  "activo": true
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idValidacionItem": 39
}
```

</TabItem>
</Tabs>

---

### `DELETE /api/ValidacionItem/{IdValidacionItem}`

Elimina un ítem de validación.

:::caution
Solo se pueden eliminar ítems que no estén siendo usados en ningún `ValidacionPasoAprobacion` activo.
:::

---

## Ítems por Línea de Proceso

Permite consultar qué ítems de validación aplican a una línea de proceso específica.

### `GET /api/ValidacionItemLineaProceso`

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/ValidacionItemLineaProceso?idLineaProceso=202
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idLineaProceso": 202,
  "lineaProcesoDescripcion": "Evento",
  "items": [
    {
      "idValidacionItem": 2,
      "codigoItem": "VAL-002",
      "descripcion": "La factura no puede tener más de 60 días de antigüedad",
      "esCritico": true
    },
    {
      "idValidacionItem": 5,
      "codigoItem": "VAL-005",
      "descripcion": "El valor de la factura no puede superar el techo UPC asignado",
      "esCritico": true
    }
  ]
}
```

</TabItem>
</Tabs>

---

## Resultados de Validación por Factura

El resultado agregado muestra si una factura **pasó o falló** la validación y qué reglas fallaron.

### `GET /api/ValidacionFacturaResultadoAgregado`

Lista los resultados de validación por factura.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/ValidacionFacturaResultadoAgregado?idFactura=FE-2024-00123&idLineaProceso=202
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "totalRegistros": 1,
  "items": [
    {
      "idValidacionFacturaResultadoAgregado": 501,
      "idFactura": "FE-2024-00123",
      "numeroFactura": "FE-2024-00123",
      "nitEmisor": 900123456,
      "idLineaProceso": 202,
      "resultado": "Aprobada",
      "totalItemsValidados": 8,
      "totalItemsAprobados": 8,
      "totalItemsRechazados": 0,
      "totalItemsCriticosRechazados": 0,
      "fechaValidacion": "2024-04-10T16:00:00"
    }
  ]
}
```

</TabItem>
</Tabs>

---

## Proceso de Validación

El **ValidacionProceso** agrupa los ítems de validación que se ejecutan en una pasada completa.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/ValidacionProceso` | Listar procesos |
| `GET` | `/api/ValidacionProceso/{Id}` | Detalle de proceso |

---

## Pasos de Aprobación

Los **pasos de aprobación** definen el workflow de revisión humana sobre los resultados de validación.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/ValidacionPasoAprobacion` | Listar pasos |
| `GET` | `/api/ValidacionPasoAprobacionValidacionItem` | Relación paso↔ítem |

---

## Resumen de reglas de validación

| Código | Descripción | Crítico | Línea |
|--------|-------------|---------|-------|
| VAL-001 | Prestador inscrito en REPS con sede activa | ✅ | Capitación |
| VAL-002 | Factura con menos de 60 días de antigüedad | ✅ | Evento |
| VAL-003 | NIT emisor válido y activo en REPS | ✅ | Todas |
| VAL-004 | Valor factura dentro del techo UPC | ✅ | Todas |
| VAL-005 | Servicio habilitado en sede del prestador | ✅ | Evento |
| VAL-006 | EPS no está en proceso de liquidación | ✅ | Todas |
| VAL-007 | Glosa no supera el 30% del valor total | ⬜ | Evento |
| VAL-008 | Código CUPS válido y vigente | ⬜ | Evento |
