import React, { useEffect } from "react";
import { Button } from "@/components/primitives/Button";
import styles from "./BottomSheet.module.css";

interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  primaryAction?: { label: string; onClick: () => void; loading?: boolean };
  secondaryAction?: { label: string; onClick: () => void };
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  title,
  children,
  onClose,
  primaryAction,
  secondaryAction,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.sheet}>
        <div className={styles.handle} />
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        <div className={styles.footer}>
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              variant="primary"
              onClick={primaryAction.onClick}
              loading={primaryAction.loading}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
