/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1c7ec0',
        danger: '#e63946',
        success: '#2ecc71',
        rose: '#ebd4d0',
        lavender: '#efe4fd',
        sky: '#cbe4e9',
        cream: '#fef6de',
        mint: '#e2f7d9',
        brown: '#8d6e63',
        'rose-dark': '#8b6f67',
        'lavender-dark': '#6b5d9e',
        'sky-dark': '#5a8c94',
        'cream-dark': '#9e8f5f',
        'mint-dark': '#638f57',
        'brown-dark': '#6d564c',
      },
      fontFamily: {
        'qingyun': ['清韵文楷', 'system-ui', '-apple-system', 'sans-serif'],
      },
      transitionDuration: {
        DEFAULT: '300ms',
      }
    },
  },
  plugins: [],
}
