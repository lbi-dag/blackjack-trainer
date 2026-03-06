/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        felt: {
          950: '#041a14',
          900: '#0b241d',
          800: '#123328',
        },
        charcoal: {
          950: '#080b0c',
          900: '#111718',
          800: '#1b2426',
        },
        brass: {
          400: '#d4b66e',
          500: '#bea15a',
        },
        cream: '#f3efe3',
      },
      boxShadow: {
        table: '0 24px 80px rgba(0, 0, 0, 0.45)',
      },
      keyframes: {
        pulseSuccess: {
          '0%': { transform: 'scale(0.98)', opacity: '0.75' },
          '50%': { transform: 'scale(1.01)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'pulse-success': 'pulseSuccess 320ms ease-out',
      },
    },
  },
  plugins: [],
};
