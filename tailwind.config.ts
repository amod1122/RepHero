import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#090E12",
        navy: "#0F3554",
        "deep-navy": "#0F3554",
        charcoal: "#131D25",
        mist: "#F7F8FA",
        sky: "#C6DDF5",
        peach: "#FFE3D1",
        slate: "#4A5560",
        line: "#E3E6EA",
        // Semantic aliases
        border: "#E3E6EA",
        background: "#FFFFFF",
        foreground: "#131D25",
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Instrument Serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "2px",
        sm: "2px",
        md: "2px",
        lg: "4px",
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        eyebrow: "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
