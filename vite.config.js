import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages needs the repo name as the base path
  base: "/MujeresBridal/",
  build: {
    outDir: "docs",
    emptyOutDir: true
  }
});
