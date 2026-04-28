import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { BrixoLogo } from "@/components/BrixoLogo";
import { Icon } from "@/components/Icon";
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

export const AppShell: React.FC<AppShellProps> = ({
  children,
  sidebarContent,
  bottomNavItems = [],
}) => {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoArea}>
            <BrixoLogo size="sm" />
            <span className={styles.brandName}>Brixo</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar sidebar"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.topBarStart}>
            <button
              className={styles.menuBtn}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menú"
            >
              <Icon name="menu" size={20} />
            </button>
            <div className={styles.mobileLogoArea}>
              <BrixoLogo size="sm" />
              <span className={styles.brandName}>Brixo</span>
            </div>
          </div>
          <div className={styles.topBarEnd}>
            <button
              className={styles.iconBtn}
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>
            <button className={styles.iconBtn} aria-label="Notificaciones">
              <Icon name="bell" size={18} />
            </button>
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </main>

      {/* Bottom nav móvil */}
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
