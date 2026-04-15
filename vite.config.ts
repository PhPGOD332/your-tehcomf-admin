import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
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
