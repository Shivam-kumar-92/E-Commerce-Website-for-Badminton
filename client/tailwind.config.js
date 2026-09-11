/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        volt: {
          400: '#a3e635',
          500: '#84cc16',
          DEFAULT: '#00FF66',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          DEFAULT: '#00F0FF',
        },
        crimson: {
          500: '#f43f5e',
          DEFAULT: '#FF2E63',
        },
        dark: {
          950: '#07090e',
          900: '#0c1017',
          850: '#111722',
          800: '#171f2e',
          700: '#232f45',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Cabinet Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glow-volt': '0 0 25px -5px rgba(0, 255, 102, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.4)',
        'glow-crimson': '0 0 25px -5px rgba(255, 46, 99, 0.4)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shuttle-fly': 'shuttleFly 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shuttleFly: {
          '0%': { transform: 'translate(0, 0) rotate(15deg)' },
          '25%': { transform: 'translate(40px, -20px) rotate(35deg)' },
          '50%': { transform: 'translate(80px, 10px) rotate(-10deg)' },
          '75%': { transform: 'translate(30px, 30px) rotate(-25deg)' },
          '100%': { transform: 'translate(0, 0) rotate(15deg)' },
        }
      }
    },
  },
  plugins: [],
}
