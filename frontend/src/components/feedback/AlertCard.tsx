import React from "react";
import { Icon } from "@/components/Icon";
import styles from "./AlertCard.module.css";

type AlertVariant = "success" | "danger" | "warning" | "info";

interface AlertCardProps {
  variant: AlertVariant;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  variant,
  title,
  description,
  action,
}) => {
  return (
    <div className={`${styles.alert} ${styles[variant]}`}>
      <div className={styles.titleRow}>
        <Icon name="alert" size={12} strokeWidth={2.2} />
        <span className={styles.title}>{title}</span>
      </div>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};
