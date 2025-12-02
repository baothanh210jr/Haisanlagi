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
        DEFAULT: '1rem',
        sm: '1.25rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2rem',
        '2k': '2rem',
        '4k': '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1290px',
        '2xl': '1536px',
        '3xl': '2048px',
        '4xl': '3000px',
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
