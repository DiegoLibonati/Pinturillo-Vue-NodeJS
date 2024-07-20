/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/**/*.vue",
    "./src/layouts/**/*.vue",
    "./src/containers/**/*.vue",
    "./src/pages/**/*.vue",
    "./src/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#222831",
        secondary: "#393E46",
        tertiary: "#00ADB5",
        quaternary: "#EEEEEE",
      },
      fontFamily: {
        playwrite: ['"Playwrite NZ"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
