// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Scan all HTML and TypeScript files in src
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"], // Define 'inter' custom font family
        sans: ["Inter", "sans-serif"], // Also set as default sans-serif
      },
    },
  },
  plugins: [],
};
