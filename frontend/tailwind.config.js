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
      },
    },
  },
  plugins: [],
};
