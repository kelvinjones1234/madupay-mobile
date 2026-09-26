/**
 * MaduPay Design System - Color Palette
 */
export const colors = {
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  dark: {
    bg: "#0F172A",          // Slate 900
    card: "#1E293B",        // Slate 800
    cardElevated: "#334155",// Slate 700
    surface: "#1E293B",
    border: "#334155",
    borderSubtle: "#1E293B",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#94A3B8",   // Slate 400
    muted: "#64748B",       // Slate 500
    inverse: "#0F172A",
  },
  status: {
    success: "#10B981",     // Emerald 500
    successLight: "#34D399",
    successBg: "rgba(16, 185, 129, 0.15)",
    warning: "#F59E0B",     // Amber 500
    warningLight: "#FBBF24",
    warningBg: "rgba(245, 158, 11, 0.15)",
    error: "#F43F5E",       // Rose 500
    errorLight: "#FB7185",
    errorBg: "rgba(244, 63, 94, 0.15)",
    info: "#0EA5E9",        // Sky 500
    infoLight: "#38BDF8",
    infoBg: "rgba(14, 165, 233, 0.15)",
  },
} as const;

export type ColorsType = typeof colors;
