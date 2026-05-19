---
id: api-alistamiento
title: API Alistamiento
sidebar_label: Alistamiento
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# API Alistamiento

Gestión de **datos maestros** del sistema GiroDirecto: EPS, Condiciones de elegibilidad, Giro Límite, REPS (prestadores) y Terceros.

| Atributo | Valor |
|----------|-------|
| Proyecto | `APP.API_ALISTAMIENTO` |
| Framework | .NET 8.0 |
| Controllers | 28 |
| Base de datos | `ADRES_GiroDirecto` |
| Despliegue | Kubernetes AKS |

---

## Autenticación

Todos los endpoints requieren JWT Bearer Token (Azure AD), excepto `/api/Login/login`.

```http
Authorization: Bearer {token}
```

---

## Login

### `GET /api/Login/login`

Obtiene un token de acceso JWT desde Azure Active Directory.

**Respuesta exitosa `200 OK`:**

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

:::info
En producción, el token se obtiene directamente desde Azure AD usando OAuth 2.0 client credentials flow. Este endpoint es para desarrollo/pruebas.
:::

---

## Condiciones

Las condiciones definen los **parámetros de elegibilidad** (porcentajes mínimo y máximo) que aplican por régimen y línea de proceso.

### `GET /api/Condicion`

Lista condiciones con paginación y filtros.

**Parámetros de consulta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `IdCondicion` | long? | Filtro por ID |
| `CodigoCondicion` | string? | Filtro por código |
| `Descripcion` | string? | Búsqueda por descripción |
| `IdCodigoReferenciaRegimenDescripcion` | string? | Régimen (Contributivo/Subsidiado) |
| `IdCodigoReferenciaLineaProceso` | long? | Línea de proceso |
| `numeroPagina` | int? | Página (default: 1) |
| `registrosPorPagina` | int? | Por página (default: 20) |
| `sortColumn` | string? | Columna de orden |
| `sortOrder` | string? | `asc` o `desc` |

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/Condicion?numeroPagina=1&registrosPorPagina=10&sortColumn=Descripcion&sortOrder=asc
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "totalRegistros": 45,
  "numeroPagina": 1,
  "registrosPorPagina": 10,
  "totalPaginas": 5,
  "items": [
    {
      "idCondicion": 1,
      "idCodigoReferenciaRegimen": 101,
      "idCodigoReferenciaRegimenDescripcion": "Contributivo",
      "codigoCondicion": "COND-001",
      "descripcion": "Condición patrimonio adecuado",
      "porcentajeMinimo": 80.00,
      "porcentajeMaximo": 100.00,
      "fechaInicio": "2024-01-01",
      "fechaFin": null,
      "idCodigoReferenciaLineaProceso": 201,
      "idCodigoReferenciaLineaProcesoDescripcion": "Capitación",
      "fechaCreacion": "2024-01-15T10:30:00",
      "fechaModificacion": "2024-03-20T14:15:00"
    }
  ]
}
```

</TabItem>
</Tabs>

---

### `GET /api/Condicion/{IdCondicion}`

Obtiene el detalle de una condición por ID.

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `IdCondicion` | int | ID de la condición |

<Tabs>
<TabItem value="request" label="Solicitud">

```http
GET /api/Condicion/1
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idCondicion": 1,
  "idCodigoReferenciaRegimen": 101,
  "idCodigoReferenciaRegimenDescripcion": "Contributivo",
  "codigoCondicion": "COND-001",
  "descripcion": "Condición patrimonio adecuado",
  "porcentajeMinimo": 80.00,
  "porcentajeMaximo": 100.00,
  "fechaInicio": "2024-01-01",
  "fechaFin": null,
  "idCodigoReferenciaLineaProceso": 201,
  "idCodigoReferenciaLineaProcesoDescripcion": "Capitación",
  "fechaCreacion": "2024-01-15T10:30:00",
  "fechaModificacion": "2024-03-20T14:15:00"
}
```

</TabItem>
</Tabs>

---

### `POST /api/Condicion`

Crea una nueva condición de elegibilidad.

**Cuerpo de la solicitud:**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `IdCodigoReferenciaRegimen` | long | ✅ | Debe existir en catálogo |
| `CodigoCondicion` | string | ✅ | Máx. 20 caracteres, único |
| `Descripcion` | string | ✅ | Máx. 500 caracteres |
| `PorcentajeMinimo` | decimal | — | >= 0 |
| `PorcentajeMaximo` | decimal | — | >= 0, >= PorcentajeMinimo |
| `FechaInicio` | DateOnly | ✅ | Formato: `yyyy-MM-dd` |
| `FechaFin` | DateOnly? | — | Debe ser >= FechaInicio |
| `IdCodigoReferenciaLineaProceso` | long? | — | Debe existir en catálogo |

<Tabs>
<TabItem value="request" label="Solicitud">

```http
POST /api/Condicion
Authorization: Bearer {token}
Content-Type: application/json

{
  "idCodigoReferenciaRegimen": 101,
  "codigoCondicion": "COND-001",
  "descripcion": "Condición patrimonio adecuado contributivo",
  "porcentajeMinimo": 80.00,
  "porcentajeMaximo": 100.00,
  "fechaInicio": "2024-01-01",
  "fechaFin": null,
  "idCodigoReferenciaLineaProceso": 201
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "id": 15,
  "nombre": "COND-001 — Condición patrimonio adecuado contributivo"
}
```

</TabItem>
<TabItem value="error" label="Errores">

```json
// 400 Bad Request — validación fallida
{
  "errors": {
    "CodigoCondicion": ["El código ya existe en el sistema"],
    "PorcentajeMaximo": ["Debe ser mayor o igual al porcentaje mínimo"]
  }
}
```

</TabItem>
</Tabs>

---

### `PUT /api/Condicion`

Actualiza una condición existente.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
PUT /api/Condicion
Authorization: Bearer {token}
Content-Type: application/json

{
  "idCondicion": 15,
  "idCodigoReferenciaRegimen": 101,
  "codigoCondicion": "COND-001",
  "descripcion": "Condición patrimonio adecuado contributivo — actualizada",
  "porcentajeMinimo": 85.00,
  "porcentajeMaximo": 100.00,
  "fechaInicio": "2024-01-01",
  "fechaFin": "2024-12-31",
  "idCodigoReferenciaLineaProceso": 201
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idCondicion": 15,
  "descripcion": "Condición patrimonio adecuado contributivo — actualizada",
  "codigoCondicion": "COND-001"
}
```

</TabItem>
</Tabs>

---

### `DELETE /api/Condicion/{IdCondicion}`

Elimina una condición. Solo se puede eliminar si no tiene dependencias activas.

<Tabs>
<TabItem value="request" label="Solicitud">

```http
DELETE /api/Condicion/15
Authorization: Bearer {token}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idCondicion": 15,
  "descripcion": "Condición patrimonio adecuado contributivo",
  "codigoCondicion": "COND-001"
}
```

</TabItem>
</Tabs>

---

## EPS

Gestión del catálogo de **Entidades Promotoras de Salud**.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/Eps` | Listar EPS con paginación |
| `GET` | `/api/Eps/ByLineaProceso` | Listar EPS filtradas por línea de proceso |
| `GET` | `/api/Eps/{CodigoEps}` | Detalle de una EPS |
| `POST` | `/api/Eps` | Crear EPS |
| `PUT` | `/api/Eps` | Actualizar EPS |
| `DELETE` | `/api/Eps/{CodigoEps}` | Eliminar EPS |

<Tabs>
<TabItem value="get" label="GET /api/Eps/{CodigoEps}">

```http
GET /api/Eps/EPS001
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "codigoEps": "EPS001",
  "nitEps": "800058016",
  "nombreEps": "Nueva EPS S.A.",
  "idCodigoReferenciaRegimen": 101,
  "regimenDescripcion": "Contributivo",
  "activa": true,
  "fechaCreacion": "2024-01-10T09:00:00"
}
```

</TabItem>
<TabItem value="post" label="POST /api/Eps">

```http
POST /api/Eps
Authorization: Bearer {token}
Content-Type: application/json

{
  "codigoEps": "EPS001",
  "nitEps": "800058016",
  "nombreEps": "Nueva EPS S.A.",
  "idCodigoReferenciaRegimen": 101
}
```

**Respuesta:**
```json
{
  "id": 5,
  "codigoEps": "EPS001"
}
```

</TabItem>
</Tabs>

---

## Giro Límite

El **Giro Límite** define los topes máximos de pago por EPS y proceso interno. Se carga masivamente desde archivos `.txt` pipe-delimitados.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/GiroLimite` | Listar con paginación |
| `GET` | `/api/GiroLimite/{IdGiroLimite}` | Detalle |
| `POST` | `/api/GiroLimite` | Crear registro individual |
| `PUT` | `/api/GiroLimite` | Actualizar |
| `DELETE` | `/api/GiroLimite/{IdGiroLimite}` | Eliminar *(requiere rol)* |
| `POST` | `/api/GiroLimite/upload` | Carga masiva desde archivo `.txt` |
| `POST` | `/api/GiroLimite/validate-eps` | Validar EPS desde archivo antes de cargar |
| `POST` | `/api/GiroLimite/calcular-valores-limite` | Calcular porcentajes por condición |

---

### `POST /api/GiroLimite/upload`

Carga masiva de giros límite desde un archivo de texto pipe-delimitado.

**Formato del archivo `.txt`:**

```
CodigoEps|NitEps|Departamento|Municipio|ValorUpc|IdProceso|FechaProceso|NombreProceso|IdCodigoReferenciaLineaProceso
EPS001|800058016|Cundinamarca|Bogotá|950000.50|1|15/01/2024|Proceso Ene 2024|201
EPS002|800123456|Antioquia|Medellín|920000.00|1|15/01/2024|Proceso Ene 2024|201
```

:::caution
- Solo se aceptan archivos `.txt`
- El separador es `|` (pipe)
- `FechaProceso` debe tener formato `dd/MM/yyyy`
:::

<Tabs>
<TabItem value="request" label="Solicitud (multipart/form-data)">

```http
POST /api/GiroLimite/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="File"; filename="girolimite_ene2024.txt"
Content-Type: text/plain

[contenido del archivo]
--boundary--
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idProcesoInterno": 42,
  "totalGiroLimitesCreados": 28,
  "totalRegionalizacionesCreadas": 168
}
```

</TabItem>
</Tabs>

---

### `POST /api/GiroLimite/calcular-valores-limite`

Calcula y aplica los porcentajes mínimo y máximo por condición para todos los giros límite de un proceso interno.

:::info Lógica de negocio
1. Para cada GiroLímite del proceso, busca una `CondicionEps` que coincida por régimen y línea de proceso
2. Si la encuentra, aplica `PorcentajeMinimo` y `PorcentajeMaximo` de esa condición
3. Actualiza las `GiroLimiteRegionalizacion` asociadas
4. Si no hay condición, el registro queda sin porcentaje (requiere revisión manual)
:::

<Tabs>
<TabItem value="request" label="Solicitud">

```http
POST /api/GiroLimite/calcular-valores-limite
Authorization: Bearer {token}
Content-Type: application/json

{
  "idProcesoInterno": 42
}
```

</TabItem>
<TabItem value="response" label="Respuesta 200">

```json
{
  "idProcesoInterno": 42,
  "totalGiroLimiteProcesados": 28,
  "totalGiroLimiteConCondicion": 25,
  "totalGiroLimiteSinCondicion": 3,
  "totalRegionalizacionesActualizadas": 150,
  "detalles": [
    {
      "idGiroLimite": 101,
      "codigoEps": "EPS001",
      "condicionEncontrada": true,
      "idCondicionEpsSeleccionada": 5,
      "idCondicionSeleccionada": 1,
      "porcentajeMinimoAplicado": 80.00,
      "porcentajeMaximoAplicado": 100.00,
      "regionalizacionesActualizadas": 6
    },
    {
      "idGiroLimite": 102,
      "codigoEps": "EPS003",
      "condicionEncontrada": false,
      "idCondicionEpsSeleccionada": null,
      "idCondicionSeleccionada": null,
      "porcentajeMinimoAplicado": null,
      "porcentajeMaximoAplicado": null,
      "regionalizacionesActualizadas": 0
    }
  ]
}
```

</TabItem>
</Tabs>

---

## REPS (Prestadores)

Consulta de datos del **Registro Especial de Prestadores de Servicios de Salud**. Estos datos son **solo lectura** (se sincronizan desde el REPS externo).

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/RepsPrestador` | Listar prestadores |
| `GET` | `/api/RepsPrestadorAudit` | Auditoría de cambios en prestadores |
| `GET` | `/api/RepsPrestadorAuditHst` | Historial completo de auditoría |
| `GET` | `/api/RepsSede` | Listar sedes de prestadores |
| `GET` | `/api/RepsSedeServicio` | Listar servicios por sede |
| `GET` | `/api/RepsCapacidad` | Capacidad instalada |

---

## Terceros

Gestión de terceros (personas naturales o jurídicas) que participan en el sistema.

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/Tercero` | Listar terceros |
| `GET` | `/api/Tercero/{Id}` | Detalle |
| `POST` | `/api/Tercero` | Crear tercero |
| `PUT` | `/api/Tercero` | Actualizar |
| `DELETE` | `/api/Tercero/{Id}` | Eliminar |

---

## Códigos de referencia

Catálogo de valores maestros del sistema (dominios/enumeraciones).

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/CodigoReferencia` | Listar referencias |
| `GET` | `/api/CodigoReferenciaNumerico` | Referencias numéricas |

**Ejemplo de uso de regímenes:**

```http
GET /api/CodigoReferencia?tipo=Regimen
Authorization: Bearer {token}
```

```json
[
  { "id": 101, "codigo": "C", "descripcion": "Contributivo" },
  { "id": 102, "codigo": "S", "descripcion": "Subsidiado" }
]
```
