import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Tarjeta genérica - base para componentes de contenido
 */
export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div className={`${styles.card} ${className || ""}`} onClick={onClick}>
      {children}
    </div>
  );
};
