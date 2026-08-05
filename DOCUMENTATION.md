# Документация проекта

Двухстраничная воронка: **preland** (новостная подводка) → **landing** (сайт финансового
сервиса) → **лид-форма** → **Google Sheets**.

---

## 1. Содержание

1. [Архитектура и структура файлов](#2-архитектура-и-структура-файлов)
2. [Маршруты и сохранение UTM](#3-маршруты-и-сохранение-utm)
3. [Контентный слой: где менять тексты](#4-контентный-слой-где-менять-тексты)
4. [Дизайн-система: цвета, шрифты, брейкпоинты](#5-дизайн-система)
5. [PRELAND — состав страницы](#6-preland)
6. [LANDING — состав страницы](#7-landing)
7. [Форма: поля, валидация, состояния](#8-форма)
8. [Google Sheets: полная настройка](#9-google-sheets-настройка-с-нуля)
9. [Отправка данных и почему `text/plain`](#10-отправка-данных-и-cors)
10. [UTM и технические поля](#11-utm-и-технические-поля)
11. [Аналитика](#12-аналитика)
12. [SEO и Open Graph](#13-seo-и-open-graph)
13. [Доступность](#14-доступность)
14. [Изображения и производительность](#15-изображения-и-производительность)
15. [Сборка и деплой](#16-сборка-и-деплой)
16. [Чек-лист проверки](#17-чек-лист-проверки)
17. [Юридические и контентные ограничения](#18-контентные-ограничения)
18. [Частые задачи (рецепты)](#19-частые-задачи)

---

## 2. Архитектура и структура файлов

```
.
├── apps-script/
│   └── Code.gs                 # Web App: приём POST → appendRow в Google Sheet
├── public/
│   ├── favicon.svg
│   ├── _redirects              # SPA-fallback для Netlify
│   └── images/                 # плейсхолдеры (SVG), заменяются на материалы клиента
├── src/
│   ├── config/site.ts          # бренды, маршруты, endpoint, аналитика, список UTM
│   ├── data/
│   │   ├── preland.ts          # весь контент preland
│   │   ├── landing.ts          # весь контент landing + подписи формы
│   │   └── countries.ts        # страны и телефонные коды
│   ├── hooks/
│   │   ├── useSeo.ts           # title/description/OG/canonical на страницу
│   │   └── useUtm.ts           # чтение UTM + ссылки с сохранением query
│   ├── lib/
│   │   ├── cn.ts               # склейка классов
│   │   ├── tracking.ts         # UTM, referrer, user agent
│   │   ├── validation.ts       # правила валидации формы
│   │   ├── submitLead.ts       # fetch в Apps Script + fallback
│   │   └── scrollToForm.ts     # прокрутка к форме от CTA
│   ├── components/
│   │   ├── common/             # Analytics, ScrollToTop, Icon
│   │   ├── preland/            # Header, ArticleHead, ArticleBody, CTA, Comments,
│   │   │                       # Sidebar, RelatedArticles, Footer
│   │   └── landing/            # Header, Hero, LeadForm, HighlightBand, About,
│   │                           # HowItWorks, Priorities, Testimonials, Faq,
│   │                           # FinalCta, Footer, Panel
│   ├── pages/                  # PrelandPage, LandingPage, NotFoundPage
│   ├── styles/index.css        # Tailwind v4 + дизайн-токены (@theme)
│   ├── App.tsx                 # маршруты
│   └── main.tsx                # точка входа
├── .env.example
├── vercel.json                 # SPA-fallback для Vercel
└── DOCUMENTATION.md
```

**Главный принцип:** компоненты не содержат текста. Любая строка, картинка или число,
которое может поменяться, лежит в `src/data/*` или `src/config/site.ts`.

---

## 3. Маршруты и сохранение UTM

Маршруты объявлены в `src/config/site.ts` → `routes` и используются в `App.tsx`:

| URL | Что происходит |
| --- | --- |
| `/` | `<Navigate>` на `/preland` **вместе с query string** |
| `/preland` | новостная страница |
| `/landing` | лендинг |
| любой другой | страница 404 со ссылкой на preland |

Все CTA на preland (`ArticleCta`, `Sidebar`) строят ссылку через хук
`useLinkWithQuery()` → `withQuery(path, search)`:

```
/preland?utm_source=fb&utm_campaign=test
      ↓ клик по CTA
/landing?utm_source=fb&utm_campaign=test
```

Так UTM доживают до формы и попадают в таблицу.

---

## 4. Контентный слой: где менять тексты

| Нужно поменять | Файл | Ключ |
| --- | --- | --- |
| Название новостного бренда | `src/config/site.ts` | `prelandBrand` |
| Название финансового бренда | `src/config/site.ts` | `landingBrand` |
| Заголовок, лид, автор, дата статьи | `src/data/preland.ts` | `article` |
| Тело статьи (абзацы, подзаголовки, цитаты, CTA) | `src/data/preland.ts` | `articleBody` |
| Комментарии | `src/data/preland.ts` | `commentsSection.items` |
| Most read / карточки / промо | `src/data/preland.ts` | `mostRead`, `relatedArticles`, `sidebarPromo` |
| Дисклеймеры preland | `src/data/preland.ts` | `articleDisclaimer`, `prelandFooter.disclaimer` |
| Hero landing | `src/data/landing.ts` | `hero` |
| Сумма входа / светлая плашка | `src/data/landing.ts` | `hero.accessNote`, `highlightBand` |
| About | `src/data/landing.ts` | `about` |
| Шаги, приоритеты, отзывы, FAQ | `src/data/landing.ts` | `howItWorks`, `priorities`, `testimonials`, `faq` |
| Подписи и ошибки формы | `src/data/landing.ts` | `formContent` |
| Дисклеймеры landing | `src/data/landing.ts` | `landingFooter.disclaimer`, `finalCta.note` |

### Блоки статьи

`articleBody` — массив блоков с полем `type`:

| `type` | Поля | Результат |
| --- | --- | --- |
| `paragraph` | `text` | абзац serif-шрифтом |
| `heading` | `text` | подзаголовок `<h2>` |
| `quote` | `text`, `attribution` | цитата с красной линией слева |
| `list` | `items[]` | маркированный список |
| `keyPoints` | `title`, `items[]` | серая плашка «Key points» |
| `cta` | `cta.{title,text,button}` | CTA-блок со ссылкой на landing |

Порядок блоков в массиве = порядок на странице. Чтобы добавить ещё один CTA,
достаточно вставить новый объект `{ type: 'cta', cta: {...} }` в нужное место.

### Иконки

В `data/landing.ts` иконка задаётся строкой (`'shieldCheck'`, `'headset'`…).
Маппинг строк на компоненты lucide — в `src/components/common/Icon.tsx`.
Чтобы добавить новую иконку: импортировать её там и добавить в объект `icons`
плюс в тип `IconName` в `data/landing.ts`.

---

## 5. Дизайн-система

Все токены — CSS-переменные в `src/styles/index.css` (блок `@theme` Tailwind v4).
Меняете переменную — меняется весь проект.

### Landing (тёмная тема)

| Переменная | Значение | Где используется |
| --- | --- | --- |
| `--color-ink-900` | `#060d16` | фон страницы, футер |
| `--color-ink-800` | `#0a1220` | фон hero |
| `--color-ink-700` | `#0d1a2b` | фон секций-карточек |
| `--color-ink-600` | `#101f33` | вложенные карточки, поля формы |
| `--color-ink-500` | `#16283f` | границы, разделители |
| `--color-accent-500` | `#4ade5a` | основной зелёный акцент |
| `--color-accent-400/600/700` | оттенки | hover, градиенты, текст на белом |
| `--color-fg` | `#ffffff` | основной текст |
| `--color-fg-muted` | `#9fb3c8` | вторичный текст |

### Preland (светлая тема)

| Переменная | Значение |
| --- | --- |
| `--color-paper` | `#ffffff` |
| `--color-paper-alt` | `#f4f4f4` |
| `--color-news-ink` | `#141414` |
| `--color-news-muted` | `#5a5a5a` |
| `--color-news-line` | `#e4e4e4` |
| `--color-news-accent` | `#b8121a` |

### Типографика

- `--font-sans` → **Inter** (интерфейс, landing);
- `--font-serif` → **Source Serif 4** (заголовки и тело статьи на preland);
- оба грузятся с Google Fonts в `index.html` с `display=swap`, fallback — системные шрифты.

Размеры заголовков: h1 landing `32px` на мобильном → `54px` на desktop;
h1 preland `28px` → `46px`. На мобильном намеренно нет «огромных» заголовков.

### Брейкпоинты (стандартные Tailwind)

`sm 640px` · `md 768px` · `lg 1024px` · `xl 1280px`.
Ширина контента: preland `max-w-[1200px]`, landing `max-w-[1240px]` c внутренними `1200px`.

---

## 6. PRELAND

Порядок блоков (`src/pages/PrelandPage.tsx`):

1. **Header** (`PrelandHeader.tsx`) — служебная полоса с датой, логотип-монограмма,
   главная навигация с активной рубрикой, полоса подрубрик.
   На мобильном: бургер → выезжающий drawer слева, `Esc` и клик по подложке закрывают,
   прокрутка body блокируется.
2. **ArticleHead** — рубрика, `<h1>`, лид, автор + время чтения, кнопки шеринга,
   дата публикации, hero-изображение с подписью.
3. **ArticleBody** — блоки из `articleBody`, включая 2 CTA внутри текста + дисклеймер.
4. **Финальный CTA** — тёмный блок с зелёной кнопкой (`variant="final"`).
5. **Comments** — статические комментарии с явной пометкой, что блок иллюстративный.
6. **RelatedArticles** — 3 карточки материалов.
7. **Sidebar** — Most read, промо-блок с CTA, форма подписки (демо, без backend).
   На desktop — правая колонка `320px`, `position: sticky`; на мобильном уезжает под статью.
8. **Footer** — колонки ссылок + дисклеймер о том, что издание независимое и не
   аффилировано ни с одним вещателем/газетой/агентством.

Всего CTA на preland: **4** (два в тексте, финальный, в сайдбаре). Все ведут на
`/landing` с сохранением query и шлют событие `preland_cta_click` с меткой `placement`.

---

## 7. LANDING

Порядок секций (`src/pages/LandingPage.tsx`):

| # | Секция | Компонент | Заметки |
| --- | --- | --- | --- |
| 1 | Header | `LandingHeader` | логотип, якорная навигация, бейдж «Secure & Encrypted», кнопка CTA; на мобильном — раскрывающееся меню |
| 2 | Hero | `Hero` | заголовок с зелёной второй частью, 4 круглые иконки-фичи, плашка «Initial access…», форма |
| 3 | Светлая плашка | `HighlightBand` | сумма входа + вторая строка + строка риска |
| 4 | About | `About` | изображение слева, текст справа |
| 5 | How It Works | `HowItWorks` | 3 карточки с номерами; на desktop в ряд со стрелками, на мобильном — колонкой |
| 6 | Our Priorities | `Priorities` | 4 колонки с SVG-иконками и разделителями |
| 7 | Testimonials | `Testimonials` | 3 белые карточки, звёзды, страна; тексты — placeholder |
| 8 | FAQ | `Faq` | аккордеон слева, карточка «Have more questions?» справа |
| 9 | Final CTA | `FinalCta` | кнопка прокручивает к форме |
| 10 | Footer | `LandingFooter` | колонки ссылок, контакт, risk warning |

**Порядок в hero.** Форма отрисована один раз. Раскладка задана CSS-гридом:
на desktop форма — правая колонка (`lg:col-start-2 lg:row-span-2`), слева заголовок
и блок с фичами; на мобильном порядок DOM даёт: заголовок → иллюстрация → форма →
фичи → плашка входа.

---

## 8. Форма

### Поля

| Поле | Тип | Валидация |
| --- | --- | --- |
| First Name | text | обязательно, ≥ 2 символов |
| Last Name | text | обязательно, ≥ 2 символов |
| Email | email | обязательно, формат `x@y.zz` |
| Country | select | обязательно, список из `data/countries.ts` |
| Phone | tel | обязательно, 7–15 цифр (мягкая проверка) |
| Investment Experience | radio Yes/No | обязательно |

Телефонный код (`+1`, `+44`…) подставляется автоматически из выбранной страны и
отображается слева от поля. Он не редактируется вручную и в таблицу уходит отдельной
колонкой `Country Code` вместе с полным названием страны.

Правила валидации — `src/lib/validation.ts`, тексты ошибок — `formContent.errors`
в `src/data/landing.ts`.

### Поведение

- Валидация запускается на submit; фокус ставится на первое поле с ошибкой.
- Ошибка поля исчезает, как только пользователь начал его править.
- Во время запроса кнопка `disabled`, текст меняется на `formContent.submitting`,
  повторный submit игнорируется (`status === 'submitting'` → ранний выход).
- Страница **не перезагружается** (`event.preventDefault()`).
- При ошибке показывается сообщение с `role="alert"`, кнопка снова активна,
  введённые данные сохраняются.
- При успехе форма заменяется блоком благодарности с `role="status"` и кнопкой
  «Submit another request» (сброс к пустой форме).

### Состояния

```
idle ──submit──► submitting ──ok──► success
                      │
                      └──fail──► error ──(правки/повтор)──► submitting
```

---

## 9. Google Sheets: настройка с нуля

1. **Создайте таблицу** в Google Sheets. Имя листа не важно — скрипт сам создаст
   лист `Leads` с заголовками при первом запросе.
2. В таблице: **Extensions → Apps Script**.
3. Удалите содержимое `Code.gs` и вставьте файл [`apps-script/Code.gs`](apps-script/Code.gs).
4. При необходимости заполните `CONFIG`:
   - `SPREADSHEET_ID` — можно оставить пустым, если скрипт открыт из самой таблицы;
   - `SHEET_NAME` — имя листа (по умолчанию `Leads`);
   - `SHARED_TOKEN` — произвольная строка-секрет (рекомендуется);
   - `NOTIFY_EMAIL` — почта для уведомлений о новых лидах (необязательно).
5. **Deploy → New deployment → тип Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Deploy → выдать разрешения аккаунта.
6. Скопируйте URL вида `https://script.google.com/macros/s/XXXX/exec`.
7. В корне проекта создайте `.env`:

   ```env
   VITE_SHEETS_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
   VITE_SHEETS_TOKEN=тот_же_секрет_что_и_SHARED_TOKEN
   ```

8. Перезапустите `npm run dev` (Vite читает `.env` при старте).

**Проверка деплоя:** откройте URL `/exec` в браузере — должен вернуться
`{"result":"success","message":"Lead endpoint is running"}`.

> После любой правки `Code.gs` нужно сделать **Deploy → Manage deployments →
> Edit → New version → Deploy**, иначе изменения не применятся.

### Колонки листа

| # | Колонка | Источник |
| --- | --- | --- |
| 1 | Timestamp | `submittedAt` (ISO, момент отправки) |
| 2 | First Name | форма |
| 3 | Last Name | форма |
| 4 | Email | форма |
| 5 | Country | название страны |
| 6 | Country Code | ISO-код (`US`, `DE`…) |
| 7 | Phone | форма (пишется как текст, чтобы не терять `+`) |
| 8 | Investment Experience | `yes` / `no` |
| 9–13 | utm_source, utm_medium, utm_campaign, utm_term, utm_content | URL |
| 14 | Page URL | `window.location.href` |
| 15 | Referrer | `document.referrer` |
| 16 | User Agent | `navigator.userAgent` |

Отсутствующие параметры записываются пустой строкой (не `undefined`).

Пример строки:

```
2026-02-18T10:04:11Z | John | Smith | john@example.com | United States | US |
+1 555 010 2030 | yes | facebook | cpc | spring_launch |  |  |
https://site.com/landing?utm_source=facebook | https://facebook.com/ | Mozilla/5.0 …
```

### Безопасность

- Google-креденшелы на фронтенде **не хранятся** — фронт знает только публичный URL
  Web App. Запись в таблицу выполняет сам Apps Script от имени владельца.
- `SHARED_TOKEN` отсекает случайный мусор, но виден в бандле — это не защита от
  целенаправленного спама. При необходимости добавьте на стороне Apps Script
  проверку `e.parameter`/капчу или лимит по IP через внешний сервис.

---

## 10. Отправка данных и CORS

Файл `src/lib/submitLead.ts`.

Запрос уходит с `Content-Type: text/plain;charset=utf-8`, хотя тело — JSON.
Причина: с `application/json` браузер шлёт preflight-запрос `OPTIONS`, который
Apps Script не обрабатывает, и отправка падает. С `text/plain` запрос считается
«простым», preflight не нужен, а `Code.gs` всё равно парсит тело как JSON.

Алгоритм:

1. Если `VITE_SHEETS_ENDPOINT` пуст → **dry-run**: данные пишутся в консоль
   (`console.warn`), форма показывает успех. Так можно верстать без настроенной таблицы.
2. Обычный `fetch` с таймаутом 15 с (`AbortController`).
3. Ответ парсится как JSON, ожидается `{"result":"success"}`.
4. Если запрос упал на уровне сети/CORS и `allowNoCorsFallback: true` — повтор в
   режиме `mode: 'no-cors'`. Ответ прочитать нельзя, поэтому результат считается
   успешным (данные при этом в таблицу доходят).
5. Иначе — состояние ошибки в UI.

Настройки таймаута и fallback — `formConfig` в `src/config/site.ts`.
Если вам важно никогда не показывать успех без подтверждения от сервера,
поставьте `allowNoCorsFallback: false`.

---

## 11. UTM и технические поля

Читаются из URL: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
(список — `trackedQueryParams` в `src/config/site.ts`; чтобы добавить свой параметр,
допишите его туда и добавьте колонку в `HEADERS` и `appendRow` в `Code.gs`).

Дополнительно собираются: `Page URL`, `Referrer`, `User Agent`, `submittedAt`.

UTM переживают переход preland → landing, потому что ссылки строятся через
`withQuery()` (см. раздел 3).

---

## 12. Аналитика

`src/components/common/Analytics.tsx` подключает GA4 и Meta Pixel **только** если
заданы ID:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXX
VITE_META_PIXEL_ID=123456789
```

Пустое значение → ни одного внешнего скрипта на странице (важно для скорости и
для соответствия требованиям о cookie-баннерах).

Отправляемые события (`trackEvent`):

| Событие | Когда | Параметры |
| --- | --- | --- |
| `preland_cta_click` | клик по любому CTA на preland | `placement` |
| `landing_cta_click` | клик по CTA в шапке / финальном блоке | `placement` |
| `lead_form_submit` | форма прошла валидацию и отправляется | — |
| `lead_form_success` | успешная отправка | `mode` (`json`/`no-cors`/`dry-run`) |
| `lead_form_error` | ошибка отправки | `reason` |

---

## 13. SEO и Open Graph

Базовые метатеги — в `index.html`; на каждой странице их перезаписывает хук
`useSeo()` из `src/hooks/useSeo.ts` (title, description, og:title, og:description,
og:image, og:url, twitter:card, canonical).

Значения — `prelandSeo` в `data/preland.ts` и `landingSeo` в `data/landing.ts`.

Favicon: `public/favicon.svg`.

> **OG-картинки** сейчас SVG (`public/images/og-*.svg`). Большинство соцсетей
> не рендерят SVG в превью — перед запуском замените их на **JPG/PNG 1200×630**
> и обновите пути в `prelandSeo.ogImage` / `landingSeo.ogImage`.

---

## 14. Доступность

- Семантическая разметка: `header`, `nav`, `main`, `article`, `aside`, `section`,
  `figure/figcaption`, `ol/ul`, корректная иерархия заголовков.
- У каждого поля формы есть `<label>` (визуально скрытый через `sr-only`, т.к. по
  макету используются placeholder'ы). Ошибки связаны через `aria-describedby`,
  невалидные поля помечены `aria-invalid`.
- Радиокнопки Yes/No — настоящие `<input type="radio">` в `<fieldset>` с `<legend>`,
  работают со стрелками клавиатуры.
- FAQ: `<button>` + `aria-expanded` + `aria-controls`, панель — `role="region"`
  с `aria-labelledby`.
- Все интерактивные элементы — `button`/`a`, не `div`.
- Видимый focus-state (`:focus-visible` с зелёным контуром) — в `index.css`.
- Ссылки «Skip to content» / «Skip to the form» в начале каждой страницы.
- Все изображения имеют `alt`; декоративные — `alt=""` + `aria-hidden`.
- Успех/ошибка формы озвучиваются: `role="status"` и `role="alert"`.
- Уважается `prefers-reduced-motion` — анимации отключаются.
- Модальное мобильное меню preland: `role="dialog"`, `aria-modal`, закрытие по `Esc`.

---

## 15. Изображения и производительность

- Все изображения — собственные **SVG-плейсхолдеры** в `public/images/`,
  ничего не скопировано из референсов. Имена говорящие:
  `article-hero.svg`, `related-1..3.svg`, `platform-preview.svg`,
  `about-portrait.svg`, `og-preland.svg`, `og-landing.svg`.
- Замена: положите свой файл с тем же именем (или поменяйте путь в `data/*.ts`).
  Рекомендуемые размеры — hero статьи `1200×675`, карточки `640×360`,
  портрет `600×600`, OG `1200×630`.
- `loading="lazy"` + `decoding="async"` у всего, что ниже первого экрана;
  hero-изображения грузятся с `loading="eager"`.
- У `img` проставлены `width`/`height` — нет сдвига layout при загрузке.
- Зависимостей минимум: React, react-router-dom, lucide-react (tree-shakeable иконки).
  Никаких UI-китов, анимационных библиотек и Redux.
- Анимации только на CSS (аккордеон через `grid-template-rows`, transition цветов).

---

## 16. Сборка и деплой

```bash
npm run build     # tsc -b && vite build → dist/
npm run preview   # локальная проверка собранного билда
```

Деплой — любая статика. Единственное требование: **SPA-fallback**, иначе прямой
заход на `/landing` вернёт 404.

- Netlify — файл `public/_redirects` уже в проекте.
- Vercel — `vercel.json` с rewrite уже в проекте.
- Nginx:

  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

- GitHub Pages не поддерживает rewrite: используйте `HashRouter` в `src/main.tsx`
  или другой хостинг.

Переменные окружения (`VITE_*`) читаются на этапе сборки — задайте их в настройках
хостинга и пересоберите проект после изменения.

---

## 17. Чек-лист проверки

**Функциональность**

- [ ] `/` редиректит на `/preland`, query-параметры сохраняются
- [ ] все 4 CTA preland ведут на `/landing` и переносят UTM
- [ ] CTA в шапке и финальный CTA landing прокручивают к форме и фокусируют первое поле
- [ ] FAQ открывается/закрывается, можно держать открытыми несколько пунктов
- [ ] мобильные меню открываются/закрываются, `Esc` работает

**Форма**

- [ ] пустая отправка показывает ошибки под всеми обязательными полями
- [ ] `a@b` не проходит как email, `123` не проходит как телефон
- [ ] выбор страны подставляет телефонный код
- [ ] во время отправки кнопка неактивна, второй клик ничего не делает
- [ ] успех → блок благодарности; ошибка → сообщение и активная кнопка
- [ ] строка появилась в Google Sheet со всеми UTM

**Адаптив** — проверить 360 / 390 / 768 / 1024 / 1440 px:

- [ ] нет горизонтального скролла
- [ ] форма читаема, поля не выходят за экран
- [ ] sidebar preland уходит под статью
- [ ] карточки How It Works выстраиваются вертикально
- [ ] заголовки не «съедают» экран

**Технически**

- [ ] `npm run build` без ошибок
- [ ] нет ошибок в консоли браузера
- [ ] favicon и метатеги подставляются на обеих страницах

---

## 18. Контентные ограничения

Проект сознательно **не** повторяет исходные референсы там, где они содержали
рискованные утверждения:

| В референсе | В проекте | Почему |
| --- | --- | --- |
| Warren Buffett как представитель компании | нейтральный placeholder-портрет и текст от лица компании | нельзя использовать реального человека как представителя без прав и согласия |
| «Stable 2% daily capital growth» | «Guided setup with a dedicated specialist» + строка о риске | обещание доходности недопустимо и во многих юрисдикциях незаконно |
| Брендинг реального новостного вещателя | собственный бренд `Meridian Business Review` + дисклеймер о независимости | нельзя выдавать страницу за реальное СМИ |
| Отзывы с историями заработка | placeholder-тексты с явной пометкой «заменить» | нельзя публиковать выдуманные отзывы |

Если клиент предоставит собственные легальные тексты, портрет с правами и
проверенные отзывы — всё это меняется только в `src/data/*.ts`, без правки кода.

Сумма входа и любые числовые условия конфигурируемы:
`hero.accessNote`, `highlightBand`, `faq.items[0]` в `src/data/landing.ts`.

---

## 19. Частые задачи

**Поменять название бренда.**
`src/config/site.ts` → `landingBrand.name` / `prelandBrand.name`. Логотип-монограмма
берётся из `monogram`.

**Поменять акцентный цвет.**
`src/styles/index.css` → `--color-accent-500` (и при желании `400/600/700`).

**Добавить ещё один CTA в статью.**
`src/data/preland.ts` → вставить `{ type: 'cta', cta: { title, text, button } }`
в нужное место массива `articleBody`.

**Добавить поле в форму.**
1. `LeadFormValues` в `src/lib/validation.ts` + правило валидации;
2. подпись в `formContent.fields` (`src/data/landing.ts`);
3. поле в `LeadForm.tsx`;
4. поле в `buildPayload()` (`src/lib/submitLead.ts`);
5. колонка в `HEADERS` и `appendRow` в `apps-script/Code.gs` + **новый деплой**.

**Добавить страну.** `src/data/countries.ts`.

**Отключить fallback no-cors.** `formConfig.allowNoCorsFallback = false`
в `src/config/site.ts`.

**Подключить аналитику.** Заполнить `VITE_GA_MEASUREMENT_ID` / `VITE_META_PIXEL_ID`
в `.env` и пересобрать.
