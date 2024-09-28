import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/components"),
      "@libs": resolve(__dirname, "./src/libs"),
      "@routes": resolve(__dirname, "./src/routes"),
      "@layouts": resolve(__dirname, "./src/layouts"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@models": resolve(__dirname, "./src/models"),
      "@mutation": resolve(__dirname, "./src/mutation"),
      "@services": resolve(__dirname, "./src/services"),
      "@store": resolve(__dirname, "./src/store"),
      "@query": resolve(__dirname, "./src/query"),
      "@debounces": resolve(__dirname, "./src/debounces"),
    },
  },
});
