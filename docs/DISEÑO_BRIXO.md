# Sistema de Diseño Brixo

**Versión**: 1.0 · **Fecha**: 19 de abril de 2026 · **Autor**: Diseño + Claude  
**Estado**: Propuesta aprobada — lista para Fase 5 Frontend  
**Archivo complementario**: `BrixoMockup.jsx` (maqueta React funcional con tema claro/oscuro)

---

## 1. Filosofía del sistema

El sistema visual de Brixo se construye sobre una tensión productiva entre dos principios del producto que a primera vista parecen contradecirse:

- *"Debe ser lo más atractivo posible."* → empuja hacia personalidad visual.
- *"Si requiere capacitación, está mal diseñado."* → empuja hacia sobriedad.

La resolución no es elegir un extremo. **Atractivo no es decorado.** Revolut, Cash App, Linear Mobile y Robinhood son interfaces distintivas y no contienen un solo degradado gratuito. Su atractivo viene de tres fuentes medibles: jerarquía visual clara, un color de marca que aparece con propósito y microdetalles (tipografía, espaciado, estados activos) ejecutados con precisión.

Brixo adopta la misma disciplina: **personalidad en la marca, sobriedad en los datos.**

### Reglas no negociables del sistema

1. **Color con propósito.** Cada color comunica algo específico. No hay paletas decorativas.
2. **Números sin distorsión.** Todas las columnas numéricas usan `font-variant-numeric: tabular-nums` para que los dígitos no bailen al scrollear.
3. **Teñir el dato, no el contenedor.** En listas largas se colorea el número crítico, nunca la fila entera.
4. **Mismo componente, dos modos.** Todo lo que existe en claro debe existir y funcionar en oscuro.
5. **Mobile-first real.** Targets táctiles de 44 px mínimo. Base tipográfica 15 px en móvil, no 14 px.
6. **Un verbo dominante por pantalla.** El botón primario es único y obvio en cada vista.

---

## 2. Psicología del color aplicada

### 2.1 El color de marca: índigo eléctrico `#4F46E5`

La "psicología del color" es menos mística de lo que suele venderse. Lo que sí está documentado y es útil para Brixo:

**Los tonos azul-violeta profundos** transmiten confianza, precisión y control en contextos donde el usuario registra información verdadera sobre dinero o inventario. Es la familia dominante en productos financieros y de datos modernos — Stripe, Linear, Notion, Plaid.

**Por qué índigo y no azul clásico.** El azul `#2563EB` (azul corporativo) es una elección segura pero anónima: Facebook, LinkedIn, Dropbox y miles más lo usan. El índigo `#4F46E5` tiene más saturación y una inclinación al violeta que lo hace memorable, modernizándolo sin perder las connotaciones de confianza. En producto SaaS para pymes latinoamericanas — un espacio visualmente saturado de azules genéricos — el índigo diferencia sin alarmar.

**Cómo aparece en Brixo.** El índigo es dominante en superficies de marca (logo, botón primario, estados activos, links importantes) y casi ausente del contenido transaccional (tablas de inventario, filas de movimientos). Esto es deliberado: si el índigo estuviera en todas partes, perdería significado; al reservarlo para la identidad y la acción, cada aparición comunica *"esto es Brixo"* o *"esto es lo siguiente a hacer."*

### 2.2 Los colores semánticos: dirección y urgencia

Verde, rojo y ámbar no son decoración. Codifican el significado de negocio del movimiento de stock:

| Color | Valor en claro | Valor en oscuro | Significado en Brixo | Razonamiento |
|-------|----------------|-----------------|----------------------|--------------|
| Verde | `#16A34A` | `#4ADE80` | **Entrada** de inventario | Convención cultural compartida: tickets, flechas de bolsa, semáforos. Cuando el usuario ve verde, ya sabe que algo sumó sin leer. |
| Rojo | `#DC2626` | `#F87171` | **Salida** de inventario, stock bajo | Misma convención. El rojo activa atención sin explicación. Reservado para lo que requiere acción ahora. |
| Ámbar | `#D97706` | `#FBBF24` | **Ajuste** manual, stock cerca del mínimo | El ajuste es la acción que más errores esconde en un negocio pequeño. El ámbar dice *"revísalo"* sin la alarma del rojo. |

**Decisión crítica: un semáforo de tres tiempos en la tabla de inventario.** No hay solo "en stock" vs "stock bajo". Hay tres estados:

- **En stock** (verde suave) — el stock está por encima del mínimo con holgura.
- **Al límite** (ámbar) — el stock está por encima del mínimo pero cerca, conviene anticipar reposición.
- **Stock bajo** (rojo) — el stock está por debajo del mínimo, requiere acción.

Este tercer estado ámbar es lo que convierte a Brixo en un sistema que *anticipa* en lugar de solo *reportar*. Un dueño que ve tres productos en ámbar tiene una semana para ordenar a proveedor; uno que solo ve rojo ya está en crisis.

### 2.3 Modo oscuro: función antes que estética

El modo oscuro en Brixo no es tendencia, es función del contexto de uso:

- El usuario típico (dueño de tienda, cajero) abre la app en mostradores con luz variable.
- Muchas veces la usa de noche cerrando caja, en entornos con iluminación pobre.
- Reduce fatiga ocular en sesiones largas de conteo físico.
- Hace que las alertas de stock bajo **salten más** contra fondo oscuro que contra blanco.

**Implementación.** Los colores semánticos en oscuro no son los mismos tonos del modo claro. Se suben en luminosidad (ej. verde `#16A34A` → `#4ADE80`) para mantener contraste con el fondo negro. Los *softs* (fondos de píldoras y alertas) pasan de colores planos a `rgba` con alpha bajo (ej. `rgba(239,68,68,0.15)`) para que los textos semánticos brillen en lugar de verse apagados.

**Consecuencia visual.** Una alerta de stock crítico en oscuro es visualmente más intensa que en claro. Esto es intencional: el OWNER cerrando caja de noche abre la app y las alertas rojas se imponen sobre el fondo negro como señales luminosas.

---

## 3. Tokens de diseño

### 3.1 Paleta completa

#### Modo claro

```ts
const light = {
  // Neutros (escala zinc)
  bgCanvas:    "#FAFAFA",   // fondo de la app
  bgSurface:   "#FFFFFF",   // tarjetas, modales, inputs
  bgSubtle:    "#F4F4F5",   // filas alternas, hover sutil
  bgMuted:     "#E4E4E7",   // separadores fuertes
  border:      "#E4E4E7",
  borderStrong:"#D4D4D8",

  textPrimary:  "#18181B",  // títulos, datos críticos
  textSecondary:"#52525B",  // descripciones, labels
  textTertiary: "#71717A",  // hints, metadatos
  textDisabled: "#A1A1AA",

  // Marca
  brand:         "#4F46E5",
  brandHover:    "#4338CA",
  brandSoft:     "#EEF2FF",
  brandSoftText: "#3730A3",

  // Semánticos
  success:     "#16A34A",
  successSoft: "#F0FDF4",
  successText: "#15803D",
  danger:      "#DC2626",
  dangerSoft:  "#FEF2F2",
  dangerText:  "#B91C1C",
  warning:     "#D97706",
  warningSoft: "#FFFBEB",
  warningText: "#B45309",
  info:        "#0891B2",
  infoSoft:    "#ECFEFF",
  infoText:    "#0E7490",
}
```

#### Modo oscuro

```ts
const dark = {
  bgCanvas:    "#09090B",
  bgSurface:   "#18181B",
  bgSubtle:    "#27272A",
  bgMuted:     "#3F3F46",
  border:      "#27272A",
  borderStrong:"#3F3F46",

  textPrimary:  "#FAFAFA",
  textSecondary:"#A1A1AA",
  textTertiary: "#71717A",
  textDisabled: "#52525B",

  brand:         "#818CF8",                      // subido en luminosidad
  brandHover:    "#A5B4FC",
  brandSoft:     "rgba(99, 102, 241, 0.15)",     // alpha bajo
  brandSoftText: "#C7D2FE",

  success:     "#4ADE80",
  successSoft: "rgba(34, 197, 94, 0.15)",
  successText: "#86EFAC",
  danger:      "#F87171",
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

### 3.2 Tipografía

**Familia principal**: Inter — sans-serif geométrica con alto contraste entre pesos y soporte completo para `tabular-nums` y `cv11` (disambiguación de `1/l/I`).

**Familia monoespaciada**: JetBrains Mono — para SKUs, IDs de producto, UUIDs, fragmentos de código técnico.

```ts
const fontStack = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const monoStack = '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace';
```

**Escala modular 1.125 (cuarta menor)** — más pequeña que la típica 1.25, porque en interfaces densas de datos los saltos grandes desperdician espacio vertical.

| Uso | Tamaño | Peso | Line-height | Notas |
|-----|--------|------|-------------|-------|
| Display (logo, número hero) | 28–32 px | 600 | 1.0 | Solo en landing y login |
| H1 página | 22–26 px | 600 | 1.2 | `letter-spacing: -0.02em` |
| H2 sección | 18–20 px | 600 | 1.3 | |
| H3 card | 14 px | 600 | 1.4 | `letter-spacing: -0.01em` |
| Body | 14 px (móvil 15 px) | 400 | 1.5 | Default del contenido |
| Label form | 13 px | 500 | 1.4 | |
| Caption | 12 px | 400 | 1.4 | Metadatos, timestamps |
| Micro | 11 px | 500–600 | 1.3 | Píldoras de estado, badges |

**Features tipográficas obligatorias:**

```css
font-feature-settings: "cv11", "ss01", "ss03";   /* disambiguación de caracteres */
font-variant-numeric: tabular-nums;              /* solo en columnas numéricas */
```

### 3.3 Espaciado y radio

**Espaciado** — escala base 4 px, múltiplos: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.  
**Radio** — 6 px (badges), 8 px (inputs, botones), 10 px (cards en móvil), 12 px (cards desktop), 14–16 px (superficies auth), 50% (avatares, FAB).

### 3.4 Sombras

En modo claro se usan con moderación — solo para elevar tarjetas flotantes:

```ts
shadowSm: "0 1px 2px rgba(0,0,0,0.04)"
shadowMd: "0 4px 12px rgba(0,0,0,0.06)"
shadowLg: "0 10px 30px rgba(0,0,0,0.08)"
```

En modo oscuro las sombras se intensifican (alpha 0.3–0.5) pero su función es distinta: no "elevar" sino "separar" superficies que ya son oscuras.

---

## 4. Componentes base

### 4.1 Botones

| Tipo | Uso | Apariencia |
|------|-----|------------|
| **Primary** | Acción principal de la pantalla. Uno por vista. | Fondo índigo `brand`, texto blanco, radio 10 px, padding vertical 12 px, altura mínima 48 px. |
| **Ghost** | Acciones secundarias. Varias permitidas. | Fondo transparente, borde 1 px `border`, texto `textPrimary`, radio 10 px. |
| **Icon-only** | Acciones repetitivas en tablas/headers. | 32×32 px, fondo transparente, borde sutil, radio 8 px. |
| **FAB** (móvil) | Acción creadora en pantallas de listado. | 56×56 px circular, fondo índigo, sombra `brand` con alpha. |

### 4.2 Inputs

Altura 44 px (target táctil). Borde 1 px `border`, radio 10 px, padding 11×14 px. Cuando llevan ícono, padding-left 44 px con ícono absoluto a 14 px del borde izquierdo. En foco: borde `brand` + box-shadow sutil `brand` con alpha 0.15.

### 4.3 Cards

- **Superficie (card estándar)**: `bgSurface`, borde 1 px `border`, radio 12 px, padding 14–16 px.
- **Métrica (KPI)**: `bgSurface` con borde, padding 14×16, título pequeño 12 px, valor 26–28 px peso 600 con `tabular-nums`.
- **Alerta**: fondo `softBackground` del color semántico, borde izquierdo 3 px `solidColor`, **borde derecho redondeado pero izquierdo recto** (regla: no redondear bordes unilaterales).

### 4.4 Badges (píldoras de estado)

Radio 6 px, padding 3×8 px, tamaño 11 px peso 600. El fondo es el `soft` del color semántico; el texto es el `text` del mismo color. Nunca negro sobre color — la regla de accesibilidad es usar el tono 800–900 de la misma familia para el texto sobre fondo tintado.

### 4.5 Tabla responsiva

En **desktop** (≥ 1024 px): tabla HTML tradicional con encabezados sticky, filas con hover sutil `bgSubtle`, columnas numéricas con `tabular-nums` y alineación a la derecha.

En **móvil** (< 768 px): cada fila se transforma en una card con la información reorganizada verticalmente. El stock queda como número grande a la izquierda, el badge de estado a la derecha, y dos botones de acción (+/−) directamente accesibles sin necesidad de entrar al detalle.

---

## 5. Responsive y breakpoints

### 5.1 Breakpoints

```ts
const breakpoints = {
  mobile:  "< 768px",   // phones, portrait tablets
  tablet:  "768-1023",  // landscape tablets
  desktop: ">= 1024px"  // laptops y más grandes
}
```

### 5.2 Cambios de layout por breakpoint

| Elemento | Móvil | Desktop |
|----------|-------|---------|
| Navegación principal | **Bottom nav** de 4 íconos con labels | **Sidebar** de 240 px con logo, 5 ítems y perfil |
| Topbar | Logo + icon buttons | Sin logo (ya está en sidebar), solo icon buttons |
| Dashboard KPIs | 2 columnas | 4 columnas |
| Dashboard secundario | 1 columna | 1.5fr + 1fr |
| Inventario | **Cards** con acciones inline (+/−) | **Tabla** con hover y acciones al final |
| CTA "Registrar movimiento" | Botón ancho debajo de KPIs + FAB en inventario | Botón inline junto al título |
| Formularios auth | Pantalla completa, padding 24 px | Card centrada 420 px, padding 40 px |

### 5.3 Targets táctiles

**Regla mínima**: 44×44 px para cualquier elemento tocable en móvil (alineado con Apple HIG y WCAG 2.5.5). Esto incluye botones, enlaces, toggles, items de navegación, celdas accionables en listas.

### 5.4 Safe areas iOS

El bottom nav usa `padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px))` para respetar la barra de gestos del iPhone X+.

---

## 6. Pantallas del MVP

El sistema está especificado para cuatro pantallas principales que cubren el flujo completo del MVP:

### 6.1 Login
Formulario mínimo — correo + contraseña. Campo de ayuda *"¿Olvidaste tu contraseña?"* alineado a la derecha. CTA primario. Enlace secundario a registro al pie. En móvil ocupa toda la pantalla; en desktop es una card de 420 px centrada.

### 6.2 Registro SaaS
Una sola pantalla con cuatro campos: empresa, nombre, correo, contraseña. Respeta el `SignUpUseCase` del backend (Fase 4D) que crea `tenant` + usuario OWNER en una sola operación. Incluye un callout índigo explicando *"Serás la propietaria de la empresa"* para contextualizar el rol sin jerga técnica.

### 6.3 Dashboard (Panel)
Saludo personal con fecha/hora. Grid de 4 KPIs (Productos, En stock, Stock bajo, Movimientos hoy). En móvil, un CTA ancho *"Registrar movimiento"* debajo de los KPIs. Debajo, dos columnas: "Movimientos recientes" (lista con íconos de dirección y cantidades coloreadas) y "Requiere atención" (alertas priorizadas por severidad).

### 6.4 Inventario
Header con conteo y contexto. Buscador por nombre o SKU. Filtros rápidos (Todos / Stock bajo con contador). En móvil cada producto es una card con stock prominente y botones +/− directos. En desktop es una tabla con SKU en monoespaciada, stock con color según estado, y el badge al final.

---

## 7. Diseño del logo

### 7.1 Requisitos del logo

| Requisito | Valor |
|-----------|-------|
| Color primario | `#4F46E5` (índigo eléctrico) |
| Tamaños objetivo | 16 px (favicon) hasta 256 px (splash/onboarding) |
| Legibilidad a 24 px | Debe ser inmediato en el topbar móvil |
| Variantes requeridas | Monograma aislado, logotipo horizontal, versión monocromática |
| Modos | Funciona idéntico en fondos claros y oscuros |
| Formato técnico | SVG optimizado, paths sin `stroke`, sin efectos de filtro |

### 7.2 Concepto visual

El monograma es una **"b"** en minúscula estilizada como dos trazos que construyen un cubo tridimensional. Lee simultáneamente como letra y como caja — conectando el nombre con el dominio sin caer en la ilustración literal (cajita genérica, código de barras, carrito).

La geometría es deliberadamente cuadrada: 24×24 unidades de viewBox, esquinas con radio 4, trazos equilibrados en grosor. El efecto es de precisión geométrica — el mismo lenguaje visual de marcas SaaS que transmiten control y estructura (Linear, Framer, Vercel).

### 7.3 Variante principal: monograma

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="Brixo">
  <title>Brixo</title>
  <rect x="0" y="0" width="24" height="24" rx="5" fill="#4F46E5"/>
  <path
    d="M7 5.5 V18.5 
       M7 10 
       H14.5
       A3.5 3.5 0 0 1 18 13.5
       V15
       A3.5 3.5 0 0 1 14.5 18.5
       H7
       Z"
    fill="none"
    stroke="#FFFFFF"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"/>
  <circle cx="13" cy="14.25" r="1.25" fill="#FFFFFF"/>
</svg>
```

**Anatomía del monograma:**

- **Fondo**: cuadrado índigo con radio 5 — da presencia visual y permite que el logo funcione incluso cuando está aislado contra cualquier color de fondo.
- **Trazo vertical izquierdo**: el "asta" de la `b`, centrado, grosor 2.
- **Curva de la panza**: forma semi-cerrada con radio 3.5 — la misma proporción de radio que usan los cards del sistema (coherencia visual con los componentes).
- **Punto interior**: círculo sólido que evoca un "item" o "producto" dentro de una caja, sin ser literal. Conecta la abstracción con el dominio de inventario.

### 7.4 Variante en línea (para fondos oscuros o contextos monocromáticos)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="Brixo">
  <title>Brixo</title>
  <rect x="1" y="1" width="22" height="22" rx="4.5" 
        fill="none" stroke="currentColor" stroke-width="2"/>
  <path
    d="M7 5.5 V18.5 
       M7 10 
       H14.5
       A3.5 3.5 0 0 1 18 13.5
       V15
       A3.5 3.5 0 0 1 14.5 18.5
       H7
       Z"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"/>
  <circle cx="13" cy="14.25" r="1.25" fill="currentColor"/>
</svg>
```

Usa `currentColor` para que herede el color del contenedor — se integra limpio en cualquier componente de texto sin necesidad de hacer override.

### 7.5 Logotipo horizontal (monograma + wordmark)

Para landing, documentos, email footer y contextos donde la marca tiene espacio para extenderse:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 40" role="img" aria-label="Brixo">
  <title>Brixo</title>
  <rect x="2" y="8" width="24" height="24" rx="5" fill="#4F46E5"/>
  <g transform="translate(2, 8)">
    <path
      d="M7 5.5 V18.5 
         M7 10 
         H14.5
         A3.5 3.5 0 0 1 18 13.5
         V15
         A3.5 3.5 0 0 1 14.5 18.5
         H7
         Z"
      fill="none"
      stroke="#FFFFFF"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"/>
    <circle cx="13" cy="14.25" r="1.25" fill="#FFFFFF"/>
  </g>
  <text x="36" y="27" 
        font-family="Inter, -apple-system, sans-serif" 
        font-size="22" 
        font-weight="600" 
        letter-spacing="-0.02em" 
        fill="#18181B">Brixo</text>
</svg>
```

**Espaciado**: la distancia entre monograma y wordmark es 10 px (equivalente a la altura de una `x` del tipo) — lo suficiente para que se lean como dos entidades relacionadas sin pegarse.

**Peso del wordmark**: 600 (semibold), no 700 (bold). La combinación del monograma sólido con el texto bold se vuelve visualmente pesada; el semibold equilibra.

**Color del wordmark**: `#18181B` en claro, `#FAFAFA` en oscuro. Nunca el índigo — duplicaría el color y saturaría.

### 7.6 Variante para favicon (16 × 16 px)

En tamaños muy pequeños, el punto interior del monograma se pierde. La versión favicon simplifica a solo el asta y la panza:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="img" aria-label="Brixo">
  <title>Brixo</title>
  <rect width="16" height="16" rx="3" fill="#4F46E5"/>
  <path
    d="M5 3.5 V12.5 M5 6.5 H10 A2.5 2.5 0 0 1 12.5 9 V10 A2.5 2.5 0 0 1 10 12.5 H5 Z"
    fill="none" stroke="#FFFFFF" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 7.7 Reglas de uso del logo

**Hacer:**
- Mantener un espacio libre alrededor del logo equivalente a la altura de una `x` del monograma. Nada puede invadir ese espacio.
- Usar siempre los valores hex oficiales — no re-pintar en otros tonos de azul o violeta.
- Respetar el ratio original al escalar — nunca estirar horizontal o verticalmente.

**No hacer:**
- No aplicar sombras, degradados, efectos de brillo o 3D al monograma.
- No invertir los colores (índigo sobre blanco) en el monograma principal — usar la variante en línea para eso.
- No rotar el monograma. Siempre vertical.
- No usar el wordmark sin el monograma en interfaces de producto. El monograma solo sí puede usarse aislado.
- No recolorear el wordmark a índigo — siempre en `textPrimary` del tema activo.

### 7.8 Exportaciones requeridas

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `logo-mark.svg` | 24×24 viewBox | Componente React, topbar, sidebar |
| `logo-horizontal.svg` | 140×40 viewBox | Landing, email, footer |
| `logo-mono-line.svg` | 24×24 viewBox | Fondos oscuros, prints monocromáticos |
| `favicon.svg` | 16×16 viewBox | Favicon moderno |
| `favicon.ico` | 16, 32, 48 px | Compatibilidad navegadores antiguos |
| `apple-touch-icon.png` | 180×180 px | iOS home screen |
| `og-image.png` | 1200×630 px | Open Graph, Twitter cards |

### 7.9 Componente React del logo

```jsx
export function BrixoLogo({ size = 24, variant = "solid", className }) {
  if (variant === "solid") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" 
           className={className} role="img" aria-label="Brixo">
        <title>Brixo</title>
        <rect width="24" height="24" rx="5" fill="#4F46E5"/>
        <path d="M7 5.5 V18.5 M7 10 H14.5 A3.5 3.5 0 0 1 18 13.5 V15 
                 A3.5 3.5 0 0 1 14.5 18.5 H7 Z"
              fill="none" stroke="#FFFFFF" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="13" cy="14.25" r="1.25" fill="#FFFFFF"/>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" 
         className={className} role="img" aria-label="Brixo">
      <title>Brixo</title>
      <rect x="1" y="1" width="22" height="22" rx="4.5" 
            fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 5.5 V18.5 M7 10 H14.5 A3.5 3.5 0 0 1 18 13.5 V15 
               A3.5 3.5 0 0 1 14.5 18.5 H7 Z"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="13" cy="14.25" r="1.25" fill="currentColor"/>
    </svg>
  );
}
```

**Uso:**

```jsx
<BrixoLogo size={32} />                  // sidebar desktop
<BrixoLogo size={24} />                  // topbar móvil
<BrixoLogo size={56} />                  // login / register
<BrixoLogo variant="line" size={24} />   // sobre fondos oscuros custom
```

---

## 8. Decisiones pendientes y next steps

### 8.1 Antes de implementar Fase 5

Tres decisiones de producto que conviene resolver antes de escribir el primer componente:

1. **Estados de carga y vacío.** Skeletons shimmer para cards de producto, empty states con CTA contextual (*"Aún no tienes productos, agrega el primero"*), error states para fallos de red y conflictos de servidor. Define el 20% del uso real.

2. **Modal de registrar movimiento en móvil.** La acción más frecuente del OPERATOR. Propuesta: bottom sheet con tres botones grandes ENTRADA / SALIDA / AJUSTE, luego selector de producto (con búsqueda) y cantidad. Evita el formulario tradicional en móvil.

3. **Vistas por rol.** OWNER, ADMIN, MANAGER y OPERATOR deben tener experiencias distintas. El OPERATOR ve solo *"Registrar movimiento"* + lista de productos con acciones; el OWNER ve todo. La diferencia debe ser invisible para cada rol — no basta ocultar menús, hay que rediseñar las vistas.

### 8.2 Orden de implementación sugerido

1. **Tokens + ThemeProvider** — extraer los tokens a `src/theme/tokens.ts`, crear `ThemeProvider` con React Context, soporte de `localStorage` para preferencia de tema.
2. **Componentes base** — Button, Input, Card, Badge, Table, BottomSheet, Toast. Storybook recomendado.
3. **BrixoLogo** — componente React del logo + favicon + og-image.
4. **Layout base** — AppShell con responsive sidebar/bottom-nav, TopBar, rutas privadas.
5. **Pantallas auth** — LoginPage, RegisterPage con el `SignUpUseCase` del backend.
6. **Pantallas producto** — DashboardPage, InventoryPage, ProductFormModal, MovementFormModal.
7. **Pantallas soporte** — AuditLogPage, TeamPage, perfil.
8. **Pulido** — empty states, skeletons, animaciones de transición, accesibilidad WCAG 2.1 AA.

---

## 9. Referencias

**Productos cuyo lenguaje visual influyó el sistema:**

- Linear — precisión geométrica, índigo como marca, escala tipográfica apretada.
- Stripe Dashboard — uso del color semántico en tablas financieras.
- Cash App — personalidad de marca en contexto transaccional.
- Notion — densidad de información sin perder claridad.
- Framer — contraste entre acción primaria y contenido.

**Documentación técnica:**

- WCAG 2.1 AA — contraste mínimo 4.5:1 para texto, 3:1 para UI no textual.
- Apple Human Interface Guidelines — targets táctiles 44 pt, safe areas.
- Material Design 3 — referencia de breakpoints responsive.
- Refactoring UI (Adam Wathan, Steve Schoger) — jerarquía tipográfica y uso funcional del color.

---

**Documento mantenido por**: Equipo de Diseño Brixo  
**Última actualización**: 19 de abril de 2026  
**Próxima revisión**: al cierre de Fase 5 Frontend