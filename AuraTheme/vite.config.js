import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Helper to resolve an optional dependency from local AuraTheme/node_modules, root ../node_modules, or local stub
function resolveOptionalPackage(pkgName, fallbackRelativePath) {
  const localDir = path.resolve(__dirname, 'node_modules', pkgName);
  const parentDir = path.resolve(__dirname, '..', 'node_modules', pkgName);
  if (fs.existsSync(localDir)) return localDir;
  if (fs.existsSync(parentDir)) return parentDir;
  return path.resolve(__dirname, fallbackRelativePath);
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@logos': path.resolve(__dirname, './public/logos'),
      '@AdCat': path.resolve(__dirname, './src/assets/styles'),
      '@ant-design/v5-patch-for-react-19': path.resolve(__dirname, './src/utils/antdPatch.js'),
      'jspdf': resolveOptionalPackage('jspdf', './src/utils/jspdfStub.js'),
      'jsqr': resolveOptionalPackage('jsqr', './src/utils/jsqrStub.js'),
    },
  },
  server: {
    host: true,         // Exposes the dev server to your local network (LAN IP) and external tunnels
    port: 5173,
    strictPort: true,   // Prevents Vite from automatically switching ports if 5173 is busy
    allowedHosts: true, // Accepts all incoming tunnel and proxy domains (e.g., Cloudflare, ngrok)
    fs: {
      allow: ['..'],
    },
  },
});
