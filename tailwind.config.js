/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",  //  Add this line if your components are in a separate folder
        "*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
      extend: {
        colors: {
          'beige': '#F5F5DC',
          'brass': '#B5A642',
          'blue': '#0000FF',
        },
      },
    },
    plugins: [],
  }
