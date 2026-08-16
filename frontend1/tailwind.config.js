import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#09b850',
          50: '#e8fbf0',
          100: '#c6f5d8',
          200: '#8fe9b3',
          300: '#54d98a',
          400: '#22c766',
          500: '#09b850',
          600: '#059140',
          700: '#067336',
          800: '#0a5a2d',
          900: '#0a4b27',
        },
        ink: {
          DEFAULT: '#202124',
          soft: '#292a2d',
          muted: '#606261',
          faint: '#c4c5c7',
          border: '#dce0e5',
          surface: '#f8f8f8',
        },
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'sans-serif'],
        title: ['Prata', 'serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(32, 33, 36, 0.08)',
        soft: '0 2px 12px -2px rgba(32, 33, 36, 0.06)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [typography],
};
