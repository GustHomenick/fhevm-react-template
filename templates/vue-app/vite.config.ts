import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@fhevm/sdk': path.resolve(__dirname, '../../packages/fhevm-sdk/src'),
    },
  },
  optimizeDeps: {
    exclude: ['fhevmjs'],
  },
  server: {
    port: 5173,
  },
});
