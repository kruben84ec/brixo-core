import React from "react";
import styles from "./Badge.module.css";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

/**
 * Badge para estados
 * - En stock (verde)
 * - Al límite (ámbar)
 * - Stock bajo (rojo)
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className || ""}`}>
      {children}
    </span>
  );
};
