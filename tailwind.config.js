/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Example sans-serif stack
        serif: ['Times New Roman', 'serif'], // Times New Roman as default serif font
      },
    },
  },
  plugins: [],
};
