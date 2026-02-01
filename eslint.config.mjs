import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // These rules specifically target the common Shadcn deployment "breakers"
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // Change to warn so it doesn't kill the build
      "@typescript-eslint/no-empty-object-type": "off", // Common in Shadcn interfaces
      "@typescript-eslint/no-explicit-any": "warn", // Allows 'any' without crashing build
      "react/no-unescaped-entities": "off", // Stops errors for things like ' or > in JSX
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**", // Good practice to include
  ]),
]);

export default eslintConfig;