import { defineConfig } from 'vitest/config';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', //'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' | string
  },
  plugins: [
    AutoImport({
      imports: ['vitest'],
      sourceMap: true,
      dts: './auto-import/auto-imports.d.ts', // generate TypeScript declaration
      eslintrc: {
        enabled: true,
        filepath: './auto-import/.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
  ],
});
