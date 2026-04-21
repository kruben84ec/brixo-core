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
  const sizeMap = { sm: "24px", md: "40px", lg: "56px" };
  const sizePixels = sizeMap[size];

  return (
    <svg
      width={sizePixels}
      height={sizePixels}
      viewBox="0 0 40 40"
      fill="none"
      className={`brixo-logo ${className}`}
    >
      {variant === "solid" ? (
        <>
          {/* Fondo índigo */}
          <rect width="40" height="40" rx="8" fill="#4F46E5" />
          {/* B blanca */}
          <text
            x="20"
            y="28"
            textAnchor="middle"
            fill="white"
            fontSize="28"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            B
          </text>
        </>
      ) : (
        <>
          {/* Contorno índigo */}
          <rect
            width="40"
            height="40"
            rx="8"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
          />
          {/* B índigo */}
          <text
            x="20"
            y="28"
            textAnchor="middle"
            fill="#4F46E5"
            fontSize="28"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            B
          </text>
        </>
      )}
    </svg>
  );
};
