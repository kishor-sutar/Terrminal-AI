import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
// Configured for both web development and Electron production builds
export default defineConfig(({ mode }) => ({
  // Use relative paths for Electron file:// protocol
  base: mode === 'production' ? './' : '/',
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Output directory for Electron
    outDir: 'dist',
    // Generate source maps for debugging
    sourcemap: mode === 'development',
    // Ensure assets use relative paths
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Consistent chunk naming for Electron
        manualChunks: undefined,
      },
    },
  },
}));
