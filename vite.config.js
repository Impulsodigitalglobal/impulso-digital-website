import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: '0.0.0.0', port: 4173 },
  build: { rollupOptions: { input: resolve(import.meta.dirname, 'app.html') } },
});
