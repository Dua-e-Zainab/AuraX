/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
theme: {
  extend: {
    animation: {
      slider: 'slider 20s linear infinite',
    },
    keyframes: {
      slider: {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(-100%)' },
      },
    },
  },
},
  plugins: [],
};

// module.exports = {
// theme: {
//   extend: {
//     animation: {
//       slider: 'slider 12s linear infinite',
//     },
//     keyframes: {
//       slider: {
//         '0%': { transform: 'translateX(0)' },
//         '100%': { transform: 'translateX(-100%)' },
//       },
//     },
//   },
// },
// };