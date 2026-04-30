# 📋 Índice de Tests - Brixo Core

## 📊 Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Total Tests** | 185+ |
| **Archivos de Test** | 8 |
| **Fixtures Compartidas** | 30+ |
| **Líneas de Código** | 2000+ |
| **Cobertura Esperada** | 80-85% |
| **Status** | ✅ Listo para ejecutar |

---

## 📁 Estructura Detallada

### 🧪 Tests por Módulo

#### **Domain** (4 archivos, ~175 tests)

```
tests/test_domain/
├── test_contracts.py .................... 95+ tests
│   ├── TestTenant ........................ 3 tests
│   ├── TestUser .......................... 4 tests
│   ├── TestRole .......................... 2 tests
│   ├── TestPermission .................... 3 tests
│   ├── TestUserRole ...................... 2 tests
│   ├── TestAuthority ..................... 1 test
│   ├── TestConnectionState .............. 1 test
│   ├── TestWritePolicy ................... 1 test
│   └── TestSyncEvent ..................... 2 tests
│
├── test_exceptions.py ................... 25+ tests
│   ├── TestBrixoException ................ 3 tests
│   ├── TestNotFoundError ................. 2 tests
│   ├── TestUnauthorizedError ............. 2 tests
│   ├── TestForbiddenError ................ 2 tests
│   ├── TestConflictError ................. 2 tests
│   ├── TestDomainValidationError ......... 2 tests
│   ├── TestInternalError ................. 2 tests
│   └── TestExceptionHierarchy ............ 2 tests
│
├── test_events.py ....................... 30+ tests
│   ├── TestUserLoggedInEvent ............. 2 tests
│   ├── TestUserLoginFailedEvent .......... 3 tests
│   ├── TestUserLoggedOutEvent ............ 2 tests
│   ├── TestUserAuthenticatedEvent ........ 2 tests
│   ├── TestUserCreatedEvent .............. 2 tests
│   ├── TestEventTimestamps ............... 2 tests
│   └── TestAuthEventConsistency .......... 2 tests
│
└── test_logs.py ......................... 35+ tests
    ├── TestLogEventType .................. 2 tests
    ├── TestActor ......................... 5 tests
    ├── TestLogEntry ...................... 8 tests
    ├── TestSystemConstants ............... 4 tests
    └── TestLogAuditRequirements .......... 3 tests
```

#### **Application** (2 archivos, ~25 tests)

```
tests/test_application/
├── test_event_bus.py .................... 15+ tests
│   ├── TestEventBus
│   │   ├── test_event_bus_creation
│   │   ├── test_subscribe_single_handler
│   │   ├── test_subscribe_multiple_handlers_same_event
│   │   ├── test_subscribe_handlers_different_events
│   │   ├── test_publish_event_calls_handlers
│   │   ├── test_publish_calls_multiple_handlers
│   │   ├── test_publish_only_relevant_handlers
│   │   ├── test_publish_no_handlers
│   │   ├── test_handler_exception_handling
│   │   ├── test_async_handler_support
│   │   ├── test_handler_receives_correct_event
│   │   └── test_event_bus_handler_ordering
│
└── test_handlers.py ..................... 10+ tests
    ├── TestHandlerRegistration ........... 2 tests
    ├── TestUserLoggedInHandler ........... 2 tests
    ├── TestUserLoginFailedHandler ........ 2 tests
    ├── TestUserCreatedHandler ............ 2 tests
    └── TestMultipleHandlerExecution ..... 1 test
```

#### **Infrastructure** (1 archivo, ~30 tests)

```
tests/test_infrastructure/
└── test_passwords.py .................... 30+ tests
    ├── TestHashPassword .................. 7 tests
    ├── TestVerifyPassword ................ 8 tests
    ├── TestPasswordIntegration ........... 3 tests
```

#### **Use Cases** (1 archivo, ~15 tests)

```
tests/test_use_cases/
└── test_login_user.py ................... 15+ tests
    └── TestLoginUser ..................... 15 tests
        ├── test_login_user_creation
        ├── test_login_user_success
        ├── test_login_user_publishes_event
        ├── test_login_user_invalid_password
        ├── test_login_user_not_found
        ├── test_login_user_publishes_failure_event
        ├── test_login_user_not_found_publishes_failure
        ├── test_login_user_password_verification_error
        ├── test_login_user_returns_user_object
        └── test_login_user_error_has_details
```

---

## 🔧 Fixtures Disponibles (conftest.py)

### Básicas

| Fixture | Tipo | Descripción |
|---------|------|-------------|
| `event_bus` | EventBus | Bus de eventos para tests |
| `tenant_id` | str | UUID de tenant |
| `user_id` | str | UUID de usuario |

### Entidades

| Fixture | Tipo | Descripción |
|---------|------|-------------|
| `tenant` | Tenant | Instancia de Tenant |
| `user` | User | Instancia de User (OPERATOR) |
| `admin_user` | User | Instancia de User (ADMIN) |
| `role` | Role | Instancia de Role |
| `permission` | Permission | Instancia de Permission |
| `log_entry` | LogEntry | Instancia de LogEntry |

### Mocks

| Fixture | Tipo | Descripción |
|---------|------|-------------|
| `mock_auth_repository` | Mock | Mock de AuthRepository |
| `mock_audit_log_repository` | Mock | Mock de AuditLogRepository |
| `mock_user_repository` | Mock | Mock de UserRepository |
| `mock_access_repository` | Mock | Mock de AccessRepository |

### Seguridad

| Fixture | Tipo | Descripción |
|---------|------|-------------|
| `valid_password` | tuple | (hash, plain) de password válido |
| `jwt_token_payload` | dict | Payload típico de JWT |

---

## 🚀 Ejecutar Tests

### Opción 1: Script automático

```bash
# Linux/Mac
./run_tests.sh

# Windows
run_tests.bat
```

### Opción 2: Comando directo

```bash
# Todos los tests
pytest tests/ -v

# Con cobertura
pytest tests/ --cov=. --cov-report=html

# Tests específicos
pytest tests/test_domain/ -v
pytest tests/test_application/test_event_bus.py -v
pytest tests/test_use_cases/test_login_user.py::TestLoginUser::test_login_user_success -v
```

---

## 📈 Cobertura por Módulo

| Módulo | Archivos | Líneas | Esperada |
|--------|----------|--------|----------|
| **domain/** | 3 | ~400 | 95%+ |
| **application/** | 2 | ~250 | 85%+ |
| **infrastructure/** | 1 | ~150 | 100% |
| **use_cases/** | 1 | ~100 | 95%+ |
| **TOTAL** | 7 | ~900 | 80%+ |

---

## ✅ Checklist de Testing

- [x] Fixtures compartidas en conftest.py
- [x] Tests de entidades (contracts)
- [x] Tests de excepciones
- [x] Tests de eventos
- [x] Tests de auditoría (logs)
- [x] Tests de event bus
- [x] Tests de handlers
- [x] Tests de passwords
- [x] Tests de login (use case)
- [x] Configuración pytest.ini
- [x] Scripts de ejecución
- [x] Documentación (TESTING.md)
- [ ] Tests de API routes (próximo)
- [ ] Tests de JWT service (próximo)
- [ ] Tests de access control (próximo)

---

## 🔗 Referencia Rápida

```bash
# Instalación
pip install -r requirements.txt

# Ejecutar
pytest tests/ -v

# Con cobertura
pytest tests/ --cov=. --cov-report=term-missing

# HTML report
pytest tests/ --cov=. --cov-report=html
# Abrir: htmlcov/index.html

# Solo tests fallidos
pytest tests/ --lf -v

# Stop en primer fallo
pytest tests/ -x

# Mostrar prints
pytest tests/ -s
```

---

## 📝 Notas

1. **Mocking DB**: Todos los tests usan mocks, no DB real
2. **Async handlers**: EventBus soporta handlers async automáticamente
3. **Immutabilidad**: Las entidades son frozen dataclasses
4. **Password hashing**: Usa bcrypt con salts únicos
5. **Multi-tenant**: Todos los eventos incluyen tenant_id

---

## 🎯 Próximos Pasos

1. ✅ Instalar dependencias
2. ✅ Ejecutar tests
3. ✅ Revisar cobertura
4. 📝 Agregar más tests de API routes
5. 📝 Agregar tests de JWT
6. 📝 Agregar tests de access control

---

**Última actualización**: 2026-04-30 | **Status**: Listo para usar ✅
