/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#0F172A',
          card: '#1E293B',
          accent: '#6366F1',
          dead: '#EF4444',
          wounded: '#F59E0B',
          success: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 0.5s ease-in-out 2',
      },
    },
  },
  plugins: [],
};
