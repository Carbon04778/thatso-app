/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Elementor's breakpoints: mobile <= 767px, tablet 768-1024px, desktop >= 1025px.
    screens: {
      md: '768px',
      lg: '1025px',
    },
    extend: {
      colors: {
        brand: '#AC8542',
        'brand-dark': '#292929',
      },
    },
  },
  plugins: [],
}
