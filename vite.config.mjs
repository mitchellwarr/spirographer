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

export default defineConfig({
  base: './',
  plugins: [jsxInJs, react()],
  resolve: {
    alias: {
      elements: path.join(srcPath, 'elements'),
      'graph-data': path.join(srcPath, 'graph-data'),
      hooks: path.join(srcPath, 'hooks'),
      lib: path.join(srcPath, 'lib'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
});
