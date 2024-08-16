/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'Japanese':['Delta Gothic One', 'Arial'],
        'Title': ['Archivo Black', 'Times New Roman'],
        'Mono': ['Noto Sans Mono', 'Arial']
      }
    },
  },
  plugins: [],
}