/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#f8f3eb",
        gold: {
          100: "#f6e6b4",
          300: "#e2bf64",
          500: "#c89b3c",
          700: "#8f6720"
        },
        mocha: {
          700: "#5d432a",
          800: "#3e2a19",
          900: "#24160d"
        }
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Trebuchet MS", "sans-serif"]
      },
      boxShadow: {
        card: "0 30px 60px rgba(70, 42, 15, 0.18)"
      }
    }
  },
  plugins: []
};

