# Documentación para Desarrolladores — Brixo Core

**Última actualización**: 29 de abril de 2026  
**Estado MVP**: 100% ✅ (Backend 100%, Frontend 100% funcional, 9 gaps de deuda técnica documentados)

## 📚 Índice de Lectura Recomendado

Lee los documentos en este orden para entender el proyecto completo:

### 1️⃣ **[PROYECTO.md](1-PROYECTO.md)** — Visión y Contexto
Qué es Brixo, para quién es, criterio MVP, stack tecnológico.
- ⏱️ Lectura: 5 min
- 🎯 Para: Todos (entendimiento general)

### 2️⃣ **[ROADMAP.md](2-ROADMAP.md)** — Plan de Fases y Hitos
Fases completadas, fase actual, timeline, criterios de éxito.
- ⏱️ Lectura: 10 min
- 🎯 Para: Planificación, seguimiento de progreso

### 3️⃣ **[ESTATUS.md](3-ESTATUS.md)** — Estado Técnico Actual
Detalle de backend, frontend, componentes, estado real del código.
- ⏱️ Lectura: 15 min
- 🎯 Para: Engineers (entender qué existe, qué falta)

### 4️⃣ **[CHECKLIST.md](4-CHECKLIST.md)** — Tareas por Fase
Tabla de tareas completadas vs pendientes, criterios MVP.
- ⏱️ Lectura: 10 min
- 🎯 Para: Seguimiento, planning, priorización

### 5️⃣ **[ARQUITECTURA.md](5-ARQUITECTURA.md)** — Diseño Técnico
Hexagonal architecture, flujos de dependencias, componentes clave.
- ⏱️ Lectura: 15 min
- 🎯 Para: Backend engineers, arquitectos

### 6️⃣ **[DISEÑO.md](6-DISEÑO.md)** — Sistema de Diseño Visual
Tokens, colores, tipografía, componentes, responsive, logo.
- ⏱️ Lectura: 20 min
- 🎯 Para: Frontend engineers, designers, UX

### 7️⃣ **[OBSERVABILIDAD.md](7-OBSERVABILIDAD.md)** — Logging y Monitoreo
Logger JSON, middleware HTTP, exception handlers, troubleshooting.
- ⏱️ Lectura: 10 min
- 🎯 Para: DevOps, troubleshooting

### 8️⃣ **[CHANGELOG.md](8-CHANGELOG.md)** — Historial de Cambios
Qué se hizo, cuándo, por qué (orden cronológico descendente).
- ⏱️ Lectura: Consultivo
- 🎯 Para: Context histórico, detective work

---

## 🚀 Comienza aquí según tu rol

| Tu rol | Comienza por | Luego lee |
|--------|--------------|-----------|
| **Product Manager** | 1. PROYECTO → 2. ROADMAP → 3. ESTATUS | 4. CHECKLIST |
| **Backend Engineer** | 5. ARQUITECTURA → 3. ESTATUS | 1. PROYECTO (contexto) |
| **Frontend Engineer** | 6. DISEÑO → 3. ESTATUS → 2. ROADMAP | 5. ARQUITECTURA |
| **DevOps/Infra** | 7. OBSERVABILIDAD → 5. ARQUITECTURA | 3. ESTATUS |
| **QA/Tester** | 4. CHECKLIST → 3. ESTATUS → 2. ROADMAP | 8. CHANGELOG |
| **Nuevo en el proyecto** | LEE EN ORDEN (1→8) | Referencia: `/docs/historico/` |

---

## 📊 Estado Rápido

```
FASE 1   Infraestructura          ██████████  100%   ✅
FASE 2   Data Access Layer        ██████████  100%   ✅
FASE 3   Casos de Uso             ██████████  100%   ✅
FASE 4   Controladores / Rutas    ██████████  100%   ✅
FASE 4B  Seguridad Aplicada       ██████████  100%   ✅
FASE 4C  Observabilidad           ██████████  100%   ✅
FASE 4D  SaaS Auth + Bugs         ██████████  100%   ✅
FASE 5   Frontend MVP             ██████████  100%   ✅ (Sprint 1-3 + UI Polish)
FASE 6   QA + Hardening           ░░░░░░░░░░    0%   ⭕ (9 gaps de deuda técnica)
────────────────────────────────────────────────────
MVP TOTAL                         ██████████  100%   ✅
```

---

## ⚠️ Deuda Técnica Identificada

**9 gaps** documentados (5 frontend, 4 backend) requieren resolución antes de producción.  
Ver detalles en:
- [ESTATUS.md — Deuda técnica identificada en audit](3-ESTATUS.md#deuda-técnica-identificada-en-audit-28-abr-sesión-10)
- [ARQUITECTURA.md — Deuda técnica identificada en audit](5-ARQUITECTURA.md#deuda-técnica-identificada-en-audit-28-abr-2026)

---

## 🛠️ Comandos Rápidos

```bash
# Levantar servicios
cd infra && docker-compose up -d

# Ver logs
docker logs -f brixo-backend        # Backend real-time
tail -f backend/logs/app.log        # Archivo de log

# Verificar salud
curl http://localhost:8000/health
curl http://localhost:3000

# Acceder a BD
docker exec -it brixo-postgres psql -U brixo_user -d brixo

# Swagger UI
open http://localhost:8000/docs
```

---

## 📁 Estructura de Referencia

```
docs/developer/  ← Estás aquí
├── INDEX.md                  ← Este archivo
├── 1-PROYECTO.md             ← Visión y contexto
├── 2-ROADMAP.md              ← Plan de fases
├── 3-ESTATUS.md              ← Estado actual detallado
├── 4-CHECKLIST.md            ← Tareas por fase
├── 5-ARQUITECTURA.md         ← Diseño técnico
├── 6-DISEÑO.md               ← Sistema de diseño
├── 7-OBSERVABILIDAD.md       ← Logging y monitoreo
├── 8-CHANGELOG.md            ← Historial de cambios
└── README.md                 ← Guía rápida

docs/historico/  ← Snapshots por fecha
├── 2026-04-29_Proyecto.md
├── 2026-04-29_Stack.md
├── ...
└── README.md

docs/  ← Raíz (CLAUDE.md, archivos originales)
```

---

## ✅ Cómo Usar Esta Documentación

1. **Nuevo en Brixo**: Lee ÍNDICE → PROYECTO → ROADMAP → ESTATUS (30 min total)
2. **Implementar feature**: Lee DISEÑO y ARQUITECTURA según el dominio
3. **Debuggear bug**: Consulta ESTATUS (deuda técnica), CHANGELOG (qué cambió), OBSERVABILIDAD (cómo loguear)
4. **Planning sprint**: ROADMAP + CHECKLIST + ESTATUS
5. **Deploy/Infra**: OBSERVABILIDAD + ESTATUS (Docker, env vars)

---

**Preguntas frecuentes**: Consulta [ESTATUS.md](3-ESTATUS.md) (busca por "Cómo", "Dónde", "Cuál")  
**Problemas técnicos**: Consulta [CHANGELOG.md](8-CHANGELOG.md) (sesiones similares)  
**Reglas del proyecto**: Consulta [PROYECTO.md](1-PROYECTO.md#reglas-no-negociables)

---

*Documentación generada: 29 de abril de 2026*  
*Estado: MVP 100% funcional con 9 gaps de deuda técnica identificados*  
*Siguiente revisión: Al completar Fase 6 (QA + Hardening)*
