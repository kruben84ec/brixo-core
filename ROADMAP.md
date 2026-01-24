# 📈 ROADMAP VISUAL - BRIXO MVP 2026

## 🗓️ GANTT CHART - TIMELINE DEL MVP

```
SEMANA 1 (24-31 ENERO)
┌────────────────────────────────────────────────┐
│ L    │ M    │ X    │ J    │ V    │ S    │ D    │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ BD   │ BD   │ Repos│ Repos│ UseC │ UseC │ UseC │
│ Setup│      │      │      │ ases │      │      │
└────────────────────────────────────────────────┘

SEMANA 2 (31 ENE - 7 FEB)
┌────────────────────────────────────────────────┐
│ L    │ M    │ X    │ J    │ V    │ S    │ D    │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ Ctrl │ Ctrl │ Main │ Front│ Front│ Test │ Test │
│lers │      │      │end   │      │      │      │
└────────────────────────────────────────────────┘

RESULTADO ESPERADO: MVP Funcional listo para QA
```

---

## 🎯 FASES DETALLADAS CON DELIVERABLES

### **FASE 1: INFRAESTRUCTURA (DÍA 1)**

**Entrada**: Código base con arquitectura incompleta  
**Salida**: Backend levanta, BD funcional, Redis conectado

| Tarea | Responsable | Tiempo | Status |
|-------|-----------|--------|--------|
| Agregar Redis a docker-compose | Dev | 15 min | ⭕ |
| Completar script SQL (8 tablas) | Dev | 45 min | ⭕ |
| Arreglar typo Tenat → Tenant | Dev | 10 min | ⭕ |
| Completar settings.py | Dev | 20 min | ⭕ |
| Completar main.py básico | Dev | 30 min | ⭕ |
| Testear docker-compose up | Dev | 20 min | ⭕ |
| **TOTAL FASE 1** | | **2h 20min** | |

**Validación**: `curl http://localhost:8000/health` responde 200 OK

---

### **FASE 2: DATA ACCESS LAYER (DÍA 2)**

**Entrada**: BD funcionando  
**Salida**: Repositorios implementados, CRUD operativo

| Tarea | Responsable | Tiempo | Status |
|-------|-----------|--------|--------|
| Crear interfaz base Repository | Dev | 20 min | ⭕ |
| ProductRepository (CRUD + stock) | Dev | 45 min | ⭕ |
| UserRepository (CRUD) | Dev | 40 min | ⭕ |
| TenantRepository (CRUD) | Dev | 30 min | ⭕ |
| RoleRepository (assign/revoke) | Dev | 35 min | ⭕ |
| AuditLogRepository (write/read) | Dev | 30 min | ⭕ |
| InventoryMovementRepository | Dev | 35 min | ⭕ |
| **TOTAL FASE 2** | | **3h 45min** | |

**Validación**: Tests de repositorios pasan (no incluido en tiempo de desarrollo)

---

### **FASE 3: CASOS DE USO (DÍA 2-3)**

**Entrada**: Repositorios funcionando  
**Salida**: Lógica de negocio implementada

| Tarea | Responsable | Tiempo | Status |
|-------|-----------|--------|--------|
| CreateProductUseCase | Dev | 30 min | ⭕ |
| RegisterMovementUseCase | Dev | 40 min | ⭕ |
| GetProductStockUseCase | Dev | 20 min | ⭕ |
| LoginUseCase (completar) | Dev | 30 min | ⭕ |
| CreateUserUseCase | Dev | 35 min | ⭕ |
| AssignRoleUseCase (completar) | Dev | 30 min | ⭕ |
| GetAuditLogUseCase | Dev | 25 min | ⭕ |
| **TOTAL FASE 3** | | **3h 20min** | |

**Validación**: Casos de uso se ejecutan sin errores

---

### **FASE 4: CONTROLADORES & RUTAS (DÍA 3)**

**Entrada**: Casos de uso funcionando  
**Salida**: API REST completa con endpoints

| Tarea | Responsable | Tiempo | Status |
|-------|-----------|--------|--------|
| Crear DTOs (6 tipos) | Dev | 45 min | ⭕ |
| ProductController (5 rutas) | Dev | 50 min | ⭕ |
| AuthController (3 rutas) | Dev | 40 min | ⭕ |
| InventoryController (4 rutas) | Dev | 50 min | ⭕ |
| UserController (3 rutas) | Dev | 40 min | ⭕ |
| AuditController (2 rutas) | Dev | 30 min | ⭕ |
| Integrar routers en main.py | Dev | 25 min | ⭕ |
| Validaciones y error handling | Dev | 35 min | ⭕ |
| **TOTAL FASE 4** | | **4h 35min** | |

**Validación**: Swagger muestra todos los endpoints, requests/responses funcionan

---

### **FASE 5: FRONTEND BÁSICO (DÍA 4-5)**

**Entrada**: API funcional  
**Salida**: UI para las operaciones MVP

| Tarea | Responsable | Tiempo | Status |
|-------|-----------|--------|--------|
| Setup React + dependencias | FE Dev | 20 min | ⭕ |
| API Service Client | FE Dev | 30 min | ⭕ |
| Zustand store (auth + products) | FE Dev | 30 min | ⭕ |
| LoginPage | FE Dev | 50 min | ⭕ |
| ProductListPage | FE Dev | 60 min | ⭕ |
| ProductFormModal | FE Dev | 40 min | ⭕ |
| MovementFormModal | FE Dev | 50 min | ⭕ |
| DashboardPage | FE Dev | 45 min | ⭕ |
| Routing & Layout | FE Dev | 35 min | ⭕ |
| Estilos básicos (CSS) | FE Dev | 40 min | ⭕ |
| **TOTAL FASE 5** | | **5h 40min** | |

**Validación**: Login funciona, puede ver productos, crear, registrar movimientos

---

### **FASE 6: INTEGRACIÓN & QA (DÍA 5-6)**

**Entrada**: Backend + Frontend implementado  
**Salida**: MVP funcional, listo para producción

| Tarea | Responsable | Tiempo | Status |
|-------|-----------|--------|--------|
| Testing manual (flujo completo) | QA/Dev | 45 min | ⭕ |
| Fixes de bugs encontrados | Dev | 60 min | ⭕ |
| Documentación de API (README) | Dev | 30 min | ⭕ |
| Instructions de deploy | Dev | 20 min | ⭕ |
| Setup CI/CD básico (opcional) | Dev | 45 min | ⭕ |
| **TOTAL FASE 6** | | **2h 40min** | |

**Validación**: Flujo e2e sin errores: Login → Crear Producto → Registrar Movimiento → Ver Auditoría

---

## 📊 TABLA RESUMEN

| Fase | Descripción | Horas | Persona | Inicio | Fin |
|------|-------------|-------|---------|--------|-----|
| 1 | Infraestructura + BD | 2.3 | BE Dev | L24 | L24 pm |
| 2 | Repositorios | 3.75 | BE Dev | M25 | M25 pm |
| 3 | Casos de uso | 3.3 | BE Dev | X26 | X26 pm |
| 4 | Controladores | 4.6 | BE Dev | J27 | V28 am |
| 5 | Frontend | 5.7 | FE Dev | V28 | D30 |
| 6 | QA e Integración | 2.7 | BE+QA | L31 | M1 |
| **TOTAL** | **MVP Completo** | **22.3 hrs** | 2 devs | L24 | M1 FEB |

---

## 🎯 ESTADO DE COMPONENTES

### Antes del MVP (HOY)
```
┌─────────────────────────────┐
│  BRIXO - Estado Inicial     │
├─────────────────────────────┤
│ ✅ Arquitectura diseñada    │
│ ✅ Dominio definido         │
│ ⚠️ BD incompleta            │
│ ❌ Repos no implementados   │
│ ❌ API vacía                │
│ ❌ Frontend vacío           │
│ ❌ Integración incompleta   │
└─────────────────────────────┘
```

### Después del MVP (1-2 semanas)
```
┌─────────────────────────────┐
│  BRIXO - MVP Funcional      │
├─────────────────────────────┤
│ ✅ Backend funcionando      │
│ ✅ BD con todas las tablas  │
│ ✅ Repositorios OK          │
│ ✅ API REST completa        │
│ ✅ Frontend básico funciona │
│ ✅ Autenticación OK         │
│ ✅ Auditoría registrando    │
│ 🟡 Tests pending           │
│ 🟡 Producción ready        │
└─────────────────────────────┘
```

---

## 💼 MATRIZ DE DECISIONES

### SI... ENTONCES...

| Situación | Decisión | Riesgo |
|-----------|----------|--------|
| El BD script falla | Ejecutar manualmente en psql | Datos inconsistentes |
| Redis no conecta | Deshabilitarlo en settings | Sesiones pierden estado |
| Frontend no llama API | Revisar CORS en main.py | Usuario no puede usar app |
| Tests no pasan | Agregar logging al caso de uso | Debug manual (más tiempo) |
| docker-compose falla | Revisar Docker daemon | Perder 1 hora de trabajo |

---

## 🚨 RIESGOS CRÍTICOS

### Riesgo #1: BD Incompleta
- **Probabilidad**: Alta (no está en docker-compose init)
- **Impacto**: Bloquea CRUD
- **Mitigación**: Script SQL robusto en PRIMEROS_PASOS.md

### Riesgo #2: Settings No Carguen Correctamente
- **Probabilidad**: Media (Pydantic es complejo)
- **Impacto**: Backend no levanta
- **Mitigación**: Validar con env var defaults

### Riesgo #3: CORS Bloquea Frontend
- **Probabilidad**: Media (frontend en 3000, backend en 8000)
- **Impacto**: Frontend no puede llamar API
- **Mitigación**: CORS configurado en main.py

### Riesgo #4: JWT Keys No Están Disponibles
- **Probabilidad**: Alta (requiere RSA keys)
- **Impacto**: Login no funciona
- **Mitigación**: Generar keys en settings.py dummy o env vars

### Riesgo #5: Falta Tiempo
- **Probabilidad**: Media (estimaciones pueden ser optimistas)
- **Impacto**: MVP incompleto
- **Mitigación**: Priorizar según checklist, descartar "nice-to-have"

---

## 🎓 CRITERIOS DE ÉXITO

### MVP está LISTO cuando...

- ✅ Backend levanta sin errores: `docker-compose up -d`
- ✅ Endpoints responden en `http://localhost:8000/docs`
- ✅ Login funciona (obtiene token)
- ✅ Crear producto funciona
- ✅ Registrar entrada/salida funciona
- ✅ Ver stock actual funciona
- ✅ Ver historial (auditoría) funciona
- ✅ Frontend carga en `http://localhost:3000`
- ✅ Usuario puede hacer flujo completo sin errores

### MVP NO está listo cuando...

- ❌ Backend no levanta
- ❌ BD vacía o con errores
- ❌ Endpoints devuelven 500
- ❌ Login devuelve token inválido
- ❌ CRUD de productos falla
- ❌ Frontend no carga
- ❌ Frontend no conecta a API

---

## 📈 GROWTH ROADMAP (Post-MVP)

```
MES 1 (Enero-Febrero)
├─ MVP v1.0 funcional
├─ Testing básico
└─ Deploy a staging

MES 2 (Febrero-Marzo)
├─ Tests unit + integración
├─ Reportes PDF/CSV
├─ Alertas de stock bajo
└─ Deploy a producción

MES 3+ (Abril+)
├─ Importación datos masiva
├─ Categorías de productos
├─ Usuarios avanzados
├─ API mobile
└─ Analytics dashboard
```

---

## 📞 PUNTOS DE CONTACTO

**Bloqueado en DB?**
→ Ver `PRIMEROS_PASOS.md` - PASO 2

**Bloqueado en API?**
→ Ver `CHECKLIST.md` - FASE 4

**No entiendo arquitectura?**
→ Ver `ESTATUS.md` - Sección "Arquitectura"

**Qué hacer primero?**
→ Ver `RESUMEN.md` - Sección "Checklist Rápido"

---

## ✨ NOTAS FINALES

1. **El MVP es MÍNIMO pero COMPLETO** → No agregar funcionalidades fuera de scope
2. **Testing puede hacerse después** → Pero necesario antes de producción
3. **Frontend puede ser muy simple** → Enfoque en funcionalidad, no diseño
4. **Documentación es importante** → Para que otros puedan continuar
5. **Timeline es REALISTA** → Asume 1-2 devs trabajando 6-8 horas diarias

---

**Creado**: 24 de enero de 2026  
**Actualizado**: 24 de enero de 2026  
**Próxima revisión**: Después de completar Fase 2
