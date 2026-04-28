import React from "react";

interface BrixoLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "line";
  className?: string;
}

export const BrixoLogo: React.FC<BrixoLogoProps> = ({
  size = "md",
  variant = "solid",
  className = "",
}) => {
  const sizeMap = { sm: 24, md: 40, lg: 56 };
  const px = sizeMap[size];

  if (variant === "line") {
    return (
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        role="img"
        aria-label="Brixo"
      >
        <title>Brixo</title>
        <rect
          x="1" y="1" width="22" height="22" rx="4.5"
          fill="none" stroke="currentColor" strokeWidth="2"
        />
        <path
          d="M7 5.5V18.5 M7 10H14.5A3.5 3.5 0 0 1 18 13.5V15A3.5 3.5 0 0 1 14.5 18.5H7Z"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="13" cy="14.25" r="1.25" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label="Brixo"
    >
      <title>Brixo</title>
      <rect width="24" height="24" rx="5" fill="#4F46E5" />
      <path
        d="M7 5.5V18.5 M7 10H14.5A3.5 3.5 0 0 1 18 13.5V15A3.5 3.5 0 0 1 14.5 18.5H7Z"
        fill="none" stroke="#FFFFFF" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="13" cy="14.25" r="1.25" fill="#FFFFFF" />
    </svg>
  );
};
