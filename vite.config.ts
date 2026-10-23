// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/lotsofsounds": {
        target: "https://api.lotsofsounds.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lotsofsounds/, ""),
      },
    },
  },
});
