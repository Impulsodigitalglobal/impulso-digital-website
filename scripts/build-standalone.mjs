import { build } from 'esbuild';
import { copyFile, cp, mkdir } from 'node:fs/promises';

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

// Copiar las imágenes del portafolio a la carpeta publicada por Vercel
await mkdir('dist/standalone/project-assets', { recursive: true });

await cp(
  'standalone/project-assets',
  'dist/standalone/project-assets',
  { recursive: true }
);

// Copiar logos usados por la versión standalone al directorio publicado por Vercel
await copyFile(
  'standalone/impulso-logo-mark-blue.png',
  'dist/standalone/impulso-logo-mark-blue.png'
);

await copyFile(
  'standalone/impulso-logo-header-blue.png',
  'dist/standalone/impulso-logo-header-blue.png'
);
