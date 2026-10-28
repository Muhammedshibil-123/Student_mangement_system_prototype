/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#eef2f8', 100: '#d9e1ee', 200: '#b3c2dc', 300: '#7f97bf', 400: '#4f6c9c', 500: '#2f4c7c', 600: '#223a63', 700: '#1a2e50', 800: '#14253f', 900: '#0e1a2e' },
        teal: { 50: '#e8f6f4', 100: '#c6eae5', 200: '#93d7ce', 300: '#5dc1b4', 400: '#36ad9f', 500: '#26a69a', 600: '#1d8a80', 700: '#186f68', 800: '#145851', 900: '#0f433e' },
        sun: { 50: '#fff8e8', 100: '#feedc4', 200: '#fcdc8a', 300: '#f9c95a', 400: '#f6b93b', 500: '#e9a21c', 600: '#c78310', 700: '#9e6510' },
        coral: { 50: '#fdf0ed', 100: '#fbdcd5', 200: '#f6b8aa', 300: '#f1957f', 400: '#ec7563', 500: '#dd5a45', 600: '#bb4433', 700: '#93352a' },
        sky: { 50: '#ecf3fc', 100: '#d4e4f8', 200: '#a9c8f0', 300: '#78a7e4', 400: '#4a86d4', 500: '#2f6bbf', 600: '#24559c', 700: '#1d457e' },
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Malayalam"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', '"Noto Sans Malayalam"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,37,63,.06), 0 4px 16px rgba(20,37,63,.06)',
        float: '0 12px 40px rgba(20,37,63,.18)',
      },
      keyframes: {
        pulseRing: { '0%': { transform: 'scale(.6)', opacity: '.8' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
        slideUp: { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        breathe: { '0%,100%': { transform: 'scale(.7)' }, '50%': { transform: 'scale(1.15)' } },
        wave: { '0%,100%': { transform: 'scaleY(.35)' }, '50%': { transform: 'scaleY(1)' } },
      },
      animation: {
        pulseRing: 'pulseRing 1.8s ease-out infinite',
        slideUp: 'slideUp .28s ease-out',
        fadeIn: 'fadeIn .2s ease-out',
        breathe: 'breathe 8s ease-in-out infinite',
        wave: 'wave 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
