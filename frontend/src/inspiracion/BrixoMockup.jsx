import React, { useState, useEffect, useMemo } from "react";

/* ============================================================
   BRIXO — Maqueta responsive con modo claro/oscuro
   Mobile-first. Un solo componente para la demo; en producción
   se divide en /components, /pages, /stores, /services.
   ============================================================ */

/* ---------- Sistema de tokens (claro / oscuro) ------------- */
const tokens = {
  light: {
    // Neutros
    bgCanvas: "#FAFAFA",
    bgSurface: "#FFFFFF",
    bgSubtle: "#F4F4F5",
    bgMuted: "#E4E4E7",
    border: "#E4E4E7",
    borderStrong: "#D4D4D8",
    textPrimary: "#18181B",
    textSecondary: "#52525B",
    textTertiary: "#71717A",
    textDisabled: "#A1A1AA",
    // Marca — índigo eléctrico
    brand: "#4F46E5",
    brandHover: "#4338CA",
    brandSoft: "#EEF2FF",
    brandSoftText: "#3730A3",
    // Semánticos
    success: "#16A34A",
    successSoft: "#F0FDF4",
    successText: "#15803D",
    danger: "#DC2626",
    dangerSoft: "#FEF2F2",
    dangerText: "#B91C1C",
    warning: "#D97706",
    warningSoft: "#FFFBEB",
    warningText: "#B45309",
    info: "#0891B2",
    infoSoft: "#ECFEFF",
    infoText: "#0E7490",
    // Overlays
    overlay: "rgba(24, 24, 27, 0.5)",
    shadowSm: "0 1px 2px rgba(0,0,0,0.04)",
    shadowMd: "0 4px 12px rgba(0,0,0,0.06)",
    shadowLg: "0 10px 30px rgba(0,0,0,0.08)",
  },
  dark: {
    bgCanvas: "#09090B",
    bgSurface: "#18181B",
    bgSubtle: "#27272A",
    bgMuted: "#3F3F46",
    border: "#27272A",
    borderStrong: "#3F3F46",
    textPrimary: "#FAFAFA",
    textSecondary: "#A1A1AA",
    textTertiary: "#71717A",
    textDisabled: "#52525B",
    // Marca en oscuro: subir luminosidad para contraste
    brand: "#818CF8",
    brandHover: "#A5B4FC",
    brandSoft: "rgba(99, 102, 241, 0.15)",
    brandSoftText: "#C7D2FE",
    // Semánticos oscuros
    success: "#4ADE80",
    successSoft: "rgba(34, 197, 94, 0.15)",
    successText: "#86EFAC",
    danger: "#F87171",
    dangerSoft: "rgba(239, 68, 68, 0.15)",
    dangerText: "#FCA5A5",
    warning: "#FBBF24",
    warningSoft: "rgba(245, 158, 11, 0.15)",
    warningText: "#FCD34D",
    info: "#22D3EE",
    infoSoft: "rgba(6, 182, 212, 0.15)",
    infoText: "#67E8F9",
    overlay: "rgba(0, 0, 0, 0.7)",
    shadowSm: "0 1px 2px rgba(0,0,0,0.3)",
    shadowMd: "0 4px 12px rgba(0,0,0,0.4)",
    shadowLg: "0 10px 30px rgba(0,0,0,0.5)",
  },
};

/* ---------- Typography scale --------------------------------
   Escala en móvil: base 15px, no 14px
   Inter via system + tabular nums para columnas numéricas
------------------------------------------------------------- */
const fontStack =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const monoStack = '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace';

/* ---------- Contexto de tema -------------------------------- */
const ThemeContext = React.createContext(null);
const useTheme = () => React.useContext(ThemeContext);

/* ---------- Hook responsive --------------------------------- */
function useViewport() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return {
    width: w,
    isMobile: w < 768,
    isTablet: w >= 768 && w < 1024,
    isDesktop: w >= 1024,
  };
}

/* ---------- Iconos (inline, 20px por defecto) --------------- */
const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.8 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const paths = {
    box: (
      <>
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3 8l9 5 9-5M12 13v8" />
      </>
    ),
    home: <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V11z" />,
    swap: (
      <>
        <path d="M7 3v12M3 11l4 4 4-4" />
        <path d="M17 21V9M13 13l4-4 4 4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </>
    ),
    list: (
      <>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    minus: <line x1="5" y1="12" x2="19" y2="12" />,
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    alert: (
      <>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </>
    ),
    moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
    arrowRight: (
      <>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </>
    ),
    mail: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    building: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 21V9h6v12M9 3v6M15 3v6" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    menu: (
      <>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
  };
  return <svg {...common}>{paths[name] || null}</svg>;
};

/* =====================================================
   PANTALLA 1 — LOGIN
   ===================================================== */
function LoginScreen({ onGoRegister, onLogin }) {
  const t = useTheme();
  const { isMobile } = useViewport();
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bgCanvas,
        display: "flex",
        alignItems: isMobile ? "stretch" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "none" : "420px",
          background: t.bgSurface,
          borderRadius: isMobile ? 0 : 16,
          border: isMobile ? "none" : `1px solid ${t.border}`,
          padding: isMobile ? "48px 24px 32px" : "40px 32px",
          boxShadow: isMobile ? "none" : t.shadowMd,
          display: "flex",
          flexDirection: "column",
          minHeight: isMobile ? "100vh" : "auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: t.brand,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 26,
              fontWeight: 600,
              marginBottom: 20,
              boxShadow: `0 8px 20px ${t.brand}40`,
            }}
          >
            B
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: t.textPrimary,
              margin: "0 0 6px",
              letterSpacing: "-0.02em",
            }}
          >
            Entrar a Brixo
          </h1>
          <p
            style={{
              fontSize: 15,
              color: t.textSecondary,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Control simple de tu inventario.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Correo" icon="mail" t={t}>
            <input
              type="email"
              defaultValue="laura@cafedelaesquina.ec"
              style={inputStyle(t)}
            />
          </Field>

          <Field label="Contraseña" icon="lock" t={t} showToggle={{ on: showPwd, toggle: () => setShowPwd(!showPwd) }}>
            <input
              type={showPwd ? "text" : "password"}
              defaultValue="passwordseguro"
              style={inputStyle(t)}
            />
          </Field>

          <div style={{ textAlign: "right", marginTop: -4 }}>
            <a
              style={{
                fontSize: 13,
                color: t.brand,
                textDecoration: "none",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button onClick={onLogin} style={primaryButtonStyle(t)}>
            Iniciar sesión
          </button>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 32,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: t.textSecondary,
              margin: 0,
            }}
          >
            ¿No tienes cuenta?{" "}
            <a
              onClick={onGoRegister}
              style={{
                color: t.brand,
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Crea una empresa
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   PANTALLA 2 — REGISTRO SAAS
   ===================================================== */
function RegisterScreen({ onGoLogin, onRegister }) {
  const t = useTheme();
  const { isMobile } = useViewport();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bgCanvas,
        display: "flex",
        alignItems: isMobile ? "stretch" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "none" : "460px",
          background: t.bgSurface,
          borderRadius: isMobile ? 0 : 16,
          border: isMobile ? "none" : `1px solid ${t.border}`,
          padding: isMobile ? "40px 24px 32px" : "40px 32px",
          boxShadow: isMobile ? "none" : t.shadowMd,
          minHeight: isMobile ? "100vh" : "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <a
            onClick={onGoLogin}
            style={{
              fontSize: 13,
              color: t.textSecondary,
              textDecoration: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 20,
            }}
          >
            ← Volver
          </a>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: t.textPrimary,
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            Crea tu empresa
          </h1>
          <p
            style={{
              fontSize: 15,
              color: t.textSecondary,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Sin capacitación. Sin complejidad. Listo en un minuto.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Nombre de la empresa" icon="building" t={t}>
            <input
              type="text"
              defaultValue="Café de la Esquina"
              style={inputStyle(t)}
            />
          </Field>

          <Field label="Tu nombre" icon="user" t={t}>
            <input
              type="text"
              defaultValue="Laura Jaramillo"
              style={inputStyle(t)}
            />
          </Field>

          <Field label="Correo" icon="mail" t={t}>
            <input
              type="email"
              defaultValue="laura@cafedelaesquina.ec"
              style={inputStyle(t)}
            />
          </Field>

          <Field label="Contraseña" icon="lock" t={t} help="Mínimo 8 caracteres. Incluye una mayúscula y un número.">
            <input
              type="password"
              defaultValue="passwordseguro"
              style={inputStyle(t)}
            />
          </Field>

          <div
            style={{
              background: t.brandSoft,
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginTop: 4,
            }}
          >
            <div style={{ color: t.brand, flexShrink: 0, marginTop: 1 }}>
              <Icon name="check" size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  color: t.brandSoftText,
                  margin: 0,
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                Serás el propietario de la empresa
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: t.brandSoftText,
                  margin: "2px 0 0",
                  lineHeight: 1.5,
                  opacity: 0.85,
                }}
              >
                Después podrás invitar a tu equipo.
              </p>
            </div>
          </div>

          <button onClick={onRegister} style={{ ...primaryButtonStyle(t), marginTop: 8 }}>
            Crear empresa y empezar
          </button>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 32,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 14, color: t.textSecondary, margin: 0 }}>
            ¿Ya tienes cuenta?{" "}
            <a
              onClick={onGoLogin}
              style={{
                color: t.brand,
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   DATOS MOCK
   ===================================================== */
const mockProducts = [
  { id: 1, name: "Café tostado 500g", desc: "Grano entero · arábica", sku: "CAF-500-AR", stock: 42, min: 10, unit: "und", status: "ok" },
  { id: 2, name: "Leche entera 1L", desc: "Tetrapak", sku: "LEC-1L-EN", stock: 4, min: 8, unit: "und", status: "low" },
  { id: 3, name: "Azúcar morena 1kg", desc: "Orgánica", sku: "AZU-1K-MO", stock: 18, min: 5, unit: "und", status: "ok" },
  { id: 4, name: "Vasos de papel 12oz", desc: "Pack 50 uds", sku: "VAS-12-PP", stock: 7, min: 6, unit: "pck", status: "warn" },
  { id: 5, name: "Pan de molde integral", desc: "8 rebanadas", sku: "PAN-IN-8R", stock: 2, min: 5, unit: "und", status: "low" },
  { id: 6, name: "Croissant de mantequilla", desc: "Pieza individual", sku: "CRO-MAN", stock: 24, min: 10, unit: "und", status: "ok" },
  { id: 7, name: "Té negro en bolsitas", desc: "Caja 25 uds", sku: "TE-NEG-25", stock: 14, min: 5, unit: "caja", status: "ok" },
];

const mockMovements = [
  { id: 1, product: "Leche entera 1L", type: "SALIDA", qty: 6, reason: "Venta mostrador", when: "hace 8 min" },
  { id: 2, product: "Café tostado 500g", type: "ENTRADA", qty: 20, reason: "Compra a proveedor", when: "hace 42 min" },
  { id: 3, product: "Vasos de papel 12oz", type: "AJUSTE", qty: -2, reason: "Conteo físico", when: "hace 2 h" },
  { id: 4, product: "Azúcar morena 1kg", type: "SALIDA", qty: 3, reason: "Venta mostrador", when: "hace 3 h" },
  { id: 5, product: "Pan de molde integral", type: "ENTRADA", qty: 12, reason: "Compra a proveedor", when: "hace 5 h" },
];

/* =====================================================
   APP SHELL — NAVEGACIÓN + ESTRUCTURA
   ===================================================== */
function AppShell({ currentTab, setTab, onLogout, children }) {
  const t = useTheme();
  const { isMobile, isDesktop } = useViewport();

  const tabs = [
    { id: "dashboard", label: "Panel", icon: "home" },
    { id: "inventory", label: "Inventario", icon: "box" },
    { id: "movements", label: "Movimientos", icon: "swap" },
    { id: "team", label: "Equipo", icon: "users" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bgCanvas,
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
      }}
    >
      {/* Sidebar desktop */}
      {isDesktop && (
        <aside
          style={{
            width: 240,
            background: t.bgSurface,
            borderRight: `1px solid ${t.border}`,
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 8px 24px",
              marginBottom: 8,
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: t.brand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              B
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: t.textPrimary, letterSpacing: "-0.01em" }}>Brixo</span>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 16, flex: 1 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                style={sidebarItemStyle(t, currentTab === tab.id)}
              >
                <Icon name={tab.icon} size={18} />
                {tab.label}
              </button>
            ))}
            <button style={sidebarItemStyle(t, false)}>
              <Icon name="list" size={18} />
              Auditoría
            </button>
          </nav>

          <div
            style={{
              borderTop: `1px solid ${t.border}`,
              paddingTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 8px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: t.brandSoft,
                color: t.brand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              LJ
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.textPrimary }}>Laura J.</div>
              <div style={{ fontSize: 11, color: t.textTertiary }}>Propietaria</div>
            </div>
          </div>
        </aside>
      )}

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", paddingBottom: isMobile ? 72 : 0 }}>
        <TopBar onLogout={onLogout} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>

      {/* Bottom nav móvil */}
      {isMobile && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: t.bgSurface,
            borderTop: `1px solid ${t.border}`,
            display: "flex",
            padding: "8px 8px calc(8px + env(safe-area-inset-bottom, 0px))",
            zIndex: 40,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                padding: "8px 4px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                color: currentTab === tab.id ? t.brand : t.textTertiary,
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                minHeight: 56,
              }}
            >
              <Icon name={tab.icon} size={22} strokeWidth={currentTab === tab.id ? 2.2 : 1.8} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

function TopBar({ onLogout }) {
  const t = useTheme();
  const { isMobile } = useViewport();
  const { theme, toggleTheme } = React.useContext(AppContext);

  return (
    <header
      style={{
        height: 60,
        background: t.bgSurface,
        borderBottom: `1px solid ${t.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {isMobile ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: t.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            B
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: t.textPrimary, letterSpacing: "-0.01em" }}>Brixo</span>
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          onClick={toggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: t.textSecondary,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Cambiar tema"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
        </button>
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: t.textSecondary,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          aria-label="Notificaciones"
        >
          <Icon name="bell" size={18} />
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: t.danger,
            }}
          />
        </button>
        {isMobile && (
          <button
            onClick={onLogout}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: t.brandSoft,
              color: t.brand,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
              marginLeft: 4,
            }}
            aria-label="Cuenta"
          >
            LJ
          </button>
        )}
      </div>
    </header>
  );
}

/* =====================================================
   PANTALLA 3 — DASHBOARD
   ===================================================== */
function DashboardScreen() {
  const t = useTheme();
  const { isMobile } = useViewport();

  return (
    <div style={{ padding: isMobile ? "20px 16px 24px" : "32px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: isMobile ? 22 : 26,
            fontWeight: 600,
            color: t.textPrimary,
            margin: "0 0 4px",
            letterSpacing: "-0.02em",
          }}
        >
          Hola, Laura
        </h1>
        <p style={{ fontSize: 14, color: t.textSecondary, margin: 0 }}>
          Café de la Esquina · hoy, 14:32
        </p>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <MetricCard t={t} label="Productos activos" value="24" delta="+2 esta semana" />
        <MetricCard t={t} label="Unidades en stock" value="1,847" delta="+126 vs ayer" deltaColor={t.success} />
        <MetricCard t={t} label="Stock bajo" value="3" deltaColor={t.danger} delta="Requiere reposición" valueColor={t.danger} />
        <MetricCard t={t} label="Movimientos hoy" value="18" delta="11 salidas · 7 entradas" />
      </div>

      {/* CTA registrar movimiento — prominente en móvil */}
      {isMobile && (
        <button
          style={{
            ...primaryButtonStyle(t),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <Icon name="plus" size={18} strokeWidth={2.5} />
          Registrar movimiento
        </button>
      )}

      {/* Grid 2 columnas en desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr",
          gap: 16,
        }}
      >
        {/* Movimientos recientes */}
        <Card t={t} title="Movimientos recientes" action="Ver todos">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {mockMovements.map((m, idx) => (
              <MovementRow key={m.id} m={m} t={t} isLast={idx === mockMovements.length - 1} />
            ))}
          </div>
        </Card>

        {/* Requiere atención */}
        <Card t={t} title="Requiere atención">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <AlertCard t={t} severity="danger" title="Stock crítico" product="Pan de molde integral" detail="Quedan 2 und · mínimo 5" />
            <AlertCard t={t} severity="danger" product="Leche entera 1L" detail="Quedan 4 und · mínimo 8" />
            <AlertCard t={t} severity="warning" title="Cerca del mínimo" product="Vasos de papel 12oz" detail="Quedan 7 pck · mínimo 6" />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* =====================================================
   PANTALLA 4 — INVENTARIO
   ===================================================== */
function InventoryScreen() {
  const t = useTheme();
  const { isMobile } = useViewport();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return mockProducts
      .filter((p) => (filter === "low" ? p.status === "low" : true))
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase())
      );
  }, [filter, query]);

  return (
    <div style={{ padding: isMobile ? "20px 16px 24px" : "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: isMobile ? 22 : 26,
              fontWeight: 600,
              color: t.textPrimary,
              margin: "0 0 4px",
              letterSpacing: "-0.02em",
            }}
          >
            Inventario
          </h1>
          <p style={{ fontSize: 14, color: t.textSecondary, margin: 0 }}>
            {mockProducts.length} productos · {mockProducts.filter((p) => p.status === "low").length} con stock bajo
          </p>
        </div>
        {!isMobile && (
          <div style={{ display: "flex", gap: 8 }}>
            <button style={ghostButtonStyle(t)}>Importar</button>
            <button style={{ ...primaryButtonStyle(t), width: "auto", padding: "10px 16px", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon name="plus" size={16} strokeWidth={2.5} />
              Nuevo producto
            </button>
          </div>
        )}
      </div>

      {/* Búsqueda + filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: isMobile ? "100%" : 240, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: t.textTertiary,
            }}
          >
            <Icon name="search" size={16} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            style={{ ...inputStyle(t), paddingLeft: 38 }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <FilterPill t={t} active={filter === "all"} onClick={() => setFilter("all")}>
            Todos
          </FilterPill>
          <FilterPill t={t} active={filter === "low"} severity="danger" onClick={() => setFilter("low")}>
            Stock bajo · 3
          </FilterPill>
        </div>
      </div>

      {/* Lista — cards en móvil, tabla en desktop */}
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((p) => (
            <ProductMobileCard key={p.id} p={p} t={t} />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: t.bgSurface,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.bgSubtle }}>
                <th style={tableHeadStyle(t)}>Producto</th>
                <th style={tableHeadStyle(t)}>SKU</th>
                <th style={{ ...tableHeadStyle(t), textAlign: "right" }}>Stock</th>
                <th style={{ ...tableHeadStyle(t), textAlign: "right" }}>Mínimo</th>
                <th style={tableHeadStyle(t)}>Estado</th>
                <th style={tableHeadStyle(t)} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={p.id}
                  style={{
                    borderTop: idx === 0 ? "none" : `1px solid ${t.border}`,
                  }}
                >
                  <td style={tableCellStyle(t)}>
                    <div style={{ fontWeight: 500, color: t.textPrimary, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: t.textTertiary }}>{p.desc}</div>
                  </td>
                  <td style={{ ...tableCellStyle(t), fontFamily: monoStack, fontSize: 12, color: t.textSecondary }}>{p.sku}</td>
                  <td style={{ ...tableCellStyle(t), textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ fontWeight: 600, color: statusColor(p.status, t) }}>{p.stock}</span>
                    <span style={{ color: t.textTertiary, fontSize: 12, marginLeft: 2 }}> {p.unit}</span>
                  </td>
                  <td style={{ ...tableCellStyle(t), textAlign: "right", color: t.textTertiary, fontVariantNumeric: "tabular-nums" }}>{p.min}</td>
                  <td style={tableCellStyle(t)}>
                    <StatusBadge status={p.status} t={t} />
                  </td>
                  <td style={tableCellStyle(t)}>
                    <button style={iconBtnStyle(t)}>
                      <Icon name="plus" size={14} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FAB móvil */}
      {isMobile && (
        <button
          style={{
            position: "fixed",
            bottom: 88,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: t.brand,
            color: "#fff",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: `0 8px 24px ${t.brand}50`,
            zIndex: 30,
          }}
          aria-label="Nuevo producto"
        >
          <Icon name="plus" size={24} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function ProductMobileCard({ p, t }) {
  return (
    <div
      style={{
        background: t.bgSurface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, color: t.textPrimary, fontSize: 15, marginBottom: 2 }}>{p.name}</div>
          <div style={{ fontSize: 12, color: t.textTertiary }}>{p.desc}</div>
          <div style={{ fontSize: 11, color: t.textTertiary, fontFamily: monoStack, marginTop: 4 }}>{p.sku}</div>
        </div>
        <StatusBadge status={p.status} t={t} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          borderTop: `1px solid ${t.border}`,
          paddingTop: 10,
          marginTop: 4,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: statusColor(p.status, t),
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {p.stock}
          </span>
          <span style={{ fontSize: 13, color: t.textTertiary, marginLeft: 4 }}>{p.unit}</span>
          <span style={{ fontSize: 12, color: t.textTertiary, marginLeft: 10 }}>mín. {p.min}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={{ ...iconBtnStyle(t), background: t.successSoft, color: t.success, borderColor: "transparent" }}>
            <Icon name="plus" size={14} strokeWidth={2.5} />
          </button>
          <button style={{ ...iconBtnStyle(t), background: t.dangerSoft, color: t.danger, borderColor: "transparent" }}>
            <Icon name="minus" size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTES COMPARTIDOS
   ===================================================== */
function Field({ label, icon, children, t, help, showToggle }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: t.textPrimary,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: t.textTertiary,
              pointerEvents: "none",
            }}
          >
            <Icon name={icon} size={18} />
          </span>
        )}
        {React.cloneElement(children, {
          style: { ...children.props.style, paddingLeft: icon ? 44 : 14 },
        })}
        {showToggle && (
          <button
            type="button"
            onClick={showToggle.toggle}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: t.textTertiary,
              cursor: "pointer",
              padding: 6,
              display: "flex",
            }}
            aria-label="Mostrar contraseña"
          >
            <Icon name="eye" size={18} />
          </button>
        )}
      </div>
      {help && (
        <p style={{ fontSize: 12, color: t.textTertiary, margin: "6px 0 0" }}>{help}</p>
      )}
    </div>
  );
}

function Card({ t, title, action, children }) {
  return (
    <div
      style={{
        background: t.bgSurface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {title && (
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
          {action && (
            <a style={{ fontSize: 13, color: t.brand, fontWeight: 500, cursor: "pointer", textDecoration: "none" }}>{action}</a>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function MetricCard({ t, label, value, delta, deltaColor, valueColor }) {
  return (
    <div
      style={{
        background: t.bgSurface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <p style={{ fontSize: 12, color: t.textSecondary, margin: "0 0 8px" }}>{label}</p>
      <p
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: valueColor || t.textPrimary,
          margin: 0,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </p>
      {delta && (
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: deltaColor || t.textTertiary,
            margin: "8px 0 0",
          }}
        >
          {delta}
        </p>
      )}
    </div>
  );
}

function MovementRow({ m, t, isLast }) {
  const cfg = {
    ENTRADA: { bg: t.successSoft, color: t.success, icon: "plus", sign: "+" },
    SALIDA: { bg: t.dangerSoft, color: t.danger, icon: "minus", sign: "-" },
    AJUSTE: { bg: t.warningSoft, color: t.warning, icon: "swap", sign: "" },
  }[m.type];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: isLast ? "none" : `1px solid ${t.border}`,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: cfg.bg,
          color: cfg.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={cfg.icon} size={16} strokeWidth={2.2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, color: t.textPrimary, fontSize: 14, marginBottom: 2 }}>{m.product}</div>
        <div style={{ fontSize: 12, color: t.textTertiary }}>
          {m.type === "ENTRADA" ? "Entrada" : m.type === "SALIDA" ? "Salida" : "Ajuste"} · {m.reason}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontWeight: 600,
            color: cfg.color,
            fontSize: 14,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {cfg.sign}
          {Math.abs(m.qty)}
        </div>
        <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 2 }}>{m.when}</div>
      </div>
    </div>
  );
}

function AlertCard({ t, severity, title, product, detail }) {
  const soft = severity === "danger" ? t.dangerSoft : t.warningSoft;
  const text = severity === "danger" ? t.dangerText : t.warningText;
  return (
    <div
      style={{
        background: soft,
        borderRadius: 10,
        padding: "12px 14px",
        borderLeft: `3px solid ${severity === "danger" ? t.danger : t.warning}`,
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
            fontSize: 11,
            fontWeight: 600,
            color: text,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          <Icon name="alert" size={12} strokeWidth={2.2} />
          {title}
        </div>
      )}
      <p style={{ fontSize: 14, color: text, margin: "0 0 2px", fontWeight: 600 }}>{product}</p>
      <p style={{ fontSize: 12, color: text, margin: 0, opacity: 0.85 }}>{detail}</p>
    </div>
  );
}

function StatusBadge({ status, t }) {
  const cfg = {
    ok: { bg: t.successSoft, color: t.successText, label: "En stock" },
    warn: { bg: t.warningSoft, color: t.warningText, label: "Al límite" },
    low: { bg: t.dangerSoft, color: t.dangerText, label: "Stock bajo" },
  }[status];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 8px",
        background: cfg.bg,
        color: cfg.color,
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.01em",
      }}
    >
      {cfg.label}
    </span>
  );
}

function FilterPill({ t, active, severity, onClick, children }) {
  const bg = active
    ? severity === "danger"
      ? t.dangerSoft
      : t.brandSoft
    : "transparent";
  const color = active
    ? severity === "danger"
      ? t.dangerText
      : t.brand
    : t.textSecondary;
  const border = active
    ? severity === "danger"
      ? t.dangerSoft
      : t.brandSoft
    : t.border;
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        color,
        cursor: "pointer",
        fontFamily: fontStack,
      }}
    >
      {children}
    </button>
  );
}

/* ---------- Helpers de estilo ------------------------------ */
function inputStyle(t) {
  return {
    width: "100%",
    padding: "11px 14px",
    border: `1px solid ${t.border}`,
    borderRadius: 10,
    background: t.bgSurface,
    color: t.textPrimary,
    fontSize: 15,
    fontFamily: fontStack,
    outline: "none",
    transition: "border-color 150ms, box-shadow 150ms",
    boxSizing: "border-box",
    minHeight: 44,
  };
}
function primaryButtonStyle(t) {
  return {
    width: "100%",
    padding: "12px 16px",
    background: t.brand,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: fontStack,
    cursor: "pointer",
    minHeight: 48,
    letterSpacing: "-0.01em",
    boxShadow: `0 1px 2px ${t.brand}30`,
  };
}
function ghostButtonStyle(t) {
  return {
    padding: "10px 14px",
    background: "transparent",
    color: t.textPrimary,
    border: `1px solid ${t.border}`,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: fontStack,
    cursor: "pointer",
    minHeight: 40,
  };
}
function iconBtnStyle(t) {
  return {
    width: 32,
    height: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: t.textSecondary,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    cursor: "pointer",
  };
}
function sidebarItemStyle(t, active) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 8,
    background: active ? t.brandSoft : "transparent",
    color: active ? t.brand : t.textSecondary,
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    fontFamily: fontStack,
  };
}
function tableHeadStyle(t) {
  return {
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    color: t.textTertiary,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "12px 16px",
  };
}
function tableCellStyle(t) {
  return {
    fontSize: 14,
    color: t.textPrimary,
    padding: "14px 16px",
    verticalAlign: "middle",
  };
}
function statusColor(status, t) {
  if (status === "low") return t.danger;
  if (status === "warn") return t.warning;
  return t.textPrimary;
}

/* =====================================================
   ROOT APP — ORQUESTA TODO
   ===================================================== */
const AppContext = React.createContext(null);

export default function BrixoMockup() {
  const [theme, setTheme] = useState("light");
  const [screen, setScreen] = useState("login");
  const [tab, setTab] = useState("dashboard");

  const t = tokens[theme];

  const toggleTheme = () => setTheme((s) => (s === "light" ? "dark" : "light"));

  // Inyectar Inter una sola vez
  useEffect(() => {
    if (document.getElementById("brixo-fonts")) return;
    const link = document.createElement("link");
    link.id = "brixo-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      <ThemeContext.Provider value={t}>
        <div
          style={{
            fontFamily: fontStack,
            color: t.textPrimary,
            background: t.bgCanvas,
            minHeight: "100vh",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          {/* Toggle tema flotante para pantallas de auth */}
          {(screen === "login" || screen === "register") && (
            <button
              onClick={toggleTheme}
              style={{
                position: "fixed",
                top: 16,
                right: 16,
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1px solid ${t.border}`,
                background: t.bgSurface,
                color: t.textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                boxShadow: t.shadowSm,
              }}
              aria-label="Cambiar tema"
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>
          )}

          {screen === "login" && (
            <LoginScreen
              onGoRegister={() => setScreen("register")}
              onLogin={() => setScreen("app")}
            />
          )}
          {screen === "register" && (
            <RegisterScreen
              onGoLogin={() => setScreen("login")}
              onRegister={() => setScreen("app")}
            />
          )}
          {screen === "app" && (
            <AppShell
              currentTab={tab}
              setTab={setTab}
              onLogout={() => setScreen("login")}
            >
              {tab === "dashboard" && <DashboardScreen />}
              {tab === "inventory" && <InventoryScreen />}
              {tab === "movements" && <DashboardScreen />}
              {tab === "team" && <DashboardScreen />}
            </AppShell>
          )}
        </div>
      </ThemeContext.Provider>
    </AppContext.Provider>
  );
}
