# Snapshot — Reorganización de docs/ y CLAUDE.md
**Fecha**: 2026-04-29  **Tarea**: Reorganizar docs/ + reescribir CLAUDE.md como memoria operativa del agente

## Qué se pidió

Ejecutar el plan diseñado en `docs/specs/2026-04-29-claude-md-memoria-agente-plan.md`: reorganizar `docs/`, eliminar duplicados, y reescribir `CLAUDE.md` raíz para que funcione como memoria operativa del agente con skill mapping, protocolos de inicio/cierre, y estructura limpia.

## Qué se decidió

- Estilo C híbrido para CLAUDE.md: núcleo imperativo + tablas densas.
- Skill mapping D-lite: 12 filas en CLAUDE.md, detalle en `docs/developer/SKILLS.md`.
- Bitácora dual: daily scrum + snapshot por tarea grande en `historico/`.
- Commit es opt-in del usuario, nunca por iniciativa del agente.
- Pre-flight obligatorio antes de eliminar: comparar todos los duplicados vs `developer/` para detectar contenido huérfano.

## Qué se cambió

**Creados**:
- `CLAUDE.md` raíz reescrito (145 líneas, 10 secciones, tabla skills 12 filas, tabla protocolo 6 filas)
- `docs/backlog.md` (22 items: 9 deuda + 7 Fase 6 + 6 post-MVP + 3 ideas)
- `docs/developer/SKILLS.md` (detalle de las 12 skills + MCPs no usados en Brixo)
- `docs/historico/README.md` reescrito (formato daily + snapshot)

**Movidos**:
- `docs/AUDIT_27_ABRIL_2026.md` → `docs/historico/2026-04-27_audit-codigo.md` (con `git mv`)

**Eliminados** (git rm):
- 6 duplicados de `docs/` raíz: ARQUITECTURA, CHECKLIST, CLAUDE, DISEÑO_BRIXO, DesignFronted, OBSERVABILIDAD
- 10 extractos obsoletos de `docs/historico/2026-04-29_*.md`

**Actualizado**:
- `docs/ESTATUS.md`: encabezado con % avance global añadido al inicio

## Qué quedó pendiente

- Configurar la statusline (muestra tokens en pantalla) — tarea aparte vía subagente `statusline-setup`.
- Resolver los 9 gaps de deuda técnica — documentados en `docs/backlog.md`.
- Commit de estos cambios — pendiente de aprobación del usuario.
