import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.BACKEND_URL ?? 'http://localhost:3001';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/socket.io': {
          target: backendUrl,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
