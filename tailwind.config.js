/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        primary: "#e4e7e9",
        secondary: "#707070",
      },

      fontFamily: {
        heading: "Work Sans",
        body: ["var(--font-work-sans)"],
      },
      fontWeight: {
        normal: "400",
        bold: "700",
      },

      keyframes: {
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },

        "move-in": {
          "0%": {
            transform: "translateX(-50vw)",
          },
          "100%": {
            transform: "translateX(0px)",
          },
        },
      },

      animation: {
        "fade-in": "fade-in 4s forwards",
      },
    },

    screens: {
      sm: "500px",
      md: "768px",
      lg: "1024px",
      xl: "1400px",
    },
  },
  plugins: [require("@headlessui/tailwindcss")({ prefix: "ui" })],
};
