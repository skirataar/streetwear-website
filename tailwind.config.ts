import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#E9DFC7",
        ink: "#221D16",
        signal: "#E14522",
        tape: "#D3A029",
        crt: "#2E6E68",
        static: "#B8AE94",
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"],
        body: ["var(--font-karla)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      animation: {
        tracking: "tracking 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        marquee: "marquee 25s linear infinite",
        "marquee-fast": "marquee 15s linear infinite",
        "scanline": "scanline 8s linear infinite",
      },
      keyframes: {
        tracking: {
          "0%": {
            transform: "translateX(0) scale(1)",
            filter: "none",
            clipPath: "inset(0 0 0 0)",
          },
          "20%": {
            transform: "translateX(-4px) skewX(2deg)",
            filter: "hue-rotate(90deg) contrast(150%)",
            clipPath: "inset(10% 0 30% 0)",
          },
          "40%": {
            transform: "translateX(5px) skewX(-3deg)",
            filter: "invert(15%) saturate(200%)",
            clipPath: "inset(40% 0 15% 0)",
          },
          "60%": {
            transform: "translateX(-3px) skewX(1deg)",
            filter: "contrast(180%) brightness(1.2)",
            clipPath: "inset(70% 0 5% 0)",
          },
          "80%": {
            transform: "translateX(2px)",
            filter: "hue-rotate(-45deg)",
            clipPath: "inset(5% 0 65% 0)",
          },
          "100%": {
            transform: "translateX(0) scale(1)",
            filter: "none",
            clipPath: "inset(0 0 0 0)",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scanline: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
