import React from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, helperText, className, ...props }, ref) => {
    return (
      <div className={`input-wrapper ${className || ""}`}>
        {label && <label className="input-label">{label}</label>}
        <input
          ref={ref}
          className={`input ${error ? "input--error" : ""}`}
          {...props}
        />
        {error && <span className="input-error">{error}</span>}
        {helperText && !error && (
          <span className="input-helper">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
