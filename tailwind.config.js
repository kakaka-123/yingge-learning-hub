/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yingge-red': '#8B0000',
        'yingge-gold': '#D4AF37',
        'yingge-black': '#1a1a1a',
        'yingge-dark': '#2d2d2d',
      },
      fontFamily: {
        'serif': ['Noto Serif SC', 'SimSun', 'serif'],
        'sans': ['Noto Sans SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
}