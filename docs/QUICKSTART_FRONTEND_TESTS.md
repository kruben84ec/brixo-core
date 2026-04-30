# ⚡ Quick Start - Frontend Testing

## 🎯 2 minutos para empezar

### 1️⃣ Instalar (1 minuto)
```bash
cd frontend/
npm install
```

### 2️⃣ Ejecutar tests (30 segundos)
```bash
npm test
```

### 3️⃣ Ver cobertura (30 segundos)
```bash
npm run test:coverage
```

---

## 📋 Scripts Disponibles

```bash
npm test              # Ejecutar todos los tests
npm run test:ui       # Ver UI interactivo
npm run test:coverage # Cobertura con reporte HTML
npm run test:watch    # Modo watch (auto-rerun)
```

---

## 🧪 Tests Incluidos

| Componente | Tests | Status |
|-----------|-------|--------|
| Button | 11 | ✅ |
| Input | 12 | ✅ |
| Card | 6 | ✅ |
| AlertCard | 11 | ✅ |
| PrivateRoute | 6 | ✅ |
| useTheme | 6 | ✅ |
| api.ts | 10 | ✅ |
| authStore | 11 | ✅ |
| **TOTAL** | **73+** | ✅ |

---

## 📊 Cobertura Esperada

- **Primitivos**: 90%+
- **Feedback**: 85%+
- **Hooks**: 80%+
- **Services**: 75%
- **Stores**: 85%+
- **TOTAL**: 80%+

---

## 🔍 Ejemplo: Crear un Test

```typescript
// src/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders text', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

Luego ejecuta:
```bash
npm test src/components/MyComponent.test.tsx
```

---

## 🎓 Comandos Útiles

```bash
# Solo un archivo
npm test Button

# Solo una suite
npm test -- -t "Button Component"

# Solo un test
npm test -- -t "renders button with text"

# Sin watch
npm test -- --run

# Debug mode
npm test -- --inspect-brk
```

---

## ✨ Stack

- ✅ Vitest (rápido, compatible con Vite)
- ✅ React Testing Library (testing real)
- ✅ jsdom (entorno de navegador)
- ✅ User Event (interacciones reales)
- ✅ @vitest/ui (interfaz visual)

---

## 🐛 Problemas Comunes

| Error | Fix |
|-------|-----|
| `Cannot find module @` | Setup del alias en vitest.config.ts ✅ |
| `localStorage is undefined` | Mock en setup.ts ✅ |
| `vi is not defined` | Importar de 'vitest' ✅ |

---

## 📈 Próximo

```bash
npm run test:coverage
# Abre: coverage/index.html
```

---

**¡Listo!** Tests ejecutándose. 🎉
