# CLAUDE.md — Brixo Core

## 1. Identidad del proyecto

**Brixo** — control de stock para pymes (entradas, salidas, ajustes, historial).
**No es** un ERP ni sistema contable.
**Branch activo**: `dev` | **Estado**: MVP 100% ✅ — Fase 6 (QA + Hardening) 0% ⭕ — 9 gaps de deuda técnica documentados en `docs/backlog.md`.

---

## 2. Al iniciar sesión, lee SIEMPRE en este orden

1. `docs/ESTATUS.md` — estado actual + % avance
2. `docs/ROADMAP.md` — qué falta por fase
3. `docs/backlog.md` — tareas sueltas pendientes
4. `docs/historico/YYYY-MM-DD_daily.md` del día (si existe)

Si el usuario pide algo, valida que esté en backlog o roadmap. Si no está, agrégalo antes de empezar.

---

## 3. Al cerrar una tarea

1. Si tarea grande (>1h o multi-archivo): crea snapshot en `docs/historico/YYYY-MM-DD_<slug>.md`.
2. Actualiza `docs/ESTATUS.md` (% + fecha + gaps abiertos). Cross-check con `docs/ROADMAP.md` antes de cambiar %.
3. Edita `docs/historico/YYYY-MM-DD_daily.md`: secciones Hecho · Hoy · Bloqueos. Si existe el archivo del día, edítalo.
4. Si la tarea no estaba en backlog, agrégala antes de marcar done.
5. Pregunta al usuario: "¿Deseas hacer commit de estos cambios?"
6. Si responde sí: commit descriptivo + entrada en `docs/CHANGELOG.md` (append-only).

---

## 4. Reglas no negociables

1. El dominio nunca importa infraestructura — sin excepciones.
2. Multi-tenant siempre — todo query SQL filtra por `tenant_id`.
3. Nombres descriptivos — el nombre debe explicar qué hace sin leer el cuerpo.
4. Sin sobre-ingeniería — 3 líneas similares > una abstracción prematura.
5. Sin comentarios obvios — solo el WHY cuando no es evidente.
6. Evaluar antes de implementar — señalar problemas arquitecturales primero.
7. Respuestas cortas y específicas — sin relleno.
8. No inventar — verificar archivo/código antes de afirmar. Si no se sabe, decirlo.
9. No tocar `developer/*` salvo cambio arquitectural real (nuevo patrón, cambio de stack).
10. Optimizar tokens — Grep antes que Read amplio; leer secciones puntuales antes que archivos enteros.

---

## 5. Stack y arquitectura — resumen

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.12, FastAPI, Pydantic v2, psycopg2, PyJWT RS256 |
| Frontend | React 18, Vite 5, TypeScript 5, Zustand 5, React Router 7 |
| Infra | Docker Compose, PostgreSQL 15, Redis 7 |
| Auth | JWT RS256, RBAC por permisos (snapshots Redis) |

**Hexagonal — dependencias siempre hacia adentro**:
```
Adapters → Application → Domain
               ↑
         Infrastructure
```

| Capa | Puede importar de |
|------|-------------------|
| Domain | Nadie |
| Application | Solo Domain |
| Infrastructure | Domain + Application |
| Adapters | Todas las capas |

---

## 6. Para cada tarea, usa la mejor skill

| # | Cuando la tarea es... | Usa | Por qué |
|---|---|---|---|
| 1 | Diseñar feature nueva (>1h, decisiones abiertas) | `/brainstorming` | clarifica antes de codear |
| 2 | Buscar función/símbolo/string en el repo | `Grep` (directo) | sin subagente innecesario |
| 3 | Investigación amplia (3+ búsquedas, multi-archivo) | subagente `Explore` | aísla resultados grandes |
| 4 | Diseñar refactor o arquitectura | subagente `Plan` | plan paso a paso |
| 5 | Revisar PR completo antes de merge | `/ultrareview` | review multi-agente en cloud |
| 6 | Limpiar/simplificar código existente | subagente `code-simplifier` | preserva funcionalidad |
| 7 | Sintaxis FastAPI / Pydantic / React / Vite | MCP **context7** | docs actuales, no de entrenamiento |
| 8 | Duda sobre Claude Code (hooks, slash, settings) | subagente `claude-code-guide` | especializado en Claude Code |
| 9 | Configurar statusline (tokens en pantalla) | subagente `statusline-setup` | dedicado a esa configuración |
| 10 | Tareas repetitivas hasta condición | `/loop` | itera con auto-pacing |
| 11 | Programar trabajo futuro / cron | `/schedule` | agente background |
| 12 | Contexto > 80% lleno | proponer `/compact` | preserva continuidad |

Si la tarea cae en 2+ filas, prefiere la fila más alta. Si ninguna aplica, usa herramientas directas (Read, Edit, Grep, Bash) — no spawnear subagente sin razón. Detalle de cada skill: `docs/developer/SKILLS.md`.

---

## 7. Cada archivo se toca solo cuando aplica

| Archivo | Cuándo se toca | Qué cambia |
|---|---|---|
| `docs/ESTATUS.md` | Cierre de tarea grande · cierre de sesión | % avance, fecha, gaps abiertos |
| `docs/ROADMAP.md` | Solo cambio estructural (fase/sprint) | Plan macro — **no** por tareas individuales |
| `docs/backlog.md` | Nuevo gap · tarea cerrada · tarea no listada | Items con prioridad y estimado |
| `docs/historico/YYYY-MM-DD_daily.md` | Inicio y cierre de cada día activo | Hecho · Hoy · Bloqueos. Si existe, edita |
| `docs/historico/YYYY-MM-DD_<slug>.md` | Cierre de tarea grande (>1h o multi-archivo) | Pedido · decidido · cambiado · pendiente |
| `docs/CHANGELOG.md` | Cada commit que el usuario confirme | Append-only: fecha · resumen · archivos clave |

**Cross-check obligatorio**: antes de actualizar % en ESTATUS, lee la fase actual en ROADMAP y confirma consistencia. Si hay desfase, pregunta al usuario.

---

## 8. Estructura de docs/

```
docs/
├── ESTATUS.md          — % avance actual + gaps abiertos
├── ROADMAP.md          — plan macro por fase/sprint
├── backlog.md          — tareas pendientes (deuda + fase 6 + post-MVP + ideas)
├── CHANGELOG.md        — historial formal (append-only)
├── developer/          — referencia técnica profunda (no tocar en flujo normal)
│   ├── INDEX.md
│   ├── 1-PROYECTO.md … 7-OBSERVABILIDAD.md
│   └── SKILLS.md       — detalle del skill mapping (cuándo NO usar, ejemplos)
├── historico/          — bitácora del agente (daily + snapshots)
│   └── README.md
└── specs/              — design docs y planes antes de implementar
```

---

## 9. Comandos frecuentes

```bash
cd infra && docker-compose up -d        # levantar servicios
docker logs -f brixo-backend            # logs backend
curl http://localhost:8000/health        # verificar
docker exec -it brixo-postgres psql -U brixo_user -d brixo  # BD
start http://localhost:8000/docs         # Swagger
start http://localhost:3000              # Frontend
```

---

## 10. Punteros a detalle

- Arquitectura completa + patrones de código: `docs/developer/5-ARQUITECTURA.md`
- Skills con anti-patrones y ejemplos: `docs/developer/SKILLS.md`
- Formato de bitácora diaria y snapshots: `docs/historico/README.md`
