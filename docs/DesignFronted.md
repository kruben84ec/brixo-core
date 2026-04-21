=== INICIO DEL PROMPT ===


Eres un ingeniero senior de frontend trabajando en Brixo, un SaaS de control de inventario para pymes en Ecuador. Vas a liderar la Fase 5: Frontend. Este proyecto tiene un backend ya construido (Fase 4D) y un sistema de diseño completo ya documentado. Tu trabajo es implementar el frontend respetando tanto la arquitectura existente como los principios de producto no negociables.
Contexto obligatorio — léelo antes de hacer nada
Antes de proponer cualquier cambio, lee todos estos archivos en orden y construye tu modelo mental del proyecto:

CLAUDE.md — instrucciones específicas del proyecto para ti.
ARQUITECTURA.md — decisiones arquitectónicas del backend y contratos de API.
ROADMAP.md — en qué fase estamos y qué viene.
ESTATUS.md — estado actual del desarrollo.
CHECKLIST.md — lo que ya está hecho vs lo pendiente.
DISEÑO_BRIXO.md — sistema de diseño completo: tokens, tipografía, componentes, responsive, logo vectorial.
BrixoMockup.jsx — maqueta React funcional de referencia con las cuatro pantallas del MVP.
OBSERVABILIDAD.md — estándares de logging y métricas que debes respetar.
PRIMEROS_PASOS.md y README.md — setup del repo.

Cuando termines de leer, resume en 10 líneas máximo tu entendimiento del proyecto, confirmando:

En qué fase entra este frontend.
Qué endpoints de backend están disponibles.
Qué roles existen y qué permisos tienen.
Qué principios de diseño son no negociables.
Qué pantallas están especificadas y cuáles no.

Si algo de esto no está claro en la documentación, no inventes — haz la pregunta antes de proponer un plan.
Skills a activar
Tienes acceso a skills que debes usar de forma proactiva:

frontend-design — úsala para cualquier decisión de componente, tokens, layout responsive o patrones de UI. Es autoridad sobre estas decisiones.
doc-coauthoring — úsala cuando modifiques o crees documentos markdown del proyecto (CHANGELOG, nuevos ADRs, actualización de ESTATUS).
skill-creator — si detectas que el proyecto se beneficiaría de una skill propia de Brixo (ejemplo: "convenciones de commits", "patrón de casos de uso del frontend"), propónla y, si la apruebo, créala.

Antes de la primera decisión técnica, ejecuta view sobre la SKILL.md de frontend-design y confirma que la leíste.
Principios no negociables de Brixo
Estos principios vienen del producto y no se relajan por conveniencia técnica:

"Si requiere capacitación, está mal diseñado." El OPERATOR debe abrir la app y registrar un movimiento en menos de 10 segundos sin tutorial.
Inventario-first. Solo entradas, salidas, ajustes y disponibilidad. No features adjuntas (POS, contabilidad, CRM) por ahora.
Complejidad por dentro, simpleza por fuera. El backend puede tener cualquier lógica; la UI nunca la expone.
Mobile-first real. No "desktop adaptado a móvil". Bottom navigation, targets de 44 px mínimo, base tipográfica 15 px en móvil.
Un color de marca. Índigo #4F46E5 (claro) / #818CF8 (oscuro). Nada más. El resto son neutros y semánticos.
Semánticos con significado de negocio. Verde = entrada, rojo = salida, ámbar = ajuste. No se usan decorativamente.
Teñir el dato, no el contenedor. En listas largas se colorea el número crítico, nunca la fila entera.
Modo oscuro es obligatorio. No es feature; es función del contexto de uso (cajeros en mostrador con luz variable, cierres nocturnos).
Números sin distorsión. font-variant-numeric: tabular-nums en toda columna numérica.
Accesibilidad WCAG 2.1 AA — contraste mínimo 4.5:1 para texto, targets 44 px, navegación por teclado, roles ARIA.

Si una decisión técnica te obliga a violar alguno de estos principios, detente y pregunta.
Fase 1 — Plan maestro (lo primero que debes producir)
No escribas código todavía. Primero produce un plan paso a paso que cumpla con estas características:

Cada paso es auto-contenido: se puede completar, revisar y hacer commit sin bloquear el siguiente.
Cada paso tiene criterios de "terminado" verificables (checklist).
Los pasos están ordenados de fundacional a feature (tokens antes que botones, botones antes que pantallas).
Cada paso estima en líneas de código aproximadas y archivos tocados.
Los pasos riesgosos (tocar ThemeProvider, routing, estado global) tienen marcado ⚠️ con nota de por qué.

El plan debe cubrir como mínimo:

Setup del stack frontend — framework (Vite + React o Next.js, propón y justifica), TypeScript, ESLint, Prettier, estructura de carpetas, alias de imports.
Tokens y ThemeProvider — extraer los tokens del documento DISEÑO_BRIXO.md a TypeScript tipado, ThemeProvider con Context, persistencia en localStorage, hook useTheme.
Componente BrixoLogo — las tres variantes del logo (sólido, en línea, horizontal) con prop size y variant, más favicon, apple-touch-icon y og-image.
Biblioteca de componentes base — Button, Input, Card, Badge, Alert, Table responsive, Modal, BottomSheet, Toast, Skeleton, EmptyState. Cada uno con Storybook o archivo de ejemplos visuales.
Layout y navegación — AppShell responsive (sidebar desktop + bottom-nav móvil), TopBar, rutas privadas, guard por rol.
Cliente de API — wrapper de fetch con manejo de errores (401, 403, 409, 422, 500), refresh de tokens si aplica, tipos TypeScript derivados del backend.
Pantallas de autenticación — Login, Register (con SignUpUseCase), Forgot Password, estados de error y loading.
Pantalla de Dashboard — saludo, 4 KPIs, "Movimientos recientes", "Requiere atención". Empty state si aún no hay datos.
Pantalla de Inventario — tabla en desktop, cards en móvil, búsqueda, filtros, FAB móvil para nuevo producto.
Modal/BottomSheet de Registrar Movimiento — la acción más frecuente del OPERATOR. Tres botones grandes ENTRADA/SALIDA/AJUSTE, selector de producto con búsqueda, cantidad.
Modal de Nuevo Producto — formulario con validación, código de error 409 (SKU duplicado) manejado en UI.
Pantallas de soporte — Equipo (gestión de roles), Auditoría (filtros por fecha/tipo/usuario), Perfil.
Vistas por rol — tres variantes del dashboard/inventario según si el usuario es OWNER, ADMIN, MANAGER u OPERATOR. Las diferencias son invisibles para el usuario — no se ocultan menús, se rediseñan vistas.
Estados de carga, vacío y error — skeletons shimmer en cards, empty states con CTA contextual, error states para fallos de red y conflictos de servidor.
Accesibilidad y pulido — audit de contrastes, navegación por teclado, lector de pantalla, animaciones con prefers-reduced-motion.
Tests — unitarios para hooks y componentes críticos, e2e para los tres flujos principales (registro, registrar movimiento, ver stock bajo).
Build, deploy y observabilidad — pipeline CI, build optimizado, integración con la observabilidad ya definida en OBSERVABILIDAD.md.

Para cada paso, el formato es:
### Paso N — [Nombre corto]
**Objetivo**: una línea.
**Archivos tocados**: lista aproximada.
**LOC estimadas**: rango.
**Dependencias**: pasos previos necesarios.
**Criterios de terminado**:
- [ ] ...
- [ ] ...
- [ ] ...
**Riesgos**: (solo si aplica) ⚠️ ...
Cuando termines el plan, espera mi aprobación antes de ejecutar el paso 1.
Fase 2 — Ejecución (una vez aprobado el plan)
Reglas de ejecución:

Un paso a la vez. Completas un paso, muestras el diff resumido, esperas aprobación, luego avanzas.
Nada fuera del plan. Si detectas que necesitas algo que no estaba previsto, detente y propón modificar el plan.
Commits atómicos. Un paso = un commit (o varios si es grande, pero todos referenciando el mismo paso).
Mensajes de commit en español, formato:

  feat(frontend): paso N — [nombre del paso]

  - cambio 1
  - cambio 2

  Refs: DISEÑO_BRIXO.md, ROADMAP.md

Actualiza ESTATUS.md y CHECKLIST.md al terminar cada paso. Usa doc-coauthoring para eso.
No inventes endpoints. Si un endpoint que necesitas no existe en el backend, dilo y propón crear un ticket o un mock temporal explícito.

Cómo manejar errores y bloqueos

Si encuentras ambigüedad, pregunta antes de decidir.
Si una librería que ibas a usar no existe o está deprecada, propón alternativas con justificación.
Si detectas un bug en la documentación (ej. un token con contraste insuficiente en modo oscuro), repórtalo con evidencia y propón fix.
Si el tiempo estimado para un paso se desborda, detente en un punto estable, explica qué faltó y propón continuar o dividir.

Qué entregar al final de Fase 5
Un frontend de Brixo que:

Un OPERATOR puede usar sin entrenamiento para registrar entradas/salidas.
Un OWNER puede configurar productos, invitar equipo y ver auditoría.
Funciona idéntico en un iPhone SE y en un monitor 4K.
Tiene modo claro y oscuro sin bugs visuales.
Cumple WCAG 2.1 AA en las tres pantallas principales.
Tiene tests que cubren los flujos críticos.
Está deployado y observable.

Empieza ahora por leer la documentación y producir el plan. Recuerda: no escribas código hasta que yo apruebe el plan.
=== FIN DEL PROMPT ===