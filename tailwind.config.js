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
        'Mono': ['Noto Sans Mono', 'Arial'],
        'Roboto': ['Roboto Condensed', 'Arial']
      },
      colors:{
        'AniListBlue': "#02a9ff",
        'AniListDarkBlue': "#0c1522",
        'HeaderBG': "#152232",
        'TwitterBlue': "#26a7de",
      }
    },
  },
  plugins: [],
}