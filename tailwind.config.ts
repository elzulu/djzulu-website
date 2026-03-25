import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          electric: '#00b4ff',
        },
        purple: {
          neon: '#b44fff',
        },
        dark: {
          DEFAULT: '#07071a',
          card: '#0d0d2b',
          border: 'rgba(0,180,255,0.15)',
        },
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        rajdhani: ['var(--font-rajdhani)', 'sans-serif'],
      },
      animation: {
        'eq1': 'eq1 0.8s ease-in-out infinite alternate',
        'eq2': 'eq2 0.6s ease-in-out infinite alternate',
        'scan': 'scan 4s linear infinite',
        'pulse-border': 'pulseBorder 2s ease-in-out infinite',
      },
      keyframes: {
        eq1: { '0%': { height: '10px' }, '100%': { height: '38px' } },
        eq2: { '0%': { height: '20px' }, '100%': { height: '28px' } },
        scan: { '0%': { top: '0%' }, '100%': { top: '100%' } },
        pulseBorder: {
          '0%, 100%': { borderColor: 'rgba(0,180,255,0.3)' },
          '50%': { borderColor: 'rgba(180,79,255,0.6)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
