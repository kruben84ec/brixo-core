import React from "react";
import { Icon } from "@/components/Icon";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  icon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, helperText, icon, className, ...props }, ref) => {
    const id = props.id ?? props.name;

    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          {icon && (
            <span className={styles.iconLeft}>
              <Icon name={icon} size={18} />
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={[
              styles.input,
              icon ? styles.hasIcon : "",
              error ? styles.error : "",
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
        </div>
        {error && <span className={styles.errorMsg}>{error}</span>}
        {helperText && !error && (
          <span className={styles.helperText}>{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
