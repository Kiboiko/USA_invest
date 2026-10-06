#!/usr/bin/env python3
"""
Пакует каталог сборки (archive-site/) в zip для загрузки в Keitaro как
локальный лендинг и проверяет готовый архив.

    python scripts/zip_dir.py archive-site finvoryx-site-keitaro.zip --env .env.site

Почему не Compress-Archive: PowerShell 5.1 пишет в архив пути с обратными
слэшами (assets\\app.js). Windows такой архив читает, а на Linux-сервере
Keitaro он разворачивается в файлы с именами вида "assets\\app.js" прямо в
корне, и страница остаётся без скриптов. zipfile кладёт пути со слэшем.

Проверки после упаковки. При любой ошибке готовый архив не создаётся, а
существующий файл с тем же именем остаётся нетронутым:

  — целостность (CRC), пути без обратных слэшей, index.html в корне;
  — в HTML нет <base> и абсолютных путей вида src="/…", а всё, на что он
    ссылается, лежит в архиве;
  — в бандле нет абсолютных /images/… и /videos/…, а каждый путь к images/ и
    videos/ указывает на файл, который есть в архиве;
  — в бандл зашиты адрес Apps Script и ID пикселя Meta из --env. Если сборку
    запустили не в том режиме, форма молча уйдёт в dry-run или в чужую таблицу.
"""

import argparse
import re
import sys
import zipfile
from pathlib import Path

# Уже сжатые форматы: deflate на них только тратит время и размер не уменьшает
STORED_SUFFIXES = {'.mp4', '.webm', '.jpg', '.jpeg', '.png', '.webp', '.woff2'}
SKIP_NAMES = {'.DS_Store', 'Thumbs.db'}

# Значения из --env, которые обязаны попасть в бандл
REQUIRED_KEYS = ('VITE_SHEETS_ENDPOINT', 'VITE_META_PIXEL_ID')
# Проверяются, только если заданы
OPTIONAL_KEYS = ('VITE_SHEETS_TOKEN', 'VITE_GA_MEASUREMENT_ID')


def parse_env(path: Path) -> dict[str, str]:
    """Минимальный разбор KEY=VALUE, как в .env-файлах Vite."""
    values: dict[str, str] = {}
    for raw in path.read_text(encoding='utf-8-sig').splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, _, value = line.partition('=')
        value = value.strip()
        if len(value) >= 2 and value[0] in '"\'' and value[-1] == value[0]:
            value = value[1:-1]
        else:
            value = re.split(r'\s+#', value, maxsplit=1)[0].strip()
        values[key.strip()] = value
    return values


def collect(src: Path, skip: Path) -> list[Path]:
    files = [
        p
        for p in src.rglob('*')
        if p.is_file() and p.name not in SKIP_NAMES and p.resolve() != skip
    ]
    return sorted(files, key=lambda p: p.relative_to(src).as_posix())


def pack(src: Path, target: Path, files: list[Path]) -> None:
    with zipfile.ZipFile(target, 'w') as zf:
        for path in files:
            method = (
                zipfile.ZIP_STORED
                if path.suffix.lower() in STORED_SUFFIXES
                else zipfile.ZIP_DEFLATED
            )
            # as_posix() — единственное место, где решается формат путей в архиве
            zf.write(path, path.relative_to(src).as_posix(), compress_type=method)


def check_html(zf: zipfile.ZipFile, names: set[str]) -> list[str]:
    errors: list[str] = []
    for name in sorted(n for n in names if n.endswith('.html')):
        html = zf.read(name).decode('utf-8')
        if re.search(r'<base[\s>]', html, re.I):
            errors.append(f'{name}: найден тег <base>, Keitaro его не допускает')
        for attr, target in re.findall(r'\b(src|href)=["\']([^"\']+)["\']', html):
            # Внешние ссылки, protocol-relative и якоря проверять нечем
            if re.match(r'^(?:[a-z][a-z0-9+.-]*:|//|#)', target, re.I):
                continue
            if target.startswith('/'):
                errors.append(f'{name}: абсолютный путь {attr}="{target}"')
            elif re.split(r'[?#]', target, maxsplit=1)[0] not in names:
                errors.append(f'{name}: {attr}="{target}" — такого файла нет в архиве')
    return errors


def check_bundle_paths(bundle: str, names: set[str]) -> list[str]:
    errors: list[str] = []
    absolute = set(re.findall(r'["\'`](/(?:images|videos)/[^"\'`\s]+)', bundle))
    for path in sorted(absolute):
        errors.append(
            f'в бандле абсолютный путь {path}: с диска и из вложенной папки он не откроется'
        )
    relative = set(re.findall(r'["\'`]((?:images|videos)/[^"\'`\s\\?#$]+)', bundle))
    for path in sorted(relative - names):
        errors.append(f'бандл ссылается на {path}, а такого файла нет в архиве')
    return errors


def check_env(bundle: str, env: dict[str, str]) -> list[str]:
    errors: list[str] = []
    for key in REQUIRED_KEYS:
        value = env.get(key, '')
        if not value:
            errors.append(f'{key} пуст в env-файле: форма или пиксель в архиве не заработают')
        else:
            # Пикселей может быть несколько через запятую — каждый должен быть в бандле
            for part in (p.strip() for p in value.split(',') if p.strip()):
                if part not in bundle:
                    errors.append(
                        f'{key}: значения {part[:12]}… из env-файла нет в бандле. '
                        'Сборка шла не в том режиме?'
                    )
    for key in OPTIONAL_KEYS:
        value = env.get(key, '')
        if value and value not in bundle:
            errors.append(f'{key}: значения из env-файла нет в бандле')
    return errors


def verify(archive: Path, env: dict[str, str] | None) -> list[str]:
    errors: list[str] = []
    with zipfile.ZipFile(archive) as zf:
        broken = zf.testzip()
        if broken:
            errors.append(f'файл повреждён (CRC): {broken}')

        names = set(zf.namelist())
        for name in sorted(names):
            if '\\' in name or name.startswith('/') or '..' in name.split('/'):
                errors.append(f'недопустимый путь в архиве: {name!r}')
        if 'index.html' not in names:
            errors.append('index.html лежит не в корне архива')

        scripts = sorted(n for n in names if n.startswith('assets/') and n.endswith('.js'))
        if not scripts:
            errors.append('в архиве нет assets/*.js')
        bundle = '\n'.join(zf.read(n).decode('utf-8', errors='replace') for n in scripts)

        errors += check_html(zf, names)
        errors += check_bundle_paths(bundle, names)
        if env is not None:
            errors += check_env(bundle, env)
    return errors


def main() -> int:
    # Иначе кириллица в выводе роняет скрипт при запуске из консоли с cp1252/cp866
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

    parser = argparse.ArgumentParser(description='Упаковка и проверка архива для Keitaro')
    parser.add_argument('src', type=Path, help='каталог сборки, например archive-site')
    parser.add_argument('out', type=Path, help='путь к zip')
    parser.add_argument(
        '--env',
        type=Path,
        help='env-файл, значения которого должны быть зашиты в бандл (например .env.site)',
    )
    args = parser.parse_args()

    src = args.src.resolve()
    out = args.out.resolve()
    if not src.is_dir():
        print(f'Каталог {args.src} не найден: сначала соберите архив (npm run build:archive:site)')
        return 1

    env = None
    if args.env:
        if not args.env.is_file():
            print(f'Env-файл {args.env} не найден')
            return 1
        env = parse_env(args.env)

    files = collect(src, out)
    # Пишем во временный файл: нераспознанный архив не должен занять место готового
    tmp = out.with_name(out.name + '.tmp')
    try:
        pack(src, tmp, files)
        errors = verify(tmp, env)
    except BaseException:
        tmp.unlink(missing_ok=True)
        raise

    if errors:
        tmp.unlink(missing_ok=True)
        print(f'Архив НЕ создан, проверка не пройдена ({len(errors)}):')
        for error in errors:
            print(f'  — {error}')
        return 1

    existed = out.exists()
    tmp.replace(out)

    with zipfile.ZipFile(out) as zf:
        entries = zf.infolist()
    print(f'{args.out}: {len(entries)} файлов, {out.stat().st_size / 1024 / 1024:.1f} МБ'
          + (' (существующий файл перезаписан)' if existed else ''))
    for info in entries:
        print(f'  {info.file_size / 1024:>10.1f} КБ  {info.filename}')
    if env is not None:
        print('Проверено: пути, HTML, ссылки на images/ и videos/, '
              + ', '.join(k for k in REQUIRED_KEYS + OPTIONAL_KEYS if env.get(k))
              + ' — в бандле')
    else:
        print('Проверено: пути, HTML, ссылки на images/ и videos/. Env не проверялся (нет --env)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
