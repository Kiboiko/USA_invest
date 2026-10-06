import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

/**
 * Сборка автономного архива для передачи заказчику: npm run build:archive
 *
 * Обычная сборка (vite.config.ts) рассчитана на веб-сервер с SPA-fallback и
 * здесь не годится по трём причинам, каждая из которых ломает открытие с диска:
 *
 *   1. Пути от корня (/assets/…) — по file:// уводят в корень диска.
 *      Лечится base: './' и заменой абсолютных путей к картинкам.
 *   2. <script type="module"> — браузеры блокируют модули на file://
 *      из-за CORS. Лечится сборкой в формат iife (обычный <script src>).
 *   3. Маршруты живут только в роутере, файлов preland/landing на диске нет.
 *      Лечится MemoryRouter в src/archive/main.tsx.
 *
 * Результат складывается в archive/ и работает и с диска, и с любого хостинга,
 * включая размещение во вложенной папке.
 */

/**
 * В архиве нет корня сайта: /images/x.png превращаем в images/x.png,
 * /videos/x.mp4 — в videos/x.mp4. Каталоги лежат в public/, поэтому в архив
 * попадают как есть; новый каталог в public/ сюда нужно добавить.
 */
function relativeImagePaths(): Plugin {
  return {
    name: 'archive-relative-image-paths',
    apply: 'build',
    renderChunk(code) {
      return { code: code.replace(/(["'`])\/(images|videos)\//g, '$1$2/'), map: null };
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), relativeImagePaths()],
  /**
   * В режиме библиотеки Vite не подставляет NODE_ENV сам. Без этой строки в
   * бандл попадают обе сборки React (dev и prod), а в браузере код падает на
   * `process is not defined` — архив просто не открывается.
   */
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'archive',
    emptyOutDir: true,
    // Один файл стилей: в HTML архива он подключается фиксированным именем
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/archive/main.tsx'),
      formats: ['iife'],
      name: 'FinvoryxArchive',
      fileName: () => 'assets/app.js',
      cssFileName: 'style',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
