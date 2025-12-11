module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbf0',
          100: '#fff8e7',
          200: '#ffefc2',
          300: '#ffe5a0',
          400: '#ffd700',
          500: '#d4af37',
          600: '#c9a227',
          700: '#a68d1c',
          800: '#807810',
          900: '#665a0b',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          800: '#1f2937',
          900: '#0a0a0a',
        },
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1556821552-7fcfa60d2e74?w=1200&h=600&fit=crop')",
      },
    },
  },
  plugins: [],
};
