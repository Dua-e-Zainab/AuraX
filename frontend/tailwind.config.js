/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your source files
  ],
  theme: {
    extend: {
      animation: {
<<<<<<< HEAD
        slider: 'slider 20s linear infinite',
      },
      keyframes: {
        slider: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          from: {
            opacity: 0,
            transform: 'scaleY(0.9)',
          },
          to: {
            opacity: 1,
            transform: 'scaleY(1)',
          },
        },
=======
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
>>>>>>> 972ea32af6ee81fa93f94f0d7c612421acd5bb5f
      },
    },
  },
  plugins: [],
};
