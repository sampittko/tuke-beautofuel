module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["pages/**/*.js", "libs/**/*.js", "hooks/**/*.js", "data/**/*.js"],
  },
  plugins: [require("@tailwindcss/forms")],
};
