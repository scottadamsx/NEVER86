/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1e3a5f',
          blue: '#2d4a6f',
          light: '#3d5a7f',
        },
        manager: {
          primary: '#1e3a5f',
          light: '#2d4a6f',
        },
        server: {
          primary: '#3d5a7f',
          light: '#4d6a8f',
        },
        kitchen: {
          primary: '#2d4a6f',
          light: '#3d5a7f',
        },
      },
    },
  },
  plugins: [],
}