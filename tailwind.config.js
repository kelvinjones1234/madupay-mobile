/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ditto: {
          canvas: "#F9FBF2",
          meadow: "#EFF2E5",
          meadowHigh: "#E2E7CF",
          ink: "#221A50",
          nightInk: "#130E30",
          gold: "#F5C518",
          goldDark: "#EDBE00",
          slate: "#5F5C6E",
          paper: "#F2F1EC",
          outline: "#221A50",
          moss: "#59E25D",
          fuchsia: "#E261E5",
          error: "#BA1A1A",
          inputBg: "#FFFFFF",
        },
        primary: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F5C518",
          600: "#EAB308",
          700: "#CA8A04",
        },
        brand: {
          dark: "#130E30",
          card: "#EFF2E5",
          surface: "#E2E7CF",
          accent: "#F5C518",
        },
      },
      borderRadius: {
        card: "24px",
        pill: "1440px",
      },
    },
  },
  plugins: [],
};
