import { trackedQueryParams, type TrackedQueryParam } from '@/config/site';

export type UtmParams = Record<TrackedQueryParam, string>;

/** Пустой набор UTM — отсутствующие параметры пишутся как пустая строка. */
export function emptyUtm(): UtmParams {
  return trackedQueryParams.reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {} as UtmParams);
}

/** Читает UTM-метки из строки запроса. */
export function readUtm(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const result = emptyUtm();
  for (const key of trackedQueryParams) {
    result[key] = params.get(key) ?? '';
  }
  return result;
}

/**
 * Добавляет текущую строку запроса к пути.
 * Используется, чтобы CTA на preland не терял UTM при переходе на landing.
 */
export function withQuery(path: string, search: string): string {
  const query = search.startsWith('?') ? search.slice(1) : search;
  return query ? `${path}?${query}` : path;
}

/** Технические поля, которые тоже уходят в таблицу. */
export function readContext() {
  if (typeof window === 'undefined') {
    return { pageUrl: '', referrer: '', userAgent: '' };
  }
  return {
    pageUrl: window.location.href,
    referrer: document.referrer || '',
    userAgent: navigator.userAgent || '',
  };
}
