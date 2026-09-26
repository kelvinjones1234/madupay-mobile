/**
 * MaduPay Design System - Typography Tokens
 */
export const typography = {
  fontFamily: {
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
    mono: "monospace",
  },
  fontSize: {
    xxs: 10,
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
    black: "900" as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export type TypographyType = typeof typography;
