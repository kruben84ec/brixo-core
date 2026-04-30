# 🧪 Testing en Frontend - Brixo Core

## 📊 Descripción

Suite de tests para el frontend de Brixo utilizando **Vitest + React Testing Library** con cobertura de código al 80%.

### Herramientas

| Herramienta | Versión | Propósito |
|------------|---------|----------|
| **Vitest** | 1.0.4 | Framework de testing |
| **React Testing Library** | 14.1.2 | Testing de componentes React |
| **@testing-library/jest-dom** | 6.1.5 | Matchers de DOM |
| **@testing-library/user-event** | 14.5.1 | Simulación de eventos |
| **jsdom** | 23.0.1 | Entorno DOM virtual |
| **@vitest/ui** | 1.0.4 | UI para reportes |

---

## 📦 Instalación

```bash
# Instalar dependencias (ya incluidas en package.json)
npm install

# O si se necesita actualizar específicamente testing deps
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## 🚀 Ejecutar Tests

### Opción 1: Tests normales
```bash
npm test
```

### Opción 2: Tests con UI interactivo
```bash
npm run test:ui
```

### Opción 3: Tests con cobertura
```bash
npm run test:coverage
```

### Opción 4: Tests en modo watch
```bash
npm run test:watch
```

---

## 📁 Estructura de Tests

```
src/
├── components/
│   ├── primitives/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx            ✅ 11 tests
│   │   ├── Input.tsx
│   │   └── Input.test.tsx             ✅ 12 tests
│   ├── feedback/
│   │   ├── Card.tsx
│   │   ├── Card.test.tsx              ✅ 6 tests
│   │   ├── AlertCard.tsx
│   │   └── AlertCard.test.tsx         ✅ 11 tests
│   └── layout/
│       ├── PrivateRoute.tsx
│       └── PrivateRoute.test.tsx      ✅ 6 tests
├── hooks/
│   ├── useTheme.ts
│   └── useTheme.test.ts               ✅ 6 tests
├── services/
│   ├── api.ts
│   └── api.test.ts                    ✅ 10 tests
├── stores/
│   ├── authStore.ts
│   └── authStore.test.ts              ✅ 11 tests
└── __tests__/
    ├── setup.ts                       (Setup global)
    └── utils/
        ├── renderWithProviders.tsx    (Helpers)
        └── mockData.ts                (Test fixtures)
```

---

## 📊 Cobertura

| Módulo | Archivos | Tests | Cobertura Esperada |
|--------|----------|-------|-------------------|
| **Componentes Primitivos** | 2 | 23 | 90%+ |
| **Componentes Feedback** | 2 | 17 | 85%+ |
| **Layout/Routing** | 1 | 6 | 80%+ |
| **Hooks** | 1 | 6 | 80%+ |
| **Servicios** | 1 | 10 | 75% |
| **Stores** | 1 | 11 | 85%+ |
| **TOTAL** | 8 | **73+** | **80%+** |

---

## 🧪 Tests Creados

### Componentes Primitivos

#### Button.test.tsx (11 tests)
- ✅ Rendering básico
- ✅ Variantes (primary, secondary, danger, ghost)
- ✅ Tamaños (sm, md, lg)
- ✅ Estados (disabled, loading)
- ✅ Click handlers
- ✅ Ref forwarding
- ✅ Custom classNames

#### Input.test.tsx (12 tests)
- ✅ Rendering básico
- ✅ Labels y asociación
- ✅ Placeholders
- ✅ Error messages
- ✅ Helper text
- ✅ Icons
- ✅ Input changes
- ✅ Estados (disabled, readonly)
- ✅ Tipos (email, password, etc.)
- ✅ Ref forwarding
- ✅ HTML attributes

### Componentes Feedback

#### Card.test.tsx (6 tests)
- ✅ Rendering de children
- ✅ Children complejos (HTML)
- ✅ Custom classNames
- ✅ Click handlers
- ✅ Sin click handler
- ✅ Multiple classNames

#### AlertCard.test.tsx (11 tests)
- ✅ Variantes (success, danger, warning, info)
- ✅ Título
- ✅ Descripción
- ✅ Action elements
- ✅ Icons
- ✅ Todos los props
- ✅ Complex actions

### Layout & Routing

#### PrivateRoute.test.tsx (6 tests)
- ✅ Render cuando autenticado
- ✅ Redirect cuando no autenticado
- ✅ State changes
- ✅ PublicOnlyRoute (3 tests)

### Hooks

#### useTheme.test.ts (6 tests)
- ✅ Error fuera de ThemeProvider
- ✅ Retorna contexto
- ✅ Propiedades
- ✅ Toggle function
- ✅ Theme toggling
- ✅ Persistence

### Servicios

#### api.test.ts (10 tests)
- ✅ Type exports
- ✅ AuthResponse type
- ✅ RegisterResponse type
- ✅ LoginRequest type
- ✅ User type
- ✅ Product type
- ✅ Authority levels

### Stores

#### authStore.test.ts (11 tests)
- ✅ Estado inicial
- ✅ setAuth
- ✅ localStorage integration
- ✅ logout
- ✅ setLoading
- ✅ hydrate
- ✅ Múltiples ciclos auth
- ✅ Subscriptions
- ✅ Authority levels

---

## 🛠️ Configuración (vitest.config.ts)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                    // describe, it, expect global
    environment: 'jsdom',             // Simula navegador
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
})
```

---

## 📝 Setup Global (setup.ts)

```typescript
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup después de cada test
afterEach(() => cleanup())

// Mock localStorage
const localStorageMock = { ... }

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', { ... })
```

---

## 🎯 Escribir Nuevos Tests

### Patrón básico

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('does something', () => {
    render(<MyComponent />)
    expect(screen.getByText('text')).toBeInTheDocument()
  })

  it('handles clicks', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<MyComponent onClick={handleClick} />)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### Testing hooks

```typescript
import { renderHook } from '@testing-library/react'

describe('useMyHook', () => {
  it('returns value', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current.value).toBe('expected')
  })
})
```

### Mocking módulos

```typescript
vi.mock('@/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span>{name}</span>,
}))
```

---

## 🧩 Helpers Útiles

### renderWithProviders (próximo)
```typescript
const { getByText } = renderWithProviders(<App />)
```

### mockData (próximo)
```typescript
const mockUser = createMockUser()
const mockProduct = createMockProduct()
```

---

## ✅ Checklist

- [x] Instalar Vitest + React Testing Library
- [x] Configurar vitest.config.ts
- [x] Setup global (setup.ts)
- [x] Tests de Button (11 tests)
- [x] Tests de Input (12 tests)
- [x] Tests de Card (6 tests)
- [x] Tests de AlertCard (11 tests)
- [x] Tests de PrivateRoute (6 tests)
- [x] Tests de useTheme (6 tests)
- [x] Tests de api.ts (10 tests)
- [x] Tests de authStore (11 tests)
- [ ] Tests de Modal (próximo)
- [ ] Tests de Pages (próximo)
- [ ] Tests de integración (próximo)
- [ ] E2E tests (próximo)

---

## 🔗 Referencia Rápida

```bash
# Instalar
npm install

# Tests
npm test              # Ejecutar tests
npm run test:ui       # Ver UI interactivo
npm run test:coverage # Ver cobertura
npm run test:watch    # Modo watch

# Dentro del test
describe()            # Suite de tests
it()                  # Un test
expect()              # Assertion
vi.fn()               # Mock function
vi.mock()             # Mock módulo
userEvent.setup()     # Setup interacciones

# React Testing Library
render()              # Renderizar componente
screen.getByX()       # Queries
fireEvent.click()     # Eventos
waitFor()             # Esperar cambios
```

---

## 📈 Próximos Pasos

1. **Ejecutar tests**: `npm run test:coverage`
2. **Ver cobertura**: Revisar reporte HTML
3. **Agregar más tests**:
   - [ ] Modal component
   - [ ] Pages (LoginPage, DashboardPage, etc.)
   - [ ] Integración (múltiples componentes)
   - [ ] E2E (flujos completos)

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| `Cannot find module` | Verificar path en vitest.config.ts (alias @) |
| `vi is not defined` | Agregar `import { vi } from 'vitest'` |
| `cleanup error` | Setup.ts debe estar en setupFiles |
| `localStorage is not defined` | Mock en setup.ts |

---

## 📚 Referencias

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

---

**Última actualización**: 2026-04-30 | **Status**: ✅ Listo para usar
