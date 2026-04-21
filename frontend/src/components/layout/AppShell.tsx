import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import styles from "./AppShell.module.css";

interface AppShellProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  bottomNavItems?: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
  }>;
}

/**
 * Shell de la aplicación - Sidebar (desktop) + Bottom-nav (móvil)
 * - Sidebar 240px en desktop
 * - Bottom-nav 4 ítems en móvil
 * - Safe area inset para dispositivos con notch
 */
export const AppShell: React.FC<AppShellProps> = ({
  children,
  sidebarContent,
  bottomNavItems = [],
}) => {
  const { toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {/* Sidebar - visible solo en desktop */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <button
            className={styles.closeBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar sidebar"
          >
            ✕
          </button>
        </div>
        {sidebarContent}
        <div className={styles.sidebarFooter}>
          <button
            className={styles.themeToggle}
            onClick={toggle}
            aria-label="Cambiar tema"
          >
            🌓
          </button>
        </div>
      </aside>

      {/* Overlay cuando sidebar abierto en móvil */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={styles.main}>
        {/* Header con burger menu en móvil */}
        <div className={styles.topBar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>

        {/* Contenido principal */}
        <div className={styles.content}>{children}</div>
      </main>

      {/* Bottom nav - visible solo en móvil */}
      {bottomNavItems.length > 0 && (
        <nav className={styles.bottomNav}>
          {bottomNavItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className={`${styles.navItem} ${item.active ? styles.navItemActive : ""}`}
              title={item.label}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </a>
          ))}
        </nav>
      )}
    </div>
  );
};
