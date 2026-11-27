import type { Config } from "tailwindcss";

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050A14",
        navy: "#071A36",
        "deep-navy": "#071A36",
        charcoal: "#0B1220",
        mist: "#F5F8FC",
        sky: "#DDEBFF",
        peach: "#FFE6DD",
        slate: "#667085",
        line: "#DCE3EC",
        // Semantic aliases
        border: "#DCE3EC",
        background: "#FFFFFF",
        foreground: "#050A14",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
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
