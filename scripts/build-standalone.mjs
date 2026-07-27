import { build } from 'esbuild';
import { copyFile, mkdir } from 'node:fs/promises';

await mkdir('standalone', { recursive: true });
await build({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  format: 'iife',
  outfile: 'standalone/app.js',
  jsx: 'automatic',
  minify: true,
  loader: { '.jsx': 'jsx' },
});
await copyFile('src/styles.css', 'standalone/app.css');
