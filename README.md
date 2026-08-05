# USA Invest — preland + landing funnel

Двухстраничная воронка: новостной **preland** → fintech-**landing** → лид-форма → **Google Sheets**.

```
/          → редирект на /preland (query-параметры сохраняются)
/preland   → новостная статья с CTA
/landing   → лендинг сервиса + форма
```

## Стек

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · lucide-react · fetch → Google Apps Script.
Без backend, без БД, без Redux.

## Быстрый старт

```bash
npm install
cp .env.example .env    # необязательно: без .env форма работает в режиме dry-run
npm run dev             # http://localhost:5173/preland
```

Прочие команды:

```bash
npm run build       # tsc -b && vite build
npm run preview     # предпросмотр сборки
npm run typecheck   # только проверка типов
```

## Где что менять

| Что | Файл |
| --- | --- |
| Названия брендов, маршруты, endpoint, аналитика | [src/config/site.ts](src/config/site.ts) |
| Весь текст preland (статья, комментарии, sidebar, футер) | [src/data/preland.ts](src/data/preland.ts) |
| Весь текст landing (hero, форма, FAQ, отзывы, футер) | [src/data/landing.ts](src/data/landing.ts) |
| Список стран и телефонных кодов | [src/data/countries.ts](src/data/countries.ts) |
| Цвета и шрифты (CSS-переменные) | [src/styles/index.css](src/styles/index.css) |
| Изображения | [public/images/](public/images/) |
| Приём формы в Google Sheets | [apps-script/Code.gs](apps-script/Code.gs) |

Подробное описание архитектуры, настройки Google Sheets, чек-листы проверки и
ограничения — в [DOCUMENTATION.md](DOCUMENTATION.md).

## Контентные ограничения (важно)

Проект намеренно **не содержит**:

- брендинга реальных СМИ и утверждений, что статья опубликована реальным изданием;
- реальных публичных людей в роли представителей компании;
- обещаний доходности («X% в день») и гарантий прибыли;
- выдуманных отзывов о заработке — тексты отзывов помечены как placeholder.

Все числа условий (например, «from $250») вынесены в `src/data/landing.ts` и меняются
без правки компонентов.
