import type { Config } from "tailwindcss";

/**
 * Base Tailwind configuration shared across Next.js apps.
 * Each app can extend and override as needed.
 */
export const baseTailwindConfig: Partial<Config> = {
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["var(--font-satoshi)", "sans-serif"],
        geist: ["var(--font-geist-sans)", "sans-serif"],
        "geist-mono": ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
