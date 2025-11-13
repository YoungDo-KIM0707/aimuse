// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // ✅ 백엔드 컨텍스트 + /api까지 포함(아래 주소는 네 ngrok)
        target:
          "https://unrecusant-unecliptically-kristal.ngrok-free.dev/aimuse-server/api",
        changeOrigin: true,
        secure: false, // ngrok 인증서 이슈 회피 (true여도 되지만 false가 안전)
        rewrite: (p) => p.replace(/^\/api/, ""), // "/api/music/upload" → "music/upload"
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});
