@echo off
REM Script para ejecutar tests con cobertura en Brixo (Windows)

echo.
echo 🧪 Ejecutando tests con cobertura...
echo.

REM Ejecutar tests con pytest-cov
python -m pytest tests/ ^
    --cov=. ^
    --cov-report=html ^
    --cov-report=term-missing ^
    --cov-report=xml ^
    --cov-fail-under=80 ^
    -v

if %errorlevel% equ 0 (
    echo.
    echo ✅ Tests completados
    echo 📊 Reporte HTML disponible en: htmlcov\index.html
    echo 📈 Cobertura XML guardada en: coverage.xml
) else (
    echo.
    echo ❌ Tests fallaron
    exit /b 1
)
