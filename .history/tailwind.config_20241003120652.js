/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [

    function ({ addUtilities }) {
      addUtilities({
        '.no-arrows': {
          '-moz-appearance': 'textfield',
          '-webkit-appearance': 'none',
          'margin': 0,
        },
        '.no-spin::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          'margin': 0,
        },
        '.no-spin::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          'margin': 0,
        },
      });
    },
  ],
}

