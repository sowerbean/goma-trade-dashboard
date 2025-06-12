import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  //for graph rendering
  define: {
    global: 'window'
  },
  optimizeDeps: {
    include: ['vis-network'] // Add this if using vis-network directly
  },
  //------------------//
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
