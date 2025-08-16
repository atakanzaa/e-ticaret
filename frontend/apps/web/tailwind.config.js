/** @type {import('tailwindcss').Config} */
const baseConfig = require("../../packages/config/tailwind.config.js")

module.exports = {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
}