import { formConfig } from '@/config/site';
import type { LeadFormValues } from '@/lib/validation';
import { emptyUtm, readContext, type UtmParams } from '@/lib/tracking';

/** Полезная нагрузка, которая уходит в Apps Script и попадает в строку таблицы. */
export interface LeadPayload extends UtmParams {
  token: string;
  submittedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  countryCode: string;
  phone: string;
  experience: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
}

export type SubmitResult =
  | { ok: true; mode: 'json' | 'no-cors' | 'dry-run' }
  | { ok: false; reason: 'network' | 'server' | 'config'; message?: string };

export function buildPayload(values: LeadFormValues, utm: UtmParams): LeadPayload {
  const context = readContext();

  return {
    ...emptyUtm(),
    ...utm,
    token: formConfig.token,
    submittedAt: new Date().toISOString(),
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    country: 'United States',
    countryCode: 'US',
    phone: values.phone.trim(),
    experience: values.experience,
    ...context,
  };
}

/**
 * Отправка лида в Google Apps Script Web App.
 *
 * Тонкость: Content-Type намеренно `text/plain`. Так браузер считает запрос
 * «простым» и не шлёт preflight OPTIONS, который Apps Script не обрабатывает.
 * На стороне Apps Script тело парсится как JSON (см. apps-script/Code.gs).
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  if (!formConfig.endpoint) {
    // Endpoint не настроен — не роняем страницу, а сообщаем об этом в консоль.
    // eslint-disable-next-line no-console
    console.warn(
      '[lead-form] VITE_SHEETS_ENDPOINT не задан. Данные формы не отправлены:',
      payload,
    );
    return { ok: true, mode: 'dry-run' };
  }

  const body = JSON.stringify(payload);
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), formConfig.timeoutMs);

  try {
    const response = await fetch(formConfig.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, reason: 'server', message: `HTTP ${response.status}` };
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text) as { result?: string; error?: string };
      if (data.result === 'success') return { ok: true, mode: 'json' };
      return { ok: false, reason: 'server', message: data.error ?? text.slice(0, 200) };
    } catch {
      // Apps Script вернул не-JSON (например, HTML-страницу ошибки авторизации)
      return { ok: false, reason: 'server', message: 'Unexpected response from endpoint' };
    }
  } catch (error) {
    // Сюда попадаем при обрыве сети, таймауте и блокировке CORS.
    if (formConfig.allowNoCorsFallback && !controller.signal.aborted) {
      const delivered = await sendNoCors(formConfig.endpoint, body);
      if (delivered) return { ok: true, mode: 'no-cors' };
    }
    return {
      ok: false,
      reason: 'network',
      message: error instanceof Error ? error.message : 'Network error',
    };
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Резервный путь: запрос уходит в режиме no-cors, ответ прочитать нельзя.
 * Возвращает true, если запрос ушёл без исключения.
 */
async function sendNoCors(endpoint: string, body: string): Promise<boolean> {
  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
    });
    return true;
  } catch {
    return false;
  }
}
