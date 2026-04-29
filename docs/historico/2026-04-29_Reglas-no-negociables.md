# Reglas No Negociables — 2026-04-29

## 1. El Dominio Nunca Importa Infraestructura

**Sin excepciones.**

El dominio (domain/) debe ser completamente independiente de cualquier detalle técnico como bases de datos, frameworks, HTTP, etc.

## 2. Nombres Descriptivos

El nombre debe explicar qué hace sin necesidad de leer el cuerpo de la función.

- ❌ `get_data()`, `process()`, `handle()`
- ✅ `get_product_current_stock()`, `register_inventory_entry()`

## 3. Sin Comentarios Obvios

- ❌ `# obtener el usuario` encima de `user = get_user(id)`
- ✅ Comentarios solo para el **WHY** cuando no es evidente
- El código bien escrito es autodocumentado

## 4. Sin Sobre-Ingeniería

- Tres líneas similares es mejor que una abstracción prematura
- No diseñar para hipotéticos futuros
- La simplicidad es un feature

## 5. Evaluar Antes de Implementar

Si hay un problema arquitectural o de diseño, señalarlo **primero** antes de codificar.

Mejor pausar, discutir y alinear que reparar código mal diseñado después.

## 6. Multi-Tenant Siempre

Todo query, comando y evento debe filtrar/considerar `tenant_id`.

El aislamiento de datos entre tenants es crítico y no es negociable.

---

## Síntesis

**Arquitectura limpia, nombres claros, decisiones validadas, datos seguros.**
