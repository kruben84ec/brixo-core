export interface ThemeTokens {
  // Neutrals
  bgCanvas: string;
  bgSurface: string;
  bgSubtle: string;
  bgMuted: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  // Brand
  brand: string;
  brandHover: string;
  brandSoft: string;
  brandSoftText: string;
  // Semantic
  success: string;
  successSoft: string;
  successText: string;
  danger: string;
  dangerSoft: string;
  dangerText: string;
  warning: string;
  warningSoft: string;
  warningText: string;
  info: string;
  infoSoft: string;
  infoText: string;
  // Overlays & shadows
  overlay: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
}

export const light: ThemeTokens = {
  bgCanvas:    "#FAFAFA",
  bgSurface:   "#FFFFFF",
  bgSubtle:    "#F4F4F5",
  bgMuted:     "#E4E4E7",
  border:      "#E4E4E7",
  borderStrong:"#D4D4D8",
  textPrimary:  "#18181B",
  textSecondary:"#52525B",
  textTertiary: "#71717A",
  textDisabled: "#A1A1AA",
  brand:         "#4F46E5",
  brandHover:    "#4338CA",
  brandSoft:     "#EEF2FF",
  brandSoftText: "#3730A3",
  success:     "#16A34A",
  successSoft: "#F0FDF4",
  successText: "#15803D",
  danger:      "#DC2626",
  dangerSoft:  "#FEF2F2",
  dangerText:  "#B91C1C",
  warning:     "#D97706",
  warningSoft: "#FFFBEB",
  warningText: "#B45309",
  info:        "#0891B2",
  infoSoft:    "#ECFEFF",
  infoText:    "#0E7490",
  overlay:     "rgba(24, 24, 27, 0.5)",
  shadowSm:    "0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:    "0 4px 12px rgba(0,0,0,0.06)",
  shadowLg:    "0 10px 30px rgba(0,0,0,0.08)",
};

export const dark: ThemeTokens = {
  bgCanvas:    "#09090B",
  bgSurface:   "#18181B",
  bgSubtle:    "#27272A",
  bgMuted:     "#3F3F46",
  border:      "#27272A",
  borderStrong:"#3F3F46",
  textPrimary:  "#FAFAFA",
  textSecondary:"#A1A1AA",
  textTertiary: "#71717A",
  textDisabled: "#52525B",
  brand:         "#818CF8",
  brandHover:    "#A5B4FC",
  brandSoft:     "rgba(99, 102, 241, 0.15)",
  brandSoftText: "#C7D2FE",
  success:     "#4ADE80",
  successSoft: "rgba(34, 197, 94, 0.15)",
  successText: "#86EFAC",
  danger:      "#F87171",
  dangerSoft:  "rgba(239, 68, 68, 0.15)",
  dangerText:  "#FCA5A5",
  warning:     "#FBBF24",
  warningSoft: "rgba(245, 158, 11, 0.15)",
  warningText: "#FCD34D",
  info:        "#22D3EE",
  infoSoft:    "rgba(6, 182, 212, 0.15)",
  infoText:    "#67E8F9",
  overlay:     "rgba(0, 0, 0, 0.7)",
  shadowSm:    "0 1px 2px rgba(0,0,0,0.3)",
  shadowMd:    "0 4px 12px rgba(0,0,0,0.4)",
  shadowLg:    "0 10px 30px rgba(0,0,0,0.5)",
};

export const tokens = { light, dark } as const;

export const fontStack = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
export const monoStack = '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace';

export const breakpoints = {
  mobile:  768,
  tablet:  1024,
} as const;

export const spacing = {
  1:  "4px",
  2:  "8px",
  3:  "12px",
  4:  "16px",
  5:  "20px",
  6:  "24px",
  8:  "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

export const radius = {
  badge:   "6px",
  input:   "8px",
  iconBtn: "8px",
  card:    "12px",
  auth:    "16px",
  full:    "9999px",
} as const;
