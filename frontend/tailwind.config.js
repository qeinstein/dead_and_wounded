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
        // Clean light neutral surfaces
        surface: {
          DEFAULT: '#f6f7f5', // page base
          1: '#ffffff',       // panels / cards
          2: '#f8fafc',       // raised elements / inputs
          3: '#f1f5f9',       // hover / used keys
          border: '#e2e8f0',  // hairline borders (slate-200)
        },
        // Single accent — refined indigo
        accent: {
          DEFAULT: '#4f46e5',
          soft: '#eef2ff',
          dim: '#4338ca',
          glow: 'rgba(79, 70, 229, 0.14)',
        },
        // Semantic feedback (tuned for contrast on light)
        dead: '#e11d48',
        wounded: '#d97706',
        win: '#059669',
        muted: '#64748b', // secondary text (slate-500)
      },
      boxShadow: {
        panel: '0 1px 2px rgba(15,23,42,0.04), 0 14px 34px -16px rgba(15,23,42,0.14)',
        glow: '0 1px 2px rgba(79,70,229,0.16), 0 12px 30px -12px rgba(79,70,229,0.38)',
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
