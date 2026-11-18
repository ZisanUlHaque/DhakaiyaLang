/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dhaka: {
          bg: '#08090E',
          card: '#10131E',
          elevated: '#171B2A',
          border: '#242B42',
          terracotta: '#D94819',
          terracottaLight: '#FF5722',
          mustard: '#F59E0B',
          gold: '#FFD700',
          rickshawYellow: '#FFD700',
          rickshawPink: '#EC4899',
          rickshawGreen: '#10B981',
          rickshawBlue: '#06B6D4',
          crimson: '#EF4444',
          textLight: '#F8FAFC',
          textMuted: '#94A3B8'
        }
      },
      fontFamily: {
        bangla: ['"Anek Bangla"', 'ui-sans-serif', 'sans-serif'],
        mono: ['"Fira Code"', 'ui-monospace', 'monospace'],
        code: ['"Fira Code"', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
};
