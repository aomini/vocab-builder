/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#CC785C",
        background: "#FFFFFF",
        surface: "#F5F5F5",
        text: "#1A1A1A",
        border: "#E5E5E5",
      },
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro",
          "Roboto",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
        rounded: ["var(--font-rounded)"],
        serif: ["var(--font-serif)"],
      },
    },
  },
  plugins: [],
};
