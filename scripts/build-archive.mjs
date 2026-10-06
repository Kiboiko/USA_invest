import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Генерирует HTML-файлы автономного архива поверх результата vite build
 * (см. vite.archive.config.ts). Vite здесь собран в режиме библиотеки и HTML
 * не создаёт — это и нужно: свой шаблон подключает бандл обычным
 * <script src>, без type="module", который браузеры блокируют на file://.
 *
 * Структура плоская — все HTML лежат в корне рядом с assets/ и images/.
 * Это требование Keitaro (docs.keitaro.io, «Лендинг: локальный»):
 *
 *   — главная страница обязана называться index.html;
 *   — пути только относительные: img/home.png, а не /img/home.png;
 *   — тега <base> в index-файле быть не должно.
 *
 * Последний пункт и определяет плоскую структуру: разложить страницы по
 * папкам можно было бы только с <base>, потому что пути к картинкам
 * подставляет скрипт во время работы (см. src/data/*.ts) и они относительные —
 * из вложенной папки браузер искал бы их в landing/images/. На одном уровне
 * <base> не нужен вовсе, и требование Keitaro выполняется само собой.
 *
 * Переход preland → landing идёт внутри страницы через MemoryRouter, поэтому
 * отдельный файл для него не обязателен; landing.html лежит рядом на случай,
 * если лендинг понадобится открыть напрямую.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Каталог сборки передаётся аргументом: у каждого домена свой архив
const outDir = join(root, process.argv[2] || 'archive');

const pages = [
  // Точка входа: и для Keitaro, и для открытия двойным кликом
  { file: 'index.html', route: '/preland' },
  { file: 'landing.html', route: '/landing' },
];

function html({ route }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <link rel="apple-touch-icon" href="favicon.svg" />
    <meta name="theme-color" content="#0a1220" />

    <!-- Реальные title/description проставляет хук useSeo() на каждой странице -->
    <title>Finvoryx Capital</title>
    <meta name="description" content="Modern financial technology platform." />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="assets/style.css" />
  </head>
  <body>
    <div id="root"></div>
    <!-- Стартовый маршрут для MemoryRouter, см. src/archive/main.tsx -->
    <script>
      window.__PAGE__ = '${route}';
    </script>
    <script src="assets/app.js"></script>
  </body>
</html>
`;
}

if (!existsSync(join(outDir, 'assets', 'app.js'))) {
  console.error('archive/assets/app.js не найден — сначала должен отработать vite build');
  process.exit(1);
}

for (const page of pages) {
  const target = join(outDir, page.file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html(page), 'utf8');
  console.log('written', page.file, '->', page.route);
}

// Правило редиректов Netlify: в архиве оно не нужно и только путает
rmSync(join(outDir, '_redirects'), { force: true });
