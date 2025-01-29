/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "bounce-and-blink": {
          "0%, 100%": {
            transform: "translateY(0) scaleY(1)",
            opacity: 1,
          },
          "45%": {
            transform: "translateY(-20px) scaleY(1)",
            opacity: 1,
          },
          "50%": {
            transform: "translateY(0) scaleY(0.2)",
            opacity: 0.5,
          },
          "55%": {
            transform: "translateY(0) scaleY(1)",
            opacity: 1,
          },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.3 },
        },
      },
      animation: {
        "bounce-and-blink": "bounce-and-blink 2s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
