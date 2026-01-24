# Brixo - Sistema de Control de Inventario

**Brixo — Control simple de tu inventario**

Brixo es una aplicación web enfocada en inventario simple, rápida y entendible para personas que no son contadores ni especialistas en sistemas. Su objetivo es dar **control real** del stock diario sin fricción, sin capacitación y sin complejidad innecesaria.

## 🎯 Propósito

Dar a dueños de pequeños negocios, pymes y contadores una herramienta clara para saber:
- Qué productos tienen
- Qué productos se movieron
- Cuánto stock queda

Toda decisión técnica y funcional debe respetar esta premisa.

---

## 🧠 Filosofía del Producto

Brixo **NO** es:
- Un ERP
- Un sistema contable
- Una plataforma tributaria

Brixo **ES** un **sistema de control de inventario** simple y eficaz.

---

## 🎯 Características Principales

- ✅ **Gestión de Productos**: Control simple del stock de artículos
- ✅ **Registro de Movimientos**: Entradas, salidas y correcciones
- ✅ **Historial Completo**: Auditoría de todos los cambios (quién, cuándo, qué)
- ✅ **Dashboard Visual**: Interfaz intuitiva y clara
- ✅ **Sistema Multi-Tenant**: Soporte para múltiples negocios
- ✅ **Autenticación Segura**: JWT con RS256
- ✅ **Gestión de Roles**: OWNER, ADMIN, MANAGER, OPERATOR
- ✅ **API REST**: Backend robusto con documentación interactiva
- ✅ **Logging Estructurado**: Trazabilidad completa en JSON

---

## 🏗️ Arquitectura Técnica

El proyecto sigue una **arquitectura hexagonal** (puertos y adaptadores) con separación de capas:

```
backend/
├── domain/              # Lógica de negocio pura
│   ├── auth.py         # Eventos de autenticación
│   ├── contracts.py    # Entidades: Tenant, User, Role, Permission
│   ├── events.py       # Eventos de dominio
│   └── logs.py         # Auditoría
├── application/        # Casos de uso y orquestación
│   ├── handlers.py     # Manejadores de eventos
│   ├── event_bus.py    # Bus de eventos (pubsub)
│   ├── auth/           # Servicios de autenticación
│   └── use_cases/      # Casos de uso
├── infrastructure/     # Detalles técnicos
│   ├── logging.py      # Sistema de logs estructurados
│   ├── redis_client.py # Caché y sesiones
│   ├── env/            # Configuración por entorno
│   └── web/            # Middleware
├── adapters/           # Controladores y repositorios
├── mappers/            # Mapeo entre modelos
├── main.py             # Punto de entrada
└── requirements.txt    # Dependencias Python

frontend/
├── src/
│   ├── App.jsx        # Componente principal
│   ├── main.jsx       # Punto de entrada
├── package.json       # Dependencias Node.js
└── vite.config.js     # Configuración Vite

infra/
├── docker-compose.yml # Orquestación de servicios
├── docker/            # Dockerfiles
│   ├── backend/
│   ├── frontend/
│   └── postgres/
└── env/               # Variables de entorno
```

---

## 🔐 Seguridad

- **Autenticación JWT (RS256)**: Tokens con criptografía asimétrica
- **RBAC**: Control de acceso basado en roles (Owner, Admin, Manager, Operator)
- **Middleware de Autenticación**: Protección en rutas críticas
- **Variables de Entorno**: Configuración sensible aislada
- **Gestión de Sesiones**: Mediante Redis

---

## 📦 Stack Tecnológico

### Backend (Python)
- **FastAPI** (0.128.0): Framework web moderno y asincrónico
- **PostgreSQL**: Base de datos relacional
- **Redis** (7.1.0): Caché y almacenamiento de sesiones
- **Pydantic** (2.12.5): Validación de datos
- **PyJWT** (2.10.1): Manejo de tokens JWT
- **psycopg2** (2.9.11): Driver PostgreSQL
- **python-dotenv** (1.2.1): Gestión de variables de entorno

### Frontend (Node.js)
- **React** (18.2.0): Biblioteca de UI
- **Vite** (5.0.0): Build tool ultrarrápido
- **Node.js** (20): Runtime

### Infraestructura
- **Docker** & **Docker Compose**: Contenerización
- **PostgreSQL 15**: Base de datos
- **Redis**: Caché

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Docker y Docker Compose instalados
- Git
- (Opcional) Python 3.11+ y Node.js 20+ para desarrollo local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/kruben84ec/brixo-core.git
cd brixo-core
```

### 2. Iniciar con Docker Compose

```bash
cd infra
docker-compose up -d
```

Esto iniciará automáticamente:
- **PostgreSQL 15** → puerto 5432
- **Backend (FastAPI)** → puerto 8000
- **Frontend (React)** → puerto 3000

### 3. Verificar que Todo Funciona

```bash
# Ver contenedores en ejecución
docker ps

# Ver logs del backend
docker logs -f brixo-backend

# Ver logs del frontend
docker logs -f brixo-frontend
```

### 4. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs (Swagger)
- **ReDoc**: http://localhost:8000/redoc

---

## 🛠️ Desarrollo Local

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp infrastructure/env/backend.env .env

# Ejecutar servidor
python main.py
```

**URL**: http://localhost:8000

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar con hot reload
npm run dev

# Compilar para producción
npm run build

# Ver preview de producción
npm start
```

**URL**: http://localhost:5173 (vite default) o http://localhost:3000 (producción)

---

## 📊 Eventos de Dominio

El sistema usa **Event Sourcing** para registrar cambios importantes:

| Evento | Descripción | Entidad |
|--------|-------------|---------|
| `InventoryChanged` | Se modifica el stock de un producto | PRODUCT |
| `RoleAssigned` | Se asigna un rol a un usuario | USER_ROLE |
| `RoleRevoked` | Se revoca un rol a un usuario | USER_ROLE |
| `SaleRegistered` | Se registra una nueva venta | SALE |
| `UserLoggedIn` | Un usuario inicia sesión | USER |

Estos eventos se procesan mediante handlers y se registran en la tabla de auditoría con timestamp y actor.

---

## 📝 Modelos de Dominio

### Tenant (Empresa/Negocio)
```python
@dataclass(frozen=True)
class Tenant:
    id: UUID
    name: str
    is_active: bool
    created_at: datetime
```

### User (Usuario)
```python
@dataclass(frozen=True)
class User:
    id: UUID
    tenant_id: UUID
    username: str
    email: str
    is_active: bool
    authority_level: AuthorityLevel
```

### Niveles de Autoridad
- **OWNER**: Dueño del negocio (acceso total)
- **ADMIN**: Administrador delegado (gestión total)
- **MANAGER**: Jefe de tienda (gestión parcial)
- **OPERATOR**: Cajero/empleado (operaciones básicas)

### Role (Rol)
```python
@dataclass(frozen=True)
class Role:
    id: UUID
    tenant_id: UUID
    name: str
```

---

## 🔧 Configuración

### Archivos de Entorno

Las variables de entorno se encuentran en `infra/env/`:

```bash
infra/env/
├── backend.env    # DATABASE_URL, JWT, Redis
├── db.env         # Credenciales PostgreSQL
└── frontend.env   # VITE_API_URL, etc.
```

**Ejemplo backend.env:**
```env
DATABASE_URL=postgresql://brixo_user:brixo_pass@postgres:5432/brixo
JWT_ALGORITHM=RS256
JWT_ACCESS_TOKEN_EXP_MINUTES=480
JWT_REFRESH_TOKEN_EXP_DAYS=30
REDIS_URL=redis://redis:6379
LOG_LEVEL=INFO
```

La configuración se carga mediante `Pydantic BaseSettings` en [backend/infrastructure/env/settings.py](backend/infrastructure/env/settings.py).

---

## 📂 Base de Datos

### Tabla Products (Ejemplo Inicial)

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

La inicialización completa se encuentra en [infra/docker/postgres/init.sql](infra/docker/postgres/init.sql).

---

## 🧪 Alcance del MVP

### ✅ Incluido
- Gestión de productos
- Registro de entradas y salidas
- Corrección manual de stock
- Historial de movimientos
- Dashboard visual simple
- Alertas básicas de stock bajo

### ❌ Excluido (por diseño)
- Facturación electrónica
- Contabilidad
- Impuestos
- Reportes financieros complejos

---

## 🤝 Principios del Producto

### 1️⃣ Control
El usuario debe tener certeza inmediata sobre:
- Su stock actual
- Los movimientos realizados
- Quién y cuándo realizó un cambio

Todo cambio deja rastro. El control es explícito, no implícito.

### 2️⃣ Simplicidad

- Si requiere capacitación → está mal diseñado
- Si necesita explicación → debe simplificarse
- Si confunde → se elimina

La interfaz debe ser usable por alguien sin conocimientos contables ni técnicos.

### 3️⃣ Inventario Primero

Solo existen funcionalidades que impacten directamente:
- Entradas
- Salidas
- Ajustes
- Disponibilidad

Todo lo demás queda fuera del MVP.

### 4️⃣ Complejidad Interna, Experiencia Simple

- El backend puede ser robusto
- La arquitectura puede ser avanzada
- La infraestructura puede escalar

Pero el usuario **nunca debe percibir complejidad**.

### 5️⃣ Decisiones Guiadas por el Usuario

La tecnología sirve al producto.
El producto sirve al usuario.

Nunca al revés.

### 6️⃣ Regla Final (No Negociable)

**Si una funcionalidad no mejora el control del inventario de forma simple, no entra en Brixo.**

Este principio protege el MVP, el foco del producto y el tiempo del equipo.

---

## 📚 Documentación Técnica

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Estructura del Código Backend
El código sigue una arquitectura limpia con las siguientes capas:
1. **Domain**: Lógica de negocio independiente de tecnología
2. **Application**: Casos de uso y orquestación
3. **Infrastructure**: Detalles técnicos (BD, caché, logging)
4. **Adapters**: Controladores, repositorios y puertos

---

## 🔄 CI/CD

*(Por implementar)*

## 🧪 Testing

*(Por implementar)*

---

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Crea una rama desde `dev`: `git checkout -b feature/nombre-feature`
2. Realiza tus cambios respetando los principios del producto
3. Documenta cambios en el código
4. Crea un Pull Request describiendo los cambios

---

## 📞 Contacto & Soporte

Para reportar bugs o sugerencias, abre un **issue** en el repositorio.

---

## 📋 Roadmap Futuro

- [ ] Importación/Exportación de datos (CSV)
- [ ] Reportes de movimiento por período
- [ ] Alertas de stock bajo (automáticas)
- [ ] Categorización de productos
- [ ] Usuarios y roles avanzados
- [ ] Integración con proveedores

Estos ítems se evaluarán tras validar el MVP en uso real.

---

## 📄 Licencia

Proyecto en etapa temprana. Licencia a definir.

---

## 📞 Información del Proyecto

- **Versión**: 4.5.0
- **Estado**: MVP / Proof of Concept
- **Branch Activo**: dev
- **Branch Default**: main
- **Última actualización**: 24 de enero de 2026

