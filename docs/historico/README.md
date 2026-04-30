# Histórico — Bitácora del agente

Carpeta para registro operativo del trabajo en Brixo.

## Tipos de archivo

### `YYYY-MM-DD_daily.md`

Bitácora scrum diaria. Tres secciones fijas: Hecho · Hoy · Bloqueos.
Si ya existe el archivo del día, se **edita**, no se crea uno nuevo.
Máximo 30 líneas. Bullets ≤ 1 línea.

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

### `YYYY-MM-DD_<slug>.md`

Snapshot por tarea grande (>1h o multi-archivo).
Slug en kebab-case, ≤ 5 palabras. Cuatro secciones:

```markdown
# Snapshot — <título>
**Fecha**: YYYY-MM-DD  **Tarea**: <descripción corta>

## Qué se pidió
## Qué se decidió
## Qué se cambió
## Qué quedó pendiente
```

## No se guarda aquí

- Cambios pequeños sueltos → `daily.md` basta.
- Notas de release o hitos formales → `docs/CHANGELOG.md`.
- Documentación técnica viva → `docs/developer/`.

## Convención

El agente edita esta carpeta solo en estos casos:
- Inicio/cierre de día → `daily.md`.
- Cierre de tarea grande → `<slug>.md`.
- Petición explícita "guarda esto" → `<slug>.md`.
