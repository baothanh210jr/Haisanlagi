/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem', // mobile
        sm: '1.25rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px', // 👈 chuẩn e-commerce
        '2xl': '1320px', // 👈 desktop lớn
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Quicksand"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
      },
      colors: {
        primary: '#004E89',
        'primary-100': '#053C5E',
        secondary: '#1B98E0',
        accent: '#F2C14E',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
