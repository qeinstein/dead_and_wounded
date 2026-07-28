/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        // Layered neutral surfaces — refined near-black with a faint cool cast
        surface: {
          DEFAULT: '#08090c', // page base
          1: '#0e1015',       // panels
          2: '#151821',       // raised elements
          3: '#1d212c',       // inputs / hover
          border: '#242833',  // hairline borders
        },
        // Single accent — refined indigo
        accent: {
          DEFAULT: '#7c6cff',
          soft: '#a89bff',
          dim: '#5a48e0',
          glow: 'rgba(124, 108, 255, 0.16)',
        },
        // Semantic feedback
        dead: '#f2555a',
        wounded: '#f4b13d',
        win: '#4ecb8a',
        muted: '#7c8397', // secondary text
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.8)',
        glow: '0 0 0 1px rgba(124,108,255,0.25), 0 8px 30px -10px rgba(124,108,255,0.35)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
