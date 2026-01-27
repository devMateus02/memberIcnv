import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),

    // 🔹 Tagger só em dev
    mode === "development" && componentTagger(),

    // 🔹 PWA
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // permite testar PWA em dev
      },
      manifest: {
        name: "Carteirinha Digital ICNV",
        short_name: "Carteirinha ICNV",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        orientation: "portrait",
        icons: [
          {
            src: "/icons/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
