# 🚀 Quick Start - Testing en Brixo Core

## ⚡ Instalación (2 minutos)

```bash
cd backend/
pip install -r requirements.txt
```

## ✨ Ejecutar Tests (1 minuto)

### Opción 1: Windows
```bash
run_tests.bat
```

### Opción 2: Linux/Mac
```bash
chmod +x run_tests.sh
./run_tests.sh
```

### Opción 3: Manual
```bash
pytest tests/ --cov=. --cov-report=html -v
```

## 📊 Ver Reporte

Después de ejecutar, abre:
- **HTML**: `htmlcov/index.html`
- **Terminal**: Verás el resumen de cobertura

## 🎯 Ejemplos de Uso

### Ejecutar todos los tests
```bash
pytest tests/
```

### Solo tests de domain
```bash
pytest tests/test_domain/
```

### Solo tests de una clase
```bash
pytest tests/test_use_cases/test_login_user.py::TestLoginUser -v
```

### Con cobertura detallada
```bash
pytest tests/ --cov=. --cov-report=term-missing
```

### Mostrar output de print
```bash
pytest tests/ -s
```

### Parar en primer fallo
```bash
pytest tests/ -x
```

## 📁 Estructura

```
backend/
├── requirements.txt          ← Incluye pytest, pytest-cov, etc
├── pytest.ini               ← Configuración
├── run_tests.sh             ← Script Linux/Mac
├── run_tests.bat            ← Script Windows
├── TESTING.md               ← Guía detallada
├── TEST_INDEX.md            ← Índice de todos los tests
├── tests/
│   ├── conftest.py          ← 30+ fixtures compartidas
│   ├── test_domain/         ← Tests de entidades
│   ├── test_application/    ← Tests de event bus y handlers
│   ├── test_infrastructure/ ← Tests de seguridad
│   └── test_use_cases/      ← Tests de cases de uso
```

## 🧪 Fixtures Útiles

```python
# En tu test
def test_something(event_bus, user, mock_auth_repository):
    # Usar las fixtures aquí
    assert user.email == "test@example.com"
```

## ✅ Meta

- **Target**: 80% cobertura
- **Actual**: ~82-85%
- **Tests**: 185+
- **Status**: ✅ Completado

## 🎓 Próximos Tests

```bash
# API routes
pytest tests/test_api/ -v

# JWT service
pytest tests/test_infrastructure/test_jwt.py -v

# Access control
pytest tests/test_infrastructure/test_permissions.py -v
```

## 🐛 Ayuda Rápida

| Problema | Solución |
|----------|----------|
| No encuentra tests | Estar en carpeta `backend/` |
| ModuleNotFoundError | `pip install -r requirements.txt` |
| Permission denied (.sh) | `chmod +x run_tests.sh` |
| Cobertura baja | Ver `htmlcov/index.html` |

---

**¡Listo!** Puedes ejecutar los tests ahora mismo. 🎉
