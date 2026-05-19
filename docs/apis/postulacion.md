---
id: api-postulacion
title: API Postulación
sidebar_label: Postulación
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# API Postulación

Gestiona el **registro de facturas dentro de ventanas de tiempo** para acceder al mecanismo de Giro Directo. Las EPS e IPS postulan facturas durante un período específico.

| Atributo | Valor |
|----------|-------|
| Proyecto | `APP.API_POSTULACION` |
| Framework | .NET 8.0 |
| Controllers | 17 |
| Base de datos | `ADRES_GiroDirecto` |
| Despliegue | Kubernetes AKS |

---

## Flujo de postulación

```
PostulacionVentana (abierta)
         │
         ├──▶ PostulacionVentanaGiroLimite (asignar EPS/topes)
         │
         ├──▶ PostulacionFactura (registrar facturas individuales)
         │         └── PostulacionFactura/Masivo (carga masiva)
         │
         ├──▶ PostulacionDescuentoFuente (aplicar descuentos)
         │
         └──▶ PostulacionLiquidacion (pre-liquidar dentro de ventana)
```

---

## Autenticación

```http
Authorization: Bearer {token}
```

---

## Ventanas de Postulación

Una **ventana de postulación** es el período habilitado para que las EPS registren las facturas a girar.

### `GET /api/PostulacionVentana`

Lista ventanas con paginación.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/PostulacionVentana?numeroPagina=1&registrosPorPagina=10&sortOrder=desc
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "totalRegistros": 24,
  "numeroPagina": 1,
  "registrosPorPagina": 10,
  "totalPaginas": 3,
  "items": [
    {
      "idPostulacionVentana": 10,
      "nombreVentana": "Ventana Contributivo — Abril 2024",
      "fechaInicio": "2024-04-01",
      "fechaFin": "2024-04-15",
      "estado": "Cerrada",
      "idCodigoReferenciaRegimen": 101,
      "regimenDescripcion": "Contributivo",
      "fechaCreacion": "2024-03-25T10:00:00"
    }
  ]
}
```

</TabItem>
</Tabs>

---

### `GET /api/PostulacionVentana/{IdPostulacionVentana}`

Detalle de una ventana.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/PostulacionVentana/10
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idPostulacionVentana": 10,
  "nombreVentana": "Ventana Contributivo — Abril 2024",
  "fechaInicio": "2024-04-01",
  "fechaFin": "2024-04-15",
  "estado": "Cerrada",
  "idCodigoReferenciaRegimen": 101,
  "regimenDescripcion": "Contributivo",
  "totalFacturasPostuladas": 1842,
  "valorTotalPostulado": 12500000000.00,
  "fechaCreacion": "2024-03-25T10:00:00"
}
```

</TabItem>
</Tabs>

---

### `POST /api/PostulacionVentana`

Crea una nueva ventana de postulación.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
POST /api/PostulacionVentana
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombreVentana": "Ventana Contributivo — Mayo 2024",
  "fechaInicio": "2024-05-01",
  "fechaFin": "2024-05-15",
  "idCodigoReferenciaRegimen": 101
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idPostulacionVentana": 11
}
```

</TabItem>
</Tabs>

---

### `GET /api/PostulacionVentana/Certificado`

Genera el certificado de postulación para una ventana y giro límite específico.

**Parámetro de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `idPostulacionVentanaGiroLimite` | long | ✅ | ID de la ventana-giro límite |

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/PostulacionVentana/Certificado?idPostulacionVentanaGiroLimite=55
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idCertificado": "CERT-2024-055",
  "codigoEps": "EPS001",
  "nombreEps": "Nueva EPS S.A.",
  "ventana": "Ventana Contributivo — Abril 2024",
  "totalFacturas": 245,
  "valorBruto": 850000000.00,
  "valorDescuentos": 42500000.00,
  "valorNeto": 807500000.00,
  "fechaGeneracion": "2024-04-16T08:30:00",
  "urlDocumento": "https://storage.blob.core.windows.net/certificados/CERT-2024-055.pdf"
}
```

</TabItem>
</Tabs>

---

## Facturas Postuladas

### `GET /api/PostulacionFactura`

Lista facturas postuladas con múltiples filtros.

**Parámetros de consulta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `idPostulacionVentanaGiroLimite` | long? | Filtrar por ventana/giro límite |
| `nitEmisor` | long? | NIT del prestador emisor |
| `numeroFactura` | string? | Número de factura |
| `modalidadPago` | string? | Modalidad (`Capitacion`, `Evento`, etc.) |
| `estadoPostulado` | bool? | `true`=postulada, `false`=pendiente |
| `numeroPagina` | int? | Página |
| `registrosPorPagina` | int? | Por página |
| `sortColumn` | string? | Campo de orden |
| `sortOrder` | string? | `asc` o `desc` |

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/PostulacionFactura?idPostulacionVentanaGiroLimite=55&estadoPostulado=true&numeroPagina=1
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "totalRegistros": 245,
  "numeroPagina": 1,
  "registrosPorPagina": 20,
  "totalPaginas": 13,
  "items": [
    {
      "idPostulacionFactura": 1001,
      "idPostulacionVentanaGiroLimite": 55,
      "nitEmisor": 900123456,
      "nombreEmisor": "Clínica General S.A.",
      "numeroFactura": "FE-2024-00123",
      "fechaFactura": "2024-03-20",
      "valorFactura": 15000000.00,
      "modalidadPago": "Evento",
      "estadoPostulado": true,
      "fechaPostulacion": "2024-04-05T14:30:00"
    }
  ]
}
```

</TabItem>
</Tabs>

---

### `POST /api/PostulacionFactura`

Postula una factura individual.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
POST /api/PostulacionFactura
Authorization: Bearer {token}
Content-Type: application/json

{
  "idPostulacionVentanaGiroLimite": 55,
  "nitEmisor": 900123456,
  "numeroFactura": "FE-2024-00124",
  "fechaFactura": "2024-03-22",
  "valorFactura": 22000000.00,
  "modalidadPago": "Evento"
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idPostulacionFactura": 1002
}
```

</TabItem>
</Tabs>

---

### `POST /api/PostulacionFactura/Masivo`

Postula múltiples facturas en una sola operación. Ideal para cargas de archivos o migraciones.

:::tip Rendimiento
Usar el endpoint masivo en vez de llamadas individuales mejora el rendimiento hasta **10x** para lotes de más de 50 facturas.
:::

<Tabs>
<TabItem value="request" label="Solicitud">

```http
POST /api/PostulacionFactura/Masivo
Authorization: Bearer {token}
Content-Type: application/json

{
  "idPostulacionVentanaGiroLimite": 55,
  "facturas": [
    {
      "nitEmisor": 900123456,
      "numeroFactura": "FE-2024-00125",
      "fechaFactura": "2024-03-23",
      "valorFactura": 18500000.00,
      "modalidadPago": "Evento"
    },
    {
      "nitEmisor": 900654321,
      "numeroFactura": "FE-2024-00126",
      "fechaFactura": "2024-03-24",
      "valorFactura": 31000000.00,
      "modalidadPago": "Capitacion"
    }
  ]
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "totalPostuladas": 2,
  "totalErrores": 0,
  "idsCreados": [1003, 1004],
  "errores": []
}
```

</TabItem>
<TabItem value="error" label="Respuesta parcial">

```json
{
  "totalPostuladas": 1,
  "totalErrores": 1,
  "idsCreados": [1003],
  "errores": [
    {
      "numeroFactura": "FE-2024-00126",
      "mensaje": "La factura ya fue postulada en otra ventana"
    }
  ]
}
```

</TabItem>
</Tabs>

---

## Giro Límite en Ventana

Asignación de los topes de pago por EPS dentro de una ventana específica.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/PostulacionVentanaGiroLimite` | Listar asignaciones |
| `GET` | `/api/PostulacionVentanaGiroDetalle` | Detalle de giro por ventana |
| `POST` | `/api/PostulacionVentanaGiroLimiteCertificado` | Emitir certificado de límite |

---

## Descuentos de Fuente en Postulación

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/DescuentoFuente` | Listar descuentos aplicados |
| `POST` | `/api/DescuentoFuente` | Crear descuento |
| `PUT` | `/api/DescuentoFuente` | Actualizar |
| `DELETE` | `/api/DescuentoFuente/{Id}` | Eliminar |
| `GET` | `/api/DescuentoFuenteDetalle` | Detalle línea a línea |

---

## Proceso Interno y Aprobación

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/ProcesoInterno` | Listar procesos internos activos |
| `GET` | `/api/ValidacionPasoAprobacion` | Pasos de aprobación |
| `POST` | `/api/ValidacionPasoAprobacion` | Registrar aprobación de paso |
| `GET` | `/api/ValidacionPasoAprobacionItem` | Ítems de aprobación |
