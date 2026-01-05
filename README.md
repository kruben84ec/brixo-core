# README.md

# Brixo

**Brixo — Control simple de tu inventario**

Brixo es una aplicación web enfocada en inventario simple, rápida y entendible para personas que no son contadores ni especialistas en sistemas. Su objetivo es dar **control real** del stock diario sin fricción, sin capacitación y sin complejidad innecesaria.

---

## 🎯 Propósito

Dar a dueños de pequeños negocios, pymes y contadores una herramienta clara para saber:
- Qué productos tienen
- Qué productos se movieron
- Cuánto stock queda

Nada más. Nada menos.

---

## 🧠 Filosofía del producto

Brixo no es un ERP.
No es un sistema contable.
No es una plataforma tributaria.

Es un **sistema de control de inventario**.

Toda decisión técnica y funcional debe respetar esta premisa.

---

## 🧩 Alcance del MVP

### Incluido
- Gestión de productos
- Registro de entradas y salidas
- Corrección manual de stock
- Historial de movimientos
- Dashboard visual simple
- Alertas básicas de stock bajo

### Excluido (por diseño)
- Facturación electrónica
- Contabilidad
- Impuestos
- Reportes financieros complejos
- Automatizaciones avanzadas

Estas capacidades podrán evaluarse **después** de validar el MVP.

---

## 🛠️ Stack tecnológico (MVP)

- Backend: Python (API REST)
- Frontend: React
- Base de datos: PostgreSQL
- Infraestructura: Docker + AWS

La complejidad técnica debe ser invisible para el usuario final.

---

## 🚀 Estado del proyecto

- Fase: MVP / Proof of Concept
- Objetivo: Validar uso real y necesidad de mercado

---

## 📄 Licencia

Proyecto en etapa temprana. Licencia a definir.

---


# product_principles.md

# Principios de Producto — Brixo

> **Brixo — Control simple de tu inventario**

Este documento define las reglas inquebrantables del producto. Si una funcionalidad, decisión técnica o cambio de alcance contradice estos principios, **no debe implementarse**.

---

## 1️⃣ Control

El usuario debe tener certeza inmediata sobre:
- Su stock actual
- Los movimientos realizados
- Quién y cuándo realizó un cambio

Todo cambio deja rastro.
El control es explícito, no implícito.

---

## 2️⃣ Simplicidad

- Si requiere capacitación → está mal diseñado
- Si necesita explicación → debe simplificarse
- Si confunde → se elimina

La interfaz debe ser usable por alguien sin conocimientos contables ni técnicos.

---

## 3️⃣ Inventario primero

Solo existen funcionalidades que impacten directamente:
- Entradas
- Salidas
- Ajustes
- Disponibilidad

Todo lo demás queda fuera del MVP.

---

## 4️⃣ Complejidad interna, experiencia simple

- El backend puede ser robusto
- La arquitectura puede ser avanzada
- La infraestructura puede escalar

Pero el usuario **nunca debe percibir complejidad**.

---

## 5️⃣ Decisiones guiadas por el usuario, no por la tecnología

La tecnología sirve al producto.
El producto sirve al usuario.

Nunca al revés.

---

## 6️⃣ Regla final (no negociable)

**Si una funcionalidad no mejora el control del inventario de forma simple, no entra en Brixo.**

Este principio protege el MVP, el foco del producto y el tiempo del equipo.

