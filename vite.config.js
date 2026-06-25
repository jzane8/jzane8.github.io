import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  base: '/',
  resolve: {
    // Alias React → Preact at build time. Explicit (rather than relying on the
    // preset's defaults) so the `react-dom/client` subpath used by main.jsx
    // resolves to preact/compat instead of the real ReactDOM that stays
    // installed to satisfy react-router-dom's peer dependency.
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/client': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Bucket all third-party code into a long-cached vendor chunk. Matches
        // by resolved path, so it captures preact/compat + react-router
        // regardless of the aliases above.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'react-vendor';
        },
      },
    },
  },
});
