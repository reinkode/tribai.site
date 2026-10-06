import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#060309",
        abyss: "#0B0612",
        panel: "#120A1E",
        brand: {
          purple: "#A020F0",
          light: "#D7A1F9",
          dark: "#51087E",
        },
        mist: "#D8D8D8",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 8s ease-in-out infinite",
        "spin-slow": "spin 24s linear infinite",
        "fade-up": "fadeUp 0.8s ease-out both",
        marquee: "marquee 32s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(160, 32, 240, 0.45)",
        "glow-lg": "0 0 64px rgba(160, 32, 240, 0.35)",
        card: "0 8px 40px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse at center, rgba(160,32,240,0.22) 0%, transparent 65%)",
      },
    },
  },
  plugins: [],
};

export default config;
