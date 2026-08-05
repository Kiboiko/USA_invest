/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL Google Apps Script Web App (…/exec), куда уходит лид-форма */
  readonly VITE_SHEETS_ENDPOINT?: string;
  /** Общий секрет, который проверяет Apps Script (необязательно) */
  readonly VITE_SHEETS_TOKEN?: string;
  /** Google Analytics 4 Measurement ID, например G-XXXXXXX. Пусто = не подключать */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** Meta (Facebook) Pixel ID. Пусто = не подключать */
  readonly VITE_META_PIXEL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
