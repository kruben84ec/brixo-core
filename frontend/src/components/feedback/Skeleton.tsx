import React from "react";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

/**
 * Skeleton loader con shimmer animation
 * - Usado mientras carga data del API
 * - Respeta prefers-reduced-motion
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  className,
}) => {
  return (
    <div
      className={`${styles.skeleton} ${className || ""}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};
