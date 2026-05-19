---
id: api-liquidacion
title: API Liquidación
sidebar_label: Liquidación
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# API Liquidación

Gestiona el **proceso definitivo de cálculo y orden de pago** a los prestadores de salud (IPS). Es el módulo final del flujo GiroDirecto antes de que Tesorería ejecute la transferencia.

| Atributo | Valor |
|----------|-------|
| Proyecto | `APP.API_LIQUIDACION` |
| Framework | .NET 8.0 |
| Controllers | 13 |
| Base de datos | `ADRES_GiroDirecto` + `ADRES_Seguridad` |
| Despliegue | Kubernetes AKS |

---

## Flujo de la liquidación

```
PostulacionVentana (cerrada)
         │
         ▼
   LiquidacionVentana  ──▶  Asignar GiroLímite
         │
         ▼
  LiquidacionFactura  ──▶  Calcular DescuentosFuente
         │
         ▼
 LiquidacionDetalle   ──▶  ValidarPasoAprobacion
         │
         ▼
  Plantilla / Orden de Pago  ──▶  ERP Tesorería
```

---

## Autenticación

```http
Authorization: Bearer {token}
```

---

## Liquidación Factura

### `GET /api/Liquidacion`

Lista liquidaciones con paginación.

**Parámetros de consulta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `numeroPagina` | int? | Página (default: 1) |
| `registrosPorPagina` | int? | Por página (default: 20) |
| `sortColumn` | string? | Campo de ordenamiento |
| `sortOrder` | string? | `asc` o `desc` |

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/Liquidacion?numeroPagina=1&registrosPorPagina=20&sortColumn=FechaLiquidacion&sortOrder=desc
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "totalRegistros": 120,
  "numeroPagina": 1,
  "registrosPorPagina": 20,
  "totalPaginas": 6,
  "items": [
    {
      "idLiquidacion": 55,
      "numeroLiquidacion": "LIQ-2024-055",
      "fechaLiquidacion": "2024-03-15T00:00:00",
      "valorTotal": 5200000000.00,
      "valorDescuentos": 250000000.00,
      "valorNeto": 4950000000.00,
      "estado": "Aprobada",
      "observaciones": "Liquidación mes marzo 2024",
      "fechaRegistro": "2024-03-15T10:30:00",
      "usuarioRegistro": "admin@adres.gov.co",
      "fechaModificacion": "2024-03-16T09:15:00",
      "usuarioModificacion": "supervisor@adres.gov.co"
    }
  ]
}
```

</TabItem>
</Tabs>

---

### `GET /api/Liquidacion/{IdLiquidacion}`

Obtiene el detalle completo de una liquidación.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/Liquidacion/55
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idLiquidacion": 55,
  "numeroLiquidacion": "LIQ-2024-055",
  "fechaLiquidacion": "2024-03-15T00:00:00",
  "valorTotal": 5200000000.00,
  "valorDescuentos": 250000000.00,
  "valorNeto": 4950000000.00,
  "estado": "Aprobada",
  "observaciones": "Liquidación mes marzo 2024",
  "fechaRegistro": "2024-03-15T10:30:00",
  "usuarioRegistro": "admin@adres.gov.co",
  "fechaModificacion": "2024-03-16T09:15:00",
  "usuarioModificacion": "supervisor@adres.gov.co"
}
```

</TabItem>
<TabItem value="error" label="404 Not Found">

```json
{
  "status": 404,
  "title": "Liquidación no encontrada",
  "detail": "No existe liquidación con ID 999"
}
```

</TabItem>
</Tabs>

---

### `POST /api/Liquidacion`

Crea una nueva liquidación en estado **Borrador**.

**Cuerpo de la solicitud:**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `NumeroLiquidacion` | string | ✅ | Único en el sistema |
| `FechaLiquidacion` | DateTime | ✅ | No puede ser fecha futura |
| `ValorTotal` | decimal | ✅ | Debe ser > 0 |
| `Observaciones` | string? | — | Texto libre |

<Tabs>
<TabItem value="request" label="Solicitud">

```http
POST /api/Liquidacion
Authorization: Bearer {token}
Content-Type: application/json

{
  "numeroLiquidacion": "LIQ-2024-056",
  "fechaLiquidacion": "2024-04-15T00:00:00",
  "valorTotal": 4800000000.00,
  "observaciones": "Liquidación Abril 2024 — régimen contributivo"
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idLiquidacion": 56
}
```

</TabItem>
<TabItem value="error" label="Errores 400">

```json
{
  "errors": {
    "NumeroLiquidacion": ["El número de liquidación ya existe"],
    "FechaLiquidacion": ["La fecha no puede ser futura"],
    "ValorTotal": ["El valor debe ser mayor a 0"]
  }
}
```

</TabItem>
</Tabs>

---

### `PUT /api/Liquidacion/{IdLiquidacion}`

Actualiza una liquidación existente.

:::caution Restricciones
Solo se pueden modificar liquidaciones en estado **Borrador** o **Rechazada**. Las liquidaciones en estado **Pagada** o **Anulada** no se pueden editar.
:::

<Tabs>
<TabItem value="request" label="Solicitud">

```http
PUT /api/Liquidacion/56
Authorization: Bearer {token}
Content-Type: application/json

{
  "numeroLiquidacion": "LIQ-2024-056",
  "fechaLiquidacion": "2024-04-15T00:00:00",
  "valorTotal": 4900000000.00,
  "observaciones": "Liquidación Abril 2024 — corregida"
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idLiquidacion": 56
}
```

</TabItem>
</Tabs>

---

### `DELETE /api/Liquidacion/{IdLiquidacion}`

Elimina una liquidación.

:::caution Restricciones
Solo se pueden eliminar liquidaciones en estado **Borrador** o **Rechazada**.
:::

<Tabs>
<TabItem value="request" label="Solicitud">

```http
DELETE /api/Liquidacion/56
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idLiquidacion": 56,
  "mensaje": "Liquidación eliminada exitosamente"
}
```

</TabItem>
</Tabs>

---

## Liquidación Ventana (Postulación)

Gestiona la asignación de liquidaciones a **ventanas de postulación** y sus giros límite.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/LiquidacionVentana` | Listar con paginación |
| `GET` | `/api/LiquidacionVentana/{Id}` | Detalle |
| `POST` | `/api/LiquidacionVentana` | Crear asignación |
| `PUT` | `/api/LiquidacionVentana` | Actualizar |
| `DELETE` | `/api/LiquidacionVentana/{Id}` | Eliminar |
| `POST` | `/api/LiquidacionVentanaAsignar` | Asignar giros límite masivamente |

---

## Descuentos de Fuente

Gestiona los descuentos que se aplican sobre el valor bruto de la liquidación.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/DescuentoFuente` | Listar descuentos |
| `GET` | `/api/DescuentoFuente/{Id}` | Detalle |
| `POST` | `/api/DescuentoFuente` | Crear descuento |
| `PUT` | `/api/DescuentoFuente` | Actualizar |
| `DELETE` | `/api/DescuentoFuente/{Id}` | Eliminar |

<Tabs>
<TabItem value="post" label="POST /api/DescuentoFuente">

```http
POST /api/DescuentoFuente
Authorization: Bearer {token}
Content-Type: application/json

{
  "idLiquidacion": 55,
  "tipoDescuento": "ReteFuente",
  "porcentaje": 3.5,
  "valorDescuento": 175000000.00,
  "observaciones": "Retención en la fuente aplicada"
}
```

**Respuesta:**
```json
{
  "idDescuentoFuente": 88,
  "idLiquidacion": 55
}
```

</TabItem>
</Tabs>

---

## Plantillas y Documentos

El módulo de liquidación genera documentos oficiales a partir de plantillas configurables.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/Plantilla` | Listar plantillas |
| `GET` | `/api/Plantilla/{Id}` | Detalle de plantilla |
| `POST` | `/api/Plantilla` | Crear plantilla |
| `PUT` | `/api/Plantilla` | Actualizar |
| `DELETE` | `/api/Plantilla/{Id}` | Eliminar |
| `GET` | `/api/PlantillaParrafo` | Listar párrafos de plantilla |
| `POST` | `/api/PlantillaParrafo` | Agregar párrafo |
| `DELETE` | `/api/PlantillaParrafo/rango` | Eliminar rango de párrafos |

---

## Flujo de Aprobación

Gestiona el **workflow de aprobación multi-paso** de una liquidación.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/ValidacionPasoAprobacion` | Listar pasos de aprobación |
| `POST` | `/api/ValidacionPasoAprobacion` | Registrar aprobación |
| `GET` | `/api/ValidacionPasoAprobacionItem` | Ítems de cada paso |

### Estados de una liquidación

```
Borrador → En Revisión → Aprobada → Pagada
                ↓
            Rechazada
                ↓
           (editar y re-enviar)
```
