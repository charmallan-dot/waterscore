/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        water: {
          50: '#eff8ff',
          100: '#d0ebff',
          200: '#a5d8ff',
          300: '#74c0fc',
          400: '#4dabf7',
          500: '#339af0',
          600: '#228be6',
          700: '#1c7ed6',
          800: '#1971c2',
          900: '#1864ab',
        },
        grade: {
          A: '#2b8a3e',
          B: '#5c940d',
          C: '#e67700',
          D: '#d9480f',
          F: '#c92a2a',
        }
      }
    },
  },
  plugins: [],
}
