import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "sans-serif",
        ],
      },
      colors: {
        cyber: {
          dark: "#070B14",
          card: "#0D1527",
          border: "#1E293B",
          cyan: "#00F0FF",
          blue: "#3B82F6",
          purple: "#8B5CF6",
          accent: "#06B6D4",
        },
        risk: {
          low: "#10B981",
          medium: "#F59E0B",
          high: "#F97316",
          critical: "#EF4444",
        },
      },
      backgroundImage: {
        "cyber-grid": "radial-gradient(circle, rgba(0, 240, 255, 0.08) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan 2s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
