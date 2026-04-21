import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import styles from "./Sidebar.module.css";

/**
 * Sidebar de la aplicación
 * - 5 ítems: Panel, Inventario, Movimientos, Equipo, Auditoría
 * - Avatar con iniciales en el pie
 * - Ítem activo coloreado
 */
export const Sidebar: React.FC<{ activeItem?: string }> = ({
  activeItem = "dashboard",
}) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const items = [
    { id: "dashboard", icon: "📊", label: "Panel", href: "/dashboard" },
    { id: "inventory", icon: "📦", label: "Inventario", href: "/inventory" },
    { id: "movements", icon: "↔️", label: "Movimientos", href: "/movements" },
    { id: "team", icon: "👥", label: "Equipo", href: "/team" },
    { id: "audit", icon: "📋", label: "Auditoría", href: "/audit" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <nav className={styles.sidebar}>
      <div className={styles.nav}>
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`${styles.item} ${activeItem === item.id ? styles.active : ""}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </a>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || "Usuario"}</div>
            <div className={styles.userRole}>Propietaria</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Salir
        </button>
      </div>
    </nav>
  );
};
