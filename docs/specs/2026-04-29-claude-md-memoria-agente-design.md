# Spec — CLAUDE.md como memoria del agente + reorganización de `docs/`

**Fecha**: 2026-04-29
**Estado**: Diseño aprobado, pendiente de implementación
**Autor**: Sesión brainstorming con el usuario

---

## 1. Contexto y problema

`docs/` raíz tiene 11 archivos de los cuales 6 son duplicados de `docs/developer/`, 1 es legacy del 19 abr, y 1 es un CLAUDE.md duplicado del CLAUDE.md raíz. La carpeta `historico/` contiene 10 extractos congelados del CLAUDE.md viejo (no son conversaciones reales). El `CLAUDE.md` raíz actual está desactualizado (dice MVP 78%, Sprint 1-2, abril 23) cuando el estado real es MVP 100% con Sprint 1-3 + UI Polish completados.

**Lo que se quiere lograr**:

1. **CLAUDE.md raíz** que funcione como memoria operativa del agente: identidad, reglas, mapeo de skills por tarea, protocolos de actualización.
2. **Token-eficiente**: CLAUDE.md se carga en cada turno, cada línea cuesta. Estructura en tablas densas, detalle en archivos referenciados.
3. **Bitácora del agente** estilo scrum diaria + snapshots de tareas grandes en `historico/`.
4. **Una sola fuente de verdad** por dimensión: `ESTATUS.md` (% avance ahora), `ROADMAP.md` (qué falta por fase), `backlog.md` (tareas sueltas), `CHANGELOG.md` (formal, append-only).
5. **`docs/` limpio**: eliminar duplicados, conservar los 4 esenciales en raíz + `developer/` (referencia técnica) + `historico/` (bitácora).

---

## 2. Decisiones tomadas (con razón)

| # | Decisión | Razón |
|---|---|---|
| 1 | **Estilo C híbrido** para CLAUDE.md (núcleo imperativo + tablas) | Lo crítico (inicio/cierre de sesión, reglas) en imperativo claro; lo referencial (skills, protocolos) en tablas densas. Combina seguridad y eficiencia |
| 2 | **Skill mapping D-lite**: 12 filas en CLAUDE.md, detalle en `developer/SKILLS.md` | El agente piensa por tarea, no por familia de skill. 12 filas es el tope antes de que el costo cognitivo y de tokens supere al beneficio |
| 3 | **Tokens visibles vía statusline**, no introspección | El agente no puede consultar su propio consumo. Statusline (configurable con `statusline-setup`) da visibilidad continua al usuario |
| 4 | **Bitácora dual**: daily scrum + snapshot por tarea grande | Daily mantiene contexto de continuidad ("qué se hizo, qué sigue, bloqueos"); snapshot preserva decisiones no obvias para sesiones futuras |
| 5 | **`developer/` no se toca en flujo normal** | Es referencia técnica profunda. Solo cambia si la arquitectura real cambia. Evita "actualizar docs por actualizar" |
| 6 | **Commit es siempre opt-in del usuario** | El agente nunca hace commit por iniciativa. Pregunta al cerrar tarea. Si el usuario aprueba, commit + entrada en CHANGELOG |

---

## 3. Estructura final de `docs/`

```
brixo-core/
├── CLAUDE.md                       NUEVO — memoria del agente (~150 líneas)
└── docs/
    ├── ESTATUS.md                  conservado, encabezado actualizado
    ├── ROADMAP.md                  conservado tal cual
    ├── backlog.md                  NUEVO — todas las tareas pendientes
    ├── CHANGELOG.md                conservado, entrada nueva al cerrar tarea
    ├── developer/                  intacto (8 archivos + SKILLS.md nuevo)
    │   ├── INDEX.md
    │   ├── 1-PROYECTO.md
    │   ├── 2-ROADMAP.md
    │   ├── 3-ESTATUS.md
    │   ├── 4-CHECKLIST.md
    │   ├── 5-ARQUITECTURA.md
    │   ├── 6-DISEÑO.md
    │   ├── 7-OBSERVABILIDAD.md
    │   └── SKILLS.md               NUEVO — detalle del skill mapping
    └── historico/
        ├── README.md               REESCRITO — explica formato (daily + snapshot)
        ├── 2026-04-27_audit-codigo.md   movido desde docs/AUDIT_27_ABRIL_2026.md
        └── (futuros) YYYY-MM-DD_daily.md y YYYY-MM-DD_<slug>.md
```

---

## 4. Diseño del nuevo `CLAUDE.md` raíz

### 4.1 Outline (10 secciones)

```markdown
# CLAUDE.md — Brixo Core

## 1. Identidad del proyecto                  [~5 líneas]
   Brixo · control de stock · NO ERP/contable · branch dev · MVP 100%

## 2. Protocolo de inicio de sesión           [imperativo, ~6 líneas]
## 3. Protocolo de cierre de tarea            [imperativo, ~10 líneas]
## 4. Reglas no negociables                   [bullets, ~10 líneas]
## 5. Stack y arquitectura — resumen          [tabla compacta + diagrama]
## 6. Mapeo de skills (D-lite)                [TABLA, 12 filas]
## 7. Protocolo por archivo                   [TABLA, 6 filas]
## 8. Estructura de docs/                     [árbol, ~12 líneas]
## 9. Comandos frecuentes                     [bash, ~8 líneas]
## 10. Punteros a detalle                     [3 líneas]
```

### 4.2 Sección 2 — Protocolo de inicio de sesión

```markdown
## 2. Al iniciar sesión, lee SIEMPRE en este orden:

1. `docs/ESTATUS.md` — estado actual + % avance
2. `docs/ROADMAP.md` — qué falta por fase
3. `docs/backlog.md` — tareas sueltas pendientes
4. `docs/historico/YYYY-MM-DD_daily.md` (si existe — bitácora del día)

Si el usuario pide algo, valida primero que la tarea esté en backlog o roadmap.
Si no está, agrégala a backlog antes de empezar.
```

### 4.3 Sección 3 — Protocolo de cierre de tarea

```markdown
## 3. Al cerrar una tarea:

1. Estima tokens consumidos (basado en archivos leídos × ratio).
2. Si tarea grande (>1h o multi-archivo): crea snapshot en
   `docs/historico/YYYY-MM-DD_<slug>.md`.
3. Actualiza `docs/ESTATUS.md` (% + fecha + gaps abiertos).
4. Cross-check con `docs/ROADMAP.md` antes de cambiar %.
5. Edita `docs/historico/YYYY-MM-DD_daily.md`: secciones Hecho · Hoy · Bloqueos.
6. Si la tarea no estaba en backlog, agrégala antes de marcar done.
7. Pregunta al usuario: "¿Deseas hacer commit de estos cambios?"
8. Si responde sí:
   - Genera commit con mensaje descriptivo (sigue convención del repo).
   - Actualiza `docs/CHANGELOG.md` con entrada nueva (fecha · resumen · archivos clave).
```

### 4.4 Sección 4 — Reglas no negociables

```markdown
## 4. Reglas no negociables

1. El dominio nunca importa infraestructura — sin excepciones.
2. Multi-tenant siempre — todo query SQL filtra por `tenant_id`.
3. Nombres descriptivos — el nombre debe explicar qué hace sin leer el cuerpo.
4. Sin sobre-ingeniería — 3 líneas similares > una abstracción prematura.
5. Sin comentarios obvios — solo el WHY cuando no es evidente.
6. Evaluar antes de implementar — si hay un problema arquitectural, señalarlo primero.
7. Respuestas cortas y específicas — sin relleno.
8. No inventar — verificar archivo/código antes de afirmar; si no se sabe, decirlo.
9. Resúmenes cuando se piden — no documento completo, solo lo pedido.
10. Optimizar tokens sin sacrificar calidad — preferir Grep antes que Read amplio,
    leer secciones puntuales antes que archivos enteros.
```

### 4.5 Sección 6 — Mapeo de skills (D-lite, 12 filas)

```markdown
## 6. Para cada tarea, usa la mejor skill

| # | Cuando la tarea es...                                | Usa                          | Por qué                                  |
|---|------------------------------------------------------|------------------------------|------------------------------------------|
| 1 | Diseñar feature nueva (>1h, decisiones abiertas)     | `/brainstorming`             | obliga a clarificar antes de codear      |
| 2 | Buscar dónde se usa función/símbolo/string           | `Grep` (directo)             | sin contaminar contexto principal        |
| 3 | Investigación amplia (3+ búsquedas, multi-archivo)   | subagente `Explore`          | aísla resultados grandes                 |
| 4 | Diseñar refactor o arquitectura                      | subagente `Plan`             | entrega plan paso a paso                 |
| 5 | Revisar PR completo antes de merge                   | `/ultrareview`               | review multi-agente en cloud             |
| 6 | Limpiar/simplificar código existente                 | subagente `code-simplifier`  | preserva funcionalidad                   |
| 7 | Sintaxis FastAPI / Pydantic / React / Vite / libs    | MCP **context7**             | docs actuales, no del entrenamiento      |
| 8 | Duda sobre Claude Code (hooks, slash, settings)      | subagente `claude-code-guide`| especializado en Claude Code             |
| 9 | Configurar statusline (ver tokens en pantalla)       | subagente `statusline-setup` | dedicado a esa configuración             |
|10 | Tareas repetitivas hasta condición                   | `/loop`                      | itera con auto-pacing                    |
|11 | Programar trabajo futuro / cron                      | `/schedule`                  | agente background                        |
|12 | Contexto > 80% lleno                                 | proponer `/compact`          | preserva continuidad                     |

**Reglas que acompañan la tabla**:
- Si la tarea cae en 2+ filas, prefiere la fila más alta.
- Si ninguna fila aplica, **no spawnear subagente** — usa herramientas directas (Read, Edit, Grep, Bash).
- Detalle de cada skill (cuándo NO usarla, ejemplos): `docs/developer/SKILLS.md`.
```

### 4.6 Sección 7 — Protocolo por archivo

```markdown
## 7. Cada archivo se toca solo cuando aplica

| Archivo                              | Cuándo se toca                            | Qué cambia                                                  |
|--------------------------------------|-------------------------------------------|-------------------------------------------------------------|
| `docs/ESTATUS.md`                    | Cierre de tarea grande · cierre de sesión | % avance, fecha, gaps abiertos                              |
| `docs/ROADMAP.md`                    | Solo cambio estructural (fase/sprint)     | Plan macro. **No se toca por tareas individuales**          |
| `docs/backlog.md`                    | Nuevo gap · tarea cerrada · tarea no listada | Items con prioridad y estimado                           |
| `docs/historico/YYYY-MM-DD_daily.md` | Inicio y cierre de cada día activo        | Hecho · Hoy · Bloqueos. Si existe, edita                    |
| `docs/historico/YYYY-MM-DD_<slug>.md`| Cierre de tarea grande (>1h o multi-archivo) | Pedido · decidido · cambiado · pendiente                |
| `docs/CHANGELOG.md`                  | **Cada commit que el usuario confirme**   | Append-only: fecha · resumen · archivos clave               |

**Reglas transversales**:
- Cross-check obligatorio: antes de actualizar % en ESTATUS, lee la fase actual en ROADMAP
  y confirma que el nuevo % es consistente con qué sprints/fases están marcados completos.
  Si hay desfase (ej. ESTATUS dice 95% pero ROADMAP solo tiene 80% de fases cerradas), pregunta al usuario.
- backlog antes de implementar: si la tarea no está, agrégala primero.
- No tocar `developer/*` salvo cambio arquitectural real (nuevo patrón, cambio de stack).
```

### 4.7 Secciones 1, 5, 8, 9, 10 (resúmenes)

- **Sección 1** (Identidad): nombre, propósito, lo que **no** es, branch, estado MVP.
- **Sección 5** (Stack y arquitectura): tabla de stack (4 filas) + diagrama hexagonal en 5 líneas + matriz de importación de capas.
- **Sección 8** (Estructura docs/): árbol de la estructura final.
- **Sección 9** (Comandos): docker-compose up, logs, swagger, frontend, BD.
- **Sección 10** (Punteros): `developer/INDEX.md`, `developer/SKILLS.md`, `historico/README.md`.

---

## 5. Formatos de archivo

### 5.1 `docs/backlog.md`

Items por categoría (Deuda técnica · Fase 6 · Post-MVP · Ideas), formato:

```markdown
- [ ] **prioridad** — título — archivo afectado — estimado
```

Categorías iniciales con datos reales del audit del 28 abr:

- **Deuda técnica** (9 items): 5 frontend (Dashboard movimientos simulados, GET /users/me post-login, bug rutas privadas, isMobile en MovementModal, páginas reales /movements /team /audit) + 4 backend (handler UserCreated, endpoints create_role/revoke_role, JWT TTL inconsistente, /me/access path).
- **Fase 6** (7 items): testing manual, rate limiting, TTL Redis, headers seguridad, request_id, docker-compose.prod.yml, fix bugs QA.
- **Post-MVP** (6 items): Landing, Audit, Team, useAccess, WCAG, ErrorBoundary.
- **Ideas**: barcode móvil, export CSV, multi-idioma.

Sección "Completadas recientes" mantiene últimas 5; las anteriores se purgan al CHANGELOG.

### 5.2 `docs/historico/YYYY-MM-DD_daily.md` (formato scrum estricto, ≤ 30 líneas)

```markdown
# Daily — YYYY-MM-DD

## Hecho ayer / sesión anterior
- (bullets ≤ 1 línea)

## Hoy / esta sesión
- (bullets ≤ 1 línea)

## Bloqueos
- (Si no hay: escribir explícitamente "Ninguno". No omitir.)

---
*Actualizado: YYYY-MM-DD HH:MM*
```

Si ya existe el archivo del día, **se edita**, no se crea nuevo.

### 5.3 `docs/historico/YYYY-MM-DD_<slug>.md` (snapshot tarea grande)

```markdown
# Snapshot — <título>
**Fecha**: YYYY-MM-DD  **Tarea**: <descripción corta>

## Qué se pidió
## Qué se decidió
## Qué se cambió
## Qué quedó pendiente
```

Slug: kebab-case ≤ 5 palabras. Ej: `reorganizacion-docs`, `fix-bug-rutas-privadas`.

### 5.4 `docs/CHANGELOG.md` — entrada al confirmar commit

```markdown
## YYYY-MM-DD — <título de la tarea>

**Tipo**: refactor · docs · feature · fix · ...

**Cambios**:
- <bullet 1>
- <bullet 2>

**Commit**: `<hash>` — "<mensaje del commit>"
```

---

## 6. Plan de limpieza de archivos

### 6.1 Eliminar (8 entradas)

| Archivo | Razón |
|---|---|
| `docs/CLAUDE.md` | Duplicado del `CLAUDE.md` raíz |
| `docs/ARQUITECTURA.md` | En `developer/5-ARQUITECTURA.md` |
| `docs/CHECKLIST.md` | En `developer/4-CHECKLIST.md` |
| `docs/DISEÑO_BRIXO.md` | En `developer/6-DISEÑO.md` |
| `docs/OBSERVABILIDAD.md` | En `developer/7-OBSERVABILIDAD.md` |
| `docs/DesignFronted.md` | Legacy del 19 abr, absorbido en DISEÑO |
| `docs/historico/2026-04-29_*.md` (10 archivos) | Extractos congelados del CLAUDE.md viejo |
| `docs/historico/README.md` | Se reescribe |

### 6.2 Mover (1 archivo)

| Origen | Destino |
|---|---|
| `docs/AUDIT_27_ABRIL_2026.md` | `docs/historico/2026-04-27_audit-codigo.md` |

### 6.3 Conservar y actualizar (3 archivos)

| Archivo | Acción |
|---|---|
| `docs/ESTATUS.md` | Conservar. Agregar línea "% avance global" arriba |
| `docs/ROADMAP.md` | Conservar tal cual |
| `docs/CHANGELOG.md` | Agregar entrada inicial: "2026-04-29 — Reorganización docs" |

### 6.4 Crear (4 archivos nuevos)

| Archivo | Contenido |
|---|---|
| `CLAUDE.md` (raíz) | Reescribir completo según outline de 10 secciones |
| `docs/backlog.md` | 22 items iniciales (9 deuda + 7 fase 6 + 6 post-MVP) |
| `docs/developer/SKILLS.md` | Detalle del skill mapping (cuándo NO usar cada skill, ejemplos) |
| `docs/historico/README.md` | Explica formato daily + snapshot. No lista archivos |

### 6.5 Conservar intacto (8 archivos)

`docs/developer/{INDEX, 1-PROYECTO, 2-ROADMAP, 3-ESTATUS, 4-CHECKLIST, 5-ARQUITECTURA, 6-DISEÑO, 7-OBSERVABILIDAD}.md`

### 6.6 Validaciones previas

Antes de eliminar cualquier archivo:

1. **Verificar** que los 6 duplicados a eliminar no tienen contenido único que no esté en `developer/`. Si encuentro alguna sección huérfana, la migro antes de borrar.
2. **Validar** que `CHANGELOG.md` actual no tenga duplicación con `historico/`. Si la hay, dejar CHANGELOG como fuente formal.

---

## 7. Visibilidad de tokens

El agente no puede introspeccionar su propio consumo. Las tres tácticas combinadas:

- **A) Statusline persistente**: configurar con subagente `statusline-setup` para que muestre tokens consumidos / restantes en pantalla.
- **B) Estimación al cerrar tarea**: el agente reporta "esta tarea consumió aprox N tokens (basado en archivos leídos × ratio)". Aproximado.
- **C) Respeto al aviso de contexto**: cuando Claude Code avisa contexto >80%, el agente propone `/compact` antes de continuar.

Las tres se reflejan en CLAUDE.md sección 3 (paso 1 del cierre de tarea) y en regla no negociable #10.

---

## 8. Criterios de éxito

- [ ] `CLAUDE.md` raíz reescrito, ≤ 180 líneas, 10 secciones según outline 4.1.
- [ ] `docs/` raíz contiene exactamente 4 archivos: ESTATUS, ROADMAP, backlog, CHANGELOG.
- [ ] `docs/developer/` intacto + SKILLS.md nuevo (9 archivos).
- [ ] `docs/historico/` contiene README reescrito + audit movido (2 archivos iniciales).
- [ ] `docs/specs/` contiene este spec (1 archivo).
- [ ] `docs/backlog.md` tiene 22 items iniciales con prioridad, archivo y estimado.
- [ ] Ningún contenido único se perdió (validación 6.6.1 ejecutada).
- [ ] El agente, leyendo solo `CLAUDE.md`, sabe: identidad, qué leer al inicio, qué tocar al cierre, qué skill usar para qué tarea, dónde está el detalle.

---

## 9. Fuera de alcance

Esto NO entra en este spec:

- Configuración real de la statusline (es una tarea aparte tras aprobar este spec).
- Resolver los 9 gaps de deuda técnica (van al backlog, se resuelven después).
- Implementar la Fase 6 (QA + Hardening) — sigue siendo parte del roadmap normal.
- Cambios a `developer/*` — esos archivos ya están organizados, no se tocan aquí.
- Migrar a otra herramienta de docs (Notion, GitBook) — fuera de discusión.

---

## 10. Próximos pasos tras aprobar este spec

1. Usuario revisa este spec y aprueba o pide cambios.
2. Tras aprobación, invocar `writing-plans` para generar plan de implementación detallado paso a paso.
3. Ejecutar el plan: validaciones previas → eliminar duplicados → mover audit → crear archivos nuevos → reescribir CLAUDE.md.
4. Al cerrar la tarea: preguntar al usuario si quiere commit + actualizar CHANGELOG.

---

**Fin del spec.**
