CLAUDE.md — Brixo Core

Archivo raíz para Claude Code. La documentación completa está en docs/.



Proyecto

Brixo — Sistema de control de inventario simple para pequeños negocios y pymes.

No es un ERP ni sistema contable. Es control de stock: entradas, salidas, historial.



Branch activo: dev | Estado: Backend 100% ✅ — Frontend 100% (Sprint 1-3 + UI Polish) — MVP 100% ✅ (con 9 gaps de deuda técnica documentados)

**UI POLISH COMPLETADO (28 abr)**: CSS Modules bug crítico resuelto (Button/Input sin estilos), Icon.tsx inline SVG, BrixoLogo rediseñado, AppShell/Sidebar con iconos SVG, MetricCard/AlertCard/Badge según spec, variables CSS normalizadas en Modal/BottomSheet/EmptyState.

**SPRINT 3 COMPLETADO (27 abr)**: InventoryPage + MovementModal + ProductModal funcionales con API real. Criterio MVP alcanzado (usuario puede registrar empresa → ver inventario → registrar movimiento).



Stack

Capa	Tecnología

Backend	Python 3.12, FastAPI 0.128+, Pydantic v2, psycopg2, PyJWT RS256

Frontend	React 18, Vite 5, TypeScript 5, TSX

Infra	Docker Compose, PostgreSQL 15, Redis 7-alpine

Auth	JWT RS256, RBAC por permisos (snapshots Redis)

OS dev	Windows — usar PowerShell o Git Bash

Estructura del repositorio

brixo-core/

├── backend/

│   ├── domain/          # Entidades, eventos, contratos — SIN dependencias externas

│   ├── application/     # Casos de uso, event bus, handlers

│   ├── infrastructure/  # BD, Redis, JWT, logging, settings, rutas HTTP

│   ├── adapters/        # Repositorios SQL

│   └── main.py          # Punto de entrada FastAPI

├── frontend/

│   └── src/             # React SPA — Sprint 1-3 completados, MVP funcional

├── infra/

│   ├── docker-compose.yml

│   ├── docker/postgres/init.sql

│   └── env/             # Variables de entorno por servicio (no versionadas)

└── docs/                # Toda la documentación del proyecto

Arquitectura — Hexagonal (Puertos y Adaptadores)

Flujo de dependencias siempre hacia adentro:



Adapters → Application → Domain

&#x20;              ↑

&#x20;        Infrastructure

Capa	Puede importar de

Domain	Nadie

Application	Solo Domain

Infrastructure	Domain + Application

Adapters	Todas las capas

\# ❌ MAL — dominio importa infraestructura

from infrastructure.database import db\_session



\# ✅ BIEN — interfaz en application, implementación en infrastructure

class ProductRepository(ABC):

&#x20;   @abstractmethod

&#x20;   def get\_by\_id(self, product\_id: UUID) -> Product: ...

Convenciones de código

Nombres de funciones — específicos y descriptivos

\# ❌ MAL

def get\_data(): ...

def process(): ...



\# ✅ BIEN

def get\_product\_current\_stock(product\_id: UUID) -> int: ...

def register\_inventory\_entry(product\_id: UUID, quantity: int, actor: Actor) -> InventoryMovement: ...

Casos de uso — siempre clase con execute()

class RegisterInventoryEntryUseCase:

&#x20;   def \_\_init\_\_(self, product\_repo: ProductRepository, event\_bus: EventBus): ...

&#x20;   def execute(self, command: RegisterInventoryEntryCommand) -> InventoryMovement: ...

Entidades de dominio — dataclasses inmutables

@dataclass(frozen=True)

class Product:

&#x20;   id: UUID

&#x20;   tenant\_id: UUID

&#x20;   name: str

&#x20;   current\_stock: int

Routers FastAPI — factory functions

def create\_product\_router(event\_bus: EventBus) -> APIRouter: ...

Comandos frecuentes

\# Levantar todos los servicios

cd infra \&\& docker-compose up -d



\# Ver logs del backend

docker logs -f brixo-backend



\# Verificar que levantó

curl http://localhost:8000/health



\# Acceso directo a la BD

docker exec -it brixo-postgres psql -U brixo\_user -d brixo



\# Swagger UI

start http://localhost:8000/docs



\# Frontend

start http://localhost:3000

Estado actual (28 de abril de 2026)

✅ Backend 100% completo

**Audit profundo de código realizado en sesión 10 (28 abr)**: Identificadas 9 gaps de deuda técnica — 5 en frontend, 4 en backend. Documentadas en `docs/ARQUITECTURA.md` sección "Deuda técnica identificada en audit". MVP está funcional pero hay temas pendientes antes de producción.

Infraestructura Docker (Fase 1):



docker-compose.yml con healthchecks en postgres y redis

Bind mounts con hot reload en backend (uvicorn --reload + watchfiles) y frontend (Vite HMR)

WATCHFILES\_FORCE\_POLLING=1 para Windows Docker

Data Access Layer (Fase 2 — 8 repositorios):



Todos los repositorios con puerto ABC + adaptador SQL real

AuthRepositorySQL, ProductRepositorySQL, InventoryMovementRepositorySQL, AuditLogRepositorySQL, UserRepositorySQL, TenantRepositorySQL, RoleRepositorySQL, AccessRepositorySQL

Casos de uso (Fase 3 — 8 de 8):



SignUpUseCase, LoginUser, CreateProductUseCase, RegisterInventoryMovementUseCase, GetProductStockUseCase, CreateUserUseCase, AssignRoleToUserUseCase, GetAuditLogByTenantUseCase

Controladores y rutas (Fase 4 — 100%):



Todos los endpoints activos: auth (register + login + refresh), products, inventory, users, audit, access, health

Swagger con metadata completa en /docs

Seguridad aplicada (Fase 4B — 100%):



CORS habilitado para localhost:3000

require\_permission(code) — FastAPI dependency que lee snapshot Redis

RBAC activo en todos los endpoints protegidos

POST /api/auth/refresh — renueva token sin re-login

✅ Frontend Sprint 1-3 + UI Polish COMPLETADOS (Fase 5 — 100%)

**Estado real (28 abr — sesión 10)**: 
- ✅ 5 páginas reales que llaman API (Register, Login, Dashboard*, Inventory, 2 modales)
- ✅ Componentes completos: Modal, BottomSheet, EmptyState, Icon, etc.
- ✅ Criterio MVP alcanzado (usuario puede registrar empresa → ver inventario → registrar movimiento)

Stack: React 18 + TypeScript 6.0.3 + Vite 5 + Zustand 5 + React Router DOM 7 + Axios 1.15

Páginas con API funcional (src/pages/):

- RegisterPage.tsx — 4 campos, error 409 inline, llama POST /api/auth/register ✅
- LoginPage.tsx — email + password, error 401 inline, llama POST /api/auth/login ✅  
  ⚠️ Gap detectado: construye user con id:"temp", tenant_id:"temp" (falta GET /users/me)
- DashboardPage.tsx — 4 KPIs, alertas stock, movimientos recientes, datos API real ✅  
  ⚠️ Gap detectado: movimientos recientes simulados con Math.random() (no llama API real)
- InventoryPage.tsx — tabla desktop + cards móvil, búsqueda, filtros, datos API real ✅
- MovementModal.tsx — 3 pasos (ENTRADA/SALIDA/AJUSTE), registra contra API real ✅  
  ⚠️ Gap detectado: isMobile siempre false, BottomSheet nunca se activa
- ProductModal.tsx — crear productos, validación SKU 409, llama API real ✅

Páginas placeholder post-MVP (inline en App.tsx):

/movements, /team, /audit → placeholders sin componentes en src/pages/

Componentes completos con CSS Modules:

Sistema de tokens light/dark (theme/tokens.ts) — índigo como marca
Button, Input, BrixoLogo (geométrico rediseñado 28 abr), Card, MetricCard, Badge, AlertCard, Toast, Skeleton, Icon
Modal, BottomSheet, EmptyState — con CSS vars kebab-case (fix 28 abr)
AppShell responsivo (sidebar 240px desktop + bottom-nav móvil, iconos SVG)
authStore Zustand + interceptor JWT + refresh automático

IMPORTANTE — 9 gaps de deuda técnica identificados en audit (sesión 10, 28 abr):

Documentados completamente en docs/ARQUITECTURA.md sección "Deuda técnica identificada en audit (28 abr)"
MVP está 100% funcional pero hay trabajo pendiente antes de producción.
Impacto: movimientos simulados, user IDs temp, bug de rutas, etc. (ver sección de Deuda técnica)



Flujo de seguridad (activo)

REQUEST

&#x20; │

&#x20; ▼

CORSMiddleware               ← capa exterior — preflight OPTIONS sin auth

&#x20; │

&#x20; ▼

JWTAuthMiddleware            ← valida RS256, inyecta user\_id + tenant\_id

&#x20; │                             publica UserAuthenticated en EventBus

&#x20; ▼

UserAccessProjection         ← escucha UserAuthenticated

&#x20; │                             consulta roles + permisos en BD

&#x20; │                             guarda snapshot en Redis: user\_access:{tenant}:{user}

&#x20; ▼

require\_permission(code)     ← lee snapshot de Redis

&#x20; │                             lanza 403 si el código no está en permissions\[]

&#x20; ▼

Handler / Use Case

&#x20; │

&#x20; ▼

AuditLogRepository           ← persiste cada acción relevante

Reglas no negociables

El dominio nunca importa infraestructura — sin excepciones

Nombres descriptivos — el nombre debe explicar qué hace sin leer el cuerpo

Sin comentarios obvios — solo comentar el WHY cuando no es evidente

Sin sobre-ingeniería — 3 líneas similares > una abstracción prematura

Evaluar antes de implementar — si hay un problema arquitectural, señalarlo primero

Multi-tenant siempre — todo query debe filtrar por tenant\_id

Documentación de referencia

docs/ROADMAP.md — fuente de verdad del avance por fase

docs/ESTATUS.md — estado detallado actual con Docker e infraestructura

docs/CHECKLIST.md — estado de tareas por fase

docs/ARQUITECTURA.md — diagramas de arquitectura y módulos

docs/CHANGELOG.md — historial de cambios desde el inicio

