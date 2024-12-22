/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your source files
  ],
  theme: {
    extend: {
      animation: {
        slider: "slider 20s linear infinite",
        fadeIn: "fadeIn 0.2s ease-in-out",
      },
      keyframes: {
        slider: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      colors: {
        tooltipBg: "rgba(0, 0, 0, 0.8)", // Custom color for tooltip background
      },
      spacing: {
        tooltipOffset: "10px", // Custom offset for tooltip
      },
    },
  },
  plugins: [],
};
