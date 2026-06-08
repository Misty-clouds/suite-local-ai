import { baseConfig } from "./base.js";

/** @type {import("typescript-eslint").Config} */
export const nextConfig = [
  ...baseConfig,
  {
    rules: {
      // Next.js specific relaxations
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
