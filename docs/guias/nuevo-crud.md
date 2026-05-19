---
id: nuevo-crud
title: Cómo crear un nuevo CRUD
sidebar_label: Nuevo CRUD paso a paso
---

# Guía: Crear un nuevo CRUD en GiroDirecto

Esta guía es un **skill reutilizable** para crear un módulo CRUD completo en cualquier microservicio del sistema GiroDirecto. Sigue el patrón **CQRS + MediatR + FluentValidation + AutoMapper** usado en todos los servicios.

:::tip Uso con IA (GitHub Copilot / Cursor / Windsurf)
Al final de esta página encontrarás el **prompt listo para copiar y pegar** en cualquier asistente de IA. Con él puedes generar los 8 archivos de un CRUD nuevo en segundos.
:::

---

## ¿Qué es el patrón que usamos?

```
HTTP Request
     │
     ▼
Controller  ──► IMediator.Send(command/query)
                     │
                     ▼
          MediatR Pipeline
          ├── FluentValidation (valida input)
          └── Handler (lógica de negocio)
                     │
                     ▼
              DbContext (EF Core)
                     │
                     ▼
            SQL Server Azure
```

Cada **feature** (entidad) vive en su propia carpeta y contiene todo lo necesario: validación, lógica, mapeo y rutas. No hay repositorios separados — el `DbContext` es el repositorio.

---

## Arquitectura de capas

```
Features/
└── [TuEntidad]/
    ├── Commands/
    │   ├── Add[TuEntidad].cs      ← CREATE  (Command + Validator + Handler + Mapper)
    │   ├── Update[TuEntidad].cs   ← UPDATE  (Command + Validator + Handler + Mapper)
    │   └── Delete[TuEntidad].cs   ← DELETE  (Command + Handler + Mapper)
    ├── Queries/
    │   ├── Detail[TuEntidad].cs   ← GET por ID  (Query + Handler + Mapper)
    │   └── List[TuEntidad].cs     ← GET lista   (Query paginada + Handler + Mapper)
    └── [TuEntidad]Controller.cs   ← Endpoints HTTP

Entities/GD/
└── [TuEntidad].cs                 ← Modelo EF Core (tabla SQL)
```

Un CRUD completo = **8 archivos**.  
El `Program.cs` no necesita modificarse gracias al registro automático por ensamblado.

---

## Flujo completo por operación

### CREATE (POST)

```
Cliente POST /api/tuEntidad
    │
    ▼
TuEntidadController.AddAsync([FromBody] AddTuEntidad.Command)
    │  _mediator.Send(command)
    ▼
FluentValidation → valida campos requeridos, unicidad, FK existentes
    │  si falla → 400 Bad Request automático
    ▼
AddTuEntidad.CommandHandler.Handle()
    │  new TuEntidad { ...campos... }
    │  _context.TuEntidad.Add(objeto)
    │  _context.SaveChangesAsync()
    ▼
AutoMapper → Entity → Result DTO
    │
    ▼
Controller → return Ok(result) → HTTP 200
```

### READ LIST (GET paginado)

```
Cliente GET /api/tuEntidad?nombre=xxx&numeroPagina=1&registrosPorPagina=10
    │
    ▼
TuEntidadController.GetListAsync([FromQuery] ListTuEntidad.Query)
    │  _mediator.Send(query)
    ▼
ListTuEntidad.Handler.Handle()
    │  _context.TuEntidad.AsNoTracking()
    │  .Where(filtros dinámicos)
    │  .OrderBy(sortColumn + sortOrder)
    │  .Skip(offset).Take(pageSize)
    ▼
PaginadorGenerico<Result> → HTTP 200
```

### DELETE (con transacción)

```
Cliente DELETE /api/tuEntidad/{id}
    │
    ▼
TuEntidadController.DeleteAsync([FromRoute] DeleteTuEntidad.Command)
    │  _mediator.Send(command)
    ▼
DeleteTuEntidad.CommandHandler.Handle()
    │  BeginTransactionAsync()
    │  _context.TuEntidad.FindAsync(id)
    │  _context.TuEntidad.Remove(entidad)
    │  SaveChangesAsync() → CommitAsync()
    │  [catch] → RollbackAsync() → throw
    ▼
AutoMapper → Entity → Result DTO → HTTP 200
```

---

## Paso a paso: 8 archivos a crear

### Paso 1 — Entity (modelo de base de datos)

**Archivo:** `Entities/GD/TuEntidad.cs`

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

[Table("NOMBRE_TABLA_SQL")]
public partial class TuEntidad
{
    [Key]
    [Column("ID_TU_ENTIDAD")]
    public long IdTuEntidad { get; set; }

    [Column("NOMBRE")]
    [StringLength(200)]
    [Unicode(false)]
    public string Nombre { get; set; } = null!;

    [Column("DESCRIPCION")]
    [StringLength(500)]
    [Unicode(false)]
    public string? Descripcion { get; set; }

    [Column("ACTIVO")]
    public bool? Activo { get; set; }

    [Column("FECHA_REGISTRO", TypeName = "datetime")]
    public DateTime? FechaRegistro { get; set; }

    // Si tiene FK, agrega la relación:
    // [Column("ID_OTRA_ENTIDAD")]
    // public long IdOtraEntidad { get; set; }
    //
    // [ForeignKey("IdOtraEntidad")]
    // public virtual OtraEntidad IdOtraEntidadNavigation { get; set; } = null!;
}
```

**Luego regístrala en el DbContext** (`Entities/GD/GDDBContext.cs`):

```csharp
public virtual DbSet<TuEntidad> TuEntidad { get; set; }
```

---

### Paso 2 — Command CREATE

**Archivo:** `Features/TuEntidad/Commands/AddTuEntidad.cs`

```csharp
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

// Namespace: ajusta al proyecto (ALISTAMIENTO, VALIDACION, etc.)
namespace ADRES.GD.API.ALISTAMIENTO.Features.TuEntidad;

public abstract class AddTuEntidad
{
    // ── INPUT DTO ────────────────────────────────────────────────
    public class Command : IRequest<Result>
    {
        public string Nombre { get; set; } = default!;
        public string? Descripcion { get; set; }
        // Agrega aquí todos los campos del formulario
    }

    // ── OUTPUT DTO ───────────────────────────────────────────────
    public record class Result(long IdTuEntidad, string Nombre);

    // ── VALIDACIÓN (FluentValidation) ────────────────────────────
    public class Validator : AbstractValidator<Command>
    {
        private readonly GDDBContext _context;

        public Validator(GDDBContext context)
        {
            _context = context;

            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(200).WithMessage("Máximo 200 caracteres.");

            // Validar unicidad contra BD
            RuleFor(x => x)
                .Must(cmd => !_context.TuEntidad.Any(e => e.Nombre == cmd.Nombre))
                .WithMessage("Ya existe un registro con ese nombre.");

            // Validar que FK exista (si aplica)
            // RuleFor(x => x.IdOtraEntidad)
            //     .Must(id => _context.OtraEntidad.Any(o => o.Id == id && o.Activo == true))
            //     .WithMessage("La FK referenciada no existe o está inactiva.");
        }
    }

    // ── MAPEO AutoMapper ─────────────────────────────────────────
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Entities.GD.TuEntidad, Result>();
            CreateMap<Command, Entities.GD.TuEntidad>();
        }
    }

    // ── HANDLER (lógica de negocio) ──────────────────────────────
    public class CommandHandler(GDDBContext context) : IRequestHandler<Command, Result>
    {
        private readonly GDDBContext _context = context;

        public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
        {
            var entidad = new Entities.GD.TuEntidad
            {
                Nombre      = request.Nombre,
                Descripcion = request.Descripcion,
                Activo      = true,
                FechaRegistro = DateTime.Now,
            };

            _context.TuEntidad.Add(entidad);
            await _context.SaveChangesAsync(cancellationToken);

            return new Result(entidad.IdTuEntidad, entidad.Nombre);
        }
    }
}
```

---

### Paso 3 — Command UPDATE

**Archivo:** `Features/TuEntidad/Commands/UpdateTuEntidad.cs`

```csharp
using AutoMapper;
using FluentValidation;
using MediatR;

namespace ADRES.GD.API.ALISTAMIENTO.Features.TuEntidad;

public abstract class UpdateTuEntidad
{
    public class Command : IRequest<Result>
    {
        public long IdTuEntidad { get; set; }
        public string Nombre { get; set; } = default!;
        public string? Descripcion { get; set; }
        public bool Activo { get; set; }
    }

    public record class Result(long IdTuEntidad, string Nombre);

    public class Validator : AbstractValidator<Command>
    {
        private readonly GDDBContext _context;

        public Validator(GDDBContext context)
        {
            _context = context;

            RuleFor(x => x.IdTuEntidad)
                .GreaterThan(0).WithMessage("El ID es obligatorio.");

            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(200).WithMessage("Máximo 200 caracteres.");

            // Validar que no exista otro registro con el mismo nombre
            RuleFor(x => x)
                .Must(cmd => !_context.TuEntidad.Any(e =>
                    e.Nombre == cmd.Nombre && e.IdTuEntidad != cmd.IdTuEntidad))
                .WithMessage("Ya existe otro registro con ese nombre.");
        }
    }

    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Entities.GD.TuEntidad, Result>();
            CreateMap<Command, Entities.GD.TuEntidad>();
        }
    }

    public class CommandHandler(GDDBContext context, IMapper mapper) : IRequestHandler<Command, Result>
    {
        private readonly GDDBContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

        public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
        {
            var entidad = await _context.TuEntidad.FindAsync(request.IdTuEntidad);

            if (entidad != null)
            {
                entidad.Nombre      = request.Nombre;
                entidad.Descripcion = request.Descripcion;
                entidad.Activo      = request.Activo;
            }

            await _context.SaveChangesAsync(cancellationToken);
            return _mapper.Map<Result>(entidad);
        }
    }
}
```

---

### Paso 4 — Command DELETE

**Archivo:** `Features/TuEntidad/Commands/DeleteTuEntidad.cs`

```csharp
using AutoMapper;
using MediatR;

namespace ADRES.GD.API.ALISTAMIENTO.Features.TuEntidad;

public abstract class DeleteTuEntidad
{
    public class Command : IRequest<Result>
    {
        public long IdTuEntidad { get; set; }
    }

    public record class Result(long IdTuEntidad);

    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Entities.GD.TuEntidad, Result>();
            CreateMap<Command, Entities.GD.TuEntidad>();
        }
    }

    public class CommandHandler(GDDBContext context, IMapper mapper) : IRequestHandler<Command, Result>
    {
        private readonly GDDBContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

        public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
        {
            // Transacción para garantizar consistencia
            await using var tx = await _context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                var entidad = await _context.TuEntidad.FindAsync(request.IdTuEntidad);

                if (entidad != null)
                    _context.TuEntidad.Remove(entidad);

                await _context.SaveChangesAsync(cancellationToken);
                await tx.CommitAsync(cancellationToken);

                return _mapper.Map<Result>(entidad);
            }
            catch
            {
                await tx.RollbackAsync(cancellationToken);
                throw;
            }
        }
    }
}
```

---

### Paso 5 — Query DETAIL (GetById)

**Archivo:** `Features/TuEntidad/Queries/DetailTuEntidad.cs`

```csharp
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ADRES.GD.API.ALISTAMIENTO.Features.TuEntidad;

public class DetailTuEntidad
{
    public class Command : IRequest<Result>
    {
        public long IdTuEntidad { get; set; }
    }

    public class Result
    {
        public long IdTuEntidad { get; set; }
        public string Nombre { get; set; } = default!;
        public string? Descripcion { get; set; }
        public bool? Activo { get; set; }
        public DateTime? FechaRegistro { get; set; }
        // Agrega campos de FK si los necesitas mostrar
        // public string OtraEntidadNombre { get; set; } = default!;
    }

    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Entities.GD.TuEntidad, Result>();
        }
    }

    public class Handler(GDDBContext db, IMapper mapper) : IRequestHandler<Command, Result>
    {
        private readonly GDDBContext _context = db ?? throw new ArgumentNullException(nameof(db));
        private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

        public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
        {
            // AsNoTracking: mejora rendimiento en consultas de solo lectura
            var resultado = await _context.TuEntidad
                .AsNoTracking()
                // .Include(e => e.IdOtraEntidadNavigation) // si tiene FK
                .Where(x => x.IdTuEntidad == request.IdTuEntidad)
                .Select(e => new Result
                {
                    IdTuEntidad   = e.IdTuEntidad,
                    Nombre        = e.Nombre,
                    Descripcion   = e.Descripcion,
                    Activo        = e.Activo,
                    FechaRegistro = e.FechaRegistro,
                })
                .FirstOrDefaultAsync(cancellationToken);

            return resultado ?? new Result();
        }
    }
}
```

---

### Paso 6 — Query LIST (paginada)

**Archivo:** `Features/TuEntidad/Queries/ListTuEntidad.cs`

```csharp
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ADRES.GD.API.ALISTAMIENTO.Features.TuEntidad;

public class ListTuEntidad
{
    // ── QUERY INPUT (filtros + paginación) ───────────────────────
    public class Query : IRequest<PaginadorGenerico<Result>>
    {
        public string? Nombre { get; set; }
        public bool? Activo { get; set; }
        // Parámetros de paginación — siempre los mismos
        public int? NumeroPagina { get; set; }
        public int? RegistrosPorPagina { get; set; }
        public string? SortColumn { get; set; }
        public string? SortOrder { get; set; }
    }

    public class Result
    {
        public long IdTuEntidad { get; set; }
        public string Nombre { get; set; } = default!;
        public string? Descripcion { get; set; }
        public bool? Activo { get; set; }
        public DateTime? FechaRegistro { get; set; }
    }

    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Entities.GD.TuEntidad, Result>();
        }
    }

    public class Handler(GDDBContext db, IMapper mapper) : IRequestHandler<Query, PaginadorGenerico<Result>>
    {
        private readonly GDDBContext _context = db ?? throw new ArgumentNullException(nameof(db));
        private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

        public async Task<PaginadorGenerico<Result>> Handle(Query request, CancellationToken cancellationToken)
        {
            // ── 1. Base query ────────────────────────────────────
            var query = _context.TuEntidad
                .AsNoTracking()
                .Select(e => new Result
                {
                    IdTuEntidad   = e.IdTuEntidad,
                    Nombre        = e.Nombre,
                    Descripcion   = e.Descripcion,
                    Activo        = e.Activo,
                    FechaRegistro = e.FechaRegistro,
                });

            // ── 2. Filtros dinámicos ─────────────────────────────
            if (!string.IsNullOrEmpty(request.Nombre))
                query = query.Where(x => x.Nombre.Contains(request.Nombre));

            if (request.Activo.HasValue)
                query = query.Where(x => x.Activo == request.Activo.Value);

            // ── 3. Ordenamiento dinámico ─────────────────────────
            var col   = request.SortColumn?.ToLowerInvariant() ?? "nombre";
            var order = request.SortOrder?.ToLowerInvariant() ?? "asc";

            query = (col, order) switch
            {
                ("nombre", "desc") => query.OrderByDescending(x => x.Nombre),
                ("nombre", _)      => query.OrderBy(x => x.Nombre),
                ("activo", "desc") => query.OrderByDescending(x => x.Activo),
                ("activo", _)      => query.OrderBy(x => x.Activo),
                ("fecharegistro", "desc") => query.OrderByDescending(x => x.FechaRegistro),
                ("fecharegistro", _)      => query.OrderBy(x => x.FechaRegistro),
                _ => order == "desc"
                    ? query.OrderByDescending(x => x.Nombre)
                    : query.OrderBy(x => x.Nombre),
            };

            // ── 4. Paginación ────────────────────────────────────
            var pagina   = request.NumeroPagina.GetValueOrDefault(1);
            var porPagina = request.RegistrosPorPagina.GetValueOrDefault(10);
            var total    = await query.CountAsync(cancellationToken);

            var resultado = await query
                .Skip((pagina - 1) * porPagina)
                .Take(porPagina)
                .ToListAsync(cancellationToken);

            return new PaginadorGenerico<Result>
            {
                PaginaActual       = pagina,
                RegistrosPorPagina = porPagina,
                TotalRegistros     = total,
                TotalPaginas       = (int)Math.Ceiling(total / (double)porPagina),
                Resultado          = resultado,
            };
        }
    }
}
```

---

### Paso 7 — Controller

**Archivo:** `Features/TuEntidad/TuEntidadController.cs`

```csharp
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ADRES.GD.API.ALISTAMIENTO.Features.TuEntidad;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Requiere JWT Bearer — quitar solo en Login
public class TuEntidadController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    // GET /api/tuEntidad?nombre=xxx&numeroPagina=1&registrosPorPagina=10
    [HttpGet]
    public async Task<ActionResult<PaginadorGenerico<ListTuEntidad.Result>>> GetListAsync(
        [FromQuery] ListTuEntidad.Query query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET /api/tuEntidad/{id}
    [HttpGet("{IdTuEntidad}")]
    public async Task<ActionResult<DetailTuEntidad.Result>> GetByIdAsync(
        [FromRoute] DetailTuEntidad.Command query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // POST /api/tuEntidad
    [HttpPost]
    public async Task<ActionResult<AddTuEntidad.Result>> AddAsync(
        [FromBody] AddTuEntidad.Command command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // PUT /api/tuEntidad
    [HttpPut]
    public async Task<ActionResult<UpdateTuEntidad.Result>> EditAsync(
        [FromBody] UpdateTuEntidad.Command command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // DELETE /api/tuEntidad/{id}
    [HttpDelete("{IdTuEntidad}")]
    public async Task<ActionResult<DeleteTuEntidad.Result>> DeleteAsync(
        [FromRoute] DeleteTuEntidad.Command command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
```

---

### Paso 8 — Verificar Program.cs

No necesitas modificar `Program.cs`. El registro es automático por ensamblado:

```csharp
// Ya configurado — registra TODOS los Handlers y Validators del ensamblado
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(currentAssembly));
builder.Services.AddAutoMapper(currentAssembly);
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
```

Solo debes agregar la entidad al `DbContext` (Paso 1).

---

## Checklist de verificación

Antes de probar en Swagger, confirma que:

- [ ] Entity creada con atributos `[Table]`, `[Key]`, `[Column]`
- [ ] Entity registrada como `DbSet<TuEntidad>` en `GDDBContext`
- [ ] `AddTuEntidad.cs` — Command + Validator + Handler + MapperProfile
- [ ] `UpdateTuEntidad.cs` — Command + Validator + Handler + MapperProfile
- [ ] `DeleteTuEntidad.cs` — Command + Handler con transacción + MapperProfile
- [ ] `DetailTuEntidad.cs` — Query + Handler con `AsNoTracking()`
- [ ] `ListTuEntidad.cs` — Query con paginación + filtros + ordenamiento
- [ ] `TuEntidadController.cs` — 5 endpoints HTTP (GET list, GET detail, POST, PUT, DELETE)
- [ ] Namespace correcto en todos los archivos
- [ ] `GDDBContext` inyectado en Handlers (primary constructor)

---

## Respuesta paginada — estructura JSON

```json
{
  "paginaActual": 1,
  "registrosPorPagina": 10,
  "totalRegistros": 145,
  "totalPaginas": 15,
  "resultado": [
    {
      "idTuEntidad": 1,
      "nombre": "Ejemplo",
      "descripcion": "...",
      "activo": true,
      "fechaRegistro": "2024-01-15T10:30:00"
    }
  ]
}
```

---

## Prompt IA — copia y pega en GitHub Copilot / Cursor / Windsurf

> Copia el bloque de abajo completo y pégalo en el chat de tu asistente de IA.  
> Rellena los campos entre `[CORCHETES]` antes de enviarlo.

```
Eres un desarrollador .NET 8 experto en el patrón CQRS con MediatR, FluentValidation y AutoMapper.

Necesito crear un CRUD completo para la entidad [NOMBRE_ENTIDAD] en el microservicio [NOMBRE_SERVICIO].

CONTEXTO DEL PROYECTO:
- Framework: .NET 8, EF Core, MediatR, FluentValidation, AutoMapper
- Namespace base: ADRES.GD.API.[NOMBRE_SERVICIO]
- DbContext: GDDBContext
- Tabla SQL: [NOMBRE_TABLA] (ej: "EPS", "GIRO_LIMITE")
- Clave primaria: [NOMBRE_COLUMNA_PK] de tipo [long / string / Guid]

CAMPOS DE LA ENTIDAD:
- [CAMPO_1]: tipo [string/long/DateTime/bool], requerido [sí/no], máx [N] chars
- [CAMPO_2]: tipo [...], requerido [...], FK a tabla [OTRA_TABLA] [sí/no]
- [CAMPO_3]: ...

REGLAS DE NEGOCIO:
- [Ej: No puede existir dos registros con el mismo Nombre]
- [Ej: El campo IdRegimen debe existir en CodigoReferenciaNumerico con Activo = true]
- [Ej: Solo se puede eliminar si Activo = true]

GENERA los siguientes 8 archivos siguiendo EXACTAMENTE este patrón:

1. Entities/GD/[NOMBRE_ENTIDAD].cs — Entity con atributos [Table], [Key], [Column], [ForeignKey]
2. Features/[NOMBRE_ENTIDAD]/Commands/Add[NOMBRE_ENTIDAD].cs — Command + Validator + Handler + MapperProfile (sin IMapper en constructor)
3. Features/[NOMBRE_ENTIDAD]/Commands/Update[NOMBRE_ENTIDAD].cs — Command + Validator + Handler + MapperProfile
4. Features/[NOMBRE_ENTIDAD]/Commands/Delete[NOMBRE_ENTIDAD].cs — Command + Handler con BeginTransactionAsync + MapperProfile
5. Features/[NOMBRE_ENTIDAD]/Queries/Detail[NOMBRE_ENTIDAD].cs — Query + Handler con AsNoTracking() y Select manual
6. Features/[NOMBRE_ENTIDAD]/Queries/List[NOMBRE_ENTIDAD].cs — Query con filtros dinámicos, switch ordenamiento, PaginadorGenerico<Result>
7. Features/[NOMBRE_ENTIDAD]/[NOMBRE_ENTIDAD]Controller.cs — 5 endpoints: GET list, GET {id}, POST, PUT, DELETE con [Authorize]
8. Fragmento para agregar al GDDBContext: public virtual DbSet<[NOMBRE_ENTIDAD]> [NOMBRE_ENTIDAD] { get; set; }

PATRONES OBLIGATORIOS:
- Primary constructor en C# 12: public class Handler(GDDBContext db) : IRequestHandler<...>
- AsNoTracking() en todas las Queries
- Transacción en Delete: BeginTransactionAsync / CommitAsync / RollbackAsync
- PaginadorGenerico<Result> con propiedades: PaginaActual, RegistrosPorPagina, TotalRegistros, TotalPaginas, Resultado
- Validación de unicidad en Validator usando _context directo
- Namespace al inicio de cada archivo
- NO uses repositorios — usa GDDBContext directamente
```

---

## Ejemplo de uso del prompt

Si necesitas crear el CRUD de `CondicionPago` rellenas:

```
[NOMBRE_ENTIDAD]     → CondicionPago
[NOMBRE_SERVICIO]    → ALISTAMIENTO
[NOMBRE_TABLA]       → CONDICION_PAGO
[NOMBRE_COLUMNA_PK]  → ID_CONDICION_PAGO  (long)

CAMPOS:
- Nombre: string, requerido, máx 200 chars
- Porcentaje: decimal, requerido, entre 0 y 100
- IdTipoCondicion: long, FK a CODIGO_REFERENCIA_NUMERICO con Activo = true
- Activo: bool, no requerido
- FechaRegistro: DateTime, no requerido

REGLAS:
- No puede existir dos CondicionPago con el mismo Nombre
- IdTipoCondicion debe existir en CodigoReferenciaNumerico con IdCodigoReferenciaDominio = 5 y Activo = true
```

El asistente genera los 8 archivos listos para compilar.
