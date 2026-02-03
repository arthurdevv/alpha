import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import commonjs from 'vite-plugin-commonjs';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import renderer, { RendererOptions } from 'vite-plugin-electron-renderer';
import preact from '@preact/preset-vite';
import path from 'path';
import { builtinModules } from 'module';

const isDev = process.env.NODE_ENV === 'development';

const alias: Record<string, string> = {
  app: path.resolve(__dirname, 'app'),
  lib: path.resolve(__dirname, 'lib'),
  cli: path.resolve(__dirname, 'cli'),
  shared: path.resolve(__dirname, 'shared'),
  components: path.resolve(__dirname, 'lib/components'),
  shallowequal: 'shallowequal/index.js',
};

const externals: RendererOptions['resolve'] = {
  'node-pty': { type: 'cjs' },
  ssh2: { type: 'cjs' },
  sshpk: { type: 'cjs' },
  glasstron: { type: 'cjs' },
  'native-reg': { type: 'cjs' },
  'native-process-working-directory': { type: 'cjs' },
  '@serialport/bindings-cpp': { type: 'cjs' },
  '@luminati-io/socksv5': { type: 'cjs' },
  socksv5: { type: 'cjs' },
  '@sentry/electron': { type: 'cjs' },
  '@sentry/electron/main': { type: 'cjs' },
  '@sentry/electron/renderer': { type: 'cjs' },
};

export default defineConfig({
  server: { port: 4000, strictPort: true },
  build: {
    outDir: 'target',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('xterm')) return 'vendor-xterm';
          if (id.includes('node_modules')) return 'vendor';
          return null;
        },
      },
    },
  },
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
    commonjs(),
    preact(),
    renderer({ resolve: externals }),
    electron([
      {
        entry: path.resolve(__dirname, 'app/window', 'index.ts'),
        vite: {
          resolve: { alias },
          build: {
            outDir: 'target',
            rollupOptions: {
              external: Object.keys(externals).concat(Object.values(alias)),
            },
            minify: !isDev,
          },
        },
      },
      {
        entry: path.resolve(__dirname, 'cli', 'index.ts'),
        vite: {
          build: {
            outDir: 'target',
            rollupOptions: {
              output: { entryFileNames: 'cli.js', format: 'cjs' },
              external: [...builtinModules],
            },
            minify: !isDev,
          },
        },
      },
    ]),
    viteStaticCopy({
      targets: [
        { src: './app/settings/default.yaml', dest: 'app/settings' },
        { src: './app/keymaps/default.yaml', dest: 'app/keymaps' },
        { src: './lib/styles/fonts', dest: 'lib/styles' },
        { src: './locales/*', dest: 'locales' },
        { src: './*.json', dest: '' },
      ],
    }),
  ],
});
