import { builtinModules } from 'node:module';
import path from 'node:path';

import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import type { ElectronOptions } from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const externals = [
  ...builtinModules.map(m => `node:${m}`),
  'glasstron',
  'node-pty',
  'native-reg',
  'native-process-working-directory',
  'ssh2',
  'sshpk',
  'socksv5',
  '@luminati-io/socksv5',
  '@serialport/bindings-cpp',
  '@sentry/electron',
  '@sentry/electron/main',
  '@sentry/electron/renderer',
];

const alias: Record<string, string> = {
  main: path.resolve(__dirname, 'src/main'),
  ui: path.resolve(__dirname, 'src/ui'),
  shared: path.resolve(__dirname, 'src/shared'),
  components: path.resolve(__dirname, 'src/ui/components'),
  cli: path.resolve(__dirname, 'cli'),
};

function electronConfig(
  entry: string,
  fileName: string,
  isDev: boolean,
): ElectronOptions {
  return {
    entry: path.resolve(__dirname, entry),
    vite: {
      resolve: { alias },
      build: {
        target: 'node18',
        outDir: 'target',
        minify: !isDev,
        rollupOptions: {
          external: externals,
          output: {
            format: 'cjs',
            entryFileNames: fileName,
            manualChunks(id) {
              if (id.includes('xterm')) return 'vendor-xterm';
              if (id.includes('node_modules')) return 'vendor';
            },
          },
        },
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    server: { port: 4000, strictPort: true },
    build: { target: 'esnext', outDir: 'target', minify: !isDev },
    resolve: {
      alias: {
        ...alias,
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
    },
    plugins: [
      preact(),
      renderer(),
      electron([
        electronConfig('src/main/window/index.ts', 'index.js', isDev),
        electronConfig('src/main/window/preload.ts', 'preload.js', isDev),
        electronConfig('cli/index.ts', 'cli.js', isDev),
      ]),
      viteStaticCopy({
        targets: [
          { src: './src/ui/fonts', dest: 'src/ui' },
          { src: './locales/*', dest: 'locales' },
          { src: './*.json', dest: '' },
        ],
      }),
    ],
  };
});
