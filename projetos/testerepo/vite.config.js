import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        // re-incluir a home raiz, senão ela some do build ao definir input
        main: resolve(__dirname, 'index.html'),
        whitelabel: resolve(__dirname, 'whitelabel/index.html'),
        'whitelabel-templates': resolve(__dirname, 'whitelabel/templates/index.html')
      }
    }
  }
});
