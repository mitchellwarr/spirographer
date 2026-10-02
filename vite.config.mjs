import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));

const jsxInJs = {
  name: 'jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.startsWith(`${srcPath}/`) || !id.endsWith('.js')) return;

    const result = await transformWithOxc(code, id, {
      lang: 'jsx',
      jsx: { runtime: 'automatic' },
    });
    return { code: result.code, map: result.map };
  },
};

export default defineConfig(({ command }) => ({
  root: srcPath,
  publicDir: path.resolve(srcPath, '../public'),
  base: command === 'build' ? '/spirographer/build/' : './',
  plugins: [
    jsxInJs,
    react(),
    {
      name: 'dev-graph-worker-route',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url?.startsWith('/GraphWorker.js')) {
            request.url = request.url.replace(
              '/GraphWorker.js',
              '/graph-data/GraphWorker.js'
            );
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      elements: path.join(srcPath, 'elements'),
      'graph-data': path.join(srcPath, 'graph-data'),
      hooks: path.join(srcPath, 'hooks'),
      lib: path.join(srcPath, 'lib'),
    },
  },
  optimizeDeps: {
    rolldownOptions: {
      plugins: [
        {
          ...jsxInJs,
          name: 'jsx-in-js-dependency-scan',
        },
      ],
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: path.resolve(srcPath, '../build'),
    emptyOutDir: true,
    assetsDir: '',
    sourcemap: true,
    rolldownOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  worker: {
    rolldownOptions: {
      output: {
        entryFileNames: 'GraphWorker.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
}));
