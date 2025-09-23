/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#38bdf8', 600: '#0ea5e9', 700: '#0284c7' },
      },
      boxShadow: {
        'brand-glow': '0 0 0 8px rgba(56,189,248,0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
