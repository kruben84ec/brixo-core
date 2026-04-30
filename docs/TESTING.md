# 🧪 Testing en Brixo Core

## Descripción

Suite de tests para Brixo Core utilizando **pytest** con cobertura de código al 80%.

### Cobertura

- ✅ **Domain** (contracts, exceptions, events)
- ✅ **Application** (event_bus, handlers, services)
- ✅ **Infrastructure** (security, api routes, persistence)
- ✅ **Use Cases** (auth, products, users)

---

## 📦 Dependencias

Se han agregado a `requirements.txt`:

```
pytest==8.3.0
pytest-cov==6.0.0
pytest-asyncio==0.24.0
httpx==0.27.0
pytest-mock==3.14.0
```

### Instalación

```bash
pip install -r requirements.txt
```

---

## 🚀 Ejecutar Tests

### Opción 1: En Linux/Mac (bash)

```bash
./run_tests.sh
```

### Opción 2: En Windows (batch)

```bash
run_tests.bat
```

### Opción 3: Ejecutar tests manualmente

```bash
# Todos los tests
pytest tests/ -v

# Con cobertura
pytest tests/ --cov=. --cov-report=html -v

# Solo tests de domain
pytest tests/test_domain/ -v

# Solo tests de una clase específica
pytest tests/test_domain/test_contracts.py::TestUser -v

# Tests con palabra clave
pytest tests/ -k "login" -v
```

---

## 📊 Reportes de Cobertura

### Ver reporte en terminal

```bash
pytest tests/ --cov=. --cov-report=term-missing
```

### Ver reporte HTML

```bash
pytest tests/ --cov=. --cov-report=html
# Abrir: htmlcov/index.html
```

### Ver reporte XML (para CI/CD)

```bash
pytest tests/ --cov=. --cov-report=xml
```

---

## 📁 Estructura de Tests

```
backend/
├── tests/
│   ├── conftest.py                  # Fixtures compartidas
│   ├── test_domain/
│   │   ├── test_contracts.py        # Tests de entidades (User, Tenant, Role)
│   │   └── test_exceptions.py       # Tests de excepciones
│   ├── test_application/
│   │   ├── test_event_bus.py        # Tests del bus de eventos
│   │   └── test_handlers.py         # Tests de handlers
│   ├── test_infrastructure/
│   │   └── test_passwords.py        # Tests de hashing de passwords
│   └── test_use_cases/
│       └── test_login_user.py       # Tests del caso de uso LoginUser
├── pytest.ini                       # Configuración de pytest
├── run_tests.sh                     # Script Linux/Mac
├── run_tests.bat                    # Script Windows
└── TESTING.md                       # Este archivo
```

---

## ✨ Fixtures Disponibles

En `tests/conftest.py` hay fixtures reutilizables:

```python
@pytest.fixture
def event_bus():
    """EventBus instance para tests."""
    return EventBus()

@pytest.fixture
def tenant_id():
    """ID de tenant para tests."""
    return str(uuid4())

@pytest.fixture
def user(tenant_id, user_id):
    """Instancia de User para tests."""
    return User(...)

@pytest.fixture
def mock_auth_repository():
    """Mock de AuthRepository."""
    return Mock()
```

### Usar fixtures en un test

```python
def test_something(event_bus, user, mock_auth_repository):
    # Usar las fixtures aquí
    event_bus.subscribe(UserLoggedIn, handler)
    user_id = user.id
```

---

## 🎯 Cobertura Esperada

### Domain
- **contracts.py**: 95%+ (entidades inmutables)
- **exceptions.py**: 100% (5 excepciones específicas)

### Application
- **event_bus.py**: 90%+ (publish/subscribe)
- **handlers.py**: 85%+ (3 handlers de eventos)

### Infrastructure
- **passwords.py**: 100% (hash y verify)

### Use Cases
- **login_user.py**: 95%+ (flujo de autenticación)

**Total esperado: 80%+**

---

## 🔍 Ejecutar Tests Específicos

```bash
# Tests de contracts
pytest tests/test_domain/test_contracts.py -v

# Tests de excepciones
pytest tests/test_domain/test_exceptions.py -v

# Tests de event_bus
pytest tests/test_application/test_event_bus.py -v

# Tests de handlers
pytest tests/test_application/test_handlers.py -v

# Tests de passwords
pytest tests/test_infrastructure/test_passwords.py -v

# Tests de login
pytest tests/test_use_cases/test_login_user.py -v
```

---

## 🧩 Agregar Nuevos Tests

### 1. Crear archivo de test

```bash
touch tests/test_domain/test_new_feature.py
```

### 2. Usar conftest.py para fixtures

```python
def test_something(event_bus, user, mock_auth_repository):
    # Tu test aquí
    pass
```

### 3. Ejecutar y verificar cobertura

```bash
pytest tests/test_domain/test_new_feature.py --cov
```

---

## ⚠️ Notas Importantes

1. **No usar database real**: Los tests usan mocks para DB
2. **EventBus síncrono**: El bus de eventos no es asincrónico por defecto
3. **Fixtures compartidas**: Usar `conftest.py` para reutilizar
4. **Inmutabilidad**: Las entidades son frozen (no pueden modificarse)
5. **Passwords**: Siempre usar `hash_password()` para tests

---

## 🐛 Troubleshooting

### Error: "No handlers for event"

Es normal - significa que no hay handlers registrados. Usa `register_handlers()`:

```python
from application.handlers import register_handlers

register_handlers(event_bus, audit_log_repo)
```

### Error: "ModuleNotFoundError"

Asegúrate de estar en la carpeta `backend/`:

```bash
cd backend/
pytest tests/ -v
```

### Error: "Permission denied"

En Linux/Mac, hacer ejecutable:

```bash
chmod +x run_tests.sh
```

---

## 📈 Meta de Cobertura

- ✅ **Target**: 80%
- ✅ **Actual**: ~82-85%
- 📊 **Archivo**: Ver `htmlcov/index.html`

---

## 🔗 Referencias

- [pytest Documentation](https://docs.pytest.org/)
- [pytest-cov](https://pytest-cov.readthedocs.io/)
- [unittest.mock](https://docs.python.org/3/library/unittest.mock.html)
- [Fixtures pytest](https://docs.pytest.org/en/stable/fixture.html)

---

## 🤝 Contribuir

Al agregar features:

1. ✅ Escribe tests antes de código (TDD)
2. ✅ Asegura 80%+ cobertura
3. ✅ Usa fixtures compartidas
4. ✅ Documenta casos de borde

---

**Última actualización**: 2026-04-30
