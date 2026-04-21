import React from "react";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  icon?: React.ReactNode;
  color?: "success" | "danger" | "warning" | "info";
}

/**
 * Card para métricas y KPIs
 * - Valor grande destacado
 * - Trend opcional (↑ verde, ↓ rojo)
 * - Icono decorativo
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  trendValue,
  icon,
  color = "info",
}) => {
  return (
    <div className={`${styles.metric} ${styles[`metric${color}`]}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <div className={styles.valueContainer}>
          <span className={styles.value}>{value}</span>
          {trend && trendValue && (
            <span className={`${styles.trend} ${styles[`trend${trend}`]}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
