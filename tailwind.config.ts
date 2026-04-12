import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#22d3a5',
          dim: 'rgba(34,211,165,0.12)',
          glow: 'rgba(34,211,165,0.25)',
        },
        purple: {
          DEFAULT: '#8b5cf6',
          dim: 'rgba(139,92,246,0.12)',
        },
        orange: {
          DEFAULT: '#f97316',
          dim: 'rgba(249,115,22,0.12)',
        },
      },
      animation: {
        'float-slow': 'floatSlow 18s ease-in-out infinite',
        'float-slower': 'floatSlower 24s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'grain': 'grain 0.4s steps(1) infinite',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.04)' },
          '66%': { transform: 'translate(-25px, 15px) scale(0.97)' },
        },
        floatSlower: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '40%': { transform: 'translate(-35px, 25px) scale(1.06)' },
          '70%': { transform: 'translate(20px, -20px) scale(0.96)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        grain: {
          '0%':  { transform: 'translate(0%, 0%)' },
          '10%': { transform: 'translate(-4%, -8%)' },
          '20%': { transform: 'translate(8%, 3%)' },
          '30%': { transform: 'translate(-3%, 12%)' },
          '40%': { transform: 'translate(6%, -6%)' },
          '50%': { transform: 'translate(-9%, 4%)' },
          '60%': { transform: 'translate(5%, -10%)' },
          '70%': { transform: 'translate(-7%, 2%)' },
          '80%': { transform: 'translate(3%, 8%)' },
          '90%': { transform: 'translate(-2%, -4%)' },
          '100%': { transform: 'translate(0%, 0%)' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(8px)', opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
