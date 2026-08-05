/**
 * Глобальные настройки проекта.
 * Здесь меняются названия брендов, маршруты, endpoint формы и аналитика.
 * Тексты страниц лежат отдельно: src/data/preland.ts и src/data/landing.ts
 */

export const routes = {
  preland: '/preland',
  landing: '/landing',
} as const;

/** Бренд новостного портала (preland). Нейтральный, не связан с реальным СМИ. */
export const prelandBrand = {
  name: 'BBC',
  shortName: 'BBC',
  tagline: 'NEWS',
  /** Инициалы в квадратике логотипа */
  monogram: 'BBC',
} as const;

/** Бренд финансового сервиса (landing). */
export const landingBrand = {
  name: 'Finvoryx Capital',
  shortName: 'Finvoryx',
  monogram: 'F',
  supportEmail: 'support@finvoryx.example',
} as const;

/** Настройки отправки формы в Google Sheets. */
export const formConfig = {
  /** URL Apps Script Web App (…/exec). Задаётся через .env → VITE_SHEETS_ENDPOINT */
  endpoint: import.meta.env.VITE_SHEETS_ENDPOINT ?? '',
  /** Общий секрет, должен совпадать с SHARED_TOKEN в apps-script/Code.gs */
  token: import.meta.env.VITE_SHEETS_TOKEN ?? '',
  /** Таймаут запроса, мс */
  timeoutMs: 15000,
  /**
   * Если браузер заблокировал ответ Apps Script (CORS), повторить отправку
   * в режиме no-cors. Данные дойдут до таблицы, но прочитать ответ нельзя,
   * поэтому результат считается успешным. Подробности — в DOCUMENTATION.md.
   */
  allowNoCorsFallback: true,
} as const;

/** Аналитика. Пустой ID = скрипт не подключается. */
export const analyticsConfig = {
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID ?? '',
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID ?? '',
} as const;

/** Список UTM-параметров, которые читаются из URL и уезжают в таблицу. */
export const trackedQueryParams = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export type TrackedQueryParam = (typeof trackedQueryParams)[number];
