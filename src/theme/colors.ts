/**
 * MaduPay Design System - Authentic Ditto Color Palette
 * Source of truth: DESIGN.md
 */
export const colors = {
  ditto: {
    canvas: "#F9FBF2",       // Warm cream page background
    meadow: "#EFF2E5",       // Soft card & surface
    meadowHigh: "#E2E7CF",   // Hover / active surface
    ink: "#221A50",          // Deep navy ink primary text
    nightInk: "#130E30",     // Balance card background
    paper: "#F2F1EC",        // Paper text in dark cards
    gold: "#F5C518",         // Primary Warm Gold CTA
    goldDark: "#EDBE00",     // Dark mode gold
    slate: "#5F5C6E",        // Secondary muted text
    outline: "rgba(34, 26, 80, 0.12)",
    outlineSubtle: "rgba(34, 26, 80, 0.06)",
    moss: "#59E25D",
    fuchsia: "#E261E5",
    error: "#BA1A1A",
    inputBg: "#FFFFFF",
  },
  primary: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F5C518", // Warm Gold
    600: "#EAB308",
    700: "#CA8A04",
    800: "#A16207",
    900: "#713F12",
  },
  background: "#F9FBF2",
  surface: "#EFF2E5",
  surfaceElevated: "#E2E7CF",
  card: "#EFF2E5",
  border: "rgba(34, 26, 80, 0.12)",
  text: {
    primary: "#221A50",      // Deep Ink
    secondary: "#5F5C6E",    // Slate
    muted: "#8E8B99",
    inverse: "#F2F1EC",      // Paper
    paper: "#F2F1EC",
  },
  status: {
    success: "#10B981",
    successLight: "#34D399",
    successBg: "rgba(16, 185, 129, 0.12)",
    warning: "#F59E0B",
    warningLight: "#FBBF24",
    warningBg: "rgba(245, 158, 11, 0.12)",
    error: "#BA1A1A",
    errorLight: "#FB7185",
    errorBg: "rgba(186, 26, 26, 0.10)",
    info: "#221A50",
    infoLight: "#4A3F8C",
    infoBg: "rgba(34, 26, 80, 0.08)",
  },
} as const;

export type ColorsType = typeof colors;
