# Plan de implementación — CLAUDE.md como memoria del agente

**Spec asociado**: [`2026-04-29-claude-md-memoria-agente-design.md`](2026-04-29-claude-md-memoria-agente-design.md)
**Fecha**: 2026-04-29
**Tiempo estimado**: 60-90 minutos
**Reversibilidad**: alta hasta antes del commit final (todo en working tree)

---

## Orden de ejecución

```
A. Pre-flight: validar que no se pierde contenido
B. Crear archivos nuevos (CLAUDE.md raíz, backlog, SKILLS, historico/README)
C. Mover audit a historico
D. Eliminar duplicados (solo después de validación A)
E. Actualizar ESTATUS.md (encabezado de % avance)
F. Verificación final
G. Commit opt-in + CHANGELOG (si usuario aprueba)
```

**Razón del orden**: crear antes de eliminar minimiza ventana donde pueda faltar información. Validación previa garantiza que no se pierde nada.

---

## A. Pre-flight: validar que no se pierde contenido

**Objetivo**: confirmar que los 6 archivos a eliminar no contienen secciones huérfanas que no estén ya en `developer/`.

**Pasos**:

1. **Comparar `docs/ARQUITECTURA.md` vs `docs/developer/5-ARQUITECTURA.md`**:
   - Leer ambos completos.
   - Listar secciones de cada uno (encabezados `##` y `###`).
   - Confirmar que toda sección de la versión raíz aparece en developer/. Si falta alguna, capturar el contenido para migrar.

2. **Comparar `docs/CHECKLIST.md` vs `docs/developer/4-CHECKLIST.md`** — mismo procedimiento.

3. **Comparar `docs/DISEÑO_BRIXO.md` vs `docs/developer/6-DISEÑO.md`** — mismo procedimiento.

4. **Comparar `docs/OBSERVABILIDAD.md` vs `docs/developer/7-OBSERVABILIDAD.md`** — mismo procedimiento.

5. **Revisar `docs/DesignFronted.md`** (legacy del 19 abr):
   - Confirmar que su contenido está absorbido en `developer/6-DISEÑO.md`.
   - Si no, capturar las secciones únicas para anexar a 6-DISEÑO.md antes de eliminar.

6. **Revisar `docs/CLAUDE.md`** (duplicado del root):
   - Comparar contra el `CLAUDE.md` raíz actual.
   - Es duplicado funcional, pero validar que no haya divergencias relevantes.

**Criterio de éxito**: todas las secciones de los 6 archivos a eliminar tienen equivalente en `developer/` (o se migran antes).

**Si falla**: detener el plan, migrar contenido huérfano a `developer/`, reanudar.

---

## B. Crear archivos nuevos

### B.1 — `CLAUDE.md` (raíz del proyecto)

**Acción**: reescribir completo según outline del spec sección 4.1.

**Estructura** (10 secciones):

```markdown
# CLAUDE.md — Brixo Core

## 1. Identidad
## 2. Al iniciar sesión, lee SIEMPRE en este orden
## 3. Al cerrar una tarea
## 4. Reglas no negociables
## 5. Stack y arquitectura — resumen
## 6. Para cada tarea, usa la mejor skill
## 7. Cada archivo se toca solo cuando aplica
## 8. Estructura de docs/
## 9. Comandos frecuentes
## 10. Punteros a detalle
```

**Contenido específico**: copiar de las secciones 4.2 a 4.7 del spec. Tabla de skills (12 filas) en sección 6, tabla de protocolo (6 filas) en sección 7, reglas no negociables (10 items) en sección 4.

**Validación**: tamaño final entre 130 y 180 líneas. Si pasa de 200, refactorizar (mover detalle a SKILLS.md).

### B.2 — `docs/backlog.md`

**Acción**: crear con 22 items iniciales según formato del spec sección 5.1.

**Categorías**:

- **Deuda técnica** (9 items, copiar del audit del 28 abr):
  - 5 frontend: DashboardPage movimientos simulados, GET /users/me post-login, bug rutas privadas hidratación async, isMobile en MovementModal, páginas reales /movements /team /audit.
  - 4 backend: handler UserCreated, endpoints create_role/revoke_role, JWT TTL inconsistente (480 vs 15 min), /me/access path consistencia.
- **Fase 6** (7 items): testing manual, rate limiting login, validar TTL Redis + token, headers seguridad HTTP, request_id middleware, docker-compose.prod.yml, fix bugs QA.
- **Post-MVP** (6 items): LandingPage, AuditPage, TeamPage, useAccess (vistas por rol), WCAG 2.1 AA, ErrorBoundary + build optimizado.
- **Ideas**: barcode móvil, export CSV/Excel, multi-idioma.

**Formato por item**: `[ ] **prioridad** — título — archivo afectado — estimado`.

**Sección final**: "Completadas recientes" con 5 entradas placeholder de Sprint 3 + UI Polish.

### B.3 — `docs/developer/SKILLS.md`

**Acción**: crear con detalle del skill mapping (que CLAUDE.md no contiene para no inflar).

**Contenido**:

- Para cada una de las 12 skills de la tabla:
  - Nombre y tipo (slash command / subagente / MCP).
  - **Cuándo usarla** (1-2 oraciones).
  - **Cuándo NO usarla** (anti-patrón típico).
  - **Ejemplo concreto** en Brixo (cuando aplica).

- Sección "Decisiones del agente":
  - "Si tarea cae en 2+ filas → fila más alta gana".
  - "Si ninguna fila aplica → herramientas directas, no subagente".
  - "Subagente cuesta tokens; usar solo si justifica el costo".

- Sección "MCPs no usados en Brixo" (corta, para evitar que el agente los pruebe):
  - firebase, cloudflare, gmail, calendar, drive, notion, microsoft365 → no aplican al stack actual.

### B.4 — `docs/historico/README.md`

**Acción**: reescribir (eliminar el actual del 29 abr, crear nuevo).

**Contenido**:

```markdown
# Histórico — Bitácora del agente

Carpeta para registro operativo del trabajo en Brixo.

## Tipos de archivo

### `YYYY-MM-DD_daily.md`
Bitácora scrum diaria. Tres secciones fijas: Hecho · Hoy · Bloqueos.
Si ya existe el archivo del día, se EDITA, no se crea uno nuevo.
Máximo 30 líneas. Bullets ≤ 1 línea.

### `YYYY-MM-DD_<slug>.md`
Snapshot por tarea grande (>1h o multi-archivo).
Cuatro secciones: Qué se pidió · Qué se decidió · Qué se cambió · Qué quedó pendiente.
Slug en kebab-case, ≤ 5 palabras.

## No se guarda aquí

- Cambios pequeños sueltos → daily basta.
- Notas de release o hitos formales → `docs/CHANGELOG.md`.
- Documentación técnica viva → `docs/developer/`.

## Convención

El agente edita esta carpeta solo en estos casos:
- Inicio/cierre de día → `daily.md`.
- Cierre de tarea grande → `<slug>.md`.
- Petición explícita "guarda esto" → `<slug>.md`.
```

---

## C. Mover audit a historico

**Acción**: renombrar `docs/AUDIT_27_ABRIL_2026.md` → `docs/historico/2026-04-27_audit-codigo.md`.

**Comando**: `git mv docs/AUDIT_27_ABRIL_2026.md docs/historico/2026-04-27_audit-codigo.md`

**Razón de `git mv`**: preserva el historial de git para que `git log --follow` siga funcionando.

**Validación**: el archivo aparece en la nueva ruta y desaparece de la antigua. `git status` muestra el rename.

---

## D. Eliminar duplicados

**Acción**: borrar 8 entradas tras la validación A.

**Comandos** (uno por archivo, orden alfabético):

```bash
git rm docs/ARQUITECTURA.md
git rm docs/CHECKLIST.md
git rm docs/CLAUDE.md
git rm docs/DISEÑO_BRIXO.md
git rm docs/DesignFronted.md
git rm docs/OBSERVABILIDAD.md
git rm docs/historico/2026-04-29_*.md       # 10 archivos
git rm docs/historico/README.md              # se reescribe en paso B.4
```

**Razón de `git rm`**: registra la eliminación en git. `rm` simple deja archivos sin trackear.

**Validación post-eliminación**:

```bash
ls docs/                # debe mostrar solo: ESTATUS.md, ROADMAP.md, backlog.md, CHANGELOG.md, developer/, historico/, specs/
ls docs/historico/      # debe mostrar: README.md (nuevo), 2026-04-27_audit-codigo.md
```

---

## E. Actualizar `docs/ESTATUS.md`

**Acción**: agregar encabezado de % avance al inicio del archivo, sin tocar el resto.

**Contenido a insertar tras el título principal**:

```markdown
> **% Avance global**: MVP 100% ✅ — Fase 6 (QA + Hardening) 0% ⭕ — 9 gaps de deuda técnica documentados
> **Última actualización**: 2026-04-29
> **Cross-check**: validado contra `docs/ROADMAP.md` (sin desfase).
```

**Validación**: el resto del archivo queda intacto. Solo se agrega el bloque de cita arriba.

---

## F. Verificación final

Antes de proponer el commit, ejecutar:

1. **Estructura de directorios**:
   ```bash
   tree docs/ -L 2
   ```
   Esperado:
   ```
   docs/
   ├── CHANGELOG.md
   ├── ESTATUS.md
   ├── ROADMAP.md
   ├── backlog.md
   ├── developer/   (9 archivos: 8 originales + SKILLS.md)
   ├── historico/   (2 archivos: README.md + 2026-04-27_audit-codigo.md)
   └── specs/       (2 archivos: design + plan)
   ```

2. **CLAUDE.md raíz**:
   - Tamaño: entre 130 y 180 líneas.
   - Tiene 10 secciones según outline.
   - Tabla de skills tiene exactamente 12 filas.
   - Tabla de protocolo tiene 6 filas.

3. **backlog.md**:
   - 22 items (9 + 7 + 6 = 22).
   - Cada item con `[ ] **prioridad** — título — archivo — estimado`.
   - Cuatro categorías presentes: Deuda · Fase 6 · Post-MVP · Ideas.

4. **Sin contenido perdido**:
   - Cada sección de los archivos eliminados tiene equivalente en `developer/`.
   - El audit movido a histórico es accesible en su nueva ruta.

5. **Lectura simulada del agente**:
   - Abrir CLAUDE.md raíz como si fuera la primera vez.
   - Verificar que se entiende: identidad, qué leer al inicio, qué tocar al cierre, qué skill usar, dónde está el detalle.
   - Si algo no es obvio, ajustar.

---

## G. Commit opt-in + CHANGELOG

**Acción**: preguntar al usuario "¿Deseas hacer commit de estos cambios?".

**Si responde sí**:

1. **Agregar entrada a `docs/CHANGELOG.md`** (al inicio, después del título):

```markdown
## 2026-04-29 — Reorganización de documentación + CLAUDE.md como memoria del agente

**Tipo**: refactor · docs

**Cambios**:
- Reescrito `CLAUDE.md` raíz con estructura de 10 secciones, tabla de skills D-lite (12 filas) y tabla de protocolo por archivo.
- Eliminados 6 duplicados en `docs/` raíz y 11 archivos en `docs/historico/` (extractos del CLAUDE.md viejo).
- Movido `AUDIT_27_ABRIL_2026.md` → `historico/2026-04-27_audit-codigo.md`.
- Creados: `docs/backlog.md` (22 items), `docs/developer/SKILLS.md`, `docs/historico/README.md`.
- Encabezado de `docs/ESTATUS.md` actualizado con % avance global.

**Commit**: `<hash>` — "docs: reorganizar docs/ y CLAUDE.md raíz como memoria operativa del agente"
```

2. **Crear el commit**:

```bash
git add CLAUDE.md docs/
git commit -m "$(cat <<'EOF'
docs: reorganizar docs/ y CLAUDE.md raíz como memoria operativa del agente

- Reescrito CLAUDE.md raíz: 10 secciones, skill mapping D-lite (12 filas),
  protocolo por archivo (6 filas), reglas no negociables actualizadas.
- Eliminados 6 duplicados de docs/ y 11 archivos del historico viejo.
- Movido AUDIT_27_ABRIL_2026.md a historico/ con formato de snapshot.
- Creados backlog.md (22 items), SKILLS.md, historico/README.md, specs/.
- ESTATUS.md: agregado encabezado con % avance global.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
EOF
)"
```

3. **Actualizar el hash en CHANGELOG**: tras el commit, reemplazar `<hash>` con el hash real (`git log -1 --format=%H | head -c 7`).

**Si responde no**: detener. Los cambios quedan en working tree. Sin entrada en CHANGELOG.

---

## H. Cierre — actualizar bitácora

Independiente del commit:

1. **Crear `docs/historico/2026-04-29_reorganizacion-docs.md`** (snapshot de tarea grande):
   - Qué se pidió: reorganizar docs/ + CLAUDE.md como memoria.
   - Qué se decidió: estilo C híbrido + skill mapping D-lite + bitácora dual.
   - Qué se cambió: lista de operaciones (eliminados, creados, movidos, actualizados).
   - Qué quedó pendiente: configurar statusline, primera entrada real en daily.

2. **Crear `docs/historico/2026-04-29_daily.md`** si no existe, o editar si existe:
   - Hecho ayer / sesión anterior: brainstorming del nuevo CLAUDE.md.
   - Hoy / esta sesión: implementación del plan, reorganización completada.
   - Bloqueos: ninguno.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Eliminar contenido único sin migrar | Pre-flight A obliga a comparar antes de borrar |
| CLAUDE.md crece demasiado y come tokens | Validación F.2 con tope de 180 líneas; mover detalle a SKILLS.md |
| Cross-check ESTATUS vs ROADMAP queda desincronizado | Encabezado E menciona "validado contra ROADMAP", forzando la verificación |
| Commit accidental antes de verificar | Paso G es opt-in explícito del usuario |
| Bitácora no se mantiene en futuras sesiones | CLAUDE.md sección 3 lo establece como protocolo de cierre obligatorio |

---

## Criterios de cierre del plan

- [ ] `CLAUDE.md` raíz reescrito y validado (130-180 líneas, 10 secciones).
- [ ] `docs/` raíz contiene solo 4 archivos: ESTATUS, ROADMAP, backlog, CHANGELOG.
- [ ] `docs/developer/` tiene 9 archivos (8 originales + SKILLS.md).
- [ ] `docs/historico/` tiene 2 archivos iniciales (README + audit movido).
- [ ] `docs/specs/` contiene spec + plan (este archivo).
- [ ] Validación F.4 confirma sin pérdida de contenido.
- [ ] Snapshot de tarea creado en historico.
- [ ] Daily de hoy creado/actualizado.
- [ ] Si usuario aprobó commit: CHANGELOG actualizado y commit creado.

---

**Fin del plan.**
