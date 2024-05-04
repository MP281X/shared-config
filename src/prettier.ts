import type { Config } from "prettier";

const config: Config ={
  semi: false,
  useTabs: true,
  printWidth: 150,
  singleQuote: true,
  trailingComma: "none",
  arrowParens: "always",
  quoteProps: "consistent",
  experimentalTernaries: true,
  overrides: [{ files: "*.json", options: { parser: "jsonc" } }],
  plugins: [
    "prettier-plugin-svelte",
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
  ],
} 

export default config
