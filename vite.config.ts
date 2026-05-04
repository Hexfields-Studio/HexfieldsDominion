import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/HexfieldsDominion/", // added for CI/CD. Will put the game and assets under https://Hexfields-Studio.github.io/HexfieldsDominion/.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          `
            @use "sass:map";\n
            @use "@/colors" as *;\n
          `
      }
    }
  }
});
