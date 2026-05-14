import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    extend: {
      animation: {
        sliding: "sliding 30s linear infinite",
        "partners-marquee-up":
          "partners-marquee-up 32s linear infinite",
        "partners-marquee-down":
          "partners-marquee-down 32s linear infinite",
        "partners-marquee-x-ltr":
          "partners-marquee-x-ltr 40s linear infinite",
        "partners-marquee-x-rtl":
          "partners-marquee-x-rtl 40s linear infinite",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "partners-marquee-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "partners-marquee-down": {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        "partners-marquee-x-ltr": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "partners-marquee-x-rtl": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(50%)" },
        },
      },
    },
  },
};
