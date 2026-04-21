import React from "react";
import styles from "./AlertCard.module.css";

type AlertVariant = "success" | "danger" | "warning" | "info";

interface AlertCardProps {
  variant: AlertVariant;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * AlertCard para notificaciones destacadas
 * - Coloreada según semántica
 * - Ícono + título + descripción
 * - CTA opcional
 */
export const AlertCard: React.FC<AlertCardProps> = ({
  variant,
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className={`${styles.alert} ${styles[variant]}`}>
      <div className={styles.iconBox}>{icon}</div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};
