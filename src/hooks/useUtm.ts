import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { readUtm, withQuery, type UtmParams } from '@/lib/tracking';

/** UTM-метки текущего URL. */
export function useUtm(): UtmParams {
  const { search } = useLocation();
  return useMemo(() => readUtm(search), [search]);
}

/**
 * Функция, добавляющая текущий query string к внутренней ссылке.
 * Нужна, чтобы UTM переживали переход preland → landing.
 */
export function useLinkWithQuery(): (path: string) => string {
  const { search } = useLocation();
  return useMemo(() => (path: string) => withQuery(path, search), [search]);
}
