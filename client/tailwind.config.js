/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bliss: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        magic: {
          purple: '#8b5cf6',
          lavender: '#c084fc',
          gold: '#fbbf24',
          cream: '#fffbeb',
          rose: '#fb7185',
          dark: '#0f0c20',
          galaxy: '#0a0818',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        cursive: ['Dancing Script', 'Caveat', 'cursive'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'sparkle': 'sparkle 1.8s ease-in-out infinite',
        'candle-flicker': 'flicker 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0.3' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
        },
        flicker: {
          '0%': { transform: 'scale(1) skewX(-1deg)' },
          '50%': { transform: 'scale(1.08, 0.95) skewX(2deg)' },
          '100%': { transform: 'scale(0.96, 1.05) skewX(-2deg)' },
        }
      }
    },
  },
  plugins: [],
}
