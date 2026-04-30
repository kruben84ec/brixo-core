# CLAUDE.md — Brixo Core
# Versión: 3.0
# Última actualización: 2026-04-30
# Tipo: Orquestador + Memoria + Dashboard Ejecutivo

---

# 🔷 RESUMEN EJECUTIVO (AUTO-ACTUALIZADO)

## Estado actual
- Fase: Fase 6 — QA + Hardening
- % avance: MVP 100% ✅ · Fase 6 ~25% · Suites de tests agregadas · 18 fallos pendientes
- Estado general: Riesgo (tests fallando, no commiteable)

## Prioridades activas
1. **[Bloqueante]** Corregir 14 fallos backend — Mock.__name__ (11), UUID version (1), bcrypt 72b (1), handler count (1)
2. **[Bloqueante]** Corregir 4 fallos frontend — require() ESM (2), Card onClick query (1), Input password role (1)
3. **[Media]** DashboardPage: conectar movimientos reales via `GET /api/products/{id}/movements` — 30 min

## Riesgos clave
- Suites de tests con 18 fallos — QA rechazó merge hasta 0 fallos
- `TEST_SUMMARY.md` y `FRONTEND_TEST_SUMMARY.md` usan sintaxis Python (`"""`) en archivos .md
- TTL JWT inconsistente: 480 min en `settings.py` vs 15 min en `jwt.env`

## Último avance relevante
- 2026-04-30 (sesión 13): suites de tests agregadas — 185+ backend (pytest) + 73+ frontend (Vitest). QA ejecutado: 103/117 backend ✅, 68/71 frontend ✅. 18 fallos identificados y clasificados.

## Siguiente objetivo
- Corregir los 18 fallos de tests → QA re-valida → commit de la suite completa

---

## 1. Identidad del proyecto

Brixo — control de stock para pymes  
Entradas · Salidas · Ajustes · Historial  

No es ERP ni sistema contable.

---

## 2. Protocolo de inicio (OBLIGATORIO)

Leer:

- docs/ESTATUS.md
- docs/ROADMAP.md
- docs/backlog.md
- docs/historico/YYYY-MM-DD_daily.md

Luego:

1. Actualizar RESUMEN EJECUTIVO
2. Identificar top 3 prioridades
3. Detectar bloqueos

Preguntar:
👉 ¿Qué deseas hacer ahora?

---

## 3. Orquestación multi-agente

Agentes en /agentes:

- PO → valor
- Arquitecto → diseño
- Dev → implementación
- QA → calidad

---

### Reglas

- SOLO CLAUDE.md lee docs/
- Los agentes NO leen archivos
- Claude pasa contexto resumido

---

### Flujo

- Quick fix → Dev → QA  
- Feature → PO → Dev → QA  
- Cambio estructural → PO → Arquitecto → Dev → QA  

QA obligatorio antes de commit

---

## 4. Evaluación antes de ejecutar

Siempre:

### Evaluación
- Impacto:
- Riesgo:
- Alineación:

### Decisión
- Proceder
- Ajustar
- Rechazar

---

## 5. Reglas no negociables

- Domain no importa infraestructura  
- Multi-tenant obligatorio  
- Sin sobre-ingeniería  
- Nombres descriptivos  
- No inventar  
- Evaluar antes de implementar  

---

## 6. Arquitectura

Adapters → Application → Domain  
               ↑  
        Infrastructure  

---

## 7. Backlog (control real)

Si tarea NO está:

Evaluar:

- ¿Aporta valor?
- ¿Es necesaria ahora?
- ¿Está alineada?

Solo agregar si cumple.

---

## 8. Daily inteligente

### Hecho
### Hoy (máx 3)
### Bloqueos

---

## 9. Trazabilidad multi-agente

Registrar en:

docs/historico/YYYY-MM-DD_multi-agent.md

Formato:

### [Agente]
- Acción:
- Resultado:
- Impacto:
- Tokens: bajo/medio/alto

---

## 10. Calidad y testing

Si no hay tests:

→ agregar tarea en backlog

---

## 11. Commit controlado

Si:
- QA aprobado
- Tests pasan

Entonces:

Generar:

feat(scope): descripción

- Qué
- Por qué
- Impacto

---

## 12. Mejora continua

Claude.md se actualiza si:

- Hay fricción
- Hay errores
- Se detectan mejoras

Proceso:

1. Detectar problema  
2. Proponer mejora  
3. Validar impacto  
4. Aplicar  

---

## 13. Eficiencia

- Ir al punto  
- No redundancia  
- No sobre-procesar  

---