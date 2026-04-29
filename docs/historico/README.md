# Histórico de Documentación — Brixo Core

## 📅 Estado al 29 de Abril de 2026

Extracción completa de todas las secciones del CLAUDE.md documentadas por fecha.

## 📋 Índice de Secciones

### 1️⃣ [Proyecto](2026-04-29_Proyecto.md)
Descripción general de Brixo, estado del MVP y hitos recientes.
- Estado del backend, frontend y MVP
- UI Polish completado
- Sprint 3 completado

### 2️⃣ [Stack Tecnológico](2026-04-29_Stack.md)
Tecnologías utilizadas en cada capa del proyecto.
- Backend: Python 3.12, FastAPI, Pydantic v2
- Frontend: React 18, Vite, TypeScript
- Infraestructura: Docker Compose, PostgreSQL, Redis

### 3️⃣ [Estructura del Repositorio](2026-04-29_Estructura-repositorio.md)
Organización completa de directorios y archivos.
- Estructura de carpetas brixo-core
- Descripción de cada capa
- Ubicación de componentes clave

### 4️⃣ [Arquitectura](2026-04-29_Arquitectura.md)
Patrón Hexagonal - Puertos y Adaptadores.
- Flujo de dependencias
- Matriz de permisos de importación
- Ejemplos de buenas y malas prácticas

### 5️⃣ [Convenciones de Código](2026-04-29_Convenciones-codigo.md)
Normas y patrones de desarrollo del proyecto.
- Nombres de funciones específicos
- Estructura de casos de uso
- Dataclasses inmutables
- Routers como factory functions

### 6️⃣ [Comandos Frecuentes](2026-04-29_Comandos-frecuentes.md)
Comandos Docker y utilidades para desarrollo.
- Levantar servicios
- Ver logs
- Acceso a base de datos
- URLs de desarrollo

### 7️⃣ [Estado Actual](2026-04-29_Estado-actual.md)
Descripción detallada del estado en sesión 10 (28 abr).
- Backend 100% completado
- Frontend Sprint 1-3 + UI Polish completados
- Páginas con API funcional
- Componentes completados
- 9 gaps de deuda técnica identificados

### 8️⃣ [Flujo de Seguridad](2026-04-29_Flujo-seguridad.md)
Arquitectura de autenticación y autorización.
- Diagrama de flujo completo
- Componentes clave (CORS, JWT, RBAC)
- Almacenamiento en Redis
- Auditoría

### 9️⃣ [Reglas No Negociables](2026-04-29_Reglas-no-negociables.md)
Principios arquitecturales fundamentales del proyecto.
- Dominio nunca importa infraestructura
- Nombres descriptivos
- Sin sobre-ingeniería
- Evaluación previa antes de implementar
- Multi-tenant siempre

### 🔟 [Documentación de Referencia](2026-04-29_Documentacion-referencia.md)
Mapeo a documentos externos y cómo usarlos.
- Links a ROADMAP, ESTATUS, CHECKLIST, ARQUITECTURA, CHANGELOG
- Guía de cómo usar cada documento
- Referencias a deuda técnica

---

## 🎯 Cómo Usar Este Histórico

Cada archivo contiene una sección completa del CLAUDE.md con:
- Fecha del estado (2026-04-29)
- Contenido estructurado y limpio
- Referencias cruzadas cuando es relevante
- Ejemplos de código

## 📌 Deuda Técnica Identificada

**9 gaps documentados** (5 frontend, 4 backend):
- Ubicación: `docs/ARQUITECTURA.md`
- Sección: "Deuda técnica identificada en audit (28 abr)"

Ver [Estado-actual.md](2026-04-29_Estado-actual.md) para detalles.

## 🔄 Próximas Actualizaciones

Este histórico se actualiza con cada estado significativo del proyecto.
La próxima actualización debería incluir el progreso en los gaps de deuda técnica.
