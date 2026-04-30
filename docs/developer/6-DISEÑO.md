# Sistema de Diseño — Brixo

**Versión**: 1.0  
**Fecha**: 29 de abril de 2026  
**Estado**: Implementado en Fase 5 (Sprint 1-3 + UI Polish)

---

## Filosofía del Sistema

**Atractivo no es decorado.** El sistema visual de Brixo se construye sobre:

- **Jerarquía visual clara** — qué es lo siguiente a hacer es obvio
- **Color con propósito** — cada color comunica algo específico de negocio
- **Microdetalles precisos** — tipografía, espaciado, estados activos bien ejecutados

**Personalidad en la marca, sobriedad en los datos.**

---

## Reglas No Negociables de Diseño

1. **Color con propósito** — cada color = significado de negocio
2. **Números sin distorsión** — `font-variant-numeric: tabular-nums` en columnas numéricas
3. **Teñir el dato, no el contenedor** — colorea el número crítico, nunca la fila
4. **Mismo componente, dos modos** — light + dark mode funcionan idéntico
5. **Mobile-first real** — 44 px targets, 15 px base en móvil
6. **Un verbo dominante por pantalla** — un solo CTA primario (índigo)
7. **Modo oscuro obligatorio** — contexto de uso (luz variable en mostrador)
8. **Accesibilidad WCAG 2.1 AA** — 4.5:1 contraste, navegación por teclado

---

## Paleta de Colores

### Modo Claro

```ts
const light = {
  // Neutros (escala zinc)
  bgCanvas:    "#FAFAFA",     // fondo principal
  bgSurface:   "#FFFFFF",     // tarjetas, modales
  bgSubtle:    "#F4F4F5",     // hover sutil
  bgMuted:     "#E4E4E7",     // separadores

  textPrimary:  "#18181B",    // títulos, datos críticos
  textSecondary:"#52525B",    // descripciones
  textTertiary: "#71717A",    // hints, metadatos

  // Marca
  brand:         "#4F46E5",    // índigo eléctrico
  brandHover:    "#4338CA",
  brandSoft:     "#EEF2FF",
  brandSoftText: "#3730A3",

  // Semánticos
  success:     "#16A34A",      // entrada
  successSoft: "#F0FDF4",
  successText: "#15803D",

  danger:      "#DC2626",      // salida
  dangerSoft:  "#FEF2F2",
  dangerText:  "#B91C1C",

  warning:     "#D97706",      // ajuste
  warningSoft: "#FFFBEB",
  warningText: "#B45309",

  info:        "#0891B2",
  infoSoft:    "#ECFEFF",
  infoText:    "#0E7490",
}
```

### Modo Oscuro

```ts
const dark = {
  bgCanvas:    "#09090B",
  bgSurface:   "#18181B",
  bgSubtle:    "#27272A",
  bgMuted:     "#3F3F46",

  textPrimary:  "#FAFAFA",
  textSecondary:"#A1A1AA",
  textTertiary: "#71717A",

  brand:         "#818CF8",    // subido en luminosidad
  brandHover:    "#A5B4FC",
  brandSoft:     "rgba(99, 102, 241, 0.15)",
  brandSoftText: "#C7D2FE",

  success:     "#4ADE80",      // subido
  successSoft: "rgba(34, 197, 94, 0.15)",
  successText: "#86EFAC",

  danger:      "#F87171",      // subido
  dangerSoft:  "rgba(239, 68, 68, 0.15)",
  dangerText:  "#FCA5A5",

  warning:     "#FBBF24",
  warningSoft: "rgba(245, 158, 11, 0.15)",
  warningText: "#FCD34D",

  info:        "#22D3EE",
  infoSoft:    "rgba(6, 182, 212, 0.15)",
  infoText:    "#67E8F9",
}
```

---

## Tipografía

**Familias**:
- **Principal**: Inter — geométrica, soporte `tabular-nums`, CV11
- **Mono**: JetBrains Mono — SKUs, IDs, código técnico

**Escala modular 1.125 (cuarta menor)**:

| Uso | Tamaño | Peso | Line-height |
|-----|--------|------|-------------|
| Display | 28–32 px | 600 | 1.0 |
| H1 | 22–26 px | 600 | 1.2 |
| H2 | 18–20 px | 600 | 1.3 |
| H3 | 14 px | 600 | 1.4 |
| Body | 14 px (15 px móvil) | 400 | 1.5 |
| Label | 13 px | 500 | 1.4 |
| Caption | 12 px | 400 | 1.4 |
| Micro | 11 px | 500–600 | 1.3 |

**Features obligatorias**:
```css
font-variant-numeric: tabular-nums;        /* columnas numéricas */
font-feature-settings: "cv11", "ss01";     /* disambiguación: 1/l/I */
```

---

## Componentes Base

### Button

| Tipo | Uso | Apariencia |
|------|-----|-----------|
| **Primary** | Acción principal (única por pantalla) | Fondo índigo, texto blanco, radius 10px, min-height 48px |
| **Ghost** | Acciones secundarias (varias permitidas) | Fondo transparente, borde 1px, radius 10px |
| **Icon-only** | Acciones repetitivas | 32×32 px, borde sutil, radius 8px |
| **FAB** (móvil) | Acción creadora | 56×56 px circular, índigo, sombra |

### Input

- Altura **44 px** (target táctil)
- Borde 1 px, radius 10 px
- Padding 11×14 px
- Cuando llevan ícono: padding-left 44 px + ícono posicionado absolutamente
- En foco: borde `brand` + box-shadow `brand` con alpha 0.15

### Card

- `bgSurface`, borde 1 px, radius 12 px, padding 14–16 px
- **MetricCard**: `bgSurface`, título 12px, valor 26–28px peso 600 + `tabular-nums`
- **AlertCard**: fondo `soft` del color semántico, borde-izquierdo 3 px sólido, **borde-derecho redondeado pero izquierdo recto** (regla: no redondear bordes unilaterales)

### Badge (Píldora de Estado)

- Radio **6 px** (no 9999 px/pill)
- Padding 3×8 px
- Tamaño 11 px peso 600
- Fondo = soft del color; texto = text del mismo color

---

## Breakpoints y Responsive

```ts
const breakpoints = {
  mobile:  "< 768px",     // phones, portrait tablets
  tablet:  "768–1023px",  // landscape tablets
  desktop: ">= 1024px"    // laptops y más grandes
}
```

### Cambios de Layout

| Elemento | Móvil | Desktop |
|----------|-------|---------|
| **Navegación** | Bottom nav (4 ítems) | Sidebar 240px |
| **KPIs Dashboard** | 2 columnas | 4 columnas |
| **Inventario** | Cards con +/− inline | Tabla con hover |
| **CTA Registrar movimiento** | Ancho full + FAB | Inline junto al título |
| **Formularios auth** | Full-screen | Card 420px centrada |

**Safe areas**: Bottom nav usa `padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px))` para iPhone X+.

---

## Semáforo de Stock (Decisión Crítica)

En la tabla de inventario hay **tres estados**, no dos:

| Estado | Color | Significa |
|--------|-------|----------|
| **En stock** | Verde suave | Stock > mínimo + holgura |
| **Al límite** | Ámbar | Stock > mínimo pero cerca (anticipar reposición) |
| **Stock bajo** | Rojo | Stock ≤ mínimo (requiere acción ahora) |

**Razón**: El ámbar permite anticipar en lugar de solo reportar crisis. Un dueño ve 3 productos en ámbar y ordena a proveedor; uno que solo ve rojo está en crisis.

---

## Logo — Brixo

### Monograma

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <rect width="24" height="24" rx="5" fill="#4F46E5"/>
  <path d="M7 5.5 V18.5 
           M7 10 
           H14.5 A3.5 3.5 0 0 1 18 13.5 V15 
           A3.5 3.5 0 0 1 14.5 18.5 H7 Z"
        fill="none" stroke="#FFFFFF" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="13" cy="14.25" r="1.25" fill="#FFFFFF"/>
</svg>
```

**Variante en línea** (para fondos oscuros):
```svg
<svg viewBox="0 0 24 24">
  <rect x="1" y="1" width="22" height="22" rx="4.5" 
        fill="none" stroke="currentColor" stroke-width="2"/>
  <!-- paths igual, pero stroke="currentColor" -->
</svg>
```

### Requisitos de Uso

**Espaciado**: equivalente a altura de una `x` alrededor del logo.  
**Nunca**: sombras, gradientes, 3D, rotación, recoloración.  
**Siempre**: ratios originales al escalar.

---

## Pantallas del MVP

### Login

Correo + contraseña + "¿Olvidaste tu contraseña?" (derecha)  
CTA primario + link a registro  
En móvil: full-screen  
En desktop: card 420px centrada

### Register

Empresa + nombre + correo + contraseña (grid 2col en móvil)  
Callout índigo: *"Serás el propietario de la empresa"*  
Crea tenant + OWNER en una operación  
CTA primario + link a login

### Dashboard

- Saludo: *"Hola, [nombre]"* + empresa + fecha
- 4 KPIs: Productos, Stock bajo, Movimientos (hoy), Mi equipo
- Grid: 4col desktop, 2col móvil
- Sección "Requiere atención": alertas por severidad (rojo → ámbar)
- "Últimos movimientos": tabla con círculo de tipo, producto, timestamp, badge, cantidad
- FAB móvil: "+ Registrar movimiento"

### Inventario

- Buscador por nombre o SKU
- Filtros rápidos: "Todos" / "Stock bajo" (con contador)
- **Desktop**: tabla con SKU mono, stock coloreado (NO la fila), badge al final
- **Móvil**: cards con stock prominente izquierda, botones +/− derechos

### Modal Registrar Movimiento

1. 3 botones grandes: ENTRADA / SALIDA / AJUSTE
2. Selector de producto (con búsqueda)
3. Cantidad
4. Confirmar

Total: < 10 segundos en móvil

---

## Modo Oscuro

**No es feature, es función del contexto**: usuario abre la app en mostrador con luz variable, cierra caja de noche.

**Implementación**:
- Colores semánticos suben en luminosidad (verde `#16A34A` → `#4ADE80`)
- Soft backgrounds pasan a `rgba` con alpha bajo (ej. `rgba(34, 197, 94, 0.15)`)
- Sombras se intensifican (alpha 0.3–0.5, función: separar, no elevar)
- Alertas de stock crítico **saltan más** contra fondo negro

**Detector**: `prefers-color-scheme`, persistencia en localStorage.

---

## Accesibilidad WCAG 2.1 AA

- **Contraste**: mínimo 4.5:1 para texto, 3:1 para UI no textual
- **Targets táctiles**: 44×44 px mínimo en móvil
- **Navegación**: Tab, Enter, Esc, Escape para cerrar modales
- **Roles ARIA**: button, dialog, alert, region, etc. en componentes custom
- **Lectores de pantalla**: text alternatives para íconos, aria-label, aria-describedby

```jsx
// ❌ MAL
<div onClick={handleDelete}>Eliminar</div>

// ✅ BIEN
<button
  onClick={handleDelete}
  aria-label="Eliminar este producto"
  className="button button--danger"
>
  Eliminar
</button>
```

---

## Principios Implementados (Sprint 1-3 + UI Polish)

✅ **Todos completados**:
- ✅ Dark mode nativo
- ✅ Tokens, nunca colores hardcoded
- ✅ `tabular-nums` en columnas numéricas
- ✅ Colorear el dato, no el contenedor
- ✅ Semáforo 3 estados
- ✅ Un CTA primario por pantalla
- ✅ Targets 44 px mínimo
- ✅ Flujo movimiento < 10 seg
- ✅ Mobile-first real
- ✅ Feedback inmediato (Skeleton, toast, error inline)

---

**Sistema de diseño mantenido por**: Equipo Brixo  
**Última actualización**: 29 de abril de 2026  
**Próxima revisión**: Al completar post-MVP (landing, equipo, auditoría)
