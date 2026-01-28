/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [
    require("tailwindcss-rtl"),
  ],
};