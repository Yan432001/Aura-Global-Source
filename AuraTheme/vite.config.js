import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'),
      '@logos': path.resolve(__dirname, './public/logos'),
      '@AdCat': path.resolve(__dirname, './src/assets/styles'),
    },
  },
  server: {
    host: true,         // Exposes the dev server to your local network (LAN IP) and external tunnels
    port: 5173,
    strictPort: true,   // Prevents Vite from automatically switching ports if 5173 is busy
    allowedHosts: true, // Accepts all incoming tunnel and proxy domains (e.g., Cloudflare, ngrok)
  },
});