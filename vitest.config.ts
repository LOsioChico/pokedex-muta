/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    css: true,
    exclude: ["postcss.config.js", "tailwind.config.js", "node_modules", "dist"],
  },
});
