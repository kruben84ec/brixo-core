#!/bin/bash
# Script para ejecutar tests con cobertura en Brixo

set -e

echo "🧪 Ejecutando tests con cobertura..."
echo ""

# Ejecutar tests con pytest-cov
python -m pytest tests/ \
    --cov=. \
    --cov-report=html \
    --cov-report=term-missing \
    --cov-report=xml \
    --cov-fail-under=80 \
    -v

echo ""
echo "✅ Tests completados"
echo "📊 Reporte HTML disponible en: htmlcov/index.html"
echo "📈 Cobertura XML guardada en: coverage.xml"
