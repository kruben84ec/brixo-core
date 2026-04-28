import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Icon } from "@/components/Icon";
import styles from "./Sidebar.module.css";

const items = [
  { id: "dashboard", icon: "home", label: "Panel", href: "/dashboard" },
  { id: "inventory", icon: "box", label: "Inventario", href: "/inventory" },
  { id: "movements", icon: "swap", label: "Movimientos", href: "/movements" },
  { id: "team", icon: "users", label: "Equipo", href: "/team" },
  { id: "audit", icon: "list", label: "Auditoría", href: "/audit" },
];

export const Sidebar: React.FC<{ activeItem?: string }> = ({
  activeItem = "dashboard",
}) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    user?.name
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
            <Icon
              name={item.icon}
              size={18}
              strokeWidth={activeItem === item.id ? 2.2 : 1.8}
            />
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
          <Icon name="logout" size={14} strokeWidth={2} />
          Salir
        </button>
      </div>
    </nav>
  );
};
