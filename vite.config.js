// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://unrecusant-unecliptically-kristal.ngrok-free.dev/aimuse-server",
        changeOrigin: true,
        secure: false,
        // ★ 여기 주석 처리하거나 아래처럼 원본 유지
        // rewrite: (p) => p,       // 또는 이 줄 자체를 삭제
      },
    },
  },
});
