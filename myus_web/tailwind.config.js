/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B5FC7',
        'primary-dark': '#4749A3',
        secondary: '#48BB78',
        background: '#0F172A',
        surface: '#1E293B',
        border: '#334155',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#22C55E',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
