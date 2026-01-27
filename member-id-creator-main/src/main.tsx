import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";

// 🔹 PWA – registra o Service Worker
import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
});

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
