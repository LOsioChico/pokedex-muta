/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    css: true,
    coverage: {
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/main.tsx", "**/*/index.{ts,tsx}", "**/*.d.ts"],
    },
  },
});
