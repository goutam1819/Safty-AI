/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070c18',
          900: '#0a1124',
          850: '#0d1630',
          800: '#111d3e',
          750: '#16244d',
          700: '#1c2e5e',
          600: '#273e7c',
        },
        electric: {
          500: '#1d63ff',
          600: '#144ecc',
          400: '#3d7eff',
          300: '#6ca1ff',
        },
        hazard: {
          red: '#ef4444',
          orange: '#f59e0b',
          green: '#10b981',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -3px rgba(29, 99, 255, 0.35)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'panel': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
