/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#0b0b12',
          2: '#111119',
          3: '#18181f',
          4: '#1e1e28',
        },
        border: {
          DEFAULT: '#25253a',
          2: '#33334a',
        },
        accent: {
          DEFAULT: '#6c5ce7',
          2: '#a29bfe',
        },
        ink: {
          DEFAULT: '#eeeef8',
          2: '#8888aa',
          3: '#55556a',
        },
      },
      boxShadow: {
        card: '0 2px 32px rgba(0,0,0,0.45)',
        glow: '0 0 24px rgba(108,92,231,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

