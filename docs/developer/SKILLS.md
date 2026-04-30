# SKILLS — Detalle del mapeo para Brixo

Complemento de la tabla en `CLAUDE.md` sección 6. Para cada skill: cuándo NO usarla y un ejemplo concreto en Brixo.

---

## 1. `/brainstorming`

**Cuándo usarla**: Feature nueva con decisiones abiertas (más de 1h de implementación, incertidumbre de enfoque).
**Cuándo NO**: Para bugs con causa conocida, tareas de 1 archivo, cambios de configuración. No vale el overhead de clarificación si el camino ya es obvio.
**Ejemplo en Brixo**: Diseñar cómo manejar notificaciones push de stock bajo. Muchas opciones (WebSocket, polling, email), vale debatir antes de codear.

---

## 2. `Grep` (directo)

**Cuándo usarla**: Localizar dónde se usa una función, qué archivos importan un módulo, buscar un string concreto.
**Cuándo NO**: Para exploración abierta sin patrón concreto, o cuando necesitas entender contexto amplio — ahí usa subagente Explore.
**Ejemplo en Brixo**: `Grep "require_permission" --type py` para encontrar todos los endpoints protegidos.

---

## 3. Subagente `Explore`

**Cuándo usarla**: Investigación que necesita 3+ búsquedas encadenadas o multi-archivo, sin patrón exacto conocido.
**Cuándo NO**: Si ya sabes el archivo o el símbolo — Grep directo es 10x más rápido y no consume tokens extra.
**Ejemplo en Brixo**: "¿Qué archivos del frontend manejan la lógica de autenticación y cómo se conectan entre sí?"

---

## 4. Subagente `Plan`

**Cuándo usarla**: Refactor multi-archivo, cambio arquitectural, nueva fase del roadmap.
**Cuándo NO**: Para bugfixes puntuales o cambios de 1-2 archivos con ruta clara.
**Ejemplo en Brixo**: Diseñar la implementación de Fase 6 (QA + Hardening) antes de empezar.

---

## 5. `/ultrareview`

**Cuándo usarla**: Antes de merge a `main` de un PR con cambios de seguridad, auth, o multi-archivo.
**Cuándo NO**: Para commits pequeños de docs o config. Costo real en tiempo y tokens.
**Ejemplo en Brixo**: Revisar el PR de "fix bug rutas privadas + GET /users/me" antes de mergear.

---

## 6. Subagente `code-simplifier`

**Cuándo usarla**: Código que funciona pero se volvió complejo (post-iteración rápida).
**Cuándo NO**: Código recién escrito y limpio, o cuando el problema es un bug (simplificar no es debuggear).
**Ejemplo en Brixo**: Después de resolver los 9 gaps de deuda técnica, pasar code-simplifier por los archivos más tocados.

---

## 7. MCP `context7`

**Cuándo usarla**: Sintaxis de cualquier librería del stack (FastAPI, Pydantic v2, React 18, Vite 5, Zustand 5, psycopg2, PyJWT).
**Cuándo NO**: Para conceptos generales de programación, lógica de negocio, o refactors. Los docs de entrenamiento pueden estar desactualizados.
**Ejemplo en Brixo**: "¿Cómo configuro `model_validator` en Pydantic v2?" → `context7` con `pydantic`.

---

## 8. Subagente `claude-code-guide`

**Cuándo usarla**: Preguntas sobre Claude Code (hooks, slash commands, settings.json, MCP servers, keybindings).
**Cuándo NO**: Para preguntas de código del proyecto. Este subagente solo conoce Claude Code, no Brixo.
**Ejemplo en Brixo**: "¿Cómo configuro un hook para que actualice el daily.md al cerrar Claude Code?"

---

## 9. Subagente `statusline-setup`

**Cuándo usarla**: Una vez, para configurar la statusline que muestra tokens consumidos en pantalla.
**Cuándo NO**: Para cualquier otra tarea. Es un subagente de propósito único.

---

## 10. `/loop`

**Cuándo usarla**: Tareas que se repiten hasta que una condición se cumple (polling de estado, iteraciones de QA).
**Cuándo NO**: Para tareas de un solo paso. El overhead de loop no vale para "ejecuta esto una vez".
**Ejemplo en Brixo**: "Sigue corriendo los tests manuales hasta que pasen los 14 criterios MVP."

---

## 11. `/schedule`

**Cuándo usarla**: Trabajo futuro definido ("en 2 semanas abre un PR para limpiar X", "todos los lunes revisa gaps nuevos").
**Cuándo NO**: Para trabajo inmediato o sin fecha clara.
**Ejemplo en Brixo**: Después de mergear la Fase 6, /schedule un agente en 2 semanas para verificar que los gaps están cerrados en producción.

---

## 12. `/compact`

**Cuándo usarla**: Cuando el contexto supera el 80% de capacidad y quedan tareas pendientes en la sesión.
**Cuándo NO**: Al inicio de sesión o cuando el contexto está holgado. Compactar tiene un costo de re-derivación.

---

## Decisiones del agente

- Si la tarea cae en 2+ filas → usa la fila con número más bajo (mayor prioridad).
- Si ninguna fila aplica → herramientas directas (Read, Edit, Grep, Bash). No spawnear subagente sin razón.
- Subagente cuesta tokens adicionales; usarlo solo cuando el beneficio (aislamiento, especialización) justifica el costo.

---

## MCPs no usados en Brixo

Los siguientes MCPs están disponibles en el entorno pero **no aplican al stack actual**. No intentar usarlos para tareas de Brixo:

- `firebase` — Brixo usa PostgreSQL + Redis, no Firebase.
- `cloudflare` — No hay Workers ni D1 en el stack.
- `gmail`, `calendar`, `drive`, `notion`, `microsoft365` — No hay integración con estos servicios.
