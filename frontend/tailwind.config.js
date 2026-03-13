/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "e-black" : "#0A0A0A",
        "e-hover" : "gray"
      }
    },
  },
  plugins: [],
}