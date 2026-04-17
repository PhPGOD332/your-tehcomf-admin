import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'admin.tehcomf.ru',
      'localhost',
      '127.0.0.1'
    ],
  },
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: [],
    external: [
      'swiper',
      'swiper/react',
      'swiper/modules',
    ],
  },
  optimizeDeps: {
    include: ['swiper', 'swiper/react', 'swiper/modules'],
  },
});
