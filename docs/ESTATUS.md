# 📊 ESTATUS DEL PROYECTO BRIXO - MVP

**Fecha**: 24 de enero de 2026  
**Rama Activa**: dev  
**Versión**: 4.5.0  
**Estado General**: 🟡 **En desarrollo - Arquitectura base lista, implementación pendiente**

---

## 📋 RESUMEN EJECUTIVO

Brixo es un **sistema de control de inventario simple** para pequeños negocios y pymes. El proyecto tiene una **arquitectura bien definida** (hexagonal/ports-adapters) con muchas estructuras de dominio definidas, pero la **implementación funcional es aún incompleta**.

### Objetivos MVP (según README.md)
✅ Gestión de productos  
✅ Registro de movimientos (entradas/salidas)  
✅ Correcciones de stock  
✅ Historial/auditoría  
✅ Dashboard visual  
✅ Alertas básicas de stock bajo  

---

## ✅ QUÉ ESTÁ IMPLEMENTADO

### 1. **Infraestructura Base** 
- ✅ Docker & Docker Compose configurado
- ✅ PostgreSQL 15 (contenedor listo)
- ✅ Redis 7.1.0 (en requirements.txt, NO en docker-compose)
- ✅ FastAPI 0.128.0 (framework)
- ✅ Pydantic 2.12.5 (validación)
- ✅ Variables de entorno configuradas

### 2. **Arquitectura & Estructura de Dominio**
- ✅ Arquitectura hexagonal definida (Domain → Application → Infrastructure → Adapters)
- ✅ Modelos de dominio básicos:
  - `Tenant` (Empresa/Negocio)
  - `User` (Usuario)
  - `AuthorityLevel` (OWNER, ADMIN, MANAGER, OPERATOR)
  - `Role` (Rol de usuario)
  - `Permission` (Permisos)
  - `LogEntry` (Auditoría)
  - `Actor` (Quién realiza acciones)

### 3. **Sistema de Eventos**
- ✅ Event Bus implementado (`application/event_bus.py`)
- ✅ Eventos de dominio definidos:
  - `InventoryChanged` (cambio de stock)
  - `RoleAssigned` (asignación de rol)
  - `RoleRevoked` (revocación de rol)
  - `SaleRegistered` (venta registrada)
  - `UserLoggedIn` (usuario inició sesión)
- ✅ Handlers básicos para eventos
- ✅ Sistema de logging estructurado (JSON)

### 4. **Autenticación (Parcial)**
- ✅ JWT RS256 configurado
- ✅ `AuthService` con método `login()`
- ✅ Middleware OAuth2 (`auth_middleware.py`)
- ✅ Validación de tokens JWT
- ✅ Integración con Redis para sesiones

### 5. **Base de Datos**
- ✅ PostgreSQL 15 en Docker
- ✅ Script SQL inicial (`init.sql`) con tabla de productos
- ✅ Estructura preparada para múltiples tablas (tenant, user, role, etc.)

### 6. **Logging**
- ✅ Sistema de logging estructurado en JSON
- ✅ Logger centralizado (`infrastructure/logging.py`)
- ✅ Soporte para JSON logs en producción

---

## ❌ QUÉ FALTA PARA EL MVP

### 🔴 **CRÍTICO - Sin esto, el MVP no funciona**

#### 1. **FastAPI App NO está levantada**
- `backend/main.py` está vacío (solo espera DB)
- No hay `FastAPI()` app instanciada
- No hay rutas definidas (`@app.get()`, `@app.post()`)
- **Impacto**: El backend **NO inicia correctamente**

**Necesario**:
```python
# backend/main.py debe tener:
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.infrastructure.web.middleware.auth_middleware import oauth2_scheme

app = FastAPI(title="Brixo API", version="4.5.0")
# Agregar middlewares
# Agregar rutas
```

#### 2. **Rutas API Completamente Ausentes**
No existen endpoints para:
- ❌ Crear/listar/actualizar productos
- ❌ Registrar movimientos de inventario
- ❌ Login de usuarios
- ❌ Gestión de roles
- ❌ Historial/auditoría
- ❌ Dashboard

**Necesario**: 
- Crear `backend/adapters/` con controladores REST
- Implementar DTOs para peticiones/respuestas
- Endpoints siguiendo estructura REST

#### 3. **Base de Datos Incompleta**
- ✅ Tabla `products` existe
- ❌ Tabla `tenants` - NO existe
- ❌ Tabla `users` - NO existe  
- ❌ Tabla `roles` - NO existe
- ❌ Tabla `user_roles` - NO existe
- ❌ Tabla `audit_logs` / `log_entries` - NO existe
- ❌ Tabla `inventory_movements` - NO existe
- ❌ Tabla `permissions` - NO existe

**Necesario**: Script SQL completo en `infra/docker/postgres/init.sql`

#### 4. **Repositorios/Data Access Layer - NO existen**
- ❌ Repositorio de productos
- ❌ Repositorio de usuarios
- ❌ Repositorio de movimientos
- ❌ Repositorio de logs
- ❌ Repositorio de roles

**Necesario**: 
- Implementar interfaces de repositorio (puertos)
- Implementar repositorios con PostgreSQL (adaptadores)

#### 5. **Casos de Uso Vacíos**
- ❌ `use_cases/asssign_role.py` - VACÍO
- ❌ Caso de uso: Crear producto
- ❌ Caso de uso: Registrar entrada/salida
- ❌ Caso de uso: Obtener stock
- ❌ Caso de uso: Registrar usuario

**Necesario**: Implementar lógica de negocio en cada caso de uso

#### 6. **Mappers - NO implementados**
- `backend/mappers/` existe pero está vacío
- Se necesitan mappers Domain ↔ DTO

#### 7. **Redis NO está en Docker Compose**
- Redis está en `requirements.txt`
- **NO aparece en `docker-compose.yml`**
- Se necesita agregar servicio Redis

#### 8. **Frontend NO tiene componentes**
- `frontend/src/App.jsx` - VACÍO
- `frontend/src/main.jsx` - VACÍO
- No hay formularios, dashboard, listados
- Package.json existe pero sin componentes

---

### 🟡 **IMPORTANTE - Mejorar antes de MVP**

#### 1. **Error: `Tenat` en lugar de `Tenant`**
En `backend/domain/contracts.py`:
```python
class Tenat:  # ❌ Typo - debería ser "Tenant"
```

#### 2. **Use Cases Incompletos**
- `aut_service.py` tiene método `login()` pero no maneja usuarios inexistentes
- No hay validación de credenciales
- No hay casos de uso para:
  - Crear usuario
  - Registrar producto
  - Registrar movimiento

#### 3. **Falta configuración de CORS**
- No hay CORS middleware en FastAPI
- Frontend en puerto 3000 no puede hablar con backend en 8000

#### 4. **Falta configuración de settings completa**
- `settings.py` parcial
- No está cargando correctamente las variables de entorno
- Falta Base de datos connection string

#### 5. **Event Bus no integrado**
- Event Bus existe pero no se instancia en la aplicación
- No hay subscription de handlers al iniciar

---

## 🎯 PLAN PARA ALCANZAR MVP (Orden sugerido)

### **Fase 1: Infraestructura y BD (2-3 horas)**
- [ ] 1. Agregar Redis a `docker-compose.yml`
- [ ] 2. Completar script SQL con todas las tablas:
  - tenants
  - users
  - roles
  - user_roles
  - products
  - inventory_movements
  - audit_logs
  - permissions
- [ ] 3. Arreglar typo: `Tenat` → `Tenant`
- [ ] 4. Completar `settings.py` con database connection

### **Fase 2: Data Access Layer (2 horas)**
- [ ] 5. Implementar repositorios en `adapters/`:
  - ProductRepository
  - UserRepository
  - TenantRepository
  - RoleRepository
  - AuditLogRepository
  - InventoryMovementRepository

### **Fase 3: Casos de Uso (2-3 horas)**
- [ ] 6. Implementar casos de uso:
  - CreateProduct
  - RegisterMovement (entrada/salida)
  - GetProductStock
  - AssignRole (completar)
  - CreateUser
  - CreateTenant

### **Fase 4: API REST (3-4 horas)**
- [ ] 7. Crear controladores en `adapters/`:
  - ProductController
  - InventoryController
  - AuthController
  - UserController
  - RoleController
  - AuditController
- [ ] 8. Implementar endpoints:
  - POST `/api/auth/login`
  - POST `/api/products` (crear)
  - GET `/api/products` (listar)
  - POST `/api/inventory/movement` (registrar)
  - GET `/api/inventory/stock/{productId}`
  - GET `/api/audit/logs`
  - POST `/api/users/{userId}/roles` (asignar rol)

### **Fase 5: Integración (2 horas)**
- [ ] 9. Completar `main.py`:
  - Instanciar FastAPI app
  - Registrar middlewares (CORS, Auth, Logging)
  - Registrar rutas de controladores
  - Instanciar y conectar Event Bus
  - Subscribir handlers a eventos
- [ ] 10. Agregar CORS middleware
- [ ] 11. Conectar Event Bus al lifecycle

### **Fase 6: Frontend Mínimo (2-3 horas)**
- [ ] 12. Crear componentes básicos:
  - LoginForm
  - ProductList
  - ProductForm
  - MovementForm
  - Dashboard simple
  - AuditLog viewer

### **Fase 7: Testing e Integración (1-2 horas)**
- [ ] 13. Testeo manual de flujo completo:
  - Docker compose up
  - Login
  - Crear producto
  - Registrar movimiento
  - Ver stock
  - Ver auditoría

---

## 📊 TABLA DE PRIORIDADES

| Item | Criticidad | Complejidad | Tiempo Est. | Estado |
|------|-----------|-----------|----------|--------|
| FastAPI app en main.py | 🔴 Crítico | Bajo | 30 min | ❌ |
| Script SQL completo | 🔴 Crítico | Bajo | 1 hora | ❌ |
| Repositorios | 🔴 Crítico | Medio | 2 horas | ❌ |
| Controladores/Rutas | 🔴 Crítico | Medio | 3 horas | ❌ |
| Casos de uso | 🔴 Crítico | Medio | 2 horas | ❌ |
| Redis en docker-compose | 🟡 Importante | Bajo | 15 min | ❌ |
| CORS middleware | 🟡 Importante | Bajo | 15 min | ❌ |
| Event Bus integration | 🟡 Importante | Bajo | 30 min | ❌ |
| Frontend componentes | 🟡 Importante | Alto | 3 horas | ❌ |
| Testeo e2e | 🟡 Importante | Medio | 1 hora | ❌ |

---

## 📈 ESTIMACIÓN TOTAL

**Horas para MVP funcional**: 16-20 horas  
**Equipo recomendado**: 1-2 desarrolladores (backend + frontend)  
**Timeline**: 2-3 días de desarrollo intenso

---

## ⚠️ RIESGOS IDENTIFICADOS

1. **Base de datos sin tablas**: El MVP no funciona sin las tablas principales
2. **FastAPI no levantada**: Sin esto, no hay servidor
3. **Frontend vacío**: Los usuarios no pueden interactuar
4. **Redis faltante en Docker**: Las sesiones pueden no persistir correctamente
5. **Typo en dominio**: `Tenat` confundirá a desarrolladores

---

## ✨ FORTALEZAS DEL PROYECTO

- ✅ Arquitectura bien pensada (hexagonal)
- ✅ Event sourcing desde el inicio
- ✅ Logging estructurado
- ✅ Autenticación JWT con RS256
- ✅ RBAC (Role-Based Access Control) definido
- ✅ Docker ya configurado
- ✅ Estructura clara de carpetas

---

## 🎓 PRÓXIMOS PASOS DESPUÉS DEL MVP

1. Tests unitarios (pytest)
2. Tests de integración
3. CI/CD (GitHub Actions)
4. Reportes y análisis de inventario
5. Importación/exportación CSV
6. Alertas automáticas de stock bajo
7. API docs mejorada (Swagger/ReDoc)

---

## 📝 NOTAS IMPORTANTES

- **No modificar principios del MVP**: El proyecto está muy claro en no ser un ERP
- **Control primero**: Todo debe enfocarse en dar control real del stock
- **Simplicidad es la meta**: Si requiere explicación, está mal diseñado
- **Auditoría completa**: Cada cambio debe ser traceable

---

**Documento generado**: 24 de enero de 2026  
**Próxima revisión recomendada**: Después de completar Fase 1
