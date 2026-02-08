import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

const eslintConfig = [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    ...nextVitals,
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...nextTs,
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"]
  }
];

export default eslintConfig;
