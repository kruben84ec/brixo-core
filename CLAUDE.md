# CLAUDE.md — Brixo Core
# Versión: 3.0
# Última actualización: 2026-04-30
# Tipo: Orquestador + Memoria + Dashboard Ejecutivo

---

# 🔷 RESUMEN EJECUTIVO (AUTO-ACTUALIZADO)

## Estado actual
- Fase:
- % avance:
- Estado general: (Estable / Riesgo / Bloqueado)

## Prioridades activas
1.
2.
3.

## Riesgos clave
-

## Último avance relevante
-

## Siguiente objetivo
-

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