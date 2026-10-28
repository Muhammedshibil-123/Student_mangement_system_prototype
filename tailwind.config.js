/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

// Brand + status palettes (light values). Each shade becomes a CSS variable so
// every `bg-teal-50` / `text-slate-500` class automatically adapts in dark mode.
const PALETTES = {
  teal: { 50: '#e8f6f4', 100: '#c6eae5', 200: '#93d7ce', 300: '#5dc1b4', 400: '#36ad9f', 500: '#26a69a', 600: '#1d8a80', 700: '#186f68', 800: '#145851', 900: '#0f433e' },
  sun: { 50: '#fff8e8', 100: '#feedc4', 200: '#fcdc8a', 300: '#f9c95a', 400: '#f6b93b', 500: '#e9a21c', 600: '#c78310', 700: '#9e6510', 800: '#7a4e0d', 900: '#5c3b0a' },
  coral: { 50: '#fdf0ed', 100: '#fbdcd5', 200: '#f6b8aa', 300: '#f1957f', 400: '#ec7563', 500: '#dd5a45', 600: '#bb4433', 700: '#93352a', 800: '#732a22', 900: '#57201a' },
  sky: { 50: '#ecf3fc', 100: '#d4e4f8', 200: '#a9c8f0', 300: '#78a7e4', 400: '#4a86d4', 500: '#2f6bbf', 600: '#24559c', 700: '#1d457e', 800: '#173762', 900: '#112a4a' },
  emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b' },
  red: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d' },
  violet: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95' },
}
const SLATE_LIGHT = { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' }
const SLATE_DARK = { 50: '#0b1220', 100: '#1a2538', 200: '#263349', 300: '#34435c', 400: '#5f6f87', 500: '#8a99b0', 600: '#a8b5c8', 700: '#c3cddb', 800: '#dbe2ec', 900: '#eef2f8' }
const DARK_BG = '#0b1220'

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => { const x = hexToRgb(a), y = hexToRgb(b); return x.map((v, i) => Math.round(v * t + y[i] * (1 - t))) }
const rgb = (h) => hexToRgb(h).join(' ')
// tints become deep washes, deep shades become light text colours
const darkShade = (p, s) => ({
  50: mix(p[600], DARK_BG, 0.16), 100: mix(p[600], DARK_BG, 0.3), 200: mix(p[500], DARK_BG, 0.45),
  300: hexToRgb(p[300]), 400: hexToRgb(p[400]), 500: hexToRgb(p[500]), 600: hexToRgb(p[400]),
  700: hexToRgb(p[300]), 800: hexToRgb(p[200]), 900: hexToRgb(p[100]),
}[s].join(' '))

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
const varColor = (name) => Object.fromEntries(SHADES.map((s) => [s, `rgb(var(--${name}-${s}) / <alpha-value>)`]))
const token = (n) => `rgb(var(--${n}) / <alpha-value>)`

const themeVars = plugin(({ addBase }) => {
  const light = {}, dark = {}
  for (const [name, p] of Object.entries(PALETTES)) for (const s of SHADES) { light[`--${name}-${s}`] = rgb(p[s]); dark[`--${name}-${s}`] = darkShade(p, s) }
  for (const s of SHADES) { light[`--slate-${s}`] = rgb(SLATE_LIGHT[s]); dark[`--slate-${s}`] = rgb(SLATE_DARK[s]) }
  Object.assign(light, {
    '--background': '245 247 250', '--foreground': '20 37 63', '--card': '255 255 255', '--muted': '238 242 246',
    '--muted-foreground': '91 107 130', '--border': '226 232 239', '--primary': '20 37 63', '--primary-foreground': '255 255 255',
  })
  Object.assign(dark, {
    '--background': '11 18 32', '--foreground': '232 237 245', '--card': '18 27 44', '--muted': '26 37 56',
    '--muted-foreground': '147 162 184', '--border': '36 50 74', '--primary': '26 125 115', '--primary-foreground': '255 255 255',
  })
  addBase({ ':root': light, '.dark': { ...dark, colorScheme: 'dark' } })
})

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: token('background'), foreground: token('foreground'), card: token('card'),
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        border: token('border'), primary: { DEFAULT: token('primary'), foreground: token('primary-foreground') },
        // navy stays fixed: it is the brand colour for hero surfaces in both themes
        navy: { 50: '#eef2f8', 100: '#d9e1ee', 200: '#b3c2dc', 300: '#7f97bf', 400: '#4f6c9c', 500: '#2f4c7c', 600: '#223a63', 700: '#1a2e50', 800: '#14253f', 900: '#0e1a2e' },
        ...Object.fromEntries(Object.keys(PALETTES).map((n) => [n, varColor(n)])),
        slate: varColor('slate'),
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Malayalam"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', '"Noto Sans Malayalam"', 'system-ui', 'sans-serif'],
      },
      // "beautiful-shadows" skill: layered neutral elevation (sm / md / lg)
      boxShadow: {
        soft: '0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)',
        card: '0px 0px 0px 1px rgba(0,0,0,0.04), 0px 1px 1px -0.5px rgba(0,0,0,0.06), 0px 3px 3px -1.5px rgba(0,0,0,0.06), 0px 6px 6px -3px rgba(0,0,0,0.05), 0px 12px 12px -6px rgba(0,0,0,0.04)',
        float: '0 2.8px 2.2px rgba(0,0,0,0.034), 0 6.7px 5.3px rgba(0,0,0,0.048), 0 12.5px 10px rgba(0,0,0,0.06), 0 22.3px 17.9px rgba(0,0,0,0.072), 0 41.8px 33.4px rgba(0,0,0,0.086), 0 100px 80px rgba(0,0,0,0.12)',
      },
      keyframes: {
        pulseRing: { '0%': { transform: 'scale(.6)', opacity: '.8' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
        slideUp: { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        breathe: { '0%,100%': { transform: 'scale(.7)' }, '50%': { transform: 'scale(1.15)' } },
        wave: { '0%,100%': { transform: 'scaleY(.35)' }, '50%': { transform: 'scaleY(1)' } },
        // "animation-on-scroll" skill keyframe
        animationIn: { '0%': { opacity: '0', transform: 'translateY(16px)', filter: 'blur(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' } },
        screenIn: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        pulseRing: 'pulseRing 1.8s ease-out infinite',
        slideUp: 'slideUp .28s cubic-bezier(.2,.8,.2,1)',
        fadeIn: 'fadeIn .2s ease-out',
        breathe: 'breathe 8s ease-in-out infinite',
        wave: 'wave 1s ease-in-out infinite',
        screenIn: 'screenIn .35s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [themeVars],
}
