const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["pages/**/*.js"],
  },
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
      },
    },
  },
  variants: {
    extend: {
      cursor: ["hover", "focus"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
