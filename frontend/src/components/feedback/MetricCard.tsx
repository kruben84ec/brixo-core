import React from "react";
import styles from "./MetricCard.module.css";

type SemanticColor = "success" | "danger" | "warning" | "info";

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaColor?: SemanticColor;
  valueColor?: SemanticColor;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  delta,
  deltaColor,
  valueColor,
}) => {
  return (
    <div className={styles.metric}>
      <p className={styles.label}>{label}</p>
      <p className={`${styles.value} ${valueColor ? styles[valueColor] : ""}`}>
        {value}
      </p>
      {delta && (
        <p className={`${styles.delta} ${deltaColor ? styles[`delta_${deltaColor}`] : ""}`}>
          {delta}
        </p>
      )}
    </div>
  );
};
